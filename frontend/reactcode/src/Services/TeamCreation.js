export const teamCreation = async (teamName, projName, addedUsers) => {
  console.log("the projName is: ", projName)
  console.log('other team members are:', addedUsers)
  const token = localStorage.getItem('accessToken')
  console.log("token", token)
  const response = await fetch(`http://localhost:3000/projects/create/team?ProjName=${projName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ teamName: teamName, members: addedUsers })
  })
  if (response.ok) {
    console.log("team created")
    return { status: true, message: "✌️Yah!! You Sucessfully created your Team" }
  }
  else if (response.status === 401) {
    return { status: false, message: "Unauthorized access" }
  }
  else {
    return { status: false, message: "An error occured" }
  }
}


export const TeamDetails = async (projName) => {
  const token = localStorage.getItem('accessToken')
  console.log("token", token)
  const response = await fetch(`http://localhost:3000/projects/showteams?ProjName=${projName}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  if (response.ok) {
    const result = await response.json()
    console.log("team details fetched")
    console.log('fetched team are:', result)
    return { status: true, message: result }
  }
  else if (response.status === 400) {
    return { status: false, message: "Your Team is not created" }
  }
  else {
    return { status: false, message: "An error occured" }
  }
}


export const fetchUsers = async () => {
  const token = localStorage.getItem('accessToken')
  console.log("token", token)
  try {
    const response = await fetch('http://localhost:3000/search', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const result = await response.json();
      console.log("user fetch results", result);
      return result;
    } else {
      console.error("Failed to fetch users");
      return [];
    }
  } catch (error) {
    console.error("Error fetching users", error);
    return [];
  }
};
