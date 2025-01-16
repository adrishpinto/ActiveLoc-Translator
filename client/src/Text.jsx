import React, { useState } from "react";
import axios from "axios";

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const handleTranslate = async () => {
    const endpoint =
      "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=fr";

    try {
      const response = await axios.post(endpoint, [{ Text: inputText }], {
        headers: {
          "Ocp-Apim-Subscription-Key":
            "A2SpkFHbfqpGK4e934wW3G1alyGxNXT3C0Qg6RiBAxkYZwCmboRrJQQJ99BAACGhslBXJ3w3AAAbACOGKRwU",
          "Ocp-Apim-Subscription-Region": "centralindia",
          "Content-Type": "application/json",
        },
      });

      const translated =
        response.data[0]?.translations[0]?.text || "Translation not found";
      setTranslatedText(translated);
    } catch (error) {
      console.error("Error translating text:", error);
      setTranslatedText("Error occurred while translating.");
    }
  };

  return (
    <div className="translator">
      <h2>Text Translator</h2>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to translate"
        rows="4"
        cols="50"
      ></textarea>
      <br />
      <button onClick={handleTranslate}>Translate</button>
      {translatedText && (
        <div>
          <h3>Translated Text:</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default Translator;
