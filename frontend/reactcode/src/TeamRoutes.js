import './css/App.css';
import { Routes, Route, useParams, useNavigate,useLocation } from "react-router-dom";
import Team from './Components/Team';
import CreateTeam from './Components/CreateTeam';
import { useEffect, useState } from 'react';
import { teamCreation, TeamDetails, fetchUsers } from './Services/TeamCreation';
import ProjectHeader from './Components/ProjectHeader';
import Activities from './Components/Activities';
import { showcreatedProject } from './Services/createProject'
import Chat from './Components/Chat';
import Discussion from './Components/Discussion';

export default function TeamRoutes() {
    const location=useLocation()
    const navigate=useNavigate()
    const { projName } = useParams() //fetching project name from url
    const [result, setResult] = useState({ projID: null, description: "", projName: "",room:"" }); //setting state after creation of project
    const [teamStatus, setTeamStatus] = useState({ status: null, message: "" })  //setting state after creating team 
    const [details,setDetails]=useState({status:null,message:[]}) //setting team details
    const [users,setUsers]=useState([])  //displaying users so that user can add them to team 
    const [addedUsers,setAddedUsers]=useState([]) //adding users to the members area to create team 

    // handle team creation 
    const handleTeamCreation = async (teamname, projName,addedUsers) => {
        console.log("teamName and projName", teamname, projName)
        const teamStatus = await teamCreation(teamname, projName, addedUsers);
        setTeamStatus({ status: teamStatus.status, message: teamStatus.message });
        navigate(`/project/${projName}/team`)
    };
    // fetching project after project creation 
    const fetchProject = async () => {
        console.log("projName while fetchProject: ", projName)
        const project = await showcreatedProject(projName);
        console.log("project Room: ",project.room)
        setResult({ projID: project.projID, description: project.description, projName: project.projName, room:project.room });
    };
    // fetching team details for the projName 
    const fetchTeamDetails=async()=>{
        console.log("fetching team details")
        const Teamdetails=await TeamDetails(projName)
        console.log("showing team details: ",Teamdetails)
        setDetails({status:Teamdetails.status,message:Teamdetails.message})
    }
    // function to display users for team creation 
    const DisplayUsers=async()=>{
        const user=await fetchUsers()
        setUsers(user)
    }
    // adding users for creating the team 
    const addUser=(username)=>{
        if (!addedUsers.includes(username)) { 
            setAddedUsers([...addedUsers, username]);
        }
    }

    useEffect(()=>{
        if(location.pathname===`/project/${projName}/create/team`){
            console.log("DisplayUsers function called")
            DisplayUsers()
        }
    },[location])
    useEffect(() => {
        fetchProject();
        fetchTeamDetails()
    }, [projName,teamStatus]);
    useEffect(()=>{
        if(location.pathname===`/project/${projName}/team`){
            fetchTeamDetails()
        }
    },[location])
    

    return (
        <>
            <ProjectHeader projID={result.projID} description={result.description} projName={projName} />
            <Routes>
                <Route path='/chat' element={<Chat result={result} projName={projName} />} />
                <Route path='/discussion' element={<Discussion result={result}/>} />
                <Route path='/team' element={<Team details={details} projName={projName} />} />
                <Route path='/activity' element={<Activities />} />
                <Route path='/create/team' element={<CreateTeam Users={users} addUser={addUser} addedUsers={addedUsers} teamCreation={handleTeamCreation} projName={result.projName} teamStatus={teamStatus} />} />
            </Routes>
        </>
    );
}