const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// BURASI ÇOK ÖNEMLİ: data.json dosyasını kullanıyoruz
const DATA_FILE = path.join(__dirname, "data.json");

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// FRONTEND KLASÖRÜ
const FRONTEND_FOLDER = "C:/Users/Amine Tuhanna/Documents/GitHub/webtasarim-proje";

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// STATIC SERVE
app.use(express.static(FRONTEND_FOLDER));


// 📌 SAYFA ROUTELARI
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_FOLDER, "login.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(FRONTEND_FOLDER, "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(FRONTEND_FOLDER, "signup.html"));
});

app.get("/urunekle", (req, res) => {
  res.sendFile(path.join(FRONTEND_FOLDER, "urunekle.html"));
});


// 📌 KAYIT (data.json'a kayıt yapar)
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


// 📌 GİRİŞ (data.json'dan kontrol eder)
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
  console.log(`Express çalışıyor: http://localhost:${PORT}`);
});
