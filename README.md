# Verificador de Contenido

Página de verificación de 5 pasos con integración de AdMaven.

## Cómo funciona

1. El usuario hace clic en el enlace
2. Ve una página con 5 pasos de verificación
3. Cada paso tiene un temporizador de 10 segundos
4. Después de completar los 5 pasos → redirige a tu Google Drive

## Estructura

```
verificador/
├── index.html      ← Página principal
├── css/
│   └── style.css   ← Estilos
├── js/
│   └── app.js      ← Lógica de verificación
└── README.md       ← Este archivo
```

## Configurar tu enlace de Drive

Abre `js/app.js` y busca:

```javascript
finalDestination: 'https://drive.google.com/file/d/...'
```

Cambia esa URL por tu enlace de Google Drive.

## Integrar AdMaven

### Paso 1: Obtener tu script de AdMaven

1. Entra a tu panel de AdMaven → Publishers
2. Ve a **New Website Ad** o **Social Traffic Smartlinks**
3. Copia el script que te dan

### Paso 2: Pegar el script en index.html

Busca esta línea en `index.html`:

```html
<!-- AdMaven Popunder (se carga en background) -->
<script type="text/javascript">
    ...
</script>
```

Reemplaza todo ese bloque por el script de AdMaven.

### Paso 3: Configurar ad slots

Los divs con clase `ad-slot` son donde aparecen los anuncios.
AdMaven te dará códigos específicos para cada slot.

## Desplegar GRATIS

### Opción 1: Netlify (más fácil)

1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `verificador`
3. ¡Listo! Te da una URL

### Opción 2: GitHub Pages

1. Crea un repo en GitHub
2. Sube los archivos
3. Settings → Pages → Deploy

## Personalizar

### Cambiar colores

En `css/style.css` busca:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Cambia los colores hex (#667eea, #764ba2) por los que quieras.

### Cambiar tiempo por paso

En `js/app.js` busca:

```javascript
stepTime: 10, // segundos por paso
```

Cambia 10 por el tiempo que quieras (en segundos).

### Cambiar número de pasos

En `js/app.js` busca:

```javascript
totalSteps: 5,
```

Cambia 5 por el número de pasos que quieras.

## Compartir tu enlace

1. Sube la web a Netlify
2. Ve a AdMaven → SmartLinks
3. Crea un SmartLink con tu URL de Netlify
4. Comparte el SmartLink en TikTok/redes
5. ¡Ganas dinero!

## Flujo completo

```
Tú compartes SmartLink de AdMaven
    ↓
La gente hace clic
    ↓
Llega a tu página (verificador)
    ↓
Pasa 5 pasos con anuncios
    ↓
Tú ganas dinero en AdMaven
    ↓
Al terminar → redirige a tu Drive
    ↓
La gente descarga tu contenido
```
