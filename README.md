# GymApp API

This project exposes a small REST API built with **FastAPI**. It provides information about gym exercises loaded from an Excel file and serves related images. The backend has been moved to the optional `server_legacy/` folder and the React frontend now lives at the root of the repository.

## Folder structure

- `server_legacy/app/` - Source code of the optional FastAPI application.
- `img/` - Images referenced by the dataset and served statically.
- `Ejercicios-base.xlsx` - Excel spreadsheet containing the exercise data.

## Installation

Install the required Python packages:

```bash
pip install -r server_legacy/requirements.txt
```

## Updating the exercises dataset

If you modify `Ejercicios-base.xlsx`, regenerate the JSON version used by the
frontend with the helper script:

```bash
python tools/excel_to_json.py Ejercicios-base.xlsx src/data/exercises.json
```


## Running the application

First build the React frontend:

```bash
cd client
npm install
npm run build
```

Then start the FastAPI server from the `server_legacy` directory:

```bash
uvicorn server_legacy.app.main:app
```

The app (React frontend + API) will be available at `http://127.0.0.1:8000`.

The original design canvas is now located at `/design`.

## Frontend build

The compiled React app lives under `client/dist` after running the build
command. If you run the legacy FastAPI server, it will automatically serve files from this directory.

If you modify the React code under `client/`, rebuild with:

```bash
cd client
npm install
npm run build
```
