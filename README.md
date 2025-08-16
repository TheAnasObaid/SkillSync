# SkillSync: The Challenge-Based Hiring Platform

**SkillSync** is a full-stack web application designed to revolutionize technical hiring. It's a developer-focused platform where companies post real-world coding challenges and talented developers compete to provide the best solution, showcasing their practical skills over traditional resumes.

This project was built to demonstrate a modern, robust, and scalable web architecture using a unified Next.js framework.

---

## ✨ Core Features

- **Client Dashboard:** Clients can post, fund, manage, and review submissions for their coding challenges.
- **Developer Dashboard:** Developers can find challenges, submit their solutions, and manage their public profiles and portfolios.
- **Admin Panel:** Administrators have a high-level overview of the platform, with tools to manage users and all submissions.
- **Secure Authentication:** A complete JWT-based authentication system with email verification and password reset functionality.
- **Challenge & Submission System:** A comprehensive system for challenge creation, solution submission (including file uploads), and a review/winner selection workflow.

---

## 🛠️ Tech Stack & Architecture

This project has been architected as a **unified, full-stack Next.js 14 application** using the App Router. The original separate Express.js backend has been fully migrated into Next.js API Routes, creating a single, cohesive, and highly performant codebase.

- **Framework:** **Next.js 14** (App Router)
- **Language:** **TypeScript**
- **Styling:** **Tailwind CSS** with **DaisyUI**
- **Database:** **MongoDB** with **Mongoose**
- **Client State Management:** **TanStack Query (React Query)** & **Zustand**
- **Authentication:** **Next.js API Routes** with **JWT** & secure `HttpOnly` cookies
- **Form Management:** **React Hook Form** with **Zod** for validation
- **File Storage:** Local file system (via API Routes)
- **Email Service:** **Nodemailer**

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn
- A local or cloud-based MongoDB instance

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/TheAnasObaid/SkillSync.git
    cd SkillSync
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a single `.env.local` file in the **root** of the project. Copy the contents of `.env.example` (if available) or use the template below.

    ```env
    # .env.local

    # Database
    MONGO_URI="your_mongodb_connection_string"

    # Authentication
    JWT_SECRET="your_super_secret_jwt_string_of_at_least_32_chars"

    # Next.js Server URL (for email links, etc.)
    # For local development, this is usually:
    CLIENT_URL="http://localhost:3000"

    # Email Service (using a service like Mailtrap.io for development is recommended)
    EMAIL_HOST="smtp.mailtrap.io"
    EMAIL_PORT=2525
    EMAIL_USERNAME="your_mailtrap_username"
    EMAIL_PASSWORD="your_mailtrap_password"
    EMAIL_FROM='"SkillSync" <noreply@skillsync.app>'
    ```

### Running the Application

Since this is a unified Next.js project, you only need **one command** to run the entire application (frontend, backend API, etc.).

1.  **Start the development server:**

    ```bash
    npm run dev
    ```

2.  Open your browser and navigate to `http://localhost:3000`.

### Seeding the Database (Optional but Recommended)

To populate your local database with a rich set of test data (users, challenges, submissions), run the seed script:

```bash
npm run seed
```
