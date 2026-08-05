// Configuracion
var CONFIG = {
    finalDestination: 'https://drive.google.com/file/d/1ntL3wXfXNWuop2HTlUR1Y2ZI-IVx6exm/view?usp=sharing'
};

// Pasos con instrucciones y requisitos verificables
var STEPS = [
    {
        title: 'Paso 1 de 5',
        instruction: 'Haz clic en cualquier parte de la pagina',
        time: 8,
        icon: '\u{1F446}',
        requireClick: true
    },
    {
        title: 'Paso 2 de 5',
        instruction: 'Mantente en la pagina mientras se carga el anuncio',
        time: 10,
        icon: '\u{1F440}',
        requireActive: true
    },
    {
        title: 'Paso 3 de 5',
        instruction: 'Desplazate hacia abajo para revisar el contenido',
        time: 8,
        icon: '\u{1F4DC}',
        requireScroll: true
    },
    {
        title: 'Paso 4 de 5',
        instruction: 'Haz clic en el anuncio si te interesa y espera',
        time: 10,
        icon: '\u{1F5B1}\uFE0F',
        requireClick: true
    },
    {
        title: 'Paso 5 de 5',
        instruction: 'Ultimo paso! Espera unos segundos mas',
        time: 8,
        icon: '\u{2728}',
        requireActive: true
    }
];

// Estado
var currentStep = 0;
var timerInterval = null;
var timeLeft = STEPS[0].time;
var stepCompleted = false;
var hasClicked = false;
var hasScrolled = false;
var tabActive = true;

// Elementos del DOM
var stepLabel = document.getElementById('stepLabel');
var progressFill = document.getElementById('progressFill');
var timerText = document.getElementById('timerText');
var timerProgress = document.getElementById('timerProgress');
var timerInstruction = document.getElementById('timerInstruction');
var verifyButton = document.getElementById('verifyButton');
var buttonText = document.getElementById('buttonText');
var verifyContainer = document.getElementById('verifyContainer');

// Inicializar
function init() {
    setupListeners();
    updateUI();
    startStep();
}

// Event listeners
function setupListeners() {
    document.addEventListener('click', function () {
        if (!stepCompleted && STEPS[currentStep].requireClick && !hasClicked) {
            hasClicked = true;
            console.log('[Verification] Click registrado');
        }
    });

    window.addEventListener('scroll', function () {
        if (!stepCompleted && STEPS[currentStep].requireScroll && !hasScrolled) {
            hasScrolled = true;
            console.log('[Verification] Scroll registrado');
        }
    });

    document.addEventListener('visibilitychange', function () {
        tabActive = !document.hidden;
        if (document.hidden) {
            console.log('[Verification] Pestana inactiva - pausado');
        }
    });

    verifyButton.addEventListener('click', handleVerify);
}

// Actualizar interfaz
function updateUI() {
    var step = STEPS[currentStep];
    stepLabel.textContent = step.title;
    progressFill.style.width = (((currentStep + 1) / STEPS.length) * 100) + '%';
    document.title = step.title;
    timerInstruction.innerHTML = '<span class="step-icon">' + step.icon + '</span> ' + step.instruction;
}

// Iniciar paso
function startStep() {
    var step = STEPS[currentStep];
    stepCompleted = false;
    hasClicked = false;
    hasScrolled = false;
    timeLeft = step.time;
    timerText.textContent = timeLeft;

    var circumference = 2 * Math.PI * 45;
    timerProgress.style.strokeDasharray = circumference;
    timerProgress.style.strokeDashoffset = 0;

    verifyButton.disabled = true;
    buttonText.textContent = 'Esperando...';

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(function () {
        if (!tabActive) {
            buttonText.textContent = 'Vuelve a esta pestana...';
            return;
        }

        var blocked = false;
        if (step.requireClick && !hasClicked) {
            buttonText.textContent = 'Haz clic en la pagina...';
            blocked = true;
        } else if (step.requireScroll && !hasScrolled) {
            buttonText.textContent = 'Desplazate hacia abajo...';
            blocked = true;
        }

        if (blocked) return;

        timeLeft--;
        timerText.textContent = timeLeft;

        var progress = (step.time - timeLeft) / step.time;
        timerProgress.style.strokeDashoffset = circumference * progress;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            stepCompleted = true;
            verifyButton.disabled = false;
            buttonText.textContent = 'Continuar';
            timerText.textContent = '0';
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
