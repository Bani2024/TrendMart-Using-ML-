from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
from datetime import datetime
import os
from ml_model import load_sales_csv, get_trending_items, forecast_sales, get_summary



app = Flask(__name__)
CORS(app)  # Allow React frontend access
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# -------------------- DATABASE SETUP --------------------
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    # Admin table
    c.execute('''CREATE TABLE IF NOT EXISTS admin (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL
                )''')

    # Default admin user
    c.execute("SELECT * FROM admin WHERE username='admin'")
    if not c.fetchone():
        c.execute("INSERT INTO admin (username, password) VALUES (?, ?)", ('admin', '12345'))

    # Add last login column if missing
    c.execute("PRAGMA table_info(admin)")
    columns = [col[1] for col in c.fetchall()]
    if 'last_login' not in columns:
        c.execute("ALTER TABLE admin ADD COLUMN last_login TEXT")

    # Product table
    c.execute('''CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    category TEXT,
                    price REAL,
                    quantity INTEGER,
                    image TEXT,
                    status TEXT
                )''')

    conn.commit()
    conn.close()


init_db()


def init_product_table():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    category TEXT,
                    price REAL,
                    quantity INTEGER,
                    image TEXT,
                    status TEXT
                )''')
    conn.commit()
    conn.close()

init_product_table()


# -------------------- ADMIN LOGIN --------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM admin WHERE username=? AND password=?", (username, password))
    user = c.fetchone()

    if user:
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        c.execute("UPDATE admin SET last_login=? WHERE username=?", (now, username))
        conn.commit()

        c.execute("SELECT last_login FROM admin WHERE username=?", (username,))
        last_login = c.fetchone()[0]

        conn.close()
        return jsonify({"success": True, "lastLogin": last_login})
    else:
        conn.close()
        return jsonify({"success": False, "message": "Invalid credentials"})


# -------------------- DASHBOARD DATA --------------------
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


# -------------------- PRODUCT ROUTES --------------------
@app.route("/products", methods=["GET"])
def get_products():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall()
    conn.close()

    products = []
    for row in rows:
        products.append({
            "id": row[0],
            "name": row[1],
            "category": row[2],
            "price": row[3],
            "quantity": row[4],
            "image": row[5],
            "status": row[6]
        })
    return jsonify(products)


@app.route("/add_product", methods=["POST"])
def add_product():
    data = request.get_json()
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO products (name, category, price, quantity, image, status) VALUES (?, ?, ?, ?, ?, ?)",
                   (data['name'], data['category'], data['price'], data['quantity'], data['image'], data['status']))
    conn.commit()
    conn.close()
    return jsonify({"message": "Product added successfully!"})


@app.route("/update_product/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.get_json()
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''UPDATE products SET name=?, category=?, price=?, quantity=?, image=?, status=? WHERE id=?''',
                   (data['name'], data['category'], data['price'], data['quantity'], data['image'], data['status'], product_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Product updated successfully!"})


@app.route("/delete_product/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id=?", (product_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Product deleted successfully!"})

# 🔍 Search products by name
@app.route('/search_product', methods=['GET'])
def search_product():
    query = request.args.get('q', '')
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM products WHERE name LIKE ?", ('%' + query + '%',))
    rows = c.fetchall()
    conn.close()

    results = []
    for row in rows:
        results.append({
            "id": row[0],
            "name": row[1],
            "category": row[2],
            "price": row[3],
            "quantity": row[4],
            "image": row[5],
            "status": row[6]
        })
    return jsonify(results)


# -------------------- UPDATE USERNAME --------------------
@app.route('/update_username', methods=['PUT'])
def update_username():
    data = request.get_json()
    current_username = data.get('current_username')
    new_username = data.get('new_username')

    if not current_username or not new_username:
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    # Check if current username exists
    c.execute("SELECT * FROM admin WHERE username=?", (current_username,))
    user = c.fetchone()
    if not user:
        conn.close()
        return jsonify({"success": False, "message": "Current username not found"}), 404

    # Update username
    c.execute("UPDATE admin SET username=? WHERE username=?", (new_username, current_username))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Username updated successfully!"})


# -------------------- UPDATE PASSWORD --------------------
@app.route('/update_password', methods=['PUT'])
def update_password():
    data = request.get_json()
    username = data.get('username')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not username or not current_password or not new_password:
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    # Verify user
    c.execute("SELECT * FROM admin WHERE username=? AND password=?", (username, current_password))
    user = c.fetchone()

    if not user:
        conn.close()
        return jsonify({"success": False, "message": "Invalid current password"}), 401

    # Update password
    c.execute("UPDATE admin SET password=? WHERE username=?", (new_password, username))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Password updated successfully!"})


# -------------------- ML INSIGHTS ROUTES --------------------

# 1️⃣ Upload CSV
@app.route('/upload_sales_csv', methods=['POST'])
def upload_sales_csv():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400

    file = request.files['file']
    filepath = os.path.join(UPLOAD_FOLDER, "sales_data.csv")
    file.save(filepath)

    return jsonify({"success": True, "message": "File uploaded successfully!"})


# 2️⃣ Trending Items
@app.route('/insights/trending', methods=['GET'])
def insights_trending():
    filepath = os.path.join(UPLOAD_FOLDER, "sales_data.csv")

    if not os.path.exists(filepath):
        return jsonify({"success": False, "message": "Upload CSV first"}), 400

    df = load_sales_csv(filepath)
    trending = get_trending_items(df)
    return jsonify({"success": True, "trending": trending})


# 3️⃣ Sales Forecast
@app.route('/insights/forecast', methods=['GET'])
def insights_forecast():
    filepath = os.path.join(UPLOAD_FOLDER, "sales_data.csv")

    if not os.path.exists(filepath):
        return jsonify({"success": False, "message": "Upload CSV first"}), 400

    df = load_sales_csv(filepath)
    forecast = forecast_sales(df)
    return jsonify({"success": True, "forecast": forecast})


# 4️⃣ Summary Cards
@app.route('/insights/summary', methods=['GET'])
def insights_summary():
    filepath = os.path.join(UPLOAD_FOLDER, "sales_data.csv")

    if not os.path.exists(filepath):
        return jsonify({"success": False, "message": "Upload CSV first"}), 400

    df = load_sales_csv(filepath)
    summary = get_summary(df)
    return jsonify({"success": True, "summary": summary})
    
    
@app.route('/insights/all', methods=['POST'])
def insights_all():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400

    file = request.files['file']
    filepath = os.path.join(UPLOAD_FOLDER, "sales_data.csv")
    file.save(filepath)

    df = load_sales_csv(filepath)

    return jsonify({
        "success": True,
        "summary": get_summary(df),
        "trending": get_trending_items(df),
        "forecast": forecast_sales(df)
    })



# -------------------- RUN APP --------------------
if __name__ == "__main__":
    app.run(debug=True)

