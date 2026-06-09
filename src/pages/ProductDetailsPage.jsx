import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useProductBySlug } from "../hooks/useProduct";
import { useCart } from "../contexts/CartContext";
import { useWhatsApp } from "../hooks/useWhatsApp";
import { toast } from "react-hot-toast";
import { Clock, ShoppingBag, MessageCircle, Check } from "lucide-react";

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data: product, isLoading, error } = useProductBySlug(slug);

  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [timeLeft, setTimeLeft] = useState("");

  // Update active main image when product loads
  useEffect(() => {
    if (product) {
      setActiveImage(product.thumbnail_url);
    }
  }, [product]);

  // Countdown timer logic
  useEffect(() => {
    if (!product?.show_offer_timer || !product?.offer_end_date) return;

    const interval = setInterval(() => {
      const end = new Date(product.offer_end_date).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("انتهى العرض");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`تنتهي صلاحية العرض في: ${days} يوم و ${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [product]);

  if (isLoading) {
    return (
      <div className="container py-5 placeholder-glow" style={{ direction: "rtl" }}>
        <div className="row g-5">
          <div className="col-md-6">
            <div className="placeholder w-100 bg-secondary bg-opacity-25 rounded-4 mb-3" style={{ height: "450px" }}></div>
            <div className="d-flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="placeholder bg-secondary bg-opacity-25 rounded-3" style={{ width: "80px", height: "80px" }}></div>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <div className="placeholder bg-secondary bg-opacity-25 w-70 h-10 mb-3"></div>
            <div className="placeholder bg-secondary bg-opacity-25 w-40 h-5 mb-4"></div>
            <div className="placeholder bg-secondary bg-opacity-25 w-100 h-20 mb-5"></div>
            <div className="placeholder bg-primary bg-opacity-25 w-100 h-10 rounded-pill"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center" style={{ direction: "rtl", minHeight: "60vh" }}>
        <div className="alert alert-warning py-5">
          <h4 className="fw-bold mb-2">المنتج غير موجود</h4>
          <p className="text-muted">المنتج الذي تبحث عنه قد تم حذفه أو غير متوفر حالياً.</p>
          <Link to="/products" className="btn btn-primary mt-3">
            العودة لصفحة المنتجات
          </Link>
        </div>
      </div>
    );
  }

  const finalPrice = product.sale_price || product.price;
  const hasDiscount = !!product.sale_price && Number(product.sale_price) < Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.price) - Number(product.sale_price)) / Number(product.price)) * 100)
    : 0;

  // Add to Order Bag
  const handleAddToBag = () => {
    // Validation
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("الرجاء تحديد لون أولاً");
      return;
    }
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("الرجاء تحديد مقاس أولاً");
      return;
    }

    addToCart(product, {
      color: selectedColor,
      size: selectedSize,
      qty,
    });

    toast.success("تمت إضافة المنتج لسلة الطلبات!");
  };

  // Direct Order via WhatsApp
  const handleDirectOrder = () => {
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("الرجاء تحديد لون أولاً");
      return;
    }
    if (product.sizes?.length > 0 && !selectedSize) {
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

  // Structured Data (Schema.org JSON-LD)
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.thumbnail_url,
    "description": product.short_description || product.description || "",
    "offers": {
      "@type": "Offer",
      "price": finalPrice,
      "priceCurrency": "EGP",
      "availability": product.show_stock && product.fake_stock <= 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
    }
  };

  const seoTitle = product.meta_title || `${product.name} | متجرنا`;
  const seoDesc = product.meta_description || product.short_description || `اطلب منتج ${product.name} بسعر مميز ${finalPrice} ج.م مباشرة عبر تطبيق واتساب.`;

  return (
    <div className="container py-5" style={{ direction: "rtl" }}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:image" content={product.thumbnail_url} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      </Helmet>
      <div className="row g-5">
        {/* Left Gallery Section */}
        <div className="col-md-6">
          <div className="border rounded-4 overflow-hidden mb-3 ratio ratio-1x1" style={{ backgroundColor: "#F0EEED", borderColor: "#E6E6E6" }}>
            <img
              src={activeImage}
              alt={product.name}
              className="w-100 h-100 object-fit-cover"
            />
          </div>
          
          {/* Gallery selector thumbnails */}
          {product.images?.length > 0 && (
            <div className="d-flex gap-2 overflow-auto pb-2">
              {/* Add primary thumbnail to gallery list */}
              <div
                onClick={() => setActiveImage(product.thumbnail_url)}
                className={`border rounded-3 overflow-hidden cursor-pointer ${activeImage === product.thumbnail_url ? "border-dark border-2" : "border-light-subtle"}`}
                style={{ width: "80px", height: "80px", flexShrink: 0, cursor: "pointer", backgroundColor: "#F0EEED" }}
              >
                <img src={product.thumbnail_url} alt="Main" className="w-100 h-100 object-fit-cover" />
              </div>
              
              {product.images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setActiveImage(img.image_url)}
                  className={`border rounded-3 overflow-hidden cursor-pointer ${activeImage === img.image_url ? "border-dark border-2" : "border-light-subtle"}`}
                  style={{ width: "80px", height: "80px", flexShrink: 0, cursor: "pointer", backgroundColor: "#F0EEED" }}
                >
                  <img src={img.image_url} alt="Gallery" className="w-100 h-100 object-fit-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Details Info */}
        <div className="col-md-6">
          {/* Category breadcrumb */}
          {product.category && (
            <Link to={`/category/${product.category.slug}`} className="badge bg-secondary-subtle text-dark text-decoration-none px-3 py-2 mb-3">
              {product.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="fw-bold text-dark mb-2">{product.name}</h1>
          
          {/* Timer discount badge if active */}
          {product.show_offer_timer && timeLeft && (
            <div className="alert alert-warning py-2 px-3 small border-warning rounded-3 mb-4 d-inline-flex align-items-center gap-2">
              <Clock size={16} />
              <span>{timeLeft}</span>
            </div>
          )}

          {/* Pricing */}
          <div className="d-flex align-items-baseline gap-3 mb-4">
            <span className="fs-3 fw-bold text-primary">{finalPrice} ج.م</span>
            {hasDiscount && (
              <>
                <span className="text-muted text-decoration-line-through">{product.price} ج.م</span>
                <span className="badge bg-danger fs-8 rounded-pill px-3">خصم {discountPercent}%</span>
              </>
            )}
          </div>

          {/* Description */}
          {product.short_description && (
            <p className="text-muted mb-4 lead small">{product.short_description}</p>
          )}

          <hr className="my-4" />

          {/* Product Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-dark mb-2">اختر اللون:</h6>
              <div className="d-flex gap-2">
                {product.colors.map((c) => (
                  <span
                    key={c.id}
                    onClick={() => setSelectedColor(c.name)}
                    className={`color-selector-dot d-inline-flex align-items-center justify-content-center ${selectedColor === c.name ? "active" : ""}`}
                    style={{ backgroundColor: c.hex_code, width: "36px", height: "36px" }}
                    title={c.name}
                  >
                    {selectedColor === c.name && <Check size={16} className="text-white" strokeWidth={3.5} />}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Product Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-dark mb-2">اختر المقاس:</h6>
              <div className="d-flex gap-2">
                {product.sizes.map((s) => (
                  <span
                    key={s.id}
                    onClick={() => setSelectedSize(s.size_name)}
                    className={`size-selector-badge ${selectedSize === s.size_name ? "active" : ""}`}
                  >
                    {s.size_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stock limit badges */}
          {product.show_stock && (
            <p className="text-muted mb-3 small d-flex align-items-center gap-2">
              <span className="d-inline-block rounded-circle bg-success" style={{ width: "8px", height: "8px" }}></span>
              <span>المتوفر في المخزن: <strong>{product.fake_stock} قطع فقط</strong></span>
            </p>
          )}

          <div className="d-flex align-items-center flex-wrap gap-3 mt-4">
            {/* Quantity selector */}
            <div className="d-flex align-items-center justify-content-between px-3 bg-light rounded-pill" style={{ height: "52px", width: "120px" }}>
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="btn p-0 border-0 fs-5 fw-bold text-dark d-flex align-items-center justify-content-center"
                style={{ width: "24px", height: "24px" }}
              >
                -
              </button>
              <span className="fw-bold fs-6">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="btn p-0 border-0 fs-5 fw-bold text-dark d-flex align-items-center justify-content-center"
                style={{ width: "24px", height: "24px" }}
              >
                +
              </button>
            </div>

            {/* Purchase actions CTAs */}
            <div className="d-flex flex-grow-1 gap-2">
              <button
                onClick={handleDirectOrder}
                className="btn btn-whatsapp flex-grow-1 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 fs-5 shadow-sm"
                style={{ height: "52px" }}
              >
                <span>اطلب الآن</span>
                <MessageCircle size={22} />
              </button>
              <button
                onClick={handleAddToBag}
                className="btn btn-outline-dark px-4 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2 fs-5"
                style={{ height: "52px" }}
              >
                <span>إضافة إلى السلة</span>
                <ShoppingBag size={22} />
              </button>
            </div>
          </div>

          {/* Detailed Description */}
          {product.description && (
            <div className="mt-5 border-top pt-4">
              <h5 className="fw-bold text-dark mb-3">وصف المنتج تفصيلياً</h5>
              <div className="text-muted small" style={{ whiteSpace: "pre-line" }}>
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
