import React from 'react'
import { useLocation } from 'react-router-dom'

export default function MemVerification() {
    const location = useLocation();
    const params=new URLSearchParams(location.search)
    const email=params.get('email')
    const ProjID=params.get('ProjID')
    const verify =async () => {
        console.log("email and projid",email,ProjID)
        const decodedEmail = decodeURIComponent(email)
        const decodedProjID = decodeURIComponent(ProjID)
        console.log('decoded data: ',decodedEmail,decodedProjID)
        const response =await fetch(`http://localhost:3000/projects/member/verificaiton?email=${decodedEmail}&ProjID=${decodedProjID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            console.log("verifed!!")
            const VerificationResult=document.getElementById('VerificationResult')
            const para=document.createElement('p')
            para.textContent="Member Verified"
            VerificationResult.appendChild(para)
        }
        else{
            console.log("an error occured")
        }
    }
    return (
        <>
            <div id='VerificationResult'>

            </div>
            <button onClick={verify}>Verify</button>
        </>
    )
}
