import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Babygirl — All Day Dining. Cafe. Restaurant. Bar.",
  description:
    "A calming neighborhood diner in East Lake, Atlanta. Coffee early, food all day, lights low when evening comes. From Chef Hudson Rouse.",
  openGraph: {
    title: "Babygirl — East Lake, Atlanta",
    description:
      "All day dining from Michelin-recognized Chef Hudson Rouse. Coffee early, food all day, lights low when evening comes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
