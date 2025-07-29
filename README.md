# Skill Sync

A developer-focused platform where employers post coding problems and developers compete to solve them in contest-style challenges. Inspired by hackathons, topcoder, freelance boards, and a love of code battles.

---

## Project Goal

To build a full-stack web application that enables:

- Employers or business owners to post real-world coding problems
- Developers to join contests and submit solutions
- A winner to be selected for each challenge and earn prize

Built as the **capstone project** for a 3-month full-stack development program.

---

## Tech Stack

**Programming Language:** TypeScript  
**Frontend:** Next.js + Tailwind  
**Backend:** Node.js + Express  
**Database:** MongoDB  
**Authentication:** JWT  
**File Uploads:** Multer  
**Email:** Nodemailer  
**Deployment:** Vercel + Render/Railway

---

## Project Structure (Monorepo)

---

## Getting Started

1. Clone the repo  
   `git clone git@github.com:TheAnasObaid/SkillSync.git`
2. Install dependencies
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

### Environment variables

In order for this to work, you should create two `.env` files. One in your `frontend` directory and second in your `backend` directory.

**Frontend:**

1. NEXT_PUBLIC_API_URL
2. NEXT_PUBLIC_API_BASE_URL

**Backend:**

1. MONGO_URI
2. PORT=5000
3. JWT_SECRET
4. EMAIL_HOST
5. EMAIL_PORT
6. EMAIL_USERNAME
7. EMAIL_PASSWORD
8. EMAIL_FROM

### In separate terminals

```bash
cd frontend && npm run dev
cd backend && npm run dev
```
