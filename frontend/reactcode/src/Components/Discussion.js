import React, { useEffect, useState } from 'react'
// import ReactPlayer from 'react-player'
import Peer from 'simple-peer'
import '../css/discussion.css'
import { io } from 'socket.io-client';
import { ScheduleDiscussion } from '../Services/schedule'

export default function Discussion({ result }) {
    const socket = io('http://localhost:3000')
    const room = result.room
    const [peersConnection, setPeersConnection] = useState([])
    const [peers, setPeers] = useState([])
    const [remoteStream, setRemoteStream] = useState([])
    const [mystream, setMystream] = useState(null)
    const [date, setDate] = useState(null)
    const [time, setTime] = useState(null)

    useEffect(() => {
        socket.on('connect', () => { console.log("user connected") }) //user connected
    }, [])

    const handleJoinRoom = async () => {
        socket.emit('Join_Room', room)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        setMystream(stream)
        socket.on('user_list', (userList) => {
            const peers = []
            userList.forEach((user) => {
                const peer = createPeer(user, socket.id, mystream)
                peersConnection.current.push({
                    peerID: user, peer,
                })
                peers.push(peer)
            })
            setPeers(peers)
        })
        socket.on('callingPeer', ({ userID, signal }) => {
            const peer = addPeer(signal, userID, mystream);
            peersConnection.current.push({
                peerID: userID,
                peer,
            })
            setPeers(users => [...users, peer]);
        })
        socket.on('callAnswered',({signal,userID})=>{
            const item = peersConnection.find(p => p.peerID === userID);
            item.peer.signal(signal);
        })

    }

    // createPeer function --sending call to the peers
    function createPeer(peerUserID, userID, mystream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            mystream,
        });
        peer.on("signal", signal => {
            socket.emit("sendcallPeers", { peerUserID, userID, signal })
        })

        return peer;
    }
    
    // add peer function --answering the call initaited by the joined user
    function addPeer(signal,callerID,mystream){
        const peer = new Peer({
            initiator: false,
            trickle: false,
            mystream,
        })

        peer.on("signal", signal => {
            socket.emit("AnsweringCall", { signal, callerID })
        })
        peer.signal(signal);
        return peer;
    }

    const handleSchedule = async () => { //scheduling discussion 
        await ScheduleDiscussion(room, date, time)
        alert(`Discussion Scheduled on ${date} at ${time}, Notification sended to the members`)
    }
    return (
        <>
            <main className='discussion-main'>
                <div className='room-detail'>
                    <div className='join-room'>
                        <div className='notice' style={{ marginBottom: "10px" }}>
                            <p><b>Note:</b>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
                        </div>
                        <div style={{ marginBottom: "20px" }}><button onClick={handleJoinRoom} id='JoinBtn'>Join Discussion Room </button></div>
                    </div>
                    <h2 style={{ fontSize: "30px", textAlign: 'center', marginTop: "60px", marginBottom: "12px" }}>Discussion history</h2>
                    <div className='discussion-history'>
                        <ul>
                            <li>sdlfksdkjsdfjksdfdsfs</li>
                            <li>sdlfksdkjsdfjksdfdsfs</li>
                            <li>sdlfksdkjsdfjksdfdsfs</li>
                        </ul>
                    </div>
                    {/* <div className='discussion-history'>
                    <ReactPlayer playing muted height="200px" width="200px" url={mystream} />
                    <ReactPlayer playing muted height="200px" width="200px" url={remoteStream} />
                    ksdfsdkl
                </div> */}
                </div>
                <div className='schedule'>
                    <h3 style={{ textAlign: "center", margin: "30px 0px", fontSize: "26px" }}>Schedule Discussion</h3>
                    <div><label htmlFor="">Date: <input type="date" onChange={(e) => { setDate(e.target.value) }} /></label></div>
                    <div><label htmlFor="">Time: <input type="time" onChange={(e) => { setTime(e.target.value) }} /></label></div>
                    <div><button onClick={handleSchedule}>Schedule Discussion</button></div>
                </div>
            </main>
        </>
    )
}
