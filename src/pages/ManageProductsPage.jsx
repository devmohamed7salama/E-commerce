import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import toast from "react-hot-toast";
import { Search, Plus, Pencil, Trash2, Star } from "lucide-react";



export default function ManageProductsPage() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const deleteMutation = useDeleteProduct();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من حذف المنتج "${name}"؟`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("تم حذف المنتج بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("فشل في حذف المنتج: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.short_description && p.short_description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container-fluid py-4" style={{ fontFamily: "Cairo, sans-serif" }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">المنتجات</h2>
          <p className="text-muted mb-0">إدارة وعرض وتعديل قائمة منتجات المتجر بالكامل</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm">
          <Plus size={16} />
          <span>إضافة منتج جديد</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            {/* Search Input */}
            <div className="col-12 col-md-6 col-lg-8">
              <div className="input-group">
                <span className="input-group-text bg-light border-0 text-muted">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 shadow-none"
                  placeholder="ابحث عن اسم المنتج، الوصف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="col-12 col-md-6 col-lg-4">
              <select
                className="form-select bg-light border-0 shadow-none text-muted"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">كل الأقسام</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {productsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
              </div>
              <p className="text-muted mt-2 mb-0">جاري تحميل المنتجات...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted fs-5 mb-0">لم يتم العثور على أي منتجات مطابقة للبحث</p>
              {products.length === 0 && (
                <Link to="/admin/products/new" className="btn btn-outline-primary btn-sm mt-3">
                  إضافة أول منتج الآن
                </Link>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-0 text-muted">
                  <tr>
                    <th className="px-4 py-3 text-end" style={{ width: "80px" }}>المنتج</th>
                    <th className="py-3 text-end">الاسم / القسم</th>
                    <th className="py-3 text-end">السعر</th>
                    <th className="py-3 text-center">المميز</th>
                    <th className="py-3 text-center">الحالة</th>
                    <th className="px-4 py-3 text-center" style={{ width: "150px" }}>خيارات</th>
                  </tr>
                </thead>
                <tbody className="border-0">
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 text-end">
                        <img
                          src={p.thumbnail_url}
                          alt={p.name}
                          className="rounded object-fit-cover shadow-sm border"
                          style={{ width: "50px", height: "50px" }}
                        />
                      </td>
                      <td className="py-3 text-end">
                        <div className="fw-semibold text-dark mb-1">{p.name}</div>
                        <span className="badge bg-light text-muted border px-2 py-1 fs-7">
                          {p.category?.name || "بدون قسم"}
                        </span>
                      </td>
                      <td className="py-3 text-end">
                        {p.sale_price ? (
                          <div>
                            <span className="fw-bold text-primary">{p.sale_price} ج.م</span>
                            <span className="text-muted text-decoration-line-through fs-7 me-2">{p.price} ج.م</span>
                          </div>
                        ) : (
                          <span className="fw-bold text-dark">{p.price} ج.م</span>
                        )}
                      </td>
                      <td className="py-3 text-center">
                        {p.is_featured ? (
                          <span className="d-inline-flex align-items-center gap-1 badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1">
                            <Star size={16} className="fill-warning text-warning" />
                            <span>مميز</span>
                          </span>
                        ) : (
                          <span className="text-muted fs-7">-</span>
                        )}
                      </td>
                      <td className="py-3 text-center">
                        {p.is_active ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                            نشط
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                            مخفي
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <Link
                            to={`/admin/products/edit/${p.id}`}
                            className="btn btn-outline-secondary btn-sm p-1 rounded-2 d-flex align-items-center justify-content-center"
                            title="تعديل"
                            style={{ width: "32px", height: "32px" }}
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm p-1 rounded-2 d-flex align-items-center justify-content-center"
                            title="حذف"
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deletingId === p.id}
                            style={{ width: "32px", height: "32px" }}
                          >
                            {deletingId === p.id ? (
                              <span className="spinner-border spinner-border-sm flex-shrink-0" role="status" aria-hidden="true"></span>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
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
  );
}
