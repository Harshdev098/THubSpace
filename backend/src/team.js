const express = require('express')
const mysql = require('mysql')
const { db } = require('../db/model')
const { decodeAccessToken } = require('../token')
const notify = require('../mail/mailer')
const { saveNotification } = require('../mail/notification')
const router = express.Router()
const app = express()
app.use(express.json())


// creating team and adding members 
router.post('/create/team', async (req, res) => {
    const projName = req.query.ProjName;
    console.log(projName)
    const teamName = req.body.teamName
    const members = req.body.members
    console.log("added members: ", members)
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    console.log("decodedToken: ", decodedToken)
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user_id
    db.getConnection((err, connection) => {
        if (err) throw err;
        const query = mysql.format('select * from projects where title=? and userid=?', [projName, userid])
        connection.query(query, (err, result) => {
            if (err) throw err;
            if (result) {
                const ProjID = result[0].projID
                const query = mysql.format('insert into team(ProjID,teamName,userid,role,status) values(?,?,?,?,?)', [ProjID, teamName, userid, 'leader', true])
                connection.query(query, (err, result) => {
                    if (err) throw err;
                    console.log("team created with the leader")
                    const sub = `Invitation from ${teamName} to work on ${projName}`
                    if (members && Array.isArray(members)) {
                        members.forEach(member => {
                            const selectQuery = mysql.format('select * from user_table where username=?', [member])
                            connection.query(selectQuery, (err, result) => {
                                if (err) throw err;
                                if (result) {
                                    const email=result[0].email
                                    const memberUserid = result[0].user_id
                                    const query = mysql.format('insert into team values(?,?,?,?,?)', [ProjID, teamName, memberUserid, 'collaborator', false])
                                    connection.query(query, async (err, result) => {
                                        if (err) throw err;
                                        const desc = `Validate yourself as a member in the project ${projName} to collaborate with other team members. Click Here- http://localhost:3000/validate?email=${encodeURIComponent(email)}&ProjID=${encodeURIComponent(ProjID)}`
                                        console.log("collaborators are added")
                                        await notify(email, sub, desc)
                                    })
                                }
                            })
                        })
                        res.sendStatus(200)
                    }
                    else {
                        res.sendStatus(200)
                    }
                })
            }
            else {
                res.status(401).send('Unauthorized');
            }
        })
    })
})

router.get('/showteams', async (req, res) => {
    const ProjName = req.query.ProjName
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    console.log("decodedToken: ", decodedToken);
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user_id;
    db.getConnection((err, connection) => {
        if (err) throw err;
        const searchQuery = mysql.format('SELECT * FROM projects WHERE title = ? AND userid = ?', [ProjName, userid]);
        connection.query(searchQuery, (err, result) => {
            if (err) throw err;
            if (result.length != 0) {
                const projID = result[0].projID;
                const query = mysql.format(`
                    SELECT u.username, u.email ,t.role,t.status,t.teamName
                    FROM team t 
                    JOIN user_table u ON t.userid = u.user_id 
                    WHERE t.projID = ?`, [projID]);
                connection.query(query, (err, result) => {
                    if (err) throw err;
                    if (result.length != 0) {
                        console.log("team showed")
                        res.status(200).json(result);
                    } else {
                        res.status(400).send("You have not created a team");
                    }
                });
            } else {
                res.status(400).send("Team not Created yet!!");
            }
        });
    });
});


// adding team members
router.post('/addmembers', async (req, res) => {
    const members = req.body.members
    const ProjID = req.query.projID;
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    console.log("decodedToken: ", decodedToken)
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user_id
    db.getConnection((err, connection) => {
        if (err) throw err;
        const query = mysql.format('select * from team where userid=? and ProjID=? and role=?', [userid, ProjID, 'leader'])
        connection.query(query, (err, result) => {
            if (err) throw err;
            if (result.length != 0) {
                const teamName = result[0].teamName
                if (members && Array.isArray(members)) {
                    console.log("members are adding")
                    members.forEach(member => {
                        const selectQuery = mysql.format('select * from user_table where email=?', [member])
                        connection.query(selectQuery, (err, result) => {
                            if (err) throw err;
                            if (result) {
                                const memberUserid = result[0].user_id
                                const query = mysql.format('insert into team values(?,?,?,?,?)', [ProjID, teamName, memberUserid, 'colaborator', false])
                                connection.query(query, async (err, result) => {
                                    if (err) throw err;
                                    console.log("collaborators are added")
                                    await notify(member, sub, desc)
                                    res.sendStatus(200)
                                })
                            }
                            else {
                                res.status(401).send('Unauthorized');
                            }
                        })
                    })
                }
            }
        })
    })
})

// member verification 
router.post('/member/verificaiton', (req, res) => {
    const email=req.query.email
    const ProjID=req.query.ProjID
    console.log("email and ProjID for member verification: ",email,ProjID)
    db.getConnection((err, connection) => {
        if (err) throw err;
        const searchQuery = mysql.format('select * from user_table where email=?', [email])
        connection.query(searchQuery, (err, result) => {
            if (err) throw err;
            if (result.length != 0) {
                const userid = result[0].user_id;
                const accepterName=result[0].name
                console.log("accepter id and name: ",userid,accepterName)
                const query = mysql.format('update team set status=? where ProjID=? and userid=?', [true, ProjID, userid])
                connection.query(query, (err, result) => {
                    if (err) throw err;
                    console.log("status updated")
                    const query = mysql.format('select t.userid,u.email from team as t inner join user_table as u on t.userid=u.user_id where ProjID=? and role=?', [ProjID, 'leader'])//make it inner join
                    connection.query(query, (err, result) => {
                        if (err) throw err;
                        if (result.length != 0) {
                            const sub = `Invitation Accepted!! by ${accepterName}`
                            const desc = `${accepterName} has accepted your invitation to work as a collaborator in your project`
                            const userid = result[0].userid;
                            const leaderEmail = result[0].email;
                            console.log("leaderemail and userid",userid,leaderEmail)
                            notify(leaderEmail, sub, desc)
                            saveNotification(userid, sub, desc)
                            res.sendStatus(200)
                        }
                        else {
                            res.sendStatus(400)
                        }
                    })
                })
            }
            else {
                res.sendStatus(401)
            }
        })
    })
})


module.exports = router