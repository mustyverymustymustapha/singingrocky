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
    const rockSelector = document.getElementById('rock-selector');
    const newRockButton = document.getElementById('new-rock');
    const deleteRockButton = document.getElementById('delete-rock');
    const rockNameInput = document.getElementById('rock-name-input');
    const saveNameButton = document.getElementById('save-name');
    const skinCanvas = document.getElementById('skin-canvas');
    const skinColor = document.getElementById('skin-color');
    const brushSize = document.getElementById('brush-size');
    const clearSkinButton = document.getElementById('clear-skin');
    const saveSkinButton = document.getElementById('save-skin');
    const skinSelector = document.getElementById('skin-selector');
    const applySkinButton = document.getElementById('apply-skin');
    const generateQRButton = document.getElementById('generate-qr');
    const qrcodeDiv = document.getElementById('qrcode');
    const qrInput = document.getElementById('qr-input');
    const scanQRButton = document.getElementById('scan-qr');
    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;
    let audioUrl;
    let audioContext;
    let analyser;
    let rocks = [];
    let currentRock = null;
    let skins = [];
    let isDrawing = false;
    function Rock(name, color, hasSunglasses, hasHat, skin) {
        this.name = name;
        this.color = color;
        this.hasSunglasses = hasSunglasses;
        this.hasHat = hasHat;
        this.skin = skin;
    }
    function createNewRock() {
        const newRock = new Rock(`Rock ${rocks.length + 1}`, '#808080', false, false, null);
        rocks.push(newRock);
        updateRockSelector();
        setCurrentRock(rocks.length - 1);
    }
    function updateRockSelector() {
        rockSelector.innerHTML = '';
        rocks.forEach((rock, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = rock.name;
            rockSelector.appendChild(option);
        });
    }
    function setCurrentRock(index) {
        currentRock = rocks[index];
        rockSelector.value = index;
        updateRockDisplay();
    }
    function updateRockDisplay() {
        rockNameInput.value = currentRock.name;
        petRock.style.backgroundColor = currentRock.color;
        rockColor.value = currentRock.color;
        sunglasses.style.display = currentRock.hasSunglasses ? 'block' : 'none';
        hat.style.display = currentRock.hasHat ? 'block' : 'none';
        if (currentRock.skin) {
            applyCustomSkin(currentRock.skin);
        } else {
            clearCustomSkin();
        }
    }
    rockSelector.addEventListener('change', (e) => {
        setCurrentRock(e.target.value);
    });
    newRockButton.addEventListener('click', createNewRock);
    deleteRockButton.addEventListener('click', () => {
        if (rocks.length > 1) {
            rocks.splice(rockSelector.value, 1);
            updateRockSelector();
            setCurrentRock(0);
        }
    });
    saveNameButton.addEventListener('click', () => {
        currentRock.name = rockNameInput.value;
        updateRockSelector();
    });
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
        currentRock.color = e.target.value;
        petRock.style.backgroundColor = e.target.value;
    });
    toggleSunglasses.addEventListener('click', () => {
        currentRock.hasSunglasses = !currentRock.hasSunglasses;
        sunglasses.style.display = currentRock.hasSunglasses ? 'block' : 'none';
    });
    toggleHat.addEventListener('click', () => {
        currentRock.hasHat = !currentRock.hasHat;
        hat.style.display = currentRock.hasHat ? 'block' : 'none';
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
    const ctx = skinCanvas.getContext('2d');
    skinCanvas.addEventListener('mousedown', startDrawing);
    skinCanvas.addEventListener('mousemove', draw);
    skinCanvas.addEventListener('mouseup', stopDrawing);
    skinCanvas.addEventListener('mouseout', stopDrawing);
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }
    function draw(e) {
        if (!isDrawing) return;
        ctx.lineWidth = brushSize.value;
        ctx.lineCap = 'round';
        ctx.strokeStyle = skinColor.value;
        ctx.lineTo(e.clientX - skinCanvas.offsetLeft, e.clientY - skinCanvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - skinCanvas.offsetLeft, e.clientY - skinCanvas.offsetTop);
    }
    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }
    clearSkinButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, skinCanvas.width, skinCanvas.height);
    });
    saveSkinButton.addEventListener('click', () => {
        const skinName = prompt('Enter a name for this skin:');
        if (skinName) {
            const skinData = skinCanvas.toDataURL();
            skins.push({ name: skinName, data: skinData });
            updateSkinSelector();
        }
    });
    function updateSkinSelector() {
        skinSelector.innerHTML = '<option value="">Select a skin</option>';
        skins.forEach((skin, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = skin.name;
            skinSelector.appendChild(option);
        });
    }
    applySkinButton.addEventListener('click', () => {
        const selectedSkinIndex = skinSelector.value;
        if (selectedSkinIndex !== '') {
            const selectedSkin = skins[selectedSkinIndex];
            currentRock.skin = selectedSkin.data;
            applyCustomSkin(selectedSkin.data);
        }
    });
    function applyCustomSkin(skinData) {
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, skinCanvas.width, skinCanvas.height);
            ctx.drawImage(img, 0, 0);
            petRock.style.backgroundImage = `url(${skinData})`;
        };
        img.src = skinData;
    }
    function clearCustomSkin() {
        petRock.style.backgroundImage = 'none';
    }
    generateQRButton.addEventListener('click', () => {
        const rockData = JSON.stringify(currentRock);
        qrcodeDiv.innerHTML = '';
        new QRCode(qrcodeDiv, {
            text: rockData,
            width: 128,
            height: 128
        });
    });
    scanQRButton.addEventListener('click', () => {
        qrInput.click();
    });
    qrInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        try {
                            const rockData = JSON.parse(code.data);
                            const newRock = new Rock(rockData.name, rockData.color, rockData.hasSunglasses, rockData.hasHat, rockData.skin);
                            rocks.push(newRock);
                            updateRockSelector();
                            setCurrentRock(rocks.length - 1);
                        } catch (error) {
                            console.error('Invalid QR code data:', error);
                        }
                    } else {
                        console.error('No QR code found in the image');
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    createNewRock();
});