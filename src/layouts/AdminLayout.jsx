import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { useSettings } from "../hooks/useSettings";
import { Eye, LayoutDashboard, Package, Folder, Images, Settings, LogOut } from "lucide-react";
import sitelogo from "../assets/DMlogo.PNG"

export default function AdminLayout() {
  const navigate = useNavigate();
  const { data: settings } = useSettings();

  const closeMobileSidebar = () => {
    const el = document.getElementById("adminSidebar");
    if (el) {
      const offcanvas = bootstrap.Offcanvas.getInstance(el);
      if (offcanvas) offcanvas.hide();
    }
  };

  const handleLogout = async () => {
    try {
      closeMobileSidebar();
      await logout();
      navigate("/admin/login");
    } catch (err) {
      alert("حدث خطأ أثناء تسجيل الخروج: " + err.message);
    }
  };

  const siteTitle = settings?.site_name || "متجري";

  // Shared sidebar content (branding, view store, nav links, and logout)
  const renderSidebarContent = (isMobile = false) => (
    <>
      {/* Brand/Logo (visible on desktop sidebar, or heading inside offcanvas) */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-center gap-2 text-decoration-none">
          {settings?.use_logo ? (
            <img
              src={settings?.logo_url || sitelogo}
              alt={siteTitle}
              height="120"
              className="object-fit-contain"
            />
          ) : (
            <span className="fw-bold fs-4 text-primary">{siteTitle}</span>
          )}
        </div>
        {!settings?.use_logo && (
          <div className="fw-bold text-light fs-6 mt-2 px-1 text-center">{siteTitle}</div>
        )}
      </div>

      <Link
        to="/"
        className="btn btn-outline-light w-100 mb-4 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 transition-all"
        style={{ fontSize: "14px" }}
        {...(isMobile ? { onClick: closeMobileSidebar } : {})}
      >
        <Eye size={16} />
        <span>عرض المتجر</span>
      </Link>

      {/* Navigation Links */}
      <nav className="nav flex-column gap-2 flex-grow-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `nav-link text-white rounded-3 py-2 px-3 d-flex align-items-center gap-2 transition-all ${isActive ? "bg-primary shadow" : "hover-bg-dark opacity-75"
            }`
          }
          {...(isMobile ? { onClick: closeMobileSidebar } : {})}
        >
          <LayoutDashboard size={16} />
          <span>الرئيسية (الإحصائيات)</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `nav-link text-white rounded-3 py-2 px-3 d-flex align-items-center gap-2 transition-all ${isActive ? "bg-primary shadow" : "hover-bg-dark opacity-75"
            }`
          }
          {...(isMobile ? { onClick: closeMobileSidebar } : {})}
        >
          <Package size={16} />
          <span>إدارة المنتجات</span>
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `nav-link text-white rounded-3 py-2 px-3 d-flex align-items-center gap-2 transition-all ${isActive ? "bg-primary shadow" : "hover-bg-dark opacity-75"
            }`
          }
          {...(isMobile ? { onClick: closeMobileSidebar } : {})}
        >
          <Folder size={16} />
          <span>إدارة الأقسام</span>
        </NavLink>

        <NavLink
          to="/admin/sliders"
          className={({ isActive }) =>
            `nav-link text-white rounded-3 py-2 px-3 d-flex align-items-center gap-2 transition-all ${isActive ? "bg-primary shadow" : "hover-bg-dark opacity-75"
            }`
          }
          {...(isMobile ? { onClick: closeMobileSidebar } : {})}
        >
          <Images size={16} />
          <span>سلايدر الواجهة</span>
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `nav-link text-white rounded-3 py-2 px-3 d-flex align-items-center gap-2 transition-all ${isActive ? "bg-primary shadow" : "hover-bg-dark opacity-75"
            }`
          }
          {...(isMobile ? { onClick: closeMobileSidebar } : {})}
        >
          <Settings size={16} />
          <span>إعدادات الموقع</span>
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="pt-3 border-top border-secondary mt-auto">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2 hover-bg-danger"
        >
          <LogOut size={16} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100 bg-light" style={{ direction: "rtl", fontFamily: "Cairo, sans-serif" }}>

      {/* Mobile Top Header (Toggles Sidebar) */}
      <header className="navbar navbar-dark bg-dark d-md-none py-3 px-4 sticky-top shadow-sm w-100">
        <span className="navbar-brand fw-bold text-white mb-0 fs-5 d-flex align-items-center">
          {settings?.use_logo ? (
            <img
              src={settings?.logo_url || sitelogo}
              alt={siteTitle}
              height="35"
              className="object-fit-contain"
            />
          ) : (
            siteTitle
          )}
        </span>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#adminSidebar"
          aria-controls="adminSidebar"
          aria-label="فتح القائمة"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </header>

      {/* Static Sidebar - Desktop Only */}
      <aside
        className="bg-dark text-white p-3 d-none d-md-flex flex-column flex-shrink-0"
        style={{ width: "280px", height: "100vh", position: "sticky", top: 0, overflowY: "auto" }}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Offcanvas Sidebar - Mobile Only */}
      <div
        className="offcanvas offcanvas-start bg-dark text-white p-3 d-md-none"
        tabIndex="-1"
        id="adminSidebar"
        aria-labelledby="adminSidebarLabel"
        style={{ width: "280px" }}
      >
        <div className="offcanvas-header border-bottom border-secondary mb-3 pb-3">
          <h5 className="offcanvas-title fw-bold text-white" id="adminSidebarLabel">
            {settings?.use_logo ? (
              <img
                src={settings?.logo_url || sitelogo}
                alt={siteTitle}
                height="35"
                className="object-fit-contain"
              />
            ) : (
              siteTitle
            )}
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="إغلاق"
          ></button>
        </div>
        <div className="offcanvas-body d-flex flex-column p-0 flex-grow-1">
          {renderSidebarContent(true)}
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100 overflow-hidden">
        <main className="p-3 p-md-4 flex-grow-1 overflow-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
