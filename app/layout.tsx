import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import HotjarInit from "./HotjarInit";

const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rodion Bychkoviak CV",
  description: "Lead UI/UX/Product Designer & Frontend Developer",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>{children}</body>
      <HotjarInit />
    </html>
  );
}
