# 🛠️ Customer & Inventory Management System

A **basic Full-Stack project** built with **Spring Boot, Spring Security, Hibernate/JPA, MySQL, and jQuery (AJAX frontend)**.  
This project was developed as part of my **learning journey** to strengthen backend, API, and full-stack development skills.  

---

## 🚀 Features
- 🔐 **Secure login & authentication** with **JWT (stored in HttpOnly Cookies)**
- 👤 **Customer CRUD** (Create, Read, Update, Delete)
- 📦 **Item CRUD** with validations
- ✅ **Backend validation & error handling** using Hibernate Validator + `@ExceptionHandler`
- 👮 **Role-based access** (Admin/Cashier)
- 🌐 **AJAX-powered frontend** with responsive UI
- 🎨 **SweetAlert2** for better user experience

---

## 🛠️ Tech Stack
### Backend
- **Spring Boot** (REST APIs)
- **Spring Security** (JWT Authentication + Cookies)
- **Hibernate / JPA**
- **MySQL**

### Frontend
- **HTML, CSS, JavaScript**
- **jQuery & AJAX**
- **SweetAlert2**

---

## ⚡ Security
- JWT Access Tokens are stored in **HttpOnly Cookies** → safer than localStorage/sessionStorage
- Passwords are hashed with **BCrypt**
- Validations ensure no invalid data is stored in the DB
