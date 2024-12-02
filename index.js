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
app.set("view engine", "hbs");
// const homeRouter = require('./routes/home');
// const loginRouter = require('./routes/login');
// app.use('/', homeRouter);
// app.use('/login', loginRouter);
// Lắng nghe trên cổng 3000
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));