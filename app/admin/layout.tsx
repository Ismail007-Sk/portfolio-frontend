import type { Metadata } from "next";
import Sidebar from "@/components/layout/sidebar";
export const metadata: Metadata = {
  title: "Ismail SK - AI/ML Engineer & Full Stack Developer",
  description:
    "Portfolio of Ismail SK - AI/ML Engineer & Full Stack Developer specializing in intelligent, scalable solutions using AI/ML, Computer Vision, NLP and modern web technologies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <div style={{display: "flex",minHeight: "100vh"}}>
      <Sidebar />
      <main style={{ flex: 1,padding: "30px"}}>
        {children}
      </main>
    </div>
  );
}