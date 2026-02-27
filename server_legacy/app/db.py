import pandas as pd
from pathlib import Path

SERVER_DIR = Path(__file__).resolve().parent.parent
REPO_DIR = SERVER_DIR.parent


def _first_existing_path(*paths: Path) -> Path:
    for candidate in paths:
        if candidate.exists():
            return candidate
    return paths[0]


EXCEL_PATH = _first_existing_path(
    REPO_DIR / 'Ejercicios-base.xlsx',
    SERVER_DIR / 'Ejercicios-base.xlsx',
)
IMG_DIR = _first_existing_path(
    REPO_DIR / 'img',
    SERVER_DIR / 'img',
)

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
