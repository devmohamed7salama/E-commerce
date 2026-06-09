import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCategories } from "../hooks/useCategories";
import { useProductById } from "../hooks/useProduct";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { uploadProductImage } from "../services/storageService";
import toast from "react-hot-toast";
import { ArrowRight, Trash2, Plus } from "lucide-react";

// Zod Validation Schema
const schema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  slug: z.string().min(2, "الرابط البديل (slug) يجب أن يكون حرفين على الأقل"),
  category_id: z.string().min(1, "يرجى اختيار القسم"),
  price: z.preprocess((val) => (val === "" || val === undefined ? 0 : Number(val)), z.number().min(0, "السعر يجب أن يكون 0 أو أكثر")),
  sale_price: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().min(0, "السعر المخفض يجب أن يكون 0 أو أكثر").nullable().optional()
  ),
  short_description: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  show_stock: z.boolean().default(false),
  fake_stock: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? 0 : Number(val)),
    z.number().int().min(0, "الكمية يجب أن تكون 0 أو أكثر")
  ),
  show_offer_timer: z.boolean().default(false),
  offer_end_date: z.string().optional().nullable(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
});



export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: categories = [] } = useCategories();
  const { data: product, isLoading: isProductLoading } = useProductById(id);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  // State for sizes, colors, thumbnail, and gallery images
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [galleryUrls, setGalleryUrls] = useState([]);
  
  // Form color input temp states
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  // Form size input temp state
  const [sizeInput, setSizeInput] = useState("");

  // Files uploading states
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      category_id: "",
      price: 0,
      sale_price: null,
      short_description: "",
      description: "",
      is_featured: false,
      is_active: true,
      show_stock: false,
      fake_stock: 0,
      show_offer_timer: false,
      offer_end_date: "",
      meta_title: "",
      meta_description: "",
    },
  });

  const productName = watch("name");

  // Auto-generate slug from name if not edit mode
  useEffect(() => {
    if (!isEdit && productName) {
      const generatedSlug = productName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "") // support Arabic characters
        .replace(/\s+/g, "-");
      setValue("slug", generatedSlug);
    }
  }, [productName, isEdit, setValue]);

  // Load product data when editing
  useEffect(() => {
    if (isEdit && product) {
      setValue("name", product.name || "");
      setValue("slug", product.slug || "");
      setValue("category_id", product.category_id || "");
      setValue("price", product.price || 0);
      setValue("sale_price", product.sale_price || null);
      setValue("short_description", product.short_description || "");
      setValue("description", product.description || "");
      setValue("is_featured", product.is_featured || false);
      setValue("is_active", product.is_active || false);
      setValue("show_stock", product.show_stock || false);
      setValue("fake_stock", product.fake_stock || 0);
      setValue("show_offer_timer", product.show_offer_timer || false);
      
      if (product.offer_end_date) {
        // Convert datetime to ISO format suitable for input datetime-local
        const date = new Date(product.offer_end_date);
        const isoString = date.toISOString().slice(0, 16);
        setValue("offer_end_date", isoString);
      } else {
        setValue("offer_end_date", "");
      }
      
      setValue("meta_title", product.meta_title || "");
      setValue("meta_description", product.meta_description || "");

      // Relations
      setThumbnailPreview(product.thumbnail_url || "");
      setColors(product.colors || []);
      setSizes(product.sizes || []);
      setGalleryUrls(product.images || []);
    }
  }, [product, isEdit, setValue]);

  const handleAddColor = () => {
    if (!colorName.trim()) {
      toast.error("يرجى كتابة اسم اللون");
      return;
    }
    // Check if color hex is already in the list
    if (colors.some((c) => c.hex_code.toLowerCase() === colorHex.toLowerCase())) {
      toast.error("كود هذا اللون موجود مسبقاً");
      return;
    }
    setColors([...colors, { name: colorName.trim(), hex_code: colorHex }]);
    setColorName("");
  };

  const handleRemoveColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleAddSize = () => {
    if (!sizeInput.trim()) {
      toast.error("يرجى كتابة اسم المقاس");
      return;
    }
    const val = sizeInput.trim();
    if (sizes.some((s) => (typeof s === "string" ? s : s.size_name).toLowerCase() === val.toLowerCase())) {
      toast.error("هذا المقاس موجود مسبقاً");
      return;
    }
    setSizes([...sizes, { size_name: val }]);
    setSizeInput("");
  };

  const handleRemoveSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setGalleryFiles([...galleryFiles, ...files]);
    }
  };

  const handleRemoveGalleryFile = (index) => {
    setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
  };

  const handleRemoveExistingGalleryUrl = (index) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      let finalThumbnailUrl = thumbnailPreview;

      // 1. Upload thumbnail image if selected
      if (thumbnailFile) {
        toast.loading("جاري رفع الصورة المصغرة...", { id: "upload-status" });
        finalThumbnailUrl = await uploadProductImage(thumbnailFile);
      } else if (!isEdit) {
        toast.error("يرجى اختيار صورة مصغرة للمنتج", { id: "upload-status" });
        setUploading(false);
        return;
      }

      // 2. Upload new gallery files
      const newUploadedGalleryUrls = [];
      if (galleryFiles.length > 0) {
        toast.loading(`جاري رفع صور المعرض (${galleryFiles.length})...`, { id: "upload-status" });
        for (const file of galleryFiles) {
          const url = await uploadProductImage(file);
          newUploadedGalleryUrls.push(url);
        }
      }

      toast.loading("جاري حفظ بيانات المنتج...", { id: "upload-status" });

      // Combine existing URLs and new uploaded URLs
      const allGalleryUrls = [
        ...galleryUrls.map((img) => img.image_url),
        ...newUploadedGalleryUrls,
      ];

      const productPayload = {
        ...data,
        thumbnail_url: finalThumbnailUrl,
        offer_end_date: data.show_offer_timer && data.offer_end_date ? data.offer_end_date : null,
      };

      const finalColors = colors.map(c => ({ name: c.name, hex_code: c.hex_code }));
      const finalSizes = sizes.map(s => typeof s === "string" ? s : s.size_name);

      if (isEdit) {
        await updateMutation.mutateAsync({
          id,
          product: productPayload,
          colors: finalColors,
          sizes: finalSizes,
          images: allGalleryUrls,
        });
        toast.success("تم تحديث المنتج بنجاح!", { id: "upload-status" });
      } else {
        await createMutation.mutateAsync({
          product: productPayload,
          colors: finalColors,
          sizes: finalSizes,
          images: allGalleryUrls,
        });
        toast.success("تم إضافة المنتج بنجاح!", { id: "upload-status" });
      }

      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("فشل في حفظ المنتج: " + error.message, { id: "upload-status" });
    } finally {
      setUploading(false);
    }
  };

  if (isEdit && isProductLoading) {
    return (
      <div className="text-center py-5" style={{ fontFamily: "Cairo, sans-serif" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
        <p className="text-muted mt-2">جاري تحميل بيانات المنتج...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ fontFamily: "Cairo, sans-serif" }}>
      {/* Breadcrumbs / Back */}
      <div className="mb-4">
          <Link to="/admin/products" className="text-decoration-none text-muted small d-flex align-items-center gap-1 mb-2 hover-primary">
            <ArrowRight size={16} />
            <span>العودة للمنتجات</span>
          </Link>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">{isEdit ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>
          <p className="text-muted mb-0">{isEdit ? "قم بتحديث تفاصيل المنتج وخياراته" : "املأ النموذج لإضافة منتج جديد للمتجر"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-4">
          {/* Main Form Fields */}
          <div className="col-12 col-lg-8">
            {/* Section 1: Basic Info */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-light">
                <h5 className="fw-bold text-dark mb-0 fs-6">معلومات المنتج الأساسية</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted fs-7">اسم المنتج *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      placeholder="مثال: ساعة يد ذكية"
                      {...register("name")}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted fs-7">الرابط البديل (slug) *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                      placeholder="مثال: smart-watch"
                      {...register("slug")}
                    />
                    {errors.slug && <div className="invalid-feedback">{errors.slug.message}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted fs-7">القسم *</label>
                    <select
                      className={`form-select ${errors.category_id ? "is-invalid" : ""}`}
                      {...register("category_id")}
                    >
                      <option value="">اختر القسم المناسب</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && <div className="invalid-feedback">{errors.category_id.message}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-muted fs-7">وصف قصير للمنتج</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      placeholder="وصف مختصر يظهر في قوائم المنتجات..."
                      {...register("short_description")}
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-muted fs-7">وصف المنتج التفصيلي</label>
                    <textarea
                      rows="5"
                      className="form-control"
                      placeholder="تفاصيل ومميزات ومواصفات المنتج بالكامل..."
                      {...register("description")}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing and Inventory */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-light">
                <h5 className="fw-bold text-dark mb-0 fs-6">التسعير والمخزون</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted fs-7">السعر الافتراضي (ج.م) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className={`form-control ${errors.price ? "is-invalid" : ""}`}
                      placeholder="0.00"
                      {...register("price")}
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted fs-7">السعر المخفض (ج.م)</label>
                    <input
                      type="number"
                      step="0.01"
                      className={`form-control ${errors.sale_price ? "is-invalid" : ""}`}
                      placeholder="اتركه فارغاً في حال لا يوجد عرض"
                      {...register("sale_price")}
                    />
                    {errors.sale_price && <div className="invalid-feedback">{errors.sale_price.message}</div>}
                  </div>

                  <div className="col-12 col-md-6 d-flex align-items-center">
                    <div className="form-check form-switch mt-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="show_stock"
                        {...register("show_stock")}
                      />
                      <label className="form-check-label fw-semibold text-dark me-2" htmlFor="show_stock">
                        إظهار حالة المخزون للمشترين
                      </label>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted fs-7">المخزون الوهمي (الكمية المتاحة للعرض)</label>
                    <input
                      type="number"
                      className={`form-control ${errors.fake_stock ? "is-invalid" : ""}`}
                      placeholder="مثال: 10"
                      {...register("fake_stock")}
                    />
                    {errors.fake_stock && <div className="invalid-feedback">{errors.fake_stock.message}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Options and Variants (Colors, Sizes) */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-light">
                <h5 className="fw-bold text-dark mb-0 fs-6">خيارات وألوان ومقاسات المنتج</h5>
              </div>
              <div className="card-body">
                {/* Colors Manager */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark fs-7 mb-2">إدارة الألوان</label>
                  <div className="row g-2 mb-3">
                    <div className="col-6 col-sm-5">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="اسم اللون (أحمر، أسود)"
                        value={colorName}
                        onChange={(e) => setColorName(e.target.value)}
                      />
                    </div>
                    <div className="col-4 col-sm-5 d-flex gap-2">
                      <input
                        type="color"
                        className="form-control form-control-color border-0 w-25"
                        style={{ height: "38px", cursor: "pointer" }}
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control w-75"
                        placeholder="#ffffff"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                      />
                    </div>
                    <div className="col-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center"
                        style={{ height: "38px" }}
                        onClick={handleAddColor}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Colors List */}
                  <div className="d-flex flex-wrap gap-2">
                    {colors.length === 0 ? (
                      <span className="text-muted fs-7">لا توجد ألوان محددة لهذا المنتج</span>
                    ) : (
                      colors.map((c, index) => (
                        <span
                          key={index}
                          className="badge bg-light text-dark border d-inline-flex align-items-center gap-2 px-2 py-1.5 fs-7"
                        >
                          <span
                            className="rounded-circle d-inline-block border"
                            style={{ width: "12px", height: "12px", backgroundColor: c.hex_code }}
                          ></span>
                          <span>{c.name} ({c.hex_code})</span>
                          <button
                            type="button"
                            className="btn btn-link text-danger p-0 border-0 m-0 d-inline-flex"
                            onClick={() => handleRemoveColor(index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <hr className="my-4 border-light" />

                {/* Sizes Manager */}
                <div>
                  <label className="form-label fw-semibold text-dark fs-7 mb-2">إدارة المقاسات</label>
                  <div className="row g-2 mb-3">
                    <div className="col-10">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="اسم المقاس (XL, Large, 42)"
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                      />
                    </div>
                    <div className="col-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center"
                        style={{ height: "38px" }}
                        onClick={handleAddSize}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Sizes List */}
                  <div className="d-flex flex-wrap gap-2">
                    {sizes.length === 0 ? (
                      <span className="text-muted fs-7">لا توجد مقاسات محددة لهذا المنتج</span>
                    ) : (
                      sizes.map((s, index) => {
                        const name = typeof s === "string" ? s : s.size_name;
                        return (
                          <span
                            key={index}
                            className="badge bg-light text-dark border d-inline-flex align-items-center gap-2 px-3 py-1.5 fs-7"
                          >
                            <span>{name}</span>
                            <button
                              type="button"
                              className="btn btn-link text-danger p-0 border-0 m-0 d-inline-flex"
                              onClick={() => handleRemoveSize(index)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Visuals & SEO Settings) */}
          <div className="col-12 col-lg-4">
            {/* Visuals: Thumbnail & Gallery */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-light">
                <h5 className="fw-bold text-dark mb-0 fs-6">صور المنتج</h5>
              </div>
              <div className="card-body">
                {/* Thumbnail Image */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted fs-7">الصورة المصغرة للمنتج *</label>
                  {thumbnailPreview && (
                    <div className="mb-3 text-center position-relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="img-thumbnail rounded object-fit-cover shadow-sm w-100"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                  <small className="text-muted mt-1 d-block fs-8">يفضل صورة مربعة (800x800) بحد أقصى 2 ميجابايت</small>
                </div>

                <hr className="my-3 border-light" />

                {/* Gallery Images */}
                <div>
                  <label className="form-label fw-semibold text-muted fs-7">معرض صور المنتج (اختياري)</label>
                  <input
                    type="file"
                    className="form-control mb-3"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                  />

                  {/* Existing URLs in DB (if editing) */}
                  {galleryUrls.length > 0 && (
                    <div className="mb-3">
                      <h6 className="fw-bold text-muted fs-8 mb-2">الصور الحالية:</h6>
                      <div className="row g-2">
                        {galleryUrls.map((img, index) => (
                          <div key={index} className="col-4 position-relative">
                            <img
                              src={img.image_url}
                              alt="Gallery existing"
                              className="img-thumbnail object-fit-cover w-100"
                              style={{ height: "60px" }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-xs p-1 position-absolute top-0 end-0 rounded-circle m-1"
                              onClick={() => handleRemoveExistingGalleryUrl(index)}
                              style={{ width: "20px", height: "20px", fontSize: "10px", lineHeight: "1" }}
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New files to upload */}
                  {galleryFiles.length > 0 && (
                    <div>
                      <h6 className="fw-bold text-muted fs-8 mb-2">صور جديدة بانتظار الرفع:</h6>
                      <div className="row g-2">
                        {galleryFiles.map((file, index) => (
                          <div key={index} className="col-4 position-relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Gallery preview new"
                              className="img-thumbnail object-fit-cover w-100"
                              style={{ height: "60px" }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-xs p-1 position-absolute top-0 end-0 rounded-circle m-1"
                              onClick={() => handleRemoveGalleryFile(index)}
                              style={{ width: "20px", height: "20px", fontSize: "10px", lineHeight: "1" }}
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Publishing Settings & SEO */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-light">
                <h5 className="fw-bold text-dark mb-0 fs-6">النشر والترويج</h5>
              </div>
              <div className="card-body">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="is_active"
                    {...register("is_active")}
                  />
                  <label className="form-check-label fw-semibold text-dark me-2" htmlFor="is_active">
                    المنتج نشط ويظهر في المتجر
                  </label>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="is_featured"
                    {...register("is_featured")}
                  />
                  <label className="form-check-label fw-semibold text-dark me-2" htmlFor="is_featured">
                    تثبيت المنتج في الرئيسية (مميز)
                  </label>
                </div>

                <hr className="my-3 border-light" />

                {/* Offer Timer Settings */}
                <div className="mb-3">
                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="show_offer_timer"
                      {...register("show_offer_timer")}
                    />
                    <label className="form-check-label fw-semibold text-dark me-2" htmlFor="show_offer_timer">
                      تفعيل مؤقت لعد العرض التنازلي
                    </label>
                  </div>
                  {watch("show_offer_timer") && (
                    <div>
                      <label className="form-label fw-semibold text-muted fs-7">تاريخ انتهاء العرض والخصم</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        {...register("offer_end_date")}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-light">
                <h5 className="fw-bold text-dark mb-0 fs-6">الإعدادات لمحركات البحث (SEO)</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-muted fs-7">عنوان Meta للمنتج (اختياري)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="عنوان مخصص يظهر في محركات البحث"
                    {...register("meta_title")}
                  />
                </div>
                <div>
                  <label className="form-label fw-semibold text-muted fs-7">وصف Meta للمنتج (اختياري)</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="وصف مخصص يظهر في محركات البحث"
                    {...register("meta_description")}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Form actions (sticky on desktop) */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 mb-2"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm flex-shrink-0" role="status" aria-hidden="true"></span>
                      <span>جاري الحفظ والرفع...</span>
                    </>
                  ) : (
                    <span>حفظ التعديلات والمنتج</span>
                  )}
                </button>
                <Link to="/admin/products" className="btn btn-outline-secondary w-100 py-2.5 fw-semibold">
                  إلغاء الأمر
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
