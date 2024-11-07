const { Sequelize, DataTypes } = require("sequelize");

const database = new Sequelize("UserDB", "root", "", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamp: true,
  },
});

const userDb = database.define(
  "Utilizatori",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numePersoana: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dataNasterii: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    emailPersoana: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numarTelefon: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  },
  { freezeTableName: true }
);


function resetDatabase() {
  return database
    .sync({ force: true })
    .then(() => {
      return "succes!";
    })
    .catch((err) => {
      return "eroare!!";
    });
}


function getAllUsers() {
  return userDb
    .findAll()
    .then((users) => {
      return users.map((user) => user.get());
    })
    .catch(() => {
      return "eroare!";
    });
}

function getUserById(id) {
  return userDb
    .findByPk(id)
    .then((user) => {
      return user.get();
    })
    .catch(() => {
      return "eroare!";
    });
}

function insertUser(user) {
  console.log("InsertUser called with: ",user);
  return userDb
    .create({
      numePersoana: user.numepre,
      dataNasterii: user.data_nasterii,
      emailPersoana: user.mail,
      numarTelefon: user.telefon
    })
    .then(() => {
      return "succes";
    })
    .catch((error) => {
      console.log("Eroare aparuta:",error);
      return "eroare!";
    });
}

function updateUser(user){
  return userDb
  .update(user,{
    where : {id: user.id}
  })
  .then(()=>{
    return "succes!";
  })
  .catch(()=>{
    return "eroare!";
  });
}


function deleteUser(id) {
  return userDb
    .destroy({
      where: {
        id: id,
      },
    })
    .then(() => {
      return "succes!";
    })
    .catch(() => {
      return "eroare!";
    });
}
module.exports = {
  resetDatabase,
  getAllUsers,
  getUserById,
  insertUser,
  deleteUser,
  updateUser
};