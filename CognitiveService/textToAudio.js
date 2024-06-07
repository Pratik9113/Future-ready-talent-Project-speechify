
// import * as sdk from "microsoft-cognitiveservices-speech-sdk";
// import * as readline from "readline";

// var subscriptionKey = "862399594ebf4377b62ca443d4c488f6";
// var serviceRegion = "eastus"; // e.g., "westus"
// var filename = "C:/Users/91799/Desktop/testing/first-static-web-app/CognitiveService/music.wav";

// var audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
// var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
// var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

// var rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question("Type some text that you want to speak...\n> ", function (text) {
//   rl.close();
//   synthesizer.speakTextAsync(text,
//       function (result) {
//     if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
//       console.log("synthesis finished.");
//     } else {
//       console.error("Speech synthesis canceled, " + result.errorDetails +
//           "\nDid you update the subscription info?");
//     }
//     synthesizer.close();
//     synthesizer = undefined;
//   },
//       function (err) {
//     console.trace("err - " + err);
//     synthesizer.close();
//     synthesizer = undefined;
//   });
//   console.log("Now synthesizing to: " + filename);
// });


// import * as sdk from "microsoft-cognitiveservices-speech-sdk";
// import * as readline from "readline";


// Your Azure subscription key and service region
const subscriptionKey = "862399594ebf4377b62ca443d4c488f6";
const serviceRegion = "eastus"; // e.g., "westus"

// Function to convert text to speech
document.getElementById('convertButton').addEventListener('click', () => {
    const text = document.getElementById('textInput').value;
    if (!text) {
        alert('Please enter some text.');
        return;
    }

    // Initialize the speech synthesizer
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
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
