import gradio as gr
from ultralytics import YOLO

model = YOLO("yolov8n.pt")

def predict(image):
    results = model(image)
    return results[0].plot()
    
gr.Interface(fn=predict, inputs="image", outputs="image").launch()
