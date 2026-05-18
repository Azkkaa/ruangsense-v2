
# RuangSense-v2 ❄️
> **Platform & Dashboard IoT Modern untuk Monitoring Lingkungan Ruangan secara Real-time.**

RuangSense-v2 adalah aplikasi dashboard IoT premium berbasis web yang dirancang untuk memantau kondisi lingkungan ruangan (suhu, kelembaban, dan kualitas udara/gas) secara instan tanpa delay. Menggunakan arsitektur berbasis *Room* pada Socket.io, platform ini menjamin distribusi data dari berbagai perangkat mikrokontroler (seperti ESP32) tersalurkan secara aman, presisi, dan terisolasi ke antarmuka pengguna yang elegan.

---

## ✨ Fitur Unggulan

- **Real-time Monitoring & Analytics**: Aliran data sensor langsung dari perangkat keras ditampilkan secara visual menggunakan grafik *smooth curved* area dari Recharts tanpa perlu me-refresh halaman.
- **Multi-device Room Isolation**: Menggunakan sistem kamar virtual (*Socket Room*) untuk memastikan data sensor dari satu perangkat hanya diterima oleh pengguna yang memantau perangkat tersebut.
- **Premium Dark Industrial UI**: Desain antarmuka futuristik, minimalis, dan elegan dengan sentuhan *glassmorphism* berbasis Tailwind CSS dan animasi transisi halus dari Framer Motion.
- **Real-time Activity Log**: Pencatatan log aktivitas sensor historis terbalik (*descending*) untuk memastikan data terbaru selalu berada di baris paling atas tabel.
- **Responsive Layout**: Optimal untuk pemantauan melalui monitor desktop maupun perangkat mobile dengan dukungan horizontal scroll pada komponen tabel data.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Functional Components & Hooks)
- **Tailwind CSS** (Full Utility Styling)
- **Framer Motion** (Smooth Micro-interactions & Page Transitions)
- **Recharts** (Interactive Dark-themed SVG Charts)
- **Phosphor React** (Premium & Modern Iconography)
- **Socket.io-Client** (Real-time Event Listening)

### Backend
- **Node.js** & **Express.js** (REST API & Streaming Controller)
- **Socket.io Server** (Real-time WebSockets Manager)
- **MongoDB** & **Mongoose** (Data Historis & Device Management)
- **Dotenv** (Environment Variable Management)

### Hardware & Peripherals (Simulation/Production)
- **ESP32 Microcontroller** (WiFi Connection Enabled)
- **Sensors**: DHT11/DHT22 (Suhu & Kelembaban), MQ-Series (Kualitas Udara/Asap/Gas)
- **Tunneling**: **ngrok** (Shared Hosted Public Tunnel untuk menjembatani ESP32 ke Localhost Server)

---

## 📐 Arsitektur Aliran Data Real-time

1. **Hardware Layer**: Perangkat ESP32 membaca data lingkungan secara periodik.
2. **Network Layer**: ESP32 mengirim data melalui HTTP POST ke public URL yang disediakan oleh **ngrok**.
3. **Tunneling Layer**: **ngrok** meneruskan request HTTP POST tersebut langsung ke lokal port Express Server Anda.
4. **Backend Layer (Controller)**: Express menangkap data tersebut, lalu menggunakan perintah `io.to(device_id).emit('v2-device-data', payload)` untuk membroadcast data spesifik ke kamar socket yang dituju.
5. **Frontend Layer (React)**: Browser yang berada di dalam room tersebut menangkap data dan langsung memperbarui grafik serta tabel secara instan.

---

## 🚀 Panduan Instalasi & Pengoperasian

### 1. Kloning Repositori

```bash

git clone https://github.com/azkafaza/ruangsense-v2.git
cd ruangsense-v2
```

### 2. Konfigurasi Backend

Masuk ke direktori backend, install *dependencies*, dan siapkan berkas konfigurasi lingkungan.

```bash
cd backend
npm install
```

Buat file `.env` di dalam folder `backend/` dan sesuaikan variabelnya:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ruangsense_v2
```

Jalankan server backend:

```bash
npm run server
# atau
nodemon server.js
```

### 3. Konfigurasi Frontend

Buka terminal baru, masuk ke direktori frontend, lalu pasang *dependencies*.

```bash
cd frontend
npm install
```

Jalankan server development frontend (Vite):

```bash
npm run dev
```

Aplikasi frontend secara default akan berjalan di alamat `http://localhost:5173`.

### 4. Menghubungkan ke ESP32 (Fase Pengembangan) dengan Local-to-Public Deployment

Jika server Anda berjalan di `localhost:5000`, aktifkan **ngrok** untuk membuka jalur publik dengan perintah berikut:

```bash
ngrok http 5000
```

Salin URL publik yang diberikan oleh ngrok (contoh: `https://abcd-123.ngrok-free.app`) dan masukkan ke dalam kode program (sketch) ESP32 Anda sebagai endpoint tujuan POST data:

---

## 📝 Contoh Format Payload Data Sensor (JSON)

Saat ESP32 mengirim data ke backend, pastikan struktur payload JSON berbentuk seperti ini:

```json
{
  "device_id": "Device-ID",
  "temp": 25.5,
  "temp_status": "normal",
  "humid": 55,
  "humid_status": "normal",
  "gas": 42,
  "gas_status": "normal",
  "time": "14:47:25"
}
```

---

## 👥 Kontribusi

Jika Anda ingin mengembangkan fitur tambahan seperti manajemen *auth* user, sistem penentuan ambang batas (*threshold* otomatis), atau integrasi Telegram Bot Notification, silakan lakukan *fork* pada repositori ini dan kirimkan *Pull Request*.

**© 2026 RuangSense-v2 - Muhammad Azka Faza Muttaqin. All rights reserved.**