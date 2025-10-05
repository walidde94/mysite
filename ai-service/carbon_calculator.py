"""
Carbon Footprint Calculator
Estimates carbon emissions based on lifestyle data using emission factors.
"""

import numpy as np
from typing import Dict, List


class CarbonCalculator:
    """Calculate carbon footprint from lifestyle data."""
    
    def __init__(self):
        # Emission factors (kg CO2 per unit)
        self.transport_emissions = {
            'car': 0.192,  # kg CO2 per km
            'public_transport': 0.089,
            'bicycle': 0.0,
            'walking': 0.0,
            'motorcycle': 0.113,
            'electric_car': 0.053
        }
        
        self.diet_emissions = {
            'vegan': 2.89,  # kg CO2 per day
            'vegetarian': 3.81,
            'pescatarian': 4.67,
            'omnivore': 7.19,
            'high_meat': 10.24
        }
        
        # Electricity: kg CO2 per kWh (varies by region, using EU average)
        self.electricity_factor = 0.295
        # Natural gas: kg CO2 per kWh
        self.gas_factor = 0.185
        
        # Shopping emissions factors
        self.clothing_factor = 15.0  # kg CO2 per item
        self.electronics_factor = 100.0  # kg CO2 per item
    
    def calculate(self, transportation: Dict, energy: Dict, diet: str, shopping: Dict) -> Dict:
        """
        Calculate total daily carbon footprint and breakdown.
        
        Args:
            transportation: Dict with primaryMode and distancePerDay
            energy: Dict with electricityUsage, gasUsage, renewableEnergy
            diet: String indicating diet type
            shopping: Dict with shopping habits
        
        Returns:
            Dict with daily total and breakdown by category
        """
        breakdown = {}
        
        # Transportation emissions
        transport_mode = transportation.get('primaryMode', 'car')
        distance = transportation.get('distancePerDay', 0)
        transport_emission_factor = self.transport_emissions.get(transport_mode, 0.192)
        breakdown['transportation'] = distance * transport_emission_factor
        
        # Energy emissions
        electricity = energy.get('electricityUsage', 0)  # kWh per day
        gas = energy.get('gasUsage', 0)  # kWh per day
        renewable = energy.get('renewableEnergy', False)
        
        # Apply renewable energy discount (70% reduction if using renewable)
        renewable_factor = 0.3 if renewable else 1.0
        breakdown['energy'] = (
            electricity * self.electricity_factor * renewable_factor +
            gas * self.gas_factor
        )
        
        # Diet emissions
        breakdown['diet'] = self.diet_emissions.get(diet, 7.19)
        
        # Shopping emissions (converted to daily average)
        clothes_per_month = shopping.get('clothesPerMonth', 0)
        electronics_per_year = shopping.get('electronicsPerYear', 0)
        breakdown['shopping'] = (
            (clothes_per_month * self.clothing_factor / 30) +
            (electronics_per_year * self.electronics_factor / 365)
        )
        
        # Total daily emissions
        daily_total = sum(breakdown.values())
        
        # Generate recommendations based on highest emissions
        recommendations = self._generate_recommendations(breakdown, transportation, energy, diet)
        
        return {
            'daily': round(daily_total, 2),
            'breakdown': {k: round(v, 2) for k, v in breakdown.items()},
            'recommendations': recommendations
        }
    
    def _generate_recommendations(self, breakdown: Dict, transportation: Dict, 
                                  energy: Dict, diet: str) -> List[Dict]:
        """Generate personalized recommendations based on emissions."""
        recommendations = []
        
        # Sort categories by emissions (highest first)
        sorted_categories = sorted(breakdown.items(), key=lambda x: x[1], reverse=True)
        
        for category, emissions in sorted_categories[:3]:  # Top 3 categories
            if category == 'transportation' and emissions > 2.0:
                if transportation['primaryMode'] == 'car':
                    recommendations.append({
                        'category': 'transportation',
                        'title': 'Switch to Public Transport',
                        'description': f'Using public transport could save you {round(emissions * 0.5, 1)}kg CO₂ daily',
                        'potentialSaving': round(emissions * 0.5, 2),
                        'difficulty': 'medium'
                    })
                elif transportation['primaryMode'] == 'motorcycle':
                    recommendations.append({
                        'category': 'transportation',
                        'title': 'Consider an Electric Vehicle',
                        'description': f'An electric vehicle could reduce your transport emissions by {round(emissions * 0.6, 1)}kg CO₂',
                        'potentialSaving': round(emissions * 0.6, 2),
                        'difficulty': 'hard'
                    })
            
            elif category == 'energy' and emissions > 3.0:
                if not energy['renewableEnergy']:
                    recommendations.append({
                        'category': 'energy',
                        'title': 'Switch to Renewable Energy',
                        'description': f'Renewable energy could reduce your emissions by {round(emissions * 0.7, 1)}kg CO₂ daily',
                        'potentialSaving': round(emissions * 0.7, 2),
                        'difficulty': 'easy'
                    })
                recommendations.append({
                    'category': 'energy',
                    'title': 'Improve Energy Efficiency',
                    'description': 'LED bulbs and better insulation could save 20% on energy emissions',
                    'potentialSaving': round(emissions * 0.2, 2),
                    'difficulty': 'easy'
                })
            
            elif category == 'diet' and emissions > 5.0:
                if diet in ['high_meat', 'omnivore']:
                    recommendations.append({
                        'category': 'diet',
                        'title': 'Reduce Meat Consumption',
                        'description': f'Eating plant-based 2-3 days per week could save {round(emissions * 0.3, 1)}kg CO₂ daily',
                        'potentialSaving': round(emissions * 0.3, 2),
                        'difficulty': 'medium'
                    })
            
            elif category == 'shopping' and emissions > 2.0:
                recommendations.append({
                    'category': 'shopping',
                    'title': 'Buy Second-Hand',
                    'description': 'Choosing second-hand items can reduce shopping emissions by up to 80%',
                    'potentialSaving': round(emissions * 0.8, 2),
                    'difficulty': 'easy'
                })
        
        return recommendations
    
    def predict_change_impact(self, lifestyle_change: Dict) -> Dict:
        """
        Predict the impact of a lifestyle change.
        
        Args:
            lifestyle_change: Dict describing current and proposed lifestyle
        
        Returns:
            Dict with current, predicted emissions and savings
        """
        current = self.calculate(
            lifestyle_change['current']['transportation'],
            lifestyle_change['current']['energy'],
            lifestyle_change['current']['diet'],
            lifestyle_change['current']['shopping']
        )
        
        predicted = self.calculate(
            lifestyle_change['proposed']['transportation'],
            lifestyle_change['proposed']['energy'],
            lifestyle_change['proposed']['diet'],
            lifestyle_change['proposed']['shopping']
        )
        
        savings = current['daily'] - predicted['daily']
        savings_percentage = (savings / current['daily'] * 100) if current['daily'] > 0 else 0
        
        return {
            'current': round(current['daily'], 2),
            'predicted': round(predicted['daily'], 2),
            'savings': round(savings, 2),
            'savings_percentage': round(savings_percentage, 1)
        }
    
    def calculate_annual_emissions(self, daily_emissions: float) -> Dict:
        """Calculate annual projections."""
        annual = daily_emissions * 365
        
        # Context: Average person's annual emissions ~4 tons CO2
        global_average = 4000  # kg
        
        return {
            'annual_kg': round(annual, 2),
            'annual_tons': round(annual / 1000, 2),
            'comparison_to_average': round((annual / global_average - 1) * 100, 1),
            'trees_needed': round(annual / 21, 0)  # A tree absorbs ~21kg CO2/year
        }
