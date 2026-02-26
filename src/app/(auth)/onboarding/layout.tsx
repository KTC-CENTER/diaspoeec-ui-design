export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-forest-600">
          Configuration du profil
        </p>
      </div>
      {children}
    </div>
  );
}
