from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

# =============================
# GOOGLE LOGIN
# =============================
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from google_photos import upload_photo
from flask import session


# =============================
# CONFIG
# =============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")
UPLOAD_DIR = os.path.join(FRONTEND_DIR, "images", "uploads")
DB_NAME = os.path.join(BASE_DIR, "recuerdos.db")


GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")


os.makedirs(UPLOAD_DIR, exist_ok=True)

app = Flask(
    __name__,
    static_folder=os.path.join(FRONTEND_DIR, "static"),
    static_url_path="/static"
)

app.secret_key = "album_secreto_de_amor_💖"

CORS(app)


# =============================
# DATABASE
# =============================
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS recuerdos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha TEXT NOT NULL,
            nota TEXT,
            photo_id TEXT,
            image_path TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# =============================
# LOGIN
# =============================
@app.route("/login", methods=["POST"])
def login():
    token = request.json.get("token")

    try:
        info = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
        return jsonify({
            "email": info["email"],
            "name": info["name"]
        })
    except Exception:
        return jsonify({"error": "Token inválido"}), 401

# =============================
# UPLOAD
# =============================
@app.route("/upload", methods=["POST"])
def upload():
    fecha = request.form.get("fecha")
    nota = request.form.get("nota", "")
    file = request.files.get("foto")

    if not fecha or not file:
        return jsonify({"error": "Faltan datos"}), 400

    filename = f"{datetime.now().timestamp()}_{file.filename}"
    save_path = os.path.join(UPLOAD_DIR, filename)
    file.save(save_path)

    photo_id = None
    try:
        photo_id = upload_photo(save_path)
    except Exception as e:
        print("Google Photos:", e)

    image_path = f"/images/uploads/{filename}"

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO recuerdos (fecha, nota, photo_id, image_path)
        VALUES (?, ?, ?, ?)
    """, (fecha, nota, photo_id, image_path))
    conn.commit()
    conn.close()

    return jsonify({"message": "Recuerdo guardado 💖"})

# =============================
# GET RECUERDOS
# =============================
@app.route("/recuerdos")
def recuerdos():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, fecha, nota, image_path
        FROM recuerdos
        ORDER BY fecha
    """)
    rows = cursor.fetchall()
    conn.close()

    return jsonify([
        {
            "id": r[0],
            "fecha": r[1],
            "nota": r[2],
            "image": r[3]
        } for r in rows
    ])

# =============================
# FRONTEND
# =============================
@app.route("/")
def login_page():
    return send_from_directory(FRONTEND_DIR, "login.html")

@app.route("/index")
def index_page():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/calendar")
def calendar_page():
    return send_from_directory(FRONTEND_DIR, "calendar.html")

@app.route("/images/uploads/<filename>")
def images(filename):
    return send_from_directory(UPLOAD_DIR, filename)

# =============================
# MAIN
# =============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)


