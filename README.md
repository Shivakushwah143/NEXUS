Nexus Commerce Platform
A complete, production-ready full-stack e-commerce platform built with modern web technologies.
<img width="1901" height="865" alt="image" src="https://github.com/user-attachments/assets/bb050ac3-14d0-40ed-87b9-62776058dc9f" />

<img width="1832" height="847" alt="image" src="https://github.com/user-attachments/assets/21bc04e4-b4ae-4b3e-8b46-dc2ceda15cbe" />

<img width="1695" height="800" alt="image" src="https://github.com/user-attachments/assets/fa9894ae-675f-48e7-9e24-32f5932f299f" />



🚀 Quick Start
Prerequisites
Node.js 16+

MongoDB

npm or yarn

Backend Setup
bash
cd backend
npm install
npm run dev
Server runs on http://localhost:5000

Frontend Setup
bash
npm install
npm run dev
App runs on http://localhost:5173

📦 What's Included
Backend Features
User authentication (JWT + OTP)

Product CRUD operations

Shopping cart & orders

Stripe payment integration

Admin dashboard

MongoDB with Mongoose

Frontend Features
Modern React + TypeScript UI

Responsive design (Tailwind CSS)

Smooth animations (Framer Motion)

User dashboard

Admin panel

Real-time cart updates

Product detail pages

🔧 Tech Stack
Frontend: React 18, TypeScript, Tailwind CSS, Framer Motion, Axios
Backend: Node.js, Express, MongoDB, Mongoose, JWT, Stripe
Tools: Vite, ESLint, Prettier

📁 Project Structure
text
nexus-commerce/
├── backend/
│   ├── src/
│   │   ├── db/           # MongoDB models
│   │   ├── routes/       # API endpoints
│   │   ├── utils/        # Helper functions
│   │   └── middleware/   # Auth middleware
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   └── App.tsx       # Main application
│   └── package.json
└── README.md
🔑 Default Credentials
User Test Account:

Username: testuser

Password: password123

Admin Account:

Username: admin

Password: admin123

🛠️ API Endpoints
Method	Endpoint	Description
POST	/api/v1/user/signup	User registration
POST	/api/v1/user/signin	User login
GET	/api/v1/user/me	Get current user
GET	/api/v1/product	Get all products
POST	/api/v1/product	Create product (admin)
🌐 Environment Variables
Create .env file in backend:

env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
PORT=5000
🚦 Running in Production
bash
# Build frontend
npm run build

# Start backend
npm start
🧪 Testing the App
Start both servers (backend on 5000, frontend on 5173)

Register a new account or use test credentials

Browse products in the shop

Add items to cart

Checkout with Stripe test card: 4242 4242 4242 4242

Admin login to manage products

🤝 Contributing
Fork the repository

Create feature branch

Commit changes

Push to branch

Open pull request

📞 Support
Open an issue for bugs or feature requests.

