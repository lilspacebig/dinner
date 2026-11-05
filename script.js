// REPLACE THIS WITH YOUR FORMSPREE ENDPOINT URL
const FORMSPREE_URL = "https://formspree.io/f/xzeeypvr";

// Sheffield Restaurant Dataset
const restaurants = {
  japanese: ["Maki&Ramen", "Yama Sushi", "Yutu Sushi"],
  chinese: ["BiangBiang Noodles", "Lanzhou Hand Pulled Noodles", "Silk", "Uncle Lin"],
  mexican: ["Taco Cambridge St."],
  korean: ["Joomak", "Kedai Cambridge St."],
  vietnamese: ["Vietnamese Cambridge St."],
  malay: ["Zurul", "apa tah nama kedai haritu", "Melayu Cambridge Street"],
  middle_eastern:["Mount Lebanon", "The Pink Tree", "Istanbul", "Jimmy's Kitchen"],
  fast_food: ["Unit", "Pasam", "Aslan's", "Tasteez", "mana2 London St", "Steak'd"]
};

let selectedCuisine = "";

// Helper to switch active step
function goToStep(stepId) {
  document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
  document.getElementById(stepId).classList.add('active');
}

// Runaway Button Logic
const runawayBtn = document.getElementById('runaway-btn');

if (runawayBtn) {
  const moveButton = () => {
    const container = runawayBtn.parentElement;
    const containerRect = container.getBoundingClientRect();
    const btnRect = runawayBtn.getBoundingClientRect();

    const maxX = containerRect.width - btnRect.width;
    const maxY = 200;

    const randomX = Math.floor(Math.random() * maxX) - (maxX / 2);
    const randomY = Math.floor(Math.random() * maxY) - (maxY / 2);

    runawayBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
  };

  runawayBtn.addEventListener('mouseover', moveButton);
  runawayBtn.addEventListener('click', moveButton);
}

// Populate and display restaurants
function showRestaurants(cuisineKey) {
  selectedCuisine = cuisineKey;
  const listContainer = document.getElementById('restaurant-list');
  const title = document.getElementById('cuisine-title');
  
  title.innerText = `Pick a ${cuisineKey.replace('_', ' ')} spot in Sheffield:`;
  listContainer.innerHTML = '';

  restaurants[cuisineKey].forEach(place => {
    const btn = document.createElement('button');
    btn.innerText = place;
    btn.onclick = () => selectRestaurant(place);
    listContainer.appendChild(btn);
  });

  goToStep('step-restaurant');
}

function selectRestaurant(placeName) {
  // Update the screen UI instantly for her
  document.getElementById('summary-text').innerText = `${placeName}`;
  goToStep('step-thanks');

  // Send her selection secretly to your email via Formspree
  fetch(FORMSPREE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      cuisine: selectedCuisine.replace('_', ' '),
      restaurant: placeName,
      date_submitted: new Date().toLocaleString()
    })
  })
  .then(response => {
    if (response.ok) {
      console.log("Formspree email delivered!");
    } else {
      console.error("Formspree submission failed.");
    }
  })
  .catch(error => console.error("Error:", error));
}
