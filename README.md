# 📦 NodeJS RESTful API - Contact Management

Proyek ini merupakan implementasi RESTful API menggunakan **Node.js** dan **Express.js** untuk mengelola data **User**, **Contact**, dan **Address**.  
Dibuat berdasarkan materi dari pak **Eko Kurniawan Khannedy (Programmer Zaman Now)**.

---

## ⚙️ Fitur Utama
Proyek ini memiliki tiga modul utama:

### 1️⃣ User Management
**Data:**
- Username  
- Password  
- Name  

**API Endpoint:**
- `POST /api/users/register` → Register User  
- `POST /api/users/login` → Login User  
- `GET /api/users/current` → Get Current User  
- `PATCH /api/users/update` → Update User  
- `DELETE /api/users/logout` → Logout User  

---

### 2️⃣ Contact Management
**Data:**
- First Name  
- Last Name  
- Email  
- Phone  

**API Endpoint:**
- `POST /api/contacts` → Create Contact  
- `GET /api/contacts/:id` → Get Contact  
- `PATCH /api/contacts/:id` → Update Contact  
- `DELETE /api/contacts/:id` → Remove Contact  
- `GET /api/contacts?search=query` → Search Contact  

---

### 3️⃣ Address Management
**Data:**
- Street  
- City  
- Province  
- Country  
- Postal Code  

**API Endpoint:**
- `POST /api/contacts/:contactId/addresses` → Create Address  
- `GET /api/contacts/:contactId/addresses/:id` → Get Address  
- `PATCH /api/contacts/:contactId/addresses/:id` → Update Address  
- `DELETE /api/contacts/:contactId/addresses/:id` → Remove Address  
- `GET /api/contacts/:contactId/addresses` → List All Address  

---

## 🧩 Tech Stack
| Library / Package | Deskripsi | Instalasi |
|-------------------|------------|------------|
| **Express.js** | Framework backend utama | `npm install express` |
| **Joi** | Validasi data | `npm install joi` |
| **Prisma** | ORM untuk koneksi database | `npm install prisma --save-dev` |
| **Winston** | Logging | `npm install winston` |
| **Bcrypt** | Hashing password | `npm install bcrypt` |
| **UUID** | Generate unique ID | `npm install uuid` |
| **Jest + Supertest** | Unit dan integration testing | `npm install --save-dev jest supertest` |
| **Babel** | Transpilasi modern JavaScript | `npm install --save-dev babel-jest @babel/preset-env` |

---

## 🗄️ Database
Menggunakan **Prisma ORM** dengan model utama:
- `User`
- `Contact`
- `Address`

Untuk setup awal database:
```bash
npx prisma init
npx prisma migrate dev
````

---

## 🧰 Struktur Proyek

```
belajar-nodejs-restful-api/
├── prisma/
│   └── migrations/
│   └── schema.prisma
├── src/
│   ├── application/
│   │   ├── database.js
│   │   └── logging.js
│   │   └── web.js
│   ├── controllers/
│   ├── error/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── validations/
│   └── main.js
├── tests/
├── .env
├── babel.config.json
├── package-lock.json
├── package.json
├── prisma.config.ts
└── README.md
```

---

## 🚀 Cara Menjalankan

```bash
# 1. Clone repository
git clone ttps://github.com/hilmiyahya19/belajar-nodejs-restful-api.git

# 2. Install dependencies
npm install

# 3. Setup environment di file .env
# lalu sesuaikan konfigurasi database

# 4. Jalankan server
node src/main.js
```

---

## 🧪 Menjalankan Test

```bash
# Menjalankan semua test
npm test

# Test spesifik
npm run test:address
npm run test:contact
npm run test:util
npm run test:user
```

---
