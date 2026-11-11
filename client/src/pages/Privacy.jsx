import { useSeo } from '../lib/hooks.js';

export default function Privacy() {
  useSeo('Privacy policy');
  return (
    <div className="container-page section">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-5xl">Privacy policy</h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-forest/90">
          <p>This site collects only what it needs to run the Readers’ Circle and to let you write to the author.</p>
          <h2 className="pt-4 text-3xl">What we collect</h2>
          <p>When you join, we store your name and email address. When you sign in, we email you a one-time code and keep only a scrambled copy of it for ten minutes. When you use “Speak to the Author”, we store your name, email, subject and message so the author can read and reply.</p>
          <h2 className="pt-4 text-3xl">How it is used</h2>
          <p>Your details are used to give you access to your account and to answer your messages. They are not sold or shared for advertising.</p>
          <h2 className="pt-4 text-3xl">Cookies</h2>
          <p>One cookie keeps you signed in. It is needed for the site to work and is removed when you sign out.</p>
          <h2 className="pt-4 text-3xl">Your choices</h2>
          <p>You can delete your account at any time from your account page. To remove a message you sent, write to the author through the contact page.</p>
        </div>
      </div>
    </div>
  );
}
