import React, {useEffect, useState} from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./Style.css";

let synth = speechSynthesis;

export default function HomePage () {

    const [value, setValue] = useState("");
    const [summary, setSummary] = useState("");

    const handleButtonClick = async () => {
        setValue(document.getElementById("textarea").value);
        const response=await fetch("http://localhost:3000",{
            method:"POST",
            body:value,
        })
        const sum = await response.text()
        setSummary(sum);
    
    }

    const handleSummaryClick = () => {
        function textToSpeech(text) {
            let utterance = new SpeechSynthesisUtterance(text);
            const voices = synth.getVoices();
            const microsoftEnglishVoice = voices.find((voice) => voice.name === "Microsoft Mark - English (United States)");
            utterance.voice = microsoftEnglishVoice;
            utterance.volume = 1;
            synth.speak(utterance);
        }
        textToSpeech(summary)
    }
 
    const {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
    } = useSpeechRecognition();
 
    useEffect(() => {
    if (finalTranscript !== '') {
        console.log('Got final result:', finalTranscript);
    }
    }, [interimTranscript, finalTranscript]);
 
 
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }
 
 
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log('Browser does not support speech recognition. Try Chrome desktop, maybe?');
    }
 
 
    const listenContinuously = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'en-US',
        });
    };
 

    return (
        <>
        <div class="row">   
            <div class="header">
                <h1>speechLess</h1>
                <p>A text-to-speech & speech-to-text summarizing tool</p>
            </div>
            
            <div class="column left"> 
            <center>
                <br></br>
                <p class="bolded">Text</p>
                <img id="microphone" src={require('../public/microphone.png')} alt="microphone.png" title="microphone"/>
                <div class="wrapper">
                <div class = "textArea"><center>
                    {listening ? 
                    <textarea id="textarea" value={transcript}></textarea> : 
                    <textarea id="textarea" ></textarea> }
                </center>
                </div> 

                </div>
                <br></br> 
                <button onClick={handleButtonClick} class="btn">Summarize</button>
                <div class="listening">
                    <br></br>
                    <span>
                       Listening:
                       {' '}
                       {listening ? 'On' : 'Off'}
                    </span>
                    <div>
                       <button type="button" class="bttn" onClick={resetTranscript}>Reset</button>
                       <button type="button" class="bttn" onClick={listenContinuously}>Listen</button>
                       <button type="button" class="bttn" onClick={SpeechRecognition.stopListening}>Stop</button>
                    </div>

                </div>
            </center>
                    <br></br>
                    <br></br>
                <p style={{textAlign: "left", marginLeft: "5px"}}>Powered by</p>
                <img id="logo" src={require('../public/cohere.png')} alt="cohere.png" title="Cohere"/>
            </div>
            
            <div class="column right"> <center>
                <img id="arrow" src={require('../public/arrow.png')} alt="arrow.png" title="arrow"/>
                <br></br>
                <p class="bolded">Summary</p>
                <img id="speaker" src={require('../public/speaker.png')} alt="speaker.png" title="speaker"/>   
                <script src="Vocalize.js"></script>
                <div class="wrapper">
                <div id = "printed">
                    <p id="text">{summary}</p>
                </div> 
                </div>
                <br></br>
                <div class="button">
                    <form action="#">
                        <button onClick={handleSummaryClick}class="btn">Read Text</button>
                    </form>
                </div>
            </center></div>
            
        </div>
        
        </>
    );
}