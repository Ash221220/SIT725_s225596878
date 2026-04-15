const express = require("express");
const app = express();

app.use(express.json())
app.use(express.static('public'));

app.get("/", (req,res) =>{
    res.redirect("/index.html")
})

function mul(n1,n2){
    return n1*n2;
}

app.get("/mul", (req, res) => {

    const n1 = parseInt(req.query.n1);
    const n2 = parseInt(req.query.n2);
    if (isNaN(n1) || isNaN(n2)) {
        return res.status(400).send("Enter valid numbers");
    }
    res.json({
        n1: n1,
        n2: n2,
        result: mul(n1,n2)
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});