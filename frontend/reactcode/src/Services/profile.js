export const fetchProfile = async () => {
    const token = localStorage.getItem('accessToken')
    console.log("token", token)
    const response = await fetch(`http://localhost:3000/api/user/profile`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    if(response.ok){
        const result=await response.json()
        console.log("the profile result is: ",result)
        return result;
    }
}

export const UserFetchProfile=async(username)=>{
    console.log(username)
    const response=await fetch(`http://localhost:3000/profile?username=${username}`,{
        'Content-Type':'application/json'
    })
    if(response.ok){
        const result=await response.json()
        console.log(result)
        return result;
    }
}