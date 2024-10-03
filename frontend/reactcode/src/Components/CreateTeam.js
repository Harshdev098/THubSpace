import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PastMemebers from './PastMemebers'
import Users from './Users'
import '../css/team.css'

export default function CreateTeam(props) {
    const [team, setTeam] = useState(null)
    const [visible, setVisible] = useState(false)
    const navigate=useNavigate()
    const create = async () => {
        await props.teamCreation(team, props.projName,props.addedUsers)
    }
    const cancel=()=>{
        setTeam('')
        navigate(`/project/${props.projName}/team`,{replace:true})
    }
    useEffect(() => {
        if (props.teamStatus.message) {
            setVisible(true)
            setTimeout(() => {
                setVisible(false)
            }, 2000);
        }
    }, [props.teamStatus.status])
    return (
        <>
            <div style={{backgroundColor:"#f7f7f7"}} >
            <div className='main'>
                <div className='ProjectForm'>
                    <div className='notice'>
                        <p><b>Note:</b>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro molestiae aliquam maiores, officiis ratione vitae quis laborum facere voluptas consequuntur sequi, perspiciatis soluta doloribus, suscipit ad exercitationem quas. Illum perferendis quae placeat!</p>
                        <hr />
                        <p style={{ backgroundColor: props.teamStatus.status === true ? "#d4edda" : "#f8d7da", color: props.teamStatus.status === true ? "#155724" : "#721c24", fontStyle: "bold", display: visible === true ? 'block' : 'none' }} >{props.teamStatus.message}</p>
                    </div>
                    <h2 style={{textAlign:"center",fontSize:"1.8rem"}}>Create Team</h2>
                    <div className='Teamform'>
                        <form>
                            <label>Team Name:</label>
                                <input type="text" placeholder='Enter Team Name' required onChange={(e) => { setTeam(e.target.value) }} />
                            <label style={{margin:"10px",padding:"0px"}}>Added Collaborators </label>
                            <div className='members'>
                                <ul>
                                    {props.addedUsers.length > 0 ? (props.addedUsers.map((member, index) => {
                                        return <li key={index} style={{fontSize:"18px"}}>{member}</li>
                                    })) : ""}
                                </ul>
                            </div>
                            <div className='buttons'>
                            <button style={{backgroundColor:"rgb(215, 212, 212)",color:"black"}} onClick={cancel}>Cancel</button>
                            <button type='button' onClick={create} >Create</button>
                            </div>
                        </form>
                    </div>
                    <div className='invite'>
                        <h3 style={{fontSize:"25px",padding:"0px",marginBottom:"10px"}}>Send Invitation to friends</h3>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente laboriosam vitae in.</p>
                        <input type="email" placeholder='Enter the email' />
                        <button>Send Invitation</button>
                    </div>
                </div>
                <div style={{width:"30vw"}}>
                    <h2 style={{textAlign:"center"}}>Add Collaborators</h2>
                    <div className='past'>
                        <PastMemebers />
                    </div>
                    <div className='Users'>
                        {props.Users.length > 0 ? props.Users.map((user) => {
                            return <Users username={user.username} email={user.email} addUser={props.addUser} />
                        }) : (<p style={{fontSize:"17px",padding:"4px",fontWeight:"bold"}}>An error occured while fetching users</p>)}
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}
