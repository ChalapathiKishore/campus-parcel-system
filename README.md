# 📦 Campus Parcel Notification System

A simple web-based parcel management system designed for college campuses.
Gatekeepers can register parcels and students can view their parcel status from their dashboard.

🔗 **Live Demo:**
https://campus-parcel-system.vercel.app

---

## 🚀 Features

### 👨‍🎓 Student

* Secure login
* View parcel status
* See latest parcel updates
* Dark mode support

### 🛡 Gatekeeper

* Add parcel using student roll number
* Search parcels
* Mark parcels as collected
* Instant notification system (Demo)

---

## 🏗 Tech Stack

* HTML
* CSS
* JavaScript
* Supabase (Database + Authentication)
* Supabase Edge Functions
* Vercel (Deployment)

---

## 📂 Project Structure

```
PROJECT_2_PARCEL/
│
├── index.html
├── dashboard.html
├── css/
├── js/
│   ├── auth.js
│   ├── dashboard.js
│   └── supabaseClient.js
└── supabase/functions/send-email/
```

---

## 🧠 How It Works (Demo Flow)

1. Gatekeeper logs in.
2. Gatekeeper enters student roll number.
3. Parcel is added to database.
4. Student logs in.
5. Student sees parcel status in dashboard.
6. Gatekeeper marks parcel as collected when received.

---

## 🖥 Demo Steps

### 🔐 Login

* Register as student or gatekeeper.
* Login using your credentials.

### 📦 Add Parcel (Gatekeeper)

* Go to Gatekeeper Dashboard.
* Enter student roll number.
* Enter courier name.
* Click **Add Parcel**.

### 👨‍🎓 Student View

* Login as student.
* Open dashboard.
* View parcel status (Pending / Collected).

---

## 📸 Screenshots

### 🏠 Login Page

(Add screenshot here)

### 🛡 Gatekeeper Dashboard

(Add screenshot here)

### 👨‍🎓 Student Dashboard

(Add screenshot here)

### 📦 Parcel Added Notification

(Add screenshot here)

---

## 🌐 Deployment

Frontend deployed using **Vercel**.
Backend powered by **Supabase**.

---

## 🔮 Future Improvements

* Email notification integration
* SMS alerts
* Real-time updates
* Admin analytics dashboard

---

## 👨‍💻 Author

Chalapathi Kishore
Final Year ECE Student
Aspiring Software Engineer

---
