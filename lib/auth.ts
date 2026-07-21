// Mock auth for DevTrack — authentication removed per request.
// Server components may call getCurrentUser() to receive a mock user object.

export async function getCurrentUser() {
  // Simple mock user — replace later with real auth integration
  return {
    id: 'mock-user-1',
    email: 'dev@devtrack.local',
    name: 'Dev Track User'
  } as { id: string; email: string; name?: string };
}

export async function signInWithEmail() {
  throw new Error('Auth disabled in this build — signIn not available');
}
export async function signUpWithEmail() {
  throw new Error('Auth disabled in this build — signUp not available');
}
export async function signOut() {
  // no-op
  return;
}
