import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Press_Start_2P,
  Pixelify_Sans,
  VT323,
  Silkscreen,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
});

export const metadata: Metadata = {
  title: "Aii & Kibo",
  description: "I wish we have feel same.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} ${pixelifySans.variable} ${vt323.variable} ${silkscreen.variable} h-full overflow-hidden antialiased`}
    >
      <body className="h-full w-full overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}

