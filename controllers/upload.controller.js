const mongoose = require('mongoose');
require('../middlewares/imageupload');
require('../config/config');
const Image = require('../models/image.model')
const db = mongoose.connection;

let gfs;
db
    .once('open', () => {
        // init stream
        gfs = new mongoose.mongo.GridFSBucket(db.db, {
            bucketName: 'uploads',
        });
    })
    .on('error', (error) => {
        console.log(error);
    });


module.exports.uploadFile = async (req, res) => {
    try {
        // let data = new Image({
        //     filename: req.file.originalname + Date.now(),
        //     caption: req.body.caption,
        //     category: req.body.category,
        //     userId: req.userId,
        //     fileId: req.file.id,
        // })

        const files = req.file;
        // const image = await data.save();
        res.status(200).json({
            success: true,
            files
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(`Error when trying upload image: ${error}`);
    }
};


module.exports.getImagesById = async (req, res) => {
    try {
        // const images = await Image.find({ _id: req.params.id });
        // const Ids = images.map(img => img.fileId);

        const file = await gfs.find({ filename: req.params.name }).toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files available'
                });
            }
            files.map(file => {
                if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/svg') {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });
            //render image to browser
        });
        // res.status(200).json({
        //     success: true,
        //     file,

        // });
        const readstream = gfs.openDownloadStreamByName(req.params.name);
       // console.log(file.contentType)
    //    res.set('Content-Type', file.contentType);
        return readstream.pipe(res);
        //gfs.openDownloadStreamByName(req.params.name).pipe(res)
    } catch (error) {
        res.status(400).send(`Error when trying upload image: ${error}`);
    }
};

module.exports.getimage = async (req, res) => {
    try {

        gfs.openDownloadStreamByName({ filename: req.params.filename }).pipe(res);
        console.log(file)
    } catch (error) {
        console.log(error)
    }
}
module.exports.DeleteImage = async (req, res) => {
    try {

        const images = await Image.findByIdAndDelete({ _id: req.body.id });
        const id = images.fileId;
        gfs.delete(new mongoose.Types.ObjectId(id), (err, data) => {
            if (err) {
                return res.status(404).json({ err: err });
            }
            res.status(200).json({
                success: true,
                deleted: true,
                images,
                message: `File with ID ${id} is deleted`,
            });
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({ error });

    }
}
