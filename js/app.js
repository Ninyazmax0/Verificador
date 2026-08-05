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
var adReturned = false;
var adReturnTime = 0;

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

// Inicializar
function init() {
    setupListeners();
    updateUI();
    startStep();
}

// Event listeners
function setupListeners() {
    document.addEventListener('visibilitychange', function () {
        if (adOpened && !adReturned && !document.hidden) {
            // El usuario volvio a la pestana
            adReturnTime = Date.now();
            adReturned = true;
            var elapsed = Math.floor((adReturnTime - adOpenTime) / 1000);
            if (elapsed >= CONFIG.adTimeRequired) {
                adStatus.textContent = 'Anuncio verificado (' + elapsed + 's)';
                adStatus.style.color = '#00b894';
                stepCompleted = true;
                verifyButton.disabled = false;
                buttonText.textContent = 'Continuar';
                if (timerInterval) clearInterval(timerInterval);
            } else {
                adStatus.textContent = 'Debes esperar ' + CONFIG.adTimeRequired + ' segundos en el anuncio';
                adStatus.style.color = '#e17055';
                adOpened = false;
                adReturned = false;
            }
        }
    });

    adLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (stepCompleted) return;

        // Abrir SmartLink en nueva pestana
        var win = window.open(CONFIG.adUrl, '_blank');
        if (!win) {
            adStatus.textContent = 'Permitir pop-ups para continuar';
            adStatus.style.color = '#e17055';
            return;
        }

        adOpened = true;
        adOpenTime = Date.now();
        adReturned = false;
        adStatus.textContent = 'Espera ' + CONFIG.adTimeRequired + ' segundos en el anuncio...';
        adStatus.style.color = '#6c757d';

        // Pausar timer principal
        if (timerInterval) clearInterval(timerInterval);

        // Timer de countdown mientras espera
        var waitLeft = CONFIG.adTimeRequired;
        timerText.textContent = waitLeft;

        timerInterval = setInterval(function () {
            if (adReturned) {
                clearInterval(timerInterval);
                return;
            }
            waitLeft--;
            timerText.textContent = waitLeft > 0 ? waitLeft : '0';
            var progress = (CONFIG.adTimeRequired - waitLeft) / CONFIG.adTimeRequired;
            timerProgress.style.strokeDashoffset = (2 * Math.PI * 45) * progress;

            if (waitLeft <= 0) {
                clearInterval(timerInterval);
                timerText.textContent = '0';
                // Si no ha vuelto, esperar
                adStatus.textContent = 'Volviendo...';
                adStatus.style.color = '#6c757d';
            }
        }, 1000);

        verifyButton.disabled = true;
        buttonText.textContent = 'Esperando en el anuncio...';
    });

    verifyButton.addEventListener('click', handleVerify);
}

// Generar imagen random
function getRandomImage() {
    var seed = currentStep + '-' + Date.now();
    return 'https://picsum.photos/seed/' + seed + '/300/250';
}

// Actualizar interfaz
function updateUI() {
    var step = STEPS[currentStep];
    stepLabel.textContent = step.title;
    progressFill.style.width = (((currentStep + 1) / STEPS.length) * 100) + '%';
    document.title = step.title;
    timerInstruction.innerHTML = '<span class="step-icon">' + step.icon + '</span> ' + step.instruction;

    // Cargar imagen random
    adImage.src = getRandomImage();
    adStatus.textContent = 'Haz clic en la imagen de arriba';
    adStatus.style.color = '#6c757d';
}

// Iniciar paso
function startStep() {
    var step = STEPS[currentStep];
    stepCompleted = false;
    adOpened = false;
    adOpenTime = 0;
    adReturned = false;
    adReturnTime = 0;
    timeLeft = step.time;
    timerText.textContent = timeLeft;

    var circumference = 2 * Math.PI * 45;
    timerProgress.style.strokeDasharray = circumference;
    timerProgress.style.strokeDashoffset = 0;

    verifyButton.disabled = true;
    buttonText.textContent = 'Esperando...';

    if (timerInterval) clearInterval(timerInterval);

    // Cargar anuncio AdMaven de este paso
    if (typeof window.loadStepAds === 'function') {
        window.loadStepAds(currentStep);
    }

    // Timer de respaldo (si no hace click en 30s, avanzar igual)
    var backupTime = 30;
    timerInterval = setInterval(function () {
        backupTime--;
        if (backupTime <= 0 && !stepCompleted) {
            clearInterval(timerInterval);
            stepCompleted = true;
            verifyButton.disabled = false;
            buttonText.textContent = 'Continuar';
        }
    }, 1000);
}

// Manejar continuar
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

// Completado
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
