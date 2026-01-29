const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();

// 1. Ma'lumotlar bazasi (MongoDB Atlas linkini bu yerga qo'ying)
mongoose.connect('mongodb+srv://admin:parol123@cluster.mongodb.net/sayt1')
    .then(() => console.log("Baza ulandi!"))
    .catch(err => console.log("Xato:", err));

// 2. Ma'lumot strukturasi (Model)
const DataSchema = new mongoose.Schema({
    name: String,
    info: String,
    date: { type: Date, default: Date.now }
});
const Data = mongoose.model('Data', DataSchema);

// 3. Sozlamalar
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'maxfiy', resave: false, saveUninitialized: true }));

// 4. Sahifalar (Routes)
app.get('/', async (req, res) => {
    const allData = await Data.find();
    res.render('index', { allData, isAdmin: req.session.isAdmin });
});

app.get('/login', (req, res) => res.render('login'));

app.post('/login', (req, res) => {
    if (req.body.password === 'admin777') { // SIZNING PAROLINGIZ
        req.session.isAdmin = true;
        res.redirect('/');
    } else {
        res.send("Xato parol!");
    }
});

app.post('/add', async (req, res) => {
    if (req.session.isAdmin) await new Data(req.body).save();
    res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
    if (req.session.isAdmin) await Data.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(3000, () => console.log('http://localhost:3000'));