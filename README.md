# 🧠 SocioCrate - AI-Enhanced Social Media Platform

> **Connect. Share. Evolve with Intelligence.**

SocioCrate is a modern, full-stack social networking application that integrates **Generative AI** directly into the user experience. Beyond standard social features like posting and following, it leverages **Google Gemini** to act as an intelligent assistant—summarizing complex discussions, suggesting professional replies, and even analyzing resumes for job readiness. Built with the **PERN Stack** (PostgreSQL, Express, React, Node.js) and **TypeScript**.

---

## 🚀 Live Demo
**[Click here to Explore SocioCrate](https://socio-crate.vercel.app/)** *(Note: As this is hosted on a free tier, the server may take a minute to spin up on the first load.)*

---

## 📸 Screenshots

### 🤖 AI-Powered Interactions
| **Smart Discussion Summarization** | **Context-Aware Reply Suggestions** |
|:---:|:---:|
| ![AI Summary](./client/src/assets/ai_generated_summary.png) | ![AI Reply](./client/src/assets/ai_generated_comment.png) |
| *Instantly summarizes long comment threads* | *Generates relevant replies based on context* |

### 📱 Interactive Feed & Media
| **Your Personal Feed** | **Rich Media Support** |
|:---:|:---:|
| ![Feed UI](./client/src/assets/feed1.png) | ![Video Support](./client/src/assets/feed2.png) |
| *Clean interface for posts and updates* | *Support for image and video playback* |

### 👤 User Profile
| **Profile Management** |
|:---:|
| ![Profile](./client/src/assets/profile.png) |
| *Manage bio, followers, and portfolio files* |

---

## ✨ Key Features

### 🤖 Intelligent AI Tools (Gemini Integrated)
* **Discussion Summarizer:** Uses AI to condense long, complex comment threads into a concise summary, helping users catch up instantly.
* **Smart Reply Assistant:** Analyzes the post and previous comments to generate thoughtful, context-aware reply suggestions with a single click.
* **Resume Analyzer:** A dedicated tool that parses PDF resumes and portfolio links, providing a "Job Readiness Score" and actionable feedback.

### 📱 Core Social Experience
* **Rich Media Posts:** Users can share thoughts with support for multiple image and video uploads.
* **Real-Time Feed:** Dynamic feed displaying posts from followed users and the community.
* **Follow System:** Build your network by following other developers and creators.
* **User Profiles:** Customizable profiles with descriptions, profile pictures, and file portfolios.

### 🔐 Authentication & Security
* **Secure Auth:** Robust registration and login system using **JWT (JSON Web Tokens)**.
* **Password Hashing:** User passwords are encrypted using **BCrypt** for maximum security.
* **Protected Routes:** Middleware ensures only authenticated users can access private features.

---

## 🛠️ Tech Stack

### Frontend
* **React 19:** Modern UI development with Hooks and Functional Components.
* **TypeScript:** Ensuring type safety and code reliability.
* **Tailwind CSS (v4):** Rapid, utility-first styling for a responsive design.
* **Axios:** Handling HTTP requests to the backend.
* **React Hot Toast:** Elegant notifications for user actions.

### Backend
* **Node.js & Express:** Scalable server-side logic and RESTful API.
* **PostgreSQL:** Relational database for structured data (Users, Posts, Comments).
* **Prisma ORM:** Type-safe database access and schema management.
* **Google Gemini API:** Powering the generative AI features.
* **Multer:** Handling file uploads (Disk storage for posts, Memory storage for AI analysis).

---

## ⚙️ Installation & Local Setup

To run this project locally, you need **Node.js** and **PostgreSQL** installed.

### 1. Clone the Repository
```bash
git clone https://github.com/Krishna18113/Socio_Crate.git
cd socio-crate
```

### 2. Backend Setup
Navigate to the server folder and install dependencies.
```bash
cd server
npm install
```
Create a .env file in server/ with the following credentials:
DATABASE_URL="postgresql://user:password@localhost:5432/sociocrate"
JWT_SECRET="your_secret_key"
GEMINI_API_KEY="your_google_gemini_key"
PORT=5000
BASE_URL="http://localhost:5000"

Run migrations and start the server:
```bash
npx prisma migrate dev --name init
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the client folder, and install dependencies.
```bash
cd client
npm install
```
Create a .env file in client/:
VITE_API_URL="http://localhost:5000/api"
Start the React application:
```bash
npm run dev
```
The app should now be running on http://localhost:5173.

## 🔮 Future Improvements
- Real-Time Notifications: Socket.io integration for instant alerts on likes and comments.
- Direct Messaging: Private chat functionality between followers.
- Advanced Search: Full-text search for finding users and posts.
- Dark Mode: Built-in theme toggling for better accessibility.

## 👤 Author
### Gattu Krishna Venkat Sai
- LinkedIn: gattu-krishna-venkat-sai-4ab372328
- GitHub: Krishna18113
- Gmail: gattukrishnavenkatsai@gmail.com

## Created with ❤️, Code, and AI.
