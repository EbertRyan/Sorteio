const container = document.querySelector(".container");
const minInput = document.querySelector("#min");
const maxInput = document.querySelector("#max");
const alertElement = document.querySelector("#alert");
const checkbox = document.querySelector("#checkbox");
const btnDropdown = document.querySelector("#btn-dropdown");
const dropdown = document.querySelector(".dropdown-menu");
const dropdownText = document.querySelector("#dropdown-text");
const radios = document.querySelectorAll('input[name="option"]');
const btnRaffle = document.querySelector("#btn-submit");

const icons = {
  exclamation: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
    </svg>`,
};

minInput.addEventListener("input", fixError);
maxInput.addEventListener("input", fixError);

checkbox.addEventListener("change", () => {
  btnDropdown.style.display = checkbox.checked ? "flex" : "none";
});

btnDropdown.addEventListener("click", () => {
  if (dropdown.style.display !== "flex") dropdown.style.display = "flex";
});

radios.forEach((radio) => {
  radio.addEventListener("change", () => {
    dropdownText.textContent = radio.value;
    if (dropdown.style.display !== "none") dropdown.style.display = "none";
  });
});

btnRaffle.addEventListener("click", (e) => {
  e.preventDefault();
  validRaffle();
});

// remove classes de aviso nos dados de entrada
function fixError() {
  if (minInput.value && minInput.classList.contains("form-invalid"))
    minInput.classList.remove("form-invalid");
  if (
    maxInput.value > minInput.value &&
    maxInput.classList.contains("form-invalid")
  )
    maxInput.classList.remove("form-invalid");
  if (maxInput.value > minInput.value) alertElement.innerHTML = "";
}

// valida dados de entrada
function validInput(min, max) {
  let incorrectValue = `<span class="alert-danger">${icons.exclamation} O máximo não pode ser menor ou igual ao mínimo.</span>`;
  let emptyValue = `<span class="alert-danger">${icons.exclamation} É necessário preencher todos os campos.</span>`;

  if (min >= max) alertElement.innerHTML = incorrectValue;
  if (!min || !max) alertElement.innerHTML = emptyValue;
  if (min >= max || !max) maxInput.classList.add("form-invalid");
  if (!min) minInput.classList.add("form-invalid");
}

// sorteio
function raffle(min, max) {
  const resultValue = Math.floor(Math.random() * (max - min + 1)) + min;

  const resultElement = document.createElement("section");
  resultElement.classList.add("result-container");
  container.appendChild(resultElement);

  if (checkbox.checked) {
    let option = 0;
    for (let i in radios) {
      if (radios[i].checked) option = radios[i].value;
    }

    timerRaffle(option, resultElement);
    setTimeout(() => {
      resultRaffle(resultValue, resultElement);
    }, option * 1000 + 1000);
  } else {
    resultRaffle(resultValue, resultElement);
  }
}

// valida sorteio
function validRaffle() {
  const minValue = parseInt(minInput.value);
  const maxValue = parseInt(maxInput.value);

  maxValue > minValue
    ? raffle(minValue, maxValue)
    : validInput(minValue, maxValue);
}

// cronômetro
function timerRaffle(timer, display) {
  let count = parseInt(timer) + 1;

  const start = setInterval(() => {
    if (--count > 0)
      display.innerHTML = `<span class="count show">${count}</span>`;
  }, 1000);

  setTimeout(() => {
    clearInterval(start);
  }, timer * 1000 + 1000);
}

// resultado do sorteio
function resultRaffle(value, display) {
  const resultText = `<div class="result-close">
  <button type="button" id="btn-close">${icons.x}</button>
  </div>
  <div class="result-content show">
  <img src="assets/img/Celebration-rafiki.svg" alt="image celebration">
  <p>O resultado do sorteio é</p><span id="result">${value}</span>
  </div>`;
  display.innerHTML = resultText;

  const btnClose = document.querySelector("#btn-close");
  btnClose.addEventListener("click", () => {
    display.remove();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") display.remove();
  });
}
