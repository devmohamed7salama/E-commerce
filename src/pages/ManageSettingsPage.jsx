import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSettings } from "../hooks/useSettings";
import { useUpdateSettings } from "../hooks/useUpdateSettings";
import { uploadLogoImage, uploadHeroImage } from "../services/storageService";
import toast from "react-hot-toast";
import { Trash2, RotateCcw } from "lucide-react";

// Zod Validation Schema
const schema = z.object({
  site_name: z.string().min(2, "اسم المتجر يجب أن يكون حرفين على الأقل"),
  site_description: z.string().optional().nullable(),
  use_logo: z.boolean().default(false),
  owner_name: z.string().optional().nullable(),
  whatsapp: z
    .string()
    .min(5, "يرجى إدخال رقم واتساب صحيح")
    .regex(
      /^[0-9]+$/,
      "يرجى إدخال أرقام فقط (مثال: 201012345678) بدون رمز + أو أصفار إضافية في البداية",
    ),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  // Display toggles
  show_slider: z.boolean().default(true),
  show_hero: z.boolean().default(true),
  // Hero settings
  hero_title: z.string().optional().nullable(),
  hero_subtitle: z.string().optional().nullable(),
  hero_button_text: z.string().optional().nullable(),
  hero_button_link: z.string().optional().nullable(),
});

export default function ManageSettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  // Logo upload state
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  // Hero image upload state
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      site_name: "",
      site_description: "",
      use_logo: false,
      owner_name: "",
      whatsapp: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      show_slider: true,
      show_hero: true,
      hero_title: "",
      hero_subtitle: "",
      hero_button_text: "",
      hero_button_link: "",
    },
  });

  // Load database settings values when page loads
  useEffect(() => {
    if (settings) {
      setValue("site_name", settings.site_name || "");
      setValue("site_description", settings.site_description || "");
      setValue("use_logo", settings.use_logo || false);
      setValue("owner_name", settings.owner_name || "");
      setValue("whatsapp", settings.whatsapp || "");
      setValue("facebook", settings.facebook || "");
      setValue("instagram", settings.instagram || "");
      setValue("tiktok", settings.tiktok || "");
      setValue("show_slider", settings.show_slider !== false);
      setValue("show_hero", settings.show_hero !== false);
      setValue("hero_title", settings.hero_title || "");
      setValue("hero_subtitle", settings.hero_subtitle || "");
      // setValue("hero_button_text", settings.hero_button_text || "");
      // setValue("hero_button_link", settings.hero_button_link || "");
      setLogoPreview(settings.logo_url || "");
      setHeroPreview(settings.hero_image_url || "");
    }
  }, [settings, setValue]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleHeroChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroFile(file);
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      let finalLogoUrl = logoPreview;
      let finalHeroUrl = heroPreview;

      // Upload logo image if a new one is selected
      if (logoFile) {
        toast.loading("جاري رفع شعار المتجر...", { id: "settings-upload" });
        finalLogoUrl = await uploadLogoImage(logoFile);
      }

      // Upload hero image if a new one is selected
      if (heroFile) {
        toast.loading("جاري رفع صورة الهيرو...", { id: "settings-upload" });
        finalHeroUrl = await uploadHeroImage(heroFile);
      }

      toast.loading("جاري حفظ الإعدادات...", { id: "settings-upload" });

      const settingsPayload = {
        ...data,
        logo_url: finalLogoUrl || null,
        hero_image_url: finalHeroUrl || null,
      };

      await updateMutation.mutateAsync(settingsPayload);
      toast.success("تم تحديث إعدادات المتجر بنجاح!", {
        id: "settings-upload",
      });
    } catch (error) {
      console.error(error);
      toast.error("فشل حفظ الإعدادات: " + error.message, {
        id: "settings-upload",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="text-center py-5"
        style={{ fontFamily: "Cairo, sans-serif" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
        <p className="text-muted mt-2">جاري تحميل إعدادات المتجر...</p>
      </div>
    );
  }

  const resetHeroDefaults = () => {
    setValue("hero_title", "");
    setValue("hero_subtitle", "");
    setValue("hero_button_text", "");
    setValue("hero_button_link", "");
    setHeroFile(null);
    setHeroPreview("");
  };

  const deleteHeroImageDirect = async () => {
    setHeroFile(null);
    setHeroPreview("");
    try {
      toast.loading("جاري حذف صورة الهيرو...", { id: "hero-delete" });
      await updateMutation.mutateAsync({ hero_image_url: null });
      toast.success("تم حذف صورة الهيرو!", { id: "hero-delete" });
    } catch (error) {
      toast.error("فشل حذف الصورة: " + error.message, { id: "hero-delete" });
    }
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ fontFamily: "Cairo, sans-serif" }}
    >
      <style>{`
        .switch-card .form-switch {
          padding-left: 3.5em;
        }
        .switch-card .form-check-input {
          width: 3em !important;
          height: 1.5em !important;
          margin-left: -3.5em !important;
          margin-top: 0 !important;
          background-size: 1.5em 1.5em !important;
          flex-shrink: 0;
        }

      `}</style>
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">إعدادات المتجر</h2>
        <p className="text-muted mb-0">
          تخصيص معلومات المتجر، قنوات التواصل، والشعار الرئيسي
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-4">
          {/* Main Settings Form */}
          <div className="col-12 col-lg-8">
            {/* Basic Config Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-light">
                <h5 className="fw-bold text-dark mb-0 fs-6">
                  المعلومات الأساسية للمتجر
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted fs-7">
                      اسم المتجر *
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.site_name ? "is-invalid" : ""}`}
                      placeholder="مثال: متجر الإلكترونيات الرقمي"
                      {...register("site_name")}
                    />
                    {errors.site_name && (
                      <div className="invalid-feedback">
                        {errors.site_name.message}
                      </div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted fs-7">
                      اسم مالك المتجر (المالك)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="مثال: محمد سلام"
                      {...register("owner_name")}
                    />
                    <small className="text-muted mt-1 d-block fs-8">
                      يظهر اسم المالك في أسفل المتجر (الفوتر)
                    </small>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-muted fs-7">
                      وصف المتجر (SEO)
                    </label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="وصف مختصر للمتجر يظهر بمحركات البحث ومشاركات الروابط..."
                      {...register("site_description")}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Contacts & Socials Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-light">
                <h5 className="fw-bold text-dark mb-0 fs-6">
                  قنوات التواصل والشبكات الاجتماعية
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted fs-7">
                      رقم الواتساب الرئيسي للمبيعات *
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.whatsapp ? "is-invalid" : ""}`}
                      placeholder="مثال: 201012345678"
                      {...register("whatsapp")}
                    />
                    {errors.whatsapp && (
                      <div className="invalid-feedback">
                        {errors.whatsapp.message}
                      </div>
                    )}
                    <small className="text-muted mt-1 d-block fs-8">
                      أدخل الرقم بالصيغة الدولية بدون (+) أو أصفار (00). مثال:
                      لمصر ابدأ بـ 20.
                    </small>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted fs-7">
                      رابط صفحة فيسبوك (اختياري)
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://facebook.com/yourpage"
                      {...register("facebook")}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted fs-7">
                      رابط حساب انستغرام (اختياري)
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://instagram.com/yourprofile"
                      {...register("instagram")}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted fs-7">
                      رابط حساب تيك توك (اختياري)
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://tiktok.com/@yourprofile"
                      {...register("tiktok")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Display Controls Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-light">
                <h5 className="fw-bold text-dark mb-0 fs-6">
                  التحكم بعرض الصفحة الرئيسية
                </h5>
              </div>
              <div className="card-body">
                <p className="text-muted small mb-3">
                  اختر العناصر التي تريد إظهارها في الصفحة الرئيسية. يمكنك تفعيل
                  الاثنين معاً أو أحدهما فقط.
                </p>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border switch-card">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="show_slider"
                          checked={watch("show_slider")}
                          onChange={(e) =>
                            setValue("show_slider", e.target.checked)
                          }
                        />
                      </div>
                      <div>
                        <label
                          className="fw-bold text-dark d-block"
                          htmlFor="show_slider"
                        >
                          سلايدر الصور
                        </label>
                        <small className="text-muted">
                          عرض سلايدر الصور المتحركة في أعلى الرئيسية
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border switch-card">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="show_hero"
                          checked={watch("show_hero")}
                          onChange={(e) =>
                            setValue("show_hero", e.target.checked)
                          }
                        />
                      </div>
                      <div>
                        <label
                          className="fw-bold text-dark d-block"
                          htmlFor="show_hero"
                        >
                          بانر الترحيب (Hero)
                        </label>
                        <small className="text-muted">
                          عرض قسم الترحيب مع صورة وعنوان وزر
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Banner Settings Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-light d-flex align-items-center justify-content-between">
                <h5 className="fw-bold text-dark mb-0 fs-6">
                  إعدادات بانر الترحيب (Hero Banner)
                </h5>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={resetHeroDefaults}
                >
                  <RotateCcw size={14} className="me-1" />
                  إعادة تعيين
                </button>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold text-muted fs-7">
                      العنوان الترحيبي الرئيسي
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="مثال: اكتشف أحدث الموديلات"
                        {...register("hero_title")}
                      />
                      <button
                        type="button"
                        className="btn btn-danger rounded me-3"
                        onClick={() => setValue("hero_title", "")}
                        title="حذف النص"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-muted fs-7">
                      الوصف الفرعي
                    </label>
                    <div className="input-group">
                      <textarea
                        rows="2"
                        className="form-control"
                        placeholder="مثال: تصفح تشكيلتنا الواسعة من المنتجات المميزة بأسعار منافسة..."
                        {...register("hero_subtitle")}
                      ></textarea>
                      <button
                        type="button"
                        className="btn btn-danger rounded me-3"
                        onClick={() => setValue("hero_subtitle", "")}
                        title="حذف النص"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-muted fs-7">
                      صورة الهيرو (اختياري)
                    </label>
                    {heroPreview && (
                      <div className="mb-2 p-2 bg-light rounded border d-inline-block position-relative">
                        <img
                          src={heroPreview}
                          alt="Hero Preview"
                          className="img-fluid rounded"
                          style={{ maxHeight: "150px" }}
                        />
                     
                      </div>
                    )}
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleHeroChange}
                      />
                      <button
                        type="button"
                        className="btn btn-danger rounded me-3"
                        onClick={deleteHeroImageDirect}
                        title="حذف الصورة"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <small className="text-muted mt-1 d-block fs-8">
                      إذا لم يتم رفع صورة، سيتم استخدام الصورة الافتراضية.
                    </small>
                  </div>
                  <div className="card-body ">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span>جاري حفظ الإعدادات...</span>
                        </>
                      ) : (
                        <span>حفظ جميع التعديلات</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Logo Upload & Actions) */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-light">
                <h5 className="fw-bold text-dark mb-0 fs-6">
                  شعار المتجر (Logo)
                </h5>
              </div>
              <div className="card-body text-center">
                {logoPreview ? (
                  <div
                    className="mb-3 p-3 bg-light rounded d-inline-block border"
                    style={{ minWidth: "150px" }}
                  >
                    <img
                      src={logoPreview}
                      alt="Store Logo"
                      className="img-fluid object-fit-contain"
                      style={{ maxHeight: "100px" }}
                    />
                  </div>
                ) : (
                  <div className="mb-3 p-4 bg-light rounded d-flex align-items-center justify-content-center border border-dashed text-muted fs-7">
                    لا يوجد شعار للمتجر حالياً
                  </div>
                )}
                <input
                  type="file"
                  className="form-control mb-3"
                  accept="image/*"
                  onChange={handleLogoChange}
                />

                <div className="bg-light border rounded-3 p-3 text-start mb-3">
                  <label className="form-label fw-bold text-dark fs-7 mb-2 d-block">
                    الهوية المعروضة في المتجر
                  </label>
                  <div className="d-flex flex-column gap-2">
                    <div className="form-check form-check-inline m-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="use_logo_radio"
                        id="display_name"
                        checked={watch("use_logo") === false}
                        onChange={() => setValue("use_logo", false)}
                      />
                      <label
                        className="form-check-label fw-semibold text-dark fs-7 me-2"
                        htmlFor="display_name"
                      >
                        اسم المتجر (نص)
                      </label>
                    </div>
                    <div className="form-check form-check-inline m-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="use_logo_radio"
                        id="display_logo"
                        checked={watch("use_logo") === true}
                        onChange={() => setValue("use_logo", true)}
                      />
                      <label
                        className="form-check-label fw-semibold text-dark fs-7 me-2"
                        htmlFor="display_logo"
                      >
                        شعار المتجر (صورة)
                      </label>
                    </div>
                  </div>
                </div>

                <small className="text-muted d-block fs-8">
                  يفضل شعار بخلفية شفافة (PNG) بحجم مناسب
                </small>
              </div>
            </div>

            <div
              className="card border-0 shadow-sm"
              style={{
                position: "sticky",
                bottom: "20px",
                zIndex: 1000,
              }}
            >
              <div className="card-body ">
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span>جاري حفظ الإعدادات...</span>
                    </>
                  ) : (
                    <span>حفظ جميع التعديلات</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
