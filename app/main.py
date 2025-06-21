from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from . import db

app = FastAPI(title='GymApp')

# Mount images folder
app.mount('/img', StaticFiles(directory=db.IMG_DIR), name='img')

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
