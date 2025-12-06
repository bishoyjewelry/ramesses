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
        serif: ["Playfair Display", "serif"],
        sans: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
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