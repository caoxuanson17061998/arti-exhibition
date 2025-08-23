# Server Actions với NextJS + Prisma Setup

## Tổng quan

Dự án này đã được setup với Server Actions pattern sử dụng NextJS và Prisma để thực hiện các database operations một cách hiệu quả và type-safe.

## Cấu trúc thư mục

```
├── prisma/
│   └── schema.prisma          # Prisma schema định nghĩa database models
├── generated/
│   └── prisma/               # Generated Prisma client
├── utils/
│   ├── db.ts                 # Database connection utility
│   └── actions/
│       ├── user-actions.ts   # User CRUD operations
│       └── post-actions.ts   # Post CRUD operations
├── pages/
│   └── api/
│       ├── users/           # API routes cho users
│       └── posts/           # API routes cho posts
├── components/
│   └── UserForm.tsx         # Form component cho user operations
└── pages/demo/
    └── server-actions.tsx   # Demo page
```

## Setup Database

1. **Cập nhật file `.env`** với database URL của bạn:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/hanoscent_db?schema=public"
```

2. **Chạy migration để tạo database**:
```bash
npx prisma db push
```

3. **Generate Prisma client**:
```bash
npx prisma generate
```

## Cách sử dụng Server Actions

### 1. Database Connection

File `utils/db.ts` cung cấp singleton Prisma client:

```typescript
import prisma from '../utils/db';

// Sử dụng prisma client
const users = await prisma.user.findMany();
```

### 2. Server Actions

Các server actions được định nghĩa trong `utils/actions/`:

#### User Actions:
- `createUser(formData)` - Tạo user mới
- `getUsers()` - Lấy danh sách users
- `getUserById(id)` - Lấy user theo ID
- `updateUser(id, formData)` - Cập nhật user
- `deleteUser(id)` - Xóa user

#### Post Actions:
- `createPost(formData)` - Tạo post mới
- `getPosts(published?)` - Lấy danh sách posts
- `getPostById(id)` - Lấy post theo ID
- `updatePost(id, formData)` - Cập nhật post
- `deletePost(id)` - Xóa post
- `togglePostPublication(id)` - Toggle publish status

### 3. API Routes

API routes trong `pages/api/` sử dụng server actions:

```typescript
// pages/api/users/index.ts
import { createUser, getUsers } from '../../../utils/actions/user-actions';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const result = await getUsers();
      return res.json(result.data);
    case 'POST':
      // Handle POST request
  }
}
```

### 4. Frontend Usage

Sử dụng API routes từ frontend:

```typescript
// Tạo user mới
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, name, avatar })
});

// Lấy danh sách users
const response = await fetch('/api/users');
const users = await response.json();
```

## Features

### ✅ Đã implement:

1. **Database Models**: User, Post, Category với relationships
2. **Server Actions**: CRUD operations cho tất cả models
3. **API Routes**: RESTful endpoints sử dụng server actions
4. **Error Handling**: Proper error handling và user feedback
5. **Type Safety**: TypeScript types cho tất cả operations
6. **Form Handling**: React forms với Ant Design
7. **Demo Page**: Complete demo với user management

### 🔄 Revalidation

Server actions sử dụng `revalidateTag()` để tự động refresh data sau mutations:

```typescript
import { revalidateTag } from 'next/cache';

export async function createUser(formData: FormData) {
  // ... create user logic
  revalidateTag('users'); // Revalidate users data
  return { success: true, data: user };
}
```

## Testing

1. **Truy cập demo page**: `http://localhost:3000/demo/server-actions`
2. **Test CRUD operations**: Create, Read, Update, Delete users
3. **Test error handling**: Thử các invalid inputs
4. **Test API endpoints**: Sử dụng Postman hoặc curl
5. **Test Authentication**: `http://localhost:3000/demo/auth-demo`
6. **Test Font Configuration**: `http://localhost:3000/demo/font-demo`

## Authentication Features

### ✅ Đã implement:

1. **User Registration**: Tạo tài khoản mới với email, password, name
2. **User Login**: Đăng nhập với email và password
3. **Password Hashing**: Sử dụng bcryptjs để hash password
4. **JWT Tokens**: Generate và verify JWT tokens
5. **Token Storage**: Lưu token trong localStorage
6. **Authentication Utils**: Utility functions cho auth management
7. **Auth API Routes**: RESTful endpoints cho authentication

### Authentication API Endpoints:

- **POST /api/auth/login** - Đăng nhập
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **POST /api/auth/register** - Đăng ký
  ```json
  {
    "email": "user@example.com", 
    "password": "password123",
    "name": "User Name"
  }
  ```

- **POST /api/auth/verify** - Xác thực token
  ```json
  {
    "token": "jwt-token-here"
  }
  ```

## Các Commands hữu ích

```bash
# Chạy development server
yarn dev

# Generate Prisma client sau khi thay đổi schema
npx prisma generate

# Push schema changes to database
npx prisma db push

# Reset database
npx prisma db push --force-reset

# Open Prisma Studio để xem data
npx prisma studio
```

## Database Schema

Dự án bao gồm 3 models chính:

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}
```

### Post Model
```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}
```

### Category Model
```prisma
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Lưu ý quan trọng

1. **Environment Variables**: Đảm bảo `.env` file được setup đúng
2. **Database Connection**: Kiểm tra database đang chạy
3. **Prisma Generate**: Chạy `npx prisma generate` sau mỗi schema change
4. **Error Handling**: Tất cả server actions đều có proper error handling
5. **Type Safety**: Sử dụng generated Prisma types cho type safety

## Troubleshooting

### Database Connection Error
```bash
# Kiểm tra database URL trong .env
# Đảm bảo database đang chạy
# Chạy lại prisma generate
```

### Prisma Client Error
```bash
# Regenerate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### API Route Errors
- Kiểm tra console logs cho detailed error messages
- Đảm bảo proper request format
- Verify API route paths

## Font Configuration

### ✅ Red Rose Font Setup:

1. **Font Source**: [Red Rose từ Google Fonts](https://fonts.google.com/specimen/Red+Rose)
2. **Next.js Optimization**: Sử dụng `@next/font/google` cho optimal loading
3. **Global Application**: Font được áp dụng global cho toàn bộ ứng dụng
4. **Tailwind Integration**: Cấu hình trong Tailwind config với fallback fonts
5. **Performance**: Font được preload trong HeaderMeta component

### Font Weights Available:
- Light (300)
- Regular (400) 
- Medium (500)
- Semi-Bold (600)
- Bold (700)

### Usage Examples:

#### Tailwind CSS Classes:
```html
<!-- Sử dụng Red Rose font -->
<div className="font-red-rose text-xl font-semibold">
  Your text here
</div>

<!-- Default sans-serif (đã được set thành Red Rose) -->
<div className="font-sans text-lg">
  Your text here
</div>
```

#### CSS Styles:
```css
/* Font family đã được set global */
.custom-text {
  font-family: 'Red Rose', system-ui, arial, sans-serif;
  font-weight: 500;
}
```

### Files Modified:
- `styles/fonts.ts` - Font configuration với Next.js
- `pages/_app.tsx` - Global font application
- `tailwind.config.js` - Tailwind font family setup
- `styles/_app.scss` - Global CSS font rules
- `components/HeaderMeta/index.tsx` - Font preloading 