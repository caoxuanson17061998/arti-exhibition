# 🕯️ HANOSCENT - Ứng dụng E-commerce Nến Thơm

HANOSCENT là một ứng dụng thương mại điện tử chuyên bán nến thơm với tính năng thiết kế tùy chỉnh độc đáo. Ứng dụng được xây dựng với Next.js, TypeScript, và các công nghệ hiện đại.

## 🌟 Tính năng chính

### 🛒 **E-commerce Core**

- **Catalog sản phẩm**: Duyệt và tìm kiếm nến thơm theo danh mục, màu sắc, mùi hương
- **Chi tiết sản phẩm**: Thông tin đầy đủ về nguyên liệu, cách sử dụng, thời gian cháy
- **Giỏ hàng thông minh**: Quản lý sản phẩm, tính toán tự động
- **Thanh toán đa kênh**: COD, chuyển khoản online, VietQR
- **Quản lý đơn hàng**: Theo dõi trạng thái từ đặt hàng đến giao hàng

### 🎨 **Your Design - Thiết kế nến tùy chỉnh**

- **Bước 1**: Chọn màu sắc nến từ bảng màu đa dạng
- **Bước 2**: Tùy chọn mùi hương (có thể chọn nhiều mùi)
- **Bước 3**: Thiết kế nhãn với text tùy chỉnh và upload logo
- **Bước 4**: Xem trước và xác nhận đơn hàng
- **Tính giá động**: Tự động tính toán dựa trên tùy chọn

### 👨‍💼 **Hệ thống quản trị Admin**

- **Dashboard**: Thống kê doanh thu, đơn hàng, sản phẩm bán chạy
- **Quản lý sản phẩm**: CRUD sản phẩm, danh mục, màu sắc, mùi hương
- **Quản lý đơn hàng**: Theo dõi, cập nhật trạng thái đơn hàng
- **Quản lý blog**: Tạo và chỉnh sửa bài viết với CKEditor
- **Quản lý người dùng**: Phân quyền, quản lý tài khoản

### 📱 **Trải nghiệm người dùng**

- **Responsive Design**: Tối ưu cho mọi thiết bị
- **Đa ngôn ngữ**: Tiếng Việt và Tiếng Anh
- **PWA Ready**: Có thể cài đặt như ứng dụng mobile
- **Loading tối ưu**: Server-side rendering với Next.js

### 📝 **Nội dung & Thông tin**

- **Blog**: Chia sẻ kiến thức về nến thơm, aromatherapy
- **Trang từ thiện**: Giới thiệu hoạt động xã hội
- **Chính sách**: Bảo mật, đổi trả, điều khoản sử dụng

## 🛠️ Công nghệ sử dụng

### **Frontend**

- **Next.js 13**: Framework React với SSR/SSG
- **TypeScript**: Type safety và developer experience
- **TailwindCSS**: Utility-first CSS framework
- **SCSS**: CSS preprocessing
- **Ant Design**: Component library chính
- **Material-UI**: Bổ sung component

### **Backend & Database**

- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Modern database toolkit và ORM
- **PostgreSQL**: Relational database
- **JWT**: Authentication và authorization

### **State Management & Forms**

- **Redux Toolkit**: Centralized state management
- **Redux Persist**: Persist state across sessions
- **React Hook Form**: Performant form library
- **Yup**: Schema validation

### **Development & Tools**

- **ESLint + Prettier**: Code formatting và linting
- **Husky**: Git hooks
- **TypeScript**: Static type checking
- **Chart.js**: Data visualization cho dashboard

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm/yarn**: Package manager
- **PostgreSQL**: >= 13.0
- **Git**: Version control

## 🚀 Hướng dẫn cài đặt

### **1. Clone repository**

```bash
git clone <repository-url>
cd hanoscent-fe
```

### **2. Cài đặt dependencies**

```bash
# Sử dụng yarn (khuyến nghị)
yarn bootstrap

# Hoặc sử dụng npm
npm install
```

### **3. Cấu hình environment**

```bash
# Copy file environment mẫu
cp .env.development .env.development.local

# Chỉnh sửa file .env.development.local
nano .env.development.local
```

**Cấu hình cần thiết:**

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hanoscent_db"

```

### **4. Thiết lập Database**

```bash
# Generate Prisma client
yarn db:generate

# Push schema to database
yarn db:push

# (Tùy chọn) Mở Prisma Studio để quản lý DB
yarn db:studio
```

### **5. Chạy ứng dụng**

**Development mode:**

```bash
yarn dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

**Production mode:**

```bash
# Build ứng dụng
yarn build

# Chạy production server
yarn start
```

** Được phát triển với ❤️ bởi HANOSCENT Team **
