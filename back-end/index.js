const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const sharp = require("sharp");
const multer = require("multer");
const { v4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const storage = multer.memoryStorage();
const upload = multer({ storage });

let db = null;

const PORT = 8080;
const JWT_KEY = "sCUE9RIYE0ihLdluI1O";

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

const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers["authentication"];
  if (!token) {
    return res.status(401).json("Nu sunteti autentificat");
  }

  jwt.verify(token, JWT_KEY, {}, (err, decoded) => {
    if (err) {
      return res.status(401).json("Token invalid");
    }

    req.decoded = decoded;
    next();
  });
};

app.use(express.json());
app.use(cors("localhost:3000"));

app.get("/hello", (req, res) => {
  res.status(200).json("Hello!");
});

app.post("/creare-cont", async (req, res) => {
  try {
    const { email, parola, elev, nume } = req.body;
    if (!email) {
      return res.status(400).json("Lipseste emailul");
    }
    if (!parola) {
      return res.status(400).json("Lipseste parola");
    }
    if (elev == undefined) {
      return res.status(400).json("Lipseste elev");
    }
    if (!nume) {
      return res.status(400).json("Lipseste numele");
    }

    const contElevi = await db.get(
      "SELECT * FROM elevi WHERE email = ?",
      email
    );
    const contProf = await db.get(
      "SELECT * FROM profesori WHERE email = ?",
      email
    );

    if (contElevi || contProf) {
      return res
        .status(400)
        .json("Contul cu aceasta adresa de email exista deja!");
    }

    //hashing + salting
    const salt = await bcrypt.genSalt(2);
    const parolaHash = await bcrypt.hash(parola, salt);
    if (elev) {
      const res = await db.run(
        "INSERT INTO elevi VALUES (? , ?, ?)",
        email,
        parolaHash,
        nume
      );
      if (res.changes == 0) {
        return res.status(500).json("Eroare de server");
      }
    } else {
      await db.run(
        "INSERT INTO profesori VALUES (? , ?, ?)",
        email,
        parolaHash,
        nume
      );
      if (res.changes == 0) {
        return res.status(500).json("Eroare de server");
      }
    }

    jwt.sign(
      { sub: email, elev },
      JWT_KEY,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          return res.status(500).json("Eroare in semnarea token-ului");
        }
        return res.status(200).json({
          success: true,
          jwt: token,
          userData: { elev, nume, credite: 0 },
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Eroare de server");
  }
});

app.post("/autentificare", async (req, res) => {
  try {
    const { email, parola } = req.body;
    if (!email) {
      return res.status(400).json("Lipseste emailul");
    }
    if (!parola) {
      return res.status(400).json("Lipseste parola");
    }

    const contElevi = await db.get(
      "SELECT * FROM elevi WHERE email = ?",
      email
    );
    const contProf = await db.get(
      "SELECT * FROM profesori WHERE email = ?",
      email
    );

    if (!contElevi && !contProf) {
      return res
        .status(400)
        .json("Contul cu aceasta adresa de email nu exista");
    }
    const cont = contElevi || contProf;
    const elev = !!contElevi || false;
    const parolaDeVerificat = contElevi?.parola || contProf?.parola;

    const parolaCorecta = await bcrypt.compare(parola, parolaDeVerificat);

    if (!parolaCorecta) {
      return res.status(400).json("Parola incorecta");
    }

    jwt.sign(
      { sub: email, elev },
      JWT_KEY,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          return res.status(500).json("Eroare in semnarea token-ului");
        }
        return res.status(200).json({
          success: true,
          jwt: token,
          userData: { elev, nume: cont.nume, credite: cont.credite },
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Eroare de server");
  }
});

app.post(
  "/curs",
  verifyTokenMiddleware,
  upload.single("poza_curs"),
  async (req, res) => {
    try {
      const { sub: email, elev } = req.decoded;
      if (elev) {
        return res.status(400).json("Nu poti crea curs daca esti elev");
      }
      const { titlu, descriere, cost } = req.body;
      if (!titlu || !descriere || !cost) {
        return res.status(400).json("Completati toate campurile!");
      }
      const file = req?.file;
      if (!file) {
        return res.status(400).json("Adaugati o poza!");
      }
      const fileBuffer = file.buffer;

      const resized = await sharp(fileBuffer)
        .resize({
          width: 400,
          height: 160,
          fit: "cover",
        })
        .toBuffer();

      const uuid = v4();
      const calePoza = path.join(__dirname, "storage_poze", `${uuid}.jpg`);

      fs.writeFileSync(calePoza, resized);

      const resultatInsert = db.run(
        `INSERT INTO cursuri 
            (email_profesor, titlu , descriere, cost, cale_poza) 
            VALUES (?, ?, ?, ?, ?)`,
        email,
        titlu,
        descriere,
        cost,
        uuid
      );
      if (resultatInsert.changes == 0) {
        return res.status(500).json("Cursul nu a putut fi creat!");
      }

      return res.status(200).json("Curs creat cu succes!");
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Cursul nu a putut fi creat!");
    }
  }
);

app.get("/poza/:cale", async (req, res) => {
  try {
    const { cale } = req.params;
    if (!cale) {
      return res.status(400).json("Adaugati id-ul pozei");
    }
    const caleServer = path.join(__dirname, "storage_poze", `${cale}.jpg`);
    // console.log(caleServer)
    const stream = fs.createReadStream(caleServer.toString());
    res.setHeader("Content-Type", "image/jpeg");
    stream.on("error", () => {
      return res.status(500).json("Eroare in preluarea pozei");
    });
    stream.pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Eroare in preluarea pozei");
  }
});

app.get("/:tipMaterial/:cale/:tip/:download", async (req, res) => {
  try {
    const { cale, tip, tipMaterial } = req.params;
    const download = req.params.download == "true";
    if (!cale || !tip) {
      return res.status(400).json("Adaugati calea si tipul atasamentului");
    }
    const caleServer = path.join(__dirname, "atasamente", `${cale}.${tip}`);
    if (!fs.existsSync(caleServer)) {
      return res.status(400).json("Fisierul nu exista");
    }

    const TIPURI_IMAGINE = ["jpg", "jpeg", "png", "webp"];

    let material = {};

    if (tipMaterial == "atasament") {
      material = await db.get(
        "SELECT * FROM materiale WHERE cale_atasament = ?",
        cale
      );
    } else {
      material = await db.get(
        "SELECT * FROM teme WHERE cale_atasament = ?",
        cale
      );
    }

    if (TIPURI_IMAGINE.includes(tip) && !download) {
      res.setHeader("Content-Type", "image/jpeg");
    } else {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${material?.titlu}.${material?.tip_atasament}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");
    }

    const stream = fs.createReadStream(caleServer.toString());
    stream.on("error", () => {
      return res.status(500).json("Eroare in preluarea pozei");
    });
    stream.pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Eroare in preluarea pozei");
  }
});

app.get("/cursuri/:tip", verifyTokenMiddleware, async (req, res) => {
  try {
    const { tip } = req.params;
    const { sub: email, elev } = req.decoded;

    let cursuri = null;
    if (tip == "toate") {
      if (elev) {
        cursuri = await db.all(`
            SELECT c.*, p.nume
            FROM cursuri c
            JOIN profesori p
            ON c.email_profesor = p.email
            `);
      } else {
        cursuri = await db.all(
          `
            SELECT * 
            FROM cursuri
            WHERE email_profesor = ?
            `,
          email
        );
      }
    } else {
      //proprii
      if (elev) {
        cursuri = await db.all(`
            SELECT c.*, p.nume
            FROM cursuri c
            JOIN profesori p, participanti pa
            ON c.email_profesor = p.email
            AND pa.id_curs = c.id
            `);
      } else {
        cursuri = await db.all(
          `
            SELECT * 
            FROM cursuri
            WHERE email_profesor = ?
            `,
          email
        );
      }
    }

    return res.status(200).json({ cursuri });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Eroare de server");
  }
});

//TODO daca le-a achizitionat
app.get("/materiale/:idCurs", verifyTokenMiddleware, async (req, res) => {
  try {
    const { idCurs } = req.params;
    const { sub: email, elev } = req.decoded;

    const materiale = await db.all(
      `
            SELECT *
            FROM materiale
            WHERE id_curs = ?
            `,
      idCurs
    );

    return res.status(200).json({ materiale });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Eroare de server");
  }
});

app.post(
  "/material",
  verifyTokenMiddleware,
  upload.single("atasament"),
  async (req, res) => {
    try {
      const { idCurs, titlu, descriere } = req.body;
      const { sub: email, elev } = req.decoded;
      const originalName = req.file.originalname;
      const splitArray = originalName.split(".");
      const tip = splitArray[splitArray.length - 1];
      const fileBuffer = req.file.buffer;

      const uuid = v4();

      const lastID = await db.run(
        `
            INSERT INTO 
            materiale (id_curs, titlu, descriere, cale_atasament, tip_atasament)
            VALUES (?, ?, ?, ?, ?)
            `,
        idCurs,
        titlu,
        descriere,
        uuid,
        tip
      );

      fs.writeFileSync(
        path.join(__dirname, "atasamente", `${uuid}.${tip}`),
        fileBuffer
      );

      return res.status(200).json({ success: !Number(isNaN(+lastID)) });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Eroare de server");
    }
  }
);

app.get("/teme/:idCurs", verifyTokenMiddleware, async (req, res) => {
  try {
    const { idCurs } = req.params;
    const { sub: email, elev } = req.decoded;

    const today = new Date()
      .toLocaleString("sv-SE", { timeZone: "Europe/Bucharest" })
      .split("T")[0];

    const teme = await db.all(`
        SELECT f.nota, f.text, f.id id_feedback, f.cale_atasament, t.*
        FROM teme t
        LEFT JOIN raspuns_tema r on t.id = r.id_tema
        LEFT JOIN feedback f ON f.id_rasp = r.id
        WHERE t.id_curs = ?
            `,
      idCurs
    );

    return res.status(200).json({ teme });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Eroare de server");
  }
});

app.get("/teme", verifyTokenMiddleware, async (req, res) => {
  try {
    const { sub: email, elev } = req.decoded;
    if (elev == true) {
      return res.status(400).json("Neautorizat");
    }

    const teme = await db.all(`
      SELECT r.*, r.id id_rasp, c.*, t.*, e.nume FROM raspuns_tema r
        JOIN teme t ON t.id = r.id_tema
        JOIN cursuri c ON c.id = t.id_curs
        JOIN elevi e ON e.email = r.email_participant
        WHERE c.email_profesor = ?
        AND r.id NOT IN ( SELECT id_rasp FROM feedback)
      `,email);

    return res.status(200).json({ teme });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Eroare de server");
  }
});

app.get("/raspuns/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id)

    const raspuns = await db.get(`
      SELECT * FROM raspuns_tema r
        JOIN elevi e on e.email = r.email_participant

        WHERE r.id = ?
      `, id)

      if(!raspuns){
        return res.status(400).json("Raspunsul nu a fost gasit");
      }


      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${raspuns.nume}.${raspuns?.tip_atasament}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

    const caleServer = path.join(__dirname, "teme", `${raspuns.cale_atasament}.${raspuns?.tip_atasament}`);

    const stream = fs.createReadStream(caleServer.toString());
    stream.on("error", () => {
      return res.status(500).json("Eroare in preluarea raspunsului");
    });
    stream.pipe(res);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Eroare de server");
  }
});

app.get("/feedback/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id)

    const raspuns = await db.get(`
      SELECT f.*, t.titlu FROM feedback f
        JOIN raspuns_tema r ON r.id = f.id_rasp
        JOIN teme t on r.id_tema = t.id
        WHERE f.id = ?
      `, id)

      if(!raspuns){
        return res.status(400).json("Raspunsul nu a fost gasit");
      }


      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${raspuns.titlu}.${raspuns?.tip_atasament}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

    const caleServer = path.join(__dirname, "feedback", `${raspuns.cale_atasament}.${raspuns?.tip_atasament}`);

    const stream = fs.createReadStream(caleServer.toString());
    stream.on("error", () => {
      return res.status(500).json("Eroare in preluarea raspunsului");
    });
    stream.pipe(res);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Eroare de server");
  }
});

app.post("/tema/:id",
  verifyTokenMiddleware,
  upload.single("tema"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { sub: email, elev } = req.decoded;

      const today = new Date()
        .toLocaleString("sv-SE", { timeZone: "Europe/Bucharest" })
        .split("T")[0];

      const tema = await db.get(
        `
            SELECT *
            FROM teme
            WHERE id = ?
            `,
        id
      );

      if (!tema) {
        return res.status(400).json("Tema nu exista");
      }

      if (tema.termen < today) {
        return res.status(400).json("Termen depasit!");
      }

      const temaTrimisa = await db.get(
        `
        SELECT * FROM raspuns_tema
        WHERE id_tema = ? AND email_participant = ?
        `,
        id,
        email
      );

      if (temaTrimisa) {
        return res
          .status(400)
          .json("Ati trimis deja un raspuns pentru ac. tema!");
      }

      if (req.file) {
        const originalName = req.file.originalname;
        const splitArray = originalName.split(".");
        const tip = splitArray[splitArray.length - 1];
        const fileBuffer = req.file.buffer;

        const uuid = v4();

        const lastID = await db.run(
          `
            INSERT INTO raspuns_tema
            ( id_tema, cale_atasament, email_participant, tip_atasament)
             values( ?, ?, ?, ?)
            `,
          id,
          uuid,
          email,
          tip
        );

        fs.writeFileSync(
          path.join(__dirname, "teme", `${uuid}.${tip}`),
          fileBuffer
        );
      }
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Eroare de server");
    }
  }
);

app.put(
  "/material",
  verifyTokenMiddleware,
  upload.single("atasament"),
  async (req, res) => {
    try {
      const { idCurs, titlu, descriere, idMaterial } = req.body;
      const { sub: email, elev } = req.decoded;
      if (req.file && idMaterial) {
        const originalName = req.file.originalname;
        const splitArray = originalName.split(".");
        const tip = splitArray[splitArray.length - 1];
        const fileBuffer = req.file.buffer;

        const uuid = v4();

        const { cale_atasament, tip_atasament } = await db.get(
          "SELECT * FROM materiale WHERE id = ?",
          idMaterial
        );

        if (cale_atasament && tip_atasament) {
          fs.unlinkSync(
            path.join(
              __dirname,
              "atasamente",
              `${cale_atasament}.${tip_atasament}`
            )
          );
        }

        const lastID = await db.run(
          `
            UPDATE materiale SET cale_atasament = ?, tip_atasament = ?
            WHERE id = ?
            `,
          uuid,
          tip,
          idMaterial
        );

        fs.writeFileSync(
          path.join(__dirname, "atasamente", `${uuid}.${tip}`),
          fileBuffer
        );
      }
      const lastID = await db.run(
        `
            UPDATE materiale SET titlu = ?, descriere = ?
            WHERE id = ?
            `,
        titlu,
        descriere,
        idMaterial
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Eroare de server");
    }
  }
);

app.post(
  "/tema",
  verifyTokenMiddleware,
  upload.single("atasament"),
  async (req, res) => {
    try {
      const { idCurs, titlu, descriere, deadline } = req.body;
      const { sub: email, elev } = req.decoded;
      const originalName = req.file.originalname;
      const splitArray = originalName.split(".");
      const tip = splitArray[splitArray.length - 1];
      const fileBuffer = req.file.buffer;

      const uuid = v4();

      const lastID = await db.run(
        `
            INSERT INTO 
            teme (id_curs, titlu, descriere, cale_atasament, tip_atasament, termen)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
        idCurs,
        titlu,
        descriere,
        uuid,
        tip,
        deadline
      );

      fs.writeFileSync(
        path.join(__dirname, "atasamente", `${uuid}.${tip}`),
        fileBuffer
      );

      return res.status(200).json({ success: !Number(isNaN(+lastID)) });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Eroare de server");
    }
  }
);

app.post("/feedback",
  verifyTokenMiddleware,
  upload.single("atasament"),
  async (req, res) => {
    try {
      const { feedback, nota, id_rasp } = req.body;
      const { sub: email, elev } = req.decoded;

      const originalName = req?.file?.originalname;
      const splitArray = originalName?.split(".");
      const tip = splitArray?.[splitArray.length - 1] || null;
      const fileBuffer = req?.file?.buffer;

      const uuid = fileBuffer ? v4() : null;

      const lastID = await db.run(
        `
            INSERT INTO 
            feedback (id_rasp, cale_atasament, email_profesor, tip_atasament, text, nota)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
        id_rasp,
        uuid,
        email,
        tip,
        feedback,
        nota
      );

      if(fileBuffer){
        fs.writeFileSync(
          path.join(__dirname, "feedback", `${uuid}.${tip}`),
          fileBuffer
        );
      }

      return res.status(200).json({ success: !Number(isNaN(+lastID)) });
    } catch (error) {
      console.error(error);
      return res.status(500).json("Eroare de server");
    }
  }
);

app.post("/plata/:credite", verifyTokenMiddleware, async (req, res) => {
  try {
    const { sub: email, elev } = req.decoded;
    const { credite } = req.params;

    await db.run(
      `
        UPDATE elevi
        SET credite = credite + ?
        WHERE email = ?
        `,
      credite,
      email
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Eroare de server");
  }
});

app.get("/statistici", async (req, res) => {
  try {

    const statistici = await db.get(`
      select 
        (select count(*) from elevi) elevi,
        (select count(*) from profesori) profesori,
        (select count(*) from cursuri) cursuri,
        (select count(*) from materiale) materiale
      `);

    return res.status(201).json({statistici});
  } catch (error) {
    console.error(error);
    return res.status(500).json("Eroare de server");
  }
});

app.post("/plata/:credite", verifyTokenMiddleware, async (req, res) => {
  try {
    const { sub: email, elev } = req.decoded;
    const { credite } = req.params;

    await db.run(
      `
        UPDATE elevi
        SET credite = credite + ?
        WHERE email = ?
        `,
      credite,
      email
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Eroare de server");
  }
});

app.listen(PORT, async () => {
  const pornitDb = await startDB();
  if (!pornitDb) {
    process.exit(1);
  }

  console.log(`Server pornit pe portul ${PORT}`);
});
