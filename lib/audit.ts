// Audit logging removed — authentication/integration code was removed per user request.
// Keep a stub so accidental imports fail loudly in development.

export async function logAudit() {
  throw new Error('logAudit is removed in this build. Audit logging is disabled.');
}
