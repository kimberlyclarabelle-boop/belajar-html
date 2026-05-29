// DOM manipulation dasar 
// Ambil elemen berdasarkan id 
const btn = document.getElementById("start-btn"); 
const container = document.getElementById("result"); 
// Ubah konten teks 
container.textContent = "Sedang memproses..."; 
// Ubah HTML (hati-hati XSS jika dari user input) 
container.innerHTML = "<strong>Selesai!</strong>"; 
// Ubah style 
btn.style.backgroundColor = "#48bb78"; 
btn.style.display = "none"; // sembunyikan 
// Tambahkan event listener 
btn.addEventListener("click", async () => { 
  // kode yang jalan saat tombol diklik 
}); 


// Buat elemen baru dan tambahkan ke DOM 
const div = document.createElement('div'); 
div.textContent = "Item baru"; 
container.appendChild(div);


// KONFIGURASI 
// CONFIGURATION
const TM_MODEL_URL = "https://teachablemachine.withgoogle.com/models/JhKVVWMMK/"; 

// STATE — Variabel global diisi tanpa menulis ulang kata 'const' atau 'let' di dalam fungsi
let model; 
let webcam; 
let labelContainer; 
let maxPredictions; 
let isRunning = false; 

// TEACHABLE MACHINE: INITIALIZATION
async function initTeachableMachine() { 
  const btn = document.getElementById('start-btn'); 
  btn.textContent = 'Memuat model...'; 
  btn.disabled = true; 

  try { 
    const modelURL = TM_MODEL_URL + "model.json";
    const metadataURL = TM_MODEL_URL + "metadata.json";
    
    // Perbaikan: Isi variabel global, JANGAN pakai const/let lagi di sini
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses(); 

    // Setup webcam
    webcam = new tmImage.Webcam(200, 200, true);
    await webcam.setup(); // Minta izin kamera
    await webcam.play();

    // Tambahkan canvas webcam ke DOM
    const webcamContainer = document.getElementById('webcam-container');
    webcamContainer.innerHTML = ''; // Bersihkan container dulu
    webcamContainer.appendChild(webcam.canvas); 

    // Siapkan container untuk label prediksi 
    labelContainer = document.getElementById('label-container'); 
    labelContainer.innerHTML = ''; 
    for (let i = 0; i < maxPredictions; i++) { 
      const div = document.createElement('div'); 
      labelContainer.appendChild(div); 
    } 

    btn.textContent = 'Kamera aktif ✓'; 
    btn.style.background = '#48bb78'; 
    isRunning = true; 

    // Mulai loop prediksi 
    window.requestAnimationFrame(predictionLoop); 

  } catch (err) { 
    btn.textContent = 'Gagal memuat — coba lagi'; 
    btn.disabled = false; 
    console.error('TM Error:', err); 
  } 
} 

// TEACHABLE MACHINE: PREDICTION LOOP 
async function predictionLoop() { 
  if (!isRunning) return; 
  
  webcam.update(); // Ambil frame terbaru
  
  // Perbaikan: deteksi menggunakan variabel global 'model' yang sudah terisi
  const predictions = await model.predict(webcam.canvas);
  
  // Update tampilan label
  for (let i = 0; i < maxPredictions; i++) { 
    const pct = (predictions[i].probability * 100).toFixed(1); 
    const name = predictions[i].className; 

    labelContainer.childNodes[i].innerHTML = `
      <div style='display:flex;justify-content:space-between;margin-bottom:4px;'> 
          <span>${name}</span> 
          <strong>${pct}%</strong> 
      </div> 
      <div style='background:#e2e8f0;border-radius:4px;height:6px;'> 
           <div style='background:#667eea;width:${pct}%;height:100%;border-radius:4px;transition:width 0.1s'></div> 
      </div>`; 
  } 

  window.requestAnimationFrame(predictionLoop); 
} 

// Bind tombol TM
document.getElementById('start-btn').addEventListener('click', initTeachableMachine);


// GEMINI API: FUNGSI UTAMA (Lewat Backend Sendiri)
async function askGemini() { 
  const promptInput = document.getElementById('prompt-input'); 
  const answerBox = document.getElementById('answer-box');
  const askBtn = document.getElementById('ask-btn'); 
  const prompt = promptInput.value.trim(); 

  if (!prompt) { 
    answerBox.textContent = 'Tuliskan pertanyaanmu dulu!'; 
    return; 
  } 

  answerBox.textContent = 'Gemini sedang berpikir...'; 
  askBtn.disabled = true; 

  // Tembak ke API Server lokal kita sendiri (server.js)
  const endpoint = "http://localhost:3000/ask";

  const payload = { 
    contents: [{ 
        parts: [{ text: prompt }] 
    }], 
    generationConfig: { 
        temperature: 0.7, 
        maxOutputTokens: 512 
    } 
  }; 

  try { 
    const response = await fetch(endpoint, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload) 
    }); 

    if (!response.ok) { 
      const errData = await response.json(); 
      throw new Error(`API Error ${response.status}: ${errData.error?.message ?? 'Unknown error'}`);
    } 

    const data = await response.json(); 
    
    // Struktur navigasi JSON Gemini resmi
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text; 
    answerBox.textContent = answer ?? 'Tidak ada jawaban.'; 

  } catch (err) { 
    if (err.message.includes('Failed to fetch')) { 
      answerBox.textContent = 'Tidak bisa terhubung ke backend server (Pastikan server.js sudah jalan!).'; 
    } else { 
      answerBox.textContent = 'Error: ' + err.message; 
    } 
    console.error('Gemini Error:', err); 
  } finally { 
    askBtn.disabled = false; 
  } 
} 

// Bind tombol Gemini
document.getElementById('ask-btn').addEventListener('click', askGemini); 

// Kirim dengan Enter 
document.getElementById('prompt-input').addEventListener('keydown', (e) => { 
  if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      askGemini(); 
  } 
});

