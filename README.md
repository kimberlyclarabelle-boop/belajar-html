<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Portfolio AI — [Nama Kamu], peserta Workshop UPH">
    <title>AI Portfolio — [Nama Kamu]</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <header class="hero">
        <h1>Halo, saya <span class="accent">[Nama]</span></h1>
        <p class="subtitle">Siswa [SMA] · Workshop FAIDAS UPH, Mei 2026</p>
    </header>

    <main>
        <section id="about" class="card">
            <h2>Tentang Saya</h2>
            <p>[Ceritakan dirimu, minatmu, dan kenapa kamu ikut workshop ini]</p>
        </section>

        <section id="ai-demo" class="card">
            <h2>AI Demo: [Tema Datasetmu]</h2>
            <p class="hint">Arahkan kamera ke objek untuk klasifikasi real-time.</p>
            <button id="start-btn" class="btn-primary">Aktifkan Kamera</button>
            <div id="webcam-wrapper">
                <div id="webcam-container"></div>
                <div id="label-container"></div>
            </div>
        </section>

        <section id="gemini-chat" class="card">
            <h2>Tanya Gemini AI</h2>
            <div class="chat-input-row">
                <textarea id="prompt-input" placeholder="Tanyakan apa saja tentang [tema AI kamu]..." rows="3"></textarea>
                <button id="ask-btn" class="btn-primary">Kirim</button>
            </div>
            <div id="answer-box" class="answer-placeholder">
                Jawaban Gemini akan muncul di sini.
            </div>
        </section>
    </main>

    <footer>
        <p>© 2026 [Nama] · <a href="https://github.com/[username]/ai-portfolio" target="_blank">Source Code</a></p>
    </footer>

    <!-- Library AI dari CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
