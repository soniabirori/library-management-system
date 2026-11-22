# library-management-system

A simple library management system for managing books, categories, members and loans.

## Structure

- `backend/` – REST API built with Spring Boot 3.4 (Java 21), Spring Data JPA and PostgreSQL
- `frontend/` – coming soon
- `postman-collection/` – Postman collection for testing the API (coming soon)

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
