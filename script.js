// ==========================================
// CONFIGURATION OBJECT - Easy to Update
// ==========================================
const CONFIG = {
	stations: [
		{
			id: 'x92b1',
			title: 'CEO Station',
			context:
				'This engineer has led Microsoft since 2014 and helped the company focus on the cloud.',
			question: 'Who is the current CEO of Microsoft?',
			answerBase64: 'U2F0eWEgTmFkZWxsYQ==', // "Satya Nadella" in Base64
			hint: 'Access Granted. Find the next clue near where you have a seat after some fun on the playground.',
		},
		{
			id: 'k4m7v',
			title: 'Cloud Station',
			context:
				'Microsoft runs a huge network of computers that lets people store files over the internet. Its name is also a shade of bright blue!',
			question: "What is the name of Microsoft's cloud platform?",
			answerBase64: 'QXp1cmU=', // "Azure" in Base64
			hint: 'Access Granted. The next clue can be found along the bottom of a fence where you might also find a home run ball.',
		},
		{
			id: 'p2n8q',
			title: 'Gaming Station',
			context:
				'In 2001, Microsoft released a powerful gaming console with a famous green-and-black logo.',
			question: "What is the name of Microsoft's gaming system?",
			answerBase64: 'WEJveA==', // "Xbox" in Base64
			hint: 'Access Granted. Look high and find the next clue on a sign that tells you that you can ONLY go left in the parking lot.',
		},
		{
			id: 'j6x3l',
			title: 'AI Assistant Station',
			context:
				'Microsoft has a new AI companion that helps you write, code, and create images across Windows and Office.',
			question: "What is the name of Microsoft's AI assistant?",
			answerBase64: 'Q29waWxvdA==', // "Copilot" in Base64
			hint: 'Access Granted. You have chased many codes, find this next clue close to where you might also want to get a sip to drink and stay hydrated.',
		},
		{
			id: 'c9w5r',
			title: 'History Station',
			context:
				"This AI assistant was named after a famous character from the Halo video games and was Microsoft's original helper before Copilot.",
			question: 'What was its name?',
			answerBase64: 'Q29ydGFuYQ==', // "Cortana" in Base64
			hint: 'Access Granted. I hope you will not be late, find this last clue by door B-8',
		},
		{
			id: 'f1t4s',
			title: 'Gaming Station',
			context:
				'In 2014, Microsoft bought the company that made a world-famous game made of blocks.',
			question: 'What is the name of this "blocky" sandbox game?',
			answerBase64: 'TWluZWNyYWZ0', // "Minecraft" in Base64
			hint: 'Access Granted. You have solved the last puzzle! Go to the main entrance, and under the buildings numbers leave no "stone" unturned to find where the keys are hidden.',
		},
	],
};

// ==========================================
// Core Application Logic
// ==========================================

let currentStation = null;
let isAnimating = false;
let verifiedPreviousAnswer = false;

// Initialize App
window.addEventListener('load', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const stationId = urlParams.get('id');

	if (stationId) {
		loadStation(stationId);
	} else {
		showLandingPage();
	}
});

// Show Landing Page
function showLandingPage() {
	document.getElementById('landingPage').style.display = 'block';
	document.getElementById('stationPage').style.display = 'none';
	document.getElementById('header').textContent = 'SCAVENGER HUNT TERMINAL';
}

// Load Station
function loadStation(stationId) {
	const station = CONFIG.stations.find((s) => s.id === stationId);

	if (!station) {
		showLandingPage();
		return;
	}

	currentStation = station;
	isAnimating = false;
	verifiedPreviousAnswer = false;

	document.getElementById('landingPage').style.display = 'none';
	document.getElementById('stationPage').style.display = 'block';

	// Populate station details
	document.getElementById('stationId').textContent = `ID: ${station.id}`;
	document.getElementById('stationTitle').textContent = station.title;

	// Clear all panels
	document.getElementById('errorMessage').style.display = 'none';
	document.getElementById('successPanel').style.display = 'none';
	document.getElementById('padlockContainer').style.display = 'none';
	document.getElementById('answerInput').value = '';
	document.getElementById('verificationInput').value = '';
	document.querySelector('.question-box').style.display = 'none';
	document.getElementById('answerInput').parentElement.style.display = 'none';
	document.querySelector('.button-group').style.display = 'none';
	document.querySelector('button[onclick="goHome()"]').style.display = 'none';

	// Determine if we need verification
	const stationIndex = CONFIG.stations.findIndex((s) => s.id === stationId);

	if (stationIndex === 0) {
		// First station - no verification needed
		showQuestionPanel();
	} else {
		// Not first station - show verification panel
		showVerificationPanel();
	}
}

// Show Question Panel
function showQuestionPanel() {
	document.getElementById('questionContext').textContent =
		currentStation.context;
	document.getElementById('questionText').textContent =
		'❓ ' + currentStation.question;
	document.getElementById('verificationPanel').style.display = 'none';
	document.querySelector('.question-box').style.display = 'block';
	document.getElementById('answerInput').parentElement.style.display = 'block';
	document.querySelector('.button-group').style.display = 'flex';
	document.querySelector('button[onclick="goHome()"]').style.display = 'block';
	document.getElementById('answerInput').focus();

	// Allow Enter key to submit
	document.getElementById('answerInput').onkeypress = (e) => {
		if (e.key === 'Enter') checkAnswer();
	};
}

// Show Verification Panel
function showVerificationPanel() {
	const stationIndex = CONFIG.stations.findIndex(
		(s) => s.id === currentStation.id,
	);
	const previousStation = CONFIG.stations[stationIndex - 1];

	document.getElementById('verificationPanel').style.display = 'block';
	document.querySelector('.question-box').style.display = 'none';
	document.getElementById('answerInput').parentElement.style.display = 'none';
	document.querySelector('.button-group').style.display = 'none';
	document.querySelector('button[onclick="goHome()"]').style.display = 'none';
	document.getElementById('verificationMessage').textContent =
		`To access ${currentStation.title}, you must first provide the answer from ${previousStation.title}.`;
	document.getElementById('verificationInput').focus();

	// Allow Enter key to submit verification
	document.getElementById('verificationInput').onkeypress = (e) => {
		if (e.key === 'Enter') verifyPreviousAnswer();
	};
}

// Verify Previous Answer
function verifyPreviousAnswer() {
	if (!currentStation) return;

	const stationIndex = CONFIG.stations.findIndex(
		(s) => s.id === currentStation.id,
	);
	const previousStation = CONFIG.stations[stationIndex - 1];
	const userInput = document
		.getElementById('verificationInput')
		.value.trim()
		.toUpperCase();
	const correctAnswer = atob(previousStation.answerBase64).toUpperCase();

	// Debug logging
	console.log('[VERIFICATION DEBUG]');
	console.log('Current Station:', currentStation.title);
	console.log('Station Index:', stationIndex);
	console.log('Previous Station:', previousStation.title);
	console.log('User Input:', userInput);
	console.log('Correct Answer:', correctAnswer);
	console.log('Match:', userInput === correctAnswer);

	if (userInput === correctAnswer) {
		// Correct - show success message then question
		document.getElementById('verifyBtn').disabled = true;
		document.getElementById('verificationInput').disabled = true;
		document.getElementById('verificationSuccess').style.display = 'block';

		// Wait for animation to complete, then show question
		setTimeout(() => {
			verifiedPreviousAnswer = true;
			document.getElementById('verificationPanel').style.display = 'none';
			document.getElementById('verificationSuccess').style.display = 'none';
			showQuestionPanel();
		}, 1500);
	} else {
		// Wrong - show error
		document.getElementById('errorMessage').style.display = 'block';
		document.getElementById('verificationInput').value = '';
		setTimeout(() => {
			document.getElementById('errorMessage').style.display = 'none';
		}, 3000);
	}
}

// Check Answer
function checkAnswer() {
	if (!currentStation || isAnimating) return;

	const userAnswer = document
		.getElementById('answerInput')
		.value.trim()
		.toUpperCase();
	const decodedAnswer = atob(currentStation.answerBase64).toUpperCase();

	if (userAnswer === decodedAnswer) {
		// Correct Answer
		triggerSuccessAnimation();
	} else {
		// Wrong Answer
		showError();
	}
}

// Show Error
function showError() {
	document.getElementById('errorMessage').style.display = 'block';
	document.getElementById('answerInput').value = '';

	setTimeout(() => {
		document.getElementById('errorMessage').style.display = 'none';
	}, 3000);
}

// Trigger Success Animation
function triggerSuccessAnimation() {
	isAnimating = true;
	document.getElementById('padlockContainer').style.display = 'flex';
	const padlock = document.getElementById('padlock');

	// Create shattering effect
	createShatterParticles();

	// Animate padlock shattering
	padlock.classList.add('shattering');

	// Wait for animation to complete, then show success
	setTimeout(() => {
		document.getElementById('padlockContainer').style.display = 'none';
		revealSuccess();
		isAnimating = false;
	}, 1200);
}

// Create Shatter Particles
function createShatterParticles() {
	const container = document.getElementById('padlockContainer');
	const particleCount = 12;

	for (let i = 0; i < particleCount; i++) {
		const particle = document.createElement('div');
		particle.className = 'particle';

		const angle = (i / particleCount) * Math.PI * 2;
		const distance = 100;
		const tx = Math.cos(angle) * distance;
		const ty = Math.sin(angle) * distance;

		particle.style.setProperty('--tx', tx + 'px');
		particle.style.setProperty('--ty', ty + 'px');
		particle.style.left = '50%';
		particle.style.top = '50%';

		container.appendChild(particle);

		// Remove particle after animation
		setTimeout(() => particle.remove(), 1000);
	}
}

// Reveal Success Panel
function revealSuccess() {
	document.getElementById('successPanel').style.display = 'block';
	document.getElementById('nextHint').textContent = `→ ${currentStation.hint}`;
	document.getElementById('answerInput').disabled = true;
	document.getElementById('submitBtn').disabled = true;
}

// Reset Station
function resetStation() {
	if (!currentStation) return;
	document.getElementById('answerInput').value = '';
	document.getElementById('answerInput').focus();
}

// Go Home
function goHome() {
	verifiedPreviousAnswer = false;
	window.location.href = '?';
}

// Prevent form submission on Enter in input
document.addEventListener('DOMContentLoaded', () => {
	const input = document.getElementById('answerInput');
	if (input) {
		input.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				checkAnswer();
			}
		});
	}
});
