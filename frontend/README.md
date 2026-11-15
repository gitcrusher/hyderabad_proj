# Pulse campus events frontend

This frontend uses React and Vite. Its UI source and configuration live in this `frontend` folder; the API remains in `backend/app.py`.

## Development

In one terminal, start the Flask API from the project root:

```powershell
.\backend\venv\Scripts\python.exe backend\app.py
```

In another terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open the Vite URL printed in the terminal. Vite proxies `/api` requests to Flask on `127.0.0.1:5000`.

## Production build

```powershell
cd frontend
npm.cmd run build
```

The build is written to `frontend/dist`. Flask serves that build from `http://127.0.0.1:5000`.
