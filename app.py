from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from ultralytics import YOLO
import cv2
import numpy as np
from io import BytesIO
from PIL import Image

app = FastAPI(title="YOLOv8 Proof Of Concept Object Detection API")
model = YOLO("yolov8n.pt")

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