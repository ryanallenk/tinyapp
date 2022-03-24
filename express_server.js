const express = require("express");
const res = require("express/lib/response");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

const {generateRandomString, authenticateEmail, findUserByEmail, urlsForUser} = require('./helpers/userHelpers')

app.set("view engine", "ejs");

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b2xVn2: {
        longURL: "https://www.lighthouselabs.ca",
        userID: "aJ48lW"
    },
  sm65xk: {
        longURL: "https://www.google.ca",
        userID: "userRandomID"
    }
};

// global users object which stores new users from registration page
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}), cookieParser());

// in the event of a request type GET, if the route asked is "/", then run the callback
// req is request and res is the response to send back

app.get("/urls", (req, res) => {
  userID = req.cookies["user_id"]
  urlsUserDB = urlsForUser(userID, urlDatabase)
  const templateVars = { 
    urls: urlsUserDB,
    user: users[req.cookies["user_id"]] 
  };
  if (!users[req.cookies["user_id"]]) {
    return res.status(401).send("Error: You are not logged in.")
  }
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  if (!users[req.cookies["user_id"]]) {
    res.redirect('/login');
  }
  let randomString = generateRandomString()
  urlDatabase [randomString] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
   }; 
  res.redirect(`/urls/${randomString}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (!users[req.cookies["user_id"]]) {
    return res.status(401).send("Error: You must be logged in to do that.");
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  if (!users[req.cookies["user_id"]]) {
    return res.status(401).send("Error: You must be logged in to do that.");
  }
  urlDatabase[req.params.shortURL]["longURL"] = req.body.updateURL;
  res.redirect(`/urls/`);
});

// route for login request
app.post("/login", (req, res) => {
  if (!authenticateEmail(req.body.emailLogin, users)) {
    return res.status(403).send("Error: A user with that email does not exist.")
  }
  let foundUser = findUserByEmail(req.body.emailLogin, users);
  // console.log(req.body.passwordLogin.toString());
  // console.log(foundUser.password.toString());
  let hashedPassword = foundUser.password;
  if (!bcrypt.compareSync(req.body.passwordLogin, hashedPassword)) {
    return res.status(403).send("Error: The password entered is incorrect.")
  };
  res.cookie("user_id", foundUser.id)
  res.redirect(`/urls`);
});

// route for logout request
app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect(`/urls`);
});

// route to handle register request
app.post("/register", (req, res) => {
  let randomString = generateRandomString()
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Error: Required field missing information.")
  }
  if (authenticateEmail(req.body.email, users)) {
    return res.status(400).send("Error: A user with that email is already registered.")
  }
  users [randomString] = {
    "id": randomString,
    "email": req.body.email,
    "password": bcrypt.hashSync(req.body.password)
  } 
  res.cookie("user_id", randomString)
  res.redirect(`/urls`);
  console.log(users);
});

app.get('/urls/new', (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]]  };
  if (!users[req.cookies["user_id"]]) {
    res.redirect('/login');
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"], user: users[req.cookies["user_id"]]  };
  res.render("urls_show", templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(400).send("Error: The requested URL does not exist.")
  }
  const longURL = urlDatabase[req.params.shortURL]["longURL"]
  res.redirect(longURL);
});

// route to show registration page
app.get('/register', (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("register", templateVars);
});

// route to show login page
app.get('/login', (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("login", templateVars);
});

// server startup message
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});