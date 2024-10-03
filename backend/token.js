const jwt=require('jsonwebtoken')
require("dotenv").config()
function generateAccessToken(user_id){
    return jwt.sign(user_id,process.env.ACCESS_TOKEN_SECRET, {expiresIn: "20m"})
}

function decodeAccessToken(authorizationHeader) {
    if (!authorizationHeader) {
        console.log('authorization header is missing')
        return null;
    }

    const token = authorizationHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('decoded info: ',decoded)
        return decoded;
    } catch (error) {
        console.error('Error decoding access token:', error);
        return null;
    }
}

module.exports={generateAccessToken,decodeAccessToken}