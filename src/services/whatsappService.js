/**
 * Generate a pre-filled WhatsApp message for a single product order with customer details
 */
export function generateWhatsAppMessage(product, options = {}, customerDetails = {}) {
  const {
    name,
    price,
    sale_price
  } = product;

  const finalPrice = sale_price || price;
  const total = finalPrice * (options.qty || 1);

  let msg = `🛍️ طلب جديد من المتجر الإلكتروني\n\n`;

  // 1. Customer Details Section
  msg += `👤 بيانات طالب المنتج:\n`;
  msg += `- الاسم: ${customerDetails.name || "غير محدد"}\n`;
  msg += `- رقم الهاتف: ${customerDetails.phone || "غير محدد"}\n`;
  if (customerDetails.altPhone) {
    msg += `- رقم هاتف بديل: ${customerDetails.altPhone}\n`;
  }
  msg += `- العنوان بالتفصيل: ${customerDetails.address || "غير محدد"}\n`;
  if (customerDetails.landmark) {
    msg += `- علامة مميزة للعنوان: ${customerDetails.landmark}\n`;
  }
  if (customerDetails.notes) {
    msg += `- ملاحظات إضافية: ${customerDetails.notes}\n`;
  }
  msg += `\n-----------------------\n\n`;

  // 2. Product Details Section
  msg += `📦 تفاصيل المنتج المطلوب:\n`;
  msg += `- المنتج: ${name}\n`;
  if (options.color) msg += `- اللون: ${options.color}\n`;
  if (options.size) msg += `- المقاس: ${options.size}\n`;
  msg += `- الكمية: ${options.qty || 1}\n`;
  msg += `- السعر: ${finalPrice} ج.م\n`;
  msg += `\n💳 إجمالي الحساب: ${total} ج.م\n\n`;
  msg += `📌 الرجاء تأكيد الطلب وتأكيد التوصيل في أقرب وقت.`;

  return msg.trim();
}

/**
 * Generate a pre-filled WhatsApp message for the entire shopping cart list with customer details
 */
export function generateCartWhatsAppMessage(cartItems, customerDetails = {}) {
  if (!cartItems || cartItems.length === 0) return "";

  let msg = `🛍️ طلب جديد من المتجر الإلكتروني\n\n`;

  // 1. Customer Details Section
  msg += `👤 بيانات طالب المنتج:\n`;
  msg += `- الاسم: ${customerDetails.name || "غير محدد"}\n`;
  msg += `- رقم الهاتف: ${customerDetails.phone || "غير محدد"}\n`;
  if (customerDetails.altPhone) {
    msg += `- رقم هاتف بديل: ${customerDetails.altPhone}\n`;
  }
  msg += `- العنوان بالتفصيل: ${customerDetails.address || "غير محدد"}\n`;
  if (customerDetails.landmark) {
    msg += `- علامة مميزة للعنوان: ${customerDetails.landmark}\n`;
  }
  if (customerDetails.notes) {
    msg += `- ملاحظات إضافية: ${customerDetails.notes}\n`;
  }
  msg += `\n-----------------------\n\n`;

  // 2. Products Section
  msg += `📦 تفاصيل المنتجات المطلوب شراءها:\n\n`;
  cartItems.forEach((item, index) => {
    const finalPrice = item.product.sale_price || item.product.price;
    const subtotal = finalPrice * item.qty;

    msg += `${index + 1}. 📦 المنتج: ${item.product.name}\n`;
    if (item.color) msg += `   🎨 اللون: ${item.color}\n`;
    if (item.size) msg += `   📏 المقاس: ${item.size}\n`;
    msg += `   🔢 الكمية: ${item.qty}\n`;
    msg += `   💰 السعر: ${subtotal} ج.م\n\n`;
  });

  const total = cartItems.reduce((acc, item) => {
    const price = item.product.sale_price || item.product.price;
    return acc + price * item.qty;
  }, 0);

  msg += `💳 إجمالي الفاتورة النهائية: ${total} ج.م\n\n`;
  msg += `📌 الرجاء تأكيد الطلب وتأكيد التوصيل في أقرب وقت.`;
  return msg.trim();
}

/**
 * Generate the final link to open in WhatsApp
 */
export function generateWhatsAppLink(phone, message) {
  // Clean phone number from spaces or symbols
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
