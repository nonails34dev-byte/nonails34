import { useState } from 'react';
import { ArrowLeft, ArrowRight, KeyRound, Mail, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { isSupabaseAuthConfigured, signIn as signInWithSupabase, signUpClient } from '../lib/supabaseAuth';

type AccountRole = 'admin' | 'client';

export function AuthPage() {
  const [role, setRole] = useState<AccountRole>('client');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!email.trim() || !password.trim() || (isSignUp && !fullName.trim())) {
      setError(isSignUp ? 'Renseignez votre nom, votre email et votre mot de passe.' : 'Entrez votre email et votre mot de passe pour continuer.');
      return;
    }
    if (!isSupabaseAuthConfigured) {
      setError('La connexion Supabase n’est pas configurée. Utilisez l’aperçu local ci-dessous pour tester les espaces.');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const result = await signUpClient(email.trim(), password, fullName.trim());
        if (!result.access_token) {
          setNotice('Votre compte est créé. Vérifiez votre email pour confirmer votre adresse, puis connectez-vous.');
          setIsSignUp(false);
        } else {
          sessionStorage.setItem('atelier-role', 'client');
          sessionStorage.setItem('atelier-access-token', result.access_token);
          window.location.href = '/client';
        }
      } else {
        const result = await signInWithSupabase(email.trim(), password, role);
        sessionStorage.setItem('atelier-role', role);
        if (result.access_token) sessionStorage.setItem('atelier-access-token', result.access_token);
        window.location.href = role === 'admin' ? '/admin' : '/client';
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Impossible de se connecter.');
    } finally {
      setLoading(false);
    }
  };

  const preview = (previewRole: AccountRole) => { sessionStorage.setItem('atelier-role', previewRole); sessionStorage.setItem('atelier-preview', 'true'); window.location.href = previewRole === 'admin' ? '/admin' : '/client'; };

  return <div className="auth-page">
    <div className="auth-art"><div className="auth-art-inner"><span className="auth-mark"><Sparkles size={17} /></span><span className="auth-eyebrow">L’Atelier des Ongles</span><h1>Un espace pensé<br /><em>pour vous.</em></h1><p>Retrouvez vos rendez-vous, vos échanges et les petits conseils de votre atelier en un seul endroit.</p><div className="auth-art-note"><ShieldCheck size={16} /><span>Vos informations restent privées et protégées.</span></div></div><div className="auth-art-pattern" /></div>
    <main className="auth-card-wrap"><a className="auth-back" href="/"><ArrowLeft size={15} />Retour au site</a><div className="auth-card"><div className="auth-card-heading"><span className="auth-eyebrow">Bienvenue dans votre espace</span><h2>{isSignUp ? 'Créer mon compte' : 'Se connecter'}</h2><p>{isSignUp ? 'Créez votre espace client pour retrouver vos rendez-vous et conseils.' : 'Choisissez le type de compte avec lequel vous souhaitez entrer.'}</p></div>{!isSignUp && <div className="auth-role-switch"><button className={role === 'client' ? 'is-active' : ''} onClick={() => setRole('client')} type="button"><span><UserRound size={18} /></span><strong>Client</strong><small>Mes rendez-vous & messages</small></button><button className={role === 'admin' ? 'is-active' : ''} onClick={() => setRole('admin')} type="button"><span><ShieldCheck size={18} /></span><strong>Administrateur</strong><small>Gestion de l’atelier</small></button></div>}<form className="auth-form" onSubmit={signIn}>{isSignUp && <label>Votre nom<div className="auth-input"><UserRound size={16} /><input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Camille Moreau" autoComplete="name" /></div></label>}<label>Email professionnel ou personnel<div className="auth-input"><Mail size={16} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={role === 'admin' ? 'vous@latelierdesongles.fr' : 'vous@email.fr'} autoComplete="email" /></div></label><label>Mot de passe<div className="auth-input"><KeyRound size={16} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Votre mot de passe" autoComplete={isSignUp ? 'new-password' : 'current-password'} /></div></label>{error && <p className="auth-error" role="alert">{error}</p>}{notice && <p className="auth-notice" role="status">{notice}</p>}<button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Connexion en cours…' : isSignUp ? 'Créer mon espace' : 'Accéder à mon espace'} {!loading && <ArrowRight size={16} />}</button></form><div className="auth-help">{isSignUp ? <><span>Vous avez déjà un compte ?</span><button type="button" onClick={() => setIsSignUp(false)}>Se connecter</button></> : <><span>Première visite ?</span><button type="button" onClick={() => { setRole('client'); setIsSignUp(true); }}>Créer un compte client</button></>}</div><div className="auth-preview"><span>Aperçu local de l’interface</span><div><button type="button" onClick={() => preview('client')}>Voir espace client</button><button type="button" onClick={() => preview('admin')}>Voir espace admin</button></div></div></div><p className="auth-footer">L’Atelier des Ongles · Un moment pour soi</p></main>
  </div>;
}
