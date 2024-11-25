const { getDigests } = require("../dist/passken.cjs");

const password = "mySecret!/;6[à}Pwd";
const wrongPassword = "wrongPassword";
const emptyPassword = "";
const secret = "mySuperFancySecret";
// const objectPassword = { password };
// const regexPassword = /mySecret!\/;6\[à}Pwd/;
// const booleanPassword = true;
const hashedPassword = encrypt(password, secret()); // Using the same saltRounds as in the encrypt function
