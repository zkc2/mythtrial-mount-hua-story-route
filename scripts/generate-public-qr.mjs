import QRCode from 'qrcode';
import fs from 'node:fs/promises';

const url = 'https://mythtrial-mount-hua-story-route.vercel.app/';
const options = {
  errorCorrectionLevel: 'H',
  margin: 4,
  color: { dark: '#07110FFF', light: '#FFFFFFFF' },
};

await QRCode.toFile('public/mythtrial-mobile-qr.png', url, { ...options, width: 1024 });
await QRCode.toFile('public/mythtrial-mobile-qr.svg', url, { ...options, type: 'svg', width: 1024 });
await fs.mkdir('../../output/mythtrial_mobile_qr', { recursive: true });
await fs.copyFile('public/mythtrial-mobile-qr.png', '../../output/mythtrial_mobile_qr/MythTrial_Public_Mobile_QR.png');
await fs.copyFile('public/mythtrial-mobile-qr.svg', '../../output/mythtrial_mobile_qr/MythTrial_Public_Mobile_QR.svg');
console.log(JSON.stringify({ url, png: 'public/mythtrial-mobile-qr.png', svg: 'public/mythtrial-mobile-qr.svg' }));
