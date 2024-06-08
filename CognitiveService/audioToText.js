
    // import * as SpeechSDK from "microsoft-cognitiveservices-speech-SpeechSDK";
    // import * as fs from "fs";
    
    // var subscriptionKey = "862399594ebf4377b62ca443d4c488f6";
    // var serviceRegion = "eastus"; // e.g., "westus"
    // var filename = "C:/Users/91799/Desktop/testing/first-static-web-app/CognitiveService/music.wav"; // 16000 Hz, Mono
    
    // var pushStream = SpeechSDK.AudioInputStream.createPushStream();
    
    // fs.createReadStream(filename).on('data', function(arrayBuffer) {
    //     pushStream.write(arrayBuffer.slice());
    // }).on('end', function() {
    //     pushStream.close();
    // });
    
    // console.log("Now recognizing from: " + filename);
    
    // var audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);
    // var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    
    // speechConfig.speechRecognitionLanguage = "en-US";
    
    // var recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    
    // recognizer.recognizeOnceAsync(
    //     function (result) {
    //     console.log(result);
    
    //     recognizer.close();
    //     recognizer = undefined;
    //     },
    //     function (err) {
    //     console.trace("err - " + err);
    
    //     recognizer.close();
    //     recognizer = undefined;
    //     });



// audioToText.js


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
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("862399594ebf4377b62ca443d4c488f6", "eastus");

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
