# 🎨 Design System - Website Bán Tài Khoản Game

## 📝 Typography (Font & Size)

### Font Family:
Website sử dụng **System Font Stack** mặc định của Tailwind CSS:
```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Base Font Size:
```css
--font-size: 16px; /* Root font size */
```

### Font Weights:
```css
--font-weight-normal: 400;  /* Regular text, inputs */
--font-weight-medium: 500;  /* Headings, buttons, labels */
```

### Typography Scale:

| Element | Font Size | Font Weight | Line Height | Tailwind Class |
|---------|-----------|-------------|-------------|----------------|
| **h1** | 2xl (~1.5rem/24px) | 500 (medium) | 1.5 | `text-2xl font-medium` |
| **h2** | xl (~1.25rem/20px) | 500 (medium) | 1.5 | `text-xl font-medium` |
| **h3** | lg (~1.125rem/18px) | 500 (medium) | 1.5 | `text-lg font-medium` |
| **h4** | base (1rem/16px) | 500 (medium) | 1.5 | `text-base font-medium` |
| **Body** | base (1rem/16px) | 400 (normal) | 1.5 | `text-base` |
| **Label** | base (1rem/16px) | 500 (medium) | 1.5 | `text-base font-medium` |
| **Button** | base (1rem/16px) | 500 (medium) | 1.5 | `text-base font-medium` |
| **Input** | base (1rem/16px) | 400 (normal) | 1.5 | `text-base` |
| **Small** | sm (~0.875rem/14px) | 400 (normal) | 1.5 | `text-sm` |
| **Extra Small** | xs (~0.75rem/12px) | 400 (normal) | 1.5 | `text-xs` |

### Common Text Utilities:
```css
text-3xl    /* ~1.875rem/30px - Hero titles */
text-2xl    /* ~1.5rem/24px - Page titles */
text-xl     /* ~1.25rem/20px - Section titles */
text-lg     /* ~1.125rem/18px - Subsection titles */
text-base   /* 1rem/16px - Body text */
text-sm     /* ~0.875rem/14px - Small text, captions */
text-xs     /* ~0.75rem/12px - Labels, badges */
```

---

## 🎨 Color Palette

### 🌟 Brand Colors (Primary Theme):

#### **Primary - Đỏ Hồng (Pink/Red)**
```css
Màu chính: #FF2E63
Hover:     #d9254f
Sử dụng:   CTAs, Buttons, Links, Active states, Important actions
```

#### **Secondary - Cyan (Xanh ngọc)**
```css
Màu chính: #08D9D6
Hover:     #06b8b5
Sử dụng:   Secondary buttons, Accents, Icons, Wallet/Balance
```

#### **Dark - Xám Đen Đậm**
```css
Màu chính: #252A34
Muted:     #3a404d (dark mode backgrounds)
Sử dụng:   Text, Sidebar, Headers, Dark backgrounds
```

#### **Light - Xám Nhạt**
```css
Màu chính: #EAEAEA
Hover:     #f5f5f5
Sử dụng:   Light backgrounds, Borders, Subtle elements
```

---

## 🎨 CSS Variables (Custom Properties)

### Light Mode Colors:
```css
:root {
  /* Base colors */
  --background: #ffffff;
  --foreground: #252A34;
  
  /* Card colors */
  --card: #ffffff;
  --card-foreground: #252A34;
  
  /* Brand colors */
  --primary: #FF2E63;
  --primary-foreground: #ffffff;
  --secondary: #08D9D6;
  --secondary-foreground: #252A34;
  
  /* UI colors */
  --muted: #EAEAEA;
  --muted-foreground: #252A34;
  --accent: #08D9D6;
  --accent-foreground: #252A34;
  
  /* Status colors */
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;
  
  /* Border & Input */
  --border: rgba(37, 42, 52, 0.1);
  --input: transparent;
  --input-background: #f8f9fa;
  --ring: #FF2E63;
  
  /* Sidebar */
  --sidebar: #252A34;
  --sidebar-foreground: #ffffff;
  --sidebar-primary: #FF2E63;
  --sidebar-accent: #08D9D6;
  --sidebar-border: rgba(255, 255, 255, 0.1);
  
  /* Custom brand */
  --brand-primary: #FF2E63;
  --brand-secondary: #08D9D6;
  --brand-dark: #252A34;
  --brand-light: #EAEAEA;
  
  /* Radius */
  --radius: 0.625rem; /* 10px */
}
```

### Dark Mode Colors:
```css
.dark {
  --background: #252A34;
  --foreground: #ffffff;
  --card: #252A34;
  --card-foreground: #ffffff;
  --muted: #3a404d;
  --muted-foreground: #d1d5db;
  --border: rgba(8, 217, 214, 0.2);
  /* Primary & Secondary giữ nguyên */
}
```

---

## 🎨 Tailwind Color Classes

### Primary (Đỏ Hồng):
```css
bg-[#FF2E63]         /* Background primary */
text-[#FF2E63]       /* Text primary */
border-[#FF2E63]     /* Border primary */
hover:bg-[#d9254f]   /* Hover state */
hover:text-[#d9254f] /* Hover text */
```

### Secondary (Cyan):
```css
bg-[#08D9D6]         /* Background secondary */
text-[#08D9D6]       /* Text secondary */
border-[#08D9D6]     /* Border secondary */
hover:bg-[#06b8b5]   /* Hover state */
hover:text-[#06b8b5] /* Hover text */
```

### Dark (Xám Đen):
```css
bg-[#252A34]         /* Background dark */
text-[#252A34]       /* Text dark */
bg-[#3a404d]         /* Muted dark */
```

### Light (Xám Nhạt):
```css
bg-[#EAEAEA]         /* Background light */
bg-gray-50           /* Alternative light bg */
border-gray-200      /* Light borders */
text-gray-500        /* Muted text */
text-gray-600        /* Medium text */
text-gray-700        /* Dark text */
text-gray-800        /* Darker text */
```

---

## 🎨 Gradient Combinations

### Header/Hero Gradients:
```css
/* Xám đen → Đỏ hồng → Cyan */
bg-gradient-to-r from-[#252A34] via-[#FF2E63] to-[#08D9D6]

/* Đỏ hồng → Cyan */
bg-gradient-to-r from-[#FF2E63] to-[#08D9D6]

/* Cyan → Đỏ hồng */
bg-gradient-to-r from-[#08D9D6] to-[#FF2E63]
```

### Button Gradients:
```css
/* Primary button */
bg-gradient-to-r from-[#252A34] to-[#FF2E63]
hover:from-[#252A34] hover:to-[#d9254f]

/* Secondary button */
bg-gradient-to-r from-[#08D9D6] to-[#FF2E63]

/* Balance/Wallet card */
bg-gradient-to-r from-[#08D9D6] to-[#FF2E63]
```

---

## 🎨 Status Colors

### Success (Xanh lá):
```css
bg-green-50          /* Light background */
bg-green-100         /* Badge background */
text-green-600       /* Icon color */
text-green-700       /* Text color */
text-green-900       /* Dark text */
border-green-200     /* Border */
```

### Error/Danger (Đỏ):
```css
bg-red-50            /* Light background */
bg-red-100           /* Badge background */
text-red-600         /* Icon color */
text-red-700         /* Text color */
text-red-900         /* Dark text */
border-red-200       /* Border */
```

### Warning (Vàng):
```css
bg-yellow-50         /* Light background */
bg-yellow-100        /* Badge background */
bg-yellow-500        /* Button background */
text-yellow-600      /* Icon color */
text-yellow-900      /* Dark text */
border-yellow-200    /* Border */
```

### Info (Xanh dương):
```css
bg-blue-50           /* Light background */
bg-blue-100          /* Badge background */
bg-blue-500          /* Button background */
text-blue-600        /* Icon color */
text-blue-700        /* Text color */
border-blue-200      /* Border */
```

### Cyan Info:
```css
bg-cyan-50           /* Light background */
text-[#08D9D6]       /* Cyan text */
```

---

## 📐 Spacing & Border Radius

### Border Radius:
```css
--radius: 0.625rem;           /* 10px - Default */
--radius-sm: calc(10px - 4px); /* 6px - Small */
--radius-md: calc(10px - 2px); /* 8px - Medium */
--radius-lg: 10px;             /* 10px - Large */
--radius-xl: calc(10px + 4px); /* 14px - Extra large */

/* Tailwind classes: */
rounded-lg           /* 10px - Cards, buttons */
rounded-xl           /* 12px - Modals, large cards */
rounded-2xl          /* 16px - Hero sections */
rounded-full         /* Pills, badges, avatars */
```

### Common Spacing:
```css
p-2   /* 0.5rem/8px */
p-3   /* 0.75rem/12px */
p-4   /* 1rem/16px */
p-6   /* 1.5rem/24px */
p-8   /* 2rem/32px */

gap-2 /* 0.5rem/8px - Icon + text */
gap-3 /* 0.75rem/12px - Small gaps */
gap-4 /* 1rem/16px - Medium gaps */
gap-6 /* 1.5rem/24px - Large gaps */
```

---

## 🎯 Component Color Patterns

### Buttons:

**Primary Button:**
```css
bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white
hover:from-[#252A34] hover:to-[#d9254f]
```

**Secondary Button:**
```css
bg-[#08D9D6] text-[#252A34]
hover:bg-[#06b8b5]
```

**Outline Button:**
```css
border border-[#FF2E63] text-[#FF2E63]
hover:bg-[#FF2E63] hover:text-white
```

### Cards:
```css
bg-white rounded-xl shadow-lg
border border-gray-200  /* Optional */
```

### Input Fields:
```css
border border-gray-300 rounded-lg
focus:ring-2 focus:ring-[#FF2E63] focus:border-transparent
```

### Links:
```css
text-[#FF2E63] hover:text-[#08D9D6]
```

### Badges/Pills:
```css
/* Success */
bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs

/* Error */
bg-red-100 text-red-700 rounded-full px-3 py-1 text-xs

/* Info */
bg-cyan-100 text-[#08D9D6] rounded-full px-3 py-1 text-xs
```

---

## 🎨 Theme Personality

### Color Psychology:

| Color | Hex | Meaning | Usage |
|-------|-----|---------|-------|
| **Cyan** | #08D9D6 | Trust, Technology, Freshness | Wallet, Balance, Support features |
| **Pink** | #FF2E63 | Energy, Excitement, Action | CTAs, Important actions, Active states |
| **Dark** | #252A34 | Professional, Modern, Serious | Text, Sidebar, Headers |
| **Light** | #EAEAEA | Clean, Minimal, Spacious | Backgrounds, Subtle elements |

### Design Style:
- **Before:** Red-Purple-Navy (Strong & Luxurious)
- **Now:** Cyan-Pink-Dark (Modern & Dynamic)

---

## 📋 Quick Reference

### Most Used Colors:
```css
/* Primary actions */
#FF2E63 - Buttons, Links, Active states

/* Secondary actions */
#08D9D6 - Wallet, Icons, Accents

/* Text & Dark elements */
#252A34 - Body text, Sidebar, Headers

/* Backgrounds */
#EAEAEA - Light backgrounds
#ffffff - White backgrounds
#f8f9fa - Input backgrounds

/* Grays */
#9ca3af - text-gray-400 (Muted text)
#6b7280 - text-gray-500 (Secondary text)
#4b5563 - text-gray-600 (Body text)
#374151 - text-gray-700 (Strong text)
#1f2937 - text-gray-800 (Heading text)
```

### Common Gradients:
```css
/* Primary CTA */
from-[#252A34] to-[#FF2E63]

/* Feature highlight */
from-[#08D9D6] to-[#FF2E63]

/* Hero section */
from-[#252A34] via-[#FF2E63] to-[#08D9D6]
```

---

## 🔧 How to Use

### 1. For Headings:
```jsx
<h1 className="text-3xl font-bold text-gray-800">Title</h1>
<h2 className="text-2xl font-bold text-gray-800">Section</h2>
<h3 className="text-xl font-semibold text-gray-700">Subsection</h3>
```

### 2. For Buttons:
```jsx
{/* Primary */}
<button className="bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#252A34] hover:to-[#d9254f]">
  Click me
</button>

{/* Secondary */}
<button className="bg-[#08D9D6] text-[#252A34] px-6 py-3 rounded-lg font-semibold hover:bg-[#06b8b5]">
  Secondary
</button>
```

### 3. For Text:
```jsx
{/* Body text */}
<p className="text-gray-600">Description text</p>

{/* Muted text */}
<span className="text-sm text-gray-500">Helper text</span>

{/* Brand link */}
<a className="text-[#FF2E63] hover:text-[#08D9D6]">Link</a>
```

### 4. For Cards:
```jsx
<div className="bg-white rounded-xl shadow-lg p-6">
  <h3 className="text-xl font-bold text-gray-800 mb-4">Card Title</h3>
  <p className="text-gray-600">Card content</p>
</div>
```

---

## 📱 Responsive Typography

```css
/* Mobile first approach */
text-base    /* Base size for mobile */
md:text-lg   /* Medium screens */
lg:text-xl   /* Large screens */

/* Example: */
className="text-2xl md:text-3xl lg:text-4xl font-bold"
```

---

Tài liệu này là hướng dẫn đầy đủ về Design System của website! 🎨✨
