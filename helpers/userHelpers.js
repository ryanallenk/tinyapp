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

function generateRandomString(){
  return Math.random().toString(36).slice(-6)
};

module.exports = {authenticateEmail, generateRandomString, findUserByEmail};