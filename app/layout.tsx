import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Projekt 3.0 🙏",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
