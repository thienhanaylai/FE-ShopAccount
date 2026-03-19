/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Cyan & Pink Theme
        brand: {
          primary: "#F5A65B",      // Đỏ hồng - Primary CTA
          secondary: "#1EA7FD",    // Cyan - Secondary/Accent
          dark: "#0D4D8B",         // Xám đen - Text/Sidebar
          light: "#EAF4FF",        // Xám nhạt - Background
        },
        
        // CSS Variables Integration
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",      // #F5A65B
          foreground: "var(--primary-foreground)",
          hover: "#E58B3D",
        },
        secondary: {
          DEFAULT: "var(--secondary)",    // #1EA7FD
          foreground: "var(--secondary-foreground)",
          hover: "#158DD8",
        },
        muted: {
          DEFAULT: "var(--muted)",        // #EAF4FF
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",       // #1EA7FD
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        
        // Chart colors
        chart: {
          1: "var(--chart-1)",  // #F5A65B
          2: "var(--chart-2)",  // #1EA7FD
          3: "var(--chart-3)",  // #0D4D8B
          4: "var(--chart-4)",  // #EAF4FF
          5: "var(--chart-5)",  // #F5A65B
        },
        
        // Sidebar colors
        sidebar: {
          DEFAULT: "var(--sidebar)",                         // #0D4D8B
          foreground: "var(--sidebar-foreground)",           // #ffffff
          primary: "var(--sidebar-primary)",                 // #F5A65B
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",                   // #1EA7FD
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      
      borderRadius: {
        lg: "var(--radius)",           // 0.625rem (10px)
        md: "calc(var(--radius) - 2px)", // 8px
        sm: "calc(var(--radius) - 4px)", // 6px
        xl: "calc(var(--radius) + 2px)", // 12px
      },
      
      fontSize: {
        base: "var(--font-size)",  // 16px
      },
      
      fontWeight: {
        normal: "var(--font-weight-normal)",  // 400
        medium: "var(--font-weight-medium)",  // 500
      },
      
      // Custom gradient utilities
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #0D4D8B, #F5A65B)",
        "gradient-secondary": "linear-gradient(to right, #1EA7FD, #F5A65B)",
        "gradient-hero": "linear-gradient(to right, #0D4D8B, #F5A65B, #1EA7FD)",
        "gradient-reverse": "linear-gradient(to right, #F5A65B, #1EA7FD)",
      },
      
      // Box shadow
      boxShadow: {
        sm: "0 1px 2px 0 rgba(37, 42, 52, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(37, 42, 52, 0.1), 0 1px 2px -1px rgba(37, 42, 52, 0.1)",
        md: "0 4px 6px -1px rgba(37, 42, 52, 0.1), 0 2px 4px -2px rgba(37, 42, 52, 0.1)",
        lg: "0 10px 15px -3px rgba(37, 42, 52, 0.1), 0 4px 6px -4px rgba(37, 42, 52, 0.1)",
        xl: "0 20px 25px -5px rgba(37, 42, 52, 0.1), 0 8px 10px -6px rgba(37, 42, 52, 0.1)",
        "2xl": "0 25px 50px -12px rgba(37, 42, 52, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(37, 42, 52, 0.05)",
      },
      
      // Animation
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-10px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(10px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.3s ease-out",
      },
      
      // Container
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1400px",
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
