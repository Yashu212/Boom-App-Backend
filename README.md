# Boom Video Platform – Backend
This is the backend for the **Boom video streaming platform**, built using **Node.js**, **Express**, and **MongoDB** in a **microservices architecture** and deployed on **Railway**.

---

## 🔧 Microservices

1. **Auth Service** (`localhost:4000` && `https://boom-app-backend-production.up.railway.app/`)
   - User register/login
   - Wallet: top-up, deduct, balance
2. **Video Service** (`localhost:4001` && `https://determined-peace-production.up.railway.app/`) 
   - Upload & stream videos
   - Comment system
   - Video purchases & gifting

Each service runs independently and communicates via REST.

---

## 🛠️ Tech Stack

- **Node.js + Express**
- **MongoDB + Mongoose**
- **Axios** (for internal service calls)
- **JWT Authentication**
- **Multer** (for short video uploads)
- **Cloudflare R2** (for production-ready video storage)

---

## 📦 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/boom-backend.git
cd boom-backend
```
2. Install dependencies for each service
```bash
cd auth
npm install

cd ../video
npm install
```
3. Start services
```bash
# In /auth
node server.js

# In /video
node server.js
```
##⚙️ Environment Variables

/auth/.env
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/authdb
JWT_SECRET=your_jwt_secret_key
```

/video/.env
```
PORT=4001
MONGO_URI=mongodb://localhost:27017/videodb
R2_ACCESS_KEY=your_access_key
R2_SECRET_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket
R2_ENDPOINT=https://your-r2-endpoint
```

##🧠 Folder Structure

```
backend/
├── auth/
│   ├── controllers/        # Auth and Wallet logic
│   ├── models/             # User model
│   ├── routes/             # Auth routes
│   ├── middleware/         # Auth middleware (JWT verification)
│   └── config/             # DB connection
│
├── video/
│   ├── controllers/        # Videos, Comments, Purchases, Gifts
│   ├── models/             # Video, Comment, Purchase models
│   ├── routes/             # Video, Comment, Gift APIs
│   ├── middleware/         # Auth middleware for route protection
│   ├── config/             # DB connection and Cloudfare r2 connection

```
# 📡 API Overview

This document provides an overview of the available API endpoints for our services.

---

## 🔐 Auth Service (Port 4000)

Handles user authentication, authorization, and wallet management.

* **`POST /api/auth/register`**
    * Register a new user.
* **`POST /api/auth/login`**
    * Log in an existing user.
* **`GET /api/auth/me`**
    * Retrieve details of the authenticated user.
* **`PUT /api/auth/wallet/topup`**
    * Add funds to the authenticated user's wallet.
* **`PUT /api/auth/wallet/deduct`**
    * Deduct funds from the authenticated user's wallet.(used in video purchase and gifting)
* **`PUT /api/auth/users/:id/wallet/add`**
    * Add funds to a specific user's wallet (used in video purchase and gifting).

---

## 🎥 Video Service (Port 4001)

Manages video content, uploads, purchases, comments, and gifting.

* **`POST /api/videos/upload`**
    * Upload a new video.
* **`GET /api/videos`**
    * Retrieve a list of all videos.
* **`GET /api/videos/:id/purchased`**
    * Check if the authenticated user has purchased a specific video.
* **`POST /api/videos/:id/purchase`**
    * Purchase a specific video.
* **`POST /api/videos/:id/comments`**
    * Add a comment to a specific video.
* **`GET /api/videos/:id/comments`**
    * Get all comments for a specific video.
* **`DELETE /api/comments/:id`**
    * Delete a specific comment.
* **`POST /api/videos/:id/gift`**
    * Gift a specific Amount to creator.

---

## 🔐 Authentication

Most endpoints in these services require a **JSON Web Token (JWT)** for authentication.

**Pass the token via headers as follows:**

```http
Authorization: Bearer <your-token>
```

---

## 🧪 Testing

For testing the API endpoints, we recommend using tools like **Postman** or **ThunderClient**. These tools allow you to easily send requests to the API and inspect responses, helping you verify the functionality of each endpoint.

---
## 👨‍💻 Author

Built by **Yash Shukla** to provide a scalable, secure, and modular code execution backend using **microservices**.
