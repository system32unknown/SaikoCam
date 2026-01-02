const express = require('express');
const multer = require("multer");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3500;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true})); // parse URL-encoded request bodies
app.use(express.json()); // parse JSON request bodies
app.use(express.static(__dirname + '/public')); // serve static files from a directory

app.use('/uploads', express.static('uploads'));

const uploadDir = "./uploads";

// Multer config
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (_, file, cb) => {
        const now = new Date();

        const dateName =
        now.getFullYear() + "_" +
        String(now.getMonth() + 1).padStart(2, "0") + "_" +
        String(now.getDate()).padStart(2, "0") + "_" +
        String(now.getHours()).padStart(2, "0") + "_" +
        String(now.getMinutes()).padStart(2, "0") + "_" +
        String(now.getSeconds()).padStart(2, "0");

        cb(null, dateName + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

var uploaded_img = null;
app.get('/', (_, res) => res.render('rendered', { imagePath: uploaded_img }));

app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded");
    
    const imageUrl = `/uploads/${req.file.filename}`;
    console.log("Received file:", imageUrl);
    uploaded_img = imageUrl;
});

app.get('/favicon.ico', (_, res) => res.status(204).end());

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));