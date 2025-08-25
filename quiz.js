const API_KEY = "5b0105c266294f89bf281fe119cd4174"; //API key given from website/server
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=10`; //request URL to API website/server / page_size=10: i want 10 games returned

fetch(API_URL) // GET request to URL, tells server to send me game data
  .then(res => res.json()) // turns response to usable JSON data
  .then(data => { 
  const games = data.results; // holds an array of 10 game objects
  const labels = document.querySelectorAll(".quiz-form label"); // grabs all <label> elements inside .quiz-form
  const inputs = document.querySelectorAll(".quiz-form input"); // grabs all <input> elements inside .quiz-form

  const questions = games.map(game => { // .map creates a new array of quiz questions
    const askGenre = Math.random() < 0.5; // askGenre randomly asks about genre or release year
    return {
        name: game.name,
        question: `What is the ${askGenre ? "genre" : "release year"} of "${game.name}"?`, // question is a dynamic string that changes based on askGenre
        correctAnswer: askGenre // if askGenre is true, correct answer is name of first genre ...
        ? (game.genres[0]?.name || "Unknown") // ?. is optional chaining, it'll prevent errors if genres is missing
        : (new Date(game.released).getFullYear() || "Unknown") // ... if not, it's the release year (extracted from full release date using getFullYear)
    };
  });

  questions.forEach((q, index) => { // loops  through each of the 10 questions (from API) one by one
    labels[index].textContent = `${index + 1}. ${q.question}`; // updates matching <label> with new game question
    inputs[index].dataset.correctAnswer = q.correctAnswer; // stores correct answer in a custom 'data-correct-answer' attribute on each input (for grading later)
  });
  // console.log(questions); // after mapping games into quiz questions, print resulting array of question objects to the console
  

  // Attach submit button
  const submitBtn = document.querySelector("button[type = 'submit']"); // finds <button> in html file with type "submit" - tells the page what to do when the user submits
  submitBtn.addEventListener("click", () => { // starts listening for a click on submit button - arrow function runs when user clicks the button
    event.preventDefault(); // prevent form from submitting normally

    const userAnswers = Array.from(inputs).map(input => input.value.trim()); // NodeList of all <input> elements from line 9 - converts into array, .map() extracts .value of each input, .trim() removes leading/trailing spaces to clean answer - result is an array of user-submitted answers
    const correctAnswers = Array.from(inputs).map(input => input.dataset.correctAnswer); //convert inputs NodeList into an array, .dataset.correctAnswer reads the data-correct-answer="..." attribute from each <input> - result is array of correct answers

    const quizData = questions.map((q, i) => ({ // loops through questions array that holds quiz object with question + correct answer // for each question 'q' it gets an index 'i' used to align correctAnswers[i] and correctAnswers[i]
        question: q.question, // the actual question text
        userAnswer: userAnswers[i], // the answer the user types
        correctAnswer: correctAnswers[i] // the right answer from the data
    })); // end-result: quiz becomes array of 10 objects

    localStorage.setItem("quizResults", JSON.stringify(quizData)); // converts entire quizData array into a string using JSON.stringify, needed because local storage only stores strings. it gets stored under the ket "quizResults" - lets you save results after changing pages
    window.location.href = "results.html" // redirect to results page
  });
})
.catch(error => console.error("Error fetching data: ", error)); // if anything goes wrong, .catch() will log the error so i can debug