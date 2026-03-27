from flask import Blueprint, jsonify, request

bp = Blueprint("patients", __name__, url_prefix="/patients")


@bp.route("/", methods=["GET"])
def list_patients():
    # placeholder
    return jsonify([])


@bp.route("/<patient_id>", methods=["GET"])
def get_patient(patient_id):
    # placeholder
    return jsonify({"id": patient_id})
