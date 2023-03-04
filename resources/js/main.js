window.onload = function () {
  const year = document.querySelector("#__year");
  year.textContent = new Date().getFullYear();

  for (const anchor of document.querySelectorAll("a[href^='#']")) {
    anchor.addEventListener("click", scrollIntoView);
  }
};

const scrollIntoView = function (e) {
  const element = document.querySelector(`${e.target.hash}`);

  if (element) {
    const topPosition = element.offsetTop;
    window.scroll({ behavior: "auto", x: 0, y: topPosition });
  }
};
