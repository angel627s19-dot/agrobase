'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Lock, User, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('AGRO');
  const [password, setPassword] = useState('Owner@123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_user', JSON.stringify(data.user));
          localStorage.setItem('admin_token', 'active');
        }
        router.push('/admin');
        router.refresh();
      } else {
        setErrorMessage(data.message || 'Invalid username or password. Please verify your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-dark via-brand-green-900 to-brand-green-800 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">
        {/* Header Banner */}
        <div className="bg-brand-green-700 p-6 text-center text-white relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-3 backdrop-blur border border-white/20">
            <ShieldCheck size={28} className="text-brand-orange-400" />
          </div>
          <h1 className="text-2xl font-heading font-bold tracking-tight">AGRO BASE</h1>
          <p className="text-xs text-brand-green-100 font-medium tracking-wide uppercase mt-1">
            Owner & Admin Portal
          </p>
        </div>

        <div className="p-8">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="AGRO or owner@agrobase.com"
                  required
                  className="pl-10 h-11 w-full border-gray-300 focus:border-brand-green-600 focus:ring-brand-green-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 h-11 w-full border-gray-300 focus:border-brand-green-600 focus:ring-brand-green-600"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-green-700 hover:bg-brand-green-800 text-white h-11 text-base font-semibold shadow-md transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" /> Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center mb-2.5">
              Quick Sign-In Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('AGRO', 'Owner@123')}
                className="p-2.5 text-xs text-left rounded-lg border border-brand-green-200 bg-brand-green-50/50 hover:bg-brand-green-100/60 transition-colors"
              >
                <div className="font-bold text-brand-green-800">Owner Access</div>
                <div className="text-gray-600 font-mono text-[11px] mt-0.5">AGRO</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('ADMIN', 'Admin@123')}
                className="p-2.5 text-xs text-left rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="font-bold text-gray-800">Admin Access</div>
                <div className="text-gray-600 font-mono text-[11px] mt-0.5">ADMIN</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-green-700 font-medium transition-colors"
            >
              <ArrowLeft size={14} /> Back to Agro Base Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
