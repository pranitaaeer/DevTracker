// CSRF helpers removed — auth is disabled and CSRF flows were part of the auth stack.
// Stub functions to avoid runtime import errors; do not use in production.

export function issueCsrfToken() {
  throw new Error('CSRF helpers removed in this build.');
}
export function verifyCsrfToken() {
  throw new Error('CSRF helpers removed in this build.');
}
export function getCsrfCookieName() {
  throw new Error('CSRF helpers removed in this build.');
}
