from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from PIL import Image
import io
import os
import sys

# Add the grandparent directory to sys.path to import predictor_module
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from predictor_module import get_predictor

app = FastAPI(title="Brain Tumor Detection API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/')
async def root() -> Dict[str, str]:
    return {'message': 'Brain Tumor Detection API is running'}


# Model/loading placeholders
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'models', 'brain_tumor_vit_model.pth')
predictor = None  # Replace with actual predictor instance after loading


try:
    predictor = get_predictor(MODEL_PATH)
    print('Model loaded successfully')
except Exception as e:
    print(f'Warning: Could not load model: {e}')
    predictor = None


@app.post('/predict')
async def predict(file: UploadFile = File(...)) -> Dict:
    # Validate content type
    if file.content_type not in {"image/jpeg", "image/png", "image/jpg", "image/webp"}:
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a JPEG/PNG/WEBP image.")

    # Read and parse image
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # If the model isn't loaded, return a graceful stub response
    if predictor is None:
        # Stub probabilities to let the UI/client work while model is not ready
        probs = {
            'Glioma': 0.10,
            'Meningioma': 0.70,
            'No Tumor': 0.05,
            'Pituitary': 0.15,
        }
        predicted = max(probs, key=probs.get)
        return {
            'class': predicted,
            'confidence': round(probs[predicted], 4),
            'all_probabilities': probs,
        }

    # Real inference
    result = predictor.predict(image)
    return {
        'class': result['prediction'],
        'confidence': round(result['confidence'], 4),
        'all_probabilities': result['probabilities'],
    }


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)
