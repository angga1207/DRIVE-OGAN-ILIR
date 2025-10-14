# Apple Sign In Setup Guide

Dokumentasi lengkap untuk mengkonfigurasi Apple Sign In di aplikasi Drive Ogan Ilir Next.js

## 📋 Prerequisites

1. Apple Developer Account (berbayar $99/tahun)
2. Domain yang sudah terverifikasi
3. Akses ke Apple Developer Console

## 🔧 Setup di Apple Developer Console

### 1. Create App ID

1. Login ke [Apple Developer Console](https://developer.apple.com/account)
2. Navigasi ke **Certificates, Identifiers & Profiles**
3. Pilih **Identifiers** → **App IDs** → Klik tombol **+**
4. Pilih **App IDs** → Klik **Continue**
5. Pilih **App** → Klik **Continue**
6. Isi form:
   - **Description**: `Drive Ogan Ilir`
   - **Bundle ID**: `id.go.oganilirkab.drive` (atau bundle ID Anda)
7. Scroll ke bawah dan enable **Sign In with Apple**
8. Klik **Continue** → **Register**

### 2. Create Services ID (untuk Web)

1. Navigasi ke **Certificates, Identifiers & Profiles**
2. Pilih **Identifiers** → Klik tombol **+**
3. Pilih **Services IDs** → Klik **Continue**
4. Isi form:
   - **Description**: `Drive Ogan Ilir Web`
   - **Identifier**: `id.go.oganilirkab.drive.web` (ini akan menjadi APPLE_CLIENT_ID)
5. Enable **Sign In with Apple**
6. Klik **Configure** di samping Sign In with Apple
7. Isi konfigurasi:
   - **Primary App ID**: Pilih App ID yang dibuat sebelumnya
   - **Domains and Subdomains**: Tambahkan domain Anda
     ```
     oganilirkab.go.id
     drive.oganilirkab.go.id
     localhost (untuk development)
     ```
   - **Return URLs**: Tambahkan callback URLs
     ```
     https://drive.oganilirkab.go.id/api/auth/callback/apple
     http://localhost:3000/api/auth/callback/apple (untuk development)
     ```
8. Klik **Save** → **Continue** → **Register**

### 3. Create Private Key

1. Navigasi ke **Certificates, Identifiers & Profiles**
2. Pilih **Keys** → Klik tombol **+**
3. Isi form:
   - **Key Name**: `Drive Ogan Ilir Apple Sign In Key`
4. Enable **Sign In with Apple**
5. Klik **Configure** di samping Sign In with Apple
6. Pilih **Primary App ID** yang dibuat sebelumnya
7. Klik **Save** → **Continue** → **Register**
8. **PENTING**: Download file `.p8` (private key) - hanya bisa download sekali!
9. Catat **Key ID** yang ditampilkan

### 4. Get Team ID

1. Di Apple Developer Console, klik nama Anda di pojok kanan atas
2. Pilih **View Membership**
3. Catat **Team ID** Anda (10 karakter)

## 🔐 Generate Client Secret

Apple Sign In memerlukan JWT token sebagai client secret yang harus di-generate secara programmatic.

### Cara 1: Menggunakan Node.js Script (Recommended)

1. Install dependencies:
```bash
npm install jsonwebtoken
```

2. Buat file `generate-apple-secret.js`:
```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Konfigurasi dari Apple Developer Console
const TEAM_ID = 'YOUR_TEAM_ID'; // 10 karakter
const CLIENT_ID = 'id.go.oganilirkab.drive.web'; // Service ID
const KEY_ID = 'YOUR_KEY_ID'; // Key ID dari private key
const PRIVATE_KEY_PATH = './AuthKey_XXXXXXXXXX.p8'; // Path ke file .p8

// Baca private key
const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');

// Generate JWT
const token = jwt.sign(
  {
    iss: TEAM_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (86400 * 180), // Valid 180 hari
    aud: 'https://appleid.apple.com',
    sub: CLIENT_ID,
  },
  privateKey,
  {
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: KEY_ID,
    },
  }
);

console.log('Apple Client Secret:');
console.log(token);
```

3. Jalankan script:
```bash
node generate-apple-secret.js
```

4. Copy token yang dihasilkan

### Cara 2: Menggunakan Online Tool

Gunakan tool seperti:
- https://www.scottbrady91.com/tools/jwt
- https://jwt.io/

**PERINGATAN**: Jangan gunakan untuk production keys!

## ⚙️ Konfigurasi Environment Variables

Update file `.env`:

```env
# Apple Sign In Configuration
APPLE_CLIENT_ID=id.go.oganilirkab.drive.web
APPLE_CLIENT_SECRET=eyJhbGciOiJFUzI1NiIsImtpZCI6IktleUlEIn0...
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID
```

**PENTING**: 
- Client Secret (JWT) expire dalam 6 bulan maksimal
- Perlu di-regenerate secara berkala
- Gunakan environment variables yang secure di production

## 🔄 Update Backend Laravel

Pastikan backend Laravel Anda memiliki endpoint untuk handle Apple login:

### 1. Install Laravel Socialite (jika belum)

```bash
composer require laravel/socialite
composer require socialiteproviders/apple
```

### 2. Update `config/services.php`

```php
'apple' => [
    'client_id' => env('APPLE_CLIENT_ID'),
    'client_secret' => env('APPLE_CLIENT_SECRET'),
    'redirect' => env('APPLE_REDIRECT_URI'),
],
```

### 3. Create Route & Controller

```php
// routes/api.php
Route::post('/login/apple', [AuthController::class, 'loginWithApple']);

// app/Http/Controllers/AuthController.php
public function loginWithApple(Request $request)
{
    try {
        $email = $request->input('email');
        $name = $request->input('name');
        
        // Cek apakah user sudah ada
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            // Buat user baru
            $user = User::create([
                'name' => $name ?? 'Apple User',
                'email' => $email,
                'email_verified_at' => now(),
                'provider' => 'apple',
            ]);
        }
        
        // Generate token
        $token = $user->createToken('apple-login')->plainTextToken;
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
}
```

## 🧪 Testing

### Development (localhost)

1. Pastikan callback URL sudah ditambahkan:
   ```
   http://localhost:3000/api/auth/callback/apple
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka browser dan test Apple Sign In

### Production

1. Pastikan domain production sudah ditambahkan di Apple Developer Console
2. Update environment variables dengan credentials production
3. Deploy aplikasi
4. Test dengan akun Apple ID real

## 🔍 Troubleshooting

### Error: "invalid_client"
- Pastikan APPLE_CLIENT_ID sesuai dengan Services ID
- Regenerate client secret

### Error: "invalid_grant"
- Client secret sudah expire, regenerate
- Key ID atau Team ID salah

### Error: "redirect_uri_mismatch"
- Callback URL tidak sesuai dengan yang didaftarkan
- Tambahkan URL di Apple Developer Console

### User tidak mendapat email
- Apple Sign In dapat menyembunyikan email (Private Email Relay)
- Backend harus bisa handle private relay email (@privaterelay.appleid.com)

## 📝 Important Notes

1. **Private Email Relay**: 
   - Apple bisa generate email relay untuk privacy
   - Format: random@privaterelay.appleid.com
   - Backend harus bisa handle ini

2. **Name Availability**:
   - Apple hanya mengirim name pada login pertama kali
   - Login berikutnya hanya mengirim email
   - Simpan name saat pertama kali

3. **Token Expiration**:
   - Client secret max 6 bulan
   - Set reminder untuk regenerate
   - Gunakan automated script di production

4. **iOS vs Web**:
   - Setup berbeda untuk native iOS app
   - Guide ini khusus untuk web application

## 🔗 Referensi

- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [NextAuth Apple Provider](https://next-auth.js.org/providers/apple)
- [Laravel Socialite Apple](https://socialiteproviders.com/Apple/)

## ✅ Checklist Setup

- [ ] Apple Developer Account sudah aktif
- [ ] App ID sudah dibuat
- [ ] Services ID sudah dibuat dan dikonfigurasi
- [ ] Private Key (.p8) sudah di-download
- [ ] Team ID dan Key ID sudah dicatat
- [ ] Client Secret (JWT) sudah di-generate
- [ ] Environment variables sudah dikonfigurasi
- [ ] Backend endpoint sudah dibuat
- [ ] Callback URLs sudah ditambahkan
- [ ] Testing di development berhasil
- [ ] Testing di production berhasil

---

**Created**: October 2, 2025  
**Version**: 1.0.0  
**Maintainer**: Drive Ogan Ilir Team
