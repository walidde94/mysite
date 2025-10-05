from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import uvicorn
import os
from dotenv import load_dotenv

from carbon_calculator import CarbonCalculator
from insights_generator import InsightsGenerator

load_dotenv()

app = FastAPI(
    title="EcoStep AI Service",
    description="AI-powered carbon footprint calculation and personalized eco insights",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
calculator = CarbonCalculator()
insights_gen = InsightsGenerator()


# Request/Response Models
class TransportationData(BaseModel):
    primaryMode: str
    distancePerDay: float


class EnergyData(BaseModel):
    electricityUsage: float
    gasUsage: float
    renewableEnergy: bool


class LifestyleData(BaseModel):
    transportation: TransportationData
    energy: EnergyData
    diet: str
    shopping: Dict


class CarbonRequest(BaseModel):
    transportation: TransportationData
    energy: EnergyData
    diet: str
    shopping: Dict


class ActivityData(BaseModel):
    type: str
    description: str
    carbonImpact: float
    timestamp: str


class ProgressData(BaseModel):
    date: str
    carbonData: Dict
    activities: List[ActivityData]


class InsightsRequest(BaseModel):
    lifestyle: LifestyleData
    recentProgress: List[ProgressData]
    carbonFootprint: Dict


@app.get("/")
async def root():
    return {
        "service": "EcoStep AI Service",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ai-service"
    }


@app.post("/calculate")
async def calculate_carbon_footprint(data: CarbonRequest):
    """
    Calculate carbon footprint based on lifestyle data.
    Returns daily, weekly, monthly estimates and breakdown by category.
    """
    try:
        result = calculator.calculate(
            transportation=data.transportation.dict(),
            energy=data.energy.dict(),
            diet=data.diet,
            shopping=data.shopping
        )
        
        return {
            "success": True,
            "daily": result["daily"],
            "weekly": result["daily"] * 7,
            "monthly": result["daily"] * 30,
            "breakdown": result["breakdown"],
            "recommendations": result.get("recommendations", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")


@app.post("/insights")
async def generate_insights(data: InsightsRequest):
    """
    Generate personalized AI insights and recommendations
    based on user's lifestyle and progress history.
    """
    try:
        insights = insights_gen.generate(
            lifestyle=data.lifestyle.dict(),
            recent_progress=[p.dict() for p in data.recentProgress],
            carbon_footprint=data.carbonFootprint
        )
        
        return {
            "success": True,
            "insights": insights["insights"],
            "recommendations": insights["recommendations"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Insights generation error: {str(e)}")


@app.post("/predict-impact")
async def predict_impact(lifestyle_change: Dict):
    """
    Predict the carbon impact of a proposed lifestyle change.
    """
    try:
        prediction = calculator.predict_change_impact(lifestyle_change)
        
        return {
            "success": True,
            "currentEmissions": prediction["current"],
            "predictedEmissions": prediction["predicted"],
            "savings": prediction["savings"],
            "savingsPercentage": prediction["savings_percentage"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug
    )
