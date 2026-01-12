from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from PIL import Image
import io
import os
import sys

# Add current directory to sys.path to import predictor_module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
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


# Model loading - Initialize as None, will be loaded when first prediction is made
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'brain_tumor_vit_model.pth')
predictor = None

print(f'🔧 Model path configured: {MODEL_PATH}')

# Check if we're running in Render environment
import platform
print(f'💻 Platform: {platform.platform()}')
print(f'📁 Model file exists: {os.path.exists(MODEL_PATH)}')
if os.path.exists(MODEL_PATH):
    print(f'📏 Model file size: {os.path.getsize(MODEL_PATH)} bytes')
else:
    print('⚠️ Model file does not exist at startup')
    print('📋 Contents of models directory:')
    models_dir = os.path.dirname(MODEL_PATH)
    if os.path.exists(models_dir):
        for item in os.listdir(models_dir):
            item_path = os.path.join(models_dir, item)
            size = os.path.getsize(item_path) if os.path.isfile(item_path) else 'DIR'
            print(f'  - {item}: {size}')
    else:
        print('  - models directory does not exist')

# Try to load model on startup, but don't crash if not available
def initialize_predictor():
    global predictor
    if os.path.exists(MODEL_PATH):
        try:
            predictor = get_predictor(MODEL_PATH)
            print(f'✅ Model loaded successfully from {MODEL_PATH}')
        except Exception as e:
            print(f'⚠️ Could not load model on startup: {e}')
            print('API will load model on first prediction')
    else:
        print(f'⚠️ Model file not found at {MODEL_PATH}')
        print('API will load model when first prediction is made')

initialize_predictor()


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

    # Ensure model is loaded
    global predictor
    if predictor is None:
        print("🔄 Loading model on first prediction...")
        if os.path.exists(MODEL_PATH):
            try:
                predictor = get_predictor(MODEL_PATH)
                print(f'✅ Model loaded successfully from {MODEL_PATH} on first prediction')
            except Exception as e:
                print(f'❌ Could not load model: {e}')
                import traceback
                traceback.print_exc()  # Detailed error info
                # Return error response instead of demo data
                raise HTTPException(status_code=500, detail=f"Model could not be loaded: {str(e)}")
        else:
            print(f'❌ Model file not found at {MODEL_PATH}')
            print('⚠️ Available files in models directory:')
            models_dir = os.path.dirname(MODEL_PATH)
            if os.path.exists(models_dir):
                for item in os.listdir(models_dir):
                    item_path = os.path.join(models_dir, item)
                    size = os.path.getsize(item_path) if os.path.isfile(item_path) else 'DIR'
                    print(f'  - {item}: {size}')
            else:
                print('  - models directory does not exist')
            raise HTTPException(status_code=500, detail="Model file not found")

    # Real inference
    try:
        result = predictor.predict(image)
        return {
            'class': result['prediction'],
            'confidence': round(result['confidence'], 4),
            'all_probabilities': result['probabilities'],
        }
    except Exception as e:
        print(f'❌ Prediction error: {e}')
        import traceback
        traceback.print_exc()  # Detailed error info
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)
