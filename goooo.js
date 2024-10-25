// Initialize variables to store API keys
let geminiKey = "";
let stableDiffusionKey = "";

// Function to fetch the API keys from a backend or a local JSON (simulate if needed)
async function fetchApiKeys() {
    try {
        // Replace with your backend API endpoint or use a local JSON file
        const response = await fetch('http://localhost:5000/api/keys'); 
        const data = await response.json();
        geminiKey = data.gemini;
        stableDiffusionKey = data.stableDiffusion;
        console.log("API keys fetched successfully! 🔥");
    } catch (error) {
        console.error("Failed to fetch API keys:", error);
    }
}

// Call this function to load keys when the page is ready
window.onload = fetchApiKeys;

// Function to generate text using Gemini API
async function generateText() {
    const prompt = document.getElementById('textPrompt').value;
    const output = document.getElementById('textOutput'); // Fixed typo in 'textOutput'
    output.innerHTML = '<div class="spinner"></div>'; // Show spinner while loading
    textOutput.scrollTop = textOutput.scrollHeight;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Fixed Content-Type
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            output.innerHTML = `<p>${data.candidates[0].content.parts[0].text}</p>`;
        } else {
            throw new Error('Unexpected API response structure');
        }
    } catch (error) {
        output.innerHTML = `<p>Error: ${error.message}</p>`;
        console.error('Text generation error:', error);
    }
}

// Function to generate image using Stable Diffusion API
async function generateImage() {
    const prompt = document.getElementById('imagePrompt').value;
    const output = document.getElementById('imageOutput');
    output.innerHTML = '<div class="spinner"></div>'; // Show spinner while loading

    try {
        const response = await fetch(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2?key=${stableDiffusionKey}',
            {
                method: 'POST',
                headers: {
                    
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) throw new Error('Failed to generate image.');

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        output.innerHTML = `<img src="${imageUrl}" alt="Generated Image" style="max-width:100%;">`;
    } catch (error) {
        output.innerHTML = `<p>Error: ${error.message}</p>`;
        console.error('Image generation error:', error);
    }
}

// Add loading spinner CSS
const style = document.createElement('style');
style.textContent = `
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);