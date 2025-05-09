from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import joblib
import numpy as np
from typing import List

app = FastAPI()

# Add CORS middleware with updated allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Updated to match frontend origin
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Custom middleware to debug incoming requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Request: {request.method} {request.url}")
    print(f"Headers: {request.headers}")
    try:
        response = await call_next(request)
        print(f"Response status: {response.status_code}")
        print(f"Response headers: {response.headers}")
        return response
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        raise

# Define the request and response models
class PredictionData(BaseModel):
    DateTime: str
    Junction: int
    Weather_Condition: str
    Speed_Limit: int

class HistoryEntry(BaseModel):
    traffic_condition: str

class PredictionResult(BaseModel):
    traffic_condition: str
    traffic_rule: str
    history: List[HistoryEntry]

# Load the weather encoder
try:
    weather_encoder = joblib.load("weather_encoder.joblib")
except FileNotFoundError:
    raise Exception("weather_encoder.joblib not found. Please ensure the file exists.")

@app.post("/predict", response_model=PredictionResult)
async def predict(data: PredictionData):
    try:
        # Validate weather condition
        if data.Weather_Condition not in weather_encoder.classes_:
            raise HTTPException(status_code=400, detail="Invalid weather condition")

        # Parse DateTime
        date_time = datetime.fromisoformat(data.DateTime.replace("Z", "+00:00"))
        hour = date_time.hour

        # Simple prediction logic
        is_rush_hour = (hour >= 7 and hour <= 9) or (hour >= 16 and hour <= 18)
        is_bad_weather = data.Weather_Condition in ["Rain", "Snow", "Fog"]
        is_junction = data.Junction == 1

        if (is_rush_hour and (is_bad_weather or is_junction)) or (is_bad_weather and is_junction):
            traffic = "High"
        elif is_rush_hour or is_bad_weather or is_junction:
            traffic = "Moderate"
        else:
            traffic = "Low"

        # Define traffic rules
        if traffic == "High":
            rule = "Maintain extra distance between vehicles. Consider alternative routes. Stay alert for sudden stops."
        elif traffic == "Moderate":
            rule = "Stay within speed limits. Be cautious at intersections. Allow for slightly longer travel times."
        else:
            rule = "Follow normal driving procedures. Maintain safe speed and distance. Stay alert for changing conditions."

        # Generate random history data (simulated)
        history = []
        conditions = ["Low", "Moderate", "High"]
        weights = {"High": [0.2, 0.3, 0.5], "Moderate": [0.3, 0.5, 0.2], "Low": [0.5, 0.3, 0.2]}
        
        for _ in range(20):
            random = np.random.random()
            if random < weights[traffic][0]:
                selected_condition = "Low"
            elif random < weights[traffic][0] + weights[traffic][1]:
                selected_condition = "Moderate"
            else:
                selected_condition = "High"
            history.append(HistoryEntry(traffic_condition=selected_condition))

        # Log the prediction
        print(f"Prediction made: {traffic}")

        return PredictionResult(
            traffic_condition=traffic,
            traffic_rule=rule,
            history=history
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Traffic Prediction API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)