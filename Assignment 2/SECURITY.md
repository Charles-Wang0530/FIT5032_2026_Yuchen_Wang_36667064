# Security reflection — BR C.4

MindBridge is a client-side learning application. Its security controls reduce common browser risks and demonstrate safe implementation practices, but they do not turn Local Storage into a trusted server-side database.

## Controls implemented

- **XSS protection:** all user-provided content is rendered with Vue text interpolation. The project does not use `v-html`, `innerHTML`, `eval`, or `document.write`. Stored free text is normalised, length-limited, stripped of control characters, and has angle brackets removed before persistence.
- **Content Security Policy:** `index.html` limits scripts, styles, fonts, images, connections, form targets and object embedding. A strict referrer policy is also set.
- **Authentication:** every account has an independent ID, random 128-bit salt, and PBKDF2-SHA-256 password-derived value with 120,000 iterations. Plaintext passwords for registered users are never written to Local Storage. Earlier SHA-256 demo records are upgraded after a successful login.
- **Authorisation:** Vue Router guards require authentication for Dashboard and require an administrator role for the Admin page. Navigation visibility is not treated as access control; direct URL access is checked too.
- **Input and data validation:** registration, login, event booking, mood check and ratings validate required fields, formats, ranges and length limits. Rating records are accepted only for known resources, authenticated user IDs, and integer scores from 1 to 5.
- **Rating integrity:** an account can have only one rating per resource. Submitting again updates the existing score, preventing one user from inflating the count through repeated clicks.
- **Redirect and secret safety:** post-login redirects accept only internal single-slash paths. The project contains no API keys or production secrets. Published demo credentials are intentionally non-sensitive test data.

## Known limitations

Because this assignment has no backend, a technically capable user can edit or delete Local Storage records with browser developer tools. Client-side role checks and validation improve the user flow but cannot provide production-grade confidentiality or tamper resistance.

A production deployment should move accounts, sessions, authorisation, validation and ratings to a secured server database; use HTTPS and secure `HttpOnly`, `SameSite` cookies; send CSP and anti-framing directives as HTTP response headers; apply server-side rate limiting and audit logging; and use a server password library such as Argon2id. The server must repeat every validation because client-side validation can be bypassed.
