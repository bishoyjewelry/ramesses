import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Palette 1: Service Core
        service: {
          bg: "hsl(var(--service-bg-primary))",
          "bg-secondary": "hsl(var(--service-bg-secondary))",
          gold: "hsl(var(--service-gold))",
          "gold-hover": "hsl(var(--service-gold-hover))",
          "gold-text": "hsl(var(--service-gold-text))",
          text: "hsl(var(--service-text-primary))",
          "text-muted": "hsl(var(--service-text-secondary))",
          neutral: "hsl(var(--service-neutral))",
        },
        // Palette 2: Luxury Lab
        luxury: {
          bg: "hsl(var(--luxury-bg-primary))",
          "bg-warm": "hsl(var(--luxury-bg-secondary))",
          champagne: "hsl(var(--luxury-champagne))",
          "champagne-hover": "hsl(var(--luxury-champagne-hover))",
          text: "hsl(var(--luxury-text-primary))",
          "text-muted": "hsl(var(--luxury-text-secondary))",
          divider: "hsl(var(--luxury-divider))",
          // Legacy tokens
          gold: "hsl(var(--luxury-gold))",
          "gold-light": "hsl(var(--luxury-gold-light))",
          dark: "hsl(var(--luxury-dark))",
          charcoal: "hsl(var(--luxury-charcoal))",
          cream: "hsl(var(--luxury-cream))",
          warm: "hsl(var(--luxury-warm))",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      fontSize: {
        // Small/helper text: 13-14px
        "xs": ["0.8125rem", { lineHeight: "1.5" }],
        "sm": ["0.875rem", { lineHeight: "1.5" }],
        // Body text: 16px desktop, 15px mobile
        "base": ["0.9375rem", { lineHeight: "1.55" }],
        // Buttons: 14-15px, weight 500
        "button": ["0.875rem", { lineHeight: "1.2", fontWeight: "500" }],
        // Navigation
        "nav": ["0.875rem", { lineHeight: "1.2" }],
        // Subheadline: 16-18px
        "subhead": ["1rem", { lineHeight: "1.4" }],
        // H3: 24px desktop / 20px mobile
        "xl": ["1.25rem", { lineHeight: "1.2" }],
        "2xl": ["1.5rem", { lineHeight: "1.2" }],
        // H2: 32px desktop / 26px mobile
        "3xl": ["1.625rem", { lineHeight: "1.15" }],
        "4xl": ["2rem", { lineHeight: "1.15" }],
        // H1: 54px desktop / 36px mobile - Hero
        "5xl": ["2.25rem", { lineHeight: "1.08" }],
        "6xl": ["3.375rem", { lineHeight: "1.08" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
      },
      letterSpacing: {
        tighter: "-0.02em",
        tight: "-0.015em",
        normal: "0",
        wide: "0.01em",
        wider: "0.02em",
      },
      lineHeight: {
        tightest: "1.08",
        tight: "1.15",
        snug: "1.2",
        normal: "1.4",
        relaxed: "1.55",
        loose: "1.6",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        luxury: "var(--shadow-luxury)",
        soft: "var(--shadow-soft)",
        service: "var(--shadow-service)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
