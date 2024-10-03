export const ScheduleDiscussion=async(room,date,time)=>{
    const token=localStorage.getItem('accessToken')
    const response=await fetch('http://localhost:3000/scheduleDiscussion',{
        method:"POST",
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({room,date,time})
    })
    if(response.ok){
        console.log("schedule confirmed")
    }
}