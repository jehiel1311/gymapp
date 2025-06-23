from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from . import db

app = FastAPI(title='GymApp')

# Path to the frontend build directory
FRONTEND_DIR = Path(__file__).resolve().parent.parent / 'client' / 'dist'

# Mount images folder
app.mount('/img', StaticFiles(directory=db.IMG_DIR), name='img')

# Mount frontend build if available
if FRONTEND_DIR.exists():
    app.mount('/static', StaticFiles(directory=FRONTEND_DIR), name='frontend')

# Path to the design template
INDEX_TEMPLATE = Path(__file__).resolve().parent / 'templates' / 'index.html'


@app.get('/', response_class=HTMLResponse)
def spa_index():
    """Serve the React single-page application."""
    if FRONTEND_DIR.exists():
        index_file = FRONTEND_DIR / 'index.html'
        return HTMLResponse(index_file.read_text(encoding='utf-8'))
    return HTMLResponse('<h1>Frontend not built</h1>')


@app.get('/design', response_class=HTMLResponse)
def design_page():
    """Return the original design canvas."""
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
