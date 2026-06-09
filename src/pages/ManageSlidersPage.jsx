import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSliders } from "../hooks/useSliders";
import { useCreateSlider } from "../hooks/useCreateSlider";
import { useUpdateSlider } from "../hooks/useUpdateSlider";
import { useDeleteSlider } from "../hooks/useDeleteSlider";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { uploadSliderImage } from "../services/storageService";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

// Zod Validation Schema
const schema = z.object({
  title: z.string().optional().nullable(),
  link_type: z.enum(["category", "product", "none"]).default("none"),
  link_id: z.string().optional().nullable(),
  sort_order: z.preprocess((val) => (val === "" || val === undefined ? 0 : Number(val)), z.number().int()),
  is_active: z.boolean().default(true),
});



export default function ManageSlidersPage() {
  const { data: sliders = [], isLoading: slidersLoading } = useSliders();
  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useProducts();

  const createMutation = useCreateSlider();
  const updateMutation = useUpdateSlider();
  const deleteMutation = useDeleteSlider();

  // State to track if editing an existing slider
  const [editingSlider, setEditingSlider] = useState(null);

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
      title: "",
      link_type: "none",
      link_id: "",
      sort_order: 0,
      is_active: true,
    },
  });

  const selectedLinkType = watch("link_type");

  // Load slider into form for edit mode
  const handleEditClick = (slide) => {
    setEditingSlider(slide);
    setValue("title", slide.title || "");
    setValue("link_type", slide.link_type || "none");
    setValue("link_id", slide.link_id || "");
    setValue("sort_order", slide.sort_order || 0);
    setValue("is_active", slide.is_active !== false);
    setImagePreview(slide.image_url || "");
    setImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditingSlider(null);
    reset({
      title: "",
      link_type: "none",
      link_id: "",
      sort_order: 0,
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

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا السلايدر؟")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("تم حذف السلايدر بنجاح");
      if (editingSlider?.id === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error(error);
      toast.error("فشل حذف السلايدر: " + error.message);
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
        toast.loading("جاري رفع صورة السلايدر...", { id: "slider-upload" });
        finalImageUrl = await uploadSliderImage(imageFile);
      } else if (!editingSlider) {
        toast.error("يرجى اختيار صورة للسلايدر الجديد", { id: "slider-upload" });
        setSaving(false);
        return;
      }

      toast.loading("جاري حفظ بيانات السلايدر...", { id: "slider-upload" });

      const sliderPayload = {
        title: data.title || null,
        image_url: finalImageUrl,
        link_type: data.link_type,
        link_id: data.link_type === "none" || !data.link_id ? null : data.link_id,
        sort_order: data.sort_order,
        is_active: data.is_active,
      };

      if (editingSlider) {
        await updateMutation.mutateAsync({
          id: editingSlider.id,
          slider: sliderPayload,
        });
        toast.success("تم تحديث السلايدر بنجاح!", { id: "slider-upload" });
      } else {
        await createMutation.mutateAsync(sliderPayload);
        toast.success("تم إضافة السلايدر بنجاح!", { id: "slider-upload" });
      }

      handleCancelEdit();
    } catch (error) {
      console.error(error);
      toast.error("فشل حفظ السلايدر: " + error.message, { id: "slider-upload" });
    } finally {
      setSaving(false);
    }
  };

  // Get link label to show in table
  const getLinkLabel = (slide) => {
    if (slide.link_type === "none" || !slide.link_id) return "بدون رابط";
    if (slide.link_type === "category") {
      const cat = categories.find((c) => c.id === slide.link_id);
      return cat ? `قسم: ${cat.name}` : "قسم غير معروف";
    }
    if (slide.link_type === "product") {
      const prod = products.find((p) => p.id === slide.link_id);
      return prod ? `منتج: ${prod.name}` : "منتج غير معروف";
    }
    return "رابط مخصص";
  };

  return (
    <div className="container-fluid py-4" style={{ fontFamily: "Cairo, sans-serif" }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">السلايدر الإعلاني</h2>
        <p className="text-muted mb-0">إدارة البنرات الإعلانية المتحركة المعروضة في الصفحة الرئيسية</p>
      </div>

      <div className="row g-4">
        {/* Sliders Table (List) */}
        <div className="col-12 col-lg-8 order-2 order-lg-1">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 border-light">
              <h5 className="fw-bold text-dark mb-0 fs-6">قائمة البنرات الحالية</h5>
            </div>
            <div className="card-body p-0">
              {slidersLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">جاري التحميل...</span>
                  </div>
                  <p className="text-muted mt-2 mb-0">جاري تحميل السلايدر...</p>
                </div>
              ) : sliders.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  لا توجد بنرات مضافة حالياً. استخدم النموذج لإضافة أول بنر إعلاني.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-0 text-muted">
                      <tr>
                        <th className="px-4 py-3 text-end" style={{ width: "120px" }}>البنر</th>
                        <th className="py-3 text-end">العنوان الكود</th>
                        <th className="py-3 text-end">الرابط</th>
                        <th className="py-3 text-center">الترتيب</th>
                        <th className="py-3 text-center">الحالة</th>
                        <th className="px-4 py-3 text-center" style={{ width: "130px" }}>خيارات</th>
                      </tr>
                    </thead>
                    <tbody className="border-0">
                      {sliders.map((s) => (
                        <tr
                          key={s.id}
                          className={editingSlider?.id === s.id ? "table-primary-subtle" : ""}
                        >
                          <td className="px-4 py-3 text-end">
                            <img
                              src={s.image_url}
                              alt={s.title || "Slider banner"}
                              className="rounded object-fit-cover shadow-sm border"
                              style={{ width: "90px", height: "50px" }}
                            />
                          </td>
                          <td className="py-3 text-end">
                            <div className="fw-semibold text-dark mb-0">{s.title || "- بدون عنوان -"}</div>
                          </td>
                          <td className="py-3 text-end">
                            <span className="badge bg-light text-muted border px-2 py-1 fs-7">
                              {getLinkLabel(s)}
                            </span>
                          </td>
                          <td className="py-3 text-center fw-bold text-dark">
                            {s.sort_order}
                          </td>
                          <td className="py-3 text-center">
                            {s.is_active !== false ? (
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
                                onClick={() => handleEditClick(s)}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm p-1 rounded-2 d-flex align-items-center justify-content-center"
                                style={{ width: "30px", height: "30px" }}
                                title="حذف"
                                onClick={() => handleDelete(s.id)}
                                disabled={deletingId === s.id}
                              >
                                {deletingId === s.id ? (
                                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
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
                {editingSlider ? "تعديل السلايدر" : "إضافة بنر جديد"}
              </h5>
              {editingSlider && (
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
                  <label className="form-label fw-semibold text-muted fs-7">عنوان البنر (اختياري)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="مثال: خصم 50% على الهودي البينك"
                    {...register("title")}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-muted fs-7">صورة البنر *</label>
                  {imagePreview && (
                    <div className="mb-3 text-center position-relative border rounded p-1">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="rounded object-fit-cover shadow-sm w-100"
                        style={{ maxHeight: "130px" }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small className="text-muted mt-1 d-block fs-8">يفضل نسبة عرضية عريضة (1200x500) بحد أقصى 2MB</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-muted fs-7">نوع الارتباط بالرابط</label>
                  <select
                    className="form-select"
                    {...register("link_type")}
                  >
                    <option value="none">بدون رابط (صورة عرض فقط)</option>
                    <option value="category">ارتباط بقسم معين</option>
                    <option value="product">ارتباط بمنتج معين</option>
                  </select>
                </div>

                {/* Conditional fields for link target */}
                {selectedLinkType === "category" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted fs-7">اختر القسم المستهدف *</label>
                    <select
                      className="form-select"
                      {...register("link_id")}
                      required
                    >
                      <option value="">-- اختر القسم --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedLinkType === "product" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted fs-7">اختر المنتج المستهدف *</label>
                    <select
                      className="form-select"
                      {...register("link_id")}
                      required
                    >
                      <option value="">-- اختر المنتج --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold text-muted fs-7">ترتيب العرض</label>
                  <input
                    type="number"
                    className={`form-control ${errors.sort_order ? "is-invalid" : ""}`}
                    placeholder="0"
                    {...register("sort_order")}
                  />
                  {errors.sort_order && <div className="invalid-feedback">{errors.sort_order.message}</div>}
                  <small className="text-muted mt-1 d-block fs-8">أصغر رقم يتم عرضه أولاً في الصفحة الرئيسية</small>
                </div>

                <div className="form-check form-switch mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="is_active"
                    {...register("is_active")}
                  />
                  <label className="form-check-label fw-semibold text-dark me-2" htmlFor="is_active">
                    البنر نشط ويظهر في المتجر
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      {!editingSlider && <Plus size={16} />}
                      <span>{editingSlider ? "تحديث البنر الحالي" : "إضافة البنر الجديد"}</span>
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
