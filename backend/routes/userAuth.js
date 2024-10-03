const express = require('express')
const mysql = require('mysql')
const cp = require('child_process')
const bcrypt = require('bcrypt')
const notify = require('../mail/mailer')
const { generateAccessToken } = require('../token')
const { body, validationResult } = require('express-validator')
const { db } = require('../db/model')
const { error } = require('console')
const { stdout, stderr } = require('process')
const router = express.Router()
const app = express()
app.use(express.json())

// validation of request 
const validator = [
    body('name').notEmpty().isString(),
    body('email').isEmail(),
    body('password').notEmpty().isLength({ min: 5 }),
]

// signup endpoint 
router.post('/signup', validator, async (req, res) => {
    const result = await validationResult(req)
    if (!result.isEmpty()) {
        res.status(400).json(result)
    }
    else {
        const { name, email, password, username } = req.body
        console.log("req.body: ", req.body)
        const hashpassword = await bcrypt.hash(password, 10)
        await db.getConnection(async (err, connection) => {
            if (err) throw err;
            try {
                await connection.beginTransaction()
                const query = mysql.format('select * from user_table where username=?', [username])
                connection.query(query, (err, result) => {
                    if (err) throw err;
                    if (result.length != 0) {
                        console.log("got user with same username")
                        res.sendStatus(401)
                    }
                    else {
                        const searchQuery = mysql.format('select * from user_table where email=?', [email])
                        connection.query(searchQuery, async (err, result) => {
                            if (err) throw err;
                            if (result.length != 0) {
                                console.log("got user with same email")
                                res.sendStatus(401)
                            }
                            else {
                                const insertQuery = mysql.format('Insert into user_table(name,email,password,username) values(?,?,?,?)', [name, email, hashpassword, username])
                                await connection.query(insertQuery, async (err, result) => {
                                    if (err) throw err;
                                    console.log("registration sucessfull")
                                    console.log("insertion id of user is ", result.insertId)
                                    const token = await generateAccessToken({ user_id: result.insertId })
                                    if (!token) {
                                        await connection.rollback()
                                    }
                                    console.log("token generated while signup ", token)
                                    const sub = "Registration Sucessfull"
                                    const desc = `Your Registration has been sucessfully made`
                                    cp.exec('sudo -s',(error,stderr,stdout)=>{
                                        if(error){
                                            connection.rollback()
                                            res.send('internal server error')
                                        }
                                        console.log('stdout',stdout)
                                        console.log('stderr',stderr)
                                    })
                                    await connection.commit();
                                    connection.release();
                                    res.status(200).json({ token });
                                })
                            }
                        })
                    }
                })
            } catch (err) {
                console.log("an error occured", err)
                res.sendStatus(400)
            }
        })
    }
})

// login endoint 
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    await db.getConnection(async (err, connection) => {
        if (err) throw err;
        try {
            const searchQuery = mysql.format('Select * from user_table where email=?', [email])
            await connection.query(searchQuery, async (err, result) => {
                if (err) throw err;
                if (result != 0) {
                    console.log("user exist")
                    if (await bcrypt.compare(password, result[0].password)) {
                        console.log("user logged in")
                        console.log("user id: ", result[0].user_id)
                        const username = result[0].username
                        console.log("username", username)
                        const token = await generateAccessToken({ user_id: result[0].user_id })
                        console.log("token generated while login", token)
                        const sub = "Loggedin Sucessfully"
                        const desc = `You have been logged in to your account with your email id ${result[0].email}`
                        // await notify(email, sub, desc)
                        res.json({ token: token, username: username })
                    }
                    else {
                        res.status(400).send("Unauthorized access")
                        connection.release()
                    }
                }
                else {
                    console.log("user does not exists")
                    res.status(401).send("user does not exists")
                }
            })
        } catch (err) {
            console.log("an error occured while login")
        }
    })
})

module.exports = router