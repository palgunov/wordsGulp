const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
const statLocation = __dirname + "/errors-stat.txt";
let currentQuestion = 0;
let limitQuestions = 0;
let dictionary = [
    "apple", "word", "coffee", "green" , "red", "blue", "awesome", "amazing", "function", "artist", "singer", "black",
    "five", "for", "about", "what", "restaurant", "silence", "hotel", "luxury", "woman", "cat", "dog", "sister", "mother",
    "wallet", "pharmacy", "mountain", "box", "road", "interesting", "capital", "hope", "pain"
];
let shuffle = (array) => {
    array.forEach((value, index) => {
        let rand = Math.floor(Math.random() * array.length);
        array[index] = array[rand];
        array[rand] = value;
    });
};

let wordArr ="";
let displayCurrentQuestion = () => {
    console.log( currentQuestion);
    let word = dictionary[currentQuestion];
    wordArr = word.split("");
    shuffle(wordArr);
};
app.use(express.static(__dirname + "/dist/"));

let mistakes =  parseInt(fs.readFileSync(statLocation));

app.post("/save", (req, res) => {

    mistakes += parseInt(req.query.errors);
    console.log(req.query.errors);

    // запись в файл
    fs.writeFile(statLocation, mistakes, (err) => {
        if (err) {
            console.log("Ошибка записи в файл!");
        }

    });

    res.sendStatus(200);
});
app.get("/stat", (req, res) => {
    res.send(mistakes.toString());
});
app.get("/dictionary",(request, response)=> {
    shuffle(dictionary);
    let json = JSON.stringify(dictionary.slice(0,limitQuestions));
    currentQuestion = 0;
    return response.send(json);
});

app.post("/make", (req, res) => {
    currentQuestion = parseInt(req.query.currentQuestion);

});
app.post("/transfer", (req, res) => {
    limitQuestions = parseInt(req.query.limitQuestions);
});

app.get("/words",(request, response)=> {

    displayCurrentQuestion();
    let json = JSON.stringify(wordArr);
    return response.send(json);
});
app.listen(port , ()=>
console.log("3000")
);
