document.addEventListener('DOMContentLoaded', () => {
    const bubbles = document.querySelectorAll('.float-bubble');
    const container = document.querySelector('.antigravity-float-section');

    if (!bubbles.length || !container) return;

    window.addEventListener('scroll', () => {
        const sectionTop = container.offsetTop;
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Only animate when section is roughly in view
        if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + container.offsetHeight + windowHeight) {

            bubbles.forEach((bubble, index) => {
                // Create staggered parallax speeds based on index
                // Some move up faster, some move slower, creating depth
                const speed = (index % 4 + 1) * 0.08;
                const direction = index % 2 === 0 ? -1 : 1; // Some go up, some go down relative to scroll

                // Calculate offset relative to when the section appeared
                const offset = (scrollY - sectionTop) * speed * direction;

                // Apply Transform (TranslateX is managed by CSS animation for entrance, but we can overwrite or compose? 
                // Wait, entrance animation uses transform. 
                // better to modify a CSS variable or use specific property if possible.
                // However, the Entrance animation finishes and leaves opacity:1, transform: translateX(0).
                // JS overwriting transform might snap the entrance.
                // WE SHOULD check if animation is done or use 'will-change' and simple calc.

                // SAFEST APPROACH: Apply the parallax to the 'bubbles-container' or wrap each bubble?
                // OR: Use `marginTop` for parallax to avoid Transform conflict? 
                // OR: modify the `translate` property if browser supports individual translate property (it does, used in CSS).
                // CSS uses 'translate' for bobbing. JS can use 'transform'.

                // Problem: Entrance animation 'slideInRight' uses 'transform'.
                // If we set style.transform via JS, it overrides the keyframe final state?
                // Actually, once animation finishes (forwards), the style is stuck.
                // JS inline style has higher specificity. It will overwrite the slideInRight final state (translateX(0)).
                // So we must include translateX(0) in our JS transform or wait.

                bubble.style.transform = `translateY(${offset}px) translateX(0px) scale(1)`;
            });
        }
    });
});
