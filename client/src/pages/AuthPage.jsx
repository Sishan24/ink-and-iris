import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSeo } from '../lib/hooks.js';
import { Field } from '../components/ui.jsx';

// One page for both "Join the Readers' Circle" (mode="join") and "Sign in" (mode="signin").
export default function AuthPage({ mode }) {
  const join = mode === 'join';
  useSeo(join ? 'Join the Readers’ Circle' : 'Sign in');
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser, user } = useAuth();

  const [step, setStep] = useState('details'); // details → code
  const [name, setName] = useState('');
  const [email, setEmail] = useState(params.get('email') || '');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (wait <= 0) return undefined;
    const t = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function sendCode(e) {
    e?.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post(join ? '/auth/register' : '/auth/login', join ? { name, email } : { email });
      setStep('code');
      setWait(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function verify(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { user: u } = await api.post('/auth/verify', { email, code });
      setUser(u);
      const from = location.state?.from;
      navigate(from || (u.role === 'admin' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-page section">
      <div className="mx-auto max-w-md">
        <h1 className="text-5xl">{join ? 'Join the Readers’ Circle' : 'Welcome back'}</h1>
        <p className="mt-3 text-forest/80">{join ? 'A little closer to the worlds within the pages.' : 'We will email you a one-time code. No password to remember.'}</p>

        {step === 'details' ? (
          <form onSubmit={sendCode} className="card mt-8 space-y-5 p-6" noValidate>
            {join && (
              <Field label="Full name" htmlFor="name">
                <input id="name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
              </Field>
            )}
            <Field label="Email address" htmlFor="email" hint="A one-time verification code will be sent to your email.">
              <input id="email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </Field>
            {error && <p role="alert" className="error">{error}</p>}
            <button className="btn btn-primary w-full" disabled={busy || !email || (join && !name)}>
              {busy ? 'Sending code…' : join ? 'Continue with email verification' : 'Email me a code'}
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="card mt-8 space-y-5 p-6" noValidate>
            <p role="status" className="text-sm text-forest/80">We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.</p>
            <Field label="Verification code" htmlFor="code">
              <input id="code" inputMode="numeric" pattern="[0-9]*" maxLength={6} autoComplete="one-time-code" autoFocus className="field text-center text-2xl tracking-[0.5em]" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
            </Field>
            {error && <p role="alert" className="error">{error}</p>}
            <button className="btn btn-primary w-full" disabled={busy || code.length !== 6}>{busy ? 'Checking…' : 'Verify and continue'}</button>
            <div className="flex justify-between text-sm">
              <button type="button" className="underline underline-offset-4 disabled:no-underline disabled:opacity-60" disabled={wait > 0 || busy} onClick={sendCode}>
                {wait > 0 ? `Resend code in ${wait}s` : 'Resend code'}
              </button>
              <button type="button" className="underline underline-offset-4" onClick={() => { setStep('details'); setCode(''); setError(''); }}>Use a different email</button>
            </div>
          </form>
        )}

        <p className="mt-6 text-sm text-forest/75">
          {join ? <>Already a member? <Link to="/signin" className="underline underline-offset-4">Sign in</Link></> : <>New here? <Link to="/join" className="underline underline-offset-4">Join the Readers’ Circle</Link></>}
        </p>
      </div>
    </div>
  );
}
