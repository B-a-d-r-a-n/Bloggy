# Bloggy - Frontend

Welcome to the frontend of Bloggy, a modern, feature-rich blogging platform. This project was built with React, TypeScript, and the TanStack ecosystem, focusing on a clean user experience and a robust, type-safe architecture.

![Screenshot of Bloggy Homepage](https://media.discordapp.net/attachments/648910564818550799/1384650578277437501/image.png?ex=685333d7&is=6851e257&hm=10b9be711c9db39ff99adc88083ab67bc3a67077a8a69c053385c3f9e6325293&=&format=webp&quality=lossless&width=1039&height=584)

**Live Demo:** [https://bloggy-beta-seven.vercel.app/about](https://bloggy-beta-seven.vercel.app/about)

---

## ✨ Features

- **Full CRUD for Articles:** Create, read, update, and delete articles with a rich text editor.
- **User Authentication:** Secure JWT-based authentication with `httpOnly` refresh tokens.
- **Interactive Commenting:** Nested comments and replies with edit/delete functionality.
- **Reputation System:** Users can "star" articles, and authors accumulate total stars.
- **User Profiles:** View author profiles and update your own profile picture.
- **Search & Filtering:** Dynamic, real-time search for articles by title, author, and category.
- **Infinite Scrolling:** Smooth, infinite scroll on the main article list.
- **Theming:** Seamless light and dark mode support.
- **Responsive Design:** A polished UI that works beautifully on all screen sizes.

---

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Routing:** [TanStack Router](https://tanstack.com/router/)
- **Data Fetching & State Management:** [TanStack Query (React Query)](https://tanstack.com/query/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [DaisyUI](https://daisyui.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
- **API Client:** [Axios](https://axios-http.com/) with interceptors for auth and feedback.
- **UI Feedback:** [react-hot-toast](https://react-hot-toast.com/) for notifications and [NProgress](https://github.com/rstacruz/nprogress) for page load indicators.

---

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/B-a-d-r-a-n/Bloggy.git
    cd bloggy-frontend
    ```

2.  **Install NPM packages:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the URL of your running backend API:

    ```env
    VITE_API_URL=http://localhost:3000
    ```

    You will also need an API key for the rich text editor if you chose one that requires it (e.g., TinyMCE).

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

---

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the code using ESLint.

---

## Acknowledgements

- Hat tip to the teams behind TanStack, Vercel, and Tailwind CSS for creating amazing tools for developers.
