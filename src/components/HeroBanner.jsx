import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import heroDefault from "../assets/hero Defult.png";

export default function HeroBanner() {
  const { data: settings } = useSettings();

  if (!settings) return null;

  const title = settings.hero_title || "اكتشف أحدث الموديلات";
  const subtitle = settings.hero_subtitle || "تصفح تشكيلتنا الواسعة من المنتجات المميزة بأسعار منافسة، واطلب مباشرة عبر واتساب بكل سهولة وسرعة.";
  const buttonText = settings.hero_button_text || "تسوق الآن";
  const buttonLink = settings.hero_button_link || "/products";
  const heroImage = settings.hero_image_url || heroDefault;

  return (
    <section className="hero-banner mb-0 pb-0" style={{ direction: "rtl" , background: `url(${heroImage})` ,backgroundSize:'cover' }}>
      <div className="container">
        <div className="row align-items-center g-4 g-lg-5">
          {/* Text Content — Right side in RTL */}
            <div className="hero-banner-content">
              <h1 className="hero-banner-title">{title}</h1>
              <p className="hero-banner-desc">{subtitle}</p>
              <Link to={buttonLink} className="btn btn-dark hero-banner-btn">
                {buttonText}
              </Link>

              {/* Stats Row */}
              <div className="hero-banner-stats">
                <div className="hero-stat">
                  <span className="hero-stat-number">200+</span>
                  <span className="hero-stat-label">علامة تجارية</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="hero-stat-number">2,000+</span>
                  <span className="hero-stat-label">منتج متوفر</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="hero-stat-number">30,000+</span>
                  <span className="hero-stat-label">عميل سعيد</span>
                </div>
              </div>
            </div>

          {/* Hero Image — Left side in RTL */}
          {/* <div className="col-12 col-lg-6 order-1 order-lg-2">
            <div className="hero-banner-image-wrapper"> */}
              {/* <img
                src={heroImage}
                alt={title}
                className="hero-banner-image"
              /> */}
              {/* Decorative stars */}
              {/* <span className="hero-star hero-star-1">✦</span>
              <span className="hero-star hero-star-2">✦</span>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
