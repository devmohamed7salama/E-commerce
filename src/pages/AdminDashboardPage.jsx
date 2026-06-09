import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useSliders } from "../hooks/useSliders";
import { Package, Folder, Images, CheckCircle, Star, Percent, Layers, Coins } from "lucide-react";



export default function AdminDashboardPage() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: sliders = [], isLoading: slidersLoading } = useSliders();

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalSliders = sliders.length;

  const activeProducts = products.filter((p) => p.is_active).length;
  const hiddenProducts = totalProducts - activeProducts;

  const featuredProducts = products.filter((p) => p.is_featured).length;
  const discountedProducts = products.filter((p) => p.sale_price !== null && Number(p.sale_price) > 0 && Number(p.sale_price) < Number(p.price)).length;
  const totalStock = products.reduce((acc, p) => acc + (p.fake_stock || 0), 0);
  
  const activeProductsWithPrice = products.filter((p) => p.price > 0);
  const avgPrice = activeProductsWithPrice.length > 0 
    ? (activeProductsWithPrice.reduce((acc, p) => acc + Number(p.price), 0) / activeProductsWithPrice.length).toFixed(2) 
    : "0.00";

  // Calculate product counts per category
  const categoryStats = categories.map((cat) => {
    const count = products.filter((p) => p.category_id === cat.id).length;
    const percentage = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
    return {
      ...cat,
      count,
      percentage,
    };
  }).sort((a, b) => b.count - a.count); // Show categories with most products first

  const isDataLoading = productsLoading || categoriesLoading || slidersLoading;

  return (
    <div className="container-fluid py-4" style={{ fontFamily: "Cairo, sans-serif" }}>
      {/* Welcome Row */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">لوحة التحكم</h2>
        <p className="text-muted mb-0">نظرة عامة على إحصائيات المتجر وإدارة العمليات المتاحة</p>
      </div>

      {isDataLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="text-muted mt-2">جاري تحميل إحصائيات المتجر...</p>
        </div>
      ) : (
        <>
          {/* Bento Grid Metrics Cards */}
          <div className="row g-4 mb-4">
            {/* Card 1: Total Products */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted fs-7 fw-semibold d-block mb-1">إجمالي المنتجات</span>
                    <h3 className="fw-bold text-dark mb-0">{totalProducts}</h3>
                  </div>
                  <div className="p-3 bg-primary-subtle rounded-3 text-primary">
                    <Package size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Active Products */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted fs-7 fw-semibold d-block mb-1">المنتجات النشطة</span>
                    <h3 className="fw-bold text-dark mb-0">{activeProducts}</h3>
                    <small className="text-muted fs-8">تظهر للعملاء في المتجر</small>
                  </div>
                  <div className="p-3 bg-success-subtle rounded-3 text-success">
                    <CheckCircle size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Featured Products */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted fs-7 fw-semibold d-block mb-1">المنتجات المميزة</span>
                    <h3 className="fw-bold text-dark mb-0">{featuredProducts}</h3>
                    <small className="text-muted fs-8">تظهر في العروض الخاصة</small>
                  </div>
                  <div className="p-3 bg-warning-subtle rounded-3 text-warning">
                    <Star size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Discounted Products */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted fs-7 fw-semibold d-block mb-1">منتجات الخصم</span>
                    <h3 className="fw-bold text-dark mb-0">{discountedProducts}</h3>
                    <small className="text-muted fs-8">تحتوي على سعر تخفيض</small>
                  </div>
                  <div className="p-3 bg-danger-subtle rounded-3 text-danger">
                    <Percent size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {/* Card 5: Total Store Stock */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted fs-7 fw-semibold d-block mb-1">إجمالي المخزون</span>
                    <h3 className="fw-bold text-dark mb-0">{totalStock} <span className="fs-6 text-muted fw-normal">قطعة</span></h3>
                    <small className="text-muted fs-8">مجموع كميات المنتجات</small>
                  </div>
                  <div className="p-3 bg-info-subtle rounded-3 text-info">
                    <Layers size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 6: Average Price */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted fs-7 fw-semibold d-block mb-1">متوسط الأسعار</span>
                    <h3 className="fw-bold text-dark mb-0">{avgPrice} <span className="fs-6 text-muted fw-normal">ج.م</span></h3>
                    <small className="text-muted fs-8">متوسط سعر المنتجات</small>
                  </div>
                  <div className="p-3 bg-secondary-subtle rounded-3 text-secondary">
                    <Coins size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 7: Total Categories */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted fs-7 fw-semibold d-block mb-1">أقسام المتجر</span>
                    <h3 className="fw-bold text-dark mb-0">{totalCategories}</h3>
                    <small className="text-muted fs-8">الأقسام الرئيسية والفرعية</small>
                  </div>
                  <div className="p-3 bg-success-subtle rounded-3 text-success">
                    <Folder size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 8: Banners Slider */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted fs-7 fw-semibold d-block mb-1">بنرات السلايدر</span>
                    <h3 className="fw-bold text-dark mb-0">{totalSliders}</h3>
                    <small className="text-danger fw-semibold fs-8">{hiddenProducts} منتجات مخفية</small>
                  </div>
                  <div className="p-3 bg-warning-subtle rounded-3 text-warning">
                    <Images size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Category Breakdown list */}
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white py-3 border-light">
                  <h5 className="fw-bold text-dark mb-0 fs-6">المنتجات حسب القسم</h5>
                </div>
                <div className="card-body p-0">
                  {categoryStats.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      لا توجد أقسام مسجلة لعرض إحصائياتها.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light border-0 text-muted">
                          <tr>
                            <th className="px-4 py-3 text-end">القسم</th>
                            <th className="py-3 text-center" style={{ width: "120px" }}>عدد المنتجات</th>
                            <th className="px-4 py-3 text-end" style={{ width: "350px" }}>النسبة من إجمالي المنتجات</th>
                          </tr>
                        </thead>
                        <tbody className="border-0">
                          {categoryStats.map((cat) => (
                            <tr key={cat.id}>
                              <td className="px-4 py-3 text-end fw-semibold text-dark">
                                {cat.name}
                              </td>
                              <td className="py-3 text-center">
                                <span className="badge bg-light text-dark border px-3 py-1.5 fs-7 fw-bold">
                                  {cat.count}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-end">
                                <div className="d-flex align-items-center justify-content-end gap-3">
                                  <div className="progress flex-grow-1 bg-light rounded-pill" style={{ height: "8px", maxWidth: "250px" }}>
                                    <div
                                      className="progress-bar bg-primary rounded-pill"
                                      role="progressbar"
                                      style={{ width: `${cat.percentage}%` }}
                                      aria-valuenow={cat.percentage}
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                  <span className="fw-bold text-muted fs-7" style={{ minWidth: "45px", textDirection: "ltr", display: "inline-block" }}>
                                    {cat.percentage}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Links & Tips */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white py-3 border-light">
                  <h5 className="fw-bold text-dark mb-0 fs-6">روابط سريعة</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2 mb-4">
                    <Link to="/admin/products/new" className="btn btn-primary py-2.5 fw-semibold shadow-sm text-center text-white">
                      إضافة منتج جديد
                    </Link>
                    <Link to="/admin/categories" className="btn btn-outline-success py-2.5 fw-semibold text-center">
                      إدارة الأقسام
                    </Link>
                    <Link to="/admin/sliders" className="btn btn-outline-warning py-2.5 fw-semibold text-center text-dark">
                      إضافة بنر إعلاني للواجهة
                    </Link>
                    <Link to="/admin/settings" className="btn btn-outline-secondary py-2.5 fw-semibold text-center">
                      تعديل إعدادات المتجر العامة
                    </Link>
                  </div>

                  <hr className="my-3 border-light" />

                  <h6 className="fw-bold text-dark mb-2">إرشادات سريعة:</h6>
                  <ul className="text-muted small ps-3 mb-0" style={{ listStyleType: "square" }}>
                    <li className="mb-2">تأكد من إدخال رقم الواتساب بالشكل الصحيح في الإعدادات لضمان وصول طلبات العملاء وسلة الشراء إلى حسابك مباشرة.</li>
                    <li className="mb-2">يمكنك تحويل أي منتج لـ "مميز" ليظهر في واجهة المتجر الرئيسية في قسم العروض الخاصة.</li>
                    <li>الأقسام الخاملة (المخفية) ستخفي جميع المنتجات المندرجة تحتها تلقائياً عن المشترين.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
