// Configuración
const CONFIG = {
    finalDestination: 'https://drive.google.com/file/d/1ntL3wXfXNWuop2HTlUR1Y2ZI-IVx6exm/view?usp=sharing'
};

// Pasos con instrucciones diferentes
const STEPS = [
    {
        title: 'Paso 1 de 5',
        instruction: 'Haz clic en el anuncio de arriba y mantente en la página',
        time: 10,
        icon: '👆'
    },
    {
        title: 'Paso 2 de 5',
        instruction: 'Explora el anuncio de la izquierda por 8 segundos',
        time: 8,
        icon: '👀'
    },
    {
        title: 'Paso 3 de 5',
        instruction: 'Desplázate hacia abajo y revisa el contenido',
        time: 12,
        icon: '📜'
    },
    {
        title: 'Paso 4 de 5',
        instruction: 'Haz clic en cualquier anuncio que veas',
        time: 10,
        icon: '🖱️'
    },
    {
        title: 'Paso 5 de 5',
        instruction: '¡Último paso! Espera unos segundos más',
        time: 8,
        icon: '✨'
    }
];

// Estado actual
let currentStep = 0;
let timerInterval = null;
let timeLeft = STEPS[0].time;

// Elementos del DOM
const stepLabel = document.getElementById('stepLabel');
const progressFill = document.getElementById('progressFill');
const timerText = document.getElementById('timerText');
const timerProgress = document.getElementById('timerProgress');
const verifyButton = document.getElementById('verifyButton');
const buttonText = document.getElementById('buttonText');
const verifyContainer = document.getElementById('verifyContainer');

// Inicializar
function init() {
    updateUI();
    startTimer();
    
    verifyButton.addEventListener('click', handleVerify);
}

// Actualizar interfaz
function updateUI() {
    const step = STEPS[currentStep];
    
    // Actualizar label del paso
    stepLabel.textContent = step.title;
    
    // Actualizar barra de progreso
    const progress = ((currentStep + 1) / STEPS.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Actualizar título de la página
    document.title = step.title;
    
    // Actualizar instrucción
    const instructionEl = document.querySelector('.timer-instruction');
    if (instructionEl) {
        instructionEl.innerHTML = `<span class="step-icon">${step.icon}</span> ${step.instruction}`;
    }
}

// Iniciar temporizador
function startTimer() {
    const step = STEPS[currentStep];
    timeLeft = step.time;
    timerText.textContent = timeLeft;
    
    // Calcular circunferencia del círculo
    const circumference = 2 * Math.PI * 45; // radio = 45
    timerProgress.style.strokeDasharray = circumference;
    timerProgress.style.strokeDashoffset = 0;
    
    // Deshabilitar botón
    verifyButton.disabled = true;
    buttonText.textContent = 'Esperando...';
    
    // Limpiar intervalo anterior
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Iniciar countdown
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        
        // Actualizar círculo de progreso
        const progress = (step.time - timeLeft) / step.time;
        const offset = circumference * progress;
        timerProgress.style.strokeDashoffset = offset;
        
        // Cuando termine el tiempo
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            verifyButton.disabled = false;
            buttonText.textContent = 'Continuar';
            timerText.textContent = '0';
        }
    }, 1000);
}

// Manejar clic en verificar
function handleVerify() {
    if (verifyButton.disabled) return;
    
    // Si es el último paso, redirigir
    if (currentStep >= STEPS.length - 1) {
        showCompleted();
        return;
    }
    
    // Avanzar al siguiente paso
    currentStep++;
    
    // Actualizar UI y reiniciar timer
    updateUI();
    startTimer();
    
    // Scroll al inicio del contenedor de verificación
    verifyContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Forzar recarga de ads
    reloadAds();
}

// Recargar ads (simula recarga de página)
function reloadAds() {
    console.log(`[Step ${currentStep + 1}] Recargando ads...`);
    
    // Recargar todos los ad slots
    const adSlots = document.querySelectorAll('.ad-placeholder');
    adSlots.forEach((slot, index) => {
        slot.style.animation = 'none';
        slot.offsetHeight; // Trigger reflow
        slot.style.animation = 'pulse 0.5s';
    });
}

// Mostrar pantalla de completado
function showCompleted() {
    // Actualizar título
    document.title = '¡Verificación completada!';
    
    // Crear contenido de completado
    verifyContainer.innerHTML = `
        <div class="completed">
            <div class="completed-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
            </div>
            <h2>¡Verificación completada!</h2>
            <p>Serás redirigido al contenido en unos segundos...</p>
        </div>
    `;
    
    // Redirigir después de 3 segundos
    setTimeout(() => {
        window.location.href = CONFIG.finalDestination;
    }, 3000);
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
