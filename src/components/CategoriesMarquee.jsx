import React from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";

export default function CategoriesMarquee() {
  const { data: categories } = useCategories();
  const activeCategories = categories?.filter((c) => c.is_active) || [];

  if (activeCategories.length === 0) return null;

  // Duplicate the list enough times to ensure seamless infinite scroll
  const repeated = [...activeCategories, ...activeCategories, ...activeCategories, ...activeCategories];

  return (
    <div className="categories-marquee-wrapper m-0 p-0">
      <div className="categories-marquee-track m-0 p-0">
        {repeated.map((cat, i) => (
          <Link
            key={`${cat.id}-${i}`}
            to={`/category/${cat.slug}`}
            className="categories-marquee-item"
          >
            <span className="marquee-dot">✦</span>
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
