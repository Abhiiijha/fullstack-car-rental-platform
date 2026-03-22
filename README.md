# fullstack-car-rental-platform
A full-stack car rental application enabling users to browse, book, and manage vehicles, with an integrated admin panel for car and booking management.

## Overview

This project is a full-stack Car Rental Web Application developed as a final year project. It allows users to browse cars, check availability, and book vehicles, while providing an admin panel for managing cars and bookings.

The application is divided into three main modules: frontend (user interface), backend (API & database), and admin panel (management system).

---

## Live Demo

* User Website: https://your-frontend-link.com
* Admin Panel: https://your-admin-link.com

*(Links will be updated after deployment)*

---

## Project Structure

```
Final Year Project/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── carsData.js
│   │   │   ├── dummyStyles.js
│   │   │   └── images...
│   │   ├── components/
│   │   │   ├── Home.jsx
│   │   │   ├── HomeCars.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── other components...
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CarDetails.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   └── other pages...
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── routes/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── models/
│   │   ├── carModel.js
│   │   ├── bookingModel.js
│   │   └── userModel.js
│   ├── controllers/
│   │   ├── carController.js
│   │   ├── bookingController.js
│   │   └── authController.js
│   ├── routes/
│   │   ├── carRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── uploads/
│   │   ├── assets/
│   │   └── uploaded images...
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   ├── package.json
│   └── .env (optional)
│
└── admin/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── AdminNavbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── other components...
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── AddCar.jsx
    │   │   ├── ManageCars.jsx
    │   │   ├── Bookings.jsx
    │   │   └── other pages...
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── routes/
    ├── package.json
    └── vite.config.js
```

---

## Features

### User Side (Frontend)

* View available cars
* Check car details and specifications
* Real-time availability status
* Book cars with date selection

### Admin Panel

* Add new cars
* Update car details
* Delete cars
* Manage bookings

### Backend

* RESTful APIs for cars and bookings
* MongoDB database integration
* Image upload handling
* Availability calculation based on booking dates

---

## Technologies Used

### Frontend & Admin

* React.js
* Axios
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* Multer (for image uploads)

---

## Installation & Setup

### Backend

```
cd backend
npm install
npm start
```

### Frontend

```
cd frontend
npm install
npm run dev
```

### Admin Panel

```
cd admin
npm install
npm run dev
```

---

## Folder Description

### frontend/

Contains the user interface where customers can browse and book cars.

### backend/

Handles API requests, database operations, and business logic.

### admin/

Provides an interface for administrators to manage cars and bookings.

---

## Notes

* Car images are stored in the backend `uploads/` directory.
* Availability is dynamically calculated based on booking dates.
* Both manually added cars and database cars are supported.

---

## Conclusion

This project demonstrates a complete full-stack implementation of a car rental system, integrating frontend UI, backend APIs, and database management in a structured and scalable manner.
