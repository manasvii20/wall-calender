import "./globals.css";

export const metadata = {
  title: "Wall Calendar",
  description: "Production-quality interactive wall calendar"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-zinc-100 text-zinc-900 antialiased">{children}</body>
    </html>
  );
}
