# 🌐 Đa ngôn ngữ (i18n) - SkillBridge Platform

## 📋 Tổng quan

Hệ thống SkillBridge đã được tích hợp tính năng đa ngôn ngữ, hỗ trợ:
- 🇺🇸 **Tiếng Anh (English)** - Ngôn ngữ mặc định
- 🇯🇵 **Tiếng Nhật (日本語)** - Ngôn ngữ thứ hai

## 🚀 Cách sử dụng

### 1. Chuyển đổi ngôn ngữ
- Click vào **Language Switcher** ở góc phải header
- Chọn ngôn ngữ mong muốn: English hoặc 日本語
- Ngôn ngữ sẽ được lưu trong localStorage

### 2. Các trang hỗ trợ đa ngôn ngữ
- ✅ **Services Page** (`/services`) - Đầy đủ tính năng
- 🔄 **Homepage** - Đang phát triển
- 🔄 **Engineers Page** - Đang phát triển
- 🔄 **Contact Page** - Đang phát triển

## 🛠️ Cấu trúc kỹ thuật

### Files chính:
```
frontend/src/
├── contexts/
│   └── LanguageContext.tsx     # Context quản lý ngôn ngữ
├── components/
│   └── LanguageSwitcher.tsx    # Component chuyển đổi ngôn ngữ
└── app/
    └── services/
        └── page.tsx            # Services page với i18n
```

### Cách thêm ngôn ngữ mới:

1. **Cập nhật LanguageContext.tsx:**
```typescript
// Thêm ngôn ngữ mới vào type
type Language = 'en' | 'ja' | 'vi'; // Thêm 'vi' cho tiếng Việt

// Thêm translations
const translations = {
  en: { /* existing translations */ },
  ja: { /* existing translations */ },
  vi: { /* Vietnamese translations */ }
};
```

2. **Cập nhật LanguageSwitcher.tsx:**
```typescript
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' } // Thêm dòng này
];
```

## 📝 Cách thêm nội dung đa ngôn ngữ

### 1. Thêm key mới vào translations:
```typescript
// Trong LanguageContext.tsx
const translations = {
  en: {
    'new.section.title': 'New Section Title',
    'new.section.description': 'New section description...'
  },
  ja: {
    'new.section.title': '新しいセクションタイトル',
    'new.section.description': '新しいセクションの説明...'
  }
};
```

### 2. Sử dụng trong component:
```typescript
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('new.section.title')}</h1>
      <p>{t('new.section.description')}</p>
    </div>
  );
}
```

## 🎯 Tính năng hiện tại

### ✅ Đã hoàn thành:
- [x] Language Context với React Context API
- [x] Language Switcher component
- [x] Services page đầy đủ đa ngôn ngữ
- [x] Lưu trữ ngôn ngữ trong localStorage
- [x] Responsive design cho mobile/desktop

### 🔄 Đang phát triển:
- [ ] Homepage đa ngôn ngữ
- [ ] Engineers page đa ngôn ngữ
- [ ] Contact page đa ngôn ngữ
- [ ] Admin panel đa ngôn ngữ

### 🚀 Kế hoạch tương lai:
- [ ] URL routing với ngôn ngữ (`/en/services`, `/ja/services`)
- [ ] SEO optimization cho đa ngôn ngữ
- [ ] RTL support cho các ngôn ngữ khác
- [ ] Dynamic content loading

## 🧪 Testing

### Cách test:
1. **Chạy development server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Truy cập Services page:**
   - URL: `http://localhost:3000/services`
   - Test chuyển đổi ngôn ngữ
   - Kiểm tra nội dung hiển thị đúng

3. **Kiểm tra localStorage:**
   - Mở Developer Tools
   - Vào Application > Local Storage
   - Kiểm tra key `language` được lưu

## 📱 Responsive Design

- **Desktop**: Hiển thị đầy đủ tên ngôn ngữ và flag
- **Mobile**: Chỉ hiển thị flag để tiết kiệm không gian
- **Tablet**: Tự động điều chỉnh theo kích thước màn hình

## 🔧 Troubleshooting

### Lỗi thường gặp:

1. **"useLanguage must be used within a LanguageProvider"**
   - Đảm bảo component được wrap trong `<LanguageProvider>`
   - Kiểm tra layout.tsx có import đúng

2. **Translation không hiển thị**
   - Kiểm tra key trong translations object
   - Đảm bảo key được định nghĩa cho cả 2 ngôn ngữ

3. **Language switcher không hoạt động**
   - Kiểm tra localStorage có được enable
   - Kiểm tra browser có hỗ trợ localStorage

## 📞 Hỗ trợ

Nếu gặp vấn đề với tính năng đa ngôn ngữ:
1. Kiểm tra console errors
2. Kiểm tra localStorage
3. Liên hệ team development để được hỗ trợ

---

**Happy Coding! 🌐🎉**


