import React from "react";
import { Helmet } from "react-helmet-async";
import HeroSlider from "../components/HeroSlider";
import HeroBanner from "../components/HeroBanner";
import CategoriesMarquee from "../components/CategoriesMarquee";
import CategoryGrid from "../components/CategoryGrid";
import ProductCard from "../components/ProductCard";
import { useFeaturedProducts } from "../hooks/useProducts";
import { useSettings } from "../hooks/useSettings";

export default function HomePage() {
  const { data: settings } = useSettings();
  const { data: featuredProducts, isLoading, error } = useFeaturedProducts();

  const productsList = featuredProducts?.slice(0, 8) || [];

  const siteTitle = settings?.site_name || "متجري الإلكتروني";
  const siteDesc = settings?.site_description || "تصفح أحدث المنتجات واطلب مباشرة عبر تطبيق واتساب بكل سهولة.";

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  // Display controls — default to true if not set
  const showSlider = settings?.show_slider !== false;
  const showHero = settings?.show_hero !== false;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteTitle,
    "url": siteUrl,
    "description": siteDesc,
    ...(settings?.logo_url && { "logo": settings.logo_url })
  };

  return (
    <div className="pb-5" style={{ direction: "rtl" }}>
      <Helmet>
        <title>{siteTitle} | الرئيسية</title>
        <meta name="description" content={siteDesc} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        {settings?.logo_url && <meta property="og:image" content={settings.logo_url} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDesc} />
        {settings?.logo_url && <meta name="twitter:image" content={settings.logo_url} />}

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>


      {/* 2. Hero Banner — controlled by show_hero */}
      {showHero && <HeroBanner />}
      
      {/* 1.5. Categories Marquee */}
      <CategoriesMarquee />

      {/* 1. Hero Slider — controlled by show_slider */}
      {showSlider && <HeroSlider />}

      {/* Visually hidden h1 for SEO */}
      <h1 className="visually-hidden">{siteTitle} - {siteDesc}</h1>

      {/* 2. Categories Grid */}
      <CategoryGrid />

      {/* 3. Featured Products Grid */}
      <section className="container my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark mb-2" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}>أحدث المنتجات المميزة</h2>
          <p className="text-muted">اخترنا لك باقة من أفضل منتجاتنا المميزة</p>
        </div>

        {isLoading ? (
          <div className="row g-4">
            {[1, 2, 4, 8].map((i) => (
              <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card border-0 placeholder-glow" style={{ height: "380px" }}>
                  <div className="placeholder bg-secondary bg-opacity-25 w-100 h-60 mb-3 rounded-3" style={{ minHeight: "220px" }}></div>
                  <div className="placeholder bg-secondary bg-opacity-25 w-75 h-5 mb-2"></div>
                  <div className="placeholder bg-secondary bg-opacity-25 w-50 h-5 mb-3"></div>
                  <div className="placeholder bg-primary bg-opacity-25 w-100 h-10 rounded-pill"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">حدث خطأ أثناء تحميل المنتجات المميزة. الرجاء المحاولة لاحقاً.</div>
        ) : productsList.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p>لا يوجد منتجات مميزة متاحة حالياً.</p>
          </div>
        ) : (
          <div className="row g-4">
            {productsList.map((prod) => (
              <div key={prod.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
