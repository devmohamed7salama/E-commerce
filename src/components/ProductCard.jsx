import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWhatsApp } from "../hooks/useWhatsApp";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-hot-toast";
import { ShoppingBag } from "lucide-react";

export default function ProductCard({ product }) {
  const {
    name,
    slug,
    price,
    sale_price,
    thumbnail_url,
    is_featured,
    show_stock,
    fake_stock,
    colors = [],
    sizes = []
  } = product;

  const navigate = useNavigate();
  const { addToCart } = useCart();
  // const { sendToWhatsApp } = useWhatsApp();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  const finalPrice = sale_price || price;
  const hasDiscount = !!sale_price && Number(sale_price) < Number(price);

  // Compute discount percentage
  const discountPercent = hasDiscount
    ? Math.round(((Number(price) - Number(sale_price)) / Number(price)) * 100)
    : 0;

  const handleCheckout = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Verification
    if (colors.length > 0 && !selectedColor) {
      toast.error("الرجاء تحديد لون أولاً");
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      toast.error("الرجاء تحديد مقاس أولاً");
      return;
    }

    addToCart(product, {
      color: selectedColor,
      size: selectedSize,
      qty,
    });

    navigate("/checkout");
  };

  const handleAddToBag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Verification
    if (colors.length > 0 && !selectedColor) {
      toast.error("الرجاء تحديد لون أولاً");
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      toast.error("الرجاء تحديد مقاس أولاً");
      return;
    }

    addToCart(product, {
      color: selectedColor,
      size: selectedSize,
      qty,
    });

    toast.success("تمت إضافة المنتج للسلة!");
  };

  return (
    <div className="card premium-card h-100 position-relative border-0" style={{ direction: "rtl" }}>
      {/* Badges container */}
      <div className="position-absolute top-0 start-0 p-3 d-flex flex-column gap-2" style={{ zIndex: 5 }}>
        {hasDiscount && (
          <span className="badge bg-danger rounded-pill px-3 py-2 fw-semibold fs-7 shadow-sm">
            خصم {discountPercent}%-
          </span>
        )}
        {is_featured && (
          <span className="badge bg-primary rounded-pill px-3 py-2 fw-semibold fs-7 shadow-sm">
            مميّز
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link to={`/product/${slug}`} className="text-decoration-none p-3 pb-0 d-block">
        <div className="ratio ratio-1x1 rounded-4 overflow-hidden" style={{ backgroundColor: "#F0EEED" }}>
          <img
            src={thumbnail_url}
            alt={name}
            loading="lazy"
            className="card-img-top object-fit-cover w-100 h-100"
          />
        </div>
      </Link>

      {/* Card Body */}
      <div className="card-body d-flex flex-column p-3">
        {/* Stock status indicator */}
        {show_stock && (
          <div className="mb-2">
            {fake_stock > 0 ? (
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 small fw-semibold">متبقي {fake_stock} قطع في المخزن</span>
            ) : (
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2.5 py-1 small fw-semibold">غير متوفر حالياً</span>
            )}
          </div>
        )}

        {/* Title */}
        <h6 className="card-title fw-bold text-dark mb-2 text-truncate-2" style={{ height: "40px", lineHeight: "20px" }}>
          <Link to={`/product/${slug}`} className="text-decoration-none text-dark">
            {name}
          </Link>
        </h6>

        {/* Price Section */}
        <div className="d-flex align-items-baseline gap-2 mb-3">
          <span className="fs-5 fw-bold text-primary">{finalPrice} ج.م</span>
          {hasDiscount && (
            <span className="text-muted text-decoration-line-through small">{price} ج.م</span>
          )}
        </div>

        {/* Dynamic Selectors directly inside the grid card */}
        <div className="mb-3">
          {/* Colors select */}
          {colors.length > 0 && (
            <select
              className="form-select form-select-sm mb-2"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              style={{ height: "36px", fontSize: "12px", borderRadius: "9999px", paddingRight: "16px", paddingLeft: "16px" }}
            >
              <option value="">اختر اللون</option>
              {colors.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {/* Sizes select */}
          {sizes.length > 0 && (
            <select
              className="form-select form-select-sm mb-2"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              style={{ height: "36px", fontSize: "12px", borderRadius: "9999px", paddingRight: "16px", paddingLeft: "16px" }}
            >
              <option value="">اختر المقاس</option>
              {sizes.map((s) => (
                <option key={s.id} value={s.size_name}>
                  {s.size_name}
                </option>
              ))}
            </select>
          )}

          {/* Quantity field */}
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light border-secondary-subtle" style={{ fontSize: "12px", borderRadius: "0 9999px 9999px 0" }}>الكمية</span>
            <input
              type="number"
              min="1"
              className="form-control"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              style={{ height: "36px", fontSize: "12px", borderRadius: "9999px 0 0 9999px", borderRight: "none" }}
            />
          </div>
        </div>

        {/* Actions Button */}
        <div className="mt-auto d-flex flex-column gap-2">
          <button
            onClick={handleCheckout}
            className="btn btn-whatsapp w-100 py-2 fs-7 fw-bold d-flex align-items-center justify-content-center gap-1"
          >
            اطلب الآن
          </button>
          
          <div className="d-flex gap-2">
            <button
              onClick={handleAddToBag}
              className="btn btn-outline-dark flex-grow-1 py-1.5 fs-8 fw-semibold d-flex align-items-center justify-content-center gap-1"
            >
              <ShoppingBag size={14} />
              <span>أضف للسلة</span>
            </button>
            
            <Link 
              to={`/product/${slug}`} 
              className="btn btn-outline-secondary py-1.5 px-3 fs-8 text-center text-decoration-none d-flex align-items-center justify-content-center"
            >
              التفاصيل
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
