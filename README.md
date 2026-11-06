<div align="center">

# Apotek App

### Mobile Pharmacy Application with AI-Powered Features

A full-stack mobile pharmacy app — medicine catalog, order management, and an AI health assistant — built with React Native, Laravel, and FastAPI.

<br/>

![React Native](https://img.shields.io/badge/React_Native-Expo-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-AI_Service-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

</div>

---

## ✨ Features

| Feature | Description |
|:---|:---|
| 🔐 **Authentication** | Login & register with secure session handling |
| 💊 **Medicine Catalog** | Browse and search medicine products |
| 🛒 **Orders** | Place orders and view full transaction history |
| 📰 **Health Articles** | Curated health content for users |
| 💬 **Chat / Messaging** | In-app messaging feature |
| 👤 **User Profile** | Manage personal account details |
| 🤖 **AI Service** | FastAPI-powered AI backend for intelligent features |

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
|:---|:---|:---|
| **Mobile** | React Native · Expo · TypeScript | Cross-platform mobile UI |
| **Backend** | Laravel · PHP | REST API, auth, business logic |
| **AI Service** | FastAPI · Python | AI-powered features |

---
## 🏗️ Architecture

```mermaid
flowchart TB
    subgraph MOB["📱 MOBILE APP · React Native + Expo"]
        direction LR
        AUTH["Auth\nLogin / Register"]
        CAT["Medicine Catalog"]
        ORD["Orders & History"]
        CHAT["Chat / Messaging"]
        ART["Health Articles"]
        PROF["User Profile"]
        AUTH ~~~ CAT ~~~ ORD ~~~ CHAT ~~~ ART ~~~ PROF
    end

    subgraph BE["⚙️ BACKEND · Laravel (PHP)"]
        direction LR
        API["REST API"]
        CTRL["Controllers\nBusiness Logic"]
        DB[("MySQL Database")]
        API --> CTRL --> DB
    end

    subgraph AI["🤖 AI SERVICE · FastAPI (Python)"]
        direction LR
        AIEP["AI Endpoints"]
        MODEL["AI Model / Logic"]
        AIEP --> MODEL
    end

    MOB -->|"HTTP REST"| API
    MOB -->|"AI requests"| AIEP
    CTRL -->|"AI processing"| AIEP
```

## 🚀 Quick Start

### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### AI Service (FastAPI)
```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### Mobile App (Expo)
```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press `a` for Android emulator / `i` for iOS simulator.
