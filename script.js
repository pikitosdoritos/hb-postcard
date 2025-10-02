const colors = [
    'cyan',
    'red',
    'yellow',
    'lime',
    'orange',
    'red',
    'yellow',
    'lime',
    'orange',
    'cyan',
    'red',
    'purple',
    'orange'
];

const letters = wrapLetters();
setupLetterRepulsion(letters);

function wrapLetters() {
    const h1 = document.querySelector('h1');
    const html = h1.innerHTML;
    const charRE = /(?<!<)\w(?!>)/g;

    h1.innerHTML = html.replace(charRE, wrapInSpan);

    const spans = Array.from(h1.children);

    spans.forEach((span, i) => {
        const delay = i * 400 + 700;

        span.style.color = colors[i % colors.length];

        setTimeout(() => span.classList.remove('fade'), delay);
    });

    return spans;
}

function setupLetterRepulsion(spans) {
    if (!spans.length) {
        return;
    }

    const letters = spans.map((span) => ({
        span,
        offsetX: 0,
        offsetY: 0
    }));

    const influenceRadius = 200;
    const maxPush = 140;
    const ease = 0.3;

    let pointerX = null;
    let pointerY = null;
    let rafId = null;

    const scheduleUpdate = () => {
        if (rafId !== null) {
            return;
        }

        rafId = requestAnimationFrame(() => {
            rafId = null;
            updateLetters();
        });
    };

    const updateLetters = () => {
        let needsContinue = false;

        letters.forEach((letter) => {
            const rect = letter.span.getBoundingClientRect();
            let targetOffsetX = 0;
            let targetOffsetY = 0;

            if (pointerX !== null) {
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dx = centerX - pointerX;
                const dy = centerY - pointerY;
                const distance = Math.hypot(dx, dy);

                if (distance < influenceRadius) {
                    const safeDistance = distance || 0.01;
                    const force = ((influenceRadius - safeDistance) / influenceRadius) * maxPush;
                    targetOffsetX = (dx / safeDistance) * force;
                    targetOffsetY = (dy / safeDistance) * force;
                }
            }

            const nextOffsetX = letter.offsetX + (targetOffsetX - letter.offsetX) * ease;
            const nextOffsetY = letter.offsetY + (targetOffsetY - letter.offsetY) * ease;

            let deltaX = nextOffsetX - letter.offsetX;
            let deltaY = nextOffsetY - letter.offsetY;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            deltaX = Math.min(Math.max(deltaX, -rect.left), viewportWidth - rect.right);
            deltaY = Math.min(Math.max(deltaY, -rect.top), viewportHeight - rect.bottom);

            letter.offsetX += deltaX;
            letter.offsetY += deltaY;

            letter.span.style.transform = `translate3d(${letter.offsetX}px, ${letter.offsetY}px, 0)`;

            if (Math.abs(targetOffsetX - letter.offsetX) > 0.5 || Math.abs(targetOffsetY - letter.offsetY) > 0.5) {
                needsContinue = true;
            }
        });

        if (needsContinue) {
            scheduleUpdate();
        }
    };

    window.addEventListener('pointermove', (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        scheduleUpdate();
    });

    window.addEventListener('pointerout', (event) => {
        if (!event.relatedTarget) {
            pointerX = null;
            pointerY = null;
            scheduleUpdate();
        }
    });

    window.addEventListener('resize', () => {
        pointerX = null;
        pointerY = null;
        scheduleUpdate();
    });

    // setTimeout(() => {
    //     document.body.style.setProperty('--transition', '3s')
    // }, 10000);
}

function wrapInSpan(char) {
    return `<span class="fade">${char}</span>`;
}
