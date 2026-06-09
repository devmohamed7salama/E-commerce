import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { useCategories } from "../hooks/useCategories";
import { useCart } from "../contexts/CartContext";
import { getUser, onAuthStateChange } from "../services/authService";
import { ShoppingBag, LayoutDashboard } from "lucide-react";
import sitelogo from "../assets/DMlogo.PNG";

export default function Navbar() {
  const { data: settings } = useSettings();
  const { data: categories } = useCategories();
  const { getCartCount } = useCart();
  const [user, setUser] = useState(null);

  const activeCategories = categories?.filter((c) => c.is_active) || [];

  useEffect(() => {
    let isMounted = true;
    async function checkUser() {
      try {
        const currentUser = await getUser();
        if (isMounted) setUser(currentUser);
      } catch (err) {
        console.error(err);
      }
    }
    checkUser();

    const subscription = onAuthStateChange(async (event, session) => {
      if (session) {
        const currentUser = await getUser();
        if (isMounted) setUser(currentUser);
      } else {
        if (isMounted) setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-navbar py-3">
      <div className="container">
        {/* Brand Logo or Name */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {settings?.use_logo ? (
            <img
              src={settings?.logo_url || sitelogo}
              alt={settings.site_name || "Catalog"}
              height="40"
              className="me-2"
            />
          ) : (
            <span className="fw-bold fs-4 text-primary">
              {settings?.site_name || "متجري"}
            </span>
          )}
        </Link>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/" end>
                الرئيسية
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/products">
                المنتجات
              </NavLink>
            </li>
            {/* Categories dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle px-3"
                href="#"
                id="categoriesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                الأقسام
              </a>
              <ul className="dropdown-menu border-0 shadow-sm rounded-3" aria-labelledby="categoriesDropdown">
                {activeCategories.length > 0 ? (
                  activeCategories.map((cat) => (
                    <li key={cat.id}>
                      <Link className="dropdown-item py-2" to={`/category/${cat.slug}`}>
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="dropdown-item text-muted">لا يوجد أقسام بعد</span>
                  </li>
                )}
              </ul>
            </li>
          </ul>

          {/* Action buttons */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart link button */}
            <Link
              to="/checkout"
              className="btn btn-outline-dark border-0 position-relative p-2"
              title="سلة الطلبات"
            >
              <ShoppingBag size={24} />
              {getCartCount() > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Direct WhatsApp Call */}
            {/* {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp d-none d-md-inline-flex align-items-center gap-2"
              >
                تواصل معنا
              </a>
            )} */}

            {/* Dashboard Redirect for Admin */}
            {user && user.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="btn btn-outline-primary d-inline-flex align-items-center gap-2 fw-semibold ms-1"
              >
                <LayoutDashboard size={16} />
                <span>لوحة التحكم</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
