/* =========================================================
   AVISOS DE ACESSIBILIDADE
   ========================================================= */

function announce(message) {

    const element =
        document.getElementById('aria-announce');

    if (element) {
        element.textContent = message;
    }
}


/* =========================================================
   1. MODO ALTO CONTRASTE
   ========================================================= */

function toggleContrast() {

    const html =
        document.documentElement;

    const button =
        document.getElementById('btn-contrast');

    const isContrast =
        html.getAttribute('data-theme') === 'contrast';


    if (isContrast) {

        html.setAttribute(
            'data-theme',
            'light'
        );

        button.setAttribute(
            'aria-pressed',
            'false'
        );

        announce(
            'Modo de alto contraste desativado.'
        );

    } else {

        html.setAttribute(
            'data-theme',
            'contrast'
        );

        button.setAttribute(
            'aria-pressed',
            'true'
        );

        announce(
            'Modo de alto contraste ativado.'
        );
    }
}


/* =========================================================
   2. TAMANHO DA FONTE
   ========================================================= */

let currentFontSize = 16;


function changeFontSize(delta) {

    currentFontSize =
        Math.min(
            24,
            Math.max(
                12,
                currentFontSize + (delta * 2)
            )
        );


    document.documentElement.style.fontSize =
        currentFontSize + 'px';


    announce(
        `Tamanho do texto ajustado para ${currentFontSize} pixels.`
    );
}


function resetFontSize() {

    currentFontSize = 16;

    document.documentElement.style.fontSize =
        '16px';

    announce(
        'Tamanho do texto restaurado para o padrão.'
    );
}


/* =========================================================
   3. SÍNTESE DE VOZ
   ========================================================= */

let isSpeaking = false;


function toggleTextToSpeech() {

    const button =
        document.getElementById('btn-tts');


    if (!('speechSynthesis' in window)) {

        alert(
            'Seu navegador não suporta a síntese de voz.'
        );

        return;
    }


    /* -----------------------------------------
       PARAR
       ----------------------------------------- */

    if (isSpeaking) {

        window.speechSynthesis.cancel();

        isSpeaking = false;

        button.setAttribute(
            'aria-pressed',
            'false'
        );


        button.innerHTML = `
            <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
            </svg>

            <span>Ouvir Página</span>
        `;


        announce(
            'Leitura de página cancelada.'
        );

        return;
    }


    /* -----------------------------------------
       INICIAR
       ----------------------------------------- */

    const content =
        document.getElementById('main-content');


    const text =
        content.innerText;


    const utterance =
        new SpeechSynthesisUtterance(text);


    utterance.lang =
        'pt-BR';

    utterance.rate =
        1.0;


    utterance.onend = () => {

        isSpeaking = false;

        button.setAttribute(
            'aria-pressed',
            'false'
        );


        button.innerHTML = `
            <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
            </svg>

            <span>Ouvir Página</span>
        `;
    };


    window.speechSynthesis.speak(
        utterance
    );


    isSpeaking = true;


    button.setAttribute(
        'aria-pressed',
        'true'
    );


    button.innerHTML =
        `<span>Parar Leitura</span>`;


    announce(
        'Iniciando leitura da página em voz alta.'
    );
}


/* =========================================================
   4. MODAL DAS DESCRIÇÕES
   ========================================================= */

function openAltModal(text) {

    document
        .getElementById('alt-modal-text')
        .textContent = text;


    document
        .getElementById('alt-modal')
        .classList
        .remove('hidden');
}


function closeAltModal() {

    document
        .getElementById('alt-modal')
        .classList
        .add('hidden');
}


/* =========================================================
   5. PODCAST
   ========================================================= */

const podcastAudio =
    document.getElementById(
        'meu-audio-podcast'
    );


/* ---------------------------------------------------------
   Formatação de tempo
   --------------------------------------------------------- */

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return '00:00';
    }


    const minutes =
        Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');


    const secondsFormatted =
        Math.floor(seconds % 60)
            .toString()
            .padStart(2, '0');


    return `${minutes}:${secondsFormatted}`;
}


/* ---------------------------------------------------------
   Eventos do áudio
   --------------------------------------------------------- */

if (podcastAudio) {


    /* Quando o áudio carrega */

    podcastAudio.addEventListener(
        'loadedmetadata',
        () => {

            const timeIndicator =
                document.getElementById(
                    'podcast-time-indicator'
                );


            if (timeIndicator) {

                timeIndicator.textContent =
                    `00:00 / ${formatTime(
                        podcastAudio.duration
                    )}`;
            }
        }
    );


    /* Enquanto o áudio toca */

    podcastAudio.addEventListener(
        'timeupdate',
        () => {

            const progressBar =
                document.getElementById(
                    'podcast-progress-bar'
                );


            const timeIndicator =
                document.getElementById(
                    'podcast-time-indicator'
                );


            if (!podcastAudio.duration) {
                return;
            }


            const percentage =
                (
                    podcastAudio.currentTime /
                    podcastAudio.duration
                ) * 100;


            if (progressBar) {

                progressBar.style.width =
                    percentage + '%';
            }


            if (timeIndicator) {

                timeIndicator.textContent =
                    `${formatTime(
                        podcastAudio.currentTime
                    )} / ${formatTime(
                        podcastAudio.duration
                    )}`;
            }
        }
    );


    /* Quando termina */

    podcastAudio.addEventListener(
        'ended',
        () => {

            const button =
                document.getElementById(
                    'btn-podcast-play'
                );


            const waveBars =
                document.querySelectorAll(
                    '#podcast-wave-container div'
                );


            if (button) {

                button.textContent =
                    'Ouvir Podcast';
            }


            waveBars.forEach(
                bar => {

                    bar.classList.remove(
                        'sound-wave-bar'
                    );
                }
            );
        }
    );
}


/* ---------------------------------------------------------
   Play / Pause
   --------------------------------------------------------- */

function togglePodcast() {

    const button =
        document.getElementById(
            'btn-podcast-play'
        );


    const waveBars =
        document.querySelectorAll(
            '#podcast-wave-container div'
        );


    if (!podcastAudio) {
        return;
    }


    /* PLAY */

    if (podcastAudio.paused) {

        podcastAudio
            .play()
            .then(() => {

                if (button) {

                    button.textContent =
                        'Pausar Podcast';
                }


                waveBars.forEach(
                    bar => {

                        bar.classList.add(
                            'sound-wave-bar'
                        );
                    }
                );

            })
            .catch(error => {

                alert(
                    'Não foi possível reproduzir o podcast. Verifique se o arquivo podcast.mp3 está dentro da pasta assets.'
                );

                console.error(
                    'Erro ao reproduzir podcast:',
                    error
                );
            });

    }


    /* PAUSE */

    else {

        podcastAudio.pause();


        if (button) {

            button.textContent =
                'Ouvir Podcast';
        }


        waveBars.forEach(
            bar => {

                bar.classList.remove(
                    'sound-wave-bar'
                );
            }
        );
    }
}


/* ---------------------------------------------------------
   Barra de progresso
   --------------------------------------------------------- */

function seekPodcast(event) {

    if (
        !podcastAudio ||
        !podcastAudio.duration
    ) {

        return;
    }


    const rectangle =
        event.currentTarget
            .getBoundingClientRect();


    const clickX =
        event.clientX -
        rectangle.left;


    const percentage =
        clickX /
        rectangle.width;


    podcastAudio.currentTime =
        percentage *
        podcastAudio.duration;
}