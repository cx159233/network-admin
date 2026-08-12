/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,js,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#165DFF',
          50: '#E8F3FF',
          100: '#BEDAFF',
          200: '#94BFFF',
          300: '#6AA1FF',
          400: '#4080FF',
          500: '#165DFF',
          600: '#0E42D2',
          700: '#072CA6',
          800: '#031C7C',
          900: '#000D4D',
          950: '#000226'
        },
        secondary: '#06B6D4',
        accent: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        error: '#EF4444',
        success: '#16A34A',
        bg: '#F7F8FA',
        'bg-soft': '#F2F3F5',
        surface: '#FFFFFF',
        'text-primary': 'rgba(0, 0, 0, 0.85)',
        'text-secondary': '#4E5969',
        'text-tertiary': '#86909C',
        'text-disabled': '#C9CDD4',
        'border': '#E5E6EB',
        'border-soft': '#F2F3F5',
        'border-strong': '#C9CDD4',
        'ink': {
          DEFAULT: '#0B1120',
          900: '#0B1120',
          800: '#0F172A',
          700: '#1E293B'
        },
        'primary-light': '#4080FF',
        'primary-dark': '#0E42D2',
        sidebar: '#0B1120'
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.04)',
        panel: '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
        dropdown: '0 10px 24px rgba(15, 23, 42, 0.10), 0 4px 8px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 8px 24px rgba(22, 93, 255, 0.10), 0 2px 6px rgba(15, 23, 42, 0.04)'
      },
      fontFamily: {
        sans: ['"PingFang SC"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Microsoft YaHei"', '"Hiragino Sans GB"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        number: ['"SF Mono"', '"Cascadia Code"', '"Consolas"', '"PingFang SC"', '"Microsoft YaHei"', 'monospace']
      },
      borderRadius: {
        '4': '4px',
        '8': '8px',
        '12': '12px'
      }
    }
  },
  plugins: []
}
