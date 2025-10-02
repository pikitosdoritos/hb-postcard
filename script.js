const colors = [
    'cyan',
    'red',
    'yellow',
    'lime',
    'orange',
    ,
    'red',
    'yellow',
    'lime',
    'orange',
    'cyan',
    'red',
    'purple',
    'orange'
];
wrapLetters();
animateBalloons();

function wrapLetters() {
    const h1 = document.querySelector('h1');
    const html = h1.innerHTML;
    const charRE = /(?<!<)\w(?!>)/g;

    h1.innerHTML = html.replace(charRE, wrapInSpan);

    const spans = h1.children;

    for (let i = 0; i < spans.length; i++) {
        const span = spans[i];
        const delay = i * 400 + 700;

        span.style.color = colors[i];

        setTimeout(() => span.classList.remove('fade'), delay);
    }
}

function animateBalloons() {
    const items = document.querySelectorAll('svg');

    items.forEach(svg => {
        svg.style.left = Math.random()*100 + '%';
        svg.style.top = Math.random()*100 + '%';
    })
}

function wrapInSpan(char) {
    return `<span class="fade">${char}</span>`;
}