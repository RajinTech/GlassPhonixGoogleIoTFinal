import React, { Component } from "react";
import PropTypes from "prop-types";
import SpeechRecognition from "react-speech-recognition";
import Glassphonix from './containers/Glassphonix'
const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  startListening: PropTypes.func,
  stopListening: PropTypes.func,
  finalTranscript: PropTypes.string,
  listening: PropTypes.bool,
  browserSupportsSpeechRecognition: PropTypes.bool
};

const options = {
  autoStart: false,
}

const Dictaphone = ({
  transcript,
  resetTranscript,
  startListening,
  stopListening,
  interimTranscript,
  finalTranscript,
  listening,
  browserSupportsSpeechRecognition
}) => {
  if (!browserSupportsSpeechRecognition) {
    return null;
  }


  return (
    <div>
    <Glassphonix
    transcript={transcript}
    resetTranscript={resetTranscript}
    startListening={startListening}
    stopListening={stopListening}
    interimTranscript={interimTranscript}
    finalTranscript={finalTranscript}
    listening={listening}
    />
</div>
  );
};

Dictaphone.propTypes = propTypes;

export default SpeechRecognition(options)(Dictaphone);
