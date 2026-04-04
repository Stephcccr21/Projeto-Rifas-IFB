# 🎟 Raffles Platform API (Django + DRF)

A backend API for a raffle platform where users can create raffles, sell tickets, and manage participation.

Built with **Django**, **Django REST Framework**, and **JWT authentication**.

---

## 🚀 Features

### 👤 Authentication & Users

* User registration (Organizer or Seller)
* JWT login (secure authentication)
* Password recovery (email simulation)
* Editable user profile
* Protected routes

### 🎟 Raffles

* Create raffle (Organizer only)
* List raffles
* Attach prizes to raffles

### 💰 Sales

* Sellers can sell raffle tickets
* Linked to users and raffles

### 🔐 Security

* JWT authentication (`djangorestframework-simplejwt`)
* Role-based permissions (Organizer / Seller)

---

## 🛠 Tech Stack

* Python 3.12
* Django 4.2
* Django REST Framework
* Simple JWT

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/raffles-api.git
cd raffles-api
```

---

### 2. Create virtual environment

```bash
python3.12 -m venv venv
source venv/bin/activate
```

---

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 5. Create superuser (optional)

```bash
python manage.py createsuperuser
```

---

### 6. Run server

```bash
python manage.py runserver
```

---

## 🔑 Authentication (JWT)

### Login

```
POST /api/users/auth/login/
```

Response:

```json
{
  "access": "your_access_token",
  "refresh": "your_refresh_token"
}
```

---

### Use token in requests

```
Authorization: Bearer <access_token>
```

---

## 📌 API Endpoints

### 👤 Users

| Method  | Endpoint                    | Description       |
| ------- | --------------------------- | ----------------- |
| POST    | `/api/users/auth/register/` | Register user     |
| POST    | `/api/users/auth/login/`    | Login             |
| GET/PUT | `/api/users/profile/`       | View/Edit profile |

---

### 🎟 Raffles

| Method | Endpoint                       | Description   |
| ------ | ------------------------------ | ------------- |
| GET    | `/api/raffles/raffles/`        | List raffles  |
| POST   | `/api/raffles/raffles/create/` | Create raffle |

---

### 💰 Sales

| Method | Endpoint             | Description |
| ------ | -------------------- | ----------- |
| GET    | `/api/sales/`        | List sales  |
| POST   | `/api/sales/create/` | Create sale |

---

### 🔐 Password Reset

| Endpoint           |
| ------------------ |
| `/password-reset/` |

> Uses Django email console backend for testing.

---

## 🧪 Testing (Browser-Friendly)

You can test endpoints directly in the browser using DRF UI:

* Login → copy token
* Click "Authorize"
* Paste:

```
Bearer your_token_here
```

---

## 🧱 Project Structure

```
apps/
  users/
  raffles/
  sales/
  payments/
  comments/

rifas_project/
  settings.py
  urls.py
```

---

## ⚠️ Notes

* Email sending is simulated using console backend
* SQLite used for development
* Python 3.14 is NOT supported → use Python 3.12

---

## 📈 Next Improvements

* Ticket numbering system
* Payment integration (Stripe / Pix)
* Raffle draw logic
* Frontend (React / Next.js)
* Email templates (HTML)

---

## 👩‍💻 Author

Stephany Carvalho

---

## 📄 License

This project is for learning and development purposes.
