const express=require('express')
const {decodeAccessToken}=require('../token')
const mysql=require('mysql')
const {db}=require('../db/model')
const router=express.Router()
const app=express()
app.use(express.json())

router.get('/profile',async(req,res)=>{
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid=decodedToken.user_id
    db.getConnection(async(err,connection)=>{
        if(err) throw err;
        const query=mysql.format('select * from user_table where user_id=?',[userid])
        await connection.query(query,(err,result)=>{
            if(err) throw err;
            if(result){
                const userDetails=result[0]
                console.log("user profile data fetched")
                const projQuery=mysql.format('select * from projects where userid=?',[userid])
                connection.query(projQuery,(err,result)=>{
                    if(err) throw err;
                    if(result){
                        const projDetails=result
                        res.json({userDetails,projDetails})
                    }
                })
            }
        })
    })
})

router.post('/complete',async(req,res)=>{
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid=decodedToken.user_id
    const name=req.body.name;
    const email=req.body.email;
    const username=req.body.username;
    const college=req.body.college;
    const city=req.body.city;
    const exp=req.body.exp;
    const skills=req.body.skills
    db.getConnection((err,connection)=>{
        if(err) throw err;
        const alterQuery=mysql.format('update user_table set name=?,email=?,username=?,college=?,city=?,exp=?,skills=? where userid=?',[name,email,username,college,city,exp,skills,userid])
        connection.query(alterQuery,(err,result)=>{
            if(err) throw err;
            console.log("profile updated")
            res.json({name,email,username,college,city,exp,skills})
        })
    })
})

router.post('/profile/delete',async(req,res)=>{
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    db.getConnection((err,connection)=>{
        if(err) throw err;
        const deleteQuery=mysql.format('delete table user_table where user_id=?',[userid])
        connection.query(deleteQuery,(err,result)=>{
            if(err) throw err;
            console.log("user deleted")
            res.sendStatus('200')
        })
    })
})


// show Users
// router.get('/showUsers',(req,res)=>{
//     console.log("showusers function triggered")
//     db.getConnection((err,connection)=>{
//         if(err) throw err;
//         connection.query('select username,email from user_table',(err,result)=>{
//             if(err) throw err;
//             console.log("sended users for adding it in team")
//             res.json(result)
//         })
//     })
// })

module.exports=router