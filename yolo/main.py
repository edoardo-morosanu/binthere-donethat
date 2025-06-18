from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Response
from fastapi.responses import JSONResponse, StreamingResponse
from ultralytics import YOLO
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import uvicorn
from typing import List, Dict
from contextlib import asynccontextmanager
import logging
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("x-api-key")

#logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info(f"API_KEY: {API_KEY}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the YOLO model on startup"""
    global model
    try:
        logger.info("Loading YOLO model...")
        model = YOLO('v1.pt')
        logger.info("YOLO model loaded successfully.")
        yield
    except Exception as e:
        logger.error("Failed to load YOLO model: {e}")
        raise

# Initialize FastAPI app
app = FastAPI(
    title="YOLO Object Detection API",
    description="API for object detection using YOLO model",
    version="1.0.0",
    lifespan=lifespan
)

def check_api_key(api_key: str):
    if api_key != API_KEY:
        logger.warning("Invalid or missing API key.")
        raise HTTPException(status_code=401, detail="Invalid or missing API key")

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
    """Get top probable alternative classifications for the detected object, excluding the main class."""
    if box is None:
        return []
    
    if hasattr(box, 'probs') and box.probs is not None:
        probs = box.probs.data.tolist()
        main_class_id = int(box.cls)
        # get indexes of top_k probabilities, excluding the main class
        top_indexes = np.argsort(probs)[::-1]
        alt_indexes = [i for i in top_indexes if i != main_class_id][:top_k]
        return [
            {"class": names[i], "probability": float(probs[i])}
            for i in alt_indexes
        ]
    else:
        # no alternatives if only one class is predicted
        return []

async def process_prediction(file: UploadFile):
    try:
        if not file:
            logger.warning("No file uploaded.")
            raise HTTPException(status_code=400, detail="No file uploaded")
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            logger.warning(f"Invalid file type: {file.filename}")
            raise HTTPException(status_code=400, detail="Invalid file type. Only PNG, JPG, and JPEG are allowed.")
        image = Image.open(BytesIO(await file.read()))
        results = model(image)
        main_box, class_names = get_main_object(results)
        if not main_box:
            logger.info("No objects detected in the image.")
            return None, None, None, None
        top_classes = get_top_probabilities(main_box, class_names)
        results[0].boxes = results[0].boxes[[0]]
        annotated_image = results[0].plot()
        _, img_bytes = cv2.imencode(".jpg", annotated_image)
        logger.info("Annotated image created.")
        return img_bytes, main_box, class_names, top_classes
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

def main_object_exists(main_box: 'any'):
    return main_box is not None

CLASS_TO_BIN = {
    #GFT
    "apple": "GFT",
    "banana": "GFT",
    "potato": "GFT",
    #Papierbak
    "paper": "Papierbak",
    "book": "Papierbak",
    #PMD
    "plastic bottle": "PMD",
    "plastic cup": "PMD",
    "soda can": "PMD",
    "tin can": "PMD",
    #Medisch Afval
    "medical needle": "Medisch Afval",
    "syringe": "Medisch Afval",
    #Glasbak
    "glass bottle": "Glasbak"
}

def get_bin_for_class(class_name: str) -> str:
    """Maps a detected class to the appropriate waste bin according to Dutch standards"""
    return CLASS_TO_BIN.get(class_name.lower(), "Restafval")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    x_api_key: str = Header(None)
):
    """Endpoint to handle image uploads and return predictions."""
    logger.info("Received /predict request.")
    try:
        # case of wrong or missing API key
        check_api_key(x_api_key)

        img_bytes, main_box, class_names, top_classes = await process_prediction(file)

        # case for no objects detected
        if(main_object_exists(main_box) == False):
            logger.info("No object detected, returning 204.")
            return Response(status_code=204)

        main_bin = get_bin_for_class(class_names[int(main_box.cls)])

        # return classification data 
        logger.info("Prediction successful, returning result.")
        return {
            "detections": {
                "main_object": {
                    "class": class_names[int(main_box.cls)],
                    "confidence": float(main_box.conf),
                    "bin": main_bin,
                    "alternative_classifications": top_classes
                }
            }
        }
    except HTTPException:
        # FastAPI handles HTTPExceptions
        raise

    except Exception as e:
        logger.error(f"Error in /predict endpoint: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict_annotated")
async def predict_annotated(
    file: UploadFile = File(...),
    x_api_key: str = Header(None)
):
    """Endpoint to handle image uploads and return predictions with image. Usually used for testing."""
    logger.info("Received /predict_annotated request.")
    try:
        # case of wrong or missing API key
        check_api_key(x_api_key)

        img_bytes, main_box, class_names, top_classes = await process_prediction(file)

        # case for no objects detected
        if(main_object_exists(main_box) == False):
            logger.info("No object detected, returning 204.")
            return Response(status_code=204)

        # return image and classification data 
        logger.info("Prediction successful, returning result.")
        return StreamingResponse(BytesIO(img_bytes.tobytes()), media_type="image/jpeg")
    except HTTPException:
        # FastAPI handles HTTPExceptions
        raise

    except Exception as e:
        logger.error(f"Error in /predict_annotated endpoint: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)