const inputTextArea = document.getElementById('inputText');
const outputTextArea = document.getElementById('outputText');
const paraphraseBtn = document.getElementById('paraphraseBtn');

paraphraseBtn.addEventListener('click', async () => {
    const textToRewrite = inputTextArea.value.trim();
    if (!textToRewrite) return alert("Please enter some text!");

    paraphraseBtn.innerText = "Working...";
    paraphraseBtn.disabled = true;
    outputTextArea.value = "";

    try {
        const response = await fetch('/api/rewrite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ textToRewrite })
        });
        
        const result = await response.json();
        if (result.candidates) {
            outputTextArea.value = result.candidates[0].content.parts[0].text;
        } else {
            outputTextArea.value = "Error generating text.";
        }
    } catch (error) {
        outputTextArea.value = "Could not connect to the server.";
    } finally {
        paraphraseBtn.innerText = "Paraphrase";
        paraphraseBtn.disabled = false;
    }
});