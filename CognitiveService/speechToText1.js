var phraseDiv;
var startRecognizeOnceAsyncButton;

const subscriptionKey = "862399594ebf4377b62ca443d4c488f6";
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
