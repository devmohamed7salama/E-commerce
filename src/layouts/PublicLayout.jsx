import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../hooks/useSettings";
import { MessageCircle } from "lucide-react";

export default function PublicLayout() {
  const { data: settings } = useSettings();

  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      {settings?.whatsapp && (
        <a
          href={`https://wa.me/${settings.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="floating-whatsapp"
          title="راسلنا على واتساب"
        >
          <MessageCircle size={32} />
        </a>
      )}
    </div>
  );
}
