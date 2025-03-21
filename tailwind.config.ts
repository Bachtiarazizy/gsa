import { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";
import tailwindcssAnimate from "tailwindcss-animate";
import typographyPlugin from "@tailwindcss/typography";

export default withUt({
  darkMode: ["class"],
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1400px",
    },
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        futuru: ["var(--font-futuru)"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
          },
        },
        compact: {
          css: {
            p: {
              marginTop: "0",
              marginBottom: "0",
            },
            h1: {
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              fontWeight: "normal",
              marginTop: "0",
              marginBottom: "0",
            },
            h2: {
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              fontWeight: "normal",
              marginTop: "0",
              marginBottom: "0",
            },
            h3: {
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              fontWeight: "normal",
              marginTop: "0",
              marginBottom: "0",
            },
            ul: {
              marginTop: "0",
              marginBottom: "0",
            },
            ol: {
              marginTop: "0",
              marginBottom: "0",
            },
            li: {
              marginTop: "0",
              marginBottom: "0",
            },
            "ul > li": {
              paddingLeft: "0.75rem",
            },
            "ol > li": {
              paddingLeft: "0.75rem",
            },
          },
        },
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        // Additional specific colors
        colorCodGray: "#191919",
        colorOrangyRed: "#FE330A",
        colorLinenRuffle: "#EFEAE3",
        colorViolet: "#321CA4",
        colorGreen: "#39FF14",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate, typographyPlugin],
}) satisfies Config;
