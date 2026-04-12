import csv
import math
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Waterjade Hydrology API")

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
STATIONS_METADATA_FILE = DATA_DIR / "stations_metadata.csv"


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def parse_iso_datetime(value: str) -> datetime:
    """Parsa una data ISO sia con minuti che con secondi."""
    try:
        return datetime.fromisoformat(value)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid datetime format: {value}",
        ) from exc


def read_stations_metadata() -> list[dict]:
    stations: list[dict] = []

    with open(STATIONS_METADATA_FILE, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            stations.append(
                {
                    "id": int(row["id"]),
                    "name": row["name"],
                    "elevation": float(row["elevation"]),
                    "latitude": float(row["latitude"]),
                    "longitude": float(row["longitude"]),
                }
            )

    return stations


def get_station_file_path(station_id: int) -> Path:
    file_path = DATA_DIR / f"meteo_station_{station_id}.csv"

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"No data file found for station_id={station_id}",
        )

    return file_path


def read_station_data(station_id: int) -> list[dict]:
    rows: list[dict] = []
    file_path = get_station_file_path(station_id)

    with open(file_path, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            rows.append(row)

    return rows


def filter_data_by_date(rows: list[dict], start_date: str, end_date: str) -> list[dict]:
    start = parse_iso_datetime(start_date)
    end = parse_iso_datetime(end_date)

    if start > end:
        raise HTTPException(
            status_code=400,
            detail="startDate must be earlier than or equal to endDate",
        )

    filtered_rows: list[dict] = []

    for row in rows:
        row_datetime = parse_iso_datetime(row["datetime"])
        if start <= row_datetime <= end:
            filtered_rows.append(row)

    return filtered_rows


def compute_cumulative_precipitation(rows: list[dict]) -> list[dict]:
    """
        - NaN o valori non numerici vengono trattati come 0.0
        - I gap temporali non vengono riempiti: la cumulata prosegue sui dati disponibili
    """
    cumulative_sum = 0.0
    result: list[dict] = []

    for row in rows:
        raw_precipitation = row["precipitation"]

        try:
            precipitation = float(raw_precipitation)
        except (TypeError, ValueError):
            precipitation = 0.0

        if not math.isfinite(precipitation):
            precipitation = 0.0

        cumulative_sum += precipitation

        result.append(
            {
                "datetime": row["datetime"],
                "precipitation": precipitation,
                "cumulative_precipitation": cumulative_sum,
            }
        )

    return result


@app.get("/")
def read_root():
    return {"message": "Welcome to the Waterjade Hydrology API"}


@app.get("/stations")
def get_stations():
    return read_stations_metadata()


@app.get("/data")
def get_data(station_id: int, startDate: str, endDate: str):
    stations = read_stations_metadata()
    station = next((item for item in stations if item["id"] == station_id), None)

    if station is None:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown station_id={station_id}",
        )

    rows = read_station_data(station_id)
    filtered_rows = filter_data_by_date(rows, startDate, endDate)
    cumulative_rows = compute_cumulative_precipitation(filtered_rows)

    return {
        "station": station,
        "startDate": startDate,
        "endDate": endDate,
        "points": cumulative_rows,
    }
