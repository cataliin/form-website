const express = require("express");
const bodyParser = require('body-parser');
const {body, validationResult} = require('express-validator');
const utils = require("./utils");
const app = express();
const path = require('path');
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const port = 1234;
app.listen(port, () => console.log(`Serverul merge pe portul ${port}`));

app.use(express.static(path.join(__dirname,'public')));

app.post('/submit-form',[
body('numepre').isString().notEmpty().withMessage("Numele este obligatoriu si trebuie sa fie un nume valid")
.matches(/^[a-zA-Z\s]+$/).withMessage("Numele nu trebuie sa contina cifre sau simboluri"),
body('data_nasterii').isDate().withMessage("Data nasterii este obligatorie si trebuie sa fie o data valida"),
body('mail').isEmail().withMessage("Introdu o adresa de email valida"),
body('telefon').matches(/^07\d{8}$/).withMessage("Introdu un numar de telefon valid") /// validatori pentru datele de intrare
], async(req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
        return res.status(400).send(errors.array().map(error => error.msg).join(', '));
const {numepre,data_nasterii,mail,telefon} = req.body;

if (data_nasterii > "2010-01-01")
    return res.status(400).send("Nu ai varsta minima necesara");

console.log('Datele primite:', { numepre, data_nasterii, mail, telefon});
try{

    const esteEmailulUnic = await utils.isEmailUnique(mail);
    if (!esteEmailulUnic){
        return res.status(400).send("Emailul exista deja");
    }

    const esteTelefonulUnic = await utils.isPhoneUnique(telefon);
    if (!esteTelefonulUnic){
        return res.status(400).send("Telefonul exista deja");
    }

const userDeAdaugat = {numepre,data_nasterii,mail,telefon};
const result = await utils.insertUser(userDeAdaugat);
console.log(result);
res.send("Datele au fost adaugate in baza de date");
}
catch(error){
    console.log(error);
    res.status(500).send('Server error');
}
});

app.post("/reset",async(req,res) =>{
try{
const resetDb = await utils.resetDatabase();
console.log("Baza de date a fost resetata cu succes");
res.status(200).json({message: resetDb});
}
catch(error){
    console.log("Database reset error:", error);
    res.status(500).send("Server error");
}
});