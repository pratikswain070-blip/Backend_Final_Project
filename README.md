# Backend Final Project – EnergySaver

Smart Home Energy Management System with REST APIs, Real-Time Socket.io, Interactive Swagger UI, and Full-Stack Dashboard.

---

## 📁 Repository Structure

```
Backend_Final_Project/
└── EnergySaver/                   # Complete Project Directory
    ├── server.js                  # Entry point (API, Swagger & Frontend server)
    ├── package.json               # Dependencies and npm scripts
    ├── seed.js                    # Database seed script
    ├── EnergySaver.postman_collection.json # Postman API test collection
    ├── README.md                  # Detailed documentation & viva defense guide
    ├── frontend/                  # Interactive single-server dashboard UI
    ├── controllers/               # 11 REST API controllers
    ├── routes/                    # 11 Express router modules
    ├── models/                    # 8 Mongoose schemas
    ├── middleware/                # Auth, Role, Validation & Error middlewares
    ├── sockets/                   # Real-time Socket.io handlers
    └── swagger/                   # OpenAPI 3.0 live Swagger documentation
```

---

## 🚀 Quick Start: Setup and Run Instructions

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local instance or MongoDB Atlas)
- **npm**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/pratikswain070-blip/Backend_Final_Project.git

# Navigate to the EnergySaver folder
cd Backend_Final_Project/EnergySaver

# Install dependencies
npm install

# Create environment file from template
cp .env.example .env
```

### 3. Configure `.env`
Open `.env` and verify your MongoDB URI:
```env
PORT=5003
MONGO_URI=mongodb://127.0.0.1:27017/energysaver
JWT_SECRET=energysaver_super_secret_key_2024
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string).*

### 4. Seed Database with Sample Data
```bash
npm run seed
```

### 5. Start the Server
```bash
# Production mode
npm start

# Or development mode (with auto-reload)
npm run dev
```

---

## 🌐 Live URLs (When Server is Running)

- 🖥️ **Frontend Dashboard:** [http://localhost:5003](http://localhost:5003)
- 📖 **Swagger API Documentation:** [http://localhost:5003/api-docs](http://localhost:5003/api-docs)
- ⚡ **API Status:** [http://localhost:5003/api](http://localhost:5003/api)

---

## 🔑 Default Login Credentials

- **User (Homeowner):** `pratik@example.com` / `password123`
- **Admin:** `admin@example.com` / `password123`

---

For full architecture details, endpoint tables, and viva defense answers, see [EnergySaver/README.md](EnergySaver/README.md).
