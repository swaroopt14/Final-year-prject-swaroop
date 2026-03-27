from flask import Flask, jsonify, request
from .services.model_service import ModelService

app = Flask(__name__)
model_svc = ModelService()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.json or {}
    # For scaffold, accept a patient dict and return a dummy prediction
    patient = payload.get("patient", {})
    pred = model_svc.predict(patient)
    return jsonify({"prediction": pred}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
