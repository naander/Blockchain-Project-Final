const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS professors (profID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS university (univID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS course (cID INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, name TEXT NOT NULL)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS teaching (teachID INTEGER PRIMARY KEY AUTOINCREMENT, professorID INTEGER REFERENCES professors(profID), universityID INTEGER REFERENCES university(univID), courseID INTEGER REFERENCES course(cID))"
  );
  //db.run('CREATE TABLE reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, professorID INTEGER REFERENCES professors(id), university TEXT NOT NULL, rating INTEGER, review TEXT)');
  // // Trigger checks rating is between 0 and 10 before inserting new row
  //db.run('CREATE TRIGGER IF NOT EXISTS check_rating BEFORE INSERT ON reviews WHEN NEW.rating < 0 OR NEW.rating > 10 BEGIN SELECT RAISE(ABORT, "Rating must be between 0 and 10"); END;');
});

// INSERT Data
db.addProfessor = async function (profName) {
  let success = false;
  try {
    const result = await db.run("INSERT INTO PROFESSORS (name) VALUES (?)", [profName]);
    success = result.changes > 0 ? true : false;
  } catch (dbError) {
    console.error(dbError);
  }
  return success;
};

db.addUniversity = async (name) => {
  let success = false;
  try {
    const result = await db.run("INSERT INTO UNIVERSITY (name) VALUES (?)", [name]);
    success = result.changes > 0 ? true : false;
  } catch (dbError) {
    console.error(dbError);
  }
  return success;
};

db.addCourse = async (code, name) => {
  let success = false;
  try {
    const result = await db.run("INSERT INTO COURSE (code, name) VALUES (?, ?)", [
      code,
      name,
    ]);
    success = result.changes > 0 ? true : false;
  } catch (dbError) {
    console.error(dbError);
  }
  return success;
};

db.addTeaching = async (professorID, universityID, courseID) => {
  let success = false;
  try {
    const result = await db.run(
      "INSERT INTO TEACHING (professorID, universityID, courseID) VALUES (?, ?, ?)",
      [professorID, universityID, courseID]
    );
    success = result.changes > 0 ? true : false;

  } catch (dbError) {
    console.error(dbError);
  }
  return success;
};

db.addReview = async (professorId, university, rating, reviewText) => {
  let success = false;
  try {
    const result = await db.run(
      "INSERT INTO REVIEWS (professorID, university, rating, review) VALUES (?, ?, ?, ?)",
      [professorId, university, rating, reviewText]
    );
    success = result.changes > 0 ? true : false;
  } catch (dbError) {
    console.error(dbError);
  }
  return success;
};

// UPDATE Data
db.updateProfessor = async (profID, blockchainID, name) => {
  let success = false;
  try {
    const result = await db.run(
      "UPDATE PROFESSORS SET blockchainID = ?, name = ? WHERE profID = ?",
      [blockchainID, name, profID]
    );
    success = result.changes > 0 ? true : false;
  } catch (dbError) {
    console.error(dbError);
  }
  return success;
};

db.updateUniversity = async (univID, name) => {
  let success = false;
  try {
    const result = await db.run("UPDATE University SET name = ? WHERE univID = ?", [
      name,
      univID,
    ]);
    success = result.changes > 0 ? true : false;
  } catch (dbError) {
    console.error(dbError);
  }
  return success;
};

db.updateCourse = async (cID, code, name) => {
  let success = false;
  try {
    const result = await db.run("UPDATE course SET code = ?, name = ? WHERE cID = ?", [
      code,
      name,
      cID,
    ]);
    success = result.changes > 0 ? true : false;
  } catch (dbError) {
    console.error(dbError);
  }
  return success;
};

db.updateTeaching = async (teachID, professorID, universityID, courseID) => {
  let success = false;
  try {
    const result = await db.run(
      "UPDATE teaching SET professorID = ?, universityID = ?, courseID = ? WHERE teachID = ?",
      [professorID, universityID, courseID, teachID]
    );
    success = result.changes > 0 ? true : false;
  } catch (dbError) {
    console.error(dbError);
  }
  return success;
};

// DELETE Data
db.deleteProf = async (profID) => {
  let success = false;
  try {
    const result = await db.run("Delete from PROFESSORS WHERE profID = ?", [profID]);
    success = result.changes > 0 ? true : false;
  } catch (dbError) {
    console.error(dbError);
  }
  return success;
};

db.deleteUniversity = async (univID) => {
  let success = false;
  try {
    const result = await db.run("Delete from UNIVERSITY WHERE univID = ?", [univID]);
    success = result.changes > 0 ? true : false;
  } catch (dbError) {
    console.error(dbError);
  }
  return success;
};

db.deleteCourse = async (cID) => {
  let success = false;
  try {
    const result = db.run("Delete from COURSE WHERE cID = ?", [cID]);
    success = result.changes > 0 ? true : false;
  } catch (dbError) {
    console.error(dbError);
  }
  return success;
};

db.deleteTeaching = async (cID) => {
  let success = false;
  try {
    const result = await db.run("Delete from TEACHING WHERE teachID = ?", [teachID]);
  } catch (dbError) {
    console.error(dbError);
    success = result.changes > 0 ? true : false;
  }
  return success;
};

// GET Data
// get all columns from university table
db.getUniversities = async () => { 
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM university", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows); 
        }
      });
    });
    console.log(rows); 
    return rows; 
  } 
  catch (err) { 
    console.error("Error getting universities from the database:", err); 
    throw err; 
  } 
}; 

// get professor id, professor blockchainID, professor name
// for professors who have taught at the universityid inputed
db.getProfessors = async (universityID) => { 
  try { 
    const rows = await db.all( "SELECT professors.profID, professors.name FROM professors INNER JOIN teaching ON professors.profID = teaching.professorID WHERE teaching.universityID = ?", [universityID] ); 
    console.log(rows); 
    return rows; 
  } 
  catch (err) { 
    console.error( "Error getting professor from the database for this university:", err ); 
    throw err; 
  } 
};

db.getAllProfessors = async () => {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM professors", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    const professors = rows.map(row => ({
      profID: row.profID,
      name: row.name
    }));
    return professors;
  } catch (err) {
    console.error("Error getting all professors from the database:", err);
    throw err;
  }
};
  

// return all professors with the name ?
db.getProfessorsByName = async (name) => {
  try {
    const rows = await db.all("SELECT * FROM professors WHERE name = ?", [name]);
    const professors = rows.map(row => ({
      profID: row.profID,
      name: row.name
    }));
    return professors;
  } catch (err) {
    console.error("Error getting professors from the database:", err);
    throw err;
  }
};


// get professor id given input professor name, returns profID [ { profID: 21 } ]
db.getProfID = async (name) => {
  try {
    const rows = await db.all("SELECT professors.profID FROM professors WHERE name = ?", [name]);
    console.log(rows);
    return rows;
  } catch (err) {
    console.error("Error getting professor from the database:", err);
    throw err;
  }
};


// get Reviews for a professor by professor id
// db.getReviews = (id) => {
//   db.all("SELECT professors.name, reviews.university, reviews.rating, reviews.review FROM reviews INNER JOIN professors ON reviews.professorID = professors.id WHERE professors.ID = ?", [id], (err, rows) => {
//     if (err) {
//       console.error("Error getting reviews from database:", err);
//       return rows;
//     } else {
//       return rows;
//     }
//   });
// };

// DROP TABLES

db.dropProfessors = async () => {
  try {
    const result = await db.run("DROP TABLE IF EXISTS professors");
    return result;
  } catch (err) {
    console.error("Error dropping professors table from from database:", err);
    throw err;
  }
};


db.dropUniversity = async () => {
  try {
    const result = await db.run("DROP TABLE IF EXISTS university");
    return result;
  } catch (err) {
    console.error("Error dropping university table from database:", err);
    throw err;
  }
};

db.dropCourse = async () => {
  try {
    const result = await db.run("DROP TABLE IF EXISTS course");
    return result;
  } catch (err) {
    console.error("Error dropping course table from database:", err);
    throw err;
  }
};

db.dropTeaching = async () => {
  try {
    const result = await db.run("DROP TABLE IF EXISTS teaching");
    return result;
  } catch (err) {
    console.error("Error dropping teaching table from database:", err);
    throw err;
  }
};

  
// test data
db.addDefaultProfessors = () => {
  db.serialize(() => {
    db.addProfessor("Lewis Tseng");
    db.addUniversity("Boston College");
    db.addUniversity("Tufts University");
    db.addCourse("CSCI3389", "Blockchain and Consensus Systems");
    db.addTeaching(1, 1, 1);

    db.addProfessor("Jeffrey Carruthers");
    db.addCourse("CASCS112", "Design by Software");
    db.addTeaching(1, 1, 1);

    db.addProfessor("Sarah Johnson");
    db.addCourse("CASCS101", "Intro to Programming");
    db.addTeaching(2, 1, 2);

    db.addProfessor("David Kim");
    db.addCourse("CASCS231", "Data Structures");
    db.addTeaching(3, 1, 3);

    db.addProfessor("Samantha Lee");
    db.addCourse("CASCS315", "Artificial Intelligence");
    db.addTeaching(4, 1, 4);

    db.addProfessor("Brian Wilson");
    db.addCourse("CASCS420", "Web Development");
    db.addTeaching(5, 1, 5);

    db.addProfessor("Jessica Kim");
    db.addCourse("CASCS315", "Artificial Intelligence");
    db.addTeaching(6, 1, 6);

    db.addProfessor("Daniel Lee");
    db.addCourse("CASCS112", "Design by Software");
    db.addTeaching(7, 1, 7);

    db.addProfessor("Melissa Jackson");
    db.addCourse("CASCS420", "Web Development");
    db.addTeaching(8, 1, 8);

    db.addProfessor("Alex Nguyen");
    db.addCourse("CASCS101", "Intro to Programming");
    db.addTeaching(9, 1, 9);

    db.addProfessor("Sophia Rodriguez");
    db.addCourse("CASCS231", "Data Structures");
    db.addTeaching(10, 1, 10);

    db.addProfessor("Kevin Lee");
    db.addCourse("CASCS112", "Design by Software");
    db.addTeaching(11, 1, 11);

    db.addProfessor("Grace Kim");
    db.addCourse("CASCS101", "Intro to Programming");
    db.addTeaching(12, 1, 12);

    db.addProfessor("David Lee");
    db.addCourse("CASCS420", "Web Development");
    db.addTeaching(13, 1, 13);

    db.addProfessor("Michelle Chen");
    db.addCourse("CASCS315", "Artificial Intelligence");
    db.addTeaching(14, 1, 14);

    db.addProfessor("Jason Park");
    db.addCourse("CASCS231", "Data Structures");
    db.addTeaching(15, 1, 15);

    db.addProfessor("Karen Lee");
    db.addCourse("CASCS101", "Intro to Programming");
    db.addTeaching(16, 1, 16);

    db.addProfessor("Ryan Kim");
    db.addCourse("CASCS420", "Web Development");
    db.addTeaching(17, 1, 17);

    db.addProfessor("Jessica Park");
    db.addCourse("CASCS112", "Design by Software");
    db.addTeaching(18, 1, 18);

    db.addProfessor("Ethan Chen");
    db.addCourse("CASCS315", "Artificial Intelligence");
    db.addTeaching(19, 1, 19);

    db.addProfessor("Rachel Lee");
    db.addCourse("CASCS231", "Data Structures");
    db.addTeaching(20, 1, 20);

    db.addProfessor("Adam Smith");
    db.addCourse("CASCS420", "Web Development");
    db.addTeaching(21, 1, 21);
  });
};

module.exports = { db };
// db.serialize(() => {
//db.addDefaultProfessors();
//   db.getUniversities();
//   db.getAllProfessors();
// });
//   db.getProfessors(1);
  //db.getProfID("Lewis Tseng");

//db.addDefaultProfessors();ß

//db.dropProfessors();
//db.dropTeaching();
//db.dropUniversity();
//db.dropCourse();


// UPDATE Data
//   db.updateProfessor(1, "Jane Doe");
//   db.updateUniversity(1, "MIT");
//   db.updateCourse(1, "CS102", "Computer Science II");
//   db.updateTeaching(1, 2, 2, "CS102");
//   db.getUniversities();
//   db.getAllProfessors();
//   db.getProfessors(1);

//   // DELETE Data
//   db.deleteProf(1);
//   db.deleteUniversity(1);
//   db.deleteCourse("CS102");
//   db.deleteTeaching(1);
//   db.deleteReview(1);

//   db.getUniversities();
//   db.getAllProfessors();
//   db.getProfessors(1);

