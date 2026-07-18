import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, Check, ChevronRight, Clock3, FileText, Heart, LogOut, Mail, Menu, MessageCircle, MoreHorizontal, Plus, Send, Sparkles } from 'lucide-react';
import { demoAppointments, demoClients, demoInbox, serviceColors, type Appointment, type InboxMessage } from '../data/adminData';
import { fetchClientSpace } from '../lib/supabaseData';

type ClientView = 'home' | 'appointments' | 'notes' | 'messages';

const demoClient = demoClients[0];
const demoClientAppointments = demoAppointments.filter((appointment) => appointment.clientId === demoClient.id);
type ClientSpaceData = { client: typeof demoClient; appointments: Appointment[]; messages: InboxMessage[] };
const demoClientSpace: ClientSpaceData = { client: demoClient, appointments: demoClientAppointments, messages: demoInbox.filter((message) => message.relatedClientId === demoClient.id) };
const ClientDataContext = createContext<ClientSpaceData>(demoClientSpace);
function useClientData() { return useContext(ClientDataContext); }

function dateLabel(date: string, options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }) {
  return new Intl.DateTimeFormat('fr-FR', options).format(new Date(`${date}T12:00:00`));
}

function ClientAvatar({ size = '' }: { size?: string }) {
  const { client } = useClientData();
  return <span className={`client-avatar ${size}`}>{client.initials}</span>;
}

function ClientStatus({ status }: { status: Appointment['status'] }) {
  const labels = { confirmed: 'Confirmé', pending: 'En attente', completed: 'Terminé', cancelled: 'Annulé' };
  return <span className={`client-status client-status-${status}`}><i />{labels[status]}</span>;
}

function ClientShell({ view, setView, children }: { view: ClientView; setView: (view: ClientView) => void; children: React.ReactNode }) {
  const { client } = useClientData();
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (next: ClientView) => { setView(next); setMenuOpen(false); };
  const nav: { id: ClientView; label: string; icon: typeof CalendarDays }[] = [{ id: 'home', label: 'Mon espace', icon: Heart }, { id: 'appointments', label: 'Mes rendez-vous', icon: CalendarDays }, { id: 'notes', label: 'Mes conseils', icon: FileText }, { id: 'messages', label: 'Messages', icon: Mail }];
  return <div className="client-app"><header className="client-header"><a className="client-brand" href="/"><span className="client-brand-mark"><Sparkles size={15} /></span><span><strong>L’Atelier</strong><small>mon espace</small></span></a><button className="client-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu"><Menu size={20} /></button><nav className={`client-nav ${menuOpen ? 'is-open' : ''}`}>{nav.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'is-active' : ''} onClick={() => go(id)}><Icon size={16} />{label}</button>)}<span className="client-nav-divider" /><button className="client-profile-link" onClick={() => setMenuOpen(false)}><ClientAvatar size="small" /><span>{client.name.split(' ')[0]}</span><MoreHorizontal size={16} /></button><a className="client-logout" href="/login"><LogOut size={15} />Se déconnecter</a></nav></header><main className="client-main">{children}</main><footer className="client-footer"><span>Une question ?</span><button onClick={() => setView('messages')}>Écrire à l’atelier <ArrowRight size={14} /></button><span className="client-footer-mark"><Sparkles size={13} />L’Atelier des Ongles</span></footer></div>;
}

function ClientPageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: React.ReactNode; description: string; action?: React.ReactNode }) {
  return <div className="client-page-header"><div><span className="client-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function HomeView({ setView }: { setView: (view: ClientView) => void }) {
  const { client, appointments: clientAppointments } = useClientData();
  const nextAppointment = clientAppointments.find((appointment) => appointment.status === 'confirmed' || appointment.status === 'pending');
  const pastAppointments = clientAppointments.filter((appointment) => appointment.status === 'completed');
  return <div className="client-page"><ClientPageHeader eyebrow="Mercredi 18 juillet 2026" title={<>Bonjour Camille <span className="client-title-flower">✦</span></>} description="Ravie de vous retrouver dans votre espace personnel." action={<button className="client-button client-button-primary" onClick={() => setView('appointments')}><Plus size={16} />Prendre rendez-vous</button>} /><section className="client-welcome-card"><div><span className="client-eyebrow client-eyebrow-light">Votre prochain rendez-vous</span><h2>{nextAppointment ? nextAppointment.service : 'Un moment rien que pour vous'}</h2>{nextAppointment ? <p><CalendarDays size={15} />{dateLabel(nextAppointment.date)} · {nextAppointment.time}</p> : <p>Choisissez le prochain moment qui vous fera du bien.</p>}<button className="client-light-button" onClick={() => setView('appointments')}>{nextAppointment ? 'Voir les détails' : 'Découvrir les disponibilités'} <ArrowRight size={14} /></button></div><div className="client-welcome-orbit"><Sparkles size={42} /><span>un peu<br /><em>de douceur</em></span></div><div className="client-card-lace" /></section><div className="client-home-grid"><section className="client-card client-visit-card"><div className="client-card-heading"><div><span className="client-eyebrow">Votre histoire</span><h2>Déjà {client.visits} visites ensemble</h2></div><Heart size={20} /></div><div className="client-visit-progress"><span style={{ width: '72%' }} /></div><p className="client-muted-copy">Merci pour votre confiance depuis septembre 2025. Chaque visite est un petit rituel rien qu’à vous.</p><button className="client-text-button" onClick={() => setView('appointments')}>Voir mon historique <ChevronRight size={14} /></button></section><section className="client-card client-note-preview"><div className="client-card-heading"><div><span className="client-eyebrow">Un mot pour vous</span><h2>Les conseils de l’atelier</h2></div><FileText size={20} /></div><p>{client.notes}</p><button className="client-text-button" onClick={() => setView('notes')}>Voir tous mes conseils <ChevronRight size={14} /></button></section></div><section className="client-card client-home-message"><div className="client-card-heading"><div><span className="client-eyebrow">Besoin d’aide ?</span><h2>Échangez avec votre atelier</h2><p>Une question sur une prestation ou votre prochain rendez-vous ? Nous sommes là.</p></div><span className="client-message-icon"><MessageCircle size={21} /></span></div><button className="client-button client-button-soft" onClick={() => setView('messages')}>Ouvrir mes messages <ArrowRight size={15} /></button></section><div className="client-home-footnote"><Clock3 size={14} />Réponse habituelle sous 24 heures · <span>{pastAppointments.length} rendez-vous terminés</span></div></div>;
}

function AppointmentsView({ setView }: { setView: (view: ClientView) => void }) {
  const { appointments: clientAppointments } = useClientData();
  const upcoming = clientAppointments.filter((appointment) => appointment.status !== 'completed' && appointment.status !== 'cancelled');
  const past = clientAppointments.filter((appointment) => appointment.status === 'completed');
  return <div className="client-page"><ClientPageHeader eyebrow="Mon planning" title="Mes rendez-vous" description="Retrouvez vos prochains moments à l’atelier, ainsi que votre historique." action={<button className="client-button client-button-primary"><Plus size={16} />Demander un rendez-vous</button>} /><div className="client-appointment-layout"><section><div className="client-section-label"><span>À venir</span><b>{upcoming.length}</b></div>{upcoming.length ? upcoming.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />) : <EmptyClientState icon={CalendarDays} title="Aucun rendez-vous prévu" text="Vous méritez bien un nouveau moment pour vous." button="Prendre rendez-vous" onClick={() => setView('home')} />}</section><section><div className="client-section-label"><span>Historique</span><b>{past.length}</b></div><div className="client-history-list">{past.map((appointment) => <div className="client-history-item" key={appointment.id}><span className={`client-service-dot client-service-${serviceColors[appointment.service] ?? 'mauve'}`} /><div><strong>{appointment.service}</strong><small>{dateLabel(appointment.date, { day: 'numeric', month: 'long', year: 'numeric' })}</small></div><span>{appointment.amount} €</span><Check size={15} /></div>)}</div></section></div></div>;
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return <article className="client-appointment-card"><div className={`client-service-orb client-orb-${serviceColors[appointment.service] ?? 'mauve'}`}><Sparkles size={19} /></div><div className="client-appointment-main"><div className="client-appointment-top"><ClientStatus status={appointment.status} /><span>{appointment.amount} €</span></div><h2>{appointment.service}</h2><p><CalendarDays size={14} />{dateLabel(appointment.date)} · {appointment.time}</p><p><Clock3 size={14} />{appointment.duration} minutes</p><div className="client-appointment-actions"><button className="client-button client-button-soft">Voir les détails</button><button className="client-subtle-action">Demander une modification</button></div></div></article>;
}

function NotesView({ setView }: { setView: (view: ClientView) => void }) {
  const { client } = useClientData();
  return <div className="client-page"><ClientPageHeader eyebrow="Conseils personnalisés" title="Mes conseils" description="Les petites attentions et recommandations laissées par votre atelier." /><div className="client-notes-layout"><section className="client-card client-note-main"><div className="client-note-quote">“</div><span className="client-eyebrow">Conseil de Sarah · 08 juillet 2026</span><h2>Prendre soin de vos ongles entre deux visites</h2><p>{client.notes}</p><p>Pensez à hydrater vos cuticules chaque soir avec une huile douce. Évitez également d’utiliser vos ongles comme outils : ils vous remercieront.</p><div className="client-note-signature"><span className="client-avatar client-avatar-small">SM</span><span><strong>Sarah</strong><small>Votre atelier</small></span></div></section><section className="client-notes-side"><div className="client-card client-checklist"><span className="client-eyebrow">Votre rituel</span><h2>Les bons gestes</h2><div><Check size={14} /><span>Hydrater les cuticules chaque soir</span></div><div><Check size={14} /><span>Porter des gants pour le ménage</span></div><div><Check size={14} /><span>Ne pas limer la surface de l’ongle</span></div><div><Check size={14} /><span>Prendre rendez-vous en cas de décollement</span></div></div><div className="client-card client-note-contact"><Sparkles size={18} /><h3>Une question sur ce conseil ?</h3><p>Écrivez-nous, nous vous répondrons avec plaisir.</p><button className="client-text-button" onClick={() => setView('messages')}>Écrire à Sarah <ArrowRight size={14} /></button></div></section></div></div>;
}

function MessagesView() {
  const { client, messages: clientMessages } = useClientData();
  const initialMessages = useMemo(() => clientMessages, [clientMessages]);
  const [messages, setMessages] = useState<InboxMessage[]>(initialMessages);
  const [selectedId, setSelectedId] = useState(initialMessages[0]?.id ?? 'new');
  const [draft, setDraft] = useState('');
  const selected = messages.find((message) => message.id === selectedId);
  useEffect(() => { setMessages(initialMessages); setSelectedId(initialMessages[0]?.id ?? 'new'); }, [initialMessages]);
  const send = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!draft.trim()) return; const sent: InboxMessage = { id: `client-${Date.now()}`, sender: client.name, email: client.email, subject: 'Message à l’atelier', preview: draft.trim(), body: draft.trim(), receivedAt: 'À l’instant', status: 'unread', initials: client.initials, color: client.color, relatedClientId: client.id }; setMessages((current) => [...current, sent]); setSelectedId(sent.id); setDraft(''); };
  return <div className="client-page"><ClientPageHeader eyebrow="Votre conversation" title="Messages" description="Échangez simplement avec l’équipe de L’Atelier." action={<button className="client-button client-button-primary" onClick={() => setSelectedId('new')}><Plus size={16} />Nouveau message</button>} /><section className="client-card client-messages-card"><div className="client-conversation-list"><span className="client-eyebrow">Conversations</span>{messages.map((message) => <button className={`client-conversation-item ${selectedId === message.id ? 'is-active' : ''}`} key={message.id} onClick={() => setSelectedId(message.id)}><span className="client-message-avatar"><MessageCircle size={15} /></span><span><strong>{message.subject}</strong><small>{message.preview}</small></span><time>{message.receivedAt}</time></button>)}<button className={`client-conversation-new ${selectedId === 'new' ? 'is-active' : ''}`} onClick={() => setSelectedId('new')}><Plus size={15} />Écrire un nouveau message</button></div><div className="client-conversation-thread">{selected ? <><div className="client-thread-heading"><div><span className="client-eyebrow">Avec Sarah · L’Atelier</span><h2>{selected.subject}</h2></div><span className="client-thread-badge">Réponse sous 24h</span></div><div className="client-thread-bubble client-thread-bubble-own"><p>{selected.body}</p><time>{selected.receivedAt}</time></div><div className="client-thread-reply"><span className="client-avatar client-avatar-small">SM</span><div><strong>Sarah</strong><small>Votre atelier vous répondra ici</small></div></div></> : <div className="client-new-message"><span className="client-message-icon"><MessageCircle size={23} /></span><h2>Écrire à l’atelier</h2><p>Une question, une envie ou un changement de rendez-vous ?</p></div>}<form className="client-compose" onSubmit={send}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Écrire votre message..." aria-label="Votre message" /><button className="client-button client-button-primary" type="submit" disabled={!draft.trim()}><Send size={15} />Envoyer</button></form></div></section></div>;
}

function EmptyClientState({ icon: Icon, title, text, button, onClick }: { icon: typeof CalendarDays; title: string; text: string; button: string; onClick: () => void }) {
  return <div className="client-empty-state"><Icon size={24} /><h3>{title}</h3><p>{text}</p><button className="client-text-button" onClick={onClick}>{button} <ArrowRight size={14} /></button></div>;
}

export function ClientSpace() {
  const [view, setView] = useState<ClientView>('home');
  const [space, setSpace] = useState<ClientSpaceData>(demoClientSpace);
  useEffect(() => { let active = true; fetchClientSpace().then((liveSpace) => { if (active && liveSpace) setSpace(liveSpace); }).catch(() => undefined); return () => { active = false; }; }, []);
  return <ClientDataContext.Provider value={space}><ClientShell view={view} setView={setView}>{view === 'home' && <HomeView setView={setView} />}{view === 'appointments' && <AppointmentsView setView={setView} />}{view === 'notes' && <NotesView setView={setView} />}{view === 'messages' && <MessagesView />}</ClientShell></ClientDataContext.Provider>;
}
