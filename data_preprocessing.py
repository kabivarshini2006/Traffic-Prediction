import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from datetime import datetime

def clean_and_extract_features(input_file, output_file):
    # Load dataset (use a subset for faster processing, adjust as needed)
    df = pd.read_csv(input_file, low_memory=False)
    
    # Select relevant columns
    columns = ['Start_Time', 'Weather_Condition', 'Junction', 'Traffic_Signal', 'Severity', 'Visibility(mi)']
    df = df[columns]
    
    # Handle missing values
    df['Start_Time'] = df['Start_Time'].fillna(method='ffill')
    df['Weather_Condition'] = df['Weather_Condition'].fillna('Clear')
    df['Junction'] = df['Junction'].fillna(False).astype(int)
    df['Traffic_Signal'] = df['Traffic_Signal'].fillna(False).astype(int)
    df['Visibility(mi)'] = df['Visibility(mi)'].fillna(df['Visibility(mi)'].mean())
    
    # Map Severity to Traffic_Condition
    def map_severity(severity):
        if severity == 1:
            return 'Low'
        elif severity in [2, 3]:
            return 'Moderate'
        elif severity == 4:
            return 'High'
        return 'Low'  # Fallback
    df['Traffic_Condition'] = df['Severity'].apply(map_severity)
    
    # Convert Start_Time to datetime
    df['Start_Time'] = pd.to_datetime(df['Start_Time'], errors='coerce')
    
    # Extract features
    df['Hour'] = df['Start_Time'].dt.hour
    df['DayOfWeek'] = df['Start_Time'].dt.dayofweek
    df['IsRushHour'] = df['Hour'].apply(lambda x: 1 if (7 <= x <= 9 or 16 <= x <= 18) else 0)
    
    # Encode Weather_Condition
    weather_encoder = LabelEncoder()
    df['Weather_Encoded'] = weather_encoder.fit_transform(df['Weather_Condition'])
    
    # Drop rows with missing critical data
    df = df.dropna(subset=['Start_Time', 'Traffic_Condition'])
    
    # Save cleaned data
    df.to_csv(output_file, index=False)
    
    # Save encoder
    import joblib
    joblib.dump(weather_encoder, 'weather_encoder.joblib')
    
    return df

if __name__ == "__main__":
    # Assume dataset is downloaded as US_Accidents_March23.csv
    clean_and_extract_features('data/US_Accidents_March23.csv', 'cleaned_traffic_data.csv')
