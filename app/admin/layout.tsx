import type { Metadata } from "next";
import AdminClientLayout from "./AdminClientLayout"; // Your client component

export const metadata: Metadata = {
  title: "Ismail SK - AI/ML Engineer & Full Stack Developer",
  description:
    "Portfolio of Ismail SK - AI/ML Engineer & Full Stack Developer specializing in intelligent, scalable solutions using AI/ML, Computer Vision, NLP and modern web technologies.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}