import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useWhatsApp } from "../hooks/useWhatsApp";
import { MessageCircle } from "lucide-react";

export default function CartSidebar() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    cartStep,
    setCartStep
  } = useCart();

  const { sendCartToWhatsApp } = useWhatsApp();

  // Checkout Form States
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAltPhone, setCustomerAltPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerLandmark, setCustomerLandmark] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [validationError, setValidationError] = useState("");

  if (!isCartOpen) return null;

  const handleOrderSubmit = (e) => {
    if (e) e.preventDefault();

    // Form validation
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setValidationError("الرجاء ملء جميع الحقول المطلوبة (*)");
      return;
    }

    setValidationError("");

    const customerDetails = {
      name: customerName,
      phone: customerPhone,
      altPhone: customerAltPhone,
      address: customerAddress,
      landmark: customerLandmark,
      notes: customerNotes,
    };

    const url = sendCartToWhatsApp(cartItems, customerDetails);
    window.open(url, "_blank");

    // Cleanup & Close
    clearCart();
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAltPhone("");
    setCustomerAddress("");
    setCustomerLandmark("");
    setCustomerNotes("");
    setCartStep("cart");
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 1040 }}
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
        style={{
          width: "100%",
          maxWidth: "420px",
          zIndex: 1050,
          transition: "transform 0.3s ease",
          direction: "rtl", // Arabic layout
        }}
      >
        {/* Header */}
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-bold">
            {cartStep === "checkout" ? "بيانات الشحن والتوصيل" : "سلة الطلبات"}
          </h5>
          <button
            onClick={() => {
              if (cartStep === "checkout") {
                setCartStep("cart");
              } else {
                setIsCartOpen(false);
              }
            }}
            className="btn btn-sm btn-outline-secondary py-1 px-2.5 fs-8 fw-semibold"
          >
            {cartStep === "checkout" ? "رجوع للسلة" : "إغلاق"}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow-1 overflow-auto p-3">
          {cartStep === "cart" ? (
            /* CART VIEW */
            cartItems.length === 0 ? (
              <div className="text-center py-5">
                <div className="fs-1 mb-3 text-muted">🛍️</div>
                <p className="text-muted">السلة فارغة حالياً</p>
                <button onClick={() => setIsCartOpen(false)} className="btn btn-primary btn-sm mt-2">
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {cartItems.map((item) => {
                  const finalPrice = item.product.sale_price || item.product.price;
                  return (
                    <div
                      key={item.cartItemId}
                      className="d-flex gap-3 p-2 border rounded-3 align-items-center"
                    >
                      {/* Image */}
                      <img
                        src={item.product.thumbnail_url}
                        alt={item.product.name}
                        style={{ width: "64px", height: "64px", objectFit: "cover" }}
                        className="rounded-2"
                      />

                      {/* Details */}
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold small">{item.product.name}</h6>
                        <div className="text-muted xsmall d-flex flex-wrap gap-2 mb-2">
                          {item.color && <span>اللون: {item.color}</span>}
                          {item.size && <span>المقاس: {item.size}</span>}
                        </div>

                        {/* Quantity manager */}
                        <div className="d-flex align-items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.qty - 1)}
                            className="btn btn-sm btn-light border py-0 px-2"
                          >
                            -
                          </button>
                          <span className="small fw-semibold">{item.qty}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.qty + 1)}
                            className="btn btn-sm btn-light border py-0 px-2"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price & Delete */}
                      <div className="text-end">
                        <div className="fw-bold text-primary small">
                          {finalPrice * item.qty} ج.م
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="btn btn-link text-danger p-0 mt-1 xsmall text-decoration-none"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* CHECKOUT FORM VIEW */
            <form onSubmit={handleOrderSubmit} className="d-flex flex-column gap-3 py-2">
              {validationError && (
                <div className="alert alert-danger py-2 px-3 small rounded-3 mb-0">
                  {validationError}
                </div>
              )}
              
              <div>
                <label className="form-label fw-semibold text-muted fs-7 mb-1">اسم المستلم *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="الاسم بالكامل لتسليم الأوردر"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label fw-semibold text-muted fs-7 mb-1">رقم الهاتف للتواصل *</label>
                <input
                  type="tel"
                  required
                  className="form-control text-start"
                  placeholder="مثال: 01012345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label fw-semibold text-muted fs-7 mb-1">رقم هاتف بديل (اختياري)</label>
                <input
                  type="tel"
                  className="form-control text-start"
                  placeholder="رقم آخر في حالة عدم الرد"
                  value={customerAltPhone}
                  onChange={(e) => setCustomerAltPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label fw-semibold text-muted fs-7 mb-1">العنوان بالتفصيل *</label>
                <textarea
                  rows="3"
                  required
                  className="form-control"
                  placeholder="المحافظة، المدينة، اسم الشارع، رقم البيت والشقة..."
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="form-label fw-semibold text-muted fs-7 mb-1">علامة مميزة للعنوان (اختياري)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="مثال: بجوار مسجد النور / خلف السوبرماركت"
                  value={customerLandmark}
                  onChange={(e) => setCustomerLandmark(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label fw-semibold text-muted fs-7 mb-1">ملاحظات إضافية (اختياري)</label>
                <textarea
                  rows="2"
                  className="form-control"
                  placeholder="أي ملاحظات خاصة بالتوصيل أو مقاسات خاصة..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                ></textarea>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-3 border-top bg-light mt-auto">
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold">إجمالي الحساب:</span>
              <span className="fw-bold text-primary fs-5">{getCartTotal()} ج.م</span>
            </div>

            {cartStep === "cart" ? (
              <button
                onClick={() => setCartStep("checkout")}
                className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 fs-5 shadow-sm"
              >
                <span>تأكيد الطلب وإدخال البيانات</span>
              </button>
            ) : (
              <button
                onClick={handleOrderSubmit}
                className="btn btn-whatsapp w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 fs-5 shadow-sm"
              >
                <span>إرسال الطلب وإتمام المعاملة</span>
                <MessageCircle size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
