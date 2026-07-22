# MindBridge

MindBridge is a responsive Vue 3 web application for a community mental health charity. It provides an approachable first step through anonymous mood check-ins, practical resources, community events and role-aware account experiences.

## Run locally

```sh
npm install
npm run dev
```

## Current development stage

Milestone three adds registration, sign-in, salted password hashing, persistent multi-user accounts, route guards, role-aware dashboards and an administrator-only account management page. Aggregated ratings and final security controls remain planned for the final milestone.

## Locally persisted demo data

The application currently stores saved-resource IDs, anonymous mood check-ins and event bookings in the browser's Local Storage. This provides persistence across refreshes for the client-side assignment demonstration.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Individual user | `user@mindbridge.test` | `User123!` |
| Family supporter | `family@mindbridge.test` | `Family123!` |
| Administrator | `admin@mindbridge.test` | `Admin123!` |

These credentials are for the local learning demonstration only. Password values are converted to salted SHA-256 hashes before account records are stored; the application does not store plaintext passwords.
