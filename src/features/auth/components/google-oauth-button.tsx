'use client';

export function GoogleOAuthButton() {
  const handleGoogleLogin = () => {
    // TODO: Integrate with Keycloak Google OAuth
    console.log('Google OAuth login triggered');
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-[0.875rem] border bg-white text-ink-900 font-medium text-[0.95rem] transition-all duration-250 hover:border-forest-700 hover:bg-cream-100"
      style={{
        borderWidth: '1.5px',
        borderColor: '#E5E7EB',
      }}
    >
      {/* Google "G" Multi-color SVG */}
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.8 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 5.8 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.5 15.5 18.8 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 5.8 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.7 13.4-4.7l-6.2-5.2C29.2 35.9 26.7 36 24 36c-5.2 0-9.7-2.8-11.2-7.7l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.8 39.3 44 34 44 24c0-1.3-.2-2.7-.4-3.9z" />
      </svg>
      Se connecter avec Google
    </button>
  );
}
