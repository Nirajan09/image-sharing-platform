# 📷 Image Sharing Platform

An image sharing web application where users can upload, view, and share images with others. Built with a modern tech stack to support seamless media uploads, user authentication, and responsive design.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech](https://img.shields.io/badge/MERN-Stack-blue.svg)

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🧾 About the Project

This platform allows users to upload images, organize them by categories or tags, and share them publicly or privately. Users can sign up, log in, and manage their own image galleries. The platform includes features like image preview, image deletion, and user-based access control.

---

## ✅ Features

- 🔐 User authentication (login/register)
- 🖼 Upload and preview images
- 📁 Organize images 
- 🔍 View public image gallery
- ❌ Delete uploaded images

---

## 🛠 Tech Stack

| Technology   | Description                    |
|------------  |--------------------------------|
| React        | Frontend UI                    |
| Node.js      | Backend server runtime         |
| Express.js   | Backend framework              |
| MongoDB      | NoSQL Database                 |
| Multer       | File upload middleware         |
| Cloudinary   | Image storage and CDN hosting  |
| Tailwind CSS | UI Styling                     |

---

## 🚀 Getting Started

These instructions will help you set up the project locally.

### Prerequisites

- Node.js & npm
- MongoDB (local or cloud instance)
- Cloudinary account for image hosting

---

## 📥 Installation

```bash
# Clone the repository
git clone https://github.com/Nirajan09/image-sharing-platform.git

# Navigate into the project directory
cd image-sharing-platform

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../server
npm install
```
---

## 💡 Usage
```bash
# Start the backend
cd server
npm start

# Start the frontend
cd ../frontend
npm start
```

---
## 🛠 Environment Variables
Set your environment variables in the .env files for both the backend and frontend:

📁 Backend: <code>.env</code>
```env
PORT=your_port_number
CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

📁 Frontend: <code>.env.local</code>
```env
NEXT_PUBLIC_BACK_END=your_backend_url
```

⚠️ Note: Never commit your .env files to version control (GitHub). Add them to .gitignore to keep your secrets safe.

---

## 🤝 Contributing
Contributions are welcome!
To contribute:

1. Fork the repository

2. Create your feature branch: 
    ```bash 
    git checkout -b feature-name
    ```

3. Commit your changes: 
    ```bash
    git commit -m "Add feature"
    ```

4. Push to the branch: 
    ```bash
    git push origin feature-name
    ```

5. Open a pull request

---

## 📄 License
This project is open source and available under the MIT License.
You are free to use, modify, and distribute it with proper attribution.

---

## 📬 Contact
Your Name – Nirajan Tiwari
Email: nirajantiwari09@gmail.com

Project Repository: https://github.com/Nirajan09/image-sharing-platform.git

---

