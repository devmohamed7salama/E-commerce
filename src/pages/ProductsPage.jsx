import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ProductsPage() {
  const { categorySlug } = useParams(); // For /category/:categorySlug
  const { data: products, isLoading: productsLoading, error: productsError } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [searchParams] = useSearchParams();
  const queryCategoryId = searchParams.get("category");

  // Sync category state with URL parameter if present
  useEffect(() => {
    if (categorySlug && categories) {
      const matchedCat = categories.find((c) => c.slug === categorySlug);
      if (matchedCat) {
        setSelectedCategory(matchedCat.id);
      }
    } else if (queryCategoryId) {
      // Support ?category=<id> from HeroSlider links
      setSelectedCategory(queryCategoryId);
    } else if (!categorySlug) {
      setSelectedCategory("");
    }
  }, [categorySlug, categories, queryCategoryId]);

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    setSearchQuery(""); // clear search on category change
  };

  // Filter products based on search query, category, and active status
  const activeProducts = products?.filter((p) => p.is_active) || [];
  const activeCategories = categories?.filter((c) => c.is_active) || [];

  const filteredProducts = activeProducts.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (prod.short_description && prod.short_description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || prod.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get currently viewed category name
  const currentCategoryName = selectedCategory 
    ? activeCategories.find((c) => c.id === selectedCategory)?.name 
    : "جميع المنتجات";

  const seoTitle = `${currentCategoryName} | تصفح الكتالوج`;
  const seoDesc = `تصفح المنتجات في قسم ${currentCategoryName}. تسوق أفضل الموديلات والأسعار في مصر واطلب فوراً عبر واتساب.`;

  return (
    <div className="container py-4" style={{ direction: "rtl", minHeight: "80vh", fontFamily: "Cairo, sans-serif" }}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb mb-0 small" style={{ padding: 0, backgroundColor: "transparent" }}>
          <li className="breadcrumb-item"><Link to="/" className="text-muted text-decoration-none">الرئيسية</Link></li>
          <li className="breadcrumb-item"><Link to="/products" className="text-muted text-decoration-none">المنتجات</Link></li>
          {selectedCategory && (
            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">{currentCategoryName}</li>
          )}
        </ol>
      </nav>

      {/* Title section */}
      <div className="mb-4 d-flex flex-wrap justify-content-between align-items-baseline gap-2 border-bottom pb-3">
        <div>
          <h1 className="fw-black text-dark mb-1" style={{ fontSize: "28px" }}>{currentCategoryName}</h1>
          <p className="text-muted mb-0 small">تصفح التشكيلة الكاملة واطلب احتياجاتك مباشرة عبر واتساب</p>
        </div>
        <div className="text-muted fs-7">
          عرض <strong className="text-dark">{filteredProducts.length}</strong> منتج
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar Filters - Desktop */}
        <aside className="col-lg-3 d-none d-lg-block">
          <div className="card border p-4 rounded-4" style={{ backgroundColor: "#ffffff", borderColor: "#E6E6E6" }}>
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
              <h5 className="fw-bold mb-0 text-dark fs-6 d-flex align-items-center gap-2">
                <SlidersHorizontal size={18} />
                <span>أقسام المتجر</span>
              </h5>
            </div>
            
            <div className="d-flex flex-column gap-3">
              <button
                onClick={() => handleCategorySelect("")}
                className={`border-0 bg-transparent text-start py-1 px-2 d-flex justify-content-between align-items-center w-100 ${!selectedCategory ? "fw-bold text-dark" : "text-muted"}`}
                style={{ fontSize: "14px", transition: "color 0.2s" }}
              >
                <span>كل المنتجات</span>
                <span className="badge bg-light text-secondary border fs-8 rounded-pill">{activeProducts.length}</span>
              </button>

              {categoriesLoading ? (
                <div className="placeholder-glow">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="placeholder bg-secondary bg-opacity-25 w-100 h-5 mb-2 rounded-2"></div>
                  ))}
                </div>
              ) : (
                activeCategories.map((cat) => {
                  const productCount = activeProducts.filter(p => p.category_id === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`border-0 bg-transparent text-start py-1 px-2 d-flex justify-content-between align-items-center w-100 ${selectedCategory === cat.id ? "fw-bold text-dark" : "text-muted"}`}
                      style={{ fontSize: "14px", transition: "color 0.2s" }}
                    >
                      <span>{cat.name}</span>
                      <span className="badge bg-light text-secondary border fs-8 rounded-pill">{productCount}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* Content area */}
        <div className="col-lg-9">
          {/* Search bar & Mobile Filters */}
          <div className="row g-3 mb-4 align-items-center">
            {/* Search Input */}
            <div className="col-12">
              <div className="input-group rounded-pill overflow-hidden border bg-light px-3 py-1 align-items-center" style={{ borderColor: "#E6E6E6" }}>
                <span className="bg-transparent border-0 text-muted d-flex align-items-center">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control bg-transparent border-0 px-2 fs-6 shadow-none"
                  placeholder="ابحث باسم المنتج أو المواصفات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ height: "40px" }}
                />
              </div>
            </div>

            {/* Mobile Categories Selector */}
            <div className="col-12 d-lg-none">
              <div className="d-flex gap-2 overflow-auto pb-2" style={{ whiteSpace: "nowrap" }}>
                <button
                  onClick={() => handleCategorySelect("")}
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-semibold border ${!selectedCategory ? "btn-primary text-white border-dark bg-dark" : "btn-light text-dark border-secondary-subtle"}`}
                  style={{ fontSize: "13px" }}
                >
                  الكل ({activeProducts.length})
                </button>
                {activeCategories.map((cat) => {
                  const count = activeProducts.filter(p => p.category_id === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`btn btn-sm px-4 py-2 rounded-pill fw-semibold border ${selectedCategory === cat.id ? "btn-primary text-white border-dark bg-dark" : "btn-light text-dark border-secondary-subtle"}`}
                      style={{ fontSize: "13px" }}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="col-12 col-sm-6 col-md-4">
                  <div className="card border-0 placeholder-glow" style={{ height: "380px" }}>
                    <div className="placeholder bg-secondary bg-opacity-25 w-100 h-60 mb-3 rounded-3" style={{ minHeight: "220px" }}></div>
                    <div className="placeholder bg-secondary bg-opacity-25 w-75 h-5 mb-2"></div>
                    <div className="placeholder bg-secondary bg-opacity-25 w-50 h-5 mb-3"></div>
                    <div className="placeholder bg-primary bg-opacity-25 w-100 h-10 rounded-pill"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : productsError ? (
            <div className="alert alert-danger text-center rounded-3">حدث خطأ أثناء تحميل المنتجات. الرجاء إعادة المحاولة لاحقاً.</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5 border rounded-4 bg-light">
              <div className="text-muted mb-3">
                <Search size={48} className="mx-auto" />
              </div>
              <h5 className="fw-bold text-dark">لا يوجد نتائج تطابق بحثك</h5>
              <p className="text-muted small">جرب البحث بكلمات أخرى أو اختر أقساماً مختلفة</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                }}
                className="btn btn-dark btn-sm rounded-pill mt-3 px-4 py-2"
              >
                عرض كل المنتجات
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="col-12 col-sm-6 col-md-4">
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
