document.addEventListener('DOMContentLoaded', () => {
    const petRock = document.getElementById('pet-rock');
    const lyricsInput = document.getElementById('lyrics-input');
    const singButton = document.getElementById('sing-button');
    const lyricsDisplay = document.getElementById('lyrics-display');
    const eyes = document.querySelectorAll('.eye');
    const rockColor = document.getElementById('rock-color');
    const toggleSunglasses = document.getElementById('toggle-sunglasses');
    const toggleHat = document.getElementById('toggle-hat');
    const sunglasses = document.getElementById('sunglasses');
    const hat = document.getElementById('hat');
    const recordButton = document.getElementById('record-button');
    const playButton = document.getElementById('play-button');
    const visualizer = document.getElementById('visualizer');
    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;
    let audioUrl;
    let audioContext;
    let analyser;
    singButton.addEventListener('click', () => {
        const lyrics = lyricsInput.value;
        if (lyrics) {
            sing(lyrics);
        }
    });
    function sing(lyrics) {
        lyricsDisplay.textContent = '';
        petRock.classList.add('singing');
        petRock.classList.add('bouncing');
        let i = 0;
        const singInterval = setInterval(() => {
            if (i < lyrics.length) {
                lyricsDisplay.textContent += lyrics[i];
                changeBackgroundColor();
                i++;
            } else {
                clearInterval(singInterval);
                petRock.classList.remove('singing');
                petRock.classList.remove('bouncing');
            }
        }, 100);
        startBlinking();
    }
    function changeBackgroundColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        document.body.style.backgroundColor = `rgb(${r},${g},${b})`;
    }
    function startBlinking() {
        const blinkInterval = setInterval(() => {
            if (petRock.classList.contains('singing')) {
                blink();
            } else {
                clearInterval(blinkInterval);
            }
        }, Math.random() * 2000 + 1000);
    }
    function blink() {
        eyes.forEach(eye => eye.classList.add('blink'));
        setTimeout(() => {
            eyes.forEach(eye => eye.classList.remove('blink'));
        }, 100);
    }
    rockColor.addEventListener('input', (e) => {
        petRock.style.backgroundColor = e.target.value;
    });
    toggleSunglasses.addEventListener('click', () => {
        sunglasses.style.display = sunglasses.style.display === 'none' ? 'block' : 'none';
    });
    toggleHat.addEventListener('click', () => {
        hat.style.display = hat.style.display === 'none' ? 'block' : 'none';
    });
    recordButton.addEventListener('click', toggleRecording);
    playButton.addEventListener('click', playRecording);
    function toggleRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            recordButton.textContent = 'Record';
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    audioChunks = [];
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = (e) => {
                        audioChunks.push(e.data);
                    };
                    mediaRecorder.onstop = () => {
                        audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        audioUrl = URL.createObjectURL(audioBlob);
                        playButton.disabled = false;
                    };
                    mediaRecorder.start();
                    recordButton.textContent = 'Stop Recording';
                })
                .catch(error => console.error('Error accessing microphone:', error));
        }
    }
    function playRecording() {
        const audio = new Audio(audioUrl);
        audio.play();
        visualizeAudio(audio);
    }
    function visualizeAudio(audio) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
        }
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const ctx = visualizer.getContext('2d');
        const width = visualizer.width;
        const height = visualizer.height;
        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, width, height);
            const barWidth = (width / bufferLength) * 2.5;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2;
                ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        }
        draw();
    }
});