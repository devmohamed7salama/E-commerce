import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { useCategories } from "../hooks/useCategories";
import { Check } from "lucide-react";
import sitelogo from "../assets/DMlogo.PNG";

export default function Footer() {
  const { data: settings } = useSettings();
  const { data: categories } = useCategories();
  const activeCategories = categories?.filter((c) => c.is_active).slice(0, 5) || [];

  return (
    <footer className="custom-footer pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* Logo & Description Column */}
          <div className="col-lg-4 col-md-6">
            {settings?.use_logo ? (
              <div className="mb-3">
                <img
                  src={settings?.logo_url || sitelogo}
                  alt={settings.site_name || "Catalog"}
                  style={{ height: "45px", maxWidth: "100%", objectFit: "contain" }}
                />
              </div>
            ) : (
              <h5 className="text-white fw-bold mb-3">
                {settings?.site_name || "متجري"}
              </h5>
            )}
            <p className="footer-text-muted small">
              {settings?.site_description || "أهلاً بك في متجرنا الرقمي. تصفح منتجاتنا المميزة واطلب بكل سهولة مباشرة عبر تطبيق واتساب."}
            </p>
          </div>

          {/* Quick Categories Column */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">أقسام المتجر</h6>
            <ul className="list-unstyled">
              {activeCategories.map((cat) => (
                <li key={cat.id} className="mb-2">
                   <Link to={`/category/${cat.slug}`} className="footer-link">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="mb-2">
                <Link to="/products" className="footer-link">
                  جميع المنتجات
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts / WhatsApp Column */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">تواصل معنا</h6>
            {settings?.whatsapp && (
              <p className="footer-text-muted small mb-2 d-flex align-items-center gap-2">
                <Check size={16} className="text-success" strokeWidth={2.5} />
                واتساب:{" "}
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link fw-semibold text-white"
                >
                  +{settings.whatsapp}
                </a>
              </p>
            )}
            <p className="footer-text-muted small">الدعم الفني متاح للإجابة على استفساراتكم على مدار الساعة.</p>
          </div>

          {/* Social Links Column */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">تابعنا على وسائل التواصل</h6>
            <div className="d-flex gap-3">
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noreferrer" className="footer-link">
                  فيسبوك
                </a>
              )}
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer" className="footer-link">
                  إنستجرام
                </a>
              )}
              {settings?.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noreferrer" className="footer-link">
                  تيك توك
                </a>
              )}
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row">
          <div className="col text-center">
            <p className="footer-text-muted small mb-0 d-flex flex-wrap align-items-center justify-content-center gap-2">
              <span>© {new Date().getFullYear()} {settings?.owner_name || settings?.site_name || "متجري"}. جميع الحقوق محفوظة.</span>
              <span className="text-secondary d-none d-sm-inline">|</span>
              <span style={{ fontSize: "11px", opacity: 0.8 }}>Developed by Mohamed Salam</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
