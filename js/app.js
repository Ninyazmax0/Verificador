// Configuracion
var CONFIG = {
    finalDestination: 'https://drive.google.com/file/d/1ntL3wXfXNWuop2HTlUR1Y2ZI-IVx6exm/view?usp=sharing',
    adUrl: 'https://ythestarsarequ.com?DcA5J=1454498',
    adTimeRequired: 10
};

// Pasos
var STEPS = [
    { title: 'Paso 1 de 5', instruction: 'Haz clic en el anuncio y espera 10 segundos', time: 10, icon: '\u{1F446}' },
    { title: 'Paso 2 de 5', instruction: 'Haz clic en el anuncio y espera 10 segundos', time: 10, icon: '\u{1F440}' },
    { title: 'Paso 3 de 5', instruction: 'Haz clic en el anuncio y espera 10 segundos', time: 10, icon: '\u{1F4DC}' },
    { title: 'Paso 4 de 5', instruction: 'Haz clic en el anuncio y espera 10 segundos', time: 10, icon: '\u{1F5B1}\uFE0F' },
    { title: 'Paso 5 de 5', instruction: 'Haz clic en el anuncio y espera 10 segundos', time: 10, icon: '\u{2728}' }
];

// Estado
var currentStep = 0;
var timerInterval = null;
var timeLeft = 10;
var stepCompleted = false;
var adOpened = false;
var adOpenTime = 0;
var waitingForAd = false;
var circumference = 2 * Math.PI * 45;

// DOM
var stepLabel = document.getElementById('stepLabel');
var progressFill = document.getElementById('progressFill');
var timerText = document.getElementById('timerText');
var timerProgress = document.getElementById('timerProgress');
var timerInstruction = document.getElementById('timerInstruction');
var verifyButton = document.getElementById('verifyButton');
var buttonText = document.getElementById('buttonText');
var verifyContainer = document.getElementById('verifyContainer');
var adLink = document.getElementById('adLink');
var adImage = document.getElementById('adImage');
var adStatus = document.getElementById('adStatus');

function init() {
    setupListeners();
    updateUI();
    startStep();
}

function setupListeners() {
    // Cuando el usuario vuelve de la pestana del anuncio
    document.addEventListener('visibilitychange', function () {
        if (stepCompleted || !waitingForAd) return;
        if (document.hidden) return;

        var elapsed = Math.floor((Date.now() - adOpenTime) / 1000);

        if (elapsed >= CONFIG.adTimeRequired) {
            adStatus.textContent = 'Verificado (' + elapsed + 's)';
            adStatus.style.color = '#00b894';
            adImage.style.opacity = '0.6';
            adLink.style.pointerEvents = 'none';
            waitingForAd = false;
            stepCompleted = true;
            document.title = STEPS[currentStep].title + ' - Continuar';
            verifyButton.disabled = false;
            buttonText.textContent = 'Continuar';
            timerText.textContent = '0';
            timerProgress.style.strokeDashoffset = circumference;
        } else {
            var falta = CONFIG.adTimeRequired - elapsed;
            adStatus.textContent = 'Faltan ' + falta + ' segundos... vuelve al anuncio';
            adStatus.style.color = '#e17055';
            waitingForAd = false;
            adOpened = false;
        }
    });

    // Click en el anuncio
    adLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (stepCompleted || waitingForAd) return;

        var win = window.open(CONFIG.adUrl, '_blank');
        if (!win) {
            adStatus.textContent = 'Permitir pop-ups para continuar';
            adStatus.style.color = '#e17055';
            return;
        }

        adOpened = true;
        adOpenTime = Date.now();
        waitingForAd = true;
        adStatus.textContent = 'Espera ' + CONFIG.adTimeRequired + ' segundos en el anuncio...';
        adStatus.style.color = '#6c757d';
        adImage.style.opacity = '1';

        // AHORA si empezar el timer de countdown
        timeLeft = CONFIG.adTimeRequired;
        timerText.textContent = timeLeft;
        timerProgress.style.strokeDashoffset = 0;

        startCountdown();

        verifyButton.disabled = true;
        buttonText.textContent = 'Esperando en el anuncio...';
    });

    verifyButton.addEventListener('click', handleVerify);
}

function startCountdown() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(function () {
        timeLeft--;
        timerText.textContent = timeLeft > 0 ? timeLeft : '0';
        document.title = 'Te quedan ' + timeLeft + ' segundos...';

        var progress = (CONFIG.adTimeRequired - timeLeft) / CONFIG.adTimeRequired;
        timerProgress.style.strokeDashoffset = circumference * progress;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.title = 'Volviendo...';
        }
    }, 1000);
}

function getRandomImage() {
    return 'https://picsum.photos/seed/' + currentStep + '-' + Date.now() + '/300/250';
}

function updateUI() {
    var step = STEPS[currentStep];
    stepLabel.textContent = step.title;
    progressFill.style.width = (((currentStep + 1) / STEPS.length) * 100) + '%';
    document.title = step.title;
    timerInstruction.innerHTML = '<span class="step-icon">' + step.icon + '</span> ' + step.instruction;
    adImage.src = getRandomImage();
    adStatus.textContent = 'Haz clic en la imagen de arriba';
    adStatus.style.color = '#6c757d';
    adImage.style.opacity = '1';
    adLink.style.pointerEvents = 'auto';
}

function startStep() {
    var step = STEPS[currentStep];
    stepCompleted = false;
    adOpened = false;
    adOpenTime = 0;
    waitingForAd = false;
    timeLeft = step.time;
    timerText.textContent = step.time;

    timerProgress.style.strokeDasharray = circumference;
    timerProgress.style.strokeDashoffset = 0;

    verifyButton.disabled = true;
    buttonText.textContent = 'Haz clic en el anuncio';

    if (timerInterval) clearInterval(timerInterval);

    // Cargar ad AdMaven de este paso
    if (typeof window.loadStepAds === 'function') {
        window.loadStepAds(currentStep);
    }
}

function handleVerify() {
    if (verifyButton.disabled) return;
    if (currentStep >= STEPS.length - 1) {
        showCompleted();
        return;
    }
    currentStep++;
    updateUI();
    startStep();
    verifyContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showCompleted() {
    document.title = 'Verificacion completada!';
    verifyContainer.innerHTML = [
        '<div class="completed">',
        '    <div class="completed-icon">',
        '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
        '            <path d="M9 12l2 2 4-4"></path>',
        '            <circle cx="12" cy="12" r="10"></circle>',
        '        </svg>',
        '    </div>',
        '    <h2>Verificacion completada!</h2>',
        '    <p>Seras redirigido al contenido en unos segundos...</p>',
        '</div>'
    ].join('\n');
    setTimeout(function () {
        window.location.href = CONFIG.finalDestination;
    }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
