// import * as multer from 'multer'
// const maxSize = 2 * 1024 * 1024;


// export class FileUpload {
//     const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//           cb(null, __dirname + "/public");
//         },
//         filename: (req, file, cb) => {
//           cb(null, file.originalname);
//         },
//       });

//       let uploadFile = multer({
//         storage: storage,
//         limits: { fileSize: maxSize },
//       }).single("file");
// }

import multer from 'multer';
import { EndpointInfo, Middleware, Req, Next, Res } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },

    filename: function (req: any, file: any, cb: any) {
        const ext = file.mimetype.split("/")[1];
        //var Po= `${file.fieldname}-${Date.now()}.${ext}`
        //cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
        cb(null,  `${file.originalname}-${+Date.now()}`)//file.originalname)
    }
});
const fileFilter = (req: any, file: any, cb: any) => {
    // if (file.mimetype === "image/jpg" ||
    //     file.mimetype === "image/jpeg" ||
    //     file.mimetype === "image/png" || file.mimetype === "application/pdf" || file.mimetype === "application/docs" ) {
    if ( file) {
        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter,limits:{
    files:2,
    fileSize: 1024 * 1024 * 2
} }).array('file',2);


async function multerPromis( req: any, res:any) {
    return new Promise ((resolve, reject) => {
        upload(req,res,(err)=>{
            if(!err){
                resolve(req)
            }
            reject(err)
        })
    });
}

export async function UploadMiddleware( request: Req, res: Res, next: Next) {
    try {
        console.log(request.files)
        await multerPromis(request,res);
        next()
    } catch (error) {
        console.log(error)
        res.status(404).send(error)
    }
}