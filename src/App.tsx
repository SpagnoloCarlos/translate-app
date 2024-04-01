import { useState } from "react";
import "./App.css";
import logo from "./assets/images/logos/logo.svg";
import ArrowDrop from "./components/ArrowDrop/ArrowDrop";
import TextArea from "./components/TextArea/TextArea";
import Sound from "./components/Sound/Sound";
import Copy from "./components/Copy/Copy";
import Translate from "./components/Translate/Translate";
import Change from "./components/Change/Change";

function App() {
  const [selectedIn, setSelectedIn] = useState("en");
  const [selectedOut, setSelectedOut] = useState("fr");
  const [entryValue, setEntryValue] = useState("");
  const [outputValue, setOutPutValue] = useState("");

  const handleSelectInLanguage = (opt: string) => {
    setSelectedIn(opt);
  };

  const handleSelectOutLanguage = (opt: string) => {
    setSelectedOut(opt);
  };

  const handleChange = (e: any) => {
    const value = e.currentTarget.value;
    if (value?.length <= 500) {
      setEntryValue(value);
    }
    if (!value) {
      setOutPutValue("");
    }
  };

  const handleCopy = async (entry: boolean) => {
    try {
      await navigator.clipboard.writeText(entry ? entryValue : outputValue);
      console.log("¡Texto copiado al portapapeles!");
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
    }
  };

  const handleSpeech = (entry: boolean) => {
    const utterance = new SpeechSynthesisUtterance(
      entry ? entryValue : outputValue
    );
    // Configurar la voz
    utterance.voice = speechSynthesis.getVoices()[0]; // Selecciona la primera voz disponible
    // Configurar la velocidad
    utterance.rate = 1; // Velocidad normal
    // Configurar el tono
    utterance.pitch = 1; // Tono normal
    // Configurar el volumen
    utterance.volume = 1; // Volumen normal
    speechSynthesis.speak(utterance);
  };

  const handleTranslate = () => {
    if (entryValue) {
      const query = JSON.parse(JSON.stringify(entryValue));
      const langPair = `${selectedIn}|${selectedOut}`;
      fetch(
        `https://api.mymemory.translated.net/get?q=${query}&langpair=${langPair}`
      )
        .then((response) => response.json())
        .then((data) => {
          const out = data?.responseData?.translatedText;
          setOutPutValue(out);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setOutPutValue("");
    }
  };

  const handleInvert = () => {
    const entry = entryValue;
    const out = outputValue;
    const selectEntry = selectedIn;
    const selectOut = selectedOut;

    setEntryValue(out);
    setOutPutValue(entry);
    setSelectedIn(selectOut);
    setSelectedOut(selectEntry);
  };

  return (
    <main className="main">
      <img src={logo} alt="Translated.io" />
      <div className="container">
        <div className="translate-box box-in">
          <header className="box-header">
            <ul>
              <li className={selectedIn === "detect" ? "selected" : ""}>
                Detect Language
              </li>
              <li
                className={selectedIn === "en" ? "selected" : ""}
                onClick={() => handleSelectInLanguage("en")}
              >
                English
              </li>
              <li
                className={selectedIn === "fr" ? "selected" : ""}
                onClick={() => handleSelectInLanguage("fr")}
              >
                French
              </li>
              <li
                className={selectedIn === "es" ? "selected" : ""}
                onClick={() => handleSelectInLanguage("es")}
              >
                Spanish <ArrowDrop />
              </li>
            </ul>
          </header>
          <TextArea entry value={entryValue} handleChange={handleChange} />
          <footer className="box-footer">
            <div className="actions">
              <div className="icon-action" onClick={() => handleSpeech(true)}>
                <Sound />
              </div>
              <div className="icon-action" onClick={() => handleCopy(true)}>
                <Copy />
              </div>
            </div>
            <button
              className="translate-btn"
              type="button"
              onClick={handleTranslate}
            >
              <Translate /> Translate
            </button>
          </footer>
        </div>
        <div className="translate-box box-out">
          <header className="box-header">
            <ul>
              <li
                className={selectedOut === "en" ? "selected" : ""}
                onClick={() => handleSelectOutLanguage("en")}
              >
                English
              </li>
              <li
                className={selectedOut === "fr" ? "selected" : ""}
                onClick={() => handleSelectOutLanguage("fr")}
              >
                French
              </li>
              <li
                className={selectedOut === "es" ? "selected" : ""}
                onClick={() => handleSelectOutLanguage("es")}
              >
                Spanish <ArrowDrop />
              </li>
            </ul>
            <div className="icon-action" onClick={handleInvert}>
              <Change />
            </div>
          </header>
          <TextArea output value={outputValue} handleChange={handleChange} />
          <footer className="box-footer">
            <div className="actions">
              <div className="icon-action" onClick={() => handleSpeech(false)}>
                <Sound />
              </div>
              <div className="icon-action" onClick={() => handleCopy(false)}>
                <Copy />
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

export default App;
