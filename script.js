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
});