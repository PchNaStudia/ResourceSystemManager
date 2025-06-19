# Reservation System Design Summary

This document summarizes the full design decisions and rules discussed for a reservation management system that supports:

- Hierarchical permissions (`reserve_level`)
- Resource-based conflicts
- Soft and hard conflict resolution
- Manual and automatic approval workflows

---

## Permission Levels

Reservations are governed by a single integer field `reserve_level`:

| Level | Label     | Abilities                                                            |
| ----- | --------- | -------------------------------------------------------------------- |
| 0     | No Access | Cannot create or request any reservations                            |
| 1     | Requester | Can create `REQUESTED` reservations only                             |
| 2     | Booker    | Can create `CONFIRMED` reservations unless soft/hard conflict exists |
| 3     | Manager   | Can create `CONFIRMED` reservations and override soft conflicts      |

---

## Conflict Types

- **No Conflict**: No overlapping reservations
- **Soft Conflict**: Overlaps with another `REQUESTED` reservation
- **Hard Conflict**: Overlaps with a `CONFIRMED` reservation

---

## Reservation Matrix

### Legend:

- ✅ = Allowed
- ❌ = Denied
- ⚠️ = Show warning (soft conflict)

| reserve_level | No Conflict (force: ❌) | Soft Conflict (force: ❌) | Soft Conflict (force: ✅)          | Hard Conflict (force: ❌) |
| ------------- | ----------------------- | ------------------------- | ---------------------------------- | ------------------------- |
| 0             | ❌ Denied               | ❌ Denied                 | ❌ Denied                          | ❌ Denied                 |
| 1             | ✅ `REQUESTED`          | ✅ `REQUESTED`            | ❌ Denied                          | ✅ `REQUESTED`            |
| 2             | ✅ `CONFIRMED`          | ⚠️ Warn only              | ✅ `REQUESTED` (intentional defer) | ❌ Denied                 |
| 3             | ✅ `CONFIRMED`          | ⚠️ Warn only              | ✅ `CONFIRMED` (override)          | ❌ Denied                 |

---

## Conflict Resolution

### Manual (level 3)

- When a reservation is created or approved as `CONFIRMED`:

  - All overlapping `REQUESTED` reservations are automatically rejected.

### Auto-Approval (Scheduled Job)

- Runs daily at a defined hour
- Iterates over all `REQUESTED` reservations ordered by creation time
- Confirms the first that has no conflicts
- Rejects any overlapping `REQUESTED`s afterwards
- Only confirms reservations that **start within 2× the auto-approval interval**

---

## Reservation Status Rules

| Status      | Meaning                                 | Rules                                                                                   |
| ----------- | --------------------------------------- | --------------------------------------------------------------------------------------- |
| `REQUESTED` | Needs manual or auto approval           | - Cannot start before next auto-approval window (minimum lead time = approval interval) |
|             |                                         | - Must start at least `X` hours in the future, where `X = auto_approval_interval`       |
| `CONFIRMED` | Approved and locked                     | Can only be created by level 2+                                                         |
| `REJECTED`  | Invalid due to conflict or admin action | Cannot be edited or updated                                                             |
| `CANCELED`  | Manually withdrawn                      | May be deleted or rebooked if needed                                                    |

---

## Enforcement Points

- Reject updating a `REJECTED` reservation at both API and DB trigger level.
- Prevent `REQUESTED` reservations from starting before next auto-approval window.
- Only allow force override of soft conflicts if `reserve_level === 3`.
- If `reserve_level === 2` and user uses `force`, create reservation as `REQUESTED`, not `CONFIRMED`.
- Auto-approval only processes `REQUESTED` reservations that start within `2 × approval_interval`.

---

## Optional Extensions

- Add audit history table (`reservation_history`) via triggers or app logic.
- Add a `ReservationPolicy` helper in code to centralize permission and conflict logic.
- Auto-notify users of rejected `REQUESTED` reservations.

---

This design provides a flexible, fair, and extensible foundation for resource-based reservation systems.
