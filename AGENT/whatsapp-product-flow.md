# whatsapp-product-flow.md

# WhatsApp Product Ordering System (React + Supabase)

## Goal

Convert every product into a **WhatsApp order funnel**.

User selects:

* Product
* Color
* Size
* Quantity

Then clicks:

👉 “Order via WhatsApp”

And gets a pre-filled WhatsApp message with all details.

---

# 1. Where this feature lives (IMPORTANT)

This feature is NOT in one place.

It is split into:

```text id="wsp1"
services/whatsappService.js   → logic
hooks/useWhatsApp.js          → bridge
components/ProductCard.jsx    → UI
services/settingsService.js   → phone number
```

---

# 2. WhatsApp Service (CORE LOGIC)

📁 PUT THIS FILE HERE:

```text id="wsp2"
src/services/whatsappService.js
```

---

## Code

```javascript id="wsp3"
export function generateWhatsAppMessage(product, options = {}) {
  const {
    name,
    price,
    sale_price,
    discount_percent,
    fake_stock
  } = product;

  const finalPrice = sale_price || price;

  return `
🛍️ طلب جديد

📦 المنتج: ${name}
💰 السعر: ${finalPrice} EGP
🎯 الخصم: ${discount_percent || 0}%
🎨 اللون: ${options.color || "غير محدد"}
📏 المقاس: ${options.size || "غير محدد"}
🔢 الكمية: ${options.qty || 1}
📦 المتاح: ${fake_stock || "متوفر"}

📌 الرجاء تأكيد الطلب
  `.trim();
}
```

---

## WhatsApp Link Generator

```javascript id="wsp4"
export function generateWhatsAppLink(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

---

# 3. Hook Layer

📁 PUT HERE:

```text id="wsp5"
src/hooks/useWhatsApp.js
```

---

## Code

```javascript id="wsp6"
import { useSettings } from "./useSettings";
import {
  generateWhatsAppMessage,
  generateWhatsAppLink
} from "../services/whatsappService";

export function useWhatsApp() {
  const { data: settings } = useSettings();

  const sendToWhatsApp = (product, options) => {
    const message = generateWhatsAppMessage(product, options);
    const phone = settings?.whatsapp;

    return generateWhatsAppLink(phone, message);
  };

  return { sendToWhatsApp };
}
```

---

# 4. Product Card UI (ENTRY POINT)

📁 PUT HERE:

```text id="wsp7"
src/components/ProductCard.jsx
```

---

## Example

```jsx id="wsp8"
import { useState } from "react";
import { useWhatsApp } from "../hooks/useWhatsApp";

export default function ProductCard({ product }) {
  const { sendToWhatsApp } = useWhatsApp();

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);

  const handleOrder = () => {
    const url = sendToWhatsApp(product, {
      color,
      size,
      qty
    });

    window.open(url, "_blank");
  };

  return (
    <div className="card p-3 shadow-sm">

      <img
        src={product.thumbnail_url}
        alt={product.name}
        className="img-fluid rounded"
      />

      <h5 className="mt-2">{product.name}</h5>

      <p>
        {product.sale_price ? (
          <>
            <del>{product.price}</del>{" "}
            <b>{product.sale_price}</b>
          </>
        ) : (
          <b>{product.price}</b>
        )}
      </p>

      {/* Color */}
      <select
        className="form-select mb-2"
        onChange={(e) => setColor(e.target.value)}
      >
        <option value="">اختر اللون</option>
        {product.colors?.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Size */}
      <select
        className="form-select mb-2"
        onChange={(e) => setSize(e.target.value)}
      >
        <option value="">اختر المقاس</option>
        {product.sizes?.map((s) => (
          <option key={s.id} value={s.size_name}>
            {s.size_name}
          </option>
        ))}
      </select>

      {/* Quantity */}
      <input
        type="number"
        min="1"
        className="form-control mb-2"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />

      {/* Button */}
      <button
        className="btn btn-success w-100"
        onClick={handleOrder}
      >
        اطلب عبر واتساب
      </button>
    </div>
  );
}
```

---

# 5. Settings Dependency (IMPORTANT)

Make sure this exists:

```text id="wsp9"
settings.whatsapp
```

from Supabase:

```sql id="wsp10"
whatsapp text
```

Example:

```text id="wsp11"
201234567890
```

(no +, no spaces)

---

# 6. Where to plug it in the system

Use it ONLY here:

```text id="wsp12"
Products Page → ProductCard → WhatsApp Flow
```

NOT inside:

* services/productService ❌
* Supabase layer ❌
* hooks/products ❌

---

# 7. Optional Enhancements

You can later add:

* address field
* notes field
* auto stock limit
* discount display badge
* analytics tracking

---

# Final Result

User flow becomes:

```text id="wsp13"
Browse Product
   ↓
Select options
   ↓
Click WhatsApp
   ↓
Pre-filled message opens
   ↓
Order completed in chat
```

This turns your website into a **high-conversion WhatsApp sales machine**.
