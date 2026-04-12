# Waterjade - Full Stack Developer Assignment (Precipitation Analysis)

Welcome! This project aims to evaluate your end-to-end web development skills, code organization, and problem-solving abilities using hydrological data similar to what we manage at Waterjade.


## The Scenario
In the `backend/data` folder, you will find some csv files containing precipitation measurements (`[mm]`) for different stations. 
**Note:** Real-world data is often messy. You might find missing values or gaps that need to be handled before performing mathematical operations.

## Objective
Develop a Single Page Application (SPA) in Angular that interfaces with a Python (FastAPI) API to visualize the **Cumulative Precipitation** for a selected period.

### Backend Requirements (FastAPI)
1. **Stations Endpoint:** Retrieve a list of unique available `station_id`s.
2. **Data Endpoint:** Retrieve data filtered by `station_id` and a date range (`startDate`, `endDate`).
3. **Business Logic:** - The API must calculate the **Cumulative Sum** (cumsum) of the precipitation for the selected period. 
   - The accumulation should start from **zero** at the `startDate` chosen by the user.
   - You must decide and document how to handle missing values (NaN/Gaps) so they don't break the cumulative calculation.

### Frontend Requirements (Angular)
1. **Controls:**
   - A dropdown to select the `station_id`.
   - A date range picker (or two date inputs) to define the period.
2. **Visualization:**
   - Display a time-series chart (using any library like Chart.js, ECharts, or ApexCharts).
   - The chart should show the **Cumulative Precipitation** curve.
3. **UX/UI:**
   - Handle loading states while fetching data.
   - Show a meaningful message if no data is available for the selected range.

### Bonus (Optional): Dockerization
If you are familiar with Docker and want to go the extra mile, you can containerize the application. We highly appreciate this, though it is strictly optional:
* Create a `Dockerfile` for the FastAPI backend.
* Create a `Dockerfile` for the Angular frontend (e.g., using a multi-stage build with Nginx, or just a simple dev server).
* Provide a `docker-compose.yml` in the root directory so we can spin up the entire stack with a single `docker compose up --build` command.


### Evaluation Criteria
* **Architecture:** Clear separation between API routes, business logic, and data access in Python; and between components and services in Angular.
* **Code Quality:** Use of Type Hints (Python) and strict typing (TypeScript). Readability and naming conventions.
* **Problem Solving:** Logic used for the cumulative calculation and handling of data inconsistencies.
* **Testing:** Write at least one unit test for the backend logic (e.g., the cumulative sum function).

## Setup
* **Backend:** Navigate to `/backend`, create a virtual environment, and install dependencies: `pip install -r requirements.txt`. Run with `uvicorn main:app --reload`.
* **Frontend:** Navigate to `/frontend`, install dependencies with `npm install`, and start the development server with `npm start`. The application will be available at `http://localhost:4200`.

## Documentation & Deliverables
We have provided a `docs/` folder with two templates that you are required to fill:

1.  **docs/REPORT.md**: Use this file to describe your technical approach, architectural choices, and how you handled the hydrological data challenges.
2.  **docs/README.md**: Use this file to provide clear, step-by-step instructions on how to set up and run your specific implementation, including any additional dependencies or configurations you might have added.


## Submission
Please host your code in a private repository (GitHub/GitLab) and share the access with us. We value a clean commit history.

Good luck!

