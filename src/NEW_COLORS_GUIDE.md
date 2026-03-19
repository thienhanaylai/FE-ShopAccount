# 🎨 Hướng dẫn Màu Mới - Cyan & Pink Theme

## ✅ Bảng màu mới:
```
#08D9D6 - Cyan/Xanh ngọc sáng (Secondary/Accent)
#252A34 - Xám đen đậm (Dark/Text/Sidebar)  
#FF2E63 - Đỏ hồng (Primary/CTA)
#EAEAEA - Xám nhạt (Background/Borders)
```

## 🎯 Ánh xạ màu:

### Primary Colors (Đỏ hồng):
- **#FF2E63** → Primary, CTAs, Active states, Links
- **#d9254f** → Hover state for primary

### Secondary Colors (Cyan):
- **#08D9D6** → Secondary buttons, Accents, Icons
- **#06b8b5** → Hover state for secondary

### Dark Colors (Xám đen):
- **#252A34** → Text, Sidebar, Dark backgrounds
- **#3a404d** → Muted backgrounds (dark mode)

### Light Colors (Xám nhạt):
- **#EAEAEA** → Light backgrounds, Borders
- **#f5f5f5** → Hover backgrounds

## 📝 CSS Variables đã cập nhật:

```css
--primary: #FF2E63;
--secondary: #08D9D6;
--foreground: #252A34;
--muted: #EAEAEA;
--sidebar: #252A34;
--sidebar-primary: #FF2E63;
--sidebar-accent: #08D9D6;
```

## 🔄 Thay thế màu cũ sang mới:

### Từ màu đỏ-tím (cũ) → Cyan-Pink (mới):

```
#FF204E → #FF2E63 (đỏ hồng primary)
#A0153E → #252A34 (xám đen dark)
#5D0E41 → #252A34 (xám đen dark)
#00224D → #252A34 (xám đen sidebar)
```

### Gradients:

**Header/Hero:**
```css
from-[#252A34] via-[#FF2E63] to-[#08D9D6]
/* Xám đen → Đỏ hồng → Cyan */
```

**Buttons:**
```css
from-[#252A34] to-[#FF2E63]
hover:from-[#252A34] hover:to-[#d9254f]
```

**Stats/Features:**
```css
from-[#08D9D6] to-[#FF2E63]
/* Cyan → Đỏ hồng */
```

## 📁 Files đã cập nhật:

✅ `/styles/globals.css` - All CSS variables
✅ `/utils/colors.ts` - Color constants
✅ `/components/Header.tsx` - Gradient xám đen → đỏ hồng
✅ `/components/GameAccountCard.tsx` - Button gradient
✅ `/components/FilterSidebar.tsx` - Icons & checkboxes
✅ `/components/Banner.tsx` - Gradient cyan → đỏ → xám
✅ `/components/AdminSidebar.tsx` - Active menu color
✅ `/pages/HomePage.tsx` - All sections updated

## 🎨 Theme personality:

**Trước:** Đỏ-Tím-Navy (Mạnh mẽ & Sang trọng)
**Bây giờ:** Cyan-Pink-Dark (Hiện đại & Năng động)

- **Primary (#FF2E63):** CTAs, important actions
- **Secondary (#08D9D6):** Support, balance, wallet
- **Dark (#252A34):** Text, sidebar, serious content
- **Light (#EAEAEA):** Backgrounds, subtle elements

## 🔧 Find & Replace cho files còn lại:

### Step 1: Gradients
```
Find: from-[#5D0E41] to-[#FF204E]
Replace: from-[#252A34] to-[#FF2E63]

Find: from-[#5D0E41] via-[#FF204E] to-[#A0153E]
Replace: from-[#252A34] via-[#FF2E63] to-[#08D9D6]

Find: from-[#08D9D6] via-[#FF2E63] to-[#A0153E]
Replace: from-[#08D9D6] via-[#FF2E63] to-[#252A34]
```

### Step 2: Text Colors
```
Find: text-[#FF204E]
Replace: text-[#FF2E63]

Find: text-[#5D0E41]
Replace: text-[#252A34]

Find: text-[#A0153E]
Replace: text-[#08D9D6]

Find: text-[#ffccd5]
Replace: text-gray-100
```

### Step 3: Background Colors
```
Find: bg-[#FF204E]
Replace: bg-[#FF2E63]

Find: bg-[#5D0E41]
Replace: bg-[#252A34]

Find: bg-[#A0153E]
Replace: bg-[#08D9D6]

Find: bg-[#00224D]
Replace: bg-[#252A34]

Find: bg-[#ffebef]
Replace: bg-red-50

Find: bg-[#fff5f7]
Replace: bg-gray-50
```

### Step 4: Hover States
```
Find: hover:to-[#A0153E]
Replace: hover:to-[#d9254f]

Find: hover:bg-[#A0153E]
Replace: hover:bg-[#06b8b5]

Find: hover:text-[#ffccd5]
Replace: hover:text-[#08D9D6]
```

### Step 5: Focus/Ring
```
Find: focus:ring-[#FF204E]
Replace: focus:ring-[#FF2E63]

Find: border-[#FF204E]
Replace: border-[#FF2E63]
```

## 🎯 Files cần update thủ công:

Các file này cần update với patterns trên:
- `/pages/LoginPage.tsx`
- `/pages/RegisterPage.tsx`
- `/pages/ProductDetailPage.tsx`
- `/pages/DepositPage.tsx`
- `/pages/CardTopupPage.tsx`
- `/pages/SellAccountPage.tsx`
- `/pages/SupportPage.tsx`
- `/pages/UserProfilePage.tsx`
- `/pages/admin/*.tsx` (tất cả admin pages)
- `/components/admin/*.tsx` (tất cả admin modals)
- `/components/user/*.tsx` (user modals)

## 💡 Tips:

1. **Primary button:** `bg-[#FF2E63]` with white text
2. **Secondary button:** `bg-[#08D9D6]` with dark text
3. **Wallet/Balance:** Cyan color `#08D9D6`
4. **Admin sidebar:** `bg-[#252A34]` với active `#FF2E63`
5. **Links:** `text-[#FF2E63]` hover `text-[#08D9D6]`

## 🎨 Color psychology:

- **Cyan (#08D9D6):** Trust, technology, freshness
- **Pink (#FF2E63):** Energy, excitement, action
- **Dark (#252A34):** Professional, modern, serious
- **Light (#EAEAEA):** Clean, minimal, spacious

Website giờ có tone màu hiện đại và năng động hơn! 🚀
