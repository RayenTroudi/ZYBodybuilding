'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Pause, X, Clock, Phone, MapPin, Dumbbell, GraduationCap, TrendingUp, Target, Users, Trophy } from 'lucide-react';

export default function MembershipExpiredPage() {
  const router = useRouter();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMembership();
  }, []);

  const checkMembership = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      
      if (!data.success || !data.user) {
        router.push('/login');
        return;
      }

      // If membership is valid, redirect to dashboard
      if (data.membership?.isValid) {
        router.push('/dashboard');
        return;
      }

      setMemberData({
        user: data.user,
        membership: data.membership,
      });
    } catch (error) {
      console.error('Check membership error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-neutral-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-400">Vérification de l&apos;abonnement...</p>
        </div>
      </div>
    );
  }

  const status = memberData?.membership?.status;
  const isPaused = status === 'paused';
  const isCancelled = status === 'cancelled';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image 
              src="/images/logoNobg.png" 
              alt="ZY Bodybuilding Logo" 
              width={60} 
              height={60}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-white tracking-tight">ZY BODYBUILDING</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-neutral-900 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-800 overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-6 text-center">
            <div className="flex justify-center mb-4">
              {isPaused ? (
                <Pause className="w-16 h-16 text-white" />
              ) : isCancelled ? (
                <X className="w-16 h-16 text-white" />
              ) : (
                <Clock className="w-16 h-16 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isPaused
                ? 'Abonnement suspendu'
                : isCancelled
                  ? 'Abonnement annulé'
                  : 'Abonnement expiré'}
            </h1>
            <p className="text-white/90">
              {memberData?.user?.name && `${memberData.user.name.split(' ')[0]}, `}
              {isPaused
                ? 'votre abonnement est actuellement suspendu.'
                : isCancelled
                  ? 'votre abonnement a été annulé.'
                  : 'votre abonnement a expiré.'}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Motivational Message */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                {isPaused || isCancelled
                  ? 'Nous serons là quand vous serez prêt à revenir ! 💪'
                  : 'Vous nous manquez à la salle ! 💪'}
              </h2>
              <p className="text-neutral-400 leading-relaxed">
                {isPaused
                  ? "Prenez le temps qu'il vous faut. Quand vous serez prêt à reprendre, nous serons là pour vous accompagner à chaque étape."
                  : isCancelled
                    ? "Votre parcours fitness ne s'arrête pas ici. Revenez et atteignons vos objectifs ensemble."
                    : "Chaque champion fait des pauses, mais ce qui vous définit c'est de revenir. Vos objectifs vous attendent — atteignons-les ensemble !"}
              </p>
            </div>

            {/* Membership Details */}
            {memberData?.membership?.member && (
              <div className="bg-neutral-800 rounded-xl p-4 mb-8">
                <h3 className="text-sm font-medium text-neutral-400 mb-3">Détails de l&apos;abonnement</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500">N° de membre :</span>
                    <p className="text-white font-mono">{memberData.membership.member.memberId}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Forfait :</span>
                    <p className="text-white">{memberData.membership.member.planName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Statut :</span>
                    <p className={`font-medium ${
                      isPaused ? 'text-yellow-400' :
                      isCancelled ? 'text-red-400' : 'text-orange-400'
                    }`}>
                      {isPaused ? 'Suspendu' : isCancelled ? 'Annulé' : 'Expiré'}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-500">
                      {isPaused || isCancelled ? 'Dernière activité :' : 'Expiré le :'}
                    </span>
                    <p className="text-white">
                      {new Date(memberData.membership.member.subscriptionEndDate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Benefits Reminder */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Ce que vous manquez :
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { Icon: Dumbbell, text: 'Accès complet à la salle' },
                  { Icon: GraduationCap, text: 'Coachs experts' },
                  { Icon: TrendingUp, text: 'Suivi des progrès' },
                  { Icon: Target, text: 'Entraînements personnalisés' },
                  { Icon: Users, text: 'Cours collectifs' },
                  { Icon: Trophy, text: 'Soutien communautaire' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-neutral-300">
                    <item.Icon className="w-5 h-5 text-primary" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Offer */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-8 text-center">
              <p className="text-sm text-primary font-medium mb-1">🎁 Offre de retour</p>
              <p className="text-white font-semibold">Renouvelez maintenant et obtenez 10% de réduction !</p>
              <p className="text-neutral-400 text-xs mt-1">Contactez l&apos;accueil pour plus d&apos;informations</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/#pricing"
                className="block w-full bg-primary hover:bg-opacity-90 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Voir les forfaits
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/#contact"
                  className="flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-3 px-4 rounded-xl text-center transition-colors"
                >
                  <Phone className="w-4 h-4" /> Nous contacter
                </Link>
                <a
                  href="https://maps.google.com/?q=ZY+Bodybuilding+Gym"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-3 px-4 rounded-xl text-center transition-colors"
                >
                  <MapPin className="w-4 h-4" /> Visiter la salle
                </a>
              </div>

              <button
                onClick={handleSignOut}
                className="block w-full text-neutral-400 hover:text-white py-3 text-sm transition-colors"
              >
                Se déconnecter et retourner à l&apos;accueil
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-neutral-500 text-sm mt-6">
          Des questions ? Appelez-nous au <a href="tel:+21658800554" className="text-red-400 hover:underline">+216 58 800 554</a>
        </p>
      </div>
    </div>
  );
}
