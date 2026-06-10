$git = "C:\Program Files\Git\cmd\git.exe"

& $git init
& $git config user.name "Student"
& $git config user.email "student@university.edu"

# 1. Initial setup
& $git add .gitignore README.md
& $git commit -m "Initial commit: Project setup and configurations"

# 2. Backend server
& $git add backend/package.json backend/package-lock.json backend/server.js
& $git commit -m "Backend: Setup Express server and basic structure"

# 3. Backend models
& $git add backend/models
& $git commit -m "Backend: Implement MongoDB models for User, Poem, and Comment"

# 4. Backend controllers and routes
& $git add backend/controllers backend/routes
& $git commit -m "Backend: Add Controllers and API endpoints"

# 5. Backend middleware and env
& $git add backend/middleware backend/.env
& $git commit -m "Backend: Implement JWT authentication and error handling"

# 6. Frontend initial
& $git add frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/index.html frontend/eslint.config.js
& $git commit -m "Frontend: Initial Vite setup and project dependencies"

# 7. Frontend core structure
& $git add frontend/src/main.jsx frontend/src/App.jsx frontend/src/App.css frontend/src/index.css frontend/src/components/Navbar.jsx frontend/src/components/Footer.jsx
& $git commit -m "Frontend: Implement core UI layout (Navbar, Footer, App structure)"

# 8. Frontend auth
& $git add frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx frontend/src/i18n.js
& $git commit -m "Frontend: Add Authentication views and i18n support"

# 9. Frontend poems
& $git add frontend/src/pages/Home.jsx frontend/src/components/PoemCard.jsx frontend/src/components/PoemForm.jsx frontend/src/components/LoadingSpinner.jsx
& $git commit -m "Frontend: Implement Poem feed and Poem creation forms"

# 10. Frontend comments and profile
& $git add frontend/src/components/CommentSection.jsx frontend/src/pages/Profile.jsx frontend/src/components/Notifications.jsx frontend/src/components/Toast.jsx
& $git commit -m "Frontend: Add Commenting system, User Profile and UI Notifications"

# 11. Documentation
& $git add DOKUMANTASYON.md PROJECT_COMPLETION.md
& $git commit -m "Docs: Add UML diagrams and final project documentation"

# Add remaining files if any
& $git add .
& $git commit -m "Chore: Final optimizations and remaining assets"

& $git log --oneline
