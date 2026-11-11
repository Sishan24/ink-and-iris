import { Link } from 'react-router-dom';

export const Spinner = ({ label = 'Loading…' }) => (
  <p role="status" className="py-16 text-center text-forest/70">
    {label}
  </p>
);

export const ErrorNote = ({ error }) => (
  <p role="alert" className="py-16 text-center text-rose-deep">
    {error?.message || 'Something went wrong. Please try again.'}
  </p>
);

export function PageIntro({ title, children }) {
  return (
    <div className="container-page pb-4 pt-14 sm:pt-20">
      <h1 className="text-5xl sm:text-6xl">{title}</h1>
      {children && <p className="mt-4 max-w-2xl text-lg text-forest/80">{children}</p>}
    </div>
  );
}

export const Empty = ({ children, to, cta }) => (
  <div className="container-page py-16 text-center text-forest/75">
    <p>{children}</p>
    {to && (
      <Link to={to} className="btn btn-ghost mt-4">
        {cta}
      </Link>
    )}
  </div>
);

export const Field = ({ label, error, hint, children, htmlFor }) => (
  <div>
    <label htmlFor={htmlFor} className="label">
      {label}
    </label>
    {children}
    {hint && !error && <p className="hint">{hint}</p>}
    {error && <p className="error">{error}</p>}
  </div>
);
