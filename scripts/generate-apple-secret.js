/**
 * Apple Client Secret Generator
 * 
 * Script ini digunakan untuk generate JWT token yang diperlukan sebagai
 * APPLE_CLIENT_SECRET untuk Apple Sign In
 * 
 * Prerequisites:
 * - npm install jsonwebtoken
 * - Download .p8 private key dari Apple Developer Console
 * 
 * Usage:
 * 1. Update konfigurasi di bawah dengan data dari Apple Developer Console
 * 2. Letakkan file .p8 di folder yang sama dengan script ini
 * 3. Run: node generate-apple-secret.js
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// ============================================
// KONFIGURASI - UPDATE DENGAN DATA ANDA
// ============================================

const TEAM_ID = 'ZXF6P67JL8';              // 10 karakter Team ID dari Apple Developer
const CLIENT_ID = 'id.go.oganilirkab.drive'; // Services ID (bukan App ID)              
const KEY_ID = '545VFVJYBT'; // Key ID dari private key yang di-download
const PRIVATE_KEY_FILE = 'AuthKey_545VFVJYBT.p8'; // Nama file .p8 yang di-download

// Token expiration (dalam detik)
// Apple maksimal 6 bulan (15777000 detik)
// Recommended: 180 hari (15552000 detik)
const TOKEN_EXPIRATION = 60 * 60 * 24 * 180; // 180 hari

// ============================================
// SCRIPT - JANGAN UBAH DI BAWAH INI
// ============================================

console.log('🍎 Apple Client Secret Generator');
console.log('=====================================\n');

try {
    // Validasi konfigurasi - hanya cek jika masih placeholder
    if (TEAM_ID === 'YOUR_TEAM_ID' || KEY_ID === 'YOUR_KEY_ID') {
        console.error('❌ Error: Silakan update konfigurasi dengan data Anda!');
        console.log('\nUpdate baris berikut:');
        console.log('- TEAM_ID: Team ID dari Apple Developer Console');
        console.log('- CLIENT_ID: Services ID (bukan App ID)');
        console.log('- KEY_ID: Key ID dari private key');
        console.log('- PRIVATE_KEY_FILE: Nama file .p8 yang di-download\n');
        process.exit(1);
    }

    // Baca private key file
    const privateKeyPath = path.join(__dirname, PRIVATE_KEY_FILE);

    if (!fs.existsSync(privateKeyPath)) {
        console.error(`❌ Error: File private key tidak ditemukan: ${PRIVATE_KEY_FILE}`);
        console.log('\nPastikan file .p8 sudah di-download dari Apple Developer Console');
        console.log('dan letakkan di folder yang sama dengan script ini.\n');
        process.exit(1);
    }

    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

    // Informasi token
    const now = Math.floor(Date.now() / 1000);
    const expirationDate = new Date((now + TOKEN_EXPIRATION) * 1000);

    console.log('📋 Token Information:');
    console.log('-------------------------------------');
    console.log(`Team ID      : ${TEAM_ID}`);
    console.log(`Client ID    : ${CLIENT_ID}`);
    console.log(`Key ID       : ${KEY_ID}`);
    console.log(`Issued At    : ${new Date(now * 1000).toISOString()}`);
    console.log(`Expires At   : ${expirationDate.toISOString()}`);
    console.log(`Valid Days   : ${Math.floor(TOKEN_EXPIRATION / 86400)} days`);
    console.log('-------------------------------------\n');

    // Generate JWT token
    const token = jwt.sign(
        {
            iss: TEAM_ID,
            iat: now,
            exp: now + TOKEN_EXPIRATION,
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

    console.log('✅ Apple Client Secret berhasil di-generate!\n');
    console.log('📝 Copy token di bawah ini ke file .env Anda:\n');
    console.log('APPLE_CLIENT_SECRET=' + token + '\n');

    console.log('⚠️  IMPORTANT NOTES:');
    console.log('-------------------------------------');
    console.log('1. Simpan token ini dengan aman');
    console.log('2. Jangan commit token ke Git repository');
    console.log('3. Token ini akan expire pada:', expirationDate.toLocaleDateString('id-ID'));
    console.log('4. Set reminder untuk regenerate token sebelum expire');
    console.log('5. Gunakan environment variables yang secure di production');
    console.log('-------------------------------------\n');

    // Save to file (optional)
    const outputFile = path.join(__dirname, 'apple-client-secret.txt');
    fs.writeFileSync(outputFile, `# Generated: ${new Date().toISOString()}\n# Expires: ${expirationDate.toISOString()}\n\nAPPLE_CLIENT_SECRET=${token}\n`);
    console.log(`💾 Token juga disimpan di: ${outputFile}\n`);

} catch (error) {
    console.error('❌ Error generating token:', error.message);
    console.log('\nPastikan:');
    console.log('1. Package jsonwebtoken sudah terinstall: npm install jsonwebtoken');
    console.log('2. File .p8 ada di folder yang benar');
    console.log('3. Konfigurasi sudah benar (Team ID, Key ID, dll)\n');
    process.exit(1);
}
