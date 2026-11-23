# VICEVERSE — Gaming Creator Hub & Digital Marketplace
*Inspired by the neon atmosphere of Vice City & the visual world of GTA VI*

[![Developer](https://img.shields.io/badge/Developer-Sayeda%20Haneen-FF4FA3?style=for-the-badge&logo=codeforces&logoColor=white)](https://github.com/SayedaHaneen)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sayedahaneenhussain/)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SayedaHaneen)
[![Stack](https://img.shields.io/badge/Stack-React%2018%20%2F%20Node%20%2F%20MySQL-35DDF5?style=for-the-badge)](https://github.com/SayedaHaneen/viceverse)

---

## 🌴 Project Overview

**VICEVERSE** is an independent, production-grade full-stack web application combining:
1. **Creator Profiles**: Vanity hub for gaming streamers with custom bio, stream schedule, social channels, and interactive portfolio gallery.
2. **Creator Discovery**: Searchable, filterable directory with gaming interest tags, follower counts, and verified badges.
3. **Digital Marketplace**: E-commerce platform for high-resolution 4K/8K wallpapers, print-ready posters, animated stream overlays, high-CTR YouTube thumbnails, and profile themes.
4. **Creator Dashboard**: Dedicated streamer studio to edit branding, upload avatars & banners, manage portfolios, and configure live social links.
5. **Simulated Demo Checkout**: Full e-commerce cart, promo code engine (`VICE20`), and simulated checkout persisting completed orders and license keys to the database.
6. **Administrator Control Panel**: Comprehensive governance dashboard for user roles, verification badges, product catalog management, order statuses, and category creation.

> **Disclaimer**: This is an independent fan-inspired project created for educational and portfolio demonstration purposes. It is NOT an official Rockstar Games product, and is not affiliated with Take-Two Interactive.

---

## ⚡ Technology Stack

### Frontend
- **React.js 18** with **Vite**
- **Tailwind CSS** with bespoke Vice City neon design tokens
- **React Router 6** (SPA routing with protected creator & admin guards)
- **Lucide React** (Consistent, high-tech iconography)
- **Google Fonts**: `Anton` / `Bebas Neue` for cinematic display headings, `Inter` for interface typography

### Backend
- **Node.js** & **Express.js** REST API
- **JWT (JSON Web Tokens)** & **bcryptjs** (10 salt rounds) for authentication
- **Multer** for secure image uploads (avatars, covers, portfolio artwork, product previews)
- **Role-Based Access Control (RBAC)**: `user`, `creator`, and `admin`

### Database
- **MySQL / MariaDB** via `mysql2/promise` with 10 normalized relational tables:
  1. `users`
  2. `creator_profiles`
  3. `social_links`
  4. `portfolio_items`
  5. `categories`
  6. `products`
  7. `cart_items`
  8. `orders`
  9. `order_items`
  10. `saved_products`
- **Zero-Downtime Resilience**: Seamless dual-mode driver. Connects directly to real MySQL when available, or seamlessly uses the built-in relational SQL engine (`node:sqlite`) with identical schemas, queries, and constraints when MySQL is offline.

---

## 🔑 Demo Account Credentials

Use these pre-configured accounts or the 1-Click Quick Demo buttons on the Login page:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@viceverse.gg` | `ViceAdmin2026!` | Access to Admin Panel, user roles, product deletion, orders |
| **Verified Creator** | `neon@viceverse.gg` | `CreatorPass123!` | Access to Creator Dashboard, portfolio uploads, stream links |
| **Gamer / User** | `player1@viceverse.gg` | `GamerPass123!` | Marketplace browsing, loot cart, demo checkout, order history |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v26)
- **MySQL / MariaDB** (Optional - XAMPP, WAMP, or standalone MySQL on port 3306)

### 2. Installation
Open PowerShell or Terminal in the project root:
```powershell
cd C:\Users\Dell\.gemini\antigravity\scratch\viceverse

# Install dependencies for both client and server
cd server && npm install
cd ../client && npm install
```

### 3. Build & Run
To run the unified application on `http://localhost:5000`:
```powershell
# From project root
cd client && npm run build
cd ../server && npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser!

### 4. Running Development Servers (Vite + Express Watch)
- **Frontend (Vite Dev Server)**:
  ```powershell
  cd client && npm run dev
  # Runs on http://localhost:5173 with hot module reloading
  ```
- **Backend (Express Watch)**:
  ```powershell
  cd server && npm run dev
  # Runs on http://localhost:5000
  ```

---

## 🗄️ MySQL Database Setup (Optional)

If running XAMPP or native MySQL:
1. Start MySQL on default port `3306`.
2. Run the automated seed script:
   ```powershell
   cd server && node database/seedMysql.js
   ```
3. Or manually import `server/database/schema.sql` into MySQL:
   ```bash
   mysql -u root -p < server/database/schema.sql
   ```

---

## 🧪 Automated Test Suite

A complete verification suite testing all 20 REST endpoints, authentication, cart, RBAC, and demo orders is included:
```powershell
cd server
node test-suite.js
```

---

## 🎨 Design System & Color Tokens

- **Main Background**: `#080A12` (Abyssal Vice Night)
- **Secondary Background**: `#101421` (Vice Navy)
- **Card Background**: `#151B2B` (Dark Glassmorphic Navy)
- **Neon Pink**: `#FF4FA3` (Miami Flamingo Glow)
- **Electric Cyan**: `#35DDF5` (Biscayne Cyan Glow)
- **Sunset Orange**: `#FF9B61` (Ocean Drive Sunset)
- **Main Typography**: `Anton` / `Bebas Neue` + `Inter`

---

## 👩‍💻 Author & Connect

**Sayeda Haneen**
- **GitHub**: [@SayedaHaneen](https://github.com/SayedaHaneen)
- **LinkedIn**: [Sayeda Haneen](https://www.linkedin.com/in/sayedahaneenhussain/)
- **Repository**: [viceverse](https://github.com/SayedaHaneen/viceverse)

---

## 📜 License
Distributed under the **MIT License**. Created for academic, portfolio, and educational purposes.
