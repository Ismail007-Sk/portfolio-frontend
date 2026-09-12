"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation"; // Updated for App Router

const links = [
  { name: "My Profile", href: "/admin" },
  { name: "Projects", href: "/admin/projects" },
  { name: "Services", href: "/admin/services" },
  { name: "Experience", href: "/admin/experience" },
  { name: "Skills", href: "/admin/skills" },
  { name: "Certifications", href: "/admin/certifications" },
  { name: "Education", href: "/admin/education" },
  { name: "Achievements", href: "/admin/achievements" },
  { name: "Reset Password", href: "/admin/reset-password" },
];

export default function Sidebar() {
  const { Log_out } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await Log_out();
    router.replace("/");
  };

  return (
    <aside
      style={{
        width: "420px",
        minHeight: "100vh",
        padding: "20px",
        borderRight: "1px solid #ddd",
      }}
    >
      <h2 style={{ fontSize: "45px", padding: "20px", border: "10px solid #333", margin: 0 }}>
        Admin Panel
      </h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          marginTop: "20px",
        }}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              textDecoration: "none",
              color: "#fdfdfd",
              fontSize: "30px",
            }}
          >
            <hr />
            {link.name}
            <hr />
          </Link>
        ))}

        <div style={{ marginTop: "20px" }}>
          <hr />
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "24px",
              backgroundColor: "#dc3545",
              color: "#ffffff",
              border: "1px solid #000000",
              borderRadius: "4px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Logout
          </button>
          <hr style={{ marginTop: "40px" }} />
        </div>
      </nav>
    </aside>
  );
}