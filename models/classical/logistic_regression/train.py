"""Train classical risk models and export artifacts for the ML service.

Run as:
    python models/classical/logistic_regression/train.py
"""
from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split


def generate_synthetic(n: int = 1200, seed: int = 42):
    rng = np.random.default_rng(seed)
    age = rng.normal(60, 15, size=n).clip(18, 95)
    num_comorbidities = rng.poisson(1.2, size=n)
    systolic = rng.normal(130, 20, size=n).clip(90, 220)
    spo2 = rng.normal(96, 2.5, size=n).clip(80, 100)
    temperature = rng.normal(37.0, 0.9, size=n).clip(34.5, 41.5)

    X = np.column_stack([age, num_comorbidities, systolic, spo2, temperature]).astype(np.float32)
    logits = (
        -8.5
        + 0.045 * age
        + 0.70 * num_comorbidities
        + 0.020 * (systolic - 120)
        + 0.80 * np.maximum(0, 92 - spo2)
        + 0.90 * np.maximum(0, temperature - 38)
    )
    p = 1.0 / (1.0 + np.exp(-logits))
    y = (rng.random(n) < p).astype(int)
    return X, y


def main():
    root = Path(__file__).resolve().parents[3]
    model_dir = root / "python-ml-service" / "models"
    model_dir.mkdir(parents=True, exist_ok=True)

    X, y = generate_synthetic()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    logistic = LogisticRegression(max_iter=500, random_state=42)
    logistic.fit(X_train, y_train)
    logistic_auc = roc_auc_score(y_test, logistic.predict_proba(X_test)[:, 1])

    rf = RandomForestClassifier(
        n_estimators=200,
        max_depth=7,
        min_samples_leaf=4,
        random_state=42,
    )
    rf.fit(X_train, y_train)
    rf_auc = roc_auc_score(y_test, rf.predict_proba(X_test)[:, 1])

    joblib.dump(logistic, model_dir / "logistic.pkl")
    joblib.dump(rf, model_dir / "rf.pkl")

    # Keep a legacy artifact for compatibility with older scripts.
    joblib.dump(logistic, Path(__file__).resolve().parent / "model_logreg.pkl")

    print("Saved artifacts:")
    print(f" - {model_dir / 'logistic.pkl'}")
    print(f" - {model_dir / 'rf.pkl'}")
    print("Metrics:")
    print(f" - logistic_auc={logistic_auc:.4f}")
    print(f" - random_forest_auc={rf_auc:.4f}")


if __name__ == "__main__":
    main()
