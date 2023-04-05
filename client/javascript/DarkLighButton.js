const sun = "https://www.uplooder.net/img/image/55/7aa9993fc291bc170abea048589896cf/sun.svg";
const moon = "https://www.uplooder.net/img/image/2/addf703a24a12d030968858e0879b11e/moon.svg";

var theme = "dark";
const container = document.getElementsByClassName("theme-container")[0];
const themeIcon = document.getElementById("theme-icon");
container.addEventListener("click", setTheme);

let decider = localStorage.getItem("mode");

if (decider) {
  if (decider == "dark") {
    theme = "dark";
    setDark()
  } else {
    theme = "light"
    setLight();
  }
} else {
  theme = "dark"
  setDark();
}

function setTheme() {
  switch (theme) {
    case "dark":
      setLight();
      theme = "light";
      break;
    case "light":
      setDark();
      theme = "dark";
      break;
  }
}

function setLight() {
  localStorage.setItem("mode", "light");
  document.getElementsByTagName("body")[0].classList.add("light-invert")
  document.getElementsByTagName("body")[0].classList.add("change-mode")
  document.documentElement.classList.remove("dark");
  setTimeout(() => {
    themeIcon.classList.remove("change");
  }, 900);
  themeIcon.classList.add("change");
  container.classList.remove('shadowlight');
  container.classList.add('shadowdark');
  themeIcon.src = sun;
}
function setDark() {
  localStorage.setItem("mode", "dark");
  document.getElementsByTagName("body")[0].classList.remove("light-invert")
  document.getElementsByTagName("body")[0].classList.remove("change-mode")
  document.documentElement.classList.add("dark");
  setTimeout(() => {
    themeIcon.classList.remove("change");
  }, 900);
  themeIcon.classList.add("change");
  container.classList.remove('shadowdark');
  container.classList.add('shadowlight');
  themeIcon.src = moon;
}
