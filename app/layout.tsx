import type { Metadata } from "next";
import { Geist, Geist_Mono} from "next/font/google";
import AuthProvider from "@/context/auth-context";
import "./globals.css"



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ismail SK - AI/ML Engineer & Full Stack Developer",
  description: "Portfolio of Ismail SK - AI/ML Engineer & Full Stack Developer specializing in intelligent, scalable solutions using AI/ML, Computer Vision, NLP and modern web technologies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body>
            <AuthProvider>
                {children}    
            </AuthProvider>
        </body>
    </html>
  );
}
