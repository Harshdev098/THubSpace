const mysql=require('mysql')
const {db}=require('../db/model')


const saveNotification=(userid,sub,desc)=>{
    const date=new Date().toISOString().slice(0, 19).replace('T', ' '); 
    db.getConnection((err,connection)=>{
        if(err) throw err;
        const query=mysql.format('insert into notification values(?,?,?,?)',[userid,sub,desc,date])
        connection.query(query,(err,result)=>{
            if(err) throw err;
            connection.release()
            console.log("notification saved")
        })
    })
}

const fetchNotification=async(req,res)=>{
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    console.log("decodedToken: ", decodedToken)
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user_id
    db.getConnection((err,connection)=>{
        if(err) throw err;
        const query=mysql.format('select * from notification where userid=?',[userid])
        connection.query(query,(err,result)=>{
            if(err) throw err;
            connection.release()
            res.json(result)
        })
    })
}



module.exports={saveNotification,fetchNotification}