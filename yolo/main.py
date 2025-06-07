from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.responses import JSONResponse, StreamingResponse
from ultralytics import YOLO
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import uvicorn
from typing import List, Dict
from contextlib import asynccontextmanager

API_KEY = "1234"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the YOLO model on startup"""
    global model
    try:
        model = YOLO('YOLO_Waste_Detection_Computer_Vision_Project-yolo11n-50epochs.pt')
        yield
    except Exception as e:
        raise

# Initialize FastAPI app
app = FastAPI(
    title="YOLO Object Detection API",
    description="API for object detection using YOLO model",
    version="1.0.0",
    lifespan=lifespan
)

# Global variable to store the model
# model = None

def get_main_object(results):
    """Identify the main object (largest) from detection results"""
    if not results or not results[0].boxes:
        return None, None
    
    boxes = results[0].boxes
    main_idx = None
    max_area = 0
    
    for i, box in enumerate(boxes):
        x1, y1, x2, y2 = box.xyxy[0]
        area = (x2 - x1) * (y2 - y1)
        current_score = area.item()
        
        if current_score > max_area:
            max_area = current_score
            main_idx = i
    
    if main_idx is not None:
        main_box = boxes[main_idx]
        return main_box, results[0].names
    return None, None

def get_top_probabilities(box, names, top_k: int = 5) -> List[Dict]:
    """Get top probable classifications for the detected object"""
    if box is None:
        return []
    
    if hasattr(box, 'probs') and box.probs is not None:
        probs = box.probs.data.tolist()
        top_indices = np.argsort(probs)[-top_k:][::-1]
        return [
            {"class": names[i], "probability": float(probs[i])}
            for i in top_indices
        ]
    else:
        class_id = int(box.cls)
        return [{
            "class": names[class_id],
            "probability": float(box.conf)
        }]

#def process_image_and_annotate(file, model):


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    x_api_key: str = Header(None)
):
    """Endpoint to handle image uploads and return predictions."""
    try:
        # case of wrong or missing API key
        if x_api_key != API_KEY:
            raise HTTPException(status_code=401, detail="Invalid or missing API key")

        # case of no image sent
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        # case of invalid format of image
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            raise HTTPException(status_code=400, detail="Invalid file type. Only PNG, JPG, and JPEG are allowed.")



        image = Image.open(BytesIO(await file.read()))
        image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # get prediction from ML model
        results = model(image)
        
        # get largest object and class names
        main_box, class_names = get_main_object(results)
        
        # case for no objects detected
        if not main_box:
            return JSONResponse(content={"message": "No objects detected"}, status_code=200)
        
        # get top probable classifications
        top_classes = get_top_probabilities(main_box, class_names)
        
        
        # generate annotated image with only the largest object
        results[0].boxes = results[0].boxes[[0]]
        annotated_image = results[0].plot()
        annotated_image = cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB)

        # convert image to a byte format
        _, img_bytes = cv2.imencode(".jpg", annotated_image)
        return StreamingResponse(BytesIO(img_bytes.tobytes()), media_type="image/jpeg")

        # return image and classification data 
        return {
            "image": StreamingResponse(BytesIO(img_bytes.tobytes())), 
            "detections": {
                "main_object": {
                    "class": class_names[int(main_box.cls)],
                    "confidence": float(main_box.conf),
                    "bounding_box": main_box.xyxy[0].tolist(),
                    "alternative_classifications": top_classes
                }
            }
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)