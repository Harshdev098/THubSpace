const express = require('express')
const cp=require('child_process')
const mysql = require('mysql')
const { db } = require('../db/model')
const { decodeAccessToken } = require('../token')
const { fetchRooms, createRoom } = require('./room')
const router = express.Router()
const app = express()
app.use(express.json())

// creating Projects 
router.post('/save/project', async (req, res) => {
    const title = req.body.title
    const projDecription = req.body.desc
    const username=req.query.username
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    console.log("decodedToken: ", decodedToken)
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user_id
    db.getConnection((err, connection) => {
        if (err) throw err;
        const query = mysql.format('insert into projects(title,projDescription,userid) values(?,?,?)', [title, projDecription, userid])
        connection.query(query, async (err, result) => {
            if (err) throw err;
            console.log("project saved in db")
            const projID = result.insertId
            cp.exec(`sudo -u git mkdir -p /var/lib/git/${username}/${title}`,(error,stdout,stderr)=>{
                if(error){
                    res.status(500).send('Internal Server error')
                }
                else{
                    console.log(`stdout:${stdout}`)
                    console.log('stderr:',stderr)
                }
            })
            const roomStatus = await createRoom(userid, projID, title)
            res.status(200).send("project created")
        })
    })
})


// show project 
router.get('/show', async (req, res) => {
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    console.log("decodedToken: ", decodedToken)
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user_id
    const title = req.query.projName;
    const username = req.query.username
    console.log("ProjName and username: ", title, username)
    db.getConnection((err, connection) => {
        if (err) throw err;
        let userRole;
        const query = mysql.format('select * from projects where userid=? and title=?', [userid, title])
        connection.query(query, async (err, result) => {
            if (err) throw err;
            if (result) {
                const projName = result[0].title;
                const projID = result[0].projID
                const projDescription = result[0].projDecription;
                console.log("fetching project details")
                const room = await fetchRooms(projID, userid)
                console.log("room name: ", room)
                userRole = 'admin'
                res.json({ projName, projDescription, projID, room, userRole })
            }
            else {
                const query = mysql.format('select * from team where userid=? and ProjId=? and status=true', [userid, projID])
                connection.query(query, async (err, result) => {
                    if (err) throw err;
                    if (result) {
                        const room = await fetchRooms(projID, userid)
                        console.log("room name: ", room)
                        userRole = "collaborator"
                        res.json({ projName:result[0].title, projDecription: result[0].projDescription, projID: result[0].projID, room, userRole })
                    }
                })
            }
        })
    })
})

module.exports = router



// const query = mysql.format('select * from user_table as u inner join projects as p inner join team as t where u.username=? and p.title=?', [username, title])
// connection.query(query, async (err, result) => {
//     if (err) throw err;
//     if (result) {
//         const projName = result[0].title;
//         const projID = result[0].projID
//         const projDescription = result[0].projDecription;
//         console.log("fetching project details")
//         const room = await fetchRooms(projID, userid)
//         console.log("room name: ", room)
//         let userRole;
//         if (userid == result[0].userid) {
//             userRole = 'admin'
//             res.json({ projName, projDescription, projID, room, userRole })
//         }
//         else if (result[0].role = "collaborator") {
//             userRole = "collaborator"
//             res.json({ projName, projDescription, projID, room, userRole })
//         }
//         else {
//             userRole = 'viewer'
//             res.json({ projName, projDescription, projID, userRole })
//         }
//     }
//     else {
//         res.send('Project not found')
//     }
// })