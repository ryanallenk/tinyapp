const authenticateEmail = (email, usersDB) => {
  for (const user in usersDB)
  if (email === `${usersDB[user]["email"]}`) {
    return true;
  }
};

function generateRandomString(){
  return Math.random().toString(36).slice(-6)
};

module.exports = {authenticateEmail, generateRandomString};