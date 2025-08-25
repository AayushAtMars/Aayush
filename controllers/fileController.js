import File from '../models/fileModel.js';
import { v2 as cloudinary } from 'cloudinary';
import sendEmail from '../utils/sendEmail.js';

//upload
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }


    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'file-sharing-app',
    });

    const oneHour = 60 * 60 * 1000; 
    const expiryTime = new Date(Date.now() + oneHour);

    const newFile = await File.create({
      filename: req.file.originalname,
      fileURL: result.secure_url,
      uploadedBy: req.user.id, 
      expiryTime: expiryTime,
    });

    const downloadLink = `${req.protocol}://${req.get('host')}/download/${newFile._id}`;



    //email
    await sendEmail({
      email: req.user.email,
      subject: 'Your File is Ready to Download!',
      message: `Your file has been successfully uploaded. You can download it using this link: ${downloadLink}\nThis link will expire in 1 hour.`,
    });

    res.status(201).json({ message: 'File uploaded successfully!', downloadLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during file upload' });
  }
};


//download
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }


    if (file.expiryTime < new Date()) {
      return res.status(410).json({ message: 'This download link has expired.' }); // 410 Gone [cite: 17]
    }


    file.downloadCount += 1;
    await file.save();


    res.status(200).json({ url: file.fileURL });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};