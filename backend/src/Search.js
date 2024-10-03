const mysql = require('mysql');
const { db } = require('../db/model');
const { decodeAccessToken } = require('../token');

const Search = async (req, res) => {
  const decodedToken = await decodeAccessToken(req.headers.authorization);
  console.log("decodedToken: ", decodedToken);
  if (!decodedToken || !decodedToken.user_id) {
    console.error('Invalid or missing user information in the token');
    return res.status(401).send('Unauthorized');
  }
  const userid = decodedToken.user_id;
  const query = req.body.query || undefined;
  console.log("query: ")
  db.getConnection((err, connection) => {
    if (err) throw err;
    if (query === undefined) {
      console.log("query is null, showing all users!")
      connection.query('select username,email from user_table', (err, result) => {
        if (err) throw err;
        if (result) {
          console.log("sended users for adding it in team")
          res.json(result)
        }
        else {
          res.status(404).send("an error occured")
        }
      })
    }
    else {
      const searchQuery = mysql.format('select * from user_table where username=? or name=?', [query, query]);
      connection.query(searchQuery, (err, result) => {
        if (err) throw err;
        if (result.length != 0) {
          const profileResult = result;
          res.json({ profileResult, projResult: [] }); // Ensure empty projResult if no projects found
        } else {
          const postQuery = mysql.format('select * from projects where title=?', [query]);
          connection.query(postQuery, (err, result) => {
            if (err) throw err;
            const projResult = result;
            res.json({ profileResult: [], projResult }); // Ensure empty profileResult if no profiles found
          });
        }
      });
    }
  });
};

module.exports = Search;
