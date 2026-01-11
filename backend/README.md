# Brain Tumor Detection API

This is the FastAPI backend for the Brain Tumor Detection system using Vision Transformer (ViT) model.

## Setup

1. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\\venv\\Scripts\\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Prepare your model:**
   - Place your trained ViT model file (`.pth` or `.pt`) in the `models` directory
   - Update the `MODEL_PATH` in `main.py` if your model has a different name or location

4. **Environment variables (optional):**
   Create a `.env` file in the backend directory if you need to configure any environment variables.

## Running the API

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /`: Health check endpoint
- `POST /predict`: Accepts an image file and returns prediction results

### Example Request

```bash
curl -X 'POST' \
  'http://localhost:8000/predict' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@path_to_image.jpg;type=image/jpeg'
```

### Example Response

```json
{
  "class": "Meningioma",
  "confidence": 0.95,
  "all_probabilities": {
    "Glioma": 0.02,
    "Meningioma": 0.95,
    "No Tumor": 0.01,
    "Pituitary": 0.02
  }
}
```

## Development

- The API uses CORS middleware to allow requests from your frontend
- Update the `allow_origins` list in `main.py` to restrict access in production
- For production deployment, consider using a production ASGI server like Gunicorn with Uvicorn workers

## License

This project is licensed under the MIT License.
