'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/auth.schema';
import { useLogin } from '@/features/auth/hooks/use-auth';

const inputClassName = (hasError: boolean) =>
  `w-full pl-11 pr-4 py-3 text-[0.9375rem] rounded-[0.875rem] outline-none transition-all duration-200 ${
    hasError
      ? 'border-red-400 bg-red-50'
      : 'border-[#D8F3DC] bg-[#FFFBF0]'
  }`;

const inputStyle = {
  borderWidth: '1.5px',
  borderStyle: 'solid',
  color: '#1A1A2E',
};

const inputFocusStyle = {
  borderColor: '#2D6A4F',
  boxShadow: '0 0 0 3px rgba(45,106,79,0.12)',
  background: '#fff',
};

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="rounded-[0.875rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error.message}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">
          Adresse email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-400/50" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            className={inputClassName(!!errors.email)}
            style={{
              ...inputStyle,
              borderColor: errors.email ? '#f87171' : focusedField === 'email' ? '#2D6A4F' : '#D8F3DC',
              ...(focusedField === 'email' ? inputFocusStyle : {}),
            }}
            {...register('email')}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1.5">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-400/50" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Entrez votre mot de passe"
            className={`${inputClassName(!!errors.password)} pr-11`}
            style={{
              ...inputStyle,
              borderColor: errors.password ? '#f87171' : focusedField === 'password' ? '#2D6A4F' : '#D8F3DC',
              ...(focusedField === 'password' ? inputFocusStyle : {}),
            }}
            {...register('password')}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400/50 hover:text-forest-900 transition-colors"
          >
            {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
          </button>
        </div>
        <div className="text-right mt-1.5">
          <Link
            href="/forgot-password"
            className="text-sm text-forest-900/70 hover:text-forest-900 transition-colors hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        {errors.password && (
          <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 rounded-[0.875rem] text-white font-semibold text-[0.9375rem] transition-all duration-300 relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
        }}
        onMouseEnter={(e) => {
          if (!isPending) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(27,67,50,0.3)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connexion en cours...
          </>
        ) : (
          'Se connecter'
        )}
      </button>
    </form>
  );
}
