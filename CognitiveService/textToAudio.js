
const subscriptionKey = "862399594ebf4377b62ca443d4c488f6";
const serviceRegion = "eastus"; // e.g., "westus"

// Function to convert text to speech
document.getElementById('convertButton').addEventListener('click', () => {
    const text = document.getElementById('textInput').value;
    const selectedLanguage = document.getElementById('languageSelect').value;
    if (!text) {
        alert('Please enter some text.');
        return;
    }

    // Initialize the speech synthesizer
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    speechConfig.speechSynthesisLanguage = selectedLanguage;
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

    // Synthesize the speech
    synthesizer.speakTextAsync(
        text,
        result => {
            if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                console.log("Synthesis finished.");
                // Get the audio data
                const audioData = result.audioData;
                const audioBlob = new Blob([audioData], { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);

                // Set the audio source
                const audioElement = document.getElementById('audioOutput');
                audioElement.src = audioUrl;
                // audioElement.play();
            } else {
                console.error("Speech synthesis canceled, " + result.errorDetails +
                    "\nDid you update the subscription info?");
            }
            synthesizer.close();
        },
        err => {
            console.trace("Error: " + err);
            synthesizer.close();
        });
});
