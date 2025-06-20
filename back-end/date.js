const sqlite3 = require("sqlite3");
const { open } = require("sqlite");



let db = null;

const startDB = async () => {
  try {
    db = await open({
      filename: "studyspace.db",
      driver: sqlite3.Database,
    });
    console.log("Conexiunea la baza de date a fost deschisa");
// 15
// 16
// 17
// 18
    //Elevi
    // await db.run(`INSERT INTO elevi(nume, parola, email) values('Maria Ionescu', '', 'maria.ionescu@gmail.com')`)
    //Romanian localization
// await db.run(`INSERT INTO participanti(email_participant, id_curs, data_aderare) values ('ionpopescu@gmail.com', 15, '2025-02-01')`)


    return true;
  } catch (error) {
    console.error("Nu s-a putut deschide conexiunea la baza de date");
    return false;
  }
};

startDB()