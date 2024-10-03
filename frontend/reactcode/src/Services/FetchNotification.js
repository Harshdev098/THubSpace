export const fetchNotification=async()=>{
    const token=localStorage.getItem('accessToken')
    console.log("token: ",token)
    const response=await fetch('http://localhost:3000',{
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })
    if(response.ok){
        const result=await response.json()
        return result
    }
}