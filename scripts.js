document.getElementById("moveBtn").addEventListener("click", function () {
  const box = document.getElementById("box");
  const boxWidth = box.offsetWidth;
  const boxHeight = box.offsetHeight;
  const padding = 20;

  const maxLeft = window.innerWidth - boxWidth - padding;
  const maxTop = window.innerHeight / 2 - boxHeight - padding;

  const left = Math.random() * maxLeft + padding / 2;
  const top = Math.random() * maxTop + padding / 2;

  box.style.left = `${left}px`;
  box.style.top = `${top}px`;
});

document.getElementById("colorBtn").addEventListener("click", function () {
  const box = document.getElementById("box");
  // Generate two random colors
  const color1 = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  const color2 = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  box.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
});

const modeBtn = document.getElementById("modeBtn");
document.body.classList.add("day-mode");
modeBtn.textContent = "Night";

modeBtn.addEventListener("click", function () {
  const box = document.getElementById("box");
  if (document.body.classList.contains("day-mode")) {
    document.body.classList.remove("day-mode");
    document.body.classList.add("night-mode");
    modeBtn.textContent = "Day";

    // Show "zzz" bubble
    const rect = box.getBoundingClientRect();
    const zzz = document.createElement("div");
    zzz.textContent = "💤";
    zzz.style.position = "fixed";
    zzz.style.top = `${rect.top - 40}px`;
    zzz.style.left = `${rect.left + rect.width / 2}px`;
    zzz.style.transform = "translateX(-50%)";
    zzz.style.background = "white";
    zzz.style.color = "#222";
    zzz.style.padding = "6px 16px";
    zzz.style.borderRadius = "16px";
    zzz.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
    zzz.style.fontFamily = "inherit";
    zzz.style.fontSize = "1em";
    zzz.style.zIndex = "1000";
    document.body.appendChild(zzz);

    setTimeout(() => {
      if (zzz.parentNode) zzz.parentNode.removeChild(zzz);
    }, 1000);
  } else {
    document.body.classList.remove("night-mode");
    document.body.classList.add("day-mode");
    modeBtn.textContent = "Night";
  }
});

document.getElementById("spinBtn").addEventListener("click", function () {
  const box = document.getElementById("box");
  box.classList.add("spin");
  setTimeout(() => box.classList.remove("spin"), 1000);
});

document.getElementById("bounceBtn").addEventListener("click", function () {
  const box = document.getElementById("box");
  box.classList.add("bounce");
  setTimeout(() => box.classList.remove("bounce"), 1000);
});

document.getElementById("helloBtn").addEventListener("click", function () {
  const box = document.getElementById("box");
  box.classList.add("smile");

  // Get box position
  const rect = box.getBoundingClientRect();

  // Create speech bubble
  const speech = document.createElement("div");
  speech.textContent = "Hello!";
  speech.style.position = "fixed";
  speech.style.top = `${rect.top - 40}px`;
  speech.style.left = `${rect.left + rect.width / 2}px`;
  speech.style.transform = "translateX(-50%)";
  speech.style.background = "white";
  speech.style.color = "#222";
  speech.style.padding = "6px 16px";
  speech.style.borderRadius = "16px";
  speech.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
  speech.style.fontFamily = "inherit";
  speech.style.fontSize = "1em";
  speech.style.zIndex = "1000";
  document.body.appendChild(speech);

  setTimeout(() => {
    box.classList.remove("smile");
    if (speech.parentNode) speech.parentNode.removeChild(speech);
  }, 1000);
});
