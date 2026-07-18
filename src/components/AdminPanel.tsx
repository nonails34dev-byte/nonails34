import { useMemo, useState } from 'react';
import {
  Archive, ArrowLeft, Bell, CalendarDays, Check, ChevronLeft, ChevronRight, CircleHelp,
  Clock3, FileText, LayoutDashboard, LogOut, Mail, Menu, MessageCircle, MoreHorizontal,
  Plus, Search, Send, Settings, Sparkles, UserRound, Users, X,
} from 'lucide-react';
import {
  clientFor, demoAppointments, demoClients, demoInbox, demoInternalMessages, serviceColors,
  type Appointment, type AppointmentStatus, type Client, type InboxMessage,
} from '../data/adminData';

type AdminView = 'overview' | 'calendar' | 'messages' | 'clients' | 'team';

const navItems: { id: AdminView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { id: 'calendar', label: 'Réservations', icon: CalendarDays },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'team', label: 'Équipe & accès', icon: UserRound },
];

const monthLabels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00:00`));
}

function formatCurrentDate() {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function Avatar({ name, color = 'mauve', size = 'md' }: { name: string; color?: string; size?: 'sm' | 'md' | 'lg' }) {
  return <span className={`admin-avatar admin-avatar-${color} admin-avatar-${size}`} aria-hidden="true">{initials(name)}</span>;
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const labels: Record<AppointmentStatus, string> = { confirmed: 'Confirmé', pending: 'À confirmer', completed: 'Terminé', cancelled: 'Annulé' };
  return <span className={`admin-status admin-status-${status}`}><span className="admin-status-dot" />{labels[status]}</span>;
}

function LacePattern({ className = '' }: { className?: string }) {
  return <div className={`admin-lace-pattern ${className}`} aria-hidden="true"><span /><span /><span /></div>;
}

function AdminShell({ view, setView, children }: { view: AdminView; setView: (view: AdminView) => void; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const go = (nextView: AdminView) => { setView(nextView); setMobileOpen(false); };

  return <div className="admin-app">
    <aside className={`admin-sidebar ${mobileOpen ? 'is-open' : ''}`}>
      <div className="admin-sidebar-top">
        <div className="admin-brand"><span className="admin-brand-mark"><Sparkles size={16} /></span><span><strong>L’Atelier</strong><small>espace équipe</small></span></div>
        <button className="admin-icon-button admin-sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu"><X size={18} /></button>
      </div>
      <div className="admin-sidebar-intro"><LacePattern /><span className="admin-eyebrow admin-eyebrow-light">Bonjour, Sarah</span><h2>Votre atelier,<br /><em>en douceur.</em></h2><p>{formatCurrentDate()}</p></div>
      <nav className="admin-nav" aria-label="Navigation administration">
        <span className="admin-nav-label">Gestion</span>
        {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`admin-nav-item ${view === id ? 'is-active' : ''}`} onClick={() => go(id)}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{id === 'messages' && <b className="admin-nav-count">2</b>}</button>)}
        <span className="admin-nav-label admin-nav-label-spaced">Configuration</span>
        <button className="admin-nav-item" onClick={() => go('team')}><Settings size={18} strokeWidth={1.8} /><span>Paramètres</span></button>
      </nav>
      <div className="admin-sidebar-bottom"><div className="admin-user-card"><Avatar name="Sarah Martin" color="ivory" size="sm" /><span><strong>Sarah Martin</strong><small>Administratrice</small></span><MoreHorizontal size={16} /></div><a className="admin-logout" href="/login" onClick={() => sessionStorage.clear()}><LogOut size={16} />Se déconnecter</a></div>
    </aside>
    {mobileOpen && <button className="admin-sidebar-scrim" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu" />}
    <main className="admin-main"><header className="admin-mobile-header"><button className="admin-icon-button" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu"><Menu size={20} /></button><div className="admin-brand"><span className="admin-brand-mark"><Sparkles size={14} /></span><strong>L’Atelier</strong></div><button className="admin-icon-button" aria-label="Notifications"><Bell size={19} /><i /></button></header>{children}</main>
  </div>;
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="admin-page-header"><LacePattern className="admin-page-header-lace" /><div className="admin-page-header-copy"><span className="admin-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function StatCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof CalendarDays; tone: string }) {
  return <div className="admin-stat-card"><div className={`admin-stat-icon ${tone}`}><Icon size={19} /></div><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></div>;
}

function Overview({ setView, onSelectAppointment }: { setView: (view: AdminView) => void; onSelectAppointment: (appointment: Appointment) => void }) {
  const upcoming = demoAppointments.filter((appointment) => appointment.status === 'confirmed' || appointment.status === 'pending').slice(0, 4);
  return <div className="admin-page"><PageHeader eyebrow={formatCurrentDate()} title="Bonjour Sarah" description="Voici ce qui se passe dans votre atelier aujourd’hui." action={<button className="admin-button admin-button-primary" onClick={() => setView('calendar')}><Plus size={17} />Nouveau rendez-vous</button>} />
    <section className="admin-stats-grid"><StatCard label="Rendez-vous ce mois" value="28" detail="+12% vs. juin" icon={CalendarDays} tone="mauve" /><StatCard label="Chiffre d’affaires" value="2 460 €" detail="+8,4% vs. juin" icon={Sparkles} tone="gold" /><StatCard label="Nouveaux clients" value="12" detail="depuis le 1er juillet" icon={Users} tone="sage" /><StatCard label="Messages à traiter" value="2" detail="réponse attendue" icon={Mail} tone="rose" /></section>
    <div className="admin-overview-grid"><section className="admin-card admin-agenda-card"><div className="admin-card-heading"><div><span className="admin-eyebrow">Aujourd’hui</span><h2>Votre agenda</h2></div><button className="admin-text-button" onClick={() => setView('calendar')}>Voir le calendrier <ChevronRight size={15} /></button></div><div className="admin-timeline"><div className="admin-timeline-line" />{upcoming.map((appointment) => { const client = clientFor(appointment.clientId); return <button className="admin-agenda-row" key={appointment.id} onClick={() => onSelectAppointment(appointment)}><time>{appointment.time}</time><span className={`admin-agenda-marker marker-${serviceColors[appointment.service] ?? 'mauve'}`} /><div><strong>{appointment.service}</strong><p><Avatar name={client.name} color={client.color} size="sm" />{client.name}<span className="admin-agenda-duration"><Clock3 size={13} />{appointment.duration} min</span></p></div><StatusBadge status={appointment.status} /></button>; })}</div></section>
      <section className="admin-card admin-insight-card"><LacePattern /><div className="admin-card-heading"><div><span className="admin-eyebrow">Ce mois-ci</span><h2>Un atelier qui grandit</h2></div><Sparkles className="admin-heading-sparkle" size={21} /></div><div className="admin-chart"><div className="admin-chart-y"><span>800 €</span><span>400 €</span><span>0 €</span></div><div className="admin-chart-bars">{['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'].map((month, index) => <div key={month} className="admin-chart-bar-wrap"><div className={`admin-chart-bar ${index === 6 ? 'is-current' : ''}`} style={{ height: `${[38, 44, 52, 46, 61, 68, 86][index]}%` }}><span>{[460, 540, 630, 560, 720, 790, 980][index]} €</span></div><small>{month}</small></div>)}</div></div><div className="admin-insight-footer"><span><i className="admin-legend-dot" />Réservations confirmées</span><strong>+12,4%</strong></div></section></div>
    <section className="admin-card admin-quick-card"><div><span className="admin-eyebrow">À ne pas oublier</span><h2>Deux demandes attendent votre attention</h2></div><div className="admin-quick-actions"><button onClick={() => setView('messages')}><Mail size={17} /><span><strong>Répondre aux messages</strong><small>2 conversations non lues</small></span><ChevronRight size={16} /></button><button onClick={() => setView('calendar')}><CalendarDays size={17} /><span><strong>Confirmer les rendez-vous</strong><small>2 demandes en attente</small></span><ChevronRight size={16} /></button></div></section>
  </div>;
}

function CalendarView({ onSelectAppointment }: { onSelectAppointment: (appointment: Appointment) => void }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [mode, setMode] = useState<'month' | 'week'>('month');
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, index) => { const day = index - offset + 1; return day > 0 && day <= days ? day : null; });
  const dateKey = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const shiftMonth = (amount: number) => { const next = new Date(year, month + amount, 1); setMonth(next.getMonth()); setYear(next.getFullYear()); };
  const appointmentsFor = (day: number | null) => day ? demoAppointments.filter((appointment) => appointment.date === dateKey(day)) : [];
  return <div className="admin-page"><PageHeader eyebrow="Planning des prestations" title="Réservations" description="Gardez une vue claire sur les créneaux et les demandes de vos clientes." action={<button className="admin-button admin-button-primary"><Plus size={17} />Nouveau rendez-vous</button>} />
    <section className="admin-card admin-calendar-card"><div className="admin-calendar-toolbar"><div className="admin-calendar-month"><button className="admin-icon-button" onClick={() => shiftMonth(-1)} aria-label="Mois précédent"><ChevronLeft size={18} /></button><h2>{monthLabels[month]} <span>{year}</span></h2><button className="admin-icon-button" onClick={() => shiftMonth(1)} aria-label="Mois suivant"><ChevronRight size={18} /></button><button className="admin-today-button" onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}>Aujourd’hui</button></div><div className="admin-calendar-actions"><div className="admin-segmented"><button className={mode === 'month' ? 'is-active' : ''} onClick={() => setMode('month')}>Mois</button><button className={mode === 'week' ? 'is-active' : ''} onClick={() => setMode('week')}>Semaine</button></div><button className="admin-icon-button" aria-label="Options du calendrier"><MoreHorizontal size={18} /></button></div></div>
      <div className="admin-calendar-legend"><span><i className="admin-legend-dot legend-mauve" />Manucure</span><span><i className="admin-legend-dot legend-plum" />Gel naturel</span><span><i className="admin-legend-dot legend-sage" />Nail art</span><span><i className="admin-legend-dot legend-sand" />Soin</span></div>
      {mode === 'month' ? <div className="admin-calendar-grid"><div className="admin-calendar-weekdays">{dayLabels.map((day) => <span key={day}>{day}</span>)}</div><div className="admin-calendar-cells">{cells.map((day, index) => { const dayAppointments = appointmentsFor(day); const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear(); return <div className={`admin-calendar-cell ${day ? '' : 'is-empty'} ${isToday ? 'is-today' : ''}`} key={`${dateKey(day ?? index)}-${index}`}><span className="admin-calendar-date">{day && (isToday ? <b>{day}</b> : day)}</span>{dayAppointments.map((appointment) => <button key={appointment.id} className={`admin-calendar-event event-${serviceColors[appointment.service] ?? 'mauve'}`} onClick={() => onSelectAppointment(appointment)}><strong>{appointment.time}</strong><span>{clientFor(appointment.clientId).name}</span></button>)}</div>; })}</div></div> : <WeekView onSelectAppointment={onSelectAppointment} />}
    </section></div>;
}

function WeekView({ onSelectAppointment }: { onSelectAppointment: (appointment: Appointment) => void }) {
  const monday = new Date();
  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const weekLabels = Array.from({ length: 7 }, (_, index) => { const date = new Date(monday); date.setDate(monday.getDate() + index); return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric' }).format(date); });
  return <div className="admin-week-view"><div className="admin-week-labels"><span />{weekLabels.map((day) => <strong key={day}>{day}</strong>)}</div>{['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => <div className="admin-week-row" key={time}><time>{time}</time>{dayLabels.map((day) => <div key={`${day}-${time}`}><span /></div>)}</div>)}<button className="admin-week-event event-sage" style={{ gridColumn: '4', gridRow: '4 / span 2' }} onClick={() => onSelectAppointment(demoAppointments[2])}><strong>11:00</strong><span>Nail art · Sofia</span></button></div>;
}

function AppointmentDrawer({ appointment, onClose, onSave }: { appointment: Appointment; onClose: () => void; onSave: (appointment: Appointment) => void }) {
  const client = clientFor(appointment.clientId);
  const [notes, setNotes] = useState(appointment.notes);
  const [status, setStatus] = useState(appointment.status);
  return <div className="admin-drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="admin-drawer" aria-label="Détail de la réservation"><div className="admin-drawer-head"><span className="admin-eyebrow">Détail du rendez-vous</span><button className="admin-icon-button" onClick={onClose} aria-label="Fermer"><X size={18} /></button></div><div className="admin-drawer-date"><span className={`admin-service-orb orb-${serviceColors[appointment.service] ?? 'mauve'}`}><Sparkles size={19} /></span><div><h2>{appointment.service}</h2><p>{formatLongDate(appointment.date)} · {appointment.time}</p></div></div><div className="admin-drawer-section"><span className="admin-eyebrow">Cliente</span><div className="admin-client-summary"><Avatar name={client.name} color={client.color} size="lg" /><div><strong>{client.name}</strong><p>{client.email}</p><small>{client.visits} rendez-vous depuis {new Date(`${client.joinedAt}T12:00:00`).getFullYear()}</small></div><button className="admin-icon-button" aria-label="Voir la fiche cliente"><ArrowLeft size={16} /></button></div></div><div className="admin-drawer-section admin-detail-list"><div><span>Durée</span><strong><Clock3 size={15} />{appointment.duration} minutes</strong></div><div><span>Montant</span><strong>{appointment.amount} €</strong></div><div><span>Statut</span><select value={status} onChange={(event) => setStatus(event.target.value as AppointmentStatus)} aria-label="Statut du rendez-vous"><option value="confirmed">Confirmé</option><option value="pending">À confirmer</option><option value="completed">Terminé</option><option value="cancelled">Annulé</option></select></div></div><div className="admin-drawer-section"><label className="admin-eyebrow" htmlFor="appointment-notes">Notes internes</label><textarea id="appointment-notes" className="admin-textarea" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ajouter une note visible uniquement par l’équipe..." /><small className="admin-field-hint">Ces notes sont visibles par les administrateurs uniquement.</small></div><div className="admin-drawer-footer"><button className="admin-button admin-button-ghost" onClick={onClose}>Annuler</button><button className="admin-button admin-button-primary" onClick={() => { onSave({ ...appointment, notes, status }); onClose(); }}><Check size={16} />Enregistrer</button></div></aside></div>;
}

function MessagesView({ onSelectClient }: { onSelectClient: (client: Client) => void }) {
  const [selectedId, setSelectedId] = useState(demoInbox[0].id);
  const [messages, setMessages] = useState<InboxMessage[]>(demoInbox);
  const [reply, setReply] = useState('');
  const selected = messages.find((message) => message.id === selectedId) ?? messages[0];
  const select = (message: InboxMessage) => { setSelectedId(message.id); setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status: 'read' } : item)); };
  return <div className="admin-page"><PageHeader eyebrow="Boîte de réception" title="Messages" description="Répondez aux clientes et gardez le fil de chaque demande." action={<button className="admin-button admin-button-primary"><Plus size={17} />Nouveau message</button>} /><section className="admin-card admin-messages-card"><div className="admin-inbox-list"><div className="admin-inbox-top"><div className="admin-search"><Search size={16} /><input placeholder="Rechercher un message" aria-label="Rechercher un message" /></div><button className="admin-filter-button">Tous <ChevronRight size={14} /></button></div>{messages.map((message) => <button key={message.id} className={`admin-inbox-item ${message.id === selectedId ? 'is-selected' : ''}`} onClick={() => select(message)}><Avatar name={message.sender} color={message.color} /><span><strong>{message.sender}</strong><b>{message.subject}</b><small>{message.preview}</small></span><time>{message.receivedAt}</time>{message.status === 'unread' && <i className="admin-unread-dot" />}</button>)}</div><div className="admin-message-thread">{selected ? <><div className="admin-thread-head"><div><Avatar name={selected.sender} color={selected.color} /><span><strong>{selected.sender}</strong><small>{selected.email}</small></span></div><div><button className="admin-icon-button" onClick={() => selected.relatedClientId && onSelectClient(clientFor(selected.relatedClientId))} aria-label="Voir la cliente"><UserRound size={17} /></button><button className="admin-icon-button" aria-label="Archiver"><Archive size={17} /></button><button className="admin-icon-button" aria-label="Plus d’options"><MoreHorizontal size={17} /></button></div></div><div className="admin-thread-body"><span className="admin-thread-subject">{selected.subject}</span><time>{selected.receivedAt}</time><p>{selected.body}</p><div className="admin-related-client"><Avatar name={selected.sender} color={selected.color} size="sm" /><span><small>Cliente liée</small><strong>Voir la fiche de {selected.sender}</strong></span><ChevronRight size={15} /></div></div><div className="admin-reply"><textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Écrire une réponse..." /><div><span>La réponse sera envoyée par email</span><button className="admin-button admin-button-primary" disabled={!reply.trim()} onClick={() => setReply('')}><Send size={15} />Envoyer</button></div></div></> : <div className="admin-empty-state"><MessageCircle size={28} /><h3>Votre boîte est vide</h3><p>Les nouveaux messages apparaîtront ici.</p></div>}</div></section><InternalMessenger /></div>;
}

function InternalMessenger() {
  const [message, setMessage] = useState('');
  const [thread, setThread] = useState(demoInternalMessages);
  return <section className="admin-card admin-internal-card"><div className="admin-card-heading"><div><span className="admin-eyebrow">Entre nous</span><h2>Messagerie interne</h2></div><span className="admin-team-presence"><i />2 membres en ligne</span></div><div className="admin-internal-thread">{thread.map((item) => <div className={`admin-internal-message ${item.own ? 'is-own' : ''}`} key={item.id}><Avatar name={item.sender} color={item.own ? 'plum' : 'sage'} size="sm" /><div><span><strong>{item.sender}</strong><time>{item.sentAt}</time></span><p>{item.text}</p></div></div>)}</div><form className="admin-internal-compose" onSubmit={(event) => { event.preventDefault(); if (!message.trim()) return; setThread([...thread, { id: `im-${Date.now()}`, sender: 'Vous', text: message.trim(), sentAt: 'maintenant', own: true }]); setMessage(''); }}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Écrire à l’équipe..." aria-label="Message interne" /><button className="admin-icon-button" aria-label="Envoyer le message"><Send size={16} /></button></form></section>;
}

function ClientsView({ selectedClient, setSelectedClient }: { selectedClient: Client | null; setSelectedClient: (client: Client | null) => void }) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'clients' | 'admins'>('clients');
  const filteredClients = demoClients.filter((client) => client.name.toLowerCase().includes(query.toLowerCase()) || client.email.toLowerCase().includes(query.toLowerCase()));
  return <div className="admin-page"><PageHeader eyebrow="Base relationnelle" title="Clients" description="Toutes les clientes, leurs notes et l’historique de leurs visites au même endroit." action={<button className="admin-button admin-button-primary"><Plus size={17} />Ajouter une cliente</button>} /><section className="admin-card admin-users-card"><div className="admin-users-toolbar"><div className="admin-tabs"><button className={tab === 'clients' ? 'is-active' : ''} onClick={() => setTab('clients')}>Clients <b>184</b></button><button className={tab === 'admins' ? 'is-active' : ''} onClick={() => setTab('admins')}>Administrateurs <b>2</b></button></div><div className="admin-search admin-users-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une cliente" aria-label="Rechercher une cliente" /></div></div>{tab === 'clients' ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Cliente</th><th>Dernière visite</th><th>Prestations</th><th>Service favori</th><th>Tags</th><th /></tr></thead><tbody>{filteredClients.map((client) => <tr key={client.id} onClick={() => setSelectedClient(client)}><td><div className="admin-table-person"><Avatar name={client.name} color={client.color} /><span><strong>{client.name}</strong><small>{client.email}</small></span></div></td><td>{new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${client.lastVisit}T12:00:00`))}</td><td><strong>{client.visits}</strong> rendez-vous</td><td>{client.favoriteService}</td><td><div className="admin-tag-list">{client.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></td><td><ChevronRight size={16} /></td></tr>)}</tbody></table></div> : <div className="admin-team-list"><TeamRow name="Sarah Martin" email="sarah@latelierdesongles.fr" role="Propriétaire" status="Actif" initials="SM" color="plum" /><TeamRow name="Julie Petit" email="julie@latelierdesongles.fr" role="Administratrice" status="Actif" initials="JP" color="sage" /><button className="admin-dashed-button"><Plus size={17} />Inviter un administrateur</button></div>}</section>{selectedClient && <ClientDrawer client={selectedClient} onClose={() => setSelectedClient(null)} />}</div>;
}

function TeamRow({ name, email, role, status, color }: { name: string; email: string; role: string; status: string; initials: string; color: string }) {
  return <div className="admin-team-row"><Avatar name={name} color={color} /><div><strong>{name}</strong><small>{email}</small></div><span>{role}</span><b className="admin-team-status"><i />{status}</b><button className="admin-icon-button" aria-label={`Options pour ${name}`}><MoreHorizontal size={17} /></button></div>;
}

function ClientDrawer({ client, onClose }: { client: Client; onClose: () => void }) {
  const history = demoAppointments.filter((appointment) => appointment.clientId === client.id);
  return <div className="admin-drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="admin-drawer admin-client-drawer"><div className="admin-drawer-head"><span className="admin-eyebrow">Fiche cliente</span><button className="admin-icon-button" onClick={onClose} aria-label="Fermer"><X size={18} /></button></div><div className="admin-client-hero"><Avatar name={client.name} color={client.color} size="lg" /><h2>{client.name}</h2><p>{client.email}</p><div className="admin-client-actions"><button className="admin-button admin-button-ghost"><Mail size={15} />Message</button><button className="admin-button admin-button-primary"><Plus size={15} />Rendez-vous</button></div></div><div className="admin-client-stats"><div><strong>{client.visits}</strong><span>visites</span></div><div><strong>{client.favoriteService.replace('Manucure signature', 'Signature').replace('Nail art sur mesure', 'Nail art')}</strong><span>préférence</span></div><div><strong>{new Date(`${client.joinedAt}T12:00:00`).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</strong><span>depuis</span></div></div><div className="admin-drawer-section"><div className="admin-section-title"><span className="admin-eyebrow">Notes partagées</span><button className="admin-text-button">Modifier</button></div><small className="admin-field-hint">Visibles par la cliente dans son espace.</small><div className="admin-note-box"><FileText size={16} /><p>{client.notes}</p></div></div><div className="admin-drawer-section"><div className="admin-section-title"><span className="admin-eyebrow">Historique des rendez-vous</span><span className="admin-muted-count">{history.length} au total</span></div><div className="admin-history-list">{history.map((appointment) => <div className="admin-history-row" key={appointment.id}><div><strong>{appointment.service}</strong><small>{formatLongDate(appointment.date)} · {appointment.time}</small></div><span>{appointment.amount} €</span><StatusBadge status={appointment.status} /></div>)}</div></div></aside></div>;
}

function TeamView() {
  return <div className="admin-page"><PageHeader eyebrow="Accès & permissions" title="Équipe & accès" description="Gérez les personnes qui peuvent accéder aux réservations et aux notes internes." /><section className="admin-card admin-settings-card"><div className="admin-settings-heading"><span className="admin-service-orb orb-plum"><Settings size={19} /></span><div><h2>Permissions de l’espace</h2><p>Les clientes peuvent gérer leurs demandes. Les administrateurs voient les notes et la messagerie interne.</p></div></div><div className="admin-permission-list"><div><span><Users size={17} />Comptes clients</span><b>184 actifs</b><button className="admin-text-button">Gérer</button></div><div><span><UserRound size={17} />Administrateurs</span><b>2 membres</b><button className="admin-text-button">Gérer</button></div><div><span><Bell size={17} />Notifications email</span><b className="admin-team-status"><i />Activées</b><button className="admin-text-button">Configurer</button></div></div></section><section className="admin-card admin-settings-card"><div className="admin-card-heading"><div><span className="admin-eyebrow">Sécurité</span><h2>Bonnes pratiques</h2></div><CircleHelp size={20} /></div><p className="admin-settings-copy">Les notes de rendez-vous et la messagerie interne restent privées aux comptes administrateurs. Les règles d’accès sont également appliquées côté base de données via Supabase RLS.</p></section></div>;
}

export function AdminPanel() {
  const [view, setView] = useState<AdminView>('overview');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [appointments, setAppointments] = useState(demoAppointments);
  const selectedClientFromMessage = (client: Client) => { setSelectedClient(client); setView('clients'); };
  const appointmentForDrawer = useMemo(() => appointments.find((appointment) => appointment.id === selectedAppointment?.id) ?? selectedAppointment, [appointments, selectedAppointment]);
  return <AdminShell view={view} setView={setView}>{view === 'overview' && <Overview setView={setView} onSelectAppointment={setSelectedAppointment} />}{view === 'calendar' && <CalendarView onSelectAppointment={setSelectedAppointment} />}{view === 'messages' && <MessagesView onSelectClient={selectedClientFromMessage} />}{view === 'clients' && <ClientsView selectedClient={selectedClient} setSelectedClient={setSelectedClient} />}{view === 'team' && <TeamView />}{appointmentForDrawer && <AppointmentDrawer appointment={appointmentForDrawer} onClose={() => setSelectedAppointment(null)} onSave={(updated) => setAppointments((current) => current.map((appointment) => appointment.id === updated.id ? updated : appointment))} />}</AdminShell>;
}
