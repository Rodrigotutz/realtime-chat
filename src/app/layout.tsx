import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tutz Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <div className="mx-auto max-w-7xl px-4">{children}</div>
      </body>
    </html>
  );
}
