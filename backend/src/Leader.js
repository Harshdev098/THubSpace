const mysql=require('mysql')
const {db}=require('../db/model')

const isLeader=async(userid,projID)=>{
    db.getConnection(async(err,connection)=>{
        if(err) throw err;
        const query=mysql.format('select * from team where userid=? and projID=?',[userid,projID])
        await connection.query(query,(err,result)=>{
            if(err) throw err;
            if(result){
                connection.release()
                console.log('its a leader')
                return true
            }
            else{
                connection.release()
                return false;
            }
        })
    })
}

module.exports=isLeader