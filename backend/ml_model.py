import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import timedelta

# ------------------------------------------------------
# Load CSV and clean data
# ------------------------------------------------------
def load_sales_csv(filepath):
    df = pd.read_csv(filepath)

    required_cols = {"date", "product", "quantity_sold"}
    if not required_cols.issubset(df.columns):
        raise Exception(f"CSV must contain columns: {required_cols}")

    df['date'] = pd.to_datetime(df['date'])
    return df


# ------------------------------------------------------
# Trending Items (Top selling items in recent 7 days)
# ------------------------------------------------------
def get_trending_items(df):
    latest_date = df['date'].max()
    last_7_days = latest_date - timedelta(days=7)

    recent_sales = df[df['date'] >= last_7_days]

    trending = (
        recent_sales.groupby("product")["quantity_sold"]
        .sum()
        .sort_values(ascending=False)
        .head(5)
        .reset_index()
    )

    return trending.to_dict(orient='records')


# ------------------------------------------------------
# Sales Forecasting using Linear Regression
# Predict next 7 days total sales
# ------------------------------------------------------
def forecast_sales(df):
    df = df.copy()

    # Aggregate to daily total sales
    df = df.groupby("date")["quantity_sold"].sum().reset_index()

    df['date_ordinal'] = df['date'].map(lambda x: x.toordinal())

    X = df[['date_ordinal']]
    y = df['quantity_sold']

    model = LinearRegression()
    model.fit(X, y)

    last_date = df['date'].max()
    
    future_dates = [(last_date + timedelta(days=i)) for i in range(1, 8)]
    future_ordinals = [[d.toordinal()] for d in future_dates]

    predictions = model.predict(future_ordinals)

    forecast_data = [
        {
            "date": str(future_dates[i].date()),
            "predicted_sales": round(float(predictions[i]), 2)
        }
        for i in range(7)
    ]

    return forecast_data


# ------------------------------------------------------
# Summary Section
# ------------------------------------------------------
def get_summary(df):
    total_sales = int(df["quantity_sold"].sum())
    unique_products = df["product"].nunique()

    return {
        "total_sales_units": total_sales,
        "unique_products_sold": unique_products,
        "data_points": len(df)
    }
