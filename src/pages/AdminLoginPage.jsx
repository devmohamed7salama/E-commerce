import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { login, getUser, logout } from "../services/authService";

// Validation Schema using Zod
const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن لا تقل عن 6 أحرف"),
});

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading("جاري تسجيل الدخول...");
    try {
      // 1. Authenticate with Supabase Auth
      await login(data.email, data.password);

      // 2. Clear query cache for user checks and fetch the user profile
      queryClient.invalidateQueries({ queryKey: ["auth_user"] });
      const user = await queryClient.fetchQuery({
        queryKey: ["auth_user"],
        queryFn: getUser,
      });

      // 3. Verify Admin Role
      if (!user || user.role !== "admin") {
        await logout(); // log out non-admin
        queryClient.invalidateQueries({ queryKey: ["auth_user"] });
        toast.error("عذراً، هذا الحساب لا يملك صلاحية الدخول للوحة التحكم.", { id: toastId });
        return;
      }

      toast.success("مرحباً بك! تم تسجيل الدخول بنجاح.", { id: toastId });
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("خطأ: " + (error.message || "فشل تسجيل الدخول"), { id: toastId });
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light" style={{ direction: "rtl" }}>
      <div className="card shadow border-0 p-4 w-100" style={{ maxWidth: "420px", borderRadius: "16px" }}>
        <div className="text-center mb-4 text-primary">
          <Lock size={48} className="mb-2 mx-auto" />
          <h3 className="fw-bold text-dark mt-2">تسجيل دخول المدير</h3>
          <p className="text-muted small">أدخل بريدك الإلكتروني وكلمة المرور للوصول للوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email input */}
          <div className="mb-3">
            <label className="form-label fw-semibold small">البريد الإلكتروني</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="admin@example.com"
              {...register("email")}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label className="form-label fw-semibold small">كلمة المرور</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="******"
              {...register("password")}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fs-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/" className="text-decoration-none small text-muted">
            العودة للمتجر الرئيسي
          </Link>
        </div>
      </div>
    </div>
  );
}
