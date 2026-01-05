# Hướng dẫn Setup Gieo Duyên App

## 1. Khởi động MongoDB Container

Khởi động MongoDB container đã có sẵn:

```bash
docker start mongodb
```

Nếu container chưa tồn tại, tạo mới với:

```bash
docker run -d \
  --name mongodb \
  --network dev-net \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:7.0
```

## 2. Setup Environment Variables

Chạy script để tự động tạo file `.env.local`:

```bash
cd apps/gieoduyen
bash setup-env.sh
```

Hoặc tạo thủ công file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

File `.env.local` sẽ chứa:
```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/gieoduyen?authSource=admin
```

## 3. Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 4. Đăng nhập

Truy cập `/login` và sử dụng credentials:

- **Admin:** `admin` / `admin123`
- **User:** `user` / `user123`

## 5. Cấu trúc Routes

### Admin Routes (Yêu cầu đăng nhập admin)
- `/admin/templates` - Danh sách templates (admin)
- `/admin/templates/[slug]` - Chỉnh sửa template

### User Routes
- `/templates` - Danh sách templates (public)
- `/templates/[slug]` - Preview template
- `/[username]/[userPageId]` - Trang cá nhân của user
- `/[username]/[userPageId]/edit` - Chỉnh sửa trang cá nhân (yêu cầu đăng nhập)

### Public Routes
- `/login` - Trang đăng nhập
- `/` - Trang chủ

## 6. Sử dụng

### Tạo Template (Admin)
1. Đăng nhập với tài khoản admin (`admin` / `admin123`)
2. Vào `/admin/templates`
3. Click "Tạo Template Mới"
4. Điền tên, slug, mô tả
5. Sử dụng Puck Editor để tạo nội dung
6. Click "Lưu Template"

### Xem Templates (Public)
1. Truy cập `/templates` để xem danh sách
2. Click vào template để preview

### Tạo User Page
1. Đăng nhập với tài khoản user (`user` / `user123`)
2. Truy cập `/[username]/[userPageId]` để xem hoặc tạo trang
3. Thêm `/edit` vào URL để chỉnh sửa

## 7. API Endpoints

### Admin APIs
- `GET /api/admin/templates` - Lấy danh sách templates
- `POST /api/admin/templates` - Tạo template mới
- `GET /api/admin/templates/[slug]` - Lấy template theo slug
- `PUT /api/admin/templates/[slug]` - Cập nhật template
- `DELETE /api/admin/templates/[slug]` - Xóa template

### Public APIs
- `GET /api/templates` - Lấy danh sách templates (chỉ active)
- `GET /api/templates/[slug]` - Lấy template theo slug (chỉ active)
- `GET /api/user-pages/[username]/[userPageId]` - Lấy user page
- `POST /api/user-pages/my/[userPageId]` - Tạo/cập nhật user page của mình
- `GET /api/user-pages/my/[userPageId]` - Lấy user page của mình

### Authentication
- `POST /api/login` - Đăng nhập

## 8. Tạo Blocks Mới

Puck Editor cho phép bạn tạo các blocks (components) tùy chỉnh để sử dụng trong editor. Tham khảo [Component Configuration](https://puckeditor.com/docs/integrating-puck/component-configuration) để biết thêm chi tiết.

### Cấu trúc Block

Mỗi block được tổ chức trong thư mục `config/blocks/[BlockName]/` với các file:

- `index.tsx` - Component configuration và export
- `[BlockName].tsx` (optional) - Component implementation riêng
- `styles.module.css` - Styles cho block

### Các bước tạo Block mới

#### Bước 1: Tạo thư mục và file cơ bản

```bash
mkdir -p config/blocks/MyNewBlock
touch config/blocks/MyNewBlock/index.tsx
touch config/blocks/MyNewBlock/styles.module.css
```

#### Bước 2: Định nghĩa Props Type và Component Config

Tạo file `config/blocks/MyNewBlock/index.tsx`:

```typescript
import { ComponentConfig } from "@/core/types";
import styles from "./styles.module.css";
import { getClassNameFactory } from "@/core/lib";
import { Section } from "../../components/Section";

const getClassName = getClassNameFactory("MyNewBlock", styles);

// Định nghĩa props type
export type MyNewBlockProps = {
  title: string;
  description?: string;
  padding: string;
};

// Component configuration
export const MyNewBlock: ComponentConfig<MyNewBlockProps> = {
  // Fields hiển thị trong editor sidebar
  fields: {
    title: {
      type: "text",
      label: "Title",
    },
    description: {
      type: "textarea",
      label: "Description",
    },
    padding: {
      type: "select",
      label: "Padding",
      options: [
        { label: "64px", value: "64px" },
        { label: "96px", value: "96px" },
        { label: "128px", value: "128px" },
      ],
    },
  },
  // Giá trị mặc định khi thêm block mới
  defaultProps: {
    title: "My New Block",
    description: "Default description",
    padding: "96px",
  },
  // Render function
  render: ({ title, description, padding }) => {
    return (
      <Section
        className={getClassName()}
        style={{ paddingTop: padding, paddingBottom: padding }}
      >
        <div className={getClassName("inner")}>
          <h2 className={getClassName("title")}>{title}</h2>
          {description && (
            <p className={getClassName("description")}>{description}</p>
          )}
        </div>
      </Section>
    );
  },
};

export default MyNewBlock;
```

#### Bước 3: Tạo CSS Module

Tạo file `config/blocks/MyNewBlock/styles.module.css`:

```css
.MyNewBlock {
  /* Container styles */
}

.MyNewBlock__inner {
  max-width: 1200px;
  margin: 0 auto;
}

.MyNewBlock__title {
  font-size: 2rem;
  font-weight: bold;
}

.MyNewBlock__description {
  font-size: 1rem;
  color: #666;
}
```

#### Bước 4: Đăng ký Block trong Config

Cập nhật `config/index.tsx`:

```typescript
import { MyNewBlock } from "./blocks/MyNewBlock";

export const conf: UserConfig = {
  // ... existing code
  categories: {
    // ... existing categories
    custom: {
      title: "Custom Blocks",
      components: ["MyNewBlock"],
    },
  },
  components: {
    // ... existing components
    MyNewBlock,
  },
};
```

#### Bước 5: Cập nhật Types

Cập nhật `config/types.ts`:

```typescript
import { MyNewBlockProps } from "./blocks/MyNewBlock";

export type Components = {
  // ... existing components
  MyNewBlock: MyNewBlockProps;
};
```

### Các Field Types phổ biến

Puck hỗ trợ nhiều field types, xem [Fields API Reference](https://puckeditor.com/docs/api-reference/fields):

- `text` - Text input
- `textarea` - Multi-line text
- `number` - Number input
- `select` - Dropdown select
- `radio` - Radio buttons
- `array` - Array of items
- `object` - Nested object
- `custom` - Custom field component

### Ví dụ với Array Field

```typescript
fields: {
  items: {
    type: "array",
    label: "Items",
    arrayFields: {
      title: {
        type: "text",
        label: "Item Title",
      },
      image: {
        type: "text",
        label: "Image URL",
      },
    },
  },
}
```

### Ví dụ với Object Field

```typescript
fields: {
  settings: {
    type: "object",
    label: "Settings",
    objectFields: {
      backgroundColor: {
        type: "text",
        label: "Background Color",
      },
      textColor: {
        type: "text",
        label: "Text Color",
      },
    },
  },
}
```

### Tài liệu tham khảo

- [Component Configuration](https://puckeditor.com/docs/integrating-puck/component-configuration) - Hướng dẫn chi tiết về cấu hình components
- [Fields API](https://puckeditor.com/docs/api-reference/fields) - Tất cả field types có sẵn
- [Dynamic Props](https://puckeditor.com/docs/integrating-puck/dynamic-props) - Tạo props động dựa trên user input
- [Custom Fields](https://puckeditor.com/docs/extending-puck/custom-fields) - Tạo custom field components

## 9. Database Schema

### Template Model
```typescript
{
  name: string;
  slug: string; // unique
  description?: string;
  initialData: any; // Puck Data
  thumbnail?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### UserPage Model
```typescript
{
  username: string;
  userPageId: string;
  data: any; // Puck Data
  createdAt: Date;
  updatedAt: Date;
}
```

