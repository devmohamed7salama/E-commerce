import { useSettings } from "./useSettings";
import {
  generateWhatsAppMessage,
  generateCartWhatsAppMessage,
  generateWhatsAppLink
} from "../services/whatsappService";

export function useWhatsApp() {
  const { data: settings } = useSettings();

  /**
   * Generate WhatsApp link for a single product order
   */
  const sendToWhatsApp = (product, options, customerDetails) => {
    const message = generateWhatsAppMessage(product, options, customerDetails);
    const phone = settings?.whatsapp || "201234567890"; // fallback number

    return generateWhatsAppLink(phone, message);
  };

  /**
   * Generate WhatsApp link for the entire shopping cart order
   */
  const sendCartToWhatsApp = (cartItems, customerDetails) => {
    const message = generateCartWhatsAppMessage(cartItems, customerDetails);
    const phone = settings?.whatsapp || "201234567890"; // fallback number

    return generateWhatsAppLink(phone, message);
  };

  return { sendToWhatsApp, sendCartToWhatsApp };
}
