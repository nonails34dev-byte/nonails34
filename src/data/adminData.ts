export type UserRole = 'client' | 'admin';
export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
export type MessageStatus = 'unread' | 'read';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  lastVisit: string;
  visits: number;
  favoriteService: string;
  initials: string;
  color: string;
  tags: string[];
  notes: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  notes: string;
  amount: number;
}

export interface InboxMessage {
  id: string;
  sender: string;
  email: string;
  subject: string;
  preview: string;
  body: string;
  receivedAt: string;
  status: MessageStatus;
  initials: string;
  color: string;
  relatedClientId?: string;
}

export interface InternalMessage {
  id: string;
  sender: string;
  text: string;
  sentAt: string;
  own?: boolean;
}

export const demoClients: Client[] = [
  {
    id: 'cl-001',
    name: 'Camille Moreau',
    email: 'camille.moreau@email.fr',
    phone: '06 12 48 39 71',
    joinedAt: '2025-09-14',
    lastVisit: '2026-07-08',
    visits: 12,
    favoriteService: 'Manucure signature',
    initials: 'CM',
    color: 'plum',
    tags: ['Régulière', 'Nail art'],
    notes: 'Préfère les tons doux et les formes amande. Sensibilité légère sur l’ongle de l’index droit.',
  },
  {
    id: 'cl-002',
    name: 'Élodie Bernard',
    email: 'elodie.bernard@email.fr',
    phone: '06 83 22 10 46',
    joinedAt: '2026-01-20',
    lastVisit: '2026-06-26',
    visits: 6,
    favoriteService: 'Gel naturel',
    initials: 'EB',
    color: 'mauve',
    tags: ['Régulière'],
    notes: 'Aime garder une longueur courte et naturelle. Toujours confirmer la couleur la veille.',
  },
  {
    id: 'cl-003',
    name: 'Sofia Haddad',
    email: 'sofia.haddad@email.fr',
    phone: '07 04 61 90 28',
    joinedAt: '2026-05-03',
    lastVisit: '2026-06-12',
    visits: 3,
    favoriteService: 'Nail art sur mesure',
    initials: 'SH',
    color: 'sage',
    tags: ['Nouveau', 'Nail art'],
    notes: 'Premier nail art réalisé en juin. Envoyer les inspirations avant le prochain rendez-vous.',
  },
  {
    id: 'cl-004',
    name: 'Nina Rossi',
    email: 'nina.rossi@email.fr',
    phone: '06 55 14 78 02',
    joinedAt: '2025-11-09',
    lastVisit: '2026-05-29',
    visits: 8,
    favoriteService: 'Dépose & soin',
    initials: 'NR',
    color: 'rose',
    tags: ['Régulière'],
    notes: 'Prévoir un soin nourrissant après chaque dépose.',
  },
];

export const demoAppointments: Appointment[] = [
  { id: 'apt-001', clientId: 'cl-001', service: 'Manucure signature', date: '2026-07-08', time: '10:00', duration: 75, status: 'completed', notes: 'French fine line, forme amande.', amount: 58 },
  { id: 'apt-002', clientId: 'cl-002', service: 'Gel naturel', date: '2026-07-14', time: '14:30', duration: 90, status: 'confirmed', notes: 'Confirmer la teinte nude avant la pose.', amount: 72 },
  { id: 'apt-003', clientId: 'cl-003', service: 'Nail art sur mesure', date: '2026-07-16', time: '11:00', duration: 120, status: 'confirmed', notes: 'Prévoir 3 références de motifs floraux.', amount: 95 },
  { id: 'apt-004', clientId: 'cl-004', service: 'Dépose & soin', date: '2026-07-17', time: '16:00', duration: 45, status: 'pending', notes: '', amount: 35 },
  { id: 'apt-005', clientId: 'cl-001', service: 'Nail art sur mesure', date: '2026-07-22', time: '13:30', duration: 120, status: 'confirmed', notes: 'Thème mariage, rester sur mauve et ivoire.', amount: 95 },
  { id: 'apt-006', clientId: 'cl-002', service: 'Manucure signature', date: '2026-07-25', time: '09:30', duration: 75, status: 'pending', notes: '', amount: 58 },
  { id: 'apt-007', clientId: 'cl-003', service: 'Gel naturel', date: '2026-07-28', time: '15:00', duration: 90, status: 'confirmed', notes: '', amount: 72 },
  { id: 'apt-008', clientId: 'cl-004', service: 'Manucure signature', date: '2026-07-30', time: '11:30', duration: 75, status: 'confirmed', notes: '', amount: 58 },
];

export const demoInbox: InboxMessage[] = [
  {
    id: 'msg-001', sender: 'Sofia Haddad', email: 'sofia.haddad@email.fr', subject: 'Question pour mon prochain rendez-vous',
    preview: 'Bonjour, est-ce que je peux vous envoyer mes inspirations...', body: 'Bonjour, est-ce que je peux vous envoyer mes inspirations pour le nail art avant mon rendez-vous du 28 juillet ? Je pensais à quelque chose de très fin, avec des petites fleurs mauves. Merci !', receivedAt: 'Il y a 18 min', status: 'unread', initials: 'SH', color: 'sage', relatedClientId: 'cl-003',
  },
  {
    id: 'msg-002', sender: 'Camille Moreau', email: 'camille.moreau@email.fr', subject: 'Décaler mon rendez-vous',
    preview: 'Serait-il possible de passer le mercredi un peu plus tard...', body: 'Bonjour, serait-il possible de passer le mercredi 22 un peu plus tard dans l’après-midi ? Je peux m’adapter à vos disponibilités.', receivedAt: 'Hier, 17:42', status: 'read', initials: 'CM', color: 'plum', relatedClientId: 'cl-001',
  },
  {
    id: 'msg-003', sender: 'Nina Rossi', email: 'nina.rossi@email.fr', subject: 'Merci pour le soin',
    preview: 'Merci encore, mes ongles vont beaucoup mieux...', body: 'Merci encore pour le soin, mes ongles vont beaucoup mieux. Je reprendrai rendez-vous début août.', receivedAt: '12 juil., 09:20', status: 'read', initials: 'NR', color: 'rose', relatedClientId: 'cl-004',
  },
];

export const demoInternalMessages: InternalMessage[] = [
  { id: 'im-001', sender: 'Sarah', text: 'J’ai ajouté la demande de Sofia dans ses notes client.', sentAt: '09:14' },
  { id: 'im-002', sender: 'Vous', text: 'Parfait, je lui réponds après le rendez-vous de 11h.', sentAt: '09:22', own: true },
];

export const serviceColors: Record<string, string> = {
  'Manucure signature': 'mauve',
  'Gel naturel': 'plum',
  'Nail art sur mesure': 'sage',
  'Dépose & soin': 'sand',
};

export function clientFor(clientId: string) {
  return demoClients.find((client) => client.id === clientId) ?? demoClients[0];
}
