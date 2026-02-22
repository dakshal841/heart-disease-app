# 🫀 Heart Risk AI: End-to-End Machine Learning Web App

## 🚀 Overview
Heart Risk AI is a full-stack application that predicts the likelihood of heart disease based on a patient's medical attributes. It bridges the gap between a modern React frontend and a Python machine learning backend, demonstrating a complete AI integration pipeline.

## 🛠️ Tech Stack
* **Frontend:** React (Vite), JavaScript, Tailwind CSS (via MERN stack foundation)
* **Backend:** Python, Flask, Flask-CORS
* **Machine Learning:** Scikit-Learn (Support Vector Machine), Pandas, NumPy, Joblib

## 🧠 Architecture Flow
1. **User Input:** The user enters medical data (Age, BP, Cholesterol, etc.) into the React UI.
2. **API Request:** The React app sends a `POST` request with a JSON payload to the Flask API.
3. **Data Preprocessing:** The Flask backend aligns the data, applies manual One-Hot Encoding for categorical variables, and scales the numerical features using a pre-trained `StandardScaler`.
4. **Inference:** The pre-trained SVM model evaluates the processed data and returns a prediction (Class 0 or 1) along with a decision boundary confidence score.
5. **Result:** The UI updates dynamically to display the risk assessment to the user.

## 📸 Screenshots
*(Drag and drop your project screenshots here)*

## 💻 How to Run Locally

### 1. Start the Backend (Machine Learning API)
```bash
# Navigate to the Python directory
cd Heart_Disease

# Install requirements
pip install flask flask-cors pandas scikit-learn joblib numpy

# Run the API
python api.py
