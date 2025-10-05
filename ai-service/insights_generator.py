"""
AI Insights Generator
Generates personalized sustainability insights and tips based on user data.
"""

import numpy as np
from typing import Dict, List
from datetime import datetime, timedelta


class InsightsGenerator:
    """Generate personalized eco insights and recommendations."""
    
    def __init__(self):
        self.insight_templates = {
            'improvement': [
                "Great job! Your carbon footprint decreased by {percent}% this week! 🎉",
                "You're on fire! {percent}% reduction in emissions - keep it up! 🔥",
                "Amazing progress! You've reduced your footprint by {amount}kg CO₂ this week! 🌱"
            ],
            'decline': [
                "Your emissions increased by {percent}% this week. Let's get back on track! 💪",
                "Small setback this week (+{percent}%), but you've got this! Remember your goals! 🎯"
            ],
            'streak': [
                "Incredible! {days}-day streak! You're a climate champion! 🏆",
                "{days} days in a row! Your consistency is inspiring! ⭐"
            ],
            'milestone': [
                "You've saved {amount}kg CO₂ total - equivalent to {trees} trees! 🌳",
                "Milestone achieved! {amount}kg CO₂ saved. That's like not driving {km}km! 🚗"
            ]
        }
    
    def generate(self, lifestyle: Dict, recent_progress: List[Dict], 
                 carbon_footprint: Dict) -> Dict:
        """
        Generate personalized insights based on user data.
        
        Args:
            lifestyle: User's lifestyle data
            recent_progress: List of recent daily progress records
            carbon_footprint: Current carbon footprint metrics
        
        Returns:
            Dict with insights and recommendations
        """
        insights = []
        recommendations = []
        
        # Analyze trends
        if len(recent_progress) >= 2:
            trend_insights = self._analyze_trends(recent_progress)
            insights.extend(trend_insights)
        
        # Analyze lifestyle patterns
        lifestyle_insights = self._analyze_lifestyle(lifestyle)
        insights.extend(lifestyle_insights)
        
        # Generate category-specific recommendations
        category_recs = self._generate_category_recommendations(lifestyle, carbon_footprint)
        recommendations.extend(category_recs)
        
        # Add motivational insights
        motivational = self._generate_motivational_insights(recent_progress)
        insights.extend(motivational)
        
        return {
            'insights': insights[:5],  # Top 5 insights
            'recommendations': recommendations[:5]  # Top 5 recommendations
        }
    
    def _analyze_trends(self, recent_progress: List[Dict]) -> List[Dict]:
        """Analyze recent progress trends."""
        insights = []
        
        if len(recent_progress) < 2:
            return insights
        
        # Get emissions from last 7 days
        recent_emissions = [p['carbonData']['total'] for p in recent_progress[:7]]
        
        if len(recent_emissions) >= 2:
            # Calculate trend
            current_avg = np.mean(recent_emissions[:3]) if len(recent_emissions) >= 3 else recent_emissions[0]
            previous_avg = np.mean(recent_emissions[-3:]) if len(recent_emissions) >= 6 else recent_emissions[-1]
            
            change = previous_avg - current_avg
            change_percent = (change / previous_avg * 100) if previous_avg > 0 else 0
            
            if change_percent > 5:
                insights.append({
                    'type': 'trend',
                    'title': '📉 Great Progress!',
                    'description': f'Your carbon footprint decreased by {abs(change_percent):.1f}% this week!',
                    'sentiment': 'positive',
                    'impact': 'high'
                })
            elif change_percent < -5:
                insights.append({
                    'type': 'trend',
                    'title': '📈 Let\'s Improve',
                    'description': f'Your emissions increased by {abs(change_percent):.1f}% this week. Small changes can make a big difference!',
                    'sentiment': 'neutral',
                    'impact': 'medium'
                })
        
        # Analyze consistency
        if len(recent_emissions) >= 7:
            variance = np.var(recent_emissions)
            if variance < 2.0:  # Low variance = consistent
                insights.append({
                    'type': 'consistency',
                    'title': '🎯 Consistency Champion',
                    'description': 'Your emissions are very consistent. Great job maintaining your eco-friendly habits!',
                    'sentiment': 'positive',
                    'impact': 'medium'
                })
        
        return insights
    
    def _analyze_lifestyle(self, lifestyle: Dict) -> List[Dict]:
        """Analyze lifestyle patterns and generate insights."""
        insights = []
        
        transportation = lifestyle.get('transportation', {})
        energy = lifestyle.get('energy', {})
        diet = lifestyle.get('diet', 'omnivore')
        
        # Transportation insights
        if transportation.get('primaryMode') == 'car' and transportation.get('distancePerDay', 0) > 20:
            insights.append({
                'type': 'lifestyle',
                'title': '🚗 High Travel Distance',
                'description': f'You travel {transportation["distancePerDay"]}km daily by car. Consider carpooling or remote work days to reduce emissions.',
                'sentiment': 'neutral',
                'impact': 'high'
            })
        elif transportation.get('primaryMode') in ['bicycle', 'walking']:
            insights.append({
                'type': 'lifestyle',
                'title': '🚴 Eco Transport Champion',
                'description': 'Amazing! Your zero-emission transportation is making a real difference for the planet!',
                'sentiment': 'positive',
                'impact': 'high'
            })
        
        # Energy insights
        if energy.get('renewableEnergy'):
            insights.append({
                'type': 'lifestyle',
                'title': '♻️ Clean Energy User',
                'description': 'Excellent! Using renewable energy reduces your carbon footprint by up to 70%!',
                'sentiment': 'positive',
                'impact': 'high'
            })
        
        # Diet insights
        if diet in ['vegan', 'vegetarian']:
            insights.append({
                'type': 'lifestyle',
                'title': '🌱 Plant-Based Hero',
                'description': 'Your plant-based diet saves approximately 3-5kg CO₂ daily compared to a meat-heavy diet!',
                'sentiment': 'positive',
                'impact': 'high'
            })
        
        return insights
    
    def _generate_category_recommendations(self, lifestyle: Dict, 
                                          carbon_footprint: Dict) -> List[Dict]:
        """Generate recommendations by category."""
        recommendations = []
        
        transportation = lifestyle.get('transportation', {})
        energy = lifestyle.get('energy', {})
        diet = lifestyle.get('diet', 'omnivore')
        
        # Transportation recommendations
        if transportation.get('primaryMode') == 'car':
            recommendations.append({
                'title': 'Try a Car-Free Day',
                'description': 'Challenge yourself to use alternative transport one day this week. You could save 2-5kg CO₂!',
                'category': 'transportation',
                'difficulty': 'easy',
                'potentialSaving': 3.5,
                'timeframe': 'weekly'
            })
        
        # Energy recommendations
        if not energy.get('renewableEnergy'):
            recommendations.append({
                'title': 'Contact Your Energy Provider',
                'description': 'Ask about renewable energy plans. It\'s often the same price and can cut emissions by 70%!',
                'category': 'energy',
                'difficulty': 'easy',
                'potentialSaving': carbon_footprint.get('daily', 0) * 0.3,
                'timeframe': 'one-time'
            })
        
        if energy.get('electricityUsage', 0) > 10:
            recommendations.append({
                'title': 'Energy Audit',
                'description': 'Your electricity usage is above average. Consider an energy audit to find savings opportunities.',
                'category': 'energy',
                'difficulty': 'medium',
                'potentialSaving': 2.0,
                'timeframe': 'monthly'
            })
        
        # Diet recommendations
        if diet in ['high_meat', 'omnivore']:
            recommendations.append({
                'title': 'Meatless Mondays',
                'description': 'Start with one plant-based day per week. It\'s easier than you think and saves ~1kg CO₂ per day!',
                'category': 'diet',
                'difficulty': 'easy',
                'potentialSaving': 1.0,
                'timeframe': 'weekly'
            })
        
        # Shopping recommendations
        recommendations.append({
            'title': 'Second-Hand First',
            'description': 'Before buying new, check second-hand options. It reduces manufacturing emissions significantly!',
            'category': 'shopping',
            'difficulty': 'easy',
            'potentialSaving': 1.5,
            'timeframe': 'ongoing'
        })
        
        return recommendations
    
    def _generate_motivational_insights(self, recent_progress: List[Dict]) -> List[Dict]:
        """Generate motivational insights based on achievements."""
        insights = []
        
        if len(recent_progress) == 0:
            return insights
        
        # Calculate total carbon saved from challenges
        total_saved = 0
        for progress in recent_progress:
            challenges = progress.get('challengesCompleted', [])
            for challenge in challenges:
                total_saved += challenge.get('carbonSaved', 0)
        
        if total_saved > 0:
            trees_equivalent = int(total_saved / 21)  # A tree absorbs ~21kg CO₂/year
            insights.append({
                'type': 'achievement',
                'title': '🌳 Impact Milestone',
                'description': f'You\'ve saved {total_saved:.1f}kg CO₂! That\'s like planting {trees_equivalent} trees!',
                'sentiment': 'positive',
                'impact': 'high'
            })
        
        # Check for consecutive days
        consecutive_days = len(recent_progress)
        if consecutive_days >= 7:
            insights.append({
                'type': 'streak',
                'title': '🔥 Consistency Matters',
                'description': f'{consecutive_days} days of tracking! Your commitment is making a real difference!',
                'sentiment': 'positive',
                'impact': 'medium'
            })
        
        return insights
    
    def generate_weekly_summary(self, weekly_data: List[Dict]) -> Dict:
        """Generate a comprehensive weekly summary."""
        if not weekly_data:
            return {'error': 'No data available'}
        
        total_emissions = sum(day['carbonData']['total'] for day in weekly_data)
        avg_daily = total_emissions / len(weekly_data) if weekly_data else 0
        
        total_challenges = sum(len(day.get('challengesCompleted', [])) for day in weekly_data)
        total_saved = sum(
            sum(c.get('carbonSaved', 0) for c in day.get('challengesCompleted', []))
            for day in weekly_data
        )
        
        return {
            'period': 'This Week',
            'totalEmissions': round(total_emissions, 2),
            'averageDaily': round(avg_daily, 2),
            'challengesCompleted': total_challenges,
            'carbonSaved': round(total_saved, 2),
            'netImpact': round(total_emissions - total_saved, 2),
            'summary': f'You emitted {total_emissions:.1f}kg CO₂ but saved {total_saved:.1f}kg through challenges. Net impact: {total_emissions - total_saved:.1f}kg CO₂.'
        }
