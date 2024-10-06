export const loginAuth = async(email,password) => {
    console.log(email, password);
    const response = await fetch("http://localhost:3000/user/aouth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
        console.log("Login successful");
        const result = await response.json();
        const username=result.username
        localStorage.setItem('username',username)
        console.log("username from backend ",username)
        const token = result.token;
        localStorage.setItem("accessToken", token);
        return {status:true,message:"Login Successfully!!",username:username}
    } else if (response.status === 401) {
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        return {status:false,message:"User does not exist"}
    } else if (response.status === 400) {
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        return {status:false,message:"Unauthorized Access"}
    } else {
        const errorMessage = await response.text();
        console.log(`Login failed: ${errorMessage}`);
        email = "";
        password = "";
        return {status:false,message:"An error occured"}
    }

}

export const userCreation=async(name,email,password,username)=>{
    console.log(name,email,password,username)
    const response = await fetch('http://localhost:3000/user/aouth/signup', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, username })
    })
    if (response.ok) {
        console.log("signup sucessfully")
        const result = await response.json();
        const token = result.token;
        localStorage.setItem("accessToken", token);
        setTimeout(() => {
            window.location.href = '/main';
        }, 2000);
        return {status:true,message:"Account Created Successfully"}
    }
    else if (response.status === 401) {
        return {status:false,message:"User already exists"}
    }
    else if(response.status === 400){
        return {status:false,message:"Not a valid input"}
    }
    else {
        return {status:false,message:"An error occured"}
    }
}