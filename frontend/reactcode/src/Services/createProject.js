export const create = async (title, desc) => {
    console.log("create ", title, desc)
    const token = localStorage.getItem('accessToken')
    console.log("token", token)
    const response = await fetch('http://localhost:3000/projects/save/project', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, desc })
    })
    if (response.status === 200) {
      console.log("The project has been created")
      return { status: true, message: "Project Created Sucessfully" }
    }
    else {
      console.log("Unauthorized")
      return { status: false, message: "Unauthorized access" }
    }
  }

  export const showcreatedProject=async(projName)=>{
    console.log("ProjName: ",projName)
    const token = localStorage.getItem('accessToken')
    console.log("token", token)
    const username=localStorage.getItem('username')
    const response = await fetch(`http://localhost:3000/projects/show?projName=${projName}&username=${username}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    if(response.ok){
      const result=await response.json()
      console.log(result)
      return {projID:result.projID,description:result.projDescription,projName:result.projName,room:result.room || null, userRoll:result.userRoll}
    }
  }
