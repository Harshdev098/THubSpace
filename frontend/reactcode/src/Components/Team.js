import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TeamDetails from './TeamDetails';
import image from '../image.png'
import '../css/team.css'

export default function Team(props) {
    const [visible, setVisible] = useState(true)
    useEffect(() => {
        if (props.details.status === true) {
            console.log("set visibility off")
            setVisible(false);
        } else {
            setVisible(true);
        }
    }, [props.details]);

    return (
        <>
            <div className='team_container'>
                <div className='team_manage'>
                    <h1 style={{ textAlign: "center", fontSize: "31px", borderBottom:"2px solid black",padding:"12px",margin:"4px" }}>Team Details</h1>
                    <h2>Team Name: {props.details.status === true && props.details.message[0].teamName ? props.details.message[0].teamName : 'No Team Found'}</h2>
                    <div className='create' style={{ display: visible ? 'block' : 'none' }}>
                        <div className='notice' style={{ display: visible ? 'block' : 'none' }}>
                            <p><b>Note:</b>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro molestiae aliquam maiores, officiis ratione vitae quis laborum facere voluptas consequuntur sequi, perspiciatis soluta doloribus, suscipit ad exercitationem quas. Illum perferendis quae placeat!</p>
                        </div>
                    </div>
                    <p style={{ display: visible ? 'none' : 'block' }}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora quae impedit cumque.</p>
                    <div className='team_detail'>
                        {props.details.status === true && props.details.message.length > 0 ? (
                            props.details.message.map((member, index) => (
                                <TeamDetails
                                    key={index}
                                    username={member.username}
                                    email={member.email}
                                    role={member.role}
                                    status={member.status}
                                />
                            ))
                        ) : (
                            <div className='createTeam-img'>
                                <img style={{ width: "40%" }} src={image} alt="Not Found" />
                                <p style={{ textAlign: "center", fontSize: "25px", fontWeight: "bold" }}>No teams created</p>
                            </div>
                        )}
                    </div>
                    <div className='add_member_after_teamCreation' style={{ padding: "12px 0px",display: visible ? 'none' : 'block', borderBottom:"2px dotted black" }}>
                        <div className='add_members'>
                            <h3 style={{ textAlign: 'center', fontSize: "25px" }}>Add Team Members</h3>
                            <form style={{ textAlign: "center" }}>
                                <p style={{ textAlign: 'center', fontSize: "19px" }}>Member added to the group. Waiting for verification</p>
                                <input type="text" placeholder='Search with username' />
                                <button>Add</button>
                            </form>
                        </div>
                        <p style={{ textAlign: "center", fontSize: "20px" }}>Or</p>
                        <div className='send_invitation'>
                            <h3 style={{ textAlign: 'center', fontSize: "25px" }}>Invite Friends</h3>
                            <form style={{ textAlign: 'center' }}>
                                <p style={{ textAlign: 'center', fontSize: "19px" }}>Invitation sended to ___</p>
                                <input type="text" placeholder='Enter the email' required />
                                <button>Send</button>
                            </form>
                        </div>
                    </div>
                    <div className='createTeam' style={{ display: visible ? 'block' : 'none' }}>
                        <Link to={`/project/${props.projName}/create/team`}>Create Team<i class="fa-solid fa-user-group" style={{ padding: "0px 11px 0px 7px" }}></i></Link>
                    </div>
                </div>
                <div className='project_details'>
                        <h2 style={{ textAlign: "center", fontSize: "31px", borderBottom:"2px solid black",padding:"12px",margin:"4px" }}>Project Details</h2>
                        <p style={{fontSize:"17px"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam nisi numquam tenetur deserunt laborum possimus quisquam voluptatum officia repellat suscipit?</p>
                        <a id="edit" href="">Edit Project info</a>
                        <div className='proj_info'>
                            <Link to=""style={{color:"blue",fontSize:"19px"}}>Add Project Readme</Link>
                            {/* <p style={{fontSize:"15px"}}>(Add project information either links or video links)</p> */}
                        </div>
                        {/* <label style={{fontSize:"20px",fontWeight:"bold",margin:"12px"}}>Add file<input type="file" /></label> */}
                </div>
            </div>
        </>
    );
}
