# EcoStep AI Service

Python FastAPI service for carbon footprint calculation and AI-powered sustainability insights.

## 🚀 Features

- **Carbon Footprint Calculation**: Accurate emissions estimation based on lifestyle data
- **Personalized Insights**: AI-generated recommendations tailored to user behavior
- **Trend Analysis**: Track and analyze carbon emission trends over time
- **Impact Prediction**: Predict the effect of lifestyle changes on carbon footprint
- **Weekly Summaries**: Comprehensive progress reports

## 📋 Prerequisites

- Python >= 3.9
- pip

## 🔧 Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
```

## 🏃 Running the Service

Development mode:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --port 8000
```

Production mode:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📚 API Endpoints

### Health Check
- `GET /` - Service information
- `GET /health` - Health check

### Carbon Calculation
- `POST /calculate` - Calculate carbon footprint
  ```json
  {
    "transportation": {
      "primaryMode": "car",
      "distancePerDay": 25
    },
    "energy": {
      "electricityUsage": 10,
      "gasUsage": 5,
      "renewableEnergy": false
    },
    "diet": "omnivore",
    "shopping": {
      "clothesPerMonth": 2,
      "electronicsPerYear": 1
    }
  }
  ```

### Insights Generation
- `POST /insights` - Generate personalized insights
- `POST /predict-impact` - Predict impact of lifestyle changes

## 🧪 Testing

Run tests:
```bash
pytest
```

## 📊 Emission Factors

### Transportation (kg CO₂ per km)
- Car: 0.192
- Public Transport: 0.089
- Motorcycle: 0.113
- Electric Car: 0.053
- Bicycle/Walking: 0.0

### Diet (kg CO₂ per day)
- Vegan: 2.89
- Vegetarian: 3.81
- Pescatarian: 4.67
- Omnivore: 7.19
- High Meat: 10.24

### Energy
- Electricity: 0.295 kg CO₂/kWh (EU average)
- Natural Gas: 0.185 kg CO₂/kWh
- Renewable Energy: 70% reduction

## 🔬 Algorithm Details

The carbon calculator uses scientifically-backed emission factors from:
- EPA (Environmental Protection Agency)
- IPCC (Intergovernmental Panel on Climate Change)
- Academic research on lifecycle emissions

The insights generator employs:
- Trend analysis using statistical methods
- Pattern recognition for lifestyle habits
- Personalized recommendation engine
- Motivational psychology principles

## 📈 API Response Examples

### Calculate Response
```json
{
  "success": true,
  "daily": 15.4,
  "weekly": 107.8,
  "monthly": 462.0,
  "breakdown": {
    "transportation": 4.8,
    "energy": 4.2,
    "diet": 5.4,
    "shopping": 1.0
  },
  "recommendations": [...]
}
```

### Insights Response
```json
{
  "success": true,
  "insights": [
    {
      "type": "trend",
      "title": "Great Progress!",
      "description": "Your carbon footprint decreased by 12% this week!",
      "sentiment": "positive",
      "impact": "high"
    }
  ],
  "recommendations": [...]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Submit a pull request

## 📄 License

MIT License
