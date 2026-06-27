import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === Surface & Background ===
        // bg: page background — pale cool neutral
        bg: "hsl(var(--bg))",
        // surface: primary card / panel background
        surface: "hsl(var(--surface))",
        // surface-subtle: secondary panel, nested inner areas
        "surface-subtle": "hsl(var(--surface-subtle))",

        // === Border ===
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // === Text ===
        // text: primary text
        text: "hsl(var(--text))",
        // text-muted: secondary / supporting text
        "text-muted": "hsl(var(--text-muted))",
        // text-faint: tertiary / placeholder text
        "text-faint": "hsl(var(--text-faint))",

        // === Legacy aliases (already in use, kept for compatibility) ===
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // === Primary ===
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        // === Secondary ===
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        // === Destructive (danger) ===
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        // === Muted ===
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        // === Accent ===
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        // === Popover ===
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        // === Card ===
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // === Semantic status colors ===
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },

        // === Sidebar ===
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      // === Border Radius ===
      // Base unit: --radius = 0.75rem (12px)
      borderRadius: {
        // card: large radius — primary card surfaces
        card: "var(--radius-card)",
        // input: medium radius — form fields
        input: "var(--radius-input)",
        // button: medium radius — action buttons
        button: "var(--radius-button)",
        // chip: full radius — tags, badges, chips
        chip: "9999px",
        // badge: small radius — status badges
        badge: "var(--radius-badge)",
        // Legacy aliases (already in use)
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },

      // === Spacing (4px base grid) ===
      spacing: {
        "0": "0",
        "1": "0.25rem",  // 4px
        "2": "0.5rem",   // 8px
        "3": "0.75rem",  // 12px
        "4": "1rem",     // 16px — md base
        "5": "1.25rem",  // 20px
        "6": "1.5rem",   // 24px — lg base
        "8": "2rem",     // 32px — xl base
        "10": "2.5rem",  // 40px — 2xl base
        "12": "3rem",     // 48px
        "16": "4rem",     // 64px
        "20": "5rem",     // 80px
        // Semantic spacing tokens (xs through 2xl)
        xs:  "0.5rem",   // 8px  — tight inline gaps
        sm:  "0.75rem",  // 12px — compact padding
        md:  "1rem",     // 16px — default padding/gap
        lg:  "1.5rem",   // 24px — section spacing
        xl:  "2rem",     // 32px — major section gaps
        "2xl": "3rem",   // 48px — page-level spacing
        // Custom non-standard values
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },

      // === Typography ===
      fontSize: {
        // page-title: top-level page heading
        "page-title": ["1.875rem", { lineHeight: "2.25rem", fontWeight: "700", letterSpacing: "-0.025em" }],
        // section-title: section/panel heading
        "section-title": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600", letterSpacing: "-0.015em" }],
        // card-title: card/section heading
        "card-title": ["1rem", { lineHeight: "1.5rem", fontWeight: "600", letterSpacing: "-0.01em" }],
        // body: default paragraph text
        body: ["0.9375rem", { lineHeight: "1.625rem", fontWeight: "400" }],
        // helper: supporting / meta text
        helper: ["0.8125rem", { lineHeight: "1.375rem", fontWeight: "400" }],
        // label: form label text
        label: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500" }],
        // status: status badge / chip text
        status: ["0.75rem", { lineHeight: "1rem", fontWeight: "500" }],
        // table: table cell / row text
        table: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],
        // xs: smallest supporting text
        xs: ["0.75rem", { lineHeight: "1rem", fontWeight: "400" }],
        // sm: small body text
        sm: ["0.875rem", { lineHeight: "1.375rem", fontWeight: "400" }],
        // base: default body text
        base: ["0.9375rem", { lineHeight: "1.625rem", fontWeight: "400" }],
        // lg: large body / card value
        lg: ["1.125rem", { lineHeight: "1.75rem", fontWeight: "400" }],
        // xl: emphasized body
        xl: ["1.25rem", { lineHeight: "1.875rem", fontWeight: "400" }],
        // 2xl: sub-heading
        "2xl": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
        // 3xl: section heading
        "3xl": ["1.875rem", { lineHeight: "2.25rem", fontWeight: "700" }],
        // 4xl: page title (largest)
        "4xl": ["2.25rem", { lineHeight: "2.5rem", fontWeight: "700", letterSpacing: "-0.025em" }],
      },

      // === Shadows ===
      boxShadow: {
        // soft-sm: default card (lowest elevation)
        "soft-sm": "0 1px 3px 0 hsl(var(--shadow-color) / 0.05), 0 1px 2px -1px hsl(var(--shadow-color) / 0.05)",
        // soft: standard card shadow
        soft: "0 2px 8px 0 hsl(var(--shadow-color) / 0.06), 0 1px 3px -1px hsl(var(--shadow-color) / 0.06)",
        // soft-md: hovered / highlighted card (medium elevation)
        "soft-md": "0 4px 12px 0 hsl(var(--shadow-color) / 0.07), 0 2px 4px -2px hsl(var(--shadow-color) / 0.06)",
        // soft-lg: modal / dropdown (high elevation)
        "soft-lg": "0 8px 24px 0 hsl(var(--shadow-color) / 0.08), 0 4px 8px -4px hsl(var(--shadow-color) / 0.07)",
        // soft-xl: popover / tooltip (highest elevation)
        "soft-xl": "0 12px 40px 0 hsl(var(--shadow-color) / 0.09), 0 6px 12px -6px hsl(var(--shadow-color) / 0.08)",
      },

      // === Keyframes ===
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "skeleton-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "spinner": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },

      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "slide-up": "slide-up 200ms ease-out",
        "slide-down": "slide-down 200ms ease-out",
        "scale-in": "scale-in 200ms ease-out",
        "skeleton-pulse": "skeleton-pulse 1.5s ease-in-out infinite",
        "spinner": "spinner 600ms linear infinite",
      },

      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
        "300": "300ms",
      },

      transitionTimingFunction: {
        "ease-out": "cubic-bezier(0.0, 0.0, 0.2, 1)",
        "ease-in-out": "cubic-bezier(0.4, 0.0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
