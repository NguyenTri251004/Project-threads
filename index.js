const express = require('express');
const expressHbs = require('express-handlebars');
const app = express();
const cookieParser = require('cookie-parser');
const homeRouter = require('./routes/home');
const loginRouter = require('./routes/login');
const searchRouter = require('./routes/search');
const profileRouter = require('./routes/profile');
const signupRouter = require('./routes/signup');
const activityRouter = require('./routes/activity');
const forgotRouter = require('./routes/forgot');
const followRouter = require('./routes/follow');
const detailsRouter = require('./routes/details')
const logoutRouter = require('./routes/logout')
const resetRouter = require('./routes/reset')
const PORT = 3000;

function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
        { label: 'năm', seconds: 31536000 },
        { label: 'tháng', seconds: 2592000 },
        { label: 'ngày', seconds: 86400 },
        { label: 'giờ', seconds: 3600 },
        { label: 'phút', seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count > 0) {
            return `${count} ${interval.label}`;
        }
    }
    return 'vừa xong';
}

app.use(express.static(__dirname + "/", ))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.engine(
  "hbs",
  expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: null,
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    //them helpers cho timeAgo
    helpers: {
      timeAgo: (date) => timeAgo(date),
    }
  })
);

app.set("view engine", "hbs");

app.use((req, res, next) => {
  res.locals.userId = req.cookies.userId;
  next();
})

app.use('/', loginRouter);
app.use('/home', homeRouter);
app.use('/search', searchRouter);
app.use('/profile', profileRouter);
app.use('/signup', signupRouter);
app.use('/activity', activityRouter);
app.use('/forgot', forgotRouter);
app.use('/follow', followRouter);
app.use('/details', detailsRouter);
app.use('/logout', logoutRouter);
app.use('/reset-password', resetRouter);

// Lắng nghe trên cổng 3000
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));