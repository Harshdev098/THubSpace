const express=require('express')
const upload=require('../upload/upload')
const saveUploads=require('../upload/uplaodSaveDB')
const app=express()
const router=express.Router()
app.use(express.json())

router.post('/project',upload.single('files'),async(req,res)=>{
    if(!req.file){
        console.log("uploadation failed")
        res.status(400).send("uploadation failed")
    }
    else{
        console.log("file uploaded",req.file.filename)
        try {
            await saveUploads(req, res);
        } catch (error) {
            console.error("Error saving upload:", error);
            res.status(500).send("Internal Server Error");
        }
    }
})

module.exports=router