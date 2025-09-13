from flask import Flask, render_template, request, jsonify
import pickle
import pandas as pd
import os

app = Flask(__name__)

# Cargar el modelo entrenado
model_path = 'homework/house_predictor.pkl'
if os.path.exists(model_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print("✅ Modelo cargado exitosamente")
else:
    print("❌ No se encontró el modelo. Ejecuta train_model.py primero.")
    model = None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({'error': 'Modelo no disponible'}), 500
        
        # Obtener datos del formulario
        data = request.json
        
        # Crear DataFrame con los datos
        features = pd.DataFrame([{
            'bedrooms': data['bedrooms'],
            'bathrooms': data['bathrooms'],
            'sqft_living': data['sqft_living'],
            'sqft_lot': data['sqft_lot'],
            'floors': data['floors'],
            'waterfront': data['waterfront'],
            'condition': data['condition']
        }])
        
        # Hacer predicción
        prediction = model.predict(features)[0]
        
        return jsonify({
            'prediction': float(prediction),
            'success': True
        })
        
    except Exception as e:
        print(f"Error en predicción: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

if __name__ == '__main__':
    print("🚀 Iniciando servidor en http://127.0.0.1:5000")
    app.run(debug=True, host='127.0.0.1', port=5000)
