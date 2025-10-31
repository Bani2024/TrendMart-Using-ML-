from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # to allow React frontend to access Flask API

# Database setup (only run once)
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS admin (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL
                )''')

    # insert default admin if not exists
    c.execute("SELECT * FROM admin WHERE username='admin'")
    if not c.fetchone():
        c.execute("INSERT INTO admin (username, password) VALUES (?, ?)", ('admin', '12345'))
    conn.commit()
    conn.close()

init_db()


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM admin WHERE username=? AND password=?", (username, password))
    user = c.fetchone()
    conn.close()

    if user:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"})
    
@app.route('/api/dashboard', methods=['GET'])
def dashboard_data():
    data = {
        "stats": {
            "total_sales": 125000,
            "products": 120,
            "customers": 950
        },
        "trending": [
            {"name": "Dairy Milk", "category": "Chocolates", "sales": 520},
            {"name": "Parle-G", "category": "Biscuits", "sales": 490},
            {"name": "Sprite", "category": "Beverages", "sales": 480},
            {"name": "Sprite", "category": "Beverages", "sales": 480},
            {"name": "Sprite", "category": "Beverages", "sales": 480},
        ],
        "predictions": [
            {"month": "Jan", "sales": 10},
            {"month": "Feb", "sales": 15},
            {"month": "Mar", "sales": 20},
            {"month": "Apr", "sales": 17},
            {"month": "May", "sales": 25},
            {"month": "Jun", "sales": 22}
        ]
    }
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
