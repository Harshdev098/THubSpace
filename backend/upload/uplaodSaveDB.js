const mysql = require('mysql');
const { db } = require('../db/model');
const {decodeAccessToken}=require('../token')

const saveUploads = async(req, res) => {
    const filename = req.file.filename;
    const filepath = req.file.path;
    const title = req.body.title;
    const desc = req.body.desc;
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    console.log("decodedToken: ",decodedToken)
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid=decodedToken.user_id
    console.log(userid)
    console.log(filename, filepath, title,desc);
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Database connection error');
            return;
        }
        const query = 'INSERT INTO uploads (filename,filepath,userid) VALUES (?, ?, ?)';
        const insertQuery = mysql.format(query, [filename, filepath, userid]);
        connection.query(insertQuery, (err, result) => {
            connection.release(); 
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Error saving data');
                return;
            }
            console.log("saved");
            res.status(200).send('File uploaded successfully');
        });
    });
};

module.exports = saveUploads;
