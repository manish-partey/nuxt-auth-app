# Nuxt.js Application Starter

This is a robust Nuxt.js application template featuring modern web development tools and practices, including server-side API handling, state management, styling with Tailwind CSS, and environment configuration.

## ✨ Features

* **Nuxt 3 & Vue 3:** Leverages the latest versions for a performant and scalable application.
* **Tailwind CSS:** Utility-first CSS framework for rapid UI development, integrated via `@nuxtjs/tailwindcss`.
* **Pinia:** Intuitive, type-safe, and modular state management for your Vue components.
* **Server-Side API & Utilities:** Built with Nuxt's Nitro engine, including structured directories for API routes, database models, services, middleware, and reusable utilities.
* **Authentication (via JWT):** Configured for JSON Web Token-based authentication.
* **Email Service:** Setup with Nodemailer (SMTP configuration via environment variables).
* **MongoDB Integration:** Ready for connection to a MongoDB database using Mongoose.
* **TypeScript:** Full TypeScript support for enhanced developer experience and code maintainability.
* **ESLint & Prettier:** Pre-configured for consistent code quality and formatting.

## 🚀 Setup

Make sure you have Node.js installed. Using a Node Version Manager like [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) is highly recommended to manage your Node.js versions.

```bash
# Ensure you are using Node.js v18.18.2 or compatible LTS version
nvm use 18.18.2

# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install


# .env example
# --- DATABASE ---
MONGO_CONNECTION_STRING="your_mongodb_connection_string"

# --- AUTHENTICATION ---
JWT_SECRET="your_jwt_secret_key" # Use a strong, random string (e.g., generated with `openssl rand -base64 32`)

# --- EMAIL SERVICE ---
EMAIL_HOST="smtp.example.com"
EMAIL_PORT="587" # e.g., 587 for TLS, 465 for SSL
EMAIL_USER="your_email_username"
EMAIL_PASS="your_email_password"

# --- PUBLIC URL (Client & Server) ---
NUXT_PUBLIC_APP_URL="http://localhost:3000" # Or your production URL

# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev

# Run ESLint to check for code issues
npm run lint

# Run Prettier to format code

npm run format

# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build

# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview