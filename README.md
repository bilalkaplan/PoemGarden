# PoemGarden

**Live Demo:** [https://poem-garden.vercel.app](https://poem-garden.vercel.app)

PoemGarden is a comprehensive web application developed as a term project for a Web Development course. Built on the MERN Stack (MongoDB, Express.js, React, Node.js), it serves as a dedicated platform for poetry enthusiasts. Users can register, log in, share their original poems, and interact with other users' work through comments. The application is fully deployed, with the frontend hosted on Vercel and the backend hosted on Render, ensuring global accessibility.

## Technology Stack

**Frontend:**
- React.js (Vite)
- React Router DOM for routing
- Axios for API requests
- i18next for multi-language support (English, Turkish, Serbian, German)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose for database modeling
- JSON Web Token (JWT) and bcryptjs for secure authentication

## Core Features

- **Multi-Language Support (i18n):** The application is fully synchronized across four languages: Turkish (TR), English (EN), Serbian (SR), and German (DE).
- **Role-Based Access Control:** Differentiated access levels for standard users (Poets) and Administrators, allowing for structured content management.
- **Custom UI Design:** A custom-crafted, blog-style interface tailored for reading. It features a harmonious color palette, optimal whitespace, serif typography for poems, and subtle micro-animations for an elevated user experience.
- **Single Poem View & Deep Linking:** Users can copy links to specific poems. Opening these links isolates the poem on a dedicated view, with an option to return to the global feed.
- **Real-Time Interactions:** Dynamic comment sections with support for nested replies and immediate UI feedback upon creation, deletion, or editing.
- **Profile Management:** Users can update their biographies, names, and profile pictures. All original poems and comments are aggregated on the user's profile page.

## Installation & Setup

To run this project locally, follow the instructions below.

1. Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/bilalkaplan/PoemGarden.git
cd PoemGarden
```

2. Install backend dependencies and start the server:
```bash
cd backend
npm install
npm run dev
```

3. Install frontend dependencies and start the development server (in a new terminal tab):
```bash
cd frontend
npm install
npm run dev
```

## Developer
Bilal Kocakaplan
