import { useState } from 'react';

const HeartDiseaseForm = () => {
  const [formData, setFormData] = useState({
    age: 40,
    sex: 'M',
    cp: 'ATA',
    restingBP: 120,
    cholesterol: 200,
    fbs: 0,
    restECG: 'Normal',
    maxHR: 150,
    exerciseAngina: 'N',
    oldpeak: 1.0,
    slope: 'Flat'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const payload = {
        Age: parseInt(formData.age),
        RestingBP: parseInt(formData.restingBP),
        Cholesterol: parseInt(formData.cholesterol),
        FastingBS: parseInt(formData.fbs),
        MaxHR: parseInt(formData.maxHR),
        Oldpeak: parseFloat(formData.oldpeak),
        Sex_M: formData.sex === 'M' ? 1 : 0,
        ChestPainType_ATA: formData.cp === 'ATA' ? 1 : 0,
        ChestPainType_NAP: formData.cp === 'NAP' ? 1 : 0,
        ChestPainType_TA: formData.cp === 'TA' ? 1 : 0,
        RestingECG_Normal: formData.restECG === 'Normal' ? 1 : 0,
        RestingECG_ST: formData.restECG === 'ST' ? 1 : 0,
        ExerciseAngina_Y: formData.exerciseAngina === 'Y' ? 1 : 0,
        ST_Slope_Flat: formData.slope === 'Flat' ? 1 : 0,
        ST_Slope_Up: formData.slope === 'Up' ? 1 : 0
    };

    try {
      const response = await fetch('https://heart-risk-api-se3w.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to server. Is python api.py running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Heart Risk Predictor 🫀</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sex</label>
            <select name="sex" value={formData.sex} onChange={handleChange} className="w-full p-2 border rounded mt-1">
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Resting BP</label>
            <input type="number" name="restingBP" value={formData.restingBP} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cholesterol</label>
            <input type="number" name="cholesterol" value={formData.cholesterol} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Chest Pain Type</label>
            <select name="cp" value={formData.cp} onChange={handleChange} className="w-full p-2 border rounded mt-1">
              <option value="ATA">Atypical Angina</option>
              <option value="NAP">Non-Anginal Pain</option>
              <option value="TA">Typical Angina</option>
              <option value="ASY">Asymptomatic</option>
            </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium text-gray-700">Max HR</label>
            <input type="number" name="maxHR" value={formData.maxHR} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Exercise Angina?</label>
            <select name="exerciseAngina" value={formData.exerciseAngina} onChange={handleChange} className="w-full p-2 border rounded mt-1">
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
        >
          {loading ? 'Analyzing...' : 'Predict Risk'}
        </button>
      </form>

      {/* --- GAMIFIED RESULT DISPLAY --- */}
      {result && (
        <div className="mt-8 p-6 rounded-xl border-2 bg-slate-50 border-slate-200 shadow-inner">
          <h3 className="text-xl font-bold text-center mb-4 text-slate-700">Heart Health Analysis</h3>
          
          {/* The Health Meter Bar */}
          <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden mb-2 shadow-inner">
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${
                result.health_score > 70 ? 'bg-green-500' : 
                result.health_score > 40 ? 'bg-yellow-400' : 'bg-red-500'
              }`}
              style={{ width: `${result.health_score}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm font-bold text-slate-600 mb-4">
            <span>Critical</span>
            <span>Score: {result.health_score} / 100</span>
            <span>Optimal</span>
          </div>

          {/* The Final Verdict */}
          <div className={`text-center p-3 rounded-lg border ${
            result.risk_label === 'High Risk' 
              ? 'bg-red-100 text-red-800 border-red-300' 
              : 'bg-green-100 text-green-800 border-green-300'
          }`}>
            <p className="font-extrabold text-2xl uppercase tracking-wider">{result.risk_label}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeartDiseaseForm;