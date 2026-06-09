import React from "react";
import { Link } from "react-router-dom";
import { useActiveSliders } from "../hooks/useSliders";

export default function HeroSlider() {
  const { data: sliders, isLoading, error } = useActiveSliders();

  if (isLoading) {
    return (
      <div className="w-100">
        <div className="placeholder-glow rounded-3 overflow-hidden" style={{ height: "450px" }}>
          <div className="placeholder w-100 h-100 bg-secondary bg-opacity-25"></div>
        </div>
      </div>
    );
  }

  if (error || !sliders || sliders.length === 0) {
    // Return a default banner if no sliders are configured
    return (
      <div className="w-100">
        <div className="bg-light p-5 rounded-3 text-center border">
          <h1 className="fw-bold text-primary mb-3">أهلاً بك في متجرنا</h1>
          <p className="text-muted fs-5">اكتشف أحدث العروض والمنتجات وتواصل معنا مباشرة للطلب عبر واتساب.</p>
          <Link to="/products" className="btn btn-primary btn-lg mt-3">
            تصفح المنتجات الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100" style={{ direction: "rtl" }}>
      <div
        id="heroCarousel"
        className="carousel slide carousel-fade overflow-hidden"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          {sliders.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
        
        <div className="carousel-inner">
          {sliders.map((slide, index) => {
            const isCategoryLink = slide.link_type === "category" && slide.link_id;
            const isProductLink = slide.link_type === "product" && slide.product_slug;

            const linkLabel = isProductLink
              ? "عرض المنتج"
              : isCategoryLink
              ? "تصفح القسم"
              : null;

            const slideContent = (
              <div className="position-relative w-100">
                <img
                  src={slide.image_url}
                  className="d-block w-100 img-fluid hero-slider-img"
                  alt={slide.title || `Slide ${index}`}
                />
                <div className="position-absolute bottom-0 start-0 w-100 p-4 p-md-5 text-white d-flex align-items-center gap-3 flex-wrap" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)", zIndex: 2 }}>
                  {slide.title && (
                    <h3 className="fw-bold mb-0" style={{ fontSize: "clamp(1.25rem, 3.5vw, 2.25rem)", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>{slide.title}</h3>
                  )}
                  {linkLabel && (
                    <span className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm">
                      {linkLabel}
                    </span>
                  )}
                </div>
              </div>
            );

            let linkTo = null;
            if (isProductLink) linkTo = `/product/${slide.product_slug}`;
            else if (isCategoryLink) linkTo = `/products?category=${slide.link_id}`;

            return (
              <div key={slide.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                {linkTo ? (
                  <Link to={linkTo} className="text-decoration-none d-block">
                    {slideContent}
                  </Link>
                ) : (
                  slideContent
                )}
              </div>
            );
          })}
        </div>

        {/* Carousel controls */}
        {sliders.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
