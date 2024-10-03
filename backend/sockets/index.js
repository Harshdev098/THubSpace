const {SaveChat,fetchmessages,recoverMessage}=require('./handlers')
// const decodeAccessToken=require('../token')

const RoomToSocket={}
const SocketToRoom={}

const setup=async(io)=>{
    io.on('connection',(socket)=>{
        // chats sockets
        let user_room
        console.log("user connected with id: ",socket.id)
        socket.on("JoinRoom",async(room)=>{
            socket.join(room)
            user_room=room;
            const messages=await fetchmessages(room)
            console.log("message: ",messages)
            const formattedmessage = messages.map(msg => {
                const timing = new Date(msg.timing).toISOString().slice(0, 19).replace('T', ' ');
                console.log("timing ",timing)
                return { text: msg.message, username: msg.username, date: timing.slice(0, 10), time: timing.slice(11) };
            });
            console.log("textid ",messages.textId)
            io.to(room).emit("previous-messages",formattedmessage)
        }) 
        socket.on("message",async({room,message,username})=>{
            console.log("the room and message are:",room,message,username)
            await SaveChat(room,message,username)
            const timing=new Date().toISOString().slice(0, 19).replace('T', ' ')
            console.log({text:message,username:username})
            io.to(room).emit("emit-message",{text:message,username:username,date:timing.slice(0,10),time:timing.slice(11)})
        })
        socket.on('disconnect',()=>{
            console.log("user disconnected")
        })
        // if(!socket.recovered){
        //     const {message,rowId}=recoverMessage(socket.handshake.auth.serverOffset,user_room)
        //     io.to(user_room).emit("emit-message",message,rowId)
        // }
        
        // video socket 
        socket.on('Join_Room',(room)=>{
            RoomToSocket[room]=socket.id
            SocketToRoom[socket.id]=room
            console.log("user joined the room ",room)
            const UserInRoom=RoomToSocket[room].filter(id=>id!=socket.id)
            socket.emit('user_list',UserInRoom)
        })
        socket.on('sendcallPeers',({ peerUserID, userID, signal })=>{
            io.to(peerUserID).emit('callingPeer',{userID,signal})
        })
        socket.on('AnsweringCall',({signal,userID})=>{
            io.to(payload.callerID).emit('receiving returned signal', { signal,userID })
        })
    })
    // io.on('connection',(socket)=>{
        
    // })
}

module.exports=setup