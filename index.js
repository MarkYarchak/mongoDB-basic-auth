const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const path = require("path");

const databaseConfig = require('./config/database');

const app = express();

mongoose.set('useCreateIndex', true);
mongoose.connect(databaseConfig.database, { useNewUrlParser: true })
  .then(() => {
    console.log('Database was connected');
  })
  .catch(err => console.log(err));

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  return res.json({
    message: "Auth Node system",
  });
});

const checkUserType = (req, res, next) => {
  const userType = req.originalUrl.split('/')[2];
  require('./config/passport')(userType, passport);
  next();
};

app.use(checkUserType);

const users = require('./router/users');
app.use('/api/users', users);

const admin = require('./router/admin');
app.use('/api/admin', admin);

app.listen(PORT, () => {
  console.log("Server started on port: ", PORT);
});
