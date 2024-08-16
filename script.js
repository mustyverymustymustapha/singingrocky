document.addEventListener('DOMContentLoaded', () => {
    const petRock = document.getElementById('pet-rock');
    const lyricsInput = document.getElementById('lyrics-input');
    const singButton = document.getElementById('sing-button');
    const lyricsDisplay = document.getElementById('lyrics-display');

    singButton.addEventListener('click', () => {
        const lyrics = lyricsInput.value;
        if (lyrics) {
            sing(lyrics);
        }
    });

    function sing(lyrics) {
        lyricsDisplay.textContent = '';
        petRock.classList.add('singing');

        let i = 0;
        const singInterval = setInterval(() => {
            if (i < lyrics.length) {
                lyricsDisplay.textContent += lyrics[i];
                i++;
            } else {
                clearInterval(singInterval);
                petRock.classList.remove('singing');
            }
        }, 100);
    }
});