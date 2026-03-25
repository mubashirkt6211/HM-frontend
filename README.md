🏥 Hospital Management System (HMS) - Frontend

A modern and scalable Hospital Management System frontend built using React, ShadCN UI, and Tailwind CSS.
This application helps manage hospital workflows like patients, doctors, appointments, billing, and more with a clean and responsive UI.

🚀 Features
🔐 JWT Authentication (Login / Register)
👨‍⚕️ Doctor Management
🧑‍🤝‍🧑 Patient Management
📅 Appointment Scheduling
💊 Pharmacy Management
🧪 Lab Test Module
📊 Dashboard with analytics
🧾 Billing & Invoices
🔔 Notifications
🌙 Dark / Light Mode
🎨 Modern UI using ShadCN
🛠️ Tech Stack
Frontend: React
UI Library: ShadCN UI
Styling: Tailwind CSS
Routing: React Router
State Management: Context API / Hooks
API Integration: Axios
Icons: Lucide
📁 Project Structure

src/
├── components/
├── pages/
├── layouts/
├── services/
├── hooks/
├── context/
├── lib/
├── assets/
└── App.jsx

⚙️ Installation & Setup
1. Clone the repository

git clone https://github.com/your-username/hms-frontend.git

cd hms-frontend

2. Install dependencies

npm install

3. Run the project

npm run dev

Open in browser:
http://localhost:5173

🎨 ShadCN Setup (if needed)

npx shadcn-ui@latest init

Add components:

npx shadcn-ui@latest add button card dialog input table

🔗 Backend Integration

Make sure your backend (Spring Boot HMS API) is running.

Update API base URL in:

src/lib/api.js

Example:

import axios from "axios";

export const api = axios.create({
baseURL: "http://localhost:8080/api
",
});

🔐 Authentication Flow
User logs in
JWT token stored in localStorage / cookies
Axios interceptor attaches token to requests
Protected routes restrict access
📦 Build for Production

npm run build

Preview:

npm run preview

🧪 Future Enhancements
AI-based recommendations
Advanced analytics dashboard
Mobile responsiveness improvements
Global search
Report export (PDF)
🤝 Contributing
Fork the repo
Create a new branch
Commit your changes
Push to GitHub
Open a Pull Request
📄 License

MIT License

👨‍💻 Author

Mubashir KT

If you want, I can upgrade this into a 🔥 GitHub standout README (badges + screenshots + live demo + animations) just say 👍

ys

Nice 🔥 let’s upgrade your README to a GitHub standout version (portfolio-level) — fully ready to copy 🚀

🏥 Hospital Management System (HMS) - Frontend










A modern, scalable Hospital Management System (HMS) frontend built with React + ShadCN UI + Tailwind CSS.
Designed for efficient hospital operations with a clean UI and smooth user experience.

✨ Live Demo

👉 https://your-live-demo-link.com

📸 Screenshots
🏠 Dashboard

👨‍⚕️ Doctor Management

🧑‍🤝‍🧑 Patient Management

📅 Appointments

🚀 Features
🔐 Secure JWT Authentication
👨‍⚕️ Manage Doctors
🧑‍🤝‍🧑 Manage Patients
📅 Book & Track Appointments
💊 Pharmacy Module
🧪 Lab Test Management
📊 Admin Dashboard & Analytics
🧾 Billing System
🔔 Notifications
🌙 Dark / Light Mode
⚡ Fast & Responsive UI
🛠️ Tech Stack
Category	Technology
Frontend	React
UI	ShadCN UI
Styling	Tailwind CSS
Routing	React Router
State	Context API
API Calls	Axios
Icons	Lucide
📁 Folder Structure

src/
├── components/
├── pages/
├── layouts/
├── services/
├── hooks/
├── context/
├── lib/
├── assets/
└── App.jsx

⚙️ Setup Instructions
1. Clone Repo

git clone https://github.com/your-username/hms-frontend.git

cd hms-frontend

2. Install Dependencies

npm install

3. Start Development Server

npm run dev

👉 http://localhost:5173

🔗 Backend Setup

Make sure your Spring Boot backend is running.

Update API config:

src/lib/api.js

import axios from "axios";

export const api = axios.create({
baseURL: "http://localhost:8080/api
",
});

🔐 Authentication
Login returns JWT
Token stored in localStorage
Axios interceptor attaches token
Protected routes secured
🧪 Upcoming Features
🤖 AI Health Insights
📱 Mobile Optimization
📊 Advanced Reports
🔍 Smart Search
📄 PDF Export
🤝 Contributing

Contributions are welcome!

Fork the repo
Create a new branch
Commit changes
Push to GitHub
Open PR
📄 License

MIT License

👨‍💻 Author

Mubashir KT

⭐ Support

If you like this project:

👉 Star this repo
👉 Share it with others
