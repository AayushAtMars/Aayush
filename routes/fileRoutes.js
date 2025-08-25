import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { uploadFile, downloadFile } from '../controllers/fileController.js';

const fileRouter = express.Router();
const upload = multer({ dest: 'uploads/' }); 


const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } 

    catch (err) {
      res.status(401).json({ message: 'Not authorized, token error' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  } 

};

fileRouter.post('/upload', protect, upload.single('file'), uploadFile);
fileRouter.get('/download/:id', downloadFile);

export default fileRouter;