from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- 1. Load Assets (Updated to Random Forest) ---
print("Loading model assets...")
model = joblib.load('RF_heart.pkl') # <--- 1. Changed to your new model!
scaler = joblib.load('scaler.pkl')
expected_columns = joblib.load('columns.pkl')
print("Assets loaded!")

# --- 2. Define the Prediction Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        data = request.get_json()
        
        # Validate that data was actually sent
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        # Create DataFrame from the input JSON
        input_df = pd.DataFrame([data])
        
        # Ensure all expected columns exist, fill missing with 0
        for col in expected_columns:
            if col not in input_df.columns:
                input_df[col] = 0
        
        # Reorder columns to match training
        input_df = input_df[expected_columns]
        
        # Scale (Keeping it since we have it!)
        input_scaled = scaler.transform(input_df)
        
        # --- NEW RANDOM FOREST LOGIC ---
        
        # Predict the class (0 or 1)
        prediction = model.predict(input_scaled)[0]
        
        # Get probability percentages: [prob_Class_0, prob_Class_1]
        probabilities = model.predict_proba(input_scaled)[0] 
        
        # Calculate Gamified Health Score (Probability of being healthy * 100)
        health_score = int(probabilities[0] * 100)
        
        # Return JSON result with the new health_score
        result = {
            'prediction': int(prediction),
            'risk_label': 'High Risk' if prediction == 1 else 'Low Risk',
            'health_score': health_score  # <--- Our new frontend metric!
        }
        
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- 3. Run the Server ---

if __name__ == '__main__':
    # Cloud providers inject a PORT environment variable. 
    # If it doesn't exist, we default to 5000 for local testing.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)