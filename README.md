# EA Foods - Vehicle Management System

Take-home React assessment for EA Foods Engineering.

## Tech Stack

- React + TypeScript + Vite
- Redux Toolkit + React Redux
- React Router DOM
- ESLint

## Local Setup

```bash
npm install
npm run dev
```

Build and production preview:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Environment

No runtime environment variables are required for this version.

An `.env.example` file is included for future extension.

## Implemented Requirements

### Core Requirements

- Vehicle list with columns: ID, Name, Type, Status, Mileage, Last Service Date
- Seeded 10 vehicles in Redux store
- Debounced search (custom `useDebounce` hook, `400ms`) filtering by name or status
- Add/Edit vehicle form with field validation and clear error messages
- Redux-driven add/edit updates with no page reload
- Idempotent reducer behavior for add/edit submissions
- Vehicle detail view (`/vehicles/:vehicleId`)
- Detail page action to open prefilled edit form
- Redux Toolkit architecture with `createSlice` + memoized selectors via `createSelector`

### Scenarios Covered

- Add vehicle and list updates immediately
- Edit vehicle with prefilled values
- Re-submitting same edit does not duplicate/corrupt state
- Search only updates after debounce delay
- No-results search shows explicit empty state

### Bonus Features Implemented

- **Summary stats bar (reactive):** shows Total, Active, In Maintenance, and Inactive counts from memoized Redux selectors.
- **Feature-based structure:** organized under `src/features/vehicles` with shared typed models/selectors for scalable maintenance.
- **Multi-sort on vehicle list:** supports sorting by mileage, status, and last service date.

## Project Structure

```text
src/
  app/
    store.ts
    hooks.ts
  features/
    vehicles/
      types.ts
      vehiclesSlice.ts
      selectors.ts
  hooks/
    useDebounce.ts
  App.tsx
  App.css
```

## Architecture Decisions

- Redux is the single source of truth for vehicle entities and derived stats.
- Selectors are memoized to avoid unnecessary recalculations.
- Form logic and list logic are kept inside one page for faster assessment delivery; reusable hook extraction can be done next.
- Routing separates dashboard and detail responsibilities while preserving edit workflow.

## Trade-offs

- UI is intentionally lightweight and focused on functional requirements over design system depth.
- Validation is hand-rolled to keep dependencies minimal.
- No backend persistence (in-memory Redux state only), as requested for local-only execution.

## What I Would Improve Next

- Extract `VehicleForm` and `VehicleTable` into dedicated feature components
- Add unit tests for slice/selectors and hook tests for `useDebounce`
- Add component tests for add/edit/detail/search flows
- Add toast feedback and delete with confirm modal
- Add filters/sorting/pagination and analytics widgets

## Time Spent Log

- Project scaffolding and tooling: 20 min
- Redux state/model/selectors and seeded data: 35 min
- List rendering and status UI: 30 min
- Debounced search + empty state: 20 min
- Add/Edit form + validation + idempotency: 50 min
- Detail route + edit integration: 35 min
- Documentation and cleanup: 20 min

## Screenshots / Recording

Add screenshots to `docs/screenshots/` or include a short screen recording link here:

- Dashboard list view
- Debounced search behavior
- Add/Edit workflow
- Vehicle detail view
