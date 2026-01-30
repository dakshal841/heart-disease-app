import streamlit as st
import pandas as pd
import joblib

# Load your model and tools
model = joblib.load('SVM_heart.pkl')
scaler = joblib.load('scaler.pkl')
expected_columns = joblib.load('columns.pkl')

st.title("Heart Disease Prediction App")
st.markdown("Provide the following details.")

# --- INPUTS ---
age = st.slider("Age", 18, 100, 40)
sex = st.selectbox("Sex", ['M', 'F'])
cp = st.selectbox("Chest Pain Type", ['ATA', 'NAP', 'TA', 'ASY'])
restingBP = st.number_input("Resting Blood Pressure (mm Hg)", 80, 200, 120)
chol = st.number_input("Serum Cholesterol (mg/dl)", 100, 600, 200)
fbs = st.selectbox("Fasting Blood Sugar > 120 mg/dl", [0, 1])
restECG = st.selectbox("Resting Electrocardiographic Results", ['Normal', 'ST', 'LVH'])
maxHR = st.slider("Maximum Heart Rate Achieved", 60, 220, 150)
exerciseAngina = st.selectbox("Exercise Induced Angina", ['Y', 'N'])
oldpeak = st.slider("ST Depression Induced by Exercise", 0.0, 6.0, 1.0)
slope = st.selectbox("Slope of the Peak Exercise ST Segment", ['Up', 'Flat', 'Down'])

# --- PREDICTION LOGIC ---
if st.button("Predict"):
    # 1. Prepare the input dictionary with EXACT column names from columns.pkl
    input_dict = {
        'Age': [age],
        'RestingBP': [restingBP],
        'Cholesterol': [chol],
        'FastingBS': [fbs],
        'MaxHR': [maxHR],
        'Oldpeak': [oldpeak],
        
        # One-Hot Encoding Manual Mapping
        'Sex_M': [1 if sex == 'M' else 0],
        'ChestPainType_ATA': [1 if cp == 'ATA' else 0],
        'ChestPainType_NAP': [1 if cp == 'NAP' else 0],
        'ChestPainType_TA': [1 if cp == 'TA' else 0],
        'RestingECG_Normal': [1 if restECG == 'Normal' else 0],
        'RestingECG_ST': [1 if restECG == 'ST' else 0],
        'ExerciseAngina_Y': [1 if exerciseAngina == 'Y' else 0],
        'ST_Slope_Flat': [1 if slope == 'Flat' else 0],
        'ST_Slope_Up': [1 if slope == 'Up' else 0]
    }
    
    # 2. Create DataFrame
    input_data = pd.DataFrame(input_dict)

    # 3. Ensure all expected columns are present (fill missing with 0)
    for col in expected_columns:
        if col not in input_data.columns:
            input_data[col] = 0

    # 4. Reorder columns to match training data exactly
    input_data = input_data[expected_columns]

    # 5. Scale and Predict
    try:
        input_data_scaled = scaler.transform(input_data)
        prediction = model.predict(input_data_scaled)[0]

        if prediction == 1:
            st.error("High risk of heart disease. Please consult a doctor.")
        else:
            st.success("Low risk of heart disease. Keep maintaining a healthy lifestyle!")
            
    except Exception as e:
        st.error(f"An error occurred during prediction: {e}")