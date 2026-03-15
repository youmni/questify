from flask import Flask, request, jsonify
from PIL import Image
import torch
import clip
import io

app = Flask(__name__)
model, preprocess = clip.load("ViT-B/32", device="cpu")

@app.route("/compare", methods=["POST"])
def compare():
    img1_bytes = request.files["image1"].read()
    img2_bytes = request.files["image2"].read()

    img1 = preprocess(Image.open(io.BytesIO(img1_bytes)).convert("RGB")).unsqueeze(0)
    img2 = preprocess(Image.open(io.BytesIO(img2_bytes)).convert("RGB")).unsqueeze(0)

    with torch.no_grad():
        f1 = model.encode_image(img1)
        f2 = model.encode_image(img2)

    score = torch.nn.functional.cosine_similarity(f1, f2).item()
    # Cosine similarity: 0.0-1.0, normaliseer naar jouw verwachte range
    normalized = max(0.0, (score - 0.5) * 2)
    return jsonify({"score": normalized})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)