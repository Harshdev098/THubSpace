const { resolve } = require('path');
const { db } = require('../db/model')
const mysql = require('mysql')

const SaveChat = (room, message, username) => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) throw err;
            const timing=new Date().toISOString().slice(0, 19).replace('T', ' ')
            const query = mysql.format('insert into chats(message,room,username,timing) values(?,?,?,?)', [message, room, username,timing])
            connection.query(query, (err, result) => {
                if (err) throw err;
                if (result) {
                    console.log(result)
                    console.log("insertid:", result.inserId)
                    resolve(result.insertId)
                }
                else{
                    reject("an error occured")
                }
            })
        })
    })
}


const recoverMessage = (rowid, room) => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) throw err;
            const query = mysql.format('select * from chats where room=? and id>?', [rowid, room])
            connection.query(query, (err, result) => {
                if (err) throw err;
                resolve(result.inserId)
            })
        })
    })
}

const fetchmessages = (room) => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) return reject(err);
            const fetchquery = mysql.format('SELECT * FROM chats WHERE room = ?', [room]);
            connection.query(fetchquery, (err, results) => {
                if (err) return reject(err);
                if (results.length !== 0) {
                    console.log("results: ", results)
                    resolve(results);
                } else {
                    resolve([]);
                }
            });
        });
    });
};


// const auth=async(req,res)=>{
//     const decodedToken = await decodeAccessToken(req.headers.authorization);
//     console.log("decodedToken: ", decodedToken)
//     if (!decodedToken || !decodedToken.user_id) {
//         console.error('Invalid or missing user information in the token');
//         return res.status(401).send('Unauthorized');
//     }
// }

module.exports = { SaveChat, fetchmessages, recoverMessage }