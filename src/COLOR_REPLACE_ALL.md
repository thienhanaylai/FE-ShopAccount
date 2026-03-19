# Thay đổi toàn bộ màu sắc website

## ✅ Đã cập nhật CSS & Components chính:
- /styles/globals.css ✅
- /utils/colors.ts ✅
- /components/Header.tsx ✅ (đã xóa search bar)
- /components/GameAccountCard.tsx ✅
- /components/FilterSidebar.tsx ✅  
- /components/Banner.tsx ✅
- /components/AdminSidebar.tsx ✅

## 🔧 Sử dụng Find & Replace trong VS Code:

**Bước 1: Mở Find & Replace (Ctrl/Cmd + Shift + H)**

**Bước 2: Thay thế từng pattern sau (theo thứ tự):**

### Gradients:
1. Find: `from-purple-600 to-blue-600`
   Replace: `from-[#5D0E41] to-[#FF204E]`
   
2. Find: `hover:from-purple-700 hover:to-blue-700`
   Replace: `hover:from-[#5D0E41] hover:to-[#A0153E]`

3. Find: `from-purple-600 via-blue-600 to-purple-600`
   Replace: `from-[#5D0E41] via-[#FF204E] to-[#A0153E]`

### Text Colors:
4. Find: `text-purple-600`
   Replace: `text-[#FF204E]`

5. Find: `text-purple-700`
   Replace: `text-[#5D0E41]`

6. Find: `text-purple-500`
   Replace: `text-[#FF204E]`

7. Find: `text-purple-100`
   Replace: `text-[#ffccd5]`

8. Find: `text-purple-200`
   Replace: `text-[#ffccd5]`

9. Find: `text-blue-600`
   Replace: `text-[#A0153E]`

10. Find: `text-blue-700`
    Replace: `text-[#00224D]`

11. Find: `text-blue-800`
    Replace: `text-[#00224D]`

### Background Colors:
12. Find: `bg-purple-600`
    Replace: `bg-[#FF204E]`

13. Find: `bg-purple-700`
    Replace: `bg-[#5D0E41]`

14. Find: `bg-purple-500`
    Replace: `bg-[#FF204E]`

15. Find: `bg-purple-100`
    Replace: `bg-[#ffebef]`

16. Find: `bg-purple-50`
    Replace: `bg-[#fff5f7]`

17. Find: `bg-blue-600`
    Replace: `bg-[#A0153E]`

18. Find: `bg-blue-700`
    Replace: `bg-[#00224D]`

19. Find: `bg-blue-100`
    Replace: `bg-[#ffebef]`

20. Find: `bg-blue-50`
    Replace: `bg-[#fff5f7]`

### Border Colors:
21. Find: `border-purple-600`
    Replace: `border-[#FF204E]`

22. Find: `border-purple-500`
    Replace: `border-[#FF204E]`

23. Find: `border-purple-200`
    Replace: `border-[#ffccd5]`

24. Find: `border-blue-600`
    Replace: `border-[#A0153E]`

25. Find: `border-blue-200`
    Replace: `border-[#E4F1FF]`

### Hover States:
26. Find: `hover:text-purple-200`
    Replace: `hover:text-[#ffccd5]`

27. Find: `hover:bg-purple-50`
    Replace: `hover:bg-[#fff5f7]`

28. Find: `hover:bg-purple-100`
    Replace: `hover:bg-[#ffebef]`

29. Find: `hover:bg-purple-200`
    Replace: `hover:bg-[#ffccd5]`

30. Find: `hover:bg-blue-50`
    Replace: `hover:bg-[#fff5f7]`

31. Find: `hover:bg-blue-200`
    Replace: `hover:bg-[#E4F1FF]`

32. Find: `hover:bg-blue-700`
    Replace: `hover:bg-[#00224D]`

### Focus/Ring Colors:
33. Find: `focus:ring-purple-500`
    Replace: `focus:ring-[#FF204E]`

34. Find: `ring-purple-500`
    Replace: `ring-[#FF204E]`

35. Find: `focus:ring-purple-300`
    Replace: `focus:ring-[#FF204E]`

### Gradients from/to:
36. Find: `from-purple-50 to-blue-50`
    Replace: `from-[#fff5f7] to-[#ffebef]`

37. Find: `from-blue-50 to-indigo-50`
    Replace: `from-[#fff5f7] to-[#ffebef]`

## 📁 Files sẽ được cập nhật:
- All `/pages/**/*.tsx` files
- All `/components/**/*.tsx` files  
- All `/pages/admin/**/*.tsx` files

## ⚠️ Lưu ý:
- Backup trước khi replace
- Kiểm tra preview trước khi Replace All
- Files trong scope: `**/*.tsx`
- Exclude: `node_modules/`, `.next/`, `dist/`

## 🎨 Kết quả mong đợi:
Toàn bộ website sẽ chuyển từ theme Tím-Xanh sang theme Đỏ-Tím-Navy mạnh mẽ hơn.
