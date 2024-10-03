const { db } = require("../db/model")
const mysql=require('mysql')

const fetchRooms = (projId, userid) => {
    return new Promise((resolve, reject) => {
        console.log("fetchRooms: ", projId, userid);
        db.getConnection((err, connection) => {
            if (err) return reject(err);
            const query = mysql.format('select * from rooms where projId=? and userid=?', [projId, userid]);
            connection.query(query, (err, result) => {
                if (err) return reject(err);
                console.log("room fetched");
                if (result.length != 0) {
                    resolve(result[0].room);
                } else {
                    resolve(null);
                }
            });
        });
    });
}


const createRoom=(userid,projID,projName)=>{
    console.log("createRoom: ",projID,userid)
    const room=`project_${projName}_${projID}`
    db.getConnection((err,connection)=>{
        if(err) throw err;
        const insertQuery=mysql.format('insert into rooms(room,projId,userid) values(?,?,?)',[room,projID,userid])
        connection.query(insertQuery,(err,result)=>{
            if(err) throw err;
            console.log("room created")
            return true;
        })
    })
}

module.exports={fetchRooms,createRoom}