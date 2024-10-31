let words, index = 0, speaking = false, paused = false;
let synth = window.speechSynthesis;
let utterance;
let speed = 1; // Default speaking speed
let pauseDurationPerLetter = 250; // Default pause duration per letter
let pitch = 1; // Default pitch
let voices=[];

// Load available voices into dropdown
function loadVoices() {
    voices = synth.getVoices();
    const voiceSelect = document.getElementById("voiceSelect");
    voiceSelect.innerHTML = ""; // Clear existing options

    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = voice.name;
        voiceSelect.appendChild(option);
    });
}

// Set the selected voice when user selects an option
function updateVoice() {
    const selectedVoiceName = document.getElementById("voiceSelect").value;
    return voices.find(voice => voice.name === selectedVoiceName);
}

// Load voices on page load and listen for changes
window.onload = loadVoices;
synth.onvoiceschanged = loadVoices; // Reload voices when voices change


function startOrRestart() {
    const startRestartBtn = document.getElementById("startRestartBtn");

    // Check if the button is in "Start" or "Restart" mode
    if (startRestartBtn.textContent === "Start") {
        startRestartBtn.textContent = "Restart";  // Change button text to "Restart" after the first click
        speak();  // Start speaking
    } else {
        restart();  // Restart from the beginning if it's already in "Restart" mode
    }
}

function speak() {
    const paragraph = document.getElementById("text").value;
    words = paragraph.split(" ");
    index = 0;
    speaking = true;
    paused = false;
    document.getElementById("stopResumeBtn").textContent = "Stop";
    speakWord();
}

function speakWord() {
    if (index < words.length && speaking) {
        const word = words[index];
        utterance = new SpeechSynthesisUtterance(formatWord(word));
        utterance.rate = speed;
        utterance.pitch = pitch;
        utterance.lang = 'en-US';

        synth.speak(utterance);

        const punctuationPause = (word.includes(".") || word.includes(",")) ? 600 : 300;
        const pauseDuration = word.length * pauseDurationPerLetter;

        utterance.onend = function() {
            index++;
            if (speaking && !paused) setTimeout(speakWord, pauseDuration);
        };
    }
}

function formatWord(word) {
    return word.replace(".", " fullstop").replace(",", " comma");
}

function stopOrResume() {
    if (paused) {
        paused = false;
        speaking = true;
        document.getElementById("stopResumeBtn").textContent = "Stop";
        speakWord();
    } else {
        synth.cancel();
        paused = true;
        speaking = false;
        document.getElementById("stopResumeBtn").textContent = "Resume";
    }
}

function restart() {
    synth.cancel();
    index = 0;
    speaking = true;
    paused = false;
    document.getElementById("stopResumeBtn").textContent = "Stop";
    speakWord();
}

function rereadLastTwoWords() {
    if (index >= 2) {
        synth.cancel();
        index -= 2;
        speaking = true;
        paused = false;
        document.getElementById("stopResumeBtn").textContent = "Stop";
        speakWord();
    }
}

function updateSpeed() {
    speed = document.getElementById("speedSlider").value / 150;
    document.getElementById("speedValue").textContent = document.getElementById("speedSlider").value;
}

function updatePause() {
    pauseDurationPerLetter = document.getElementById("pauseSlider").value;
    document.getElementById("pauseValue").textContent = pauseDurationPerLetter;
}

function updatePitch() {
    pitch = document.getElementById("pitchSlider").value;
    document.getElementById("pitchValue").textContent = pitch;
}

function loadLanguages() {
    voices = synth.getVoices();
    const languageSelect = document.getElementById("languageSelect");
    languageSelect.innerHTML = ""; // Clear previous options
    const languages = new Set();

    voices.forEach(voice => {
        if (!languages.has(voice.lang)) {
            const option = document.createElement('option');
            option.textContent = voice.lang;
            option.value = voice.lang;
            languageSelect.appendChild(option);
            languages.add(voice.lang);
        }
    });
}

// Wait for voices to be loaded and then populate languages
synth.onvoiceschanged = loadLanguages;


function setLanguageAndVoice() {
    const selectedLanguage = document.getElementById("languageSelect").value;
    selectedVoice = voices.find(voice => voice.lang === selectedLanguage);
}

function speakWord() {
    const word = words[index];
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.voice = selectedVoice; // Set selected voice
    utterance.rate = speed;
    utterance.pitch = pitch;
    synth.speak(utterance);
}
