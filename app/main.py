from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from . import db

app = FastAPI(title='GymApp')

# Mount images folder
app.mount('/img', StaticFiles(directory=db.IMG_DIR), name='img')


@app.get('/', response_class=HTMLResponse)
def read_root():
    """Homepage with basic links and example exercises."""
    exercises = db.get_exercises()[:5]
    items = ''.join(f"<li>{ex['Nombre (ES)']}</li>" for ex in exercises)
    html_content = f"""
    <html>
        <head>
            <title>GymApp</title>
        </head>
        <body>
            <h1>Bienvenido a GymApp</h1>
            <p><a href='/exercises'>Ver ejercicios</a></p>
            <p><a href='/docs'>Documentación de la API</a></p>
            <h2>Algunos ejercicios</h2>
            <ul>{items}</ul>
        </body>
    </html>
    """
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
