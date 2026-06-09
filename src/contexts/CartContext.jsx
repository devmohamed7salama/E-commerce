import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("whatsapp_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState("cart"); // "cart" or "checkout"

  useEffect(() => {
    localStorage.setItem("whatsapp_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, options = {}) => {
    const { color = "", size = "", qty = 1 } = options;
    
    // Create unique ID based on product, color, and size selection
    const cartItemId = `${product.id}-${color}-${size}`;

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);

      if (existingItemIndex > -1) {
        // Increment quantity of existing match
        const newItems = [...prevItems];
        newItems[existingItemIndex].qty += Number(qty);
        return newItems;
      }

      // Add as new entry
      return [
        ...prevItems,
        {
          cartItemId,
          product,
          color,
          size,
          qty: Number(qty),
        },
      ];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, qty) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, qty: Number(qty) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.qty, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.product.sale_price || item.product.price;
      return acc + price * item.qty;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        isCartOpen,
        setIsCartOpen,
        cartStep,
        setCartStep,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
