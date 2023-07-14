# Menggunakan node versi 18.16.0 sebagai base image
FROM node:16

# Membuat direktori kerja di dalam kontainer
WORKDIR /app

# Menyalin package.json dan package-lock.json (jika ada) ke direktori kerja
COPY package*.json ./

# Menjalankan perintah npm install untuk menginstal dependensi
RUN npm install

# Menyalin semua file proyek ke direktori kerja
COPY . .

EXPOSE 3500

# Menjalankan aplikasi node.js dengan skrip "dev"
CMD [ "npm", "start" ]
