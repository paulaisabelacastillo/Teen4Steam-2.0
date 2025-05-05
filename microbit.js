document.addEventListener('DOMContentLoaded', () => {
    const microbit = document.getElementById('microbit');
    const led = document.getElementById('led');
    const protoboard = document.getElementById('protoboard');
    const cableRojo = document.getElementById('cable-rojo');
    const cableNegro = document.getElementById('cable-negro');
    const estadoLedSpan = document.getElementById('estado-led');
    const resetBtn = document.getElementById('reset-btn');
    const escenario = document.getElementById('escenario');
    const pins = document.querySelectorAll('.pin');
    const terminals = document.querySelectorAll('.terminal');
    const cables = document.querySelectorAll('.cable');
    const instruccionesElement = document.getElementById('instrucciones');

    let cableArrastrando = null;
    let puntoInicioArrastre = null;
    let conexiones = {
        'cable-rojo': { conectadoA: null, conectadoB: null },
        'cable-negro': { conectadoA: null, conectadoB: null }
    };

    function getPosicion(elemento) {
        const rect = elemento.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }

    function crearLinea(x1, y1, x2, y2, color) {
        const linea = document.createElement('div');
        linea.classList.add('cable-visual');
        linea.style.position = 'absolute';
        linea.style.backgroundColor = color;
        linea.style.width = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) + 'px';
        linea.style.height = '6px';
        linea.style.left = Math.min(x1, x2) + 'px';
        linea.style.top = Math.min(y1, y2) - 3 + 'px';
        const angulo = Math.atan2(y2 - y1, x2 - x1);
        linea.style.transformOrigin = 'top left';
        linea.style.transform = `rotate(${angulo}rad)`;
        return linea;
    }

    function iniciarArrastreCable(e) {
        cableArrastrando = e.target;
        puntoInicioArrastre = { x: e.clientX, y: e.clientY };
        cableArrastrando.style.cursor = 'grabbing';
    }

    function moverCable(e) {
        if (!cableArrastrando) return;

        const deltaX = e.clientX - puntoInicioArrastre.x;
        const deltaY = e.clientY - puntoInicioArrastre.y;

        cableArrastrando.style.left = parseFloat(cableArrastrando.style.left) + deltaX + 'px';
        cableArrastrando.style.top = parseFloat(cableArrastrando.style.top) + deltaY + 'px';

        puntoInicioArrastre = { x: e.clientX, y: e.clientY };
    }

    function soltarCable(e) {
        if (!cableArrastrando) return;
        cableArrastrando.style.cursor = 'grab';

        let conectadoA = null;
        const cableRect = cableArrastrando.getBoundingClientRect();

        const conectables = [...pins, ...terminals, protoboard];
        for (const conectable of conectables) {
            const conectableRect = conectable.getBoundingClientRect();
            if (cableRect.intersects(conectableRect)) {
                conectadoA = conectable;
                break;
            }
        }

        if (cableArrastrando.id === 'cable-rojo') {
            if (!conexiones['cable-rojo'].conectadoA) {
                conexiones['cable-rojo'].conectadoA = conectadoA;
            } else if (!conexiones['cable-rojo'].conectadoB && conectadoA !== conexiones['cable-rojo'].conectadoA) {
                conexiones['cable-rojo'].conectadoB = conectadoA;
            }
        } else if (cableArrastrando.id === 'cable-negro') {
            if (!conexiones['cable-negro'].conectadoA) {
                conexiones['cable-negro'].conectadoA = conectadoA;
            } else if (!conexiones['cable-negro'].conectadoB && conectadoA !== conexiones['cable-negro'].conectadoA) {
                conexiones['cable-negro'].conectadoB = conectadoA;
            }
        }

        actualizarConexionesVisuales();
        verificarNivel1();
        cableArrastrando = null;
        puntoInicioArrastre = null;
    }

    function actualizarConexionesVisuales() {
        const cablesVisuales = document.querySelectorAll('.cable-visual');
        cablesVisuales.forEach(cable => cable.remove());

        for (const cableId in conexiones) {
            const cableElement = document.getElementById(cableId);
            const conexion = conexiones[cableId];
            if (conexion.conectadoA) {
                const posCable = getPosicion(cableElement);
                const posA = conexion.conectadoA === protoboard ? getPosicion(protoboard) : getPosicion(conexion.conectadoA);
                const lineaA = crearLinea(posCable.x, posCable.y, posA.x, posA.y, cableElement.dataset.color);
                escenario.appendChild(lineaA);

                if (conexion.conectadoB) {
                    const posB = conexion.conectadoB === protoboard ? getPosicion(protoboard) : getPosicion(conexion.conectadoB);
                    const lineaB = crearLinea(posA.x, posA.y, posB.x, posB.y, cableElement.dataset.color);
                    escenario.appendChild(lineaB);
                }
            }
        }
    }

    function verificarNivel1() {
        const rojoConectadoP0 = (conexiones['cable-rojo'].conectadoA && conexiones['cable-rojo'].conectadoA.classList.contains('pin-p0')) || (conexiones['cable-rojo'].conectadoB && conexiones['cable-rojo'].conectadoB.classList.contains('pin-p0'));
        const rojoConectadoAnodo = (conexiones['cable-rojo'].conectadoA && conexiones['cable-rojo'].conectadoA.classList.contains('terminal-anodo')) || (conexiones['cable-rojo'].conectadoB && conexiones['cable-rojo'].conectadoB.classList.contains('terminal-anodo'));
        const negroConectadoGND = (conexiones['cable-negro'].conectadoA && conexiones['cable-negro'].conectadoA.classList.contains('pin-gnd')) || (conexiones['cable-negro'].conectadoB && conexiones['cable-negro'].conectadoB.classList.contains('pin-gnd'));
        const negroConectadoCatodo = (conexiones['cable-negro'].conectadoA && conexiones['cable-negro'].conectadoA.classList.contains('terminal-catodo')) || (conexiones['cable-negro'].conectadoB && conexiones['cable-negro'].conectadoB.classList.contains('terminal-catodo'));

        const rojoEnProtoboard = (conexiones['cable-rojo'].conectadoA === protoboard) || (conexiones['cable-rojo'].conectadoB === protoboard);
        const negroEnProtoboard = (conexiones['cable-negro'].conectadoA === protoboard) || (conexiones['cable-negro'].conectadoB === protoboard);

        const conexionP0AnodoCorrecta =
            ((rojoConectadoP0 && rojoEnProtoboard) && (rojoConectadoAnodo && rojoEnProtoboard)) ||
            ((negroConectadoP0 && negroEnProtoboard) && (negroConectadoAnodo && negroEnProtoboard));

        const conexionGNDCatodoCorrecta =
            ((negroConectadoGND && negroEnProtoboard) && (negroConectadoCatodo && negroEnProtoboard)) ||
            ((rojoConectadoGND && rojoEnProtoboard) && (rojoConectadoCatodo && rojoEnProtoboard));

        if (conexionP0AnodoCorrecta && conexionGNDCatodoCorrecta) {
            estadoLedSpan.textContent = '¡Encendido!';
            led.classList.add('conectado');
            instruccionesElement.textContent = '¡Nivel 1 completado! ¡Bien hecho!';
        } else {
            estadoLedSpan.textContent = 'Apagado';
            led.classList.remove('conectado');
        }
    }

    cables.forEach(cable => {
        cable.addEventListener('mousedown', iniciarArrastreCable);
    });

    document.addEventListener('mousemove', moverCable);
    document.addEventListener('mouseup', soltarCable);

    resetBtn.addEventListener('click', () => {
        cableRojo.style.left = '170px';
        cableRojo.style.top = '60px';
        cableNegro.style.left = '170px';
        cableNegro.style.top = '90px';
        conexiones['cable-rojo'].conectadoA = null;
        conexiones['cable-rojo'].conectadoB = null;
        conexiones['cable-negro'].conectadoA = null;
        conexiones['cable-negro'].conectadoB = null;
        estadoLedSpan.textContent = 'Apagado';
        led.classList.remove('conectado');
        const cablesVisuales = document.querySelectorAll('.cable-visual');
        cablesVisuales.forEach(cable => cable.remove());
        instruccionesElement.textContent = 'Nivel 1: Enciende el LED. Conecta el pin P0 de la micro:bit al ánodo del LED y el pin GND al cátodo, utilizando los cables y la protoboard como intermediarios.';
    });
});