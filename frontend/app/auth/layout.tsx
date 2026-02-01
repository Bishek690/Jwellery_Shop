export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {children}
    </main>
  );
}
