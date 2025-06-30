document.getElementById("moveBtn").addEventListener("click", function () {
  const box = document.getElementById("box");
  const boxWidth = box.offsetWidth;
  const boxHeight = box.offsetHeight;
  const padding = 20;

  const maxLeft = window.innerWidth - boxWidth - padding;
  const maxTop = window.innerHeight - boxHeight - padding;

  const left = Math.random() * maxLeft + padding / 2;
  const top = Math.random() * maxTop + padding / 2;

  box.style.left = `${left}px`;
  box.style.top = `${top}px`;
});

document.getElementById("colorBtn").addEventListener("click", function () {
  const box = document.getElementById("box");
  const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  // For triangle, set border color; for others, set background
  if (box.classList.contains("triangle")) {
    box.style.borderBottomColor = randomColor;
  } else if (box.classList.contains("star")) {
    box.style.background = randomColor;
  } else {
    box.style.background = randomColor;
  }
});

const modeBtn = document.getElementById("modeBtn");
document.body.classList.add("day-mode");
modeBtn.textContent = "Night";

modeBtn.addEventListener("click", function () {
  if (document.body.classList.contains("day-mode")) {
    document.body.classList.remove("day-mode");
    document.body.classList.add("night-mode");
    modeBtn.textContent = "Day";
  } else {
    document.body.classList.remove("night-mode");
    document.body.classList.add("day-mode");
    modeBtn.textContent = "Night";
  }
});
