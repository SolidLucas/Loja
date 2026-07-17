document.addEventListener('DOMContentLoaded', () => {
    const elementos = document.querySelectorAll('.reveal');
    if (!elementos.length) return;

    const observer = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('is-visible');
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    elementos.forEach((el) => observer.observe(el));
});
