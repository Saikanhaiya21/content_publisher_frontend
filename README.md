# Content Publisher Frontend

## Overview
Frontend for the Content Publisher App, built with **React**, **TypeScript**, and **React Router v7**. Connects with the Rails backend API.

---

## Features

User signup and login
- View list of user's publications
- Create, edit, delete publications
- Change publication status (draft, published, archived)
- Loading and error states for UX
- Optional bonus features:
  - Bulk delete publications
  - Search by title
  - Filter by status
  - Public view for published items
---

## Prerequisites

- React v18+
- TypeScript
- React Router v7
- Axios (or Fetch API)

---

## Setup

**Clone the repository:**
```bash
git clone https://github.com/Saikanhaiya21/content_publisher_frontend.git
cd content_publisher_frontend
```
**Install dependencies:**
```bash
npm install
```
**Configure environment variables:**
Create a .env file in the frontend root:
```bash
VITE_API_BASE_URL=https://content-publisher-c27m.onrender.com #or
VITE_API_BASE_URL=http://localhost:3000
```

**Start Server:**
```bash
npm run dev
```
The app will be available at:
```bash
http://localhost:5174
```