const express = require('express');
const expressHbs = require('express-handlebars');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname + "/", ))

app.engine(
  "hbs",
  expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: null,
  })
);
const homeRouter = require('./routes/home');
const loginRouter = require('./routes/login');
const searchRouter = require('./routes/search');
const profileRouter = require('./routes/profile');
const signupRouter = require('./routes/signup');
const activityRouter = require('./routes/activity');
const forgotRouter = require('./routes/forgot');

app.set("view engine", "hbs");

app.get('/', (req, res) => {
  res.render('home'); 
});

app.get('/login', (req, res) => {
  res.render('index'); 
});
app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/search', searchRouter);
app.use('/profile', profileRouter);
app.use('/signup', signupRouter);
app.use('/activity', activityRouter);
app.use('/forgot', forgotRouter);

// Lắng nghe trên cổng 3000
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));