document.addEventListener("DOMContentLoaded", function () {
  // --- Firebase config (replace with your own if needed) ---
  const firebaseConfig = {
    apiKey: "AIzaSyAkgegP-1wa2IJJrjG0i-wNvyPYGkhQeHw",
    authDomain: "pr0ject11.firebaseapp.com",
    databaseURL: "https://pr0ject11-default-rtdb.firebaseio.com/",
    projectId: "pr0ject11",
    storageBucket: "pr0ject11.firebasestorage.app",
    messagingSenderId: "246738520308",
    appId: "1:246738520308:web:49b6ae50a2c91cf53c76a1",
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const database = firebase.database();

  const bunnyButton = document.getElementById("add-bunny");
  const flowerButton = document.getElementById("add-flower");
  const gardenCounter = document.getElementById("garden-counter");
  const bunniesContainer = document.getElementById("bunnies-container");
  const flowersContainer = document.getElementById("flowers-container");

  let renderedFlowers = 0;
  let renderedBunnies = 0;

  bunnyButton.addEventListener("click", function () {
    const bunnyRef = database.ref("bunnies/count");
    bunnyRef.transaction(function (current) {
      return (current || 0) + 1;
    });
  });

  flowerButton.addEventListener("click", function () {
    const flowerRef = database.ref("flowers/count");
    flowerRef.transaction(function (current) {
      return (current || 0) + 1;
    });
  });

  function updateGardenCounter(bunnyCount, flowerCount) {
    gardenCounter.textContent = `There are ${bunnyCount} bunnies and ${flowerCount} flowers in the garden.`;
  }

  database.ref("bunnies/count").on("value", function (snapshot) {
    const count = snapshot.val() || 0;
    while (renderedBunnies < count) {
      addRandomBunny();
      renderedBunnies++;
    }
    updateGardenCounter(renderedBunnies, renderedFlowers);
  });

  const bunnyArr = [
    "૮꒰ ˶• ༝ •˶꒱ა ♡",
    "૮₍ > ⤙ < ₎ა",
    "૮꒰ ˶Ó ˕ Ò˶ ꒱ა",
    "₍ᐢ. ̫ .ᐢ₎",
  ];

  function addRandomBunny() {
    const bunny = document.createElement("span");
    bunny.textContent = bunnyArr[Math.floor(Math.random() * bunnyArr.length)];
    bunny.style.position = "fixed";
    bunny.style.fontSize = `${Math.random() * 2}em`;
    bunny.style.zIndex = 999;
    const vw = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const vh = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    const left = Math.random() * (vw - 50);
    const top = Math.random() * (vh - 50);
    bunny.style.left = `${left}px`;
    bunny.style.top = `${top}px`;
    bunny.style.userSelect = "none";
    bunny.style.pointerEvents = "none";
    bunniesContainer.appendChild(bunny);
  }

  database.ref("flowers/count").on("value", function (snapshot) {
    const count = snapshot.val() || 0;
    while (renderedFlowers < count) {
      addRandomFlower();
      renderedFlowers++;
    }
    updateGardenCounter(renderedBunnies, renderedFlowers);
  });

  const flowerArr = ["⋆˚✿˖°", "°❀⋆.*･", "𓇢𓆸", "˙✧˖°🪷 ༘ ⋆｡˚"];

  function addRandomFlower() {
    const flower = document.createElement("span");
    flower.textContent =
      flowerArr[Math.floor(Math.random() * flowerArr.length)];
    flower.style.position = "fixed";
    flower.style.fontSize = `${Math.random() * 2 + 1}em`;
    flower.style.zIndex = 999;
    const vw = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const vh = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    const left = Math.random() * (vw - 50);
    const top = Math.random() * (vh - 50);
    flower.style.left = `${left}px`;
    flower.style.top = `${top}px`;
    flower.style.userSelect = "none";
    flower.style.pointerEvents = "none";
    flowersContainer.appendChild(flower);
  }
});
