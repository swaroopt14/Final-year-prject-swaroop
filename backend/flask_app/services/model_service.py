import numpy as np


class ModelService:
    """Simple placeholder model service for local development.

    Replace with real loader (joblib/pickle) and prediction logic.
    """

    def __init__(self):
        # placeholder: simple coefficient-based rule
        self.coeffs = {"age": 0.01, "num_comorbidities": 0.2}

    def predict(self, patient: dict) -> dict:
        age = float(patient.get("age", 50))
        num = float(patient.get("num_comorbidities", 0))
        score = 1 / (1 + np.exp(- (self.coeffs['age'] * age + self.coeffs['num_comorbidities'] * num)))
        return {"risk_score": float(score)}
