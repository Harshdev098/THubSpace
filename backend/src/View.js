const mysql=require('mysql')
const {db}=require('../db/model')
const {decodeAccessToken}=require('../token')

const profileView=async(req,res)=>{
    const username=req.query.username
    console.log(username)
    db.getConnection((err,connection)=>{
        if(err) throw err;
        const searchQuery=mysql.format('select * from user_table where username=?',[username])
        connection.query(searchQuery,(err,result)=>{
            if(err) throw err;
            if(result){
                const userDetails=result[0]
                const userid=result[0].user_id
                const projQuery=mysql.format('select * from projects where userid=?',[userid])
                connection.query(projQuery,(err,result)=>{
                    if(err) throw err;
                    if(result){
                        console.log(result)
                        console.log("user data fetched")
                        const projDetails=result
                        res.json({userDetails,projDetails})
                    }
                })
            }
        })
    })
}

// show projects to other users 
const projectView=async(req,res)=>{
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    console.log("decodedToken: ", decodedToken)
    if (!decodedToken || !decodedToken.user_id) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user_id
    const title=req.query.projName
    console.log("ProjName: ",title)
    db.getConnection((err,connection)=>{
        if(err) throw err;
        const query=mysql.format('select * from projects where userid=? and title=?',[userid,title])
        connection.query(query,async(err,result)=>{
            if(err) throw err;
            if(result){
                const projName=result[0].title;
                const projID=result[0].projID
                const projDescription=result[0].projDecription;
                console.log("fetching project details")
                const room=await fetchRooms(projName,userid)
                console.log("room name: ",room)
                res.json({projName,projDescription,projID,room})
            }
            else{
                res.send('Project not found')
            }
        })
    })
}



module.exports={profileView,projectView}