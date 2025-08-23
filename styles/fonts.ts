// eslint-disable-next-line camelcase
import {Red_Rose} from "next/font/google";

// Configure Red Rose font from Google Fonts
export const redRose = Red_Rose({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

// Export font class name for use in components
export const redRoseFontClass = redRose.className;
