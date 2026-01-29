const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const Post = require('./models/Post');
const app = express();

// Ma'lumotlar bazasiga ulanish (MongoDB Atlas - Tekin)
mongoose.connect('SIZNING_MONGODB_URL_MANZILINGIZ');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'maxfiy-kalit',
    resave: false,
    saveUninitialized: true
}));

// --- YO'LLARI (ROUTES) ---

// 1. Hamma ko'ra oladigan asosiy sahifa
app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('index', { posts, isAdmin: req.session.isLoggedIn });
});

// 2. Login sahifasi
app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === 'admin123') { // Mana shu yerda parolni tekshiramiz
        req.session.isLoggedIn = true;
        res.redirect('/admin');
    } else {
        res.send('Xato parol!');
    }
});

// 3. Admin Panel (Faqat kodni bilganlar uchun)
app.get('/admin', (req, res) => {
    if (!req.session.isLoggedIn) return res.redirect('/login');
    res.render('admin');
});

// 4. Ma'lumot qo'shish va o'chirish
app.post('/add', async (req, res) => {
    if (req.session.isLoggedIn) {
        await new Post(req.body).save();
    }
    res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        await Post.findByIdAndDelete(req.params.id);
    }
    res.redirect('/');
});

app.listen(3000, () => console.log('Server 3000-portda yonib turibdi...'));