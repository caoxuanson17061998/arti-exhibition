# 🎨 ART EXHIBITION - Ứng dụng E-commerce Nghệ thuật

ART EXHIBITION là một ứng dụng thương mại điện tử chuyên về triển lãm và bán các tác phẩm nghệ thuật, tranh trang trí và đồ nội thất nghệ thuật. Ứng dụng được xây dựng với Next.js, TypeScript, và các công nghệ hiện đại nhằm mang đến trải nghiệm mua sắm nghệ thuật tốt nhất.

## 🌟 Tính năng chính

### 🛒 **E-commerce Core**

- **Catalog sản phẩm**: Duyệt và tìm kiếm tranh nghệ thuật theo danh mục, màu sắc, phong cách, kích thước
- **Chi tiết sản phẩm**: Thông tin đầy đủ về chất liệu, kích thước, tác giả, cách bảo quản tranh
- **Giỏ hàng thông minh**: Quản lý sản phẩm nghệ thuật, tính toán giá cả tự động
- **Thanh toán đa kênh**: COD, chuyển khoản online, VietQR
- **Quản lý đơn hàng**: Theo dõi trạng thái từ đặt hàng đến giao hàng tận nơi

### 🎨 **Art Gallery - Triển lãm nghệ thuật**

- **Gallery Wall**: Tính năng tạo bộ sưu tập tranh cá nhân
- **Preview 3D**: Xem trước tranh trong không gian thực tế
- **Art Categories**: Phân loại theo phong cách: Abstract, Landscape, Portrait, Modern, Classic
- **Size Recommendations**: Gợi ý kích thước tranh phù hợp với không gian
- **Color Matching**: Tư vấn phối màu tranh với nội thất

### 👨‍💼 **Hệ thống quản trị Admin**

- **Dashboard**: Thống kê doanh thu, đơn hàng, tác phẩm bán chạy
- **Quản lý tác phẩm**: CRUD sản phẩm nghệ thuật, danh mục, màu sắc, kích thước
- **Quản lý đơn hàng**: Theo dõi, cập nhật trạng thái đơn hàng nghệ thuật
- **Quản lý blog**: Tạo và chỉnh sửa bài viết về nghệ thuật với CKEditor
- **Quản lý người dùng**: Phân quyền, quản lý tài khoản khách hàng và nghệ sĩ

### 📱 **Trải nghiệm người dùng**

- **Responsive Design**: Tối ưu cho mọi thiết bị, đặc biệt tối ưu cho việc xem tranh
- **Đa ngôn ngữ**: Tiếng Việt và Tiếng Anh
- **PWA Ready**: Có thể cài đặt như ứng dụng mobile để xem tranh mọi lúc
- **Loading tối ưu**: Server-side rendering với Next.js cho trải nghiệm mượt mà
- **Image Optimization**: Tối ưu hóa hình ảnh tranh với chất lượng cao

### 📝 **Nội dung & Thông tin nghệ thuật**

- **Art Blog**: Chia sẻ kiến thức về nghệ thuật, xu hướng trang trí nội thất
- **Artist Profiles**: Giới thiệu các nghệ sĩ và tác phẩm của họ
- **Art History**: Thông tin về lịch sử nghệ thuật và các trường phái hội họa
- **Interior Design Tips**: Hướng dẫn trang trí nội thất với tranh nghệ thuật
- **Chính sách**: Bảo mật, đổi trả, bảo hành tác phẩm nghệ thuật

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
- **npm**: Package manager
- **PostgreSQL**: >= 13.0
- **Git**: Version control

## 🚀 Hướng dẫn cài đặt

### **1. Clone repository**

```bash
git clone https://github.com/caoxuanson17061998/arti-exhibition.git
cd arti-exhibition
```

### **2. Cài đặt dependencies**

```bash
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
DATABASE_URL="postgresql://username:password@localhost:5432/art_exhibition_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# NextAuth Secret (nếu sử dụng NextAuth)
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Upload Configuration
UPLOAD_PATH="/public/uploads"
MAX_FILE_SIZE="10MB"

# Firebase (nếu sử dụng)
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
```

### **4. Thiết lập Database**

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Tùy chọn) Seed dữ liệu mẫu
npm run seed:all

# (Tùy chọn) Mở Prisma Studio để quản lý DB
npm run db:studio
```

### **5. Chạy ứng dụng**

**Development mode:**

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

**Production mode:**

```bash
# Build ứng dụng
npm run build

# Chạy production server
npm run start
```

## 🎯 Scripts có sẵn

### **Development Scripts**

- `npm run dev` - Chạy ứng dụng ở chế độ development
- `npm run build` - Build ứng dụng cho production
- `npm run start` - Chạy ứng dụng đã được build

### **Database Scripts**

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Mở Prisma Studio
- `npm run db:reset` - Reset database (chỉ sử dụng trong development)

### **Data Seeding Scripts**

- `npm run seed` - Seed dữ liệu cơ bản
- `npm run seed:colors` - Seed dữ liệu màu sắc
- `npm run seed:products` - Seed dữ liệu sản phẩm nghệ thuật
- `npm run seed:posts` - Seed dữ liệu blog nghệ thuật
- `npm run seed:all` - Seed toàn bộ dữ liệu mẫu

### **Code Quality Scripts**

- `npm run lint` - Kiểm tra linting
- `npm run lint:fix` - Tự động fix linting issues
- `npm run prettier` - Kiểm tra code formatting
- `npm run prettier:fix` - Tự động format code
- `npm run check-types` - Kiểm tra TypeScript types
- `npm run test-all` - Chạy tất cả các kiểm tra

## 📊 Cấu trúc dự án

```
arti-exhibition/
├── components/           # React components tái sử dụng
│   ├── common/          # Components dùng chung
│   ├── dashboard/       # Components cho admin dashboard
│   ├── Layout/          # Layout components
│   └── ...
├── pages/               # Next.js pages (App Router)
│   ├── api/            # API routes
│   ├── admin/          # Trang quản trị
│   └── ...
├── module/              # Feature modules
│   ├── products/       # Module sản phẩm nghệ thuật
│   ├── blog/           # Module blog nghệ thuật
│   └── ...
├── prisma/              # Database schema và migrations
├── public/              # Static assets
├── redux/               # State management
├── styles/              # SCSS styles
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🚀 Deployment

### **Vercel (Khuyên dùng)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Docker**

```bash
# Build image
docker-compose build

# Run containers
docker-compose up -d
```

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm thông tin.

## 📞 Liên hệ

- **GitHub**: [@caoxuanson17061998](https://github.com/caoxuanson17061998)
- **Email**: caoxuanson17061998@gmail.com

---

**🎨 Được phát triển với ❤️ bởi ART EXHIBITION Team**
