// Loader de anuncios AdMaven
// Carga los scripts via fetch + Blob URL para evitar el bloqueo por MIME type
// (CloudFront responde sin Content-Type, Firefox bloquea esos scripts)
(function () {
    'use strict';

    var ADS = [
        { id: 'pop', url: 'https://dcbbwymp1bhlf.cloudfront.net/?wbbcd=1510456' },
        { id: 'inter', url: 'https://dcbbwymp1bhlf.cloudfront.net/?wbbcd=1510531' },
        { id: 'push', url: 'https://dcbbwymp1bhlf.cloudfront.net/?wbbcd=1510536' }
    ];

    function injectBlob(code) {
        var blob = new Blob([code], { type: 'text/javascript' });
        var url = URL.createObjectURL(blob);
        var script = document.createElement('script');
        script.setAttribute('data-cfasync', 'false');
        script.src = url;
        document.head.appendChild(script);
    }

    function loadAd(ad) {
        fetch(ad.url, { credentials: 'omit', cache: 'no-cache' })
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.text();
            })
            .then(function (code) {
                try { injectBlob(code); }
                catch (e) { console.error('[Ads] ' + ad.id + ' no se pudo inyectar', e); }
            })
            .catch(function (e) {
                console.warn('[Ads] ' + ad.id + ' fallo', e.message);
            });
    }

    // Cargar pop-under e interstitial primero, luego el push
    loadAd(ADS[0]);
    loadAd(ADS[1]);
    loadAd(ADS[2]);

    // Marcar para depuracion
    window.__adsLoaded = true;
})();
