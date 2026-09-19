# 🕊️ Veloura

> **An elegant, high-performance e-commerce platform designed for luxury and editorial fashion.**

Veloura is a full-stack modern e-commerce application built with the MERN/PERN stack (React, Node.js, Express, PostgreSQL). It features a sleek, minimalist user interface inspired by high-end fashion brands, complete with dynamic product filtering, secure authentication, and seamless payment integration.

![Veloura Showcase](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop)

---

## ✨ Features

- **🛍️ Elegant Storefront**: A fully responsive, modern UI built with React and Tailwind CSS.
- **🔍 Advanced Filtering**: Real-time product filtering by category (Sharara, Lahenga, Suit Sets, etc.), price range, and attributes.
- **🛡️ Secure Authentication**: JWT-based user authentication and authorization with secure password hashing.
- **💳 Payment Gateway**: Integrated with Razorpay for seamless and secure checkout experiences.
- **☁️ Cloud Media**: Integration with Cloudinary for fast, optimized product image delivery.
- **🚀 Smart Fallback Engine**: Built-in mock data engine that gracefully falls back to offline data if the database is unpopulated.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (via Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React / Heroicons

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **Payments**: Razorpay
- **File Uploads**: Multer & Cloudinary

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/RishiVykunta/veloura1.git
cd veloura1
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and configure your environment variables:
```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_URL=your_cloudinary_url
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

The application will now be running on `http://localhost:5173` (Frontend) and `http://localhost:5000` (Backend).

---

## 📁 Project Structure

```
veloura1/
├── backend/                # Node.js Express server
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Route controllers (Products, Auth, Orders)
│   ├── database/           # Mock data and offline fallbacks
│   ├── routes/             # API routing definitions
│   └── server.js           # Server entry point
│
└── frontend/               # React Vite application
    ├── src/
    │   ├── components/     # Reusable UI components (Navbar, Filters)
    │   ├── pages/          # Full page views (Home, Shop, Cart)
    │   └── services/       # API integration layers
    └── tailwind.config.js  # Custom theme configuration
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
