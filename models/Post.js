require('dotenv').config();
const mongoose = require('mongoose');

// Linkni .env faylidan olamiz, kod ichida ko'rinmaydi
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Baza bilan aloqa o'rnatildi!"))
  .catch(err => console.log(err));