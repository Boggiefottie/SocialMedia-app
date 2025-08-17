import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-white shadow">
          <div className="container py-3 flex gap-4">
            <Link href="/" className="font-semibold">SocialConnect</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
            <Link href="/composer">Compose</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </nav>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
