# Student Management System

##  Overview
A student management system built with Next.js, Prisma, and JavaScript, designed to handle student and teacher roles. Students can view subjects and assignments, upload and remove assignments, while teachers can manage students, subjects, and grade submissions.

## Features
### 🎓 Student Features:
- Login with credentials provided by teachers.
- View dashboard, subjects, and assignments.
- Upload and remove assignments.

### 👨🏻‍🎓 Teacher Features:
- Register with a username and password.
- Manage subjects and students.
- Assign credentials to students.
- Create and manage assignments.
- Grade student submissions.

## Tech Stack
- **Frontend:** Next.js (App Router)
- **Database:** Prisma ORM
- **Backend:** Next.js Server Actions
- **Authentication:** JWT

## 📸 Screenshots
### Login Page

![{F48C1D18-E477-48D1-A8C5-C7FEC52427E2}](https://github.com/user-attachments/assets/c52038f9-7cca-4622-a6f6-1031f2276e88)

### Dashboard(Teacher)

![{FC4AC591-3315-4EBB-9E4E-5768C1B6D353}](https://github.com/user-attachments/assets/e153792d-668f-463a-ab56-1f5243863a2a)

### Dashboard(Student)

![{E0FC5631-BC94-4A40-88BE-DB4BD893FF10}](https://github.com/user-attachments/assets/22abd8c2-9117-4cc0-8344-933049c7aacf)

### Subject Page(Teacher)

![{33A296EF-72D0-4252-B9CA-34648DBAE584}](https://github.com/user-attachments/assets/0ffd4afd-b452-4b76-a83f-9f0349775766)

### Subject Page(Student)

![{E37FA032-7B36-4CFB-837C-57EC49B9D1C6}](https://github.com/user-attachments/assets/83cd01ce-31ee-4842-9a90-a764ee37d03d)

### Assignment page(Teacher)

![{AA52BB79-2A95-4C46-8839-197FC149EF0D}](https://github.com/user-attachments/assets/b79f1b5e-3a8a-4284-8640-8e3d78a1543d)
![{39D66557-0202-4F6F-9E6D-6447BAF72E0F}](https://github.com/user-attachments/assets/277ae65e-75d4-4b96-a620-6e91d1545e82)

### Assignment page(Student)

![{D2048CA3-D696-4929-9AE8-944AFAF23667}](https://github.com/user-attachments/assets/cd9a6332-689a-450e-be33-e163f38ea99d)
![{ACAB6B6F-694C-4FDF-9469-DADA9CE8908E}](https://github.com/user-attachments/assets/64a81557-a2b5-4526-a42d-a0386def9195)

## 🔧 Usage

### Add .env:
```sh
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key
```

### Install the dependencies:
```sh
npm install
```

### Start the development server:
```sh
npm run dev
```

### Run Prisma migrations:
```sh
npx prisma migrate dev
```
