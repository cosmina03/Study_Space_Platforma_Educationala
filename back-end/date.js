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
    return true;
  } catch (error) {
    console.error("Nu s-a putut deschide conexiunea la baza de date");
    return false;
  }
};



startDB()
