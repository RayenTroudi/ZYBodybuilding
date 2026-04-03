'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Attempting login...', { email });
      const result = await signIn(email, password);
      console.log('📝 Login result:', result);
      
      if (result.success) {
        console.log('✅ Login successful, checking membership status...');
        
        // Check auth status to determine where to redirect
        const authRes = await fetch('/api/auth/check');
        const authData = await authRes.json();
        
        if (authData.membership?.requiresPasswordReset) {
          // First-time login - need to change password
          router.push('/reset-password');
        } else if (authData.membership && !authData.membership.isValid) {
          // Membership expired
          router.push('/membership-expired');
        } else {
          // All good - go to dashboard
          router.push('/dashboard');
        }
        router.refresh();
      } else {
        console.error('❌ Login failed:', result.error);
        setError(result.error || 'Connexion échouée. Veuillez vérifier vos identifiants.');
      }
    } catch (err) {
      console.error('💥 Login error:', err);
      setError(`Une erreur est survenue : ${err.message || 'Veuillez réessayer.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full mx-4">
        <div className="bg-neutral-900 rounded-lg shadow-lg p-8 border border-neutral-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
            <p className="text-neutral-400">ZY Bodybuilding Gym</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-400">
            <p className="mt-2">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-primary hover:opacity-80 font-medium">
                S&apos;inscrire ici
              </Link>
            </p>
            <p className="mt-3">
              <Link href="/" className="text-neutral-500 hover:text-neutral-400">
                ← Retour à l&apos;accueil
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
