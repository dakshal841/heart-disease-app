import requests
import json

# 1. The URL of your local API
url = 'http://127.0.0.1:5000/predict'

# 2. The Data (A "Healthy" User Profile)
# We send the RAW values, and let the API handle the logic.
payload = {
    'Age': 25,
    'RestingBP': 110,
    'Cholesterol': 180,
    'FastingBS': 0,
    'MaxHR': 180,
    'Oldpeak': 0.0,
    # Helper columns for One-Hot Encoding
    'Sex_M': 0,          # Female
    'ChestPainType_ATA': 1, 
    'ChestPainType_NAP': 0,
    'ChestPainType_TA': 0,
    'RestingECG_Normal': 1,
    'RestingECG_ST': 0,
    'ExerciseAngina_Y': 0,
    'ST_Slope_Flat': 0,
    'ST_Slope_Up': 1
}

# 3. Send the POST request
response = requests.post(url, json=payload)

# 4. Print the result
print("Status Code:", response.status_code)
print("Response:", response.json())