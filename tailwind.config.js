/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "cyber-black": "#05060a",
        "cyber-panel": "#0b0e14",
        "cyber-panel-2": "#10141d",
        "cyber-border": "#1c2430",
        "cyber-green": "#39ff88",
        "cyber-green-dim": "#0f4d2c",
        "cyber-blue": "#22d3ee",
        "cyber-blue-dim": "#0e3f4a",
        "cyber-magenta": "#ff2fd1",
        "cyber-amber": "#ffb020",
        "cyber-red": "#ff3b5c",
        "cyber-text": "#d7fbe8",
        "cyber-text-dim": "#7d93a3",
      },
      fontFamily: {
        display: ["var(--font-display)", "monospace"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "neon-green": "0 0 5px rgba(57,255,136,0.6), 0 0 20px rgba(57,255,136,0.35), 0 0 60px rgba(57,255,136,0.15)",
        "neon-blue": "0 0 5px rgba(34,211,238,0.6), 0 0 20px rgba(34,211,238,0.35), 0 0 60px rgba(34,211,238,0.15)",
        "neon-magenta": "0 0 5px rgba(255,47,209,0.6), 0 0 20px rgba(255,47,209,0.35)",
        "panel": "0 4px 30px rgba(0,0,0,0.55)",
      },
      backgroundImage: {
        "grid-fade": "linear-gradient(to bottom, rgba(5,6,10,0) 0%, rgba(5,6,10,1) 90%)",
        "scanlines": "repeating-linear-gradient(to bottom, rgba(57,255,136,0.035) 0px, rgba(57,255,136,0.035) 1px, transparent 1px, transparent 3px)",
      },
      animation: {
        "pulse-slow": "pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flicker": "flicker 4s linear infinite",
        "matrix-scroll": "matrix-scroll 20s linear infinite",
      },
      keyframes: {
        flicker: {
          "0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 100%": { opacity: 1 },
          "20%, 21.9%, 63%, 63.9%": { opacity: 0.4 },
        },
        "matrix-scroll": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 1000px" },
        },
      },
    },
  },
  plugins: [],
};
