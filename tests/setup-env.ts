process.env.NODE_ENV = "test";
process.env.PORT = "3000";
process.env.MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/ai_smart_hospital_test";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test_secret_key_change_me_1234567890";
process.env.CORS_ORIGIN = "*";
process.env.ML_SERVICE_BASE_URL = "http://127.0.0.1:5000";
process.env.BERT_INFERENCE_URL = "http://127.0.0.1:8001/infer";
process.env.AGENT_SERVICE_BASE_URL = "http://127.0.0.1:7000";
