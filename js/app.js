// Configuracion
const CONFIG = {
    finalDestination: 'https://drive.google.com/file/d/1ntL3wXfXNWuop2HTlUR1Y2ZI-IVx6exm/view?usp=sharing'
};

// Pasos con instrucciones diferentes
const STEPS = [
    {
        title: 'Paso 1 de 5',
        instruction: 'Haz clic en el anuncio de arriba y mantente en la pagina',
        time: 10,
        icon: '\u{1F446}',
        requireClick: true
    },
    {
        title: 'Paso 2 de 5',
        instruction: 'Explora el anuncio de la izquierda por 8 segundos',
        time: 8,
        icon: '\u{1F440}',
        requireHover: true
    },
    {
        title: 'Paso 3 de 5',
        instruction: 'Desplazate hacia abajo y revisa el contenido',
        time: 12,
        icon: '\u{1F4DC}',
        requireScroll: true
    },
    {
        title: 'Paso 4 de 5',
        instruction: 'Haz clic en cualquier anuncio que veas',
        time: 10,
        icon: '\u{1F5B1}\uFE0F',
        requireClick: true
    },
    {
        title: 'Paso 5 de 5',
        instruction: 'Ultimo paso! Espera unos segundos mas',
        time: 8,
        icon: '\u{2728}',
        requireClick: false
    }
];

// Estado actual
let currentStep = 0;
let timerInterval = null;
let timeLeft = STEPS[0].time;
let stepCompleted = false;
let hasClicked = false;
let hasScrolled = false;
let hasHovered = false;
let tabActive = true;

// Elementos del DOM
const stepLabel = document.getElementById('stepLabel');
const progressFill = document.getElementById('progressFill');
const timerText = document.getElementById('timerText');
const timerProgress = document.getElementById('timerProgress');
const verifyButton = document.getElementById('verifyButton');
const buttonText = document.getElementById('buttonText');
const verifyContainer = document.getElementById('verifyContainer');

// Detectar si hay anuncios reales (scripts de AdMaven)
function hasRealAds() {
    const scripts = document.querySelectorAll('script[src*="cloudfront.net"]');
    return scripts.length > 0;
}

// Inicializar
function init() {
    updateUI();
    setupListeners();
    startStep();
}

// Configurar event listeners
function setupListeners() {
    // Detectar clics en la pagina (en anuncios o contenido)
    document.addEventListener('click', (e) => {
        const step = STEPS[currentStep];
        if (!stepCompleted && step.requireClick) {
            // Si el clic es en un anuncio (iframe, ad slot, o link externo)
            const isAdClick = e.target.closest('.ad-slot') || 
                              e.target.closest('iframe') ||
                              e.target.closest('a[href]') && !e.target.closest('a[href]').href.includes(window.location.hostname);
            if (isAdClick) {
                hasClicked = true;
                console.log('[Verification] Ad click detected');
            }
        }
    });

    // Detectar scroll
    window.addEventListener('scroll', () => {
        if (!stepCompleted && STEPS[currentStep].requireScroll) {
            hasScrolled = true;
            console.log('[Verification] Scroll detected');
        }
    });

    // Detectar hover sobre anuncios
    document.addEventListener('mouseover', (e) => {
        if (!stepCompleted && STEPS[currentStep].requireHover) {
            const isAdArea = e.target.closest('.ad-slot') || e.target.closest('.sidebar');
            if (isAdArea) {
                hasHovered = true;
                console.log('[Verification] Hover on ad detected');
            }
        }
    });

    // Detectar si la pestana sigue activa
    document.addEventListener('visibilitychange', () => {
        tabActive = !document.hidden;
        if (document.hidden) {
            console.log('[Verification] Tab went inactive');
        }
    });

    // Verificar clic en boton continuar
    verifyButton.addEventListener('click', handleVerify);
}

// Iniciar paso actual
function startStep() {
    stepCompleted = false;
    hasClicked = false;
    hasScrolled = false;
    hasHovered = false;

    const step = STEPS[currentStep];
    timeLeft = step.time;
    timerText.textContent = timeLeft;

    // Calcular circunferencia del circulo
    const circumference = 2 * Math.PI * 45;
    timerProgress.style.strokeDasharray = circumference;
    timerProgress.style.strokeDashoffset = 0;

    // Deshabilitar boton
    verifyButton.disabled = true;
    buttonText.textContent = 'Esperando...';

    // Limpiar intervalo anterior
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Iniciar countdown
    timerInterval = setInterval(() => {
        // Verificar si la pestana esta activa
        if (!tabActive) {
            console.log('[Verification] Waiting for tab to be active...');
            return;
        }

        // Verificar requisitos del paso antes de decrementar
        let canProgress = true;

        if (step.requireClick && !hasClicked) {
            canProgress = false;
            timerText.textContent = timeLeft;
            buttonText.textContent = 'Haz clic en un anuncio...';
            return;
        }

        if (step.requireScroll && !hasScrolled) {
            canProgress = false;
            timerText.textContent = timeLeft;
            buttonText.textContent = 'Desplazate hacia abajo...';
            return;
        }

        if (step.requireHover && !hasHovered) {
            canProgress = false;
            timerText.textContent = timeLeft;
            buttonText.textContent = 'Pasa el mouse sobre el anuncio...';
            return;
        }

        timeLeft--;
        timerText.textContent = timeLeft;

        // Actualizar circulo de progreso
        const progress = (step.time - timeLeft) / step.time;
        const offset = circumference * progress;
        timerProgress.style.strokeDashoffset = offset;

        // Cuando termine el tiempo
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            verifyButton.disabled = false;
            buttonText.textContent = 'Continuar';
            timerText.textContent = '0';
            stepCompleted = true;
        }
    }, 1000);
}

// Actualizar interfaz
function updateUI() {
    const step = STEPS[currentStep];

    // Actualizar label del paso
    stepLabel.textContent = step.title;

    // Actualizar barra de progreso
    const progress = ((currentStep + 1) / STEPS.length) * 100;
    progressFill.style.width = `${progress}%`;

    // Actualizar titulo de la pagina
    document.title = step.title;

    // Actualizar instruccion
    const instructionEl = document.querySelector('.timer-instruction');
    if (instructionEl) {
        instructionEl.innerHTML = `<span class="step-icon">${step.icon}</span> ${step.instruction}`;
    }
}

// Manejar clic en verificar
function handleVerify() {
    if (verifyButton.disabled) return;

    // Si es el ultimo paso, redirigir
    if (currentStep >= STEPS.length - 1) {
        showCompleted();
        return;
    }

    // Avanzar al siguiente paso
    currentStep++;

    // Actualizar UI y reiniciar timer
    updateUI();
    startStep();

    // Scroll al inicio del contenedor de verificacion
    verifyContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Forzar recarga de ads
    reloadAds();
}

// Recargar ads
function reloadAds() {
    console.log(`[Step ${currentStep + 1}] Recargando ads...`);

    // Recargar todos los ad slots
    const adSlots = document.querySelectorAll('.ad-slot');
    adSlots.forEach((slot) => {
        slot.style.animation = 'none';
        slot.offsetHeight; // Trigger reflow
        slot.style.animation = 'pulse 0.5s';
    });
}

// Mostrar pantalla de completado
function showCompleted() {
    // Actualizar titulo
    document.title = 'Verificacion completada!';

    // Crear contenido de completado
    verifyContainer.innerHTML = `
        <div class="completed">
            <div class="completed-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
            </div>
            <h2>Verificacion completada!</h2>
            <p>Seras redirigido al contenido en unos segundos...</p>
        </div>
    `;

    // Redirigir despues de 3 segundos
    setTimeout(() => {
        window.location.href = CONFIG.finalDestination;
    }, 3000);
}

// Iniciar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', init);
