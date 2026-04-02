const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/myprojectDB');
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});


app.use(express.json())
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

const ProjectSchema = new mongoose.Schema({
    title: String,
    image: String,
    link: String,
    description: String,
});
const Project = mongoose.model('projects', ProjectSchema);

const cardData = [
    {
        title: "German Shepherd",
        image: "images/german.jpg",
        link: "About German Shepherd",
        description: "Obedient and smart"
    },
    {
        title: "Labrador",
        image: "images/Labrador.jpg",
        link: "About Labrador",
        description: "Eats a lot"
    },
    {
        title: "Pitbull",
        image: "images/pitbull.jpg",
        link: "About Pitbull",
        description: "Medium Sized and short hair"
    }
];

mongoose.connection.once('open', async () => {
    try {
        await Project.deleteMany({});
        await Project.insertMany(cardData);
        console.log("Stored in DB");
    } catch (err) {
        console.error("DB save error:", err);
    }
});

app.get('/api/projects', async (req, res) => {
    const projects = await Project.find({});
    res.json({ statusCode: 200, data: projects, message: "Success" });
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});