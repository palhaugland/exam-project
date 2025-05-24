# 🛍️ Full-Stack E-Commerce Platform

An end-to-end e-commerce solution built with **Node.js, Express, Sequelize (MySQL)**, and a dynamic **EJS Front-End**. The app supports product browsing, cart management, order placement, and user memberships based on purchase activity. Designed for both **admin control** and **user-friendly experiences**.

---

## 📌 Features

### 🧑‍💼 Admin
- Full CRUD for:
  - Products
  - Categories
  - Brands
  - Membership levels
- Swagger UI documentation for all API endpoints
- Order management with membership-level tracking

### 👥 Users
- Registration & secure JWT-based login
- Browsing, searching & filtering products
- Add to cart, checkout & order history
- Auto-upgrading **membership tier** based on total purchases

---

## 🧠 Project Highlights

- **Custom Role & Membership System**  
  Automatically tracks a user's completed purchases and updates their membership level using a smart ERD design involving `Users`, `Memberships`, and `UserMemberships`.

- **Relational Database Design**  
  Built around Sequelize + MySQL using clearly defined relationships between entities like `Orders`, `Products`, and `CartItems`.

- **Full-Stack Auth & Authorization**  
  Secure login with sessions and JWTs. Middleware guards admin routes and user access.

- **Real-World Error Handling**  
  Graceful handling of user errors and expired sessions with clear feedback on both front and back ends.

---

## 🗃️ Tech Stack

| Category       | Tools |
|----------------|-------|
| **Backend**    | Node.js, Express, Sequelize, MySQL, JWT, bcrypt |
| **Frontend**   | EJS, Bootstrap 5, Vanilla JS |
| **Testing**    | Jest, Supertest |
| **Docs**       | Swagger (via swagger-jsdoc + swagger-ui-express) |
| **Dev Tools**  | Nodemon, dotenv, ESLint |

---

## 📸 Entity Relationship Diagram (ERD)

![ERD](.ERD%20diagram.png) <!-- Replace with actual relative path if needed -->

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js v18+
- MySQL installed & running

### 📦 Install Dependencies

From the root directories:

```bash
cd back-end
npm install

cd ../front-end
npm install
```
---

### 🗄️ Setup Environment Variables

Add .env files for both back-end and front-end:

back-end/.env
```bash
PORT=3000
JWT_SECRET=your_secret
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost

front-end/.env
PORT=3001
API_BASE_URL=http://localhost:3000
```

---

### 🔨 Run the Apps
# In back-end
```bash
npm start
```

# In front-end (separate terminal)
```bash
npm start
```

Visit the front end at: http://localhost:3001

### 🧪 Running Tests
```bash
cd back-end
npm run test
```

---

### 🧠 Lessons Learned

This project was a deep dive into designing scalable back-end logic, implementing role-based access, and managing real-world issues like data consistency and authentication across services.

I also built strong workflows around:
	•	Planning with Jira roadmap
	•	API-first development using Swagger + Postman
	•	Debugging and learning with AI-assisted problem solving

---

### 📂 Folder Structure
```bash
project-root/
│
├── back-end/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── controllers/
│   ├── swagger/
│   └── app.js
│
├── front-end/
│   ├── routes/
│   ├── views/
│   ├── public/
│   └── app.js
```

---

### 📫 Contact

Pal Haugland
Email: [paal.haugland@mail.com]
GitHub: @palhaugland


⸻

📝 License

This project is licensed under the ISC License.
