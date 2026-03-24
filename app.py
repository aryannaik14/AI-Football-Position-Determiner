from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

if not os.path.exists("football_position_model.pkl"):
    print("Model not found — training now...")
    import subprocess
    subprocess.run(["python", "train_model.py"], check=True)

model = joblib.load("football_position_model.pkl")

FEATURES = [
    'height','weight','speed','stamina','strength',
    'passing','dribbling','vision','shooting','defending'
]

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = [[
        data["height"],
        data["weight"],
        data["speed"],
        data["stamina"],
        data["strength"],
        data["passing"],
        data["dribbling"],
        data["vision"],
        data["shooting"],
        data["defending"]
    ]]

    probs    = model.predict_proba(features)[0]
    best_idx = probs.argmax()
    position = model.classes_[best_idx]
    confidence = round(float(probs[best_idx]), 4)

    all_probs = {
        model.classes_[i]: round(float(p), 4)
        for i, p in enumerate(probs)
    }

    return jsonify({
        "predicted_position": position,
        "confidence": confidence,
        "all_probabilities": all_probs
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)