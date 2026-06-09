import { useSettings } from "./useSettings";
import {
  generateWhatsAppMessage,
  generateCartWhatsAppMessage,
  generateWhatsAppLink
} from "../services/whatsappService";

export function useWhatsApp() {
  const { data: settings } = useSettings();

  const getAdminPhone = () => settings?.whatsapp || "201234567890";

  /**
   * Generate WhatsApp link for a single product order
   */
  const sendToWhatsApp = (product, options, customerDetails) => {
    const message = generateWhatsAppMessage(product, options, customerDetails);
    const phone = getAdminPhone();

    return generateWhatsAppLink(phone, message);
  };

  /**
   * Generate WhatsApp message text for the entire shopping cart order
   */
  const getCartMessage = (cartItems, customerDetails) => {
    return generateCartWhatsAppMessage(cartItems, customerDetails);
  };

  /**
   * Generate WhatsApp link for the entire shopping cart order
   */
  const sendCartToWhatsApp = (cartItems, customerDetails) => {
    const message = generateCartWhatsAppMessage(cartItems, customerDetails);
    const phone = getAdminPhone();

    return generateWhatsAppLink(phone, message);
  };

  return { sendToWhatsApp, sendCartToWhatsApp, getCartMessage, getAdminPhone };
}
