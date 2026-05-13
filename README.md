<div align="center">

# 🏡 StayNest

### *Find your perfect stay, anywhere in the world.*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

A **full-stack property rental platform** inspired by Airbnb, built with the MERN stack. StayNest allows users to discover premium stays, make bookings, leave reviews, manage wishlists, and host their own properties — all through a sleek, glassmorphism-themed UI.

[Live Demo](#) · [Report Bug](https://github.com/nav-kumar495/StayNest/issues) · [Request Feature](https://github.com/nav-kumar495/StayNest/issues)

</div>

---

## 📸 Screenshots

> *Home page with hero search, property grid, and glassmorphism navbar.*

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Register & log in with JWT-based auth; sessions persist via `localStorage` |
| 🏠 **Property Listings** | Browse a grid of premium stays fetched from MongoDB Atlas |
| 🔍 **Smart Search** | Filter by destination, dates, and guest count from a rich search bar widget |
| 📅 **Bookings** | Book a property with check-in/check-out dates and total price calculation |
| 🗺️ **My Trips** | View your past and upcoming bookings in a dedicated dashboard |
| ❤️ **Wishlist** | Save favourite properties and manage your wishlist |
| ⭐ **Reviews** | Leave ratings and comments on properties you've visited |
| 🏡 **Host Dashboard** | Hosts can list and manage their own properties |
| 🎭 **Dual Role System** | A user can be both a guest and a host |
| 📱 **Responsive UI** | Mobile-friendly, glassmorphism design using Vanilla CSS |

---

## 🛠️ Tech Stack

### Frontend (`/client`)
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI library |
| **Vite** | 8 | Build tool & dev server |
| **React Router DOM** | 7 | Client-side routing |
| **Three.js / R3F** | 0.183 / 9 | 3D visual elements |
| **Lucide React** | 0.577 | Icon library |
| **Vanilla CSS** | — | Custom styling with glassmorphism |

### Backend (`/server`)
| Technology | Version | Purpose |
|---|---|---|
| **Node.js + Express** | 5 | REST API server |
| **Mongoose** | 9 | MongoDB ODM |
| **bcrypt** | 6 | Password hashing |
| **JSON Web Token** | 9 | Authentication tokens |
| **dotenv** | 17 | Environment variable management |
| **nodemon** | 3 | Dev server with hot reload |
| **MongoDB Atlas** | — | Cloud database |

---

## 📁 Project Structure

```
StayNest/
├── client/                     # React + Vite frontend
│   ├── public/
│   │   └── assets/             # Static assets (logos, images)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AuthModal.jsx   # Login / Register modal
│   │   │   ├── Footer.jsx      # Site footer
│   │   │   ├── Hero.jsx        # Landing hero section
│   │   │   ├── PropertyCard.jsx# Individual property card
│   │   │   └── SearchBar.jsx   # Location / date / guest search widget
│   │   ├── pages/              # Route-level page components
│   │   │   ├── PropertyDetails.jsx # Full property page with booking
│   │   │   ├── MyTrips.jsx     # Guest's bookings
│   │   │   ├── Wishlist.jsx    # Saved properties
│   │   │   ├── HostDashboard.jsx   # Host property management
│   │   │   └── Services.jsx    # Services / experiences page
│   │   ├── utils/
│   │   │   └── mockData.js     # Fallback mock properties for dev
│   │   ├── App.jsx             # Root component + router config
│   │   └── main.jsx            # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Node.js + Express backend
│   ├── models/                 # Mongoose data models
│   │   ├── User.js             # User schema (guest / host)
│   │   ├── Property.js         # Property listing schema
│   │   ├── Booking.js          # Booking schema
│   │   └── Review.js           # Review & rating schema
│   ├── routes/                 # Express REST API routes
│   │   ├── auth.js             # POST /register, POST /login
│   │   ├── properties.js       # GET/POST /properties
│   │   ├── bookings.js         # POST /bookings, GET /bookings/my
│   │   ├── reviews.js          # POST /reviews, GET /reviews/property/:id
│   │   └── users.js            # GET /users/me, favorites management
│   ├── seed.js                 # Database seed script
│   ├── index.js                # Server entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄️ Data Models

<details>
<summary><strong>User</strong></summary>

```js
{
  name:      String  (required),
  email:     String  (required, unique),
  password:  String  (required, bcrypt-hashed),
  isHost:    Boolean (default: false),
  favorites: [ObjectId → Property]
}
```
</details>

<details>
<summary><strong>Property</strong></summary>

```js
{
  title:        String  (required),
  description:  String  (required),
  pricePerNight:Number  (required),
  location:     String  (required),
  images:       [String],
  host:         ObjectId → User,
  amenities:    [String]
}
```
</details>

<details>
<summary><strong>Booking</strong></summary>

```js
{
  property:   ObjectId → Property,
  guest:      ObjectId → User,
  checkIn:    Date,
  checkOut:   Date,
  totalPrice: Number
}
```
</details>

<details>
<summary><strong>Review</strong></summary>

```js
{
  property: ObjectId → Property,
  user:     ObjectId → User,
  rating:   Number,
  comment:  String
}
```
</details>

---

## 🌐 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Create a new user account |
| `POST` | `/login` | Public | Authenticate and receive JWT |

### Properties — `/api/properties`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get all property listings |
| `GET` | `/:id` | Public | Get a single property by ID |
| `POST` | `/` | Host (JWT) | Create a new property listing |

### Bookings — `/api/bookings`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | Auth (JWT) | Create a new booking |
| `GET` | `/my` | Auth (JWT) | Get all bookings for logged-in user |

### Reviews — `/api/reviews`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | Auth (JWT) | Add a review to a property |
| `GET` | `/property/:id` | Public | Get all reviews for a property |

### Users — `/api/users`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/me` | Auth (JWT) | Get logged-in user profile |
| `POST` | `/favorites/:id` | Auth (JWT) | Toggle a property in favorites |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB)

### 1. Clone the Repository

```bash
git clone https://github.com/nav-kumar495/StayNest.git
cd StayNest
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

Start the backend server:

```bash
# Development (with hot reload)
npx nodemon index.js

# Or simply
node index.js
```

The server will start at `http://localhost:5000`.

### 3. Seed the Database *(Optional)*

Populate your database with sample properties:

```bash
cd server
node seed.js
```

### 4. Set Up the Frontend

```bash
cd ../client
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

> The frontend proxies API calls to the backend via Vite's dev server config.

---

## 🔧 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `PORT` | `server/.env` | Port for the Express server (default: 5000) |
| `MONGO_URI` | `server/.env` | MongoDB connection string |
| `JWT_SECRET` | `server/.env` | Secret key for signing JWT tokens |

---

## 📱 Application Routes (Frontend)

| Path | Page | Description |
|---|---|---|
| `/` | Home | Hero, search bar, property listings grid |
| `/property/:id` | Property Details | Full listing page with booking form & reviews |
| `/trips` | My Trips | View all bookings made by the logged-in user |
| `/wishlist` | Wishlist | Saved / favorited properties |
| `/host` | Host Dashboard | Manage your listed properties (hosts only) |
| `/services` | Services | Browse available services and experiences |
| `/explore` | Explore | *(Coming Soon)* Experiences page |

---

## 🏗️ Building for Production

```bash
# Build the frontend
cd client
npm run build

# The compiled output will be in client/dist/
# Serve it with a static server or configure Express to serve it
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

Please make sure your code follows the existing style and all API changes are reflected in this README.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Navneet Kumar**

- GitHub: [@nav-kumar495](https://github.com/nav-kumar495)

---

<div align="center">

Made with ❤️ and a lot of ☕

⭐ Star this repo if you found it helpful!

</div>
