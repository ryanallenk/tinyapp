const express = require("express");
const res = require("express/lib/response");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');

function generateRandomString(){
  return Math.random().toString(36).slice(-6)
}

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    user: users[req.cookies["user_id"]] 
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let randomString = generateRandomString()
  urlDatabase [randomString] = req.body.longURL; 
  res.redirect(`/urls/${randomString}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.updateURL;
  res.redirect(`/urls/`);
});

// route for login request
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username)
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
  users [randomString] = {
    "id": randomString,
    "email": req.body.email,
    "password": req.body.password
  } 
  res.cookie("user_id", randomString)
  // console.log(users)
  // console.log(users[randomString])
  res.redirect(`/urls`);
});

app.get('/urls/new', (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]]  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["user_id"]]  };
  res.render("urls_show", templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

// route to show registration page
app.get('/register', (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("register", templateVars);
});

// initial route test
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// server startup message
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});