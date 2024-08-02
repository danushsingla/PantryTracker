from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app, resources={r"/api/detect": {"origins": "http://localhost:3000"}})

# Load the pre-trained YOLOv8 model
model = YOLO('yolov8x.pt')  # You can use other versions of the model as well

@app.route('/api/detect', methods=['POST'])
def detect_objects():
    try:
        # Get the image from the request
        file = request.files.get('image')
        if not file:
            return jsonify({'error': 'No image file provided'}), 400

        image = Image.open(io.BytesIO(file.read()))

        # Perform object detection
        results = model(image)
        print(results)
        exit()
        results[0].show()

        return results[0].tojson()
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
