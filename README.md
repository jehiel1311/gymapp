# GymApp API

This project exposes a small REST API built with **FastAPI**. It provides information about gym exercises loaded from an Excel file and serves related images.

## Folder structure

- `app/` - Source code of the FastAPI application.
- `img/` - Images referenced by the dataset and served statically.
- `Ejercicios-base.xlsx` - Excel spreadsheet containing the exercise data.

## Installation

Install the required Python packages:

```bash
pip install -r requirements.txt
```

## Running the application

First build the React frontend:

```bash
cd client
npm install
npm run build
```

Then start the FastAPI server from the repository root:

```bash
uvicorn app.main:app
```

The app (React frontend + API) will be available at `http://127.0.0.1:8000`.

The original design canvas is now located at `/design`.
