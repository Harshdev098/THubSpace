const mysql=require('mysql')
require("dotenv").config()

const DB_HOST=process.env.DB_HOST
const DB_DATABASE=process.env.DB_DATABASE
const DB_PASSWORD=process.env.DB_PASSWORD
const DB_USER=process.env.DB_USER
const DB_PORT=process.env.DB_PORT

const db=mysql.createPool({
    host:DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
})
const DBconnection=db.getConnection((err,connection)=>{
    if(err){
        console.log('Error occured during connection of DB')
    }
    else{
        console.log("Database connected sucessfully")
    }
})

module.exports={DBconnection,db}