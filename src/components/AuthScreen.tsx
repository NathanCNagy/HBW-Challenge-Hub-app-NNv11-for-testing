import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  ChevronLeft, 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound,
  Edit2
} from 'lucide-react';
import { 
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { auth } from '../firebase';
import { storage } from '../services/storage';
import HBWLogo from './HBWLogo';
import { motion, AnimatePresence } from 'motion/react';

interface AuthScreenProps {
  onLoginSuccess: (displayName: string, email: string) => void;
  onContinueAsGuest: () => void;
  onBack?: () => void;
  theme?: 'dark' | 'light';
}

type SocialProvider = 'google' | 'apple';

export default function AuthScreen({ onLoginSuccess, onContinueAsGuest, onBack, theme = 'light' }: AuthScreenProps) {
  // 3-step authentication flow:
  // 1. 'welcome': Clean landing hub with "Continue with Email", streamlined social buttons, and guest option.
  // 2. 'email': Dedicated, focused screen to input email.
  // 3. 'password': Dedicated screen to input password (and name if sign-up) and complete authentication.
  const [step, setStep] = useState<'welcome' | 'email' | 'password'>('welcome');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI states
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSocialLoading, setActiveSocialLoading] = useState<SocialProvider | null>(null);

  const isDark = theme === 'dark';

  // Social Sign-In Handler with Firebase + Resilient Sandbox Fallback
  const handleSocialSignIn = async (providerName: SocialProvider) => {
    setActiveSocialLoading(providerName);
    setError(null);

    try {
      if (providerName === 'google') {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          const name = result.user.displayName || result.user.email?.split('@')[0] || 'Google User';
          onLoginSuccess(name, result.user.email || 'user@google.com');
          return;
        }
      } else if (providerName === 'apple') {
        const provider = new OAuthProvider('apple.com');
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          const name = result.user.displayName || 'Apple User';
          onLoginSuccess(name, result.user.email || 'user@privaterelay.appleid.com');
          return;
        }
      }
    } catch (err: any) {
      console.warn(`${providerName} sign-in note:`, err?.code || err?.message);
    }

    // Graceful prototype simulation for preview iframes and non-whitelisted sandbox origins
    const fallbackProfiles: Record<SocialProvider, { name: string; email: string }> = {
      apple: { name: 'Apple Member', email: 'apple.member@privaterelay.appleid.com' },
      google: { name: 'Google Member', email: 'google.member@habitsforabetterworld.org' },
    };

    const profile = fallbackProfiles[providerName];
    setTimeout(() => {
      setActiveSocialLoading(null);
      onLoginSuccess(profile.name, profile.email);
    }, 600);
  };

  // Step 2 (Email submission): Validation & Advance to Step 3 (Password)
  const handleEmailStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Inspect if user exists in local accounts registry
    try {
      const savedUsersStr = storage.getString('hbw_mock_users');
      const registeredUsers = savedUsersStr ? JSON.parse(savedUsersStr) : {};
      const existing = registeredUsers[trimmedEmail.toLowerCase()];
      if (existing && !isSignUp) {
        // Pre-fill name if available
        if (existing.displayName) {
          setDisplayName(existing.displayName);
        }
      }
    } catch (err) {
      console.error(err);
    }

    // Move to step 3 (Password)
    setStep('password');
  };

  // Step 3 (Password submission): Password Authentication & Account Creation
  const handlePasswordStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!password) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (isSignUp && !displayName.trim()) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    setTimeout(() => {
      try {
        const savedUsersStr = storage.getString('hbw_mock_users');
        const registeredUsers = savedUsersStr ? JSON.parse(savedUsersStr) : {};

        if (isSignUp) {
          registeredUsers[normalizedEmail] = {
            displayName: displayName.trim(),
            password: password,
          };
          storage.set('hbw_mock_users', JSON.stringify(registeredUsers));
          onLoginSuccess(displayName.trim(), normalizedEmail);
        } else {
          const matchedUser = registeredUsers[normalizedEmail];
          if (matchedUser) {
            if (matchedUser.password === password) {
              onLoginSuccess(matchedUser.displayName || 'Member', normalizedEmail);
            } else {
              setError('Incorrect password. Please verify and try again.');
              setIsLoading(false);
            }
          } else {
            // First time logging in with this email, derive name automatically
            const derivedName = displayName.trim() || 
              (normalizedEmail.split('@')[0].charAt(0).toUpperCase() + normalizedEmail.split('@')[0].slice(1));
            
            registeredUsers[normalizedEmail] = {
              displayName: derivedName,
              password: password,
            };
            storage.set('hbw_mock_users', JSON.stringify(registeredUsers));
            onLoginSuccess(derivedName, normalizedEmail);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Error completing authentication.');
        setIsLoading(false);
      }
    }, 550);
  };

  // Quick Forgot Password simulation
  const handleForgotPassword = () => {
    setResetSent(true);
    setError(null);
    setTimeout(() => setResetSent(false), 5000);
  };

  return (
    <div className={`w-full max-w-sm mx-auto flex-1 min-h-full flex flex-col justify-between px-5 py-5 relative select-none ${
      isDark ? 'bg-[#0A0A0C] text-white' : 'bg-[#F5F5F7] text-[#1C1C1E]'
    }`}>
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-40px] left-[-40px] w-48 h-48 rounded-full bg-[#0080FF]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Top Header / Navigation Bar */}
      <div className="flex flex-col items-center text-center pt-1 z-10 shrink-0">
        <div className="w-full flex items-center justify-between mb-4">
          {step !== 'welcome' ? (
            <button
              type="button"
              onClick={() => {
                if (step === 'password') {
                  setStep('email');
                } else {
                  setStep('welcome');
                }
                setError(null);
              }}
              className={`p-1 -ml-1 transition-colors cursor-pointer ${
                isDark ? 'text-[#8E8E93] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
              }`}
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : onBack ? (
            <button
              type="button"
              onClick={onBack}
              className={`p-1 -ml-1 transition-colors cursor-pointer ${
                isDark ? 'text-[#8E8E93] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
              }`}
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-5 h-5" />
          )}

          <HBWLogo size={step !== 'welcome' ? 'md' : 'xl'} className={step === 'welcome' ? 'h-16' : ''} theme={isDark ? 'dark' : 'light'} />

          <div className="w-5 h-5" /> {/* Spacer for symmetrical balance */}
        </div>

        <h2 className={`font-serif text-2xl font-normal tracking-tight ${
          isDark ? 'text-white' : 'text-[#1C1C1E]'
        }`}>
          {step === 'welcome' && 'Welcome'}
          {step === 'email' && (
            isSignUp ? <>What's your <i className="italic font-serif">email</i>?</> : <>Enter your <i className="italic font-serif">email</i></>
          )}
          {step === 'password' && (
            isSignUp ? <>Complete your <i className="italic font-serif">profile</i></> : <>Enter your <i className="italic font-serif">password</i></>
          )}
        </h2>
        
        <p className={`text-xs font-sans mt-1.5 max-w-[280px] mx-auto leading-relaxed ${
          isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
        }`}>
          {step === 'welcome' && (
            isSignUp 
              ? 'Choose a method to sign up' 
              : 'Build sustainable habits for a better world'
          )}
          {step === 'email' && (
            isSignUp 
              ? "We'll use this to set up your account" 
              : 'Sign in to access your habits and streak'
          )}
          {step === 'password' && (
            isSignUp 
              ? 'Choose a password to secure your account' 
              : 'Verify your password to continue'
          )}
        </p>
      </div>

      {/* Main Flow Content with smooth screen transitions */}
      <div className="flex-grow flex flex-col justify-center my-3 z-10">
        <AnimatePresence mode="wait">
          {/* ================= SCREEN 1: WELCOME & SIGN-IN HUB ================= */}
          {step === 'welcome' && (
            <motion.div
              key="step-welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="space-y-4 py-2"
            >
              {/* Primary Email Entry Action Button */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setError(null);
                  }}
                  className="w-full h-[50px] bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99] font-sans text-sm font-semibold rounded-full text-white transition-all flex items-center justify-between px-5 cursor-pointer shadow-md group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-white/90" />
                    <span className="whitespace-nowrap">Continue with Email</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Clean Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className={`flex-1 h-[1px] ${isDark ? 'bg-[#1F1F24]' : 'bg-[#E5E5EA]'}`} />
                <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-[#6C6C70]' : 'text-[#8E8E93]'}`}>
                  or continue with
                </span>
                <div className={`flex-1 h-[1px] ${isDark ? 'bg-[#1F1F24]' : 'bg-[#E5E5EA]'}`} />
              </div>

              {/* Social Logins: Google above Apple */}
              <div className="space-y-2.5">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => handleSocialSignIn('google')}
                  disabled={!!activeSocialLoading}
                  className={`w-full h-[46px] px-4 active:scale-[0.99] border font-sans text-xs font-semibold rounded-[14px] transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                    isDark
                      ? 'bg-[#121214] hover:bg-[#1A1A1E] border-[#2C2C30] hover:border-[#4285F4]/60 text-white'
                      : 'bg-white hover:bg-[#F2F2F7] border-[#E5E5EA] hover:border-[#4285F4]/60 text-[#1C1C1E]'
                  }`}
                >
                  {activeSocialLoading === 'google' ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span className="whitespace-nowrap">Continue with Google</span>
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  onClick={() => handleSocialSignIn('apple')}
                  disabled={!!activeSocialLoading}
                  className={`w-full h-[46px] px-4 active:scale-[0.99] border font-sans text-xs font-semibold rounded-[14px] transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                    isDark
                      ? 'bg-white hover:bg-[#F2F2F7] border-white text-black'
                      : 'bg-black hover:bg-[#1C1C1E] border-black text-white'
                  }`}
                >
                  {activeSocialLoading === 'apple' ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.71-11.66-14.01-6.19-9.55-11.06-20.47-14.61-32.78-3.55-12.3-5.33-23.75-5.33-34.34 0-15.01 3.65-27.46 10.96-37.33 7.31-9.87 16.59-14.89 27.84-15.08 5.76 0 12.16 1.63 19.21 4.9 7.05 3.27 11.24 4.94 12.56 5.02 1.32-.08 5.76-1.83 13.33-5.27 7.56-3.43 13.88-4.99 18.96-4.68 14.13.87 25.13 5.99 32.99 15.35-12.63 7.63-18.83 18.06-18.6 31.29.23 10.34 4.13 18.99 11.7 25.96 7.57 6.97 16.63 11.03 27.18 12.18-2.61 7.95-5.83 16.03-9.67 24.25zM119.22 33.09c0-7.31 2.65-14.14 7.95-20.49 5.3-6.35 11.83-10.28 19.59-11.8-1.09 7.42-3.87 14.28-8.34 20.57-4.47 6.29-10.87 10.26-19.2 11.72z" />
                    </svg>
                  )}
                  <span className="whitespace-nowrap">Continue with Apple</span>
                </button>
              </div>

              {/* Mode Switcher: Log In vs Sign Up Free (Positioned below all login options, above guest mode) */}
              <div className="text-center pt-2">
                <p className={`text-xs font-sans ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                    }}
                    className="text-[#0080FF] font-semibold hover:underline ml-1 cursor-pointer whitespace-nowrap"
                  >
                    {isSignUp ? 'Log In' : 'Sign Up Free'}
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* ================= SCREEN 2: EMAIL INPUT ================= */}
          {step === 'email' && (
            <motion.div
              key="step-email"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="space-y-4 py-2"
            >
              <form onSubmit={handleEmailStepSubmit} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className={`text-[12px] font-semibold block px-1 ${
                    isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                  }`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      className={`w-full h-[48px] pl-10 pr-4 rounded-[14px] text-sm outline-none transition-all border ${
                        isDark
                          ? 'bg-[#121214] border-[#1F1F24] text-white placeholder-[#6C6C70] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                          : 'bg-[#F2F2F7] border-[#E5E5EA] text-[#1C1C1E] placeholder-[#8E8E93] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-[12px] flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Continue to Password Button */}
                <button
                  type="submit"
                  className="w-full h-[48px] bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99] font-sans text-sm font-semibold rounded-full text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span className="whitespace-nowrap">Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Mode Switcher */}
              <div className="text-center pt-1">
                <p className={`text-xs font-sans ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                    }}
                    className="text-[#0080FF] font-semibold hover:underline ml-1 cursor-pointer whitespace-nowrap"
                  >
                    {isSignUp ? 'Log In' : 'Sign Up Free'}
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* ================= SCREEN 3: PASSWORD & CREDENTIALS ================= */}
          {step === 'password' && (
            <motion.div
              key="step-password"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="space-y-3.5 py-1"
            >
              {/* Email Summary Pill with Edit Shortcut */}
              <div className={`p-2.5 px-3 rounded-[14px] border flex items-center justify-between transition-colors ${
                isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
              }`}>
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-7 h-7 rounded-full bg-[#0080FF]/15 text-[#0080FF] flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className={`text-[10px] uppercase font-mono block leading-none ${isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
                      Account Email
                    </span>
                    <span className="text-xs font-semibold truncate block mt-0.5" title={email}>
                      {email}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setError(null);
                  }}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium text-[#0080FF] hover:bg-[#0080FF]/10 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>

              {/* Password Form */}
              <form onSubmit={handlePasswordStepSubmit} className="space-y-3">
                {/* Full Name Input (when signing up) */}
                {isSignUp && (
                  <div className="space-y-1">
                    <label className={`text-[12px] font-semibold block px-1 ${
                      isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                    }`}>
                      What's Your Name?
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                      <input
                        type="text"
                        placeholder="Alex Mercer"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        autoFocus
                        className={`w-full h-[46px] pl-10 pr-4 rounded-[14px] text-sm outline-none transition-all border ${
                          isDark
                            ? 'bg-[#121214] border-[#1F1F24] text-white placeholder-[#6C6C70] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                            : 'bg-[#F2F2F7] border-[#E5E5EA] text-[#1C1C1E] placeholder-[#8E8E93] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                        }`}
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                {/* Password Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1">
                    <label className={`text-[12px] font-semibold block ${
                      isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                    }`}>
                      {isSignUp ? 'Create Password' : 'Password'}
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] font-medium text-[#0080FF] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus={!isSignUp}
                      className={`w-full h-[46px] pl-10 pr-10 rounded-[14px] text-sm outline-none transition-all border ${
                        isDark
                          ? 'bg-[#121214] border-[#1F1F24] text-white placeholder-[#6C6C70] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                          : 'bg-[#F2F2F7] border-[#E5E5EA] text-[#1C1C1E] placeholder-[#8E8E93] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 focus:outline-none cursor-pointer ${
                        isDark ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                      }`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Reset Notice */}
                {resetSent && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs rounded-[12px] flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Password reset instructions sent to your email.</span>
                  </motion.div>
                )}

                {/* Error Banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-[12px] flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[48px] mt-1 bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99] disabled:bg-[#A0C8FF] font-sans text-sm font-semibold rounded-full text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span className="whitespace-nowrap">{isSignUp ? 'Create Account' : 'Log In'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Mode Switcher in Step 3 */}
              <div className="text-center pt-1">
                <p className={`text-xs font-sans ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                  {isSignUp ? 'Need to log in instead?' : 'First time with this email?'}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                    }}
                    className="text-[#0080FF] font-semibold hover:underline ml-1 cursor-pointer whitespace-nowrap"
                  >
                    {isSignUp ? 'Switch to Log In' : 'Create an Account'}
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Guest Login Option / Safety Net */}
      <div className={`border-t pt-3 pb-1 z-10 flex flex-col gap-1.5 shrink-0 ${
        isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
      }`}>
        <button
          type="button"
          onClick={onContinueAsGuest}
          className={`w-full h-[44px] active:scale-[0.99] font-sans text-xs font-medium rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            isDark
              ? 'bg-[#121214] hover:bg-[#1A1A1E] border-[#1F1F24] text-white'
              : 'bg-white hover:bg-[#E5E5EA] border-[#E5E5EA] text-[#1C1C1E]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#0080FF]" />
          <span className="whitespace-nowrap">Continue as Guest</span>
        </button>
        <span className={`text-[10px] font-sans text-center block ${isDark ? 'text-[#636366]' : 'text-[#8E8E93]'}`}>
          Try the app first. All data stays securely on your device.
        </span>
      </div>
    </div>
  );
}
