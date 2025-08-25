# Server Actions với NextJS + Prisma Setup - ART EXHIBITION

## Tổng quan

Dự án ART EXHIBITION đã được setup với Server Actions pattern sử dụng NextJS và Prisma để thực hiện các database operations một cách hiệu quả và type-safe. Ứng dụng chuyên về e-commerce nghệ thuật với các tính năng quản lý sản phẩm tranh, đơn hàng, và blog nghệ thuật.

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
│       ├── post-actions.ts   # Blog post CRUD operations
│       ├── product-actions.ts # Art product CRUD operations
│       └── order-actions.ts   # Order management operations
├── pages/
│   └── api/
│       ├── users/           # API routes cho user management
│       ├── posts/           # API routes cho blog posts
│       ├── products/        # API routes cho art products
│       └── orders/          # API routes cho orders
├── components/
│   ├── UserForm.tsx         # Form component cho user operations
│   ├── ProductForm.tsx      # Form component cho art products
│   └── OrderForm.tsx        # Form component cho orders
└── pages/
    ├── products-admin/      # Admin pages cho product management
    ├── order-admin/         # Admin pages cho order management
    └── dashboard/           # Admin dashboard
```

## Setup Database

1. **Cập nhật file `.env`** với database URL của bạn:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/art_exhibition_db?schema=public"
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

#### Post Actions (Blog nghệ thuật):
- `createPost(formData)` - Tạo bài viết nghệ thuật mới
- `getPosts(published?)` - Lấy danh sách bài viết
- `getPostById(id)` - Lấy bài viết theo ID
- `updatePost(id, formData)` - Cập nhật bài viết
- `deletePost(id)` - Xóa bài viết
- `togglePostPublication(id)` - Toggle publish status

#### Product Actions (Sản phẩm nghệ thuật):
- `createProduct(formData)` - Tạo sản phẩm tranh mới
- `getProducts(filters?)` - Lấy danh sách sản phẩm với bộ lọc
- `getProductById(id)` - Lấy sản phẩm theo ID
- `getProductBySlug(slug)` - Lấy sản phẩm theo slug
- `updateProduct(id, formData)` - Cập nhật sản phẩm
- `deleteProduct(id)` - Xóa sản phẩm
- `toggleProductSale(id)` - Toggle trạng thái sale

#### Order Actions (Quản lý đơn hàng):
- `createOrder(formData)` - Tạo đơn hàng mới
- `getOrders(filters?)` - Lấy danh sách đơn hàng
- `getOrderById(id)` - Lấy đơn hàng theo ID
- `updateOrderStatus(id, status)` - Cập nhật trạng thái đơn hàng
- `deleteOrder(id)` - Xóa đơn hàng

### 3. API Routes

API routes trong `pages/api/` sử dụng server actions:

```typescript
// pages/api/products/index.ts
import { createProduct, getProducts } from '../../../utils/actions/product-actions';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const result = await getProducts(req.query);
      return res.json(result.data);
    case 'POST':
      const product = await createProduct(req.body);
      return res.json(product);
  }
}
```

### 4. Frontend Usage

Sử dụng API routes từ frontend:

```typescript
// Tạo sản phẩm tranh mới
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    name, description, originalPrice, salePrice, 
    imageUrls, categories, colors, sizes 
  })
});

// Lấy danh sách sản phẩm với bộ lọc
const response = await fetch('/api/products?category=abstract&color=blue');
const products = await response.json();

// Tạo đơn hàng mới
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName, customerPhone, customerEmail,
    shippingAddress, items, total, paymentMethod
  })
});
```

## Features

### ✅ Đã implement:

1. **Database Models**: User, Post, Product, Order, Category, Size, Color với relationships
2. **Server Actions**: CRUD operations cho tất cả models nghệ thuật
3. **API Routes**: RESTful endpoints sử dụng server actions
4. **Error Handling**: Proper error handling và user feedback
5. **Type Safety**: TypeScript types cho tất cả operations
6. **Form Handling**: React forms với Ant Design
7. **Admin Dashboard**: Complete admin panel cho quản lý nghệ thuật
8. **E-commerce Features**: Product catalog, shopping cart, order management
9. **Image Management**: Upload và quản lý hình ảnh tranh nghệ thuật
10. **Blog System**: Hệ thống blog về nghệ thuật và trang trí nội thất

### 🔄 Revalidation

Server actions sử dụng `revalidateTag()` để tự động refresh data sau mutations:

```typescript
import { revalidateTag } from 'next/cache';

export async function createProduct(formData: FormData) {
  // ... create product logic
  revalidateTag('products'); // Revalidate products data
  return { success: true, data: product };
}
```

## Testing

1. **Truy cập admin dashboard**: `http://localhost:3000/dashboard`
2. **Test Product Management**: `http://localhost:3000/products-admin`
3. **Test Order Management**: `http://localhost:3000/order-admin`
4. **Test Blog Management**: `http://localhost:3000/blog-admin`
5. **Test User Management**: `http://localhost:3000/users`
6. **Test Public Pages**: 
   - Products: `http://localhost:3000/products`
   - Blog: `http://localhost:3000/blog`
   - Cart: `http://localhost:3000/cart-checkout`

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
npm run dev

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

Dự án bao gồm các models chính cho ứng dụng e-commerce nghệ thuật:

### User Model
```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  avatar    String?
  password  String    // Hashed password
  role      String    @default("user") // Default role is 'user'
  isActive  Boolean   @default(true)
  lastLogin DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  posts     Post[]
  orders    Order[]
}
```

### Product Model (Sản phẩm nghệ thuật)
```prisma
model Product {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  description   String
  originalPrice Int
  salePrice     Int
  rating        Float    @default(0)
  reviewCount   Int      @default(0)
  isOnSale      Boolean  @default(false)
  thumbnailUrl  String?
  imageUrls     String[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  sizes      ProductSize[]
  colors     ProductColor[]
  categories ProductCategory[]
  orderItems OrderItem[]
}
```

### Order Model (Đơn hàng)
```prisma
model Order {
  id          String @id @default(cuid())
  orderNumber String @unique
  status      String @default("pending") // pending, confirmed, shipped, delivered, cancelled

  // Customer info
  customerName  String
  customerPhone String
  customerEmail String?

  // Shipping address
  shippingAddress String

  // Order summary
  subtotal           Int
  discount           Int
  discountPercentage Int @default(0)
  shippingFee        Int
  total              Int

  // Payment & shipping method
  shippingMethod String // standard, express
  paymentMethod  String // cod, online
  paymentStatus  String @default("pending") // pending, paid, failed

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  userId String?
  user   User?       @relation(fields: [userId], references: [id])
  items  OrderItem[]
}
```

### Post Model (Blog nghệ thuật)
```prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  description String?
  content     String?
  image       String? // URL or path to uploaded image
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
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