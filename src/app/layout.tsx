import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "myStuff",
  description: "Personal Home Page Builder",
};
//view port scale to fix ios from being too zoomed in
export const viewport: Viewport = {
  width: "device-width",
  maximumScale: 0.7,
  initialScale: 1,
  userScalable: true,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* passing the font rubik for the whole website */}
      <body className={rubik.className}>{children}</body>
    </html>
  );
}
