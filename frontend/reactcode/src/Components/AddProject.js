import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/project.css'

export default function AddProject(props) {
  const [title, setTitle] = useState(null);
  const navigate = useNavigate();
  const [desc, setDesc] = useState(null);
  const [visible, setVisible] = useState(false)

  const add = async () => {
    await props.create(title, desc);
    // if (props.status.status === true) {
    //   console.log("project created1")
    //   // navigate(`/project/${title}/team`);
    // }
  };

  useEffect(() => {
    if (props.status.message) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        if (props.status.status === true) {
          console.log("username from the props ",props.username.username)
          console.log("message from props ",props.username.message)
          console.log("project created2")
          navigate(`/project/${title}/team`);
        }
      }, 2000);
    }
  }, [props.status.message]);

  return (
    <>
      <div>
        <div className='Proj_form'>
          <div className='notice'>
            <p><b>Note:</b>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro molestiae aliquam maiores, officiis ratione vitae quis laborum facere voluptas consequuntur sequi, perspiciatis soluta doloribus, suscipit ad exercitationem quas. Illum perferendis quae placeat!</p>
          </div>
          <div>
            <h2 style={{ textAlign: "center", fontSize: "2.2rem" }}>Project Creation</h2>
          </div>
          <form>
            <div className='notice' style={{ backgroundColor: "#b3dfb3", color: "green" }}>
              <p><b>Note:</b>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro molestiae aliquam maiores, officiis ratione vitae quis laborum facere voluptas consequuntur sequi, perspiciatis soluta doloribus, suscipit ad exercitationem quas. Illum perferendis quae placeat!</p>
              <hr />
              <p style={{ backgroundColor: props.status.status === true ? "#d4edda" : "#f8d7da", color: props.status.status === true ? "#155724" : "#721c24", fontStyle: "bolder", display: visible === true ? 'block' : 'none' }}>{props.status.message}</p>
            </div>
            <label htmlFor="">Title:
              <input type="text" placeholder='Enter the Project Name' id='text' required onChange={(e) => { setTitle(e.target.value) }} />
            </label>
            <label htmlFor="">Description:
              <input type="text" placeholder='Enter the Description Name' required onChange={(e) => { setDesc(e.target.value) }} />
            </label>
            <label htmlFor="privateProject">
              <input type="checkbox" id='privateProject' />Declare it as a private project
            </label>
            <div className='buttons'>
              <button type="button" style={{ backgroundColor: "rgb(215, 212, 212)", color: "black" }} onClick={() => navigate('/main')}>Cancel</button>
              <button type="button" onClick={add}>Create Project</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
