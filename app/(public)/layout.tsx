import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ismail SK - AI/ML Engineer & Full Stack Developer",
  description:
    "Portfolio of Ismail SK - AI/ML Engineer & Full Stack Developer specializing in intelligent, scalable solutions using AI/ML, Computer Vision, NLP and modern web technologies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}