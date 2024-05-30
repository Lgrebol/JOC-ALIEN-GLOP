document.addEventListener('DOMContentLoaded', () => {
    const numCartes = 5;
    const imatgesCartes = [];

    function generarImatgesCartes() {
        for (let i = 0; i < 10; i++) {
            for (let j = i + 1; j < 10; j++) {
                let numFormatat1 = i.toString().padStart(2, '0');
                let numFormatat2 = j.toString().padStart(2, '0');
                imatgesCartes.push({ numero1: i, numero2: j, imatge1: `img/${numFormatat1}-aliens.png`, imatge2: `img/${numFormatat2}-aliens.png`, tipo: 'alien' });
            }
        }
        for (let i = 0; i < 10; i++) {
            let numFormatat = i.toString().padStart(2, '0');
            imatgesCartes.push({ numero: i, imatge: `img/${numFormatat}-aliens.png`, tipo: 'preso' });
        }
    }

    class Carta {
        constructor(imatge1, imatge2, numero1, numero2, tipo) {
            this.imatge1 = imatge1;
            this.imatge2 = imatge2;
            this.numero1 = numero1;
            this.numero2 = numero2;
            this.tipo = tipo;
        }
    }

    let cartes = [];

    function generarBaralla() {
        for (let carta of imatgesCartes) {
            if (carta.tipo === 'alien') {
                cartes.push(new Carta(carta.imatge1, carta.imatge2, carta.numero1, carta.numero2, carta.tipo));
            } else {
                cartes.push(new Carta(carta.imatge, null, carta.numero, null, carta.tipo));
            }
        }
    }

    function barrejar() {
        for (let i = cartes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cartes[i], cartes[j]] = [cartes[j], cartes[i]];
        }
    }

    const jugadorDiv = document.querySelector('.jugador .cartes');
    const bancaDiv = document.querySelector('.banca .cartes');
    const mazo = document.getElementById('mazo');
    
    function generarCartaAleatoria() {
        const cartaAleatoria = crearCarta(cartes[Math.floor(Math.random() * cartes.length)]);
        mazo.appendChild(cartaAleatoria);
    }

    function repartirCartes() {
        if (!mazo.querySelector('.carta')) {
            generarCartaAleatoria();
        }
    
        for (let i = 0; i < numCartes; i++) {
            const cartaJugador = crearCarta(cartes.pop());
            jugadorDiv.appendChild(cartaJugador);
    
            const cartaBanca = crearCarta(cartes.pop());
            bancaDiv.appendChild(cartaBanca);
        }
    }

    function crearCarta(carta) {
        const cartaContainer = document.createElement('div');
        cartaContainer.className = 'carta';
        cartaContainer.draggable = true;

        if (carta.tipo === 'alien') {
            const alienContainer = document.createElement('div');
            alienContainer.className = 'alien-container-vertical';

            const img1 = document.createElement('img');
            img1.src = carta.imatge1;
            img1.className = 'alien-img';
            img1.draggable = false;
            alienContainer.appendChild(img1);

            const value1 = document.createElement('div');
            value1.className = 'value top';
            value1.textContent = carta.numero1;
            alienContainer.appendChild(value1);

            const divider = document.createElement('div');
            divider.className = 'divider';
            alienContainer.appendChild(divider);

            const img2 = document.createElement('img');
            img2.src = carta.imatge2;
            img2.className = 'alien-img';
            img2.draggable = false;
            alienContainer.appendChild(img2);

            const value2 = document.createElement('div');
            value2.className = 'value bottom';
            value2.textContent = carta.numero2;
            alienContainer.appendChild(value2);

            cartaContainer.appendChild(alienContainer);
        } else {
            const img = document.createElement('img');
            img.src = carta.imatge1;
            img.className = 'alien-img';
            img.draggable = false;
            cartaContainer.appendChild(img);

            const value = document.createElement('div');
            value.className = 'value top';
            value.textContent = carta.numero1;
            cartaContainer.appendChild(value);
        }

        cartaContainer.dataset.numero1 = carta.numero1;
        if (carta.numero2 !== null) {
            cartaContainer.dataset.numero2 = carta.numero2;
        }

        cartaContainer.addEventListener('dragstart', dragStart);
        cartaContainer.addEventListener('dragend', dragEnd);
        return cartaContainer;
    }

    let draggedCard;
    let originalPosition;
    let currentPlayer = 'jugador';

    function dragStart(e) {
        if (currentPlayer === 'jugador' && e.target.closest('.jugador') ||
            currentPlayer === 'banca' && e.target.closest('.banca')) {
            draggedCard = e.target;
            originalPosition = { parent: draggedCard.parentNode, nextSibling: draggedCard.nextSibling };
            e.dataTransfer.setData('text/plain', JSON.stringify({ numero1: draggedCard.dataset.numero1, numero2: draggedCard.dataset.numero2 }));
            setTimeout(() => {
                draggedCard.classList.add('hidden');
            }, 0);
            mazo.classList.add('pulsate-border');
        } else {
            e.preventDefault();
        }
        const mazoCarta = mazo.querySelector('.carta');
        if (mazoCarta) {
            const mazoNumero1 = mazoCarta.dataset.numero1;
            const mazoNumero2 = mazoCarta.dataset.numero2;
    
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const numero1 = data.numero1;
            const numero2 = data.numero2;
    
            if ((numero2 === undefined) && (mazoNumero1 === numero1 || mazoNumero2 === numero1)) {
                mazo.classList.add('highlight');
            } else {
                mazo.classList.remove('highlight');
            }
        }
    }

    function dragEnd(e) {
        mazo.classList.remove('pulsate-border');
        draggedCard.classList.remove('hidden');
        if (!e.dataTransfer.dropEffect) {
            if (originalPosition.nextSibling) {
                originalPosition.parent.insertBefore(draggedCard, originalPosition.nextSibling);
            } else {
                originalPosition.parent.appendChild(draggedCard);
            }
        }
        const mazoCarta = mazo.querySelector('.carta');
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const numero1 = data.numero1;
        const numero2 = data.numero2;
    
        if (mazoCarta) {
            const mazoNumero1 = mazoCarta.dataset.numero1;
            const mazoNumero2 = mazoCarta.dataset.numero2;
    
            if ((numero2 === undefined) && (mazoNumero1 === numero1 || mazoNumero2 === numero1)) {
                const jugadorDiv = document.querySelector('.jugador .cartes');
                const bancaDiv = document.querySelector('.banca .cartes');
                const cartaMazo = mazo.querySelector('.carta');
                const cartaMazoData = { numero1: cartaMazo.dataset.numero1, numero2: cartaMazo.dataset.numero2 };
    
                if (currentPlayer === 'jugador') {
                    if (comprovarCapturaAlien(draggedCard, cartaMazo)) {
                        const novaCarta = document.createElement('div');
                        novaCarta.classList.add('carta-preso');
                        novaCarta.appendChild(draggedCard.cloneNode(true));
                        jugadorDiv.appendChild(novaCarta);
                        mazo.removeChild(cartaMazo);
                    } else {
                        jugadorDiv.appendChild(draggedCard);
                    }
                } else {
                    if (comprovarCapturaAlien(draggedCard, cartaMazo)) {
                        const novaCarta = document.createElement('div');
                        novaCarta.classList.add('carta-preso');
                        novaCarta.appendChild(draggedCard.cloneNode(true));
                        bancaDiv.appendChild(novaCarta);
                        mazo.removeChild(cartaMazo);
                    } else {
                        bancaDiv.appendChild(draggedCard);
                    }
                }
    
                currentPlayer = currentPlayer === 'jugador' ? 'banca' : 'jugador';
                desactivarTornImatge();
                activarTornImatge();
                repartirCartesJugador();
                changeTurn();
            }
        }
    }

    // Afegim event listener per al drop al mazo
    function comprovarCapturaAlien(cartaJugada, cartaMazo) {
        return cartaJugada.tipo === 'alien' && cartaMazo.tipo === 'preso';
    }
    
    mazo.addEventListener('dragover', e => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const numero1 = data.numero1;
        const numero2 = data.numero2;
    
        const mazoCarta = mazo.querySelector('.carta');
    
        if (mazoCarta) {
            const mazoNumero1 = mazoCarta.dataset.numero1;
            const mazoNumero2 = mazoCarta.dataset.numero2;
    
            if ((numero2 === undefined) && (mazoNumero1 === numero1 || mazoNumero2 === numero1)) {
                mazo.classList.add('highlight');
            } else {
                mazo.classList.remove('highlight');
            }
        }
    });
    
    mazo.addEventListener('drop', e => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const numero1 = data.numero1;
        const numero2 = data.numero2;
    
        const draggable = numero2 === undefined ?
            document.querySelector(`.carta[data-numero1="${numero1}"]:not([data-numero2])`) :
            document.querySelector(`.carta[data-numero1="${numero1}"][data-numero2="${numero2}"]`);
    
        const mazoCarta = mazo.querySelector('.carta');
    
        if (!mazoCarta) {
            mazo.appendChild(draggable);
            changeTurn();
        } else {
            const mazoNumero1 = mazoCarta.dataset.numero1;
            const mazoNumero2 = mazoCarta.dataset.numero2;
    
            if ((numero2 === undefined) && (mazoNumero1 === numero1 || mazoNumero2 === numero1)) {
                const currentPlayerDiv = document.querySelector(`.${currentPlayer} .carta-preso`);
                currentPlayerDiv.appendChild(draggable);
    
                // Substitueix la carta alien si té el mateix valor
                if (comprovarCapturaTotal(draggable, mazoCarta)) {
                    mazo.removeChild(mazoCarta);
                }
            } else {
                return; // No fem res si no es compleix la condició
            }
    
            // Només eliminem la carta del mazo si no s'ha capturat un alien
            if (!comprovarCapturaAlien(draggable, mazoCarta)) {
                mazo.removeChild(mazoCarta);
            }
            currentPlayer = currentPlayer === 'jugador' ? 'banca' : 'jugador';
            desactivarTornImatge();
            activarTornImatge();
            repartirCartesJugador();
            changeTurn();
        }
    });
    
    function comprovarCapturaTotal(carta1, carta2) {
        return carta1.numero1 === carta2.numero1 && carta1.numero2 === carta2.numero2;
    }
    
    function repartirCartesJugador() {
        const cartesJugador = jugadorDiv.querySelectorAll('.carta');
        const cartesBanca = bancaDiv.querySelectorAll('.carta');
    
        if (currentPlayer === 'jugador') {
            const cartesNecessaries = numCartes - cartesJugador.length;
            for (let i = 0; i < cartesNecessaries; i++) {
                const novaCarta = crearCarta(cartes.pop());
                jugadorDiv.appendChild(novaCarta);
            }
        } else if (currentPlayer === 'banca') {
            const cartesNecessaries = numCartes - cartesBanca.length;
            for (let i = 0; i < cartesNecessaries; i++) {
                const novaCarta = crearCarta(cartes.pop());
                bancaDiv.appendChild(novaCarta);
            }
        }
    }
    
    function activarTornImatge() {
        if (currentPlayer === 'jugador') {
            jugadorImg.classList.add('pulsate');
        } else {
            bancaImg.classList.add('pulsate');
        }
    }
    
    function desactivarTornImatge() {
        jugadorImg.classList.remove('pulsate');
        bancaImg.classList.remove('pulsate');
    }
    
    const jugadorImg = document.querySelector('.jugador .jugador-imatge');
    const bancaImg = document.querySelector('.banca .jugador-imatge');
    
    jugadorImg.addEventListener('click', () => {
        if (currentPlayer === 'jugador') {
            desactivarTornImatge();
            repartirCartesJugador();
            currentPlayer = 'banca';
            activarTornImatge();
        }
    });
    
    bancaImg.addEventListener('click', () => {
        if (currentPlayer === 'banca') {
            desactivarTornImatge();
            repartirCartesJugador();
            currentPlayer = 'jugador';
            activarTornImatge();
        }
    });
    
    const barallaDiv = document.querySelector('.baralla-cartes');
    barallaDiv.addEventListener('click', agafarCarta);
    
    let tornJugador = 'jugador';
    
    const MAX_CARTES_PER_JUGADOR = 10;
    function agafarCarta() {
        verificarLimitCartes();
        const jugadorDiv = currentPlayer === 'jugador' ? '.jugador .cartes' : '.banca .cartes';
        const cartesJugador = document.querySelectorAll(jugadorDiv + ' .carta');
        if (cartesJugador.length >= MAX_CARTES_PER_JUGADOR) {
            document.getElementById('prohibit').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('prohibit').classList.add('hidden');
            }, 1000);
            return;
        }
        const carta = cartes.pop();
        const novaCarta = crearCarta(carta);
        novaCarta.style.opacity = '0';
        novaCarta.style.transition = 'opacity 0.5s ease';
        document.querySelector(jugadorDiv).appendChild(novaCarta);
        setTimeout(() => {
            novaCarta.style.opacity = '1';
            novaCarta.style.transition = 'transform 0.3s ease'
            novaCarta.style.transform = 'translateY(5%)';
            novaCarta.addEventListener('transitionend', () => {
                novaCarta.style.transform = '';
            }, { once: true });
    
            // Captura de carta preso
            const cartaMazo = mazo.querySelector('.carta');
            const cartaMazoData = {
                numero1: cartaMazo.dataset.numero1,
                numero2: cartaMazo.dataset.numero2
            };
            if (cartaMazo && potCapturarPreso(carta, cartaMazoData)) {
                novaCarta.draggable = false;
    
                while (mazo.firstChild) {
                    mazo.removeChild(mazo.firstChild);
                }
    
                mazo.appendChild(novaCarta);
                novaCarta.classList.remove('hidden');
                novaCarta.classList.add('no-hover-animation');
    
                if (originalPosition.parent) {
                    originalPosition.parent.removeChild(novaCarta);
                }
    
                currentPlayer = currentPlayer === 'jugador' ? 'banca' : 'jugador';
                desactivarTornImatge();
                activarTornImatge();
                repartirCartesJugador();
            } else {
                currentPlayer = currentPlayer === 'jugador' ? 'banca' : 'jugador';
            }
        }, 0);
    }

    function verificarLimitCartes() {
        const cartesJugador = document.querySelectorAll('.jugador .cartes .carta');
        if (cartesJugador.length >= 10) {
            const barallaCartes = document.querySelector('.baralla-cartes');
            barallaCartes.classList.add('vibrate');
        } else {
            const barallaCartes = document.querySelector('.baralla-cartes');
            barallaCartes.classList.remove('vibrate');
        }
    }
    
    generarImatgesCartes();
    generarBaralla();
    barrejar();
    repartirCartes();
    activarTornImatge();
});