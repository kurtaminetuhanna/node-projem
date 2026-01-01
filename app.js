const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// 1. ÖNEMLİ: Port ayarını Render'a göre güncelledik
const PORT = process.env.PORT || 3000;

// data.json dosyasını sunucu kök dizininde oluşturur
const DATA_FILE = path.join(__dirname, "data.json");

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// 2. ÖNEMLİ: C:/Users/... gibi yolları sildik. 
// Render'da sadece API olarak çalışacağı için static serve kısmını sadeleştirdik.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 📌 API ROUTELARI (Frontend bağlantısı için bunlar yeterli)

// Kayıt İşlemi
app.post("/signup", (req, res) => {
  const { isim, soyisim, email, telefon, sifre } = req.body;
  let users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const exists = users.find(u => u.email === email);

  if (exists) {
    return res.json({ success: false, message: "Bu e-posta zaten kayıtlı!" });
  }

  const newUser = { isim, soyisim, email, telefon, sifre };
  users.push(newUser);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true, message: "Kayıt başarılı!" });
});

// Giriş İşlemi
app.post("/login", (req, res) => {
  const { email, sifre } = req.body;
  const users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const user = users.find(u => u.email === email && u.sifre === sifre);

  if (!user) {
    return res.json({ success: false, message: "E-posta veya şifre hatalı!" });
  }
  res.json({ success: true, message: "Giriş başarılı!", user });
});

// 📌 SUNUCU BAŞLATMA
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda aktif.`);
});