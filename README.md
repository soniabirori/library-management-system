# library-management-system

A simple library management system for managing books, categories, members and loans.

## Structure

- `backend/` – REST API built with Spring Boot 3.4 (Java 21), Spring Data JPA and PostgreSQL
- `frontend/` – React user interface (Vite, plain CSS, sample data)
- `postman-collection/` – Postman collection for testing the API

## Backend

### Prerequisites

- Java 21
- PostgreSQL running locally with a database named `library_db`

Database connection settings are in `backend/src/main/resources/application.properties`.

### Run

```bash
cd backend
./mvnw spring-boot:run
```

The API runs at `http://localhost:8081`.

### API endpoints

| Resource   | Base path         | Extra endpoints                        |
|------------|-------------------|----------------------------------------|
| Books      | `/api/books`      | identified by `{isbn}`                 |
| Categories | `/api/categories` | `GET /{id}/books`                      |
| Members    | `/api/members`    | `GET /{id}/loans`                      |
| Loans      | `/api/loans`      | `PUT /{id}/return` to return a book    |

Each resource supports the standard `GET` (all / by id), `POST`, `PUT` and `DELETE` operations.

## Frontend

The frontend is built with **React only** and styled with **plain CSS** (no UI libraries, no router, no icon packs).
As required by the brief it is **not connected to the backend**: every page starts from sample data in
`src/data/sampleData.js`, and adding, editing, deleting, borrowing and returning only change in-memory state.

### Run

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### Pages

| Page       | What it shows |
|------------|---------------|
| Dashboard  | Summary cards (books, members, categories, books out), recent loans, loans due next, books per category |
| Categories | Table of categories with book counts, add/edit form, edit and delete buttons, search |
| Books      | Table of books (title, author, category, status), add/edit form with a category dropdown, search box, category and status filters |
| Members    | Table of members (name, email, role, books out), add/edit form with a STUDENT/STAFF dropdown, role filter, a member's loan history |
| Loans      | Borrow form (member and book dropdowns, dates filled automatically) and a table of loans with borrow, due and return dates and a Return button |

### Structure

```
frontend/src
├── App.jsx              # app state + hash-based navigation
├── components/          # reusable pieces: Navbar, DataTable, Modal/FormModal, form fields, Button, Badge, Toast…
├── pages/               # Dashboard, Categories, Books, Members, Loans
├── data/                # sample data and lookup helpers
└── styles/              # base tokens, layout, components, pages
```

The layout is responsive: a full sidebar on desktop, an icon sidebar on tablets, and a bottom tab bar on phones,
where tables turn into cards and forms open as bottom sheets.

## Postman collection

`postman-collection/library_system.postman_collection` contains requests for Books, Categories, Members and Loans.
To use it, open Postman, click **Import** and select the file. Make sure the backend is running on port 8081.

Screenshots of the requests and their responses, including error cases such as missing fields, duplicates and invalid IDs, are in `postman-collection/api-requests-images/`.
