import React from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";

export default function CategoryGrid() {
  const { data: categories, isLoading, error } = useCategories();

  const activeCategories = categories?.filter((c) => c.is_active && !c.parent_id) || [];

  if (isLoading) {
    return (
      <section className="container my-5" style={{ direction: "rtl" }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark mb-2" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}>أقسام المتجر</h2>
          <p className="text-muted">اختر القسم الذي ترغب في تصفح منتجاته</p>
        </div>
        <div className="row g-4 justify-content-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="col-12 col-sm-6 col-md-4">
              <div className="placeholder-glow rounded-4 overflow-hidden ratio ratio-16x9">
                <div className="placeholder bg-secondary bg-opacity-25 w-100 h-100"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || activeCategories.length === 0) {
    return null; // hide section if no categories
  }

  return (
    <section className="container my-5" style={{ direction: "rtl" }}>
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark mb-2" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}>أقسام المتجر</h2>
        <p className="text-muted">اختر القسم الذي ترغب في تصفح منتجاته</p>
      </div>

      <div className="row g-3 justify-content-center">
        {activeCategories.map((cat) => (
          <div key={cat.id} className="col-12  col-md-3">
            <Link to={`/category/${cat.slug}`} className="text-decoration-none d-block">
              <div
                className="overflow-hidden rounded-4 border"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                  cursor: "pointer",
                  borderColor: "#E6E6E6"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "#cccccc";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#E6E6E6";
                }}
              >
                {/* Header - Category Name */}
                <div className="px-3 py-2 bg-dark">
                  <h4 className="fw-bold m-0 text-white" style={{ fontSize: "14px" }}>{cat.name}</h4>
                </div>
                {/* Body - Image */}
                <div className="ratio ratio-16x9" style={{ backgroundColor: "#F0EEED" }}>
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted fw-bold bg-secondary bg-opacity-10">
                      {cat.name}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
