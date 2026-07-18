const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://cqiaahfndgydvpqtpmed.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export type AuthRole = 'admin' | 'client';

interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  user?: { id: string; email?: string; user_metadata?: Record<string, unknown> };
  msg?: string;
  error_description?: string;
}

export const isSupabaseAuthConfigured = Boolean(supabaseAnonKey);

async function authRequest(path: string, body: Record<string, unknown>) {
  if (!supabaseAnonKey) throw new Error('La connexion Supabase n’est pas encore configurée pour cette interface.');
  const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    method: 'POST',
    headers: { apikey: supabaseAnonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json() as AuthResponse;
  if (!response.ok) throw new Error(payload.error_description ?? payload.msg ?? 'Impossible de se connecter.');
  return payload;
}

async function roleForUser(userId: string, accessToken: string): Promise<AuthRole | null> {
  if (!supabaseAnonKey) return null;
  const response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=role&limit=1`, {
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Impossible de vérifier les droits du compte.');
  const profiles = await response.json() as Array<{ role?: AuthRole }>;
  return profiles[0]?.role ?? null;
}

export async function signIn(email: string, password: string, expectedRole: AuthRole) {
  const session = await authRequest('token?grant_type=password', { email, password });
  if (!session.access_token || !session.user) throw new Error('La session Supabase est incomplète.');
  const actualRole = await roleForUser(session.user.id, session.access_token);
  if (actualRole !== expectedRole) {
    throw new Error(expectedRole === 'admin' ? 'Ce compte n’a pas les droits administrateur.' : 'Ce compte est réservé à l’administration.');
  }
  return { ...session, role: actualRole };
}

export async function signUpClient(email: string, password: string, fullName: string) {
  return authRequest('signup', { email, password, data: { full_name: fullName, role: 'client' } });
}
