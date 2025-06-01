from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from ultralytics import YOLO
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="YOLO Object Detection API",
    description="API for object detection using YOLO model",
    version="1.0.0",
)

# Global variable to store the model
model = None

@app.on_event("startup")
async def lifespan():
    """Load the YOLO model on startup"""
    global model
    try:
        # Load your YOLO model (replace with your model path)
        model = YOLO('yolov8n.pt')  # You can use yolov8s.pt, yolov8m.pt, etc.o
    except Exception as e:
        raise

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Endpoint to handle image uploads and return predictions."""
    try:
        image = Image.open(BytesIO(await file.read()))
        image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        results = model(image)
        annotated_image = results[0].plot()
        annotated_image = cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB)

        _, img_bytes = cv2.imencode(".jpg", annotated_image)
        return StreamingResponse(BytesIO(img_bytes.tobytes()), media_type="image/jpeg")

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)