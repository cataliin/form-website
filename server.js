const express = require("express");
const {body, validationResult} = require('express-validator');
const utils = require("./utils");
const app = express();
app.use(express.json());

const port = 1234;
app.listen(port, () => console.log(`Serverul merge pe portul ${port}`));


app.get("/insertRandomPerson", async (req,res) =>{
const persoana1 = {
    numePersoana: "Carmatiu Pluntiu",
    dataNasterii: "2010-04-23",
    emailPersoana: "testest@gmail.com",
    numarTelefon: "0719238122",
};

const allUsers = await utils.getAllUsers();
const userExists = allUsers.some(allUsers => (allUsers.numePersoana = "Carmatiu Pluntiu"));
if (!userExists)
    await utils.insertUser(persoana1);

res.status(200).send("Pentru browser");
});

app.post("/reset",async(req,res) =>{

const resetDb = await utils.resetDatabase();
console.log("Baza de date a fost resetata cu succes");
res.status(200).json({message: resetDb});
});