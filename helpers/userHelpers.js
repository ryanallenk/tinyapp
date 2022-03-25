const authenticateEmail = (email, usersDB) => {
  for (const user in usersDB)
  if (email === `${usersDB[user]["email"]}`) {
    return true;
  }
};
const findUserByEmail = (email, usersDB) => {
  for (const user in usersDB)
  if (email === `${usersDB[user]["email"]}`) {
    let foundUser = usersDB[user]
    return foundUser;
  }
};

const urlsForUser = (id, urlDatabase) => {
  urlDatabaseForUser = {}

  for (const url in urlDatabase)
    if (id === `${urlDatabase[url]["userID"]}`) {

      urlDatabaseForUser [url] = {
        longURL: urlDatabase[url]["longURL"],
        userID: urlDatabase[url]["userID"]
      }
    };
    return urlDatabaseForUser;
};

function generateRandomString(){
  return Math.random().toString(36).slice(-6)
};

function makeSafeURL(url) {
  if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) {
  return url
}
return `https://${url}`
}

module.exports = {authenticateEmail, generateRandomString, findUserByEmail, urlsForUser, makeSafeURL};