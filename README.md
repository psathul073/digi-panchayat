
# 🏛️ Digital E-Gram Panchayat - Web Application

A role-based web application built to streamline village-level governance services. Citizens can apply for services online, staff members can manage applications, and administrators can define services dynamically—all from a centralized, digital platform.

---

## 🚀 Live Demo

👉 [Live Link]

---

## 🧩 Features

### 👤 Citizen (User)
- Register/Login securely
- View & apply for available services
- Track service request status: **Pending / Approved / Rejected**
- View and **download certificates** (PDF format)
- See **rejection reasons** if denied

### 🧑‍💼 Staff
- Login using assigned credentials
- View and manage service requests
- **Approve or Reject** applications
- Track overall request data (counts, filters, etc.)

### 🛡️ Admin
- Role-based login
- **Add / Update / Delete** services (with **dynamic form** generation)
- Manage staff accounts
- Monitor and oversee all service activity

---

## 🧠 What I Learned

- 🔐 Role-Based Authentication using Firebase Auth
- 🌐 Real-time Firestore integration
- 🧱 Dynamic form builder based on service fields
- 📄 PDF generation for certificates using `react-to-pdf`
- 🧩 Modular, component-based design (React or plain JavaScript)
- ✅ Secure, testable, and scalable app structure
- 📦 Hosting and deployment (Firebase / Vercel / Netlify)

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (or React)
- **Backend / DB:** Firebase Firestore
- **Authentication:** Firebase Auth
- **PDF Generation:** `react-to-pdf`
- **Hosting:** Firebase Hosting / Vercel / Netlify

---

## 🔐 Role-Based Access Control

| Role    | Permissions                                                                 |
|---------|------------------------------------------------------------------------------|
| User    | Apply for services, download certificates, view application status          |
| Staff   | View/manage requests, approve/reject, view total request stats              |
| Admin   | Full control over services and staff, dynamic form creation for services    |

---

## 🧪 Testing & Validation

- 🧹 Form validation and field-level checks
- 📋 Action-based logging (for admin)
- 📄 Certificate view/download tested on all roles
- 📱 Responsive and mobile-friendly design

---


## 📄 How to Run
- Frontend :
1. Clone the repo
   ```bash
   git clone https://github.com/psathul073/digi-panchayat.git
   cd Client
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Add your Firebase config in `firebase.js`

4. Run the app
   ```bash
   npm run dev
   ```
- Backend :
1. Clone the repo
   ```bash
   git clone https://github.com/psathul073/digi-panchayat-server.git
   cd Server
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Add your Firebase SDK config in `firebase.js`

4. Run the app
   ```bash
   npm start
   ```

---

## 📚 Future Enhancements

- Add notifications or email alerts
- Add analytics for admin (charts, reports)
- Allow editing of submitted applications
- Multi-language support for local access

---

## 🙌 Author

**Athul PS**  
📧 psathul073@gmail.com 
💼 [LinkedIn](https://www.linkedin.com/in/athul-fullstack) • [GitHub](https://github.com/psahul073)

---

## 📝 License

This project is licensed under the MIT License.
