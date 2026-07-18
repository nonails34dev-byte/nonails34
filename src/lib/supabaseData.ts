import type { Appointment, Client, InboxMessage } from '../data/adminData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://cqiaahfndgydvpqtpmed.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface ClientSpacePayload {
  profile?: { id?: string; full_name?: string; email?: string; role?: string; created_at?: string };
  appointments?: Array<{ id: string; service: string; starts_at: string; duration_minutes: number; status: Appointment['status']; notes?: string; amount_cents?: number }>;
  notes?: Array<{ id: string; body: string; created_at: string }>;
  messages?: Array<{ message?: { id: string; sender_name: string; sender_email: string; subject: string; body: string; status: InboxMessage['status']; received_at: string }; replies?: Array<{ body: string; created_at: string }> }>;
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

export async function fetchClientSpace(): Promise<{ client: Client; appointments: Appointment[]; messages: InboxMessage[] } | null> {
  const accessToken = sessionStorage.getItem('atelier-access-token');
  if (!supabaseAnonKey || !accessToken) return null;
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_client_space`, {
    method: 'POST',
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  });
  if (!response.ok) return null;
  const payload = await response.json() as ClientSpacePayload;
  const profile = payload.profile;
  if (!profile?.id) return null;
  const name = profile.full_name ?? 'Cliente';
  const appointments = (payload.appointments ?? []).map((appointment) => {
    const date = new Date(appointment.starts_at);
    return { id: appointment.id, clientId: profile.id as string, service: appointment.service, date: date.toISOString().slice(0, 10), time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), duration: appointment.duration_minutes, status: appointment.status, notes: appointment.notes ?? '', amount: Math.round((appointment.amount_cents ?? 0) / 100) };
  });
  const messages = (payload.messages ?? []).flatMap((thread) => thread.message ? [{ id: thread.message.id, sender: thread.message.sender_name, email: thread.message.sender_email, subject: thread.message.subject, preview: thread.message.body.slice(0, 90), body: thread.message.body, receivedAt: new Date(thread.message.received_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }), status: thread.message.status, initials: initials(thread.message.sender_name), color: 'mauve', relatedClientId: profile.id }] : []);
  const sharedNote = (payload.notes ?? []).map((note) => note.body).join(' ');
  return { client: { id: profile.id, name, email: profile.email ?? '', phone: '', joinedAt: profile.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10), lastVisit: appointments.find((appointment) => appointment.status === 'completed')?.date ?? '', visits: appointments.filter((appointment) => appointment.status === 'completed').length, favoriteService: appointments[0]?.service ?? 'Votre prestation', initials: initials(name), color: 'mauve', tags: [], notes: sharedNote || 'Votre atelier ajoutera bientôt un conseil personnalisé ici.' }, appointments, messages };
}
