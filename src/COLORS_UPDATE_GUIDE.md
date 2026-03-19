# Hướng dẫn Cập nhật Màu Sắc Website

## 🎨 Màu mới (Đỏ - Tím - Navy):
- **#FF204E** - Đỏ sáng (Primary - Màu chủ đạo)
- **#A0153E** - Đỏ đậm (Secondary)
- **#5D0E41** - Tím đỏ (Dark)
- **#00224D** - Xanh navy đậm (Navy - Sidebar)

## 📊 Schema màu:
```
Xanh navy → Tím đỏ → Đỏ đậm → Đỏ sáng
#00224D → #5D0E41 → #A0153E → #FF204E
(Sidebar)  (Dark)   (Secondary) (Primary)
```

## 🔄 Bảng chuyển đổi màu:

### Gradients:
```
from-purple-600 to-blue-600                    → from-[#5D0E41] to-[#FF204E]
from-[#27005D] to-[#9400FF]                    → from-[#5D0E41] to-[#FF204E]
hover:from-purple-700 hover:to-blue-700        → hover:from-[#5D0E41] hover:to-[#A0153E]
```

### Text Colors:
```
text-purple-600, text-[#9400FF]     → text-[#FF204E]
text-purple-700                     → text-[#5D0E41]
text-purple-500                     → text-[#FF204E]
text-purple-100, text-[#E4F1FF]     → text-[#ffccd5]
text-purple-200, text-[#AED2FF]     → text-[#ffccd5]
text-blue-600                       → text-[#A0153E]
```

### Background Colors:
```
bg-purple-600, bg-[#9400FF]         → bg-[#FF204E]
bg-purple-700                       → bg-[#5D0E41]
bg-purple-100, bg-[#E4F1FF]         → bg-[#fff5f7]
bg-purple-50                        → bg-[#fff5f7]
bg-blue-600                         → bg-[#A0153E]
```

### Border Colors:
```
border-purple-600, border-[#9400FF] → border-[#FF204E]
border-purple-500                   → border-[#FF204E]
border-purple-200, border-[#AED2FF] → border-[#A0153E]
```

### Hover States:
```
hover:text-purple-200, hover:text-[#AED2FF]  → hover:text-[#ffccd5]
hover:bg-purple-50, hover:bg-[#E4F1FF]       → hover:bg-[#fff5f7]
hover:bg-purple-100                          → hover:bg-[#fff5f7]
```

### Focus/Ring Colors:
```
focus:ring-purple-500, focus:ring-[#9400FF]  → focus:ring-[#FF204E]
ring-purple-500                              → ring-[#FF204E]
```

## ✅ Đã cập nhật:
✅ /styles/globals.css - CSS Variables với màu mới
✅ /components/Header.tsx - Gradient đỏ-tím & xóa search bar
✅ /utils/colors.ts - Color constants mới

## 🎯 Áp dụng tự động:
Do đã update CSS variables, các phần sau sẽ tự động thay đổi:
- ✅ **Sidebar admin** → #00224D (navy đậm)
- ✅ **Primary buttons** → #FF204E (đỏ sáng)
- ✅ **Input backgrounds** → #fff5f7 (hồng nhạt)
- ✅ **Accent colors** → #A0153E (đỏ đậm)
- ✅ **Hover states** → #ffccd5 (hồng pastel)

## 📝 Các file cần kiểm tra thêm:

Sử dụng Find & Replace (Ctrl/Cmd + Shift + H) trong VS Code với scope `**/*.tsx`:

1. `from-[#27005D] to-[#9400FF]` → `from-[#5D0E41] to-[#FF204E]`
2. `text-[#9400FF]` → `text-[#FF204E]`
3. `text-[#E4F1FF]` → `text-[#ffccd5]`
4. `text-[#AED2FF]` → `text-[#ffccd5]`
5. `bg-[#9400FF]` → `bg-[#FF204E]`
6. `bg-[#E4F1FF]` → `bg-[#fff5f7]`
7. `border-[#9400FF]` → `border-[#FF204E]`
8. `hover:text-[#AED2FF]` → `hover:text-[#ffccd5]`
9. `hover:bg-[#E4F1FF]` → `hover:bg-[#fff5f7]`

## 🔴 Thay đổi lớn:
- ❌ **Đã xóa thanh tìm kiếm** khỏi Header (cả desktop và mobile)
- ✅ **Navbar gọn hơn** - Chỉ còn Logo + Menu + User Actions
- ✅ **Màu sắc mạnh mẽ hơn** - Từ tím-xanh sang đỏ-tím-navy
