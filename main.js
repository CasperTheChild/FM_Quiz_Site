// Variables

const WelcomePage = document.querySelector("#WelcomePage");
const QuestionPage = document.querySelector("#QuestionPage");
const ScorePage = document.querySelector("#ScorePage");

    // Theme values
    
const ColorSwitcher = document.getElementById("ColorSwitcher");   // Theme
const htmlTag = document.getElementsByTagName("html")[0];
const DarkIcons = document.querySelectorAll("#DarkIcon");
const LightIcons = document.querySelectorAll("#LightIcon");

    // Choosing Topic

let TopicIndex = 0;
const QuestionTopics = document.querySelectorAll(".ThemeButton");   
const TopLayoutTopics = document.querySelectorAll(".TopLayoutIcons");
const ScoreIcons = document.querySelectorAll(".ScoreIcons");

    // QuestionPage values

let ButtonIndex = -1;
const QuestionNumber = document.querySelector("#QuestionNumber");
const OverallQuestionNumber = document.querySelectorAll("#OverallQuestionNumber");
const AnswerTexts = document.querySelectorAll("#AnswerText");
const QuestionHtml = document.querySelector("#Question");
const PurpleLine = document.querySelector("#PurpleLine");
const AnswerButtons = document.querySelectorAll("#AnswerButtons");
const SubmitButton = document.querySelector("#SubmitButton");
const NextQuestion = document.querySelector("#NextQuestion");
const SelectWarning = document.querySelector("#SelectWarning");

let QuestionIndex = 0;
let data;
let CorrectAnswerIndex;
let UsersCorrectAnswerSum = 0;
let EnableActiveButton = true;
let AllQuestionNumber;

    // ScorePage values
    
let ScoreNumber = document.querySelector("#ScoreNumber");
let PlayAgain = document.querySelector("#PlayAgain");

// Functions
    
    // Theme

function toggleTheme() {
    if (htmlTag.hasAttribute("data-theme")) {
        htmlTag.removeAttribute("data-theme");

        ColorSwitcher.classList.remove("NightMode");

        for (i = 0; i < DarkIcons.length; i++) {
            DarkIcons[i].classList.remove("DisplayNone");
            LightIcons[i].classList.add("DisplayNone");
        }

        return;
    }

    htmlTag.setAttribute("data-theme", "dark");

    ColorSwitcher.classList.add("NightMode");
    
    for (i = 0; i < DarkIcons.length; i++) {
        DarkIcons[i].classList.add("DisplayNone");
        LightIcons[i].classList.remove("DisplayNone");
    }
}

    // Topic is selected

function TopicClicked(i) {
    TopicIndex = i;

    WelcomePage.classList.add("DisplayNone");
    QuestionPage.classList.remove("DisplayNone");

    TopLayoutTopics[i].classList.remove("DisplayNone");
    ScoreIcons[i].classList.remove("DisplayNone");

    // Updating Questions

    UpdateQuestionPage()
    UpdateQuestionNumber();
    UpdateOverallQuestionNumber();
    UpdateQuestions();
    UpdateAnswers();
}

    // Updating data

function UpdateData() {
    fetch("/data.json")
        .then((response) => {
            if (!response.ok) {
                console.log("Error loading data");
                return;
            }
            return response.json();
        })
        .then((InData) => {
            data = InData;
        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
        });
 }
 

    // Updating Question Page

function UpdateQuestionPage() {
    const { title, icon, questions } = data.quizzes[TopicIndex];

    UpdateQuestionNumber(questions);
    UpdateOverallQuestionNumber(questions);
    UpdateQuestions(questions);
    UpdateAnswers(questions);
    UpdatePurpleLine(questions);
    UpdateCorrectAnswerIndex(questions);
}

function UpdateQuestionNumber(questions) {
    QuestionNumber.textContent = `${QuestionIndex + 1}`;
}

function UpdateOverallQuestionNumber(questions) {
    AllQuestionNumber = questions.length;

    for (let i = 0; i < OverallQuestionNumber.length; i++) {
        OverallQuestionNumber[i].textContent = `${AllQuestionNumber}`;
    }
}

function UpdateQuestions(questions) {
    QuestionHtml.textContent = `${questions[QuestionIndex].question}`;
}

function UpdateAnswers(questions) {
    for (let i = 0; i < AnswerTexts.length; i++) { 
        AnswerTexts[i].textContent = `${questions[QuestionIndex].options[i]}`;
    }
}

function UpdatePurpleLine(questions) {
    PurpleLine.style.width = `${(100 * (QuestionIndex + 1) / questions.length).toFixed(2)}%`;
}

function UpdateCorrectAnswerIndex(questions) {
    let options = questions[QuestionIndex].options;
    let coanswer = questions[QuestionIndex].answer;
    for (let i = 0; i < options.length; i++) {
        if (options[i] === coanswer) {
            CorrectAnswerIndex = i;
        }
    }
}

    // Option Button

function AnswerButtonClicked(i) {
    if (EnableActiveButton) {
        if (ButtonIndex !== -1) {
            AnswerButtons[ButtonIndex].classList.remove("Active");
        }
        ButtonIndex = i;
        AnswerButtons[ButtonIndex].classList.add("Active");
    }
}

function ClearButtons() {
    for (let i = 0; i < AnswerButtons.length; i++) {
        AnswerButtons[i].classList.remove("Correct");
        AnswerButtons[i].classList.remove("InCorrect");
        AnswerButtons[i].classList.remove("InCorrectCorrect");
        AnswerButtons[i].classList.remove("Active");
    }
}

function OffActiveButtons() {
    EnableActiveButton = false;
    AnswerButtons[ButtonIndex].classList.remove("Active");
}

function OnActiveButton() {
    EnableActiveButton = true;
}

function UpdateCorrectAnswer() {
    AnswerButtons[CorrectAnswerIndex].classList.add("Correct");
}

function UpdateInCorrectAnswer() {
    AnswerButtons[ButtonIndex].classList.add("InCorrect")
}

function UpdateInCorrectCorrectAnswer() {
    AnswerButtons[CorrectAnswerIndex].classList.add("InCorrectCorrect")
}

    // Submit Button is clicked

function SubmitButtonClicked() {
    if (ButtonIndex === -1) {
        SelectWarningOn();
        return;
    }

    OffActiveButtons();
    SelectWarningOff();

    if (ButtonIndex === CorrectAnswerIndex) {
        UsersCorrectAnswerSum++;
        UpdateCorrectAnswer();
    }
    else {
        UpdateInCorrectAnswer();
        UpdateInCorrectCorrectAnswer();
    }

    SubmitButton.classList.add("DisplayNone");
    NextQuestion.classList.remove("DisplayNone");
}

function NextQuestionClicked() {
    QuestionIndex++;
    ButtonIndex = -1;

    if (AllQuestionNumber === QuestionIndex + 1) {
        UpdateScore()

        QuestionPage.classList.add("DisplayNone");
        ScorePage.classList.remove("DisplayNone");

        return;
    }

    ClearButtons();

    OnActiveButton();

    SubmitButton.classList.remove("DisplayNone");
    NextQuestion.classList.add("DisplayNone");

    UpdateQuestionPage();
}

function SelectWarningOn() {
    SelectWarning.classList.remove("DisplayNone");
}

function SelectWarningOff() {
    SelectWarning.classList.add("DisplayNone");
}

    // ScorePage functions
    
function UpdateScore() {
    ScoreNumber.textContent = UsersCorrectAnswerSum;
}

function PlayAgainClicked() {
    ClearEverything();

    ScorePage.classList.add("DisplayNone");
    WelcomePage.classList.remove("DisplayNone");
}

function ClearEverything() {
    ClearIcons();
    ClearButtons();
    OnActiveButton();

    ButtonIndex = -1;
    QuestionIndex = 0;
    UsersCorrectAnswerSum = 0;
}

function ClearIcons() {
    TopLayoutTopics[TopicIndex].classList.add("DisplayNone");
    ScoreIcons[TopicIndex].classList.add("DisplayNone");
}

// Events

document.addEventListener("DOMContentLoaded", async () => {
    UpdateData();
    if (!data) {
        console.log("Data loading failed.");
        return;
    }
    console.log("Event listeners are now active.");
});

ColorSwitcher.addEventListener("click", toggleTheme);

for (let i = 0; i < QuestionTopics.length; i++) {
    QuestionTopics[i].addEventListener("click", function() {
        TopicClicked(i);
    });
}

for (let i = 0; i < AnswerButtons.length; i++) {
    AnswerButtons[i].addEventListener("click", function() {
        AnswerButtonClicked(i);
    });
}

SubmitButton.addEventListener("click", SubmitButtonClicked);

NextQuestion.addEventListener("click", NextQuestionClicked);

PlayAgain.addEventListener("click", PlayAgainClicked);