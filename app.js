const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");


if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}


app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post("/signup", (req, res) => {
  const { isim, soyisim, email, telefon, sifre } = req.body;

  if (!isim || !soyisim || !email || !telefon || !sifre) {
    return res.status(400).json({ message: "Tüm alanları doldurunuz!" });
  }

  let users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Bu e-posta zaten kayıtlı!" });
  }

  const newUser = { isim, soyisim, email, telefon, sifre };
  users.push(newUser);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

  console.log("Yeni kullanıcı kaydedildi:", newUser);
  res.json({ message: "Kayıt başarılı!" });
});


app.post("/login", (req, res) => {
  const { email, sifre } = req.body;

  if (!email || !sifre) {
    return res.status(400).json({ message: "E-posta ve şifre gerekli!" });
  }

  const users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

  const user = users.find(u => u.email === email && u.sifre === sifre);

  if (!user) {
    return res.status(401).json({ message: "E-posta veya şifre hatalı!" });
  }

  console.log("Giriş yapan kullanıcı:", user.email);

  res.json({ message: "Giriş başarılı!", user });
});


app.listen(PORT, () => {
  console.log(`Backend çalışıyor: http://localhost:${PORT} `); 
});

