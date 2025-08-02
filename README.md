# 📦 Parcel Delivery System API

A complete backend API for managing a Parcel Delivery System using Node.js, Express.js, MongoDB, and TypeScript.

## 🚀 Technologies Used

- **Node.js** with **Express.js**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **Zod** for validation
- **JWT Authentication**
- **Role-based Access Control**
- **Custom Middlewares**
- **Postman for API testing**

## 📁 Folder Structure

```
src/
├── app/
│   ├── config/              # Config and constants
│   ├── modules/             # Main feature modules (auth, parcel, user)
│   ├── middlewares/         # Custom middlewares
│   ├── utils/               # Helper functions
│   ├── constants/           # App-wide constants
├── server.ts                # App entry point
```

## 🔑 Roles in System

- `SENDER`
- `RECEIVER`
- `ADMIN`
- `SUPER_ADMIN`

## 📫 API Endpoints

All routes follow the base URL: `api/`

### 🧑‍💼 Auth & User Routes

| Method | Route             | Role             | Description             |
| ------ | ----------------- | ---------------- | ----------------------- |
| POST   | `/auth/register`  | PUBLIC           | Register a new user     |
| POST   | `/user/login`     | PUBLIC           | User login              |
| GET    | `/user/all-users` | ADMIN / SUPER    | Get list of all users   |
| PATCH  | `/user/:id`       | ALL LOGGED USERS | Update own user profile |

### 📦 Parcel Routes

| Method | Route                           | Role        | Description                   |
| ------ | ------------------------------- | ----------- | ----------------------------- |
| POST   | `/parcels/create-parcel`        | SENDER      | Create a new parcel           |
| PATCH  | `/parcels/status/:parcelId`     | ADMIN/SUPER | Update parcel status          |
| PATCH  | `/parcels/cancel/:parcelId`     | SENDER      | Cancel a parcel               |
| PATCH  | `/parcels/reschedule/:parcelId` | ADMIN       | Reschedule a parcel           |
| PATCH  | `/parcels/return/:parcelId`     | ADMIN       | Return a parcel               |
| DELETE | `/parcels/:parcelId`            | SENDER      | Delete a parcel               |
| GET    | `/parcels/track/:trackingId`    | PUBLIC      | Track parcel by tracking ID   |
| GET    | `/parcels/sender/all`           | SENDER      | Get all parcels of a sender   |
| GET    | `/parcels/receiver/all`         | RECEIVER    | Get all parcels of a receiver |
| GET    | `/parcels/admin/all`            | ADMIN       | Admin route: get all parcels  |
| GET    | `/parcels/:parcelId`            | All Roles   | Get a single parcel by ID     |

## 🧪 How to Test APIs

Use Postman or Thunder Client and:

1. 🔐 Login using: for admin route access

   - **Admin Email**: `admin@gmail.com`
   - **Password**: `Admin@12345`

2. ☑️ For sender/receiver APIs:

   - Register with name , email , password,role sender or receiver

```
 {
   "name": "your name",
   "email": "example@gmail.com",
   "password": "example@12345",
   "role": "RECEIVER"
}

```

- Long In and get the access-token
- Use the generated JWT token in `authorization` header

3. 📬 If a route requires body input, here’s a sample:

### Create Parcel (SENDER)

```json
{
  "sender": "64fe9cfed4e6cf5fd6ef51a7",
  "receiver": "64fe9d09d4e6cf5fd6ef51ab",
  "type": "Document",
  "weight": 2.5,
  "fee": 120,
  "pickupAddress": "123 Sender Lane",
  "deliveryAddress": "456 Receiver Street"
}
```

### Update Parcel Status (ADMIN/SUPER_ADMIN)

```json
{
  "currentStatus": "Approved",
  "updatedBy": "688de4d4e39fdee2005f7604",
  "note": "Approved by dispatch officer"
}
```

### 📦 Parcel Admin Route: `GET /api/parcels/admin/all`

- ✅ **1. Get All Parcels (Default)**  
  `GET /api/v1/parcels/admin/all`

- ✅ **2. Get Parcels by Status**  
  `GET /api/v1/parcels/admin/all?status=Delivered`

- ✅ **3. Filter by Date (Delivery Date)**  
  `GET /api/v1/parcels/admin/all?deliveryDate=2025-08-05`

- ✅ **4. Sort by Created Date Descending**  
  `GET /api/v1/parcels/admin/all?sortBy=createdAt&sortOrder=desc`

- ✅ **5. Sort by Weight Ascending**  
  `GET /api/v1/parcels/admin/all?sortBy=weight&sortOrder=asc`

- ✅ **6. Paginate (Page 2, Limit 5)**  
  `GET /api/v1/parcels/admin/all?page=2&limit=5`

- ✅ **7. Combine Filters (Status + Sort + Page)**  
  `GET /api/v1/parcels/admin/all?status=Approved&sortBy=createdAt&sortOrder=desc&page=1&limit=10`

## ✅ Features Included

- Track parcel by tracking ID
- Status change with logs
- Filter by status, date, or delivery status
- Role-based access logic
- MongoDB queries with pagination and sorting

---

## 🧑‍💻 Getting Started

### ⚡ Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally or via Atlas

---

## 🚀 Run the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ismaileub/Parcel-Delivery-API.git
cd Parcel Delivery API

```

---

```bash
npm install
```

#### ⚙️ Environment

Create a `.env` file inside root folder
follow env.example file

#### Run the server in development:

```bash
npm run dev
```

---

> For any issues or collaboration, feel free to reach out.
