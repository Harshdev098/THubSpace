const express=require('express')
const mysql=require('mysql')
const { db } = require('../db/model')
const cp=require('child_process')
const { decodeAccessToken } = require('../token')

const app=express()
const router=express.Router()

router.post('/generateKey',async(req,res)=>{
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    console.log("decodedToken: ", decodedToken)
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user_id
    db.getConnection((err,connection)=>{
        if(err) throw err;
        const query=mysql.format('select * from user_table where user_id=?',[userid])
        connection.query(query,(err,result)=>{
            if(err) throw err;
            if(result){
                const email=result[0].email;
                cp.exec('',(error,stderr,stdout)=>{
                    if(error){
                        res.status(500).send('Internal server error')
                    }
                    console.log(`key generated! stdout:${stdout}`)
                    console.log('stderr:',stderr)
                })
            }
        })
    })
})

router.get('/show',async(req,res)=>{
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    console.log("decodedToken: ", decodedToken)
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user_id
    db.getConnection((err,connection)=>{
        if(err) throw err;
        const fetchQuery=mysql.format('select * from user_table wher user_id=?',[userid])
        connection.query(fetchQuery,(err,result)=>{
            if(err) throw err;
            if(result){
                console.log('ssh key showed')
                res.status(200).json({key:result[0].key})
            }
            else{
                res.status(404).send('No Key Found')
            }
        })
    })
})

module.exports=router