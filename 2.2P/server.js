const express = require("express");
const app = express();

app.use(express.json())
app.use(express.static('public'));

app.get("/", (req,res) =>{
    res.redirect("/index.html")
})

function add(n1, n2) {
    return n1 + n2;
}

function sub(n1,n2){
    return n1-n2;
}

function mul(n1,n2){
    return n1*n2;
}

function div(n1,n2){
    return n1/n2;
}

app.get("/add", (req, res) => {

    const n1 = parseInt(req.query.n1);
    const n2 = parseInt(req.query.n2);

    if (isNaN(n1) || isNaN(n2)) {
        return res.send("Enter valid numbers");
    }

    res.json({
        n1: n1,
        n2: n2,
        result: add(n1,n2)
    });
});
app.get("/sub", (req, res) => {

    const n1 = parseInt(req.query.n1);
    const n2 = parseInt(req.query.n2);

    if (isNaN(n1) || isNaN(n2)) {
        return res.send("Enter valid numbers");
    }

    res.json({
        n1: n1,
        n2: n2,
        result: sub(n1,n2)
    });
});
app.get("/mul", (req, res) => {

    const n1 = parseInt(req.query.n1);
    const n2 = parseInt(req.query.n2);

    if (isNaN(n1) || isNaN(n2)) {
        return res.send("Enter valid numbers");
    }

    res.json({
        n1: n1,
        n2: n2,
        result: mul(n1,n2)
    });
});
app.get("/div", (req, res) => {

    const n1 = parseInt(req.query.n1);
    const n2 = parseInt(req.query.n2);

    if (isNaN(n1) || isNaN(n2)) {
        return res.send("Enter valid numbers");
    }

    res.json({
        n1: n1,
        n2: n2,
        result: div(n1,n2)
    });
});

app.post("/calc", (req,res)=>{
    const{n1,n2,op} =  req.body
    let output;
    switch(op){
        case "add":
            output = add(n1,n2);
            break;
        case "sub":
            output = sub(n1,n2);
            break;
        case "mul":
            output = mul(n1,n2);
            break;
        case "div":
            output = div(n1,n2);
            break;
    }
    res.json({
        n1: n1,
        n2: n2,
        output:output,
    })
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});