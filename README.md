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

From the repository root, start the development server with:

```bash
uvicorn app.main:app
```

The API will be available at `http://127.0.0.1:8000` by default.
