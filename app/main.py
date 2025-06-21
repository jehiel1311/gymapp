from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from . import db

app = FastAPI(title='GymApp')

# Mount images folder
app.mount('/img', StaticFiles(directory=db.IMG_DIR), name='img')

# Path al template de la página principal
INDEX_TEMPLATE = Path(__file__).resolve().parent / 'templates' / 'index.html'


@app.get('/', response_class=HTMLResponse)
def read_root():
    """Retorna la página principal con el lienzo de diseño."""
    html_content = INDEX_TEMPLATE.read_text(encoding='utf-8')
    return HTMLResponse(content=html_content)

@app.get('/exercises')
def list_exercises():
    """Return all exercises."""
    return db.get_exercises()

@app.get('/exercises/{ex_id}')
def exercise_detail(ex_id: str):
    ex = db.get_exercise_by_id(ex_id)
    if not ex:
        raise HTTPException(status_code=404, detail='Exercise not found')
    return ex
