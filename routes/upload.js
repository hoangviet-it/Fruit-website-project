
const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')


// kết nối tới cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// upload hình ảnh
router.post('/upload', auth, authAdmin, (req, res) =>{
    try {
        console.log(req.files)

        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: "Không có tệp nào được tải lên."})

        const file = req.files.file;
        if(file.size > 1024*1024) {       // nếu file lớn hơn 1mb.     //(1024*1024) = 1MB   //(1024*1024*5) = 5MB
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "Kích thước tệp quá lớn."})
        }

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "Định dạng tệp không chính xác."})
        }
        
        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "Products"}, async(err, result) =>{

            if(err) throw err;

            removeTmp(file.tempFilePath)      // upload xong, ảnh sẽ ko xuất hiện trong folder tmp

            res.json({public_id: result.public_id, url: result.secure_url})     
        })

        // res.json('upload thành công')

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

// delete hình ảnh
router.post('/destroy', auth, authAdmin, (req, res) =>{
    try {
        const {public_id} = req.body;
        if(!public_id) return res.status(400).json({msg: "không có hình ảnh nào được chọn."})
        
        cloudinary.v2.uploader.destroy(public_id, async(err, result) =>{

            if(err) throw err;
            
            res.json({msg: "đã xóa hình ảnh.!"})     
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const removeTmp = (path) =>{
    fs.unlink(path, err =>{
        if(err) throw err;
    })
}


module.exports = router