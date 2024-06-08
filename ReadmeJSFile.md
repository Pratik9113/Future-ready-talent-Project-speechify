Hide all JavaScript files due to the subscription key, as this is completely based on a static app with no use of Express.



/* audio to text */

document.getElementById("convertButton").addEventListener("click", function() {
    var fileInput = document.getElementById("audioUpload");
    var file = fileInput.files[0];
    if (!file) {
        alert("Please upload an audio file first.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
        var arrayBuffer = event.target.result;
        convertAudioToText(arrayBuffer);
    };
    reader.readAsArrayBuffer(file);
});

function convertAudioToText(arrayBuffer) {
    var pushStream = SpeechSDK.AudioInputStream.createPushStream();
    pushStream.write(arrayBuffer);
    pushStream.close();

    var audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("SUBCRIPTION_KEY", "eastus");

    speechConfig.speechRecognitionLanguage = "en-US";
    
    var recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(
        function (result) {
            document.getElementById("phraseDiv").value = result.text;
            recognizer.close();
        },
        function (err) {
            console.trace("err - " + err);
            recognizer.close();
        }
    );
}



/* speech to text */
var phraseDiv;
var startRecognizeOnceAsyncButton;

const subscriptionKey = "SUBCRIPTION_KEY";
const serviceRegion = "eastus";
var languageTargetOptions, languageSourceOptions;
var SpeechSDK;
var recognizer;

document.addEventListener("DOMContentLoaded", function () {
  startRecognizeOnceAsyncButton = document.getElementById("startRecognizeOnceAsyncButton");
  languageTargetOptions = document.getElementById("languageTargetOptions");
  languageSourceOptions = document.getElementById("languageSourceOptions");
  phraseDiv = document.getElementById("phraseDiv");

  startRecognizeOnceAsyncButton.addEventListener("click", function () {
    startRecognizeOnceAsyncButton.disabled = true;
    phraseDiv.innerHTML = "";

    if (!subscriptionKey || !serviceRegion) {
      alert("Subscription key or service region is missing!");
      startRecognizeOnceAsyncButton.disabled = false;
      return;
    }
    var speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(subscriptionKey, serviceRegion);

    speechConfig.speechRecognitionLanguage = languageSourceOptions.value;
    let language = languageTargetOptions.value
    speechConfig.addTargetLanguage(language)

    var audioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    recognizer = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(
      function (result) {
        startRecognizeOnceAsyncButton.disabled = false;
        if (result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
          let translation = result.translations.get(language);
          window.console.log(translation);
          phraseDiv.innerHTML += translation;
        }

        recognizer.close();
        recognizer = undefined;
      },
      function (err) {
        startRecognizeOnceAsyncButton.disabled = false;
        phraseDiv.innerHTML += err;
        window.console.log(err);

        recognizer.close();
        recognizer = undefined;
      });
  });

  if (!!window.SpeechSDK) {
    SpeechSDK = window.SpeechSDK;
    startRecognizeOnceAsyncButton.disabled = false;

    document.getElementById('content').style.display = 'block';
    document.getElementById('warning').style.display = 'none';
  }
});


/* text To audio */ 

const subscriptionKey = "SUBCRIPTION_KEY";
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
