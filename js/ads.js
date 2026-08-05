// Cargador de anuncios AdMaven - carga por paso
// Cada paso carga su propio ad cuando empieza.
// Para activar un paso: pega el ID del placement en STEP_ADS.
// Obtienes el ID al crear un placement en panel de AdMaven.
(function () {
    'use strict';

    // Configuracion de ads por paso.
    // pega el ID del placement de AdMaven entre las comillas.
    // Si el array esta vacio, ese paso no muestra ad.
    var STEP_ADS = {
        0: ['1510456'],  // Paso 1: Pop-under (se dispara con el primer click)
        1: ['1510536'],  // Paso 2: In-page push (widget flotante)
        2: ['1510531'],  // Paso 3: Interstitial (overlay)
        3: [],           // Paso 4: pega aqui el ID de otro interstitial o push
        4: []            // Paso 5: pega aqui el ID de otro ad
    };

    var loadedSteps = {};

    function injectBlob(code) {
        var blob = new Blob([code], { type: 'text/javascript' });
        var url = URL.createObjectURL(blob);
        var script = document.createElement('script');
        script.setAttribute('data-cfasync', 'false');
        script.src = url;
        document.head.appendChild(script);
    }

    function fetchAndInject(url) {
        fetch(url, { credentials: 'omit', cache: 'no-cache' })
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.text();
            })
            .then(function (code) {
                try { injectBlob(code); }
                catch (e) { console.error('[Ads] Error al inyectar', e); }
            })
            .catch(function (e) {
                console.warn('[Ads] Fallo', e.message);
            });
    }

    // Llamar desde app.js cuando empieza un paso nuevo
    window.loadStepAds = function (step) {
        if (loadedSteps[step]) return;
        var ads = STEP_ADS[step];
        if (!ads || ads.length === 0) return;
        loadedSteps[step] = true;
        for (var i = 0; i < ads.length; i++) {
            if (ads[i]) {
                fetchAndInject('https://dcbbwymp1bhlf.cloudfront.net/?wbbcd=' + ads[i]);
            }
        }
    };

    // Cargar el paso 0 de inmediato (pop necesita estar listo antes del click)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { window.loadStepAds(0); });
    } else {
        window.loadStepAds(0);
    }

    window.__adsLoaded = true;
})();
