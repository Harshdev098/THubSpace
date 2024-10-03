const notify = require('./mailer');
const { db } = require('../db/model');
const { decodeAccessToken } = require('../token');
const mysql = require('mysql');

const scheduleDiscussion = async (req, res) => {
    const room = req.body.room;
    const date = req.body.date;
    const time = req.body.time;

    try {
        const decodedToken = await decodeAccessToken(req.headers.authorization);
        console.log("decodedToken: ", decodedToken);

        if (!decodedToken || !decodedToken.user_id) {
            console.error('Invalid or missing user information in the token');
            return res.status(401).send('Unauthorized');
        }

        const userid = decodedToken.user_id;
        const isMemberOfRoom = await isMember(userid, room);

        if (!isMemberOfRoom) {
            return res.status(401).send('Unauthorized');
        }

        db.getConnection((err, connection) => {
            if (err) throw err;

            const query = mysql.format('SELECT * FROM rooms WHERE room = ?', [room]);
            connection.query(query, (err, result) => {
                if (err) throw err;

                console.log(result);
                if (result.length > 0) {
                    const userIds = result.map(row => row.userid);
                    
                    userIds.forEach(user => {
                        const userquery = mysql.format('SELECT * FROM user_table WHERE user_id = ?', [user]);
                        connection.query(userquery, (err, userResult) => {
                            if (err) throw err;

                            if (userResult.length > 0) {
                                const email = userResult[0].email;
                                const sub = "Alert! Discussion Scheduled";
                                const desc = `Your project discussion has been scheduled on ${date} at ${time}`;
                                notify(email, sub, desc);
                            }
                        });
                    });

                    res.send("Discussion Scheduled");
                } else {
                    res.status(404).send("Room not found");
                }

                connection.release();
            });
        });
    } catch (error) {
        console.error('Error scheduling discussion:', error);
        res.status(500).send('Internal Server Error');
    }
};

const isMember = (userid, room) => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            const query = mysql.format('SELECT * FROM rooms WHERE userid = ? AND room = ?', [userid, room]);
            connection.query(query, (err, result) => {
                connection.release();
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.length !== 0);
            });
        });
    });
};

module.exports = scheduleDiscussion;
