# PoemGarden

**Live Environment:** [https://poem-garden.vercel.app](https://poem-garden.vercel.app)

PoemGarden is a full-stack web application constructed with the MERN stack (MongoDB, Express.js, React, Node.js). It operates as a content management and social platform specifically designed for publishing and reviewing poetry. The system architecture separates the client-side rendering from the RESTful API backend. The frontend application is deployed on Vercel, while the backend API runs on Render, utilizing MongoDB Atlas for cloud database provisioning.

## System Architecture

### Frontend Layer
- **Framework:** React.js initialized via Vite for optimized build processing and hot module replacement.
- **Routing:** React Router DOM manages client-side navigation without page reloads.
- **State Management & Data Fetching:** React Hooks (`useState`, `useEffect`) combined with Axios for asynchronous HTTP requests to the backend API.
- **Internationalization (i18n):** `i18next` is integrated for real-time localization. Supported locales include English (EN), Turkish (TR), Serbian (SR), and German (DE). The language state is globally accessible and persists across sessions.
- **Styling:** A custom CSS methodology is employed, utilizing native CSS variables for color tokenization and consistent theming. The design system strictly relies on standard CSS rather than utility-first frameworks.

### Backend Layer
- **Runtime Environment:** Node.js.
- **Framework:** Express.js for routing and middleware configuration.
- **Database:** MongoDB, interfaced through the Mongoose ODM (Object Data Modeling) library to enforce schema validation and query structuring.
- **Authentication:** JSON Web Tokens (JWT) are generated upon successful login. Passwords are mathematically hashed using `bcryptjs` before database insertion. Middleware functions intercept incoming requests to validate the Bearer token for protected routes.

## Functional Specifications

### User Management
- **Registration & Authentication:** Users can register accounts. Form data undergoes validation before backend transmission. The authentication layer uses JWTs for stateless session management.
- **Role-Based Access Control (RBAC):** The database schema defines user roles (e.g., standard user, administrator). Administrative users hold elevated privileges, such as the capability to globally delete poems or user accounts.

### Content Operations (CRUD)
- **Poetry Publication:** Authenticated users can create, read, update, and delete (CRUD) their own text entries.
- **Font Customization:** The creation form includes a mechanism for users to select specific font families (e.g., Lora, Merriweather) which is stored in the database document and rendered dynamically on the client side.

### Social Interactions
- **Comment System:** Users can attach comments to specific poem documents.
- **Nested Replies:** The schema supports a hierarchical data structure, allowing replies to specific comments.
- **Modification:** Users retain the ability to edit or delete their own comments and replies. The UI reflects these state changes instantly.

### Infrastructure & Deployment
- **CORS Configuration:** The Express backend is configured with strict CORS policies, restricting API access to the Vercel-hosted frontend domain.
- **Environment Variables:** Confidential keys (Database URIs, JWT Secrets) are securely managed through `.env` files locally and environment variables in the production deployment platforms.

## Local Development Setup

To initialize the project in a local environment, execute the following commands in the terminal.

1. Clone the repository:
```bash
git clone https://github.com/bilalkaplan/PoemGarden.git
cd PoemGarden
```

2. Configure the Backend:
```bash
cd backend
npm install
# Ensure a .env file exists in the backend directory containing MONGODB_URI and JWT_SECRET
npm run dev
```

3. Configure the Frontend (in a separate terminal process):
```bash
cd frontend
npm install
npm run dev
```

## Developer
Bilal Kocakaplan
