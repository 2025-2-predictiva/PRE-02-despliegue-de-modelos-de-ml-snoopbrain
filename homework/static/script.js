document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const resultContainer = document.getElementById('resultContainer');
    const predictionResult = document.getElementById('predictionResult');
    const predictBtn = document.querySelector('.predict-btn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Mostrar loading
        predictBtn.innerHTML = '<span class="loading"></span>Prediciendo...';
        predictBtn.disabled = true;
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const data = {
            bedrooms: parseInt(formData.get('bedrooms')),
            bathrooms: parseFloat(formData.get('bathrooms')),
            sqft_living: parseInt(formData.get('sqft_living')),
            sqft_lot: parseInt(formData.get('sqft_lot')),
            floors: parseFloat(formData.get('floors')),
            waterfront: parseInt(formData.get('waterfront')),
            condition: parseInt(formData.get('condition'))
        };

        try {
            // Simular llamada a la API (aquí conectarías con tu backend)
            const prediction = await predictPrice(data);
            
            // Mostrar resultado
            showPrediction(prediction);
            
        } catch (error) {
            console.error('Error:', error);
            showError('Error al predecir el precio. Inténtalo de nuevo.');
        } finally {
            // Restaurar botón
            predictBtn.innerHTML = '🔮 Predecir Precio';
            predictBtn.disabled = false;
        }
    });

    // Función para hacer predicción usando la API
    async function predictPrice(data) {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Error en la predicción');
        }
        
        const result = await response.json();
        return result.prediction;
    }

    function showPrediction(price) {
        const formattedPrice = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);

        predictionResult.innerHTML = `
            <div style="font-size: 1.2rem; margin-bottom: 10px;">Precio Estimado:</div>
            <div>${formattedPrice}</div>
            <div style="font-size: 0.8rem; margin-top: 10px; opacity: 0.8;">
                Basado en las características ingresadas
            </div>
        `;
        
        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function showError(message) {
        predictionResult.innerHTML = `
            <div style="color: #ff6b6b; font-size: 1.2rem;">
                ❌ ${message}
            </div>
        `;
        
        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Función para resetear el formulario
    window.resetForm = function() {
        form.reset();
        resultContainer.style.display = 'none';
        form.scrollIntoView({ behavior: 'smooth' });
    };

    // Validaciones en tiempo real
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });

    function validateInput(input) {
        const value = parseFloat(input.value);
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        
        if (value < min || value > max) {
            input.style.borderColor = '#ff6b6b';
            input.style.backgroundColor = '#ffe6e6';
        } else {
            input.style.borderColor = '#e1e5e9';
            input.style.backgroundColor = '#f8f9fa';
        }
    }

    // Animaciones suaves
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    const animatedElements = document.querySelectorAll('.form-container, .result-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
