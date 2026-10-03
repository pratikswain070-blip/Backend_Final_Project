# EnergySaver – Smart Home Energy Manager

A backend API built with Node.js, Express.js, and MongoDB that allows homeowners to monitor, manage, and optimize their home energy consumption.

---

## Features

1. **User Authentication** – Register/Login with JWT and bcrypt
2. **Home Management** – Register and manage multiple homes
3. **Device Management** – Add smart devices (AC, Fan, Refrigerator, etc.)
4. **Energy Readings** – Record and track energy consumption data
5. **Real-Time Updates** – Socket.io for live energy data streaming
6. **Energy Limits** – Set daily/weekly/monthly usage limits
7. **Smart Alerts** – Automatic alerts when limits are reached or exceeded
8. **Neighborhood Comparison** – Compare your usage with neighbors
9. **Monthly Reports** – Detailed consumption reports with device breakdown
10. **Savings Reports** – Compare current month with previous month
11. **Energy Tips** – Admin-curated energy saving tips
12. **Push Notifications** – Push notification alert dispatcher
13. **Admin Panel** – Manage device templates and view all devices
14. **Frontend Dashboard** – Single-server UI with live charts and real-time Socket.io updates
15. **API Documentation** – Interactive Swagger UI at `/api-docs`

---

## Technology Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment for server-side JavaScript |
| **Express.js** | Web framework for building REST APIs |
| **MongoDB** | NoSQL database for storing all application data |
| **Mongoose** | ODM (Object Data Modeling) for MongoDB |
| **JWT** | Secure token-based authentication |
| **bcryptjs** | Password hashing for security |
| **Socket.io** | Real-time bidirectional communication |
| **Swagger** | Auto-generated API documentation |
| **express-validator** | Input validation middleware |
| **dotenv** | Environment variable management |
| **cors** | Cross-Origin Resource Sharing |
| **nodemon** | Auto-restart during development |

---

## Why MongoDB?

- **Flexible Schema**: Energy readings have varying fields, MongoDB handles this naturally.
- **Document Model**: Easy storage and retrieval of time-series readings with indexed queries.
- **Scalability**: Handles large volumes of time-series energy data efficiently.
- **JSON-like Documents**: Maps directly to JavaScript objects.

## Why Socket.io?

- **Real-Time Updates**: When a new energy reading is recorded, all connected clients for that home receive the update instantly.
- **Energy Alerts**: Alert events are broadcast in real-time when limits are crossed.
- **No Polling Required**: Clients don't need to keep asking for new data.

---

## Folder Structure

```
EnergySaver/
├── server.js                 # Entry point (API, Swagger & Frontend server)
├── package.json              # Dependencies & npm scripts
├── seed.js                   # Database seed script
├── EnergySaver.postman_collection.json # Postman API test collection
├── .env                      # Environment variables (PORT=5003)
├── .env.example              # Example env file
├── .gitignore                # Git ignore rules
├── README.md                 # Project documentation
│
├── frontend/                 # Interactive Dashboard
│   ├── index.html            # 5-tab user interface
│   ├── style.css             # Clean responsive dark theme
│   └── app.js                # Frontend REST API & Socket.io controller
│
├── config/
│   └── db.js                 # MongoDB connection
│
├── models/
│   ├── User.js               # User schema
│   ├── Home.js               # Home schema
│   ├── Device.js             # Device schema
│   ├── Reading.js            # Energy reading schema
│   ├── Limit.js              # Energy limit schema
│   ├── Alert.js              # Alert schema
│   ├── Tip.js                # Energy tip schema
│   └── DeviceTemplate.js     # Device template schema
│
├── controllers/
│   ├── authController.js     # Register/Login logic
│   ├── homeController.js     # Home CRUD
│   ├── deviceController.js   # Device CRUD
│   ├── readingController.js  # Energy readings + limit check
│   ├── limitController.js    # Energy limits
│   ├── alertController.js    # Alerts
│   ├── compareController.js  # Neighborhood comparison
│   ├── reportController.js   # Monthly/Savings reports
│   ├── tipController.js      # Energy tips
│   ├── adminController.js    # Admin operations
│   └── notificationController.js # System push notifications
│
├── routes/
│   ├── authRoutes.js
│   ├── homeRoutes.js
│   ├── deviceRoutes.js
│   ├── readingRoutes.js
│   ├── limitRoutes.js
│   ├── alertRoutes.js
│   ├── compareRoutes.js
│   ├── reportRoutes.js
│   ├── tipRoutes.js
│   ├── adminRoutes.js
│   └── notificationRoutes.js
│
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   ├── roleMiddleware.js     # Role-based access
│   ├── validationMiddleware.js # Input validation
│   └── errorMiddleware.js    # Centralized error handling
│
├── sockets/
│   └── socketHandler.js      # Socket.io event handlers
│
└── swagger/
    └── swagger.js            # Swagger API docs config
```

---

## Quick Start: Setup and Run Instructions

### 1. Prerequisites
- **Node.js** (v16.x or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes bundled with Node.js)
- **MongoDB** (Local MongoDB Server or free cloud [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### 2. Step-by-Step Installation

#### Step 1: Navigate to the `EnergySaver` directory
```bash
# If you cloned the repository:
cd Backend_Final_Project/EnergySaver

# If you are already in the project root:
cd EnergySaver
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Configure Environment Variables
Create a `.env` file in the `EnergySaver/` directory (you can copy `.env.example`):
```bash
cp .env.example .env
```
Inside `.env`, verify or set your variables:
```env
PORT=5003
MONGO_URI=mongodb://127.0.0.1:27017/energysaver
JWT_SECRET=energysaver_super_secret_key_2024
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string).*

#### Step 4: Seed Database with Sample Data
Populate the database with demo users, homes, devices, limits, and energy readings:
```bash
npm run seed
```

---

### 3. How to Run the Application

#### Start in Production Mode:
```bash
npm start
```
*(Runs `node server.js` on port `5003`)*

#### Start in Development Mode (with Auto-Reload):
```bash
npm run dev
```

---

### 4. Accessing the Application

Once the server is running, open your web browser:

| Interface | URL | Purpose |
|---|---|---|
| 🖥️ **Frontend Dashboard** | [http://localhost:5003](http://localhost:5003) | Interactive UI with live charts, device controls, limits, reports & Socket.io updates |
| 📖 **Swagger API Docs** | [http://localhost:5003/api-docs](http://localhost:5003/api-docs) | Interactive OpenAPI testing console (test all 11 endpoint categories) |
| ⚡ **API Health Check** | [http://localhost:5003/api](http://localhost:5003/api) | Verifies backend API status |

---

### 5. Default Login Credentials (from Seed)

| Role | Email | Password | Access Level |
|---|---|---|---|
| **User (Homeowner)** | `pratik@example.com` | `password123` | Homes, Devices, Readings, Limits, Alerts, Reports & Tips |
| **Admin** | `admin@example.com` | `password123` | All User features + Admin Device Templates & Tip creation |
| **User 2** | `rahul@example.com` | `password123` | Second homeowner (used for Neighborhood Comparison) |

---

## Deployment Guide

### Option 1: Deploy on Render (Recommended - Single Server)
Render supports persistent Node.js servers, WebSockets (Socket.io), and serves the frontend together with the API:
1. Push repository to **GitHub**.
2. In [Render Dashboard](https://render.com), click **New +** → **Web Service**.
3. Select your repository and set:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string (make sure Atlas allows `0.0.0.0/0` in Network Access).
   - `JWT_SECRET`: `energysaver_super_secret_key_2024`
5. Click **Deploy**. Your dashboard, API, and Swagger will be live at `https://your-service.onrender.com`.

### Option 2: Frontend on Vercel + Backend on Render
1. Deploy Backend on **Render** using the steps above.
2. In [Vercel Dashboard](https://vercel.com), import your repository.
3. Set **Root Directory** to `frontend`.
4. Deploy to get a standalone frontend URL.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Homes
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/homes` | Get all homes | Yes |
| GET | `/api/homes/:id` | Get home by ID | Yes |
| POST | `/api/homes` | Create a home | Yes |
| PUT | `/api/homes/:id` | Update a home | Yes |

### Devices
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/devices` | Get all devices | Yes |
| GET | `/api/devices/:id` | Get device by ID | Yes |
| POST | `/api/devices` | Add a device | Yes |
| PUT | `/api/devices/:id` | Update a device | Yes |
| DELETE | `/api/devices/:id` | Delete a device | Yes |

### Energy Readings
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/readings` | Record a reading | Yes |
| GET | `/api/readings` | Get all readings | Yes |
| GET | `/api/readings/device/:id` | Get device readings | Yes |

### Limits
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/limits` | Create a limit | Yes |
| GET | `/api/limits` | Get all limits | Yes |
| GET | `/api/limits/device/:id` | Get device limits | Yes |
| PUT | `/api/limits/:id` | Update a limit | Yes |

### Alerts
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/alerts` | Get all alerts | Yes |
| POST | `/api/alerts/check` | Check and generate alerts | Yes |

### Comparison
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/compare/neighborhood` | Neighborhood comparison | Yes |
| GET | `/api/compare/average` | Average consumption | Yes |

### Reports
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/reports/monthly` | Monthly report | Yes |
| GET | `/api/reports/savings` | Savings report | Yes |

### Tips
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/tips` | Get all tips | Yes |
| POST | `/api/tips` | Create a tip | Admin |

### Admin
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/admin/devices` | Get all devices | Admin |
| GET | `/api/admin/templates` | Get templates | Admin |
| POST | `/api/admin/templates` | Create template | Admin |

### Notifications
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/notifications/send` | Send push notification | Yes |

---

## Swagger Documentation

After starting the server, visit: **http://localhost:5001/api-docs**

---

## Sample API Requests (Postman)

### 1. Register
```
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "name": "Pratik Swain",
  "email": "pratik@example.com",
  "password": "password123"
}
```

### 2. Login
```
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "pratik@example.com",
  "password": "password123"
}
```
→ Copy the `token` from response.

### 3. Create Home (use token in Authorization header)
```
POST http://localhost:5001/api/homes
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "My Smart Home",
  "address": "123 Main Street",
  "city": "Bhubaneswar",
  "neighborhood": "Saheed Nagar"
}
```

### 4. Add Device
```
POST http://localhost:5001/api/devices
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "home": "<home-id>",
  "name": "Living Room AC",
  "type": "AC",
  "brand": "Daikin",
  "powerRating": 1500
}
```

### 5. Record Energy Reading
```
POST http://localhost:5001/api/readings
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "device": "<device-id>",
  "energyConsumed": 2.5,
  "voltage": 230,
  "current": 5
}
```

### 6. Create Limit
```
POST http://localhost:5001/api/limits
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "home": "<home-id>",
  "limitType": "monthly",
  "limitValue": 300,
  "alertPercentage": 90
}
```

### 7. Get Monthly Report
```
GET http://localhost:5001/api/reports/monthly
Authorization: Bearer <your-token>
```

### 8. Get Neighborhood Comparison
```
GET http://localhost:5001/api/compare/neighborhood
Authorization: Bearer <your-token>
```

---

## Sample Login Flow

```
1. User sends POST /api/auth/login with email and password
2. Server verifies email exists in MongoDB
3. Server compares password hash using bcrypt
4. Server generates JWT token with user ID
5. Token is returned to the user
6. User includes token in Authorization header for all subsequent requests
7. authMiddleware verifies the token on protected routes
```

## Sample Energy Reading Flow

```
1. User or IoT device sends POST /api/readings with device ID and energy data
2. Server verifies the device belongs to the user's home
3. Reading is saved to MongoDB
4. Socket.io emits "energyUpdate" event to all connected clients in real time
5. Server checks if any active limits exist for this device/home
6. Server fetches period readings using Reading.find() and calculates total consumption with a simple loop
7. If usage >= alertPercentage (e.g., 90%), a "warning" alert is created
8. If usage >= 100%, an "exceeded" alert is created
9. Socket.io emits "energyAlert" event for instant UI alert toast
10. Response is sent back to the client
```

## How Alerts Work

```
1. Each limit has a limitValue (e.g., 300 kWh monthly) and alertPercentage (e.g., 90%)
2. When a new reading is created, the system calculates total usage for the period
3. If usage crosses the alertPercentage threshold → "warning" alert is created
4. If usage crosses 100% of the limit → "exceeded" alert is created
5. Duplicate alerts for the same period are prevented
6. Alerts are emitted via Socket.io for real-time notifications
7. Alerts can also be checked manually via POST /api/alerts/check
```

---

## Test Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| User | pratik@example.com | password123 |
| User | rahul@example.com | password123 |
| Admin | admin@example.com | password123 |

---

## Viva Quick Explanation

### What does this project do?
EnergySaver is a smart home energy management system. It helps homeowners track energy consumption of their devices, set usage limits, get alerts, and compare usage with neighbors.

### Why Node.js?
Node.js is non-blocking and event-driven, making it perfect for handling real-time data from IoT devices. It uses JavaScript, so we can use the same language on both frontend and backend.

### Why Express.js?
Express is a minimal, fast web framework for Node.js. It makes creating REST APIs simple with routing, middleware, and request handling.

### Why MongoDB?
MongoDB stores data in JSON-like documents which maps naturally to JavaScript objects. It enables fast indexed queries on time-series readings with filters like `$gte` and `$in`, while letting us compute totals and averages cleanly in standard loops.

### Why JWT?
JSON Web Tokens (JWT) provide stateless, secure authentication. The token contains the user ID and is sent with every request via `Authorization: Bearer <token>`. The server does not need to store active sessions in memory.

### Why bcrypt?
bcrypt hashes passwords with a cryptographic salt, preventing reverse lookups or plain-text exposure even if the database is accessed.

### Why Socket.io?
Socket.io enables real-time, bidirectional WebSocket communication. When energy readings or limit breaches occur, connected clients receive updates immediately without polling.

### Why Swagger?
Swagger auto-generates interactive API documentation. Developers can test APIs directly from the browser at `/api-docs`.

### How does data flow?
1. User registers/logs in → gets JWT token
2. User creates a home → adds devices to the home
3. IoT devices send energy readings → stored in MongoDB
4. System checks limits → creates alerts if exceeded
5. Socket.io sends real-time updates to connected clients
6. User views reports, comparisons, and tips through API

---

## License

ISC
