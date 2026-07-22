# MindBridge

MindBridge is a responsive Vue 3 web application for a community mental health charity. It provides an approachable first step through anonymous mood check-ins, practical resources, community events and role-aware account experiences.

## Run locally

```sh
npm install
npm run dev
```

## Current development stage

The completed application includes dynamic resources and events, input validation, anonymous mood recommendations, persistent multi-user authentication, role-protected pages, one-rating-per-account aggregated helpfulness scores and client-side security controls.

## Locally persisted demo data

The application currently stores saved-resource IDs, anonymous mood check-ins and event bookings in the browser's Local Storage. This provides persistence across refreshes for the client-side assignment demonstration.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Individual user | `user@mindbridge.test` | `User123!` |
| Family supporter | `family@mindbridge.test` | `Family123!` |
| Administrator | `admin@mindbridge.test` | `Admin123!` |

These credentials are public test data for the local learning demonstration only. Account passwords are converted to salted PBKDF2-SHA-256 derived values before records are stored; the application does not store registered users' plaintext passwords.

## Verification

```sh
npm test
npm run build
```

The automated tests cover authentication, persistent sessions, account roles, route access, security helpers and aggregated rating updates.

See [SECURITY.md](./SECURITY.md) for the BR C.4 security reflection and production limitations.
