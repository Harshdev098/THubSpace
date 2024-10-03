import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../css/chat.css'

export default function Chat(props) {
    const location = useLocation();
    const inputRef = useRef(null)
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [toggle, setToggle] = useState(false)
    const socket = io('http://localhost:3000', {
        auth: {
            serverOffset: 0
        }
    });
    useEffect(() => {
        if (location.pathname === `/project/${props.projName}/chat`) {
            socket.on('connect', () => {
                console.log('client connected');
                if (props.result && props.result.room) {
                    console.log('Joining room:', props.result.room);
                    socket.timeout(3000).emit('JoinRoom', props.result.room);
                }
            });
            socket.on('previous-messages', (texts) => {
                console.log('Previous messages:', texts);
                if (texts) {
                    setMessages(texts);
                }
            });
            socket.on('emit-message', (Messages) => {
                console.log('incomingMessage', Messages);
                setMessages((prevMessages) => [...prevMessages, Messages]);
                // socket.auth.serverOffset=serverOffset
            });
            if (inputRef.current) {
                inputRef.current.focus()
            }

            return () => {
                socket.off('connect');
                socket.off('previous-messages');
                socket.off('emit-message');
                socket.disconnect();
            };
        }
    }, [props.result.room, location]);

    const send = () => {
        console.log('props.room message sending', props.result.room);
        socket.emit('message', { room: props.result.room, message: message, username: localStorage.getItem('username') })
        setMessage('');
    };

    // const toggleClose=()=>{
    //     const first=document.getElementById('first')
    //     first.classList.toggle('toggle')
    // }
    const toggleClose = () => {
        if (toggle === true) {
            setToggle(false);
        }
        else {
            setToggle(true)
        }
    }

    return (
        <>
            <div className='chat_container'>
                <div id="first" className={toggle === true ? 'toggle' : 'room_members'}>
                    <h2>Members</h2>
                    <ul>
                        <li>dsfjksdfjksd</li>
                        <li>dsfjksdfjksd</li>
                        <li>dsfjksdfjksd</li>
                        <li>dsfjksdfjksd</li>
                    </ul>
                </div>
                <div className='messages'>
                    <div className='fixeToggle'>
                        <i class="fa-solid fa-circle-arrow-left" onClick={toggleClose} style={{ fontSize: "28px", padding: "8px 14px", display: toggle === true ? 'none' : 'block' }}></i>
                        <i class="fa-solid fa-circle-arrow-right" onClick={toggleClose} style={{ fontSize: "28px", padding: "8px 14px", display: toggle === true ? 'block' : 'none' }}></i>
                    </div>
                    <div className='message_container'>
                        <div className='all_messages'>
                            <ul>
                                {messages.map((msg, index) => (
                                    <React.Fragment key={index}>
                                        <p id='date'style={{ display: msg.date === new Date().toISOString().slice(0, 10) ? "none" : "inline" }} >{msg.date}</p>
                                        <li className={msg.username === localStorage.getItem('username') ? 'you' : 'other'}>
                                            <h4 style={{ display: 'inline' }}>{msg.username}</h4><span>{msg.time}</span>
                                            <p>{msg.text}</p>
                                        </li>
                                    </React.Fragment>
                                ))}
                            </ul>
                        </div>
                        <div className='chat-form'>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    send();
                                }}
                            >
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                    }}
                                    ref={inputRef}
                                />
                                <button type="submit"><i class="fa-solid fa-arrow-up-from-bracket" style={{ fontSize: "30px" }}></i></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
