import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCart } from "../contexts/CartContext";
import { useWhatsApp } from "../hooks/useWhatsApp";
import { toast } from "react-hot-toast";
import { MessageCircle, ArrowRight, Trash2, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { sendCartToWhatsApp } = useWhatsApp();

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAltPhone, setCustomerAltPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerLandmark, setCustomerLandmark] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ direction: "rtl", minHeight: "60vh", fontFamily: "Cairo, sans-serif" }}>
        <div className="py-5">
          <div className="mb-4 text-muted">
            <ShoppingBag size={64} strokeWidth={1.5} />
          </div>
          <h4 className="fw-bold mb-2">سلة المشتريات فارغة</h4>
          <p className="text-muted mb-4">أضف بعض المنتجات الرائعة إلى سلتك أولاً لتتمكن من إتمام الطلب.</p>
          <Link to="/products" className="btn btn-primary px-4 py-2 fw-semibold">
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }

  const totalBill = getCartTotal();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      toast.error("يرجى إدخال جميع الحقول المطلوبة (*)");
      return;
    }

    setSubmitting(true);

    const customerDetails = {
      name: customerName,
      phone: customerPhone,
      altPhone: customerAltPhone,
      address: customerAddress,
      landmark: customerLandmark,
      notes: customerNotes,
    };

    const url = sendCartToWhatsApp(cartItems, customerDetails);
    
    // Redirect to WhatsApp
    window.open(url, "_blank");
    toast.success("جاري تحويلك إلى واتساب لإتمام الطلب...");
    clearCart();
    setSubmitting(false);
  };

  return (
    <div className="container py-5" style={{ direction: "rtl", fontFamily: "Cairo, sans-serif" }}>
      <Helmet>
        <title>إتمام الطلب - سلة المشتريات</title>
      </Helmet>

      {/* Page Header */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold text-dark mb-1">سلة الطلبات وإتمام الشراء</h2>
          <p className="text-muted mb-0">يرجى مراجعة منتجاتك وملء تفاصيل الشحن لإرسال الطلب عبر واتساب</p>
        </div>
        <Link to="/products" className="btn btn-outline-secondary d-flex align-items-center gap-2">
          <ArrowRight size={16} />
          <span>متابعة التسوق</span>
        </Link>
      </div>

      <div className="row g-4">
        {/* Cart Items List Column (Right Column in RTL, wide) */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white py-3 border-light rounded-top-4">
              <h5 className="fw-bold text-dark mb-0 fs-6">المنتجات المختارة ({cartItems.length})</h5>
            </div>
            <div className="card-body p-0">
              <div className="overflow-auto" style={{ maxHeight: "450px" }}>
                {cartItems.map((item) => {
                  const finalPrice = item.product.sale_price || item.product.price;
                  return (
                    <div key={item.cartItemId} className="p-3 border-bottom d-flex gap-3 align-items-center">
                      <div className="position-relative" style={{ flexShrink: 0 }}>
                        <img
                          src={item.product.thumbnail_url}
                          alt={item.product.name}
                          className="rounded-3 border object-fit-cover"
                          style={{ width: "70px", height: "70px" }}
                        />
                        <button
                          type="button"
                          className="position-absolute top-0 start-0 translate-middle btn btn-danger rounded-circle p-0 d-flex align-items-center justify-content-center border border-2 border-white shadow-sm"
                          style={{ width: "20px", height: "20px" }}
                          onClick={() => removeFromCart(item.cartItemId)}
                          title="حذف المنتج"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                          <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: "14px" }}>
                            {item.product.name}
                          </h6>
                          <span className="fw-bold text-primary text-nowrap" style={{ fontSize: "14px" }}>
                            {finalPrice * item.qty} ج.م
                          </span>
                        </div>
                        
                        <div className="d-flex flex-wrap gap-1 mb-2" style={{ fontSize: "11px" }}>
                          {item.color && (
                            <span className="badge bg-light text-secondary border">
                              اللون: {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="badge bg-light text-secondary border">
                              المقاس: {item.size}
                            </span>
                          )}
                          <span className="badge bg-light text-secondary border">
                            السعر الفردي: {finalPrice} ج.م
                          </span>
                        </div>
                        
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center border rounded-3 bg-white" style={{ height: "28px" }}>
                            <button
                              type="button"
                              className="btn btn-sm border-0 px-2 py-0 text-muted"
                              onClick={() => updateQuantity(item.cartItemId, item.qty - 1)}
                              style={{ fontSize: "14px", lineHeight: 1 }}
                            >
                              -
                            </button>
                            <span className="px-2 fw-semibold text-dark fs-7" style={{ minWidth: "20px", textAlign: "center" }}>
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm border-0 px-2 py-0 text-muted"
                              onClick={() => updateQuantity(item.cartItemId, item.qty + 1)}
                              style={{ fontSize: "14px", lineHeight: 1 }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-4 bg-light rounded-bottom-4">
                <div className="d-flex justify-content-between fw-bold text-dark fs-5 mb-0">
                  <span>إجمالي الحساب:</span>
                  <span className="text-primary">{totalBill} ج.م</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Form Column (Left Column in RTL, narrow) */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 position-sticky" style={{ top: "24px" }}>
            <div className="card-header bg-white py-3 border-light rounded-top-4">
              <h5 className="fw-bold text-dark mb-0 fs-6">بيانات الشحن والتوصيل</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold text-muted fs-7">الاسم بالكامل *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="اسم مستلم الطلب بالكامل"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-muted fs-7">رقم الهاتف للتواصل *</label>
                  <input
                    type="tel"
                    required
                    className="form-control text-start"
                    placeholder="مثال: 01012345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-muted fs-7">رقم هاتف بديل (اختياري)</label>
                  <input
                    type="tel"
                    className="form-control text-start"
                    placeholder="رقم هاتف إضافي للطوارئ"
                    value={customerAltPhone}
                    onChange={(e) => setCustomerAltPhone(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-muted fs-7">العلامة المميزة للعنوان (اختياري)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="مثال: بجوار مسجد النور / خلف السوبرماركت"
                    value={customerLandmark}
                    onChange={(e) => setCustomerLandmark(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-muted fs-7">العنوان بالتفصيل *</label>
                  <textarea
                    rows="3"
                    required
                    className="form-control"
                    placeholder="المحافظة، المدينة، الحي، اسم الشارع، رقم العمارة والشقة..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-muted fs-7">ملاحظات إضافية (اختياري)</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder="أي تعليمات للمندوب أو مقاسات وتفاصيل إضافية..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-whatsapp w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 fs-5 shadow-sm"
                    disabled={submitting}
                  >
                    <span>تأكيد وإرسال الطلب عبر واتساب</span>
                    <MessageCircle size={22} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
