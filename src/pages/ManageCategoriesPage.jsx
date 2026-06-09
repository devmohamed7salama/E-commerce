import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCategories } from "../hooks/useCategories";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { uploadCategoryImage } from "../services/storageService";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

// Zod Validation Schema
const schema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  slug: z.string().min(2, "الرابط البديل يجب أن يكون حرفين على الأقل"),
  parent_id: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});



export default function ManageCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // State to track if editing an existing category
  const [editingCategory, setEditingCategory] = useState(null);

  // File upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      parent_id: "",
      is_active: true,
    },
  });

  const categoryName = watch("name");

  // Generate slug dynamically in create mode
  useEffect(() => {
    if (!editingCategory && categoryName) {
      const generatedSlug = categoryName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
        .replace(/\s+/g, "-");
      setValue("slug", generatedSlug);
    }
  }, [categoryName, editingCategory, setValue]);

  // Load category into form for edit mode
  const handleEditClick = (cat) => {
    setEditingCategory(cat);
    setValue("name", cat.name || "");
    setValue("slug", cat.slug || "");
    setValue("parent_id", cat.parent_id || "");
    setValue("is_active", cat.is_active !== false);
    setImagePreview(cat.image_url || "");
    setImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    reset({
      name: "",
      slug: "",
      parent_id: "",
      is_active: true,
    });
    setImagePreview("");
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من حذف القسم "${name}"؟ تنبيه: سيتم حذف جميع الأقسام الفرعية التابعة له وتتأثر المنتجات المرتبطة به.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("تم حذف القسم بنجاح");
      if (editingCategory?.id === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error(error);
      toast.error("فشل حذف القسم: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      let finalImageUrl = imagePreview;

      // Upload image to Supabase storage if file is chosen
      if (imageFile) {
        toast.loading("جاري رفع صورة القسم...", { id: "category-upload" });
        finalImageUrl = await uploadCategoryImage(imageFile);
      }

      toast.loading("جاري حفظ بيانات القسم...", { id: "category-upload" });

      const categoryPayload = {
        name: data.name,
        slug: data.slug,
        parent_id: data.parent_id === "" ? null : data.parent_id,
        is_active: data.is_active,
        image_url: finalImageUrl || null,
      };

      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          category: categoryPayload,
        });
        toast.success("تم تحديث القسم بنجاح!", { id: "category-upload" });
      } else {
        await createMutation.mutateAsync(categoryPayload);
        toast.success("تم إضافة القسم بنجاح!", { id: "category-upload" });
      }

      handleCancelEdit();
    } catch (error) {
      console.error(error);
      toast.error("فشل حفظ القسم: " + error.message, { id: "category-upload" });
    } finally {
      setSaving(false);
    }
  };

  // Filter out the category itself (and its children to prevent recursion, simplified here by filtering just the category itself)
  const availableParentCategories = categories.filter(
    (c) => !editingCategory || c.id !== editingCategory.id
  );

  return (
    <div className="container-fluid py-4" style={{ fontFamily: "Cairo, sans-serif" }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">الأقسام</h2>
        <p className="text-muted mb-0">إدارة وتصنيف المنتجات في أقسام رئيسية وفرعية</p>
      </div>

      <div className="row g-4">
        {/* Categories Table (List) */}
        <div className="col-12 col-lg-8 order-2 order-lg-1">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 border-light">
              <h5 className="fw-bold text-dark mb-0 fs-6">قائمة الأقسام الحالية</h5>
            </div>
            <div className="card-body p-0">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">جاري التحميل...</span>
                  </div>
                  <p className="text-muted mt-2 mb-0">جاري تحميل الأقسام...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  لا توجد أقسام مضافة حالياً. استخدم النموذج لإضافة أول قسم.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-0 text-muted">
                      <tr>
                        <th className="px-4 py-3 text-end" style={{ width: "80px" }}>الصورة</th>
                        <th className="py-3 text-end">القسم</th>
                        <th className="py-3 text-end">القسم الأب</th>
                        <th className="py-3 text-center">الحالة</th>
                        <th className="px-4 py-3 text-center" style={{ width: "130px" }}>خيارات</th>
                      </tr>
                    </thead>
                    <tbody className="border-0">
                      {categories.map((c) => (
                        <tr
                          key={c.id}
                          className={editingCategory?.id === c.id ? "table-primary-subtle" : ""}
                        >
                          <td className="px-4 py-3 text-end">
                            {c.image_url ? (
                              <img
                                src={c.image_url}
                                alt={c.name}
                                className="rounded object-fit-cover shadow-sm border"
                                style={{ width: "40px", height: "40px" }}
                              />
                            ) : (
                              <div
                                className="bg-light rounded d-flex align-items-center justify-content-center text-muted border border-dashed"
                                style={{ width: "40px", height: "40px", fontSize: "12px" }}
                              >
                                لا صورة
                              </div>
                            )}
                          </td>
                          <td className="py-3 text-end">
                            <div className="fw-semibold text-dark mb-0">{c.name}</div>
                            <span className="text-muted fs-8">{c.slug}</span>
                          </td>
                          <td className="py-3 text-end">
                            {c.parent ? (
                              <span className="badge bg-light text-muted border px-2 py-1 fs-7">
                                {c.parent.name}
                              </span>
                            ) : (
                              <span className="text-muted fs-8">- رئيسي</span>
                            )}
                          </td>
                          <td className="py-3 text-center">
                            {c.is_active !== false ? (
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
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm p-1 rounded-2 d-flex align-items-center justify-content-center"
                                style={{ width: "30px", height: "30px" }}
                                title="تعديل"
                                onClick={() => handleEditClick(c)}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm p-1 rounded-2 d-flex align-items-center justify-content-center"
                                style={{ width: "30px", height: "30px" }}
                                title="حذف"
                                onClick={() => handleDelete(c.id, c.name)}
                                disabled={deletingId === c.id}
                              >
                                {deletingId === c.id ? (
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

        {/* Inline Add/Edit Form Card */}
        <div className="col-12 col-lg-4 order-1 order-lg-2">
          <div className="card border-0 shadow-sm position-sticky" style={{ top: "24px" }}>
            <div className="card-header bg-white py-3 border-light d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-dark mb-0 fs-6">
                {editingCategory ? "تعديل القسم" : "إضافة قسم جديد"}
              </h5>
              {editingCategory && (
                <button
                  type="button"
                  className="btn btn-xs btn-outline-secondary py-1 px-2 fs-8 fw-semibold"
                  onClick={handleCancelEdit}
                >
                  إلغاء التعديل
                </button>
              )}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-muted fs-7">اسم القسم *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="مثال: هوديز، سويت شيرت، اكسسوارات"
                    {...register("name")}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-muted fs-7">الرابط البديل (slug) *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                    placeholder="مثال: hoddies"
                    {...register("slug")}
                  />
                  {errors.slug && <div className="invalid-feedback">{errors.slug.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-muted fs-7">القسم الأب (اختياري)</label>
                  <select
                    className={`form-select ${errors.parent_id ? "is-invalid" : ""}`}
                    {...register("parent_id")}
                  >
                    <option value="">قسم رئيسي (بدون أب)</option>
                    {availableParentCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.parent_id && <div className="invalid-feedback">{errors.parent_id.message}</div>}
                  <small className="text-muted mt-1 d-block fs-8">لتصنيف القسم كقسم فرعي لقسم آخر</small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted fs-7">صورة القسم (اختياري)</label>
                  {imagePreview && (
                    <div className="mb-3 text-center position-relative border rounded p-1">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="rounded object-fit-cover shadow-sm w-100"
                        style={{ maxHeight: "150px" }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="form-check form-switch mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="is_active"
                    {...register("is_active")}
                  />
                  <label className="form-check-label fw-semibold text-dark me-2" htmlFor="is_active">
                    القسم نشط ويظهر في المتجر
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm flex-shrink-0" role="status" aria-hidden="true"></span>
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      {!editingCategory && <Plus size={16} />}
                      <span>{editingCategory ? "تحديث القسم الحالي" : "إضافة القسم الجديد"}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
