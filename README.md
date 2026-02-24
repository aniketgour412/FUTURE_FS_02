# 🌌 Darken Core - Client Lead Management System (Mini CRM)

*An ultra-premium, "mega-attractive" Mini CRM built for modern agencies, freelancers, and businesses tracking inbound web leads.*

## ✨ Features
- **Centralized Lead Data**: View all inbound leads in a secure, hyper-glassmorphism dashboard.
- **Real-Time Status Shifting**: Instantly update lead states (New, Contacted, Converted) via 3D interactive floating status selects.
- **Deep Profiling & Notes**: Expand any lead to view a full "Data Profile" and append time-stamped system logs/follow-up notes.
- **Advanced Search & Filtering**: Instantly filter the pipeline by status, or search the entire database by name and email.
- **Secure Admin Command Center**: JWT-protected authentication portal.
- **"Liquid Nebula" Aesthetic**: A completely bespoke, extreme-premium CSS architecture simulating slow-shifting liquid dark matter and deep neon glows.

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite), Vanilla CSS (Advanced Variables and Animations), `lucide-react` for iconography.
- **Backend**: Node.js, Express.js.
- **Database**: Zero-configuration JSON flat-file storage for immediate execution and high portability.
- **Auth**: JSON Web Tokens (JWT).

## 🚀 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd CRM
   ```

2. **Setup and Run Backend:**
   ```bash
   cd backend
   npm install
   
   # Create a .env file with the following variables:
   # PORT=5000
   # ADMIN_USERNAME=admin
   # ADMIN_PASSWORD=password
   # JWT_SECRET=your_super_secret_key_123

   npm start
   ```

3. **Setup and Run Frontend:**
   ```bash
   # Open a new terminal instance
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application:**
   Open the browser to the provided local address (usually `http://localhost:5173`).
   Navigate to `/login` to access the Admin Dashboard.
