// 1. Configuración de palabras (Juego de letras) - CON TUS EFECTOS CANDY CRUSH
const niveles = [
    { desordenada: "L - E - R - E", correcta: "leer" },
    { desordenada: "R - I - B - L - O", correcta: "libro" },
    { desordenada: "X - O - T - E - T", correcta: "texto" },
    { desordenada: "N - D - O - M - U", correcta: "mundo" },
    { desordenada: "R - E - S - B - A", correcta: "saber" },
    { desordenada: "D - I - E - A", correcta: "idea" },
    { desordenada: "J - E - A - V - I", correcta: "viaje" },
    { desordenada: "N - A - L - A - P", correcta: "plana" },
    { desordenada: "J - A - H - O", correcta: "hoja" },
    { desordenada: "S - O - M - I - N - I", correcta: "mision" }
];

let nivelActual = 0;

function procesarRespuesta() {
    const input = document.getElementById('respuesta-usuario');
    const fb = document.getElementById('feedback');
    const letras = document.getElementById('letras-desordenadas');
    const indicador = document.getElementById('indicador-level');
    const respuestaSucia = input.value.toLowerCase().trim();

    if (respuestaSucia === niveles[nivelActual].correcta) {
        fb.innerText = "¡GENIAL! ✨";
        fb.style.color = "white";
        fb.className = "candy-crush-efecto"; 
        nivelActual++; 

        setTimeout(() => {
            if (nivelActual < niveles.length) {
                letras.innerText = niveles[nivelActual].desordenada;
                indicador.innerText = `Misión: ${nivelActual + 1} / 10`;
                input.value = ""; fb.innerText = ""; fb.className = "";
                input.focus();
            } else {
                letras.innerText = "¡ERES UNA ESTRELLA! 🏆";
                input.style.display = "none";
                fb.innerText = "Misiones completadas";
            }
        }, 1500);
    } else {
        fb.innerText = "¡Intenta otra vez! 👾";
        fb.style.color = "#ff00ff";
    }
}

// 2. Configuración de Oraciones (Juego de fichas) - ORIGINAL
const misionesOraciones = [
    { desordenada: ["k-pop", "escucho", "Yo"], correcta: "Yo escucho k-pop" },
    { desordenada: ["libro", "El", "es", "azul"], correcta: "El libro es azul" },
    { desordenada: ["corre", "parque", "en", "perro", "El", "el"], correcta: "El perro corre en el parque" },
    { desordenada: ["gato", "El", "cama", "duerme", "en", "la"], correcta: "El gato duerme en la cama" },
    { desordenada: ["frutas", "comemos", "Nosotros", "saludables"], correcta: "Nosotros comemos frutas saludables" },
    { desordenada: ["Me", "comer", "helado", "de", "chocolate", "gusta"], correcta: "Me gusta comer helado de chocolate" },
    { desordenada: ["historia", "cuenta", "abuela", "una", "La"], correcta: "La abuela cuenta una historia" }
];

let misionActual = 0;

function cargarOracion() {
    const caja = document.getElementById('caja-palabras');
    const zonaR = document.getElementById('zona-respuesta');
    if(!caja || !zonaR) return;
    caja.innerHTML = ""; zonaR.innerHTML = "";
    misionesOraciones[misionActual].desordenada.forEach(p => {
        let span = document.createElement('span');
        span.innerText = p; span.className = 'ficha-palabra';
        span.onclick = function() { 
            if(this.parentElement.id === "caja-palabras") zonaR.appendChild(this);
            else caja.appendChild(this);
        };
        caja.appendChild(span);
    });
}

function verificarOracion() {
    const zonaR = document.getElementById('zona-respuesta');
    const userFrase = Array.from(zonaR.children).map(s => s.innerText).join(" ");
    const feedback = document.getElementById('feedback-oracion');
    
    if (userFrase === misionesOraciones[misionActual].correcta) {
        feedback.innerText = "¡Perfecto! ✨";
        setTimeout(() => {
            misionActual++;
            if(misionActual < misionesOraciones.length) {
                cargarOracion();
                document.getElementById('indicador-oracion').innerText = `Misión: ${misionActual+1}/7`;
                feedback.innerText = "";
            }
        }, 2000);
    } else {
        feedback.innerText = "¡Revisa el orden! 👾";
    }
}

// --- SECCIÓN KARAOKE: VOZ Y RECOMENDACIONES ---
const textoKaraoke = "Había una vez un pequeño zorro llamado Lino que vivía en un bosque y sentía curiosidad por un lago que brillaba en la noche pero le daba un poco de miedo acercarse.Un día su amiga la ardilla Nara le dijo que fueran juntos y aunque dudó decidió intentarlo caminaron entre los árboles hasta llegar al lago.Cuando lo vieron descubrieron que no era peligroso estaba lleno de luciérnagas que iluminaban el agua.Lino sonrió y entendió que a veces lo que da miedo puede ser algo bonito si te atreves a conocerlo.";
const palabrasKaraoke = textoKaraoke.split(" ");
let recog; 
let mediaRecorder;
let fragmentosAudio = [];

function abrirKaraoke() {
    const modal = document.createElement('div');
    modal.id = 'modal-karaoke';
    modal.style = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 90%; height: 85%; background: rgba(0, 0, 0, 0.98);
        border: 3px solid #ff00ff; border-radius: 20px; z-index: 3000;
        padding: 20px; display: flex; flex-direction: column; align-items: center;
        box-shadow: 0 0 30px #ff00ff; overflow-y: auto;
    `;

    modal.innerHTML = `
        <h2 style="color: #ff00ff; text-shadow: 0 0 10px #ff00ff; text-align:center;">🎤 MODO KARAOKE LECTOR</h2>
        <div id="mic-status" style="color: #00f2ff; font-weight: bold; margin-bottom: 10px; display:none;">🔴 GRABANDO...</div>
        
        <div id="contenedor-karaoke" style="flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-content: center; gap: 8px;"></div>
        
        <div id="zona-recomendaciones" style="display:none; text-align:center; color:#00f2ff; width: 100%;">
            <h3 style="font-size: 2rem; animation: candy-crush-efecto 0.8s;">⭐ ¡MISIÓN CUMPLIDA!</h3>
            <div style="background: rgba(0, 242, 255, 0.1); border: 1px solid #00f2ff; padding: 15px; border-radius: 15px; margin: 15px auto; max-width: 500px; color: white;">
                <p><b>Recomendación para tu lectura:</b></p>
                <p>¡Excelente energía! Sigue practicando las palabras largas para mejorar tu fluidez. ¡Lo haces como un guerrero K-Pop!</p>
            </div>
            <p style="color: white;">¡Escucha tu grabación aquí abajo!</p>
            <audio id="audio-modal" controls style="margin-bottom: 20px;"></audio>
            <br>
            <button onclick="document.getElementById('modal-karaoke').remove();" class="btn-neon">VOLVER AL MENÚ</button>
        </div>
        
        <div id="controles-voz" style="margin-top: 20px;">
            <button id="btn-start-karaoke" class="btn-neon" onclick="iniciarLecturaKaraoke()">¡EMPEZAR A LEER! 🎶</button>
            <button id="btn-stop-karaoke" class="btn-neon" style="display:none; background: #ff4444;" onclick="finalizarLectura()">FINALIZAR ⏹️</button>
        </div>
    `;

    document.body.appendChild(modal);

    const contenedor = document.getElementById('contenedor-karaoke');
    palabrasKaraoke.forEach((p, i) => {
        const span = document.createElement('span');
        span.innerText = p;
        span.className = 'palabra-karaoke';
        span.id = `k-palabra-${i}`;
        contenedor.appendChild(span);
    });
}

async function iniciarLecturaKaraoke() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome."); return; }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    fragmentosAudio = [];
    mediaRecorder.ondataavailable = (e) => fragmentosAudio.push(e.data);
    mediaRecorder.onstop = () => {
        const blob = new Blob(fragmentosAudio, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        document.getElementById('audio-modal').src = url;
        document.getElementById('audio-grabado-ui').src = url; // También lo pone en el panel derecho
        document.getElementById('msg-espera').style.display = 'none';
        document.getElementById('reproductor-final').style.display = 'block';
    };
    mediaRecorder.start();

    recog = new SpeechRecognition();
    recog.lang = 'es-MX';
    recog.continuous = true;
    recog.interimResults = true;

    document.getElementById('btn-start-karaoke').style.display = 'none';
    document.getElementById('btn-stop-karaoke').style.display = 'block';
    document.getElementById('mic-status').style.display = 'block';

    let indexActual = 0;
    recog.onresult = (event) => {
        let textoDicho = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            textoDicho += event.results[i][0].transcript.toLowerCase();
        }
        palabrasKaraoke.forEach((p, i) => {
            const limpia = p.toLowerCase().replace(/[.,]/g, "");
            if (textoDicho.includes(limpia) && i >= indexActual) {
                const el = document.getElementById(`k-palabra-${i}`);
                if (el) {
                    el.classList.add('iluminada');
                    indexActual = i + 1;
                }
            }
        });
        if (indexActual >= palabrasKaraoke.length) { finalizarLectura(); }
    };
    recog.start();
}

function finalizarLectura() {
    if(recog) recog.stop();
    if(mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
    
    document.getElementById('mic-status').style.display = 'none';
    document.getElementById('btn-stop-karaoke').style.display = 'none';
    document.getElementById('contenedor-karaoke').style.display = 'none';
    document.getElementById('zona-recomendaciones').style.display = 'block';
}

// --- SECCIÓN REPASO: CREADOR DE HISTORIAS ---
function abrirActividadCuento() {
    const modalCuento = document.createElement('div');
    modalCuento.id = 'modal-actividad';
    modalCuento.style = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 90%; height: 85%; background: rgba(0, 0, 0, 0.98);
        border: 3px solid #00f2ff; border-radius: 20px; z-index: 2000;
        padding: 20px; display: flex; flex-direction: column; align-items: center;
        box-shadow: 0 0 30px #00f2ff; overflow-y: auto;
    `;

    modalCuento.innerHTML = `
        <h2 style="color: #00f2ff; text-shadow: 0 0 10px #00f2ff; margin-bottom:10px;">🐉 CREADOR DE HISTORIAS</h2>
        <div id="caja-actores" style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; justify-content: center;">
            <div class="actor-card" draggable="true" id="actor-1"><img src="dragoncito.jpeg" width="50" style="border-radius:8px;"><p style="font-size:0.5rem;">DRAGÓN</p></div>
            <div class="actor-card" draggable="true" id="actor-2"><img src="hada.jpeg" width="50" style="border-radius:8px;"><p style="font-size:0.5rem;">HADA</p></div>
            <div class="actor-card" draggable="true" id="actor-3"><img src="gato.jpeg" width="50" style="border-radius:8px;"><p style="font-size:0.5rem;">GATO</p></div>
            <div class="actor-card" draggable="true" id="actor-4"><img src="soldado.jpeg" width="50" style="border-radius:8px;"><p style="font-size:0.5rem;">SOLDADO</p></div>
        </div>
        <div id="lienzo-cuento" style="width: 90%; height: 100px; border: 2px dashed #ff00ff; border-radius: 15px; display: flex; justify-content: center; align-items: center; background: rgba(255, 0, 255, 0.05); margin-bottom: 15px;">
            <p id="msg-lienzo" style="color: #ff00ff; font-size:0.8rem;">Suelta a los personajes aquí</p>
        </div>
        <textarea id="escritura-libre" placeholder="Escribe tu cuento aquí..." style="width: 90%; flex: 1; background: rgba(0,0,0,0.5); border: 1px solid #00f2ff; color: white; padding: 10px; border-radius: 10px; resize: none;"></textarea>
        <div style="margin-top: 15px; display: flex; gap: 10px;">
            <button onclick="finalizarCuento()" class="btn-neon">¡GUARDAR! ⭐</button>
            <button onclick="document.getElementById('modal-actividad').remove()" class="btn-neon" style="background: #444;">CERRAR</button>
        </div>
    `;
    document.body.appendChild(modalCuento);
    activarArrastreCuento();
}

function activarArrastreCuento() {
    const actores = document.querySelectorAll('.actor-card');
    const lienzo = document.getElementById('lienzo-cuento');
    actores.forEach(actor => { actor.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', e.target.id); }); });
    lienzo.addEventListener('dragover', (e) => e.preventDefault());
    lienzo.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const original = document.getElementById(id);
        if (original) {
            const clon = original.querySelector('img').cloneNode(true);
            clon.style = "width:40px; margin:5px;";
            document.getElementById('msg-lienzo').style.display = 'none';
            lienzo.appendChild(clon);
        }
    });
}

function finalizarCuento() {
    alert("¡Tu historia ha sido guardada en la base de datos de la misión! ✨");
    document.getElementById('modal-actividad').remove();
}

// 4. CONTROL DE BOTONES Y ZOEY
document.querySelectorAll('.btn-circular').forEach(boton => {
    boton.addEventListener('click', () => {
        const textoBoton = boton.innerText.trim();
        if (textoBoton.includes("REPASO")) { abrirActividadCuento(); } 
        else if (textoBoton.includes("NIVEL 1")) { abrirKaraoke(); }
    });
});

document.querySelectorAll('.nodo-esquema').forEach(d => {
    d.addEventListener('toggle', () => {
        const zoey = document.getElementById('zoey-main');
        if(zoey) zoey.style.display = Array.from(document.querySelectorAll('.nodo-esquema')).some(e => e.open) ? "none" : "block";
    });
});

window.onload = cargarOracion;