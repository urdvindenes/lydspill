// --- Spill Data ---
const soundsData = [
    // Husk å erstatte filnavnene hvis dine er annerledes!
    { ipa: '/s/', audio: 'sounds/s.mp3', options: ['/s/', '/ʃ/', '/t/', '/f/'] },
    { ipa: '/ŋ/', audio: 'sounds/ng.mp3', options: ['/n/', '/m/', '/ŋ/', '/g/'] },
    { ipa: '/yː/', audio: 'sounds/y_long.mp3', options: ['/iː/', '/uː/', '/øː/', '/yː/'] },
    { ipa: '/ə/', audio: 'sounds/schwa.mp3', options: ['/e/', '/æ/', '/ə/', '/ɔ/'] },
    { ipa: '/p/', audio: 'sounds/p.mp3', options: ['/b/', '/t/', '/k/', '/p/'] }
    // Legg til flere lyder her basert på forelesningen
    // f.eks.: { ipa: '/l/', audio: 'sounds/l.mp3', options: ['/l/', '/r/', '/n/', '/ɽ/'] }
];

// --- Element Referanser ---
const playSoundButton = document.getElementById('playSoundButton');
const choicesContainer = document.getElementById('choices-container');
const feedbackText = document.getElementById('feedback-text');
const audioElement = document.getElementById('audioPlayer');
const instructions = document.getElementById('instructions');

// --- Spill Variabler ---
let currentSoundIndex = 0;
let currentCorrectAnswer = '';
let score = 0; // Kan brukes senere
let questionsOrder = []; // For å randomisere rekkefølgen

// --- Hjelpefunksjon: Bland en array (Fisher-Yates shuffle) ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Bytter plass
    }
    return array;
}

// --- Funksjon: Last neste spørsmål ---
function loadQuestion() {
    // Sjekk om spillet er ferdig
    if (currentSoundIndex >= questionsOrder.length) {
        displayEndGame();
        return;
    }

    // Hent data for nåværende spørsmål basert på randomisert rekkefølge
    const soundInfo = soundsData[questionsOrder[currentSoundIndex]];
    currentCorrectAnswer = soundInfo.ipa;
    audioElement.src = soundInfo.audio;

    // Tilbakestill feedback og knapper
    feedbackText.textContent = '';
    feedbackText.className = ''; // Fjerner .correct/.incorrect klasser
    choicesContainer.innerHTML = ''; // Tøm forrige valg

    // Bland alternativene for dette spørsmålet
    const shuffledOptions = shuffleArray([...soundInfo.options]); // Bruk kopi

    // Lag og vis knapper for alternativene
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', handleAnswerClick);
        choicesContainer.appendChild(button);
    });

    // Sørg for at spill-lyd-knappen er aktiv
    playSoundButton.disabled = false;
    instructions.textContent = `Spørsmål ${currentSoundIndex + 1} av ${questionsOrder.length}. Spill lyden og velg riktig symbol.`;
}

// --- Funksjon: Håndter svar-klikk ---
function handleAnswerClick(event) {
    const selectedAnswer = event.target.textContent;

    // Deaktiver alle valgknapper etter svar
    const choiceButtons = choicesContainer.querySelectorAll('button');
    choiceButtons.forEach(button => button.disabled = true);
    playSoundButton.disabled = true; // Deaktiver også spill-lyd

    // Sjekk svar og gi feedback
    if (selectedAnswer === currentCorrectAnswer) {
        feedbackText.textContent = 'Riktig! 🎉';
        feedbackText.className = 'correct';
        score++; // Øk poengsum (kan vises senere)
    } else {
        feedbackText.textContent = `Feil. Riktig svar var ${currentCorrectAnswer}.`;
        feedbackText.className = 'incorrect';
    }

    // Gå til neste spørsmål etter en liten pause
    currentSoundIndex++;
    setTimeout(loadQuestion, 2000); // Vent 2 sekunder
}

// --- Funksjon: Vis slutten av spillet ---
function displayEndGame() {
    instructions.textContent = "Spillet er ferdig!";
    choicesContainer.innerHTML = ''; // Fjern knapper
    playSoundButton.style.display = 'none'; // Skjul spill-lyd knappen
    feedbackText.textContent = `Du fikk ${score} av ${soundsData.length} riktige! Bra jobba!`;
    feedbackText.className = ''; // Nøytral farge

    // Legg til en "Spill igjen"-knapp (valgfritt)
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Spill Igjen?';
    restartButton.style.marginTop = '20px';
    restartButton.addEventListener('click', startGame);
    choicesContainer.appendChild(restartButton);
}


// --- Funksjon: Start Spillet ---
function startGame() {
    currentSoundIndex = 0;
    score = 0;
    // Lag en randomisert rekkefølge av spørsmålsindeksene
    questionsOrder = shuffleArray([...Array(soundsData.length).keys()]);
    // Sørg for at spill-lyd-knappen er synlig igjen
    playSoundButton.style.display = 'inline-block';
    loadQuestion();
}

// --- Event Listeners ---
playSoundButton.addEventListener('click', () => {
    audioElement.play();
});

// --- Start spillet når siden lastes ---
document.addEventListener('DOMContentLoaded', startGame);