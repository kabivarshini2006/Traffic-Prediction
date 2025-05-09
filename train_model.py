import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

def train_model(data_file, model_file):
    # Load cleaned data
    df = pd.read_csv(data_file)
    
    # Features and target
    features = ['Hour', 'DayOfWeek', 'IsRushHour', 'Junction', 'Traffic_Signal', 'Weather_Encoded', 'Visibility(mi)']
    target = 'Traffic_Condition'
    
    X = df[features]
    y = df[target]
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.2f}")
    
    # Save model
    joblib.dump(model, model_file)
    
    return model

if __name__ == "__main__":
    train_model('cleaned_traffic_data.csv', 'traffic_model.joblib')