const FORMSPREE_URL = "https://formspree.io/f/mljbaqbp"; // <-- Replace with your Formspree URL

const steps = {
ask: document.getElementById("step-ask"),
yay: document.getElementById("step-yay"),
date: document.getElementById("step-date"),
food: document.getElementById("step-food"),
letter: document.getElementById("step-letter")
};

function showStep(name) {
Object.values(steps).forEach((el) => el.classList.add("hidden"));
steps[name].classList.remove("hidden");
}

// Dodging "no" button
const noBtn = document.getElementById("no-btn");
const askCard = document.getElementById("step-ask");

function dodgeNoButton() {
const cardRect = askCard.getBoundingClientRect();
const btnRect = noBtn.getBoundingClientRect();

const maxX = cardRect.width - btnRect.width - 24;
const maxY = cardRect.height - btnRect.height - 24;

const randomX = Math.max(12, Math.random() * maxX);
const randomY = Math.max(12, Math.random() * maxY);

noBtn.style.position = "absolute";
noBtn.style.left = `${randomX}px`;
noBtn.style.top = `${randomY}px`;
}

noBtn.addEventListener("mouseenter", dodgeNoButton);
noBtn.addEventListener("touchstart", (e) => {
e.preventDefault();
dodgeNoButton();
});
noBtn.addEventListener("click", dodgeNoButton);

// Store selections
const state = {
date: "",
time: "6:00 PM",
vibe: ""
};

document.getElementById("yes-btn").addEventListener("click", () => showStep("yay"));
document.getElementById("okay-btn").addEventListener("click", () => showStep("date"));

document.getElementById("date-form").addEventListener("submit", (e) => {
e.preventDefault();
state.date = document.getElementById("date-input").value;
state.time = document.getElementById("time-input").value;
showStep("food");
});

document.querySelectorAll(".food-option").forEach((btn) => {
btn.addEventListener("click", () => {
state.vibe = btn.dataset.vibe;

const dateText = state.date ? ` on ${state.date}` : "";
document.getElementById("letter-headline").textContent =
`glad you didn't say no 🚗`;
document.getElementById("letter-body").textContent =
`Be ready by ${state.time}${dateText} — ${state.vibe.toLowerCase()} is locked in. Nothing fancy, just good vibes.`;

showStep("letter");
});
});

// Send email when clicking the final button ("oh I accept")
const acceptBtn = document.getElementById("accept-btn");

acceptBtn.addEventListener("click", async () => {
acceptBtn.disabled = true;
acceptBtn.textContent = "Sending...";

try {
const response = await fetch(FORMSPREE_URL, {
method: "POST",
headers: {
"Content-Type": "application/json",
"Accept": "application/json"
},
body: JSON.stringify({
subject: "She said YES! 🌸",
day: state.date,
time: state.time,
vibe: state.vibe,
message: `Date accepted! Day: ${state.date}, Time: ${state.time}, Vibe: ${state.vibe}`
})
});

if (response.ok) {
acceptBtn.textContent = "It's a date! ♥";
} else {
acceptBtn.disabled = false;
acceptBtn.textContent = "Try again";
alert("Could not send email. Check your Formspree URL.");
}
} catch (error) {
acceptBtn.disabled = false;
acceptBtn.textContent = "Try again";
alert("Network error — please try again.");
}
});