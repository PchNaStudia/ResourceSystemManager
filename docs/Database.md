# Database Schema Overview

This document describes the database schema for the reservation system, based on the current ER diagram.

---

## Tables

### `User`

| Column     | Type     | Constraints           |
| ---------- | -------- | --------------------- |
| id         | TEXT     | PRIMARY KEY, NOT NULL |
| name       | TEXT     | NOT NULL              |
| email      | TEXT     | NOT NULL, UNIQUE      |
| picture    | TEXT     | NOT NULL              |
| created_at | DATETIME | NOT NULL              |
| updated_at | DATETIME | NOT NULL              |

---

### `ResourceGroup`

| Column     | Type     | Constraints                         |
| ---------- | -------- | ----------------------------------- |
| id         | INTEGER  | PRIMARY KEY AUTOINCREMENT, NOT NULL |
| owner_id   | TEXT     | NOT NULL, FK → User(id)             |
| created_at | DATETIME | NOT NULL                            |
| updated_at | DATETIME | NOT NULL                            |

---

### `ResourceAccess`

| Column        | Type                                  | Constraints                      |
| ------------- | ------------------------------------- | -------------------------------- |
| group_id      | INTEGER                               | NOT NULL, FK → ResourceGroup(id) |
| user_id       | TEXT                                  | NOT NULL, FK → User(id)          |
| create        | BOOLEAN                               | NOT NULL, DEFAULT FALSE          |
| read          | BOOLEAN                               | NOT NULL, DEFAULT FALSE          |
| update        | BOOLEAN                               | NOT NULL, DEFAULT FALSE          |
| delete        | BOOLEAN                               | NOT NULL, DEFAULT FALSE          |
| manage_access | BOOLEAN                               | NOT NULL, DEFAULT FALSE          |
| reserve_level | ENUM(NONE, REQUEST, RESERVE, APPROVE) | NOT NULL, DEFAULT NONE           |
| created_at    | DATETIME                              | NOT NULL                         |
| updated_at    | DATETIME                              | NOT NULL                         |
| PRIMARY KEY   | (group_id, user_id)                   | (group_id, user_id)              |

---

### `ResourceType`

| Column          | Type     | Constraints                         |
| --------------- | -------- | ----------------------------------- |
| id              | INTEGER  | PRIMARY KEY AUTOINCREMENT, NOT NULL |
| parent_id       | INTEGER  | FK → ResourceType(id)               |
| name            | TEXT     | NOT NULL                            |
| short_name      | TEXT     |                                     |
| metadata_schema | JSON     |                                     |
| created_at      | DATETIME | NOT NULL                            |
| updated_at      | DATETIME | NOT NULL                            |

---

### `Resource`

| Column     | Type     | Constraints                         |
| ---------- | -------- | ----------------------------------- |
| id         | INTEGER  | PRIMARY KEY AUTOINCREMENT, NOT NULL |
| type_id    | INTEGER  | NOT NULL, FK → ResourceType(id)     |
| group_id   | INTEGER  | NOT NULL, FK → ResourceGroup(id)    |
| label      | TEXT     |                                     |
| metadata   | JSON     |                                     |
| created_at | DATETIME | NOT NULL                            |
| updated_at | DATETIME | NOT NULL                            |

---

### `Reservation`

| Column      | Type                                           | Constraints                         |
| ----------- | ---------------------------------------------- | ----------------------------------- |
| id          | INTEGER                                        | PRIMARY KEY AUTOINCREMENT, NOT NULL |
| user_id     | TEXT                                           | NOT NULL, FK → User(id)             |
| start_time  | DATETIME                                       | NOT NULL                            |
| end_time    | DATETIME                                       | NOT NULL                            |
| reason      | TEXT                                           |                                     |
| status      | ENUM(REQUESTED, CONFIRMED, REJECTED, CANCELED) | NOT NULL                            |
| created_at  | DATETIME                                       | NOT NULL                            |
| approved_by | TEXT                                           | FK → User(id)                       |
| approved_at | DATETIME                                       |                                     |

---

### `ResourceToReservation`

| Column         | Type                          | Constraints                    |
| -------------- | ----------------------------- | ------------------------------ |
| resource_id    | INTEGER                       | NOT NULL, FK → Resource(id)    |
| reservation_id | INTEGER                       | NOT NULL, FK → Reservation(id) |
| PRIMARY KEY    | (resource_id, reservation_id) |                                |

---

### `Session`

| Column     | Type     | Constraints              |
| ---------- | -------- | ------------------------ |
| id         | TEXT     | PRIMARY KEY, NOT NULL    |
| user_id    | TEXT     | NOT NULL, FK → User(id)  |
| expires_at | DATETIME |                          |
| is_active  | BOOLEAN  | DEFAULT TRUE             |
| ip_address | TEXT     |                          |
| user_agent | TEXT     |                          |
| created_at | DATETIME | DEFAULT CURRENT_DATETIME |
| updated_at | DATETIME | NOT NULL                 |

---

## Notes

- `ResourceType` supports hierarchy through `parent_id`
- `ResourceAccess.reserve_level` determines what kind of reservation actions a user can perform
- `Reservation` supports approval tracking via `approved_by` and `approved_at`
- `ResourceToReservation` allows many-to-many linking between resources and reservations
- `Session` table enables durable, secure user session tracking with expiration and metadata
- **Sessions are stored in the database** to support durability, auditability, centralized management, and simplified
  infrastructure without requiring Redis.

This schema aligns with the conflict resolution and permission logic defined in the system design document.
