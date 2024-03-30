require('dotenv').config();


const port = process.env.PORT || 3000;
const mongodbURI = process.env.MONGODB_URI;
const secretKey = process.env.SECRET_KEY;
