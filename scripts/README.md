# Scripts Directory

Folder ini berisi utility scripts untuk Drive Ogan Ilir Next.js project.

## 📜 Available Scripts

### generate-apple-secret.js

Script untuk generate Apple Client Secret (JWT token) yang diperlukan untuk Apple Sign In.

**Prerequisites:**
```bash
npm install jsonwebtoken
```

**Usage:**
1. Download private key (.p8) dari Apple Developer Console
2. Letakkan file .p8 di folder ini
3. Update konfigurasi di dalam script:
   - TEAM_ID
   - CLIENT_ID
   - KEY_ID
   - PRIVATE_KEY_FILE
4. Jalankan script:
   ```bash
   node generate-apple-secret.js
   ```

**Output:**
- Client secret akan ditampilkan di console
- Client secret juga disimpan di file `apple-client-secret.txt`

**⚠️ Security Notes:**
- Jangan commit file `.p8` ke repository
- Jangan commit file `apple-client-secret.txt` ke repository
- File-file ini sudah di-ignore di `.gitignore`

## 🔐 Security

File berikut akan di-ignore oleh Git:
- `*.p8` - Apple private keys
- `*.p12` - Certificate files
- `*.pem` - PEM format keys
- `*.key` - Generic key files
- `apple-client-secret.txt` - Generated secrets
- `apple-client-secret.env` - Generated env file

## 📚 Documentation

Untuk dokumentasi lengkap setup Apple Sign In, lihat:
- [APPLE_SIGNIN_SETUP.md](/docs/APPLE_SIGNIN_SETUP.md)

## 🆘 Support

Jika ada pertanyaan atau masalah, hubungi:
- Email: support@oganilirkab.go.id
- Repository: https://github.com/angga1207/DRIVE-OGAN-ILIR
