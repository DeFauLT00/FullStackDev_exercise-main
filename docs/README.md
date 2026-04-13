# Run Instructions

## Prerequisites

- Docker Desktop installed and running
- `docker compose` available

## Run With Docker

From the project root:

```bash
docker compose up --build
```

Services will be available at:

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:8000`
- Backend docs: `http://localhost:8000/docs`

To stop the stack:

```bash
docker compose down
```

## Notes

- The frontend container is served by Nginx on port `8080`.
- The backend container runs FastAPI with Uvicorn on port `8000`.
- The frontend calls the backend through `http://localhost:8000`, so opening the app from the browser at `http://localhost:8080` works correctly with the Docker setup.
