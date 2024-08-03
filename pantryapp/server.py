from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
from flask_cors import CORS
import numpy as np
from PIL import Image
import os
import io
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/detect": {"origins": os.getenv.NEXT_PUBLIC_BACKEND_API_URL}})

# Load the pre-trained MobileNetV2 model
model = YOLO(r"pantryapp/yolov8_weights.pt")  # You can use other versions of the model as well

@app.route('/api/detect', methods=['POST'])
def detect_objects():
    try:
        # Get the image from the request
        file = request.files.get('image')
        print(file)
        if not file:
            return jsonify({'error': 'No image file provided'}), 400
        

        # Read the image file into a PIL Image
        image = Image.open(file.stream)
        # image = image.resize((640, 640))

        # if image.mode != 'RGB':
        #     image = image.convert('RGB')

        # Convert PIL Image to an array if needed by YOLO model
        image_np = np.array(image)

        image_bgr = image_np[:, :, ::-1]
        
        results = model(image_bgr)

        results[0].show()

        return results[0].tojson()
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
