"use strict";

require("@babel/polyfill");

let dictionary = "";
let wordArr = "";

let makeDictionary = function () {
    const URL = `http://127.0.0.1:3000/dictionary`;
    let request = new XMLHttpRequest();
    request.open("GET", URL);
    request.send();
    request.addEventListener("load", function () {
        dictionary = JSON.parse(request.responseText);
    });
};


window.addEventListener("load", function () {
makeDictionary();

    const limitQuestions = 3;
    let currentQuestion = 0;
    let currentLetter = 0;
    let mistakes = 0;
    let mistakesInThisWord = 0;
    let mistakesOfAllString = document.querySelector("#mistakes");
    let answerContainer = document.querySelector("#answer");
    let letters = document.querySelector("#letters");
    let currentQuestionElem = document.querySelector("#current_question");
    let totalQuestionsElem = document.querySelector("#total_questions");
    let getErrorsBtn = document.querySelector("#getErrors");


    totalQuestionsElem.innerHTML = limitQuestions;

    let makeLimitQuestions = () => {
        const req = new XMLHttpRequest();
        req.open("POST", "http://127.0.0.1:3000/transfer?limitQuestions=" + limitQuestions);
        req.send();
    };
    makeLimitQuestions();

    let makeCurrentQuestion = () => {
        const req = new XMLHttpRequest();
        req.open("POST", "http://127.0.0.1:3000/make?currentQuestion=" + currentQuestion);
        req.send();
    };

    let displayCurrentQuestion = function () {
        const URL = `http://127.0.0.1:3000/words`;
        let request = new XMLHttpRequest();
        request.open("GET",URL);
        request.send();
        request.addEventListener("load",function () {
            wordArr = JSON.parse(request.responseText);
            for (let letter of wordArr) {
                let btn = document.createElement("button");
                btn.innerHTML = letter;
                btn.className = "btn btn-primary btn-sm mr-1";

                letters.appendChild(btn);
            }
            currentQuestionElem.innerHTML = currentQuestion + 1;
            answerContainer.innerHTML = "";
        });
    };
    
    let saveStatistics = () => {
        const req = new XMLHttpRequest();
        req.open("POST", "http://127.0.0.1:3000/save?errors=" + mistakes);
        req.send();
        req.onload = () => console.log("Успешно сохранена статистика на сервере!");
        req.onerror = () => console.log("Ошибка при отправке запроса на сохранение");
    };

    displayCurrentQuestion();

    letters.addEventListener("click", function (event) {
        if (event.target.id === "reload") {
            window.location.reload();

        } else if (event.target.tagName === "BUTTON") {

            let btn = event.target;
            let word = dictionary[currentQuestion];

            // если текст на кнопке совпадает с буквой (текущей) в текущем слове
            if (btn.innerHTML === word[currentLetter]) {
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-success");
                answerContainer.appendChild(btn);

                // если выбрали правильную букву, то теперь ждём следующую
                currentLetter++;

                // если дошли до последней буквы, то переходим к следующему заданию
                if (currentLetter >= word.length) {
                    currentLetter = 0;
                    currentQuestion++;

                    if (mistakesInThisWord > 0) {
                        mistakesInThisWord = 0;
                        mistakesOfAllString.innerHTML = "<br>" + " Всего ошибок: " + mistakes + "<br>";
                    }

                    // если мы дошли до последнего вопроса
                    if (currentQuestion >= limitQuestions) {
                        letters.innerHTML = "<div class='alert alert-success'>Вы успешно справились со всеми заданиями!" +
                            "<button id='reload' class=\"btn btn-sm mr-1 btn-success\">Начать сначала</button></div>";

                        saveStatistics();
                    } else {
                        makeCurrentQuestion();
                        displayCurrentQuestion();
                    }
                }
            } else {
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-danger");
                mistakes++;
                mistakesInThisWord++;
                mistakesOfAllString.innerHTML = "<br>" + " Всего ошибок: " + mistakes + "<br>" + " Ошибок в этом слове: " + mistakesInThisWord + "<br>";

                setTimeout(() => {
                    btn.classList.remove("btn-danger");
                    btn.classList.add("btn-primary");
                }, 300);
            }
        }
    });
    getErrorsBtn.addEventListener("click", function () {
        const req = new XMLHttpRequest();
        req.open("GET",  "http://127.0.0.1:3000/stat");

        req.onload = () => {
            if (req.status === 200) {
                alert("Всего ошибок у всех пользователей: " + req.responseText);
            } else {
                alert("Не удалось получить статистику!");
            }
        };

        req.send();
    });
});









