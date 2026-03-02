# 🚀 Math Magic: Game Matematika!

Selamat datang di proyek "Math Magic"! Ini adalah aplikasi game matematika seru yang dibuat menggunakan React Native dan Expo. Tujuan utama proyek ini adalah untuk menciptakan game yang bisa kamu build menjadi file APK mandiri dan dimainkan secara offline di perangkat Android.

## ✨ Konteks Proyek

-   **Nama Proyek**: Math Magic
-   **Teknologi**: React Native & Expo
-   **Tujuan**: Mengembangkan game edukasi matematika yang menyenangkan dan dapat di-deploy sebagai aplikasi Android offline.

## 🛠️ Persyaratan Sistem (Prerequisites)

Sebelum kita mulai, pastikan kamu sudah menginstal beberapa alat penting ini di komputermu:

1.  **Node.js**: Ini adalah runtime JavaScript yang kita butuhkan untuk menjalankan aplikasi React Native dan Expo.
    -   Unduh dari: [nodejs.org](https://nodejs.org/)
2.  **Android Studio**: Ini penting untuk build aplikasi Android. Ini juga akan menginstal Android SDK yang diperlukan.
    -   Unduh dari: [developer.android.com/studio](https://developer.android.com/studio)
3.  **Git**: Untuk mengelola kode proyek dan menghubungkannya dengan GitHub.
    -   Unduh dari: [git-scm.com](https://git-scm.com/downloads)

### ⚠️ Catatan Penting untuk Pengguna Windows: Error `UnauthorizedAccess` saat `npm`

Jika kamu mengalami error `UnauthorizedAccess` saat menjalankan perintah `npm` di PowerShell, ini biasanya terjadi karena pembatasan eksekusi skrip di sistem kamu. Jangan khawatir, ada solusinya!

1.  Buka **PowerShell sebagai Administrator**.
2.  Jalankan perintah berikut:
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```
3.  Ketik `Y` (Yes) ketika diminta konfirmasi.

Ini akan mengizinkan skrip yang kamu buat atau unduh (dari sumber terpercaya seperti `npm`) untuk berjalan.

### ⚠️ Catatan Penting: Error Java/JDK (`JVM runtime version 11`)

Jika kamu melihat error seperti `Dependency requires at least JVM runtime version 11. This build uses a Java 8 JVM`, ini berarti proyek kamu membutuhkan versi Java yang lebih baru daripada yang sedang digunakan oleh Android Studio.

**Solusinya sangat mudah:**

1.  Buka folder `android` (yang ada di dalam folder proyek ini) langsung di **Android Studio**.
2.  Android Studio akan secara otomatis mendeteksi bahwa proyek memerlukan JDK 17 dan akan menawarkan untuk mengunduh serta mengkonfigurasinya untukmu. Ikuti saja petunjuk yang muncul. Ini akan menyelesaikan masalah dependensi Java.

## 🚀 Panduan Memulai Proyek

Ikuti langkah-langkah di bawah ini untuk menginstal dependensi, menjalankan aplikasi di lokal, hingga membangun APK!

### 1. Instal Dependensi

Pertama, kita perlu menginstal semua paket dan pustaka yang dibutuhkan proyek.

```bash
npm install
```

### 2. Jalankan Server Lokal (Development)

Setelah semua dependensi terinstal, kamu bisa menjalankan aplikasi di perangkatmu (melalui Expo Go), emulator Android, atau simulator iOS.

```bash
npx expo start
```

Setelah perintah ini dijalankan, sebuah server lokal akan dimulai. Kamu akan melihat QR code di terminal.
-   Scan QR code dengan aplikasi **Expo Go** di ponselmu untuk melihat aplikasi secara langsung.
-   Tekan `a` di terminal untuk membuka aplikasi di **emulator Android** (pastikan kamu sudah setup emulator di Android Studio).
-   Tekan `i` untuk membuka di **simulator iOS**.

### 3. Build APK Offline (untuk Android)

Jika kamu ingin membuat file APK mandiri yang bisa diinstal di ponsel Android tanpa Expo Go, ikuti langkah-langkah ini:

#### a. Prebuild Proyek

Langkah ini akan membuat folder `android` yang berisi semua konfigurasi dan kode native yang diperlukan.

```bash
npx expo prebuild
```

#### b. Buka Proyek di Android Studio

Setelah `prebuild` selesai, kamu akan memiliki folder `android` di direktori proyekmu.

1.  Buka **Android Studio**.
2.  Pilih `File` > `Open` dan navigasikan ke folder `android` di dalam direktori proyek "Math Magic" kamu (`c:\Users\HNF\Desktop\math-game-1\android`).
3.  Biarkan Android Studio melakukan proses `Gradle Sync` dan mengunduh komponen yang diperlukan. Ini mungkin memakan waktu.

#### c. Konfigurasi Build di Android Studio

1.  Di Android Studio, di bagian kiri bawah, cari dan klik tab `Build Variants`.
2.  Di jendela `Build Variants` yang muncul, ubah `Active Build Variant` untuk modul `app` menjadi **`release`**.
3.  Di bagian atas Android Studio, di toolbar, cari dropdown untuk `Active ABI`. Ubah ke **`arm64-v8a`**.
    -   **Penting**: Pastikan kamu memilih `arm64-v8a` atau ABI lain yang sesuai dengan arsitektur perangkat modern. **JANGAN** pilih `x86` karena ini biasanya untuk emulator lama.

#### d. Build APK

1.  Di menu bar atas Android Studio, pilih `Build` > `Build Bundles(s) / APK(s)` > `Build APK(s)`.
2.  Android Studio akan mulai membangun APK kamu. Proses ini mungkin membutuhkan beberapa menit.
3.  Setelah selesai, kamu akan melihat notifikasi di kanan bawah Android Studio dengan opsi `locate` atau `Reveal in Finder/Explorer`. Klik `locate` untuk menemukan file APK kamu (biasanya berada di `android/app/build/outputs/apk/release/app-release.apk`).

Selamat! Kamu sekarang punya file APK offline yang siap diinstal dan dimainkan di ponsel Android! 🎉

### 4. Cara Update Kode ke GitHub

Setelah kamu membuat perubahan pada kode, penting untuk menyimpannya di GitHub agar aman dan terorganisir. Ikuti 3 perintah dasar Git ini:

1.  **Tambahkan semua perubahan ke staging area:**
    ```bash
    git add .
    ```
    Perintah ini memberitahu Git bahwa kamu ingin menyertakan semua file yang berubah di commit berikutnya.

2.  **Buat commit dengan pesan yang jelas:**
    ```bash
    git commit -m "Deskripsi singkat perubahanmu"
    ```
    Ganti `"Deskripsi singkat perubahanmu"` dengan pesan yang menjelaskan apa yang kamu ubah. Contoh: `"Menambahkan fitur level baru dan memperbaiki bug score."`

3.  **Unggah perubahan ke GitHub:**
    ```bash
    git push
    ```
    Perintah ini akan mengirim semua commit lokalmu ke repositori GitHub.

Itu dia! Semoga panduan ini membantu kamu dalam mengembangkan "Math Magic". Selamat bersenang-senang mengkode! 🚀
