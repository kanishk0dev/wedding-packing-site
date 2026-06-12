# 💍 Shringaar Packing Studio
### Wedding & Gift Packing Services Website

A full-stack web application built with **ReactJS**, **NodeJS**, and **MongoDB** for a professional packing services business.

---

## 🌐 Live Demo

| | Link |
|---|---|
| 🌐 Customer Website | [https://wedding-packing-site-frontend.onrender.com](https://wedding-packing-site-frontend.onrender.com) |
| 🔐 Admin Panel | [https://wedding-packing-site-frontend.onrender.com/admin/login](https://wedding-packing-site-frontend.onrender.com/admin/login) |

---

## 📋 About The Project

Shringaar Packing Studio is a complete web platform for a packing services business. The website allows customers to explore packing services, view the gallery, and place enquiries. The admin panel allows the business owner to manage all website content and customer enquiries.

---

## ✨ Features

### 🌐 Customer Website
- Beautiful homepage with hero section, services preview, and testimonials
- Services page with 9 packing services and category filters
- Photo gallery with masonry layout and lightbox
- Enquiry form with service selection, event details, and budget
- Contact page with WhatsApp integration
- Fully mobile responsive design

### 🔐 Super Admin Panel
- Secure JWT login system
- Dashboard with enquiry statistics
- Manage customer enquiries with status tracking
- Add, edit, delete, and hide services
- Upload and manage gallery photos
- Manage customer testimonials
- Update website settings, contact info, and social media links
- Change admin password

---

## 🛍️ Services Covered

| Service | Category |
|---------|----------|
| 👗 Lehenga Packing | Wedding |
| 🤵 Suit Packing | Wedding |
| 🥻 Saree Packing | Wedding |
| 💍 Ring Ceremony Trays | Wedding |
| 💎 Jewellery Packing | Wedding |
| 👶 Baby Shower Packing | Baby Shower |
| 🎂 Birthday Gift Packing | Birthday |
| ❤️ Anniversary Packing | Anniversary |
| 🍱 Food Items Packing | Food |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | ReactJS 18 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Styling | CSS3 with Custom Properties |
| Notifications | React Toastify |
| Backend | NodeJS + ExpressJS |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| File Upload | Multer |
| Frontend Deploy | Render (Static Site) |
| Backend Deploy | Render (Web Service) |
| Database Host | MongoDB Atlas |

---

## 📁 Project Structure

```
wedding-packing/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── Gallery.js
│   │   ├── Enquiry.js
│   │   ├── Testimonial.js
│   │   └── Settings.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── services.js
│   │   ├── gallery.js
│   │   ├── enquiries.js
│   │   ├── testimonials.js
│   │   └── settings.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── utils/
│   │   └── seedAdmin.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── pages/
        │   ├── customer/
        │   │   ├── HomePage.js
        │   │   ├── ServicesPage.js
        │   │   ├── GalleryPage.js
        │   │   ├── EnquiryPage.js
        │   │   └── ContactPage.js
        │   └── admin/
        │       ├── AdminLogin.js
        │       ├── AdminDashboard.js
        │       ├── AdminEnquiries.js
        │       ├── AdminServices.js
        │       ├── AdminGallery.js
        │       ├── AdminTestimonials.js
        │       └── AdminSettings.js
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.js
        │   │   └── Footer.js
        │   └── admin/
        │       └── AdminLayout.js
        ├── context/
        │   └── AuthContext.js
        ├── utils/
        │   └── api.js
        ├── App.js
        └── index.js
```

## 🔐 Admin Credentials

```
Email:    admin@shringaar.com
Password: Admin@123
```
