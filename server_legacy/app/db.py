import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
EXCEL_PATH = BASE_DIR / 'Ejercicios-base.xlsx'
IMG_DIR = BASE_DIR / 'img'

_df = None

def load_data():
    global _df
    if _df is None:
        _df = pd.read_excel(EXCEL_PATH)
    return _df

def get_exercises():
    df = load_data()
    return df.to_dict(orient='records')

def get_exercise_by_id(ex_id: str):
    df = load_data()
    result = df[df['ID'] == ex_id]
    if result.empty:
        return None
    return result.iloc[0].to_dict()

