# BUG-001 Title: Password expired shows “Unauthorized” after login, but user can still access Ask Olly via direct link
# Module: Authentication / Authorization (Global)
# Severity: High (security/auth inconsistency)
# Priority: P1

# Preconditions / Test data:
User account in “password expired” state (or server returns password-expired on login)
# Practice environment: https://dev.everfit.io/
# Steps to reproduce:
    a. Go to Login page: https://dev.everfit.io/login
    b. Enter valid username + an password (or trigger password-expired state).
    c.Submit login.
    d. system shows popup enter user name and password and click Signin
         user name: guest
         password: o3V4PEH2WE (it is expired)
Observe the login result (UI shows “Unauthorized”).
Open Ask Olly using a direct URL (e.g., navigate to Home > Ask Olly or paste the Ask Olly link).
Observe access behavior.

# Actual result:
Login shows Unauthorized 
But user can still open Ask Olly and use the feature successfully.

# Expected result:
If the session is unauthorized/expired, user should be blocked consistently:
Either force re-login / redirect to login,
Or show a clear “Session expired” message and deny access to protected pages (including Ask Olly).
Evidence: Video "evident-login-incorrect-password.mov"