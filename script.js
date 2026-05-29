const inputTextArea = document.getElementById('inputText');
const outputTextArea = document.getElementById('outputText');
const paraphraseBtn = document.getElementById('paraphraseBtn');

paraphraseBtn.addEventListener('click', async () => {
    const textToRewrite = inputTextArea.value.trim();

    if (!textToRewrite) {
        alert("Please enter some text to paraphrase!");
        return;
    }

    paraphraseBtn.innerText = "Working...";
    paraphraseBtn.disabled = true;
    outputTextArea.value = "";

    try {
        const response = await fetch('/api/rewrite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ textToRewrite: textToRewrite })
        });

        const result = await response.json();

        if (response.ok && result.candidates && result.candidates.length > 0) {
            outputTextArea.value = result.candidates[0].content.parts[0].text;
        } else {
            outputTextArea.value = "Error: " + (result.error || "Something went wrong.");
            console.error("Full error:", result);
        }

    } catch (error) {
        console.error("Connection Error:", error);
        outputTextArea.value = "Could not connect to the backend server.";
    } finally {
        paraphraseBtn.innerText = "Paraphrase";
        paraphraseBtn.disabled = false;
    }
});
