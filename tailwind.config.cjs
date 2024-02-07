/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        blinking: "blink 1s ease-in",
      },
      boxShadow: {
        XOYO: "0px 0px 20px rgba(0, 0, 0, 0.05)",
        header:
          "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
      },
    },
    borderImage: {
      dashBorder:
        "url(data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='%23333' strokeWidth='4' stroke-dasharray='6%2c 14' stroke-dashoffset='4' strokeLinecap='round'/%3e%3c/svg%3e)",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      blue_primary: "#00145b",
      white: "#FFFFFF",
      button_color: "#E3F8F6",
      font_black: "#000000",
      grey_border: "#A4ACAC",
      font_dark: "#4B5D63",
      grey_icon: "#6B7B80",
      "grey_preview;font_title": "#A4ACAC",
      grey_border_table_disable: "#D1D9DB",
      disable_grey: "#F8F8F8",
      grey_border_table: "#D1D9DB",
      background_grey: "#f7f7f7",
      grey_color: "#f8f8f8",
      error_red: "#EF4444",
      error_text: "#7F1D1D",
      hoverChange: "#0b1e63",
      btnClip_hover: "#D2F0EB",
      grey_bg: "#F3F6F6",
      bg_Grey: "#F1F1F1",
      table_border: "#E5E7EB",
      table_head_color: "#B9BFBF",
      bulkedit_table_head: "#C4C4C4",
      search_icon: "#9CA3AF",
      fail_error: "#EB5236",
      light_geen: "#D1FAE5",
      Incative_red: "#991B1B",
      light_red: "#FEE2E2",
      font_green: "#065F46",
      success_text: "#30BE83",
      inprogress_text: "#EE9F2D",
      orange_text: "#EE9F2D",
    },
    fontFamily: {
      "nova-flat": ["Nova Flat"],
      Nunito: ["'Nunito', sans-serif"],
      Nunito_Normal: ["'Nunito', normal"],
      Inter: ["'Inter', sans-serif"],
    },
    fontSize: {
      xs: "0.75rem;",
      sm: "0.875rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      text_28: "28px",
    },
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
