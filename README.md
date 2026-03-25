🏥 Hospital Management System (HMS) - Frontend

A modern Hospital Management System frontend built using Angular and Tailwind CSS, designed to manage hospital operations like patients, doctors, appointments, billing, and more.

🚀 Features
🔐 Authentication (JWT आधारित login/register)
👨‍⚕️ Doctor Management
🧑‍🤝‍🧑 Patient Management
📅 Appointment Scheduling
💊 Pharmacy / Medicines Module
🧪 Lab Test Management
📊 Dashboard with Analytics
🧾 Billing & Payments
🔔 Notifications
🎨 Responsive UI (Tailwind CSS)
🛠️ Tech Stack
Frontend Framework: Angular (v18+)
Styling: Tailwind CSS
State Management: Services / RxJS
Authentication: JWT
Icons: Lucide / Heroicons
API Integration: REST APIs (Spring Boot Backend)
📁 Project Structure
src/
│
├── app/
│   ├── core/              # Auth, guards, interceptors
│   ├── shared/            # Reusable components
│   ├── modules/           # Feature modules
│   │   ├── dashboard/
│   │   ├── patients/
│   │   ├── doctors/
│   │   ├── appointments/
│   │   ├── billing/
│   │   ├── pharmacy/
│   │   └── lab/
│   │
│   ├── layout/            # Sidebar, Navbar
│   └── services/          # API services
│
├── assets/
└── environments/
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/hms-frontend.git
cd hms-frontend
2️⃣ Install dependencies
npm install
3️⃣ Run the project
ng serve

👉 Open in browser:

http://localhost:4200
🔗 Backend Integration

Make sure your Spring Boot HMS Backend is running.

Update API base URL in:

src/environments/environment.ts

Example:

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
🔐 Authentication Flow
User logs in
JWT token stored in localStorage
HTTP Interceptor adds token to requests
Route guards protect secured routes
📸 UI Highlights
Modern dashboard UI
Sidebar navigation
Responsive layouts
Clean card-based design
Data tables with filters
📦 Build for Production
ng build --configuration production

Output will be in:

dist/
🧪 Future Enhancements
📱 Mobile responsiveness improvements
📊 Advanced analytics dashboard
🤖 AI-based patient insights
🗂️ File upload (reports, prescriptions)
🌐 Multi-language support
🤝 Contributing

Contributions are welcome!

Fork the repo
Create your feature branch
Commit changes
Push to branch
Open a Pull Request
📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Mubashir KT

If you want, I can also:

Customize this README exactly to your current Angular project structure
Add screenshots UI sections
Add API documentation section
Or make it GitHub portfolio ready 🔥

Just tell me 👍

using react shadcn and tailwind

Here’s a clean, modern README.md tailored for your HMS Frontend using React + ShadCN + Tailwind CSS 👇

🏥 Hospital Management System (HMS) - Frontend

A modern and scalable Hospital Management System frontend built using React, ShadCN UI, and Tailwind CSS.
This application helps manage hospital workflows like patients, doctors, appointments, billing, and more with a clean and responsive UI.

🚀 Features
🔐 JWT Authentication (Login/Register)
👨‍⚕️ Doctor Management
🧑‍🤝‍🧑 Patient Management
📅 Appointment Scheduling
💊 Pharmacy Management
🧪 Lab Test Module
📊 Admin Dashboard with analytics
🧾 Billing & Invoices
🔔 Notifications System
🎨 Modern UI with ShadCN components
🌙 Dark / Light Mode support
🛠️ Tech Stack
Frontend: React (Vite / Next.js optional)
UI Library: ShadCN UI
Styling: Tailwind CSS
State Management: React Hooks / Context API
Routing: React Router
API Integration: Axios / Fetch
Icons: Lucide Icons
📁 Project Structure
src/
│
├── components/         # Reusable UI components (ShadCN based)
├── pages/              # Main pages (Dashboard, Patients, etc.)
├── layouts/            # Sidebar, Navbar layouts
├── services/           # API calls
├── hooks/              # Custom hooks
├── context/            # Global state management
├── lib/                # Utilities/helpers
├── assets/             # Images & icons
└── App.jsx
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/hms-frontend.git
cd hms-frontend
2️⃣ Install dependencies
npm install
3️⃣ Run the development server
npm run dev

👉 Open in browser:

http://localhost:5173
🎨 ShadCN Setup (if not already installed)
npx shadcn-ui@latest init

Add components:

npx shadcn-ui@latest add button card dialog input table
🔗 Backend Integration

Make sure your Spring Boot HMS Backend is running.

Update API base URL in:

src/lib/api.js

Example:

import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
});
🔐 Authentication Flow
User logs in
JWT token stored in localStorage / cookies
Axios interceptor attaches token to every request
Protected routes restrict unauthorized access
📊 UI Highlights
✨ Clean dashboard layout
📌 Sidebar navigation with icons
📈 Cards, tables, and charts
⚡ Fast and responsive design
🎯 Accessible UI components (ShadCN)
📦 Build for Production
npm run build

Preview build:

npm run preview
🧪 Future Enhancements
🤖 AI-based health insights
📱 Full mobile optimization
📊 Advanced reporting system
🔍 Global search functionality
🧾 PDF report generation
🤝 Contributing

Contributions are welcome!

Fork the repo
Create your feature branch (feature/new-feature)
Commit your changes
Push to GitHub
Open a Pull Request
📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Mubashir KT
