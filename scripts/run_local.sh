#!/usr/bin/env bash
set -euo pipefail
export FLASK_APP=backend/flask_app/app.py
export FLASK_ENV=development
python -m pip install -r requirements.txt
python -m flask run --host=127.0.0.1 --port=5000
