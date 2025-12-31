/**
 * Antigravity Particles - v8 (High Visibility & Vortex)
 * Replicates antigravity.google with ENHANCED visibility.
 * Features:
 * 1. 3D Depth & Parallax
 * 2. High Density (1500 particles)
 * 3. ALWAYS VISIBLE Vortex (faint) -> Fully Illuminated on Hover
 * 4. Vortex biased to left/center to frame text.
 */

function createParticleSystem(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: -9999, y: -9999, targetX: 0, targetY: 0, currentX: 0, currentY: 0 };

    // Configuration
    const PARTICLE_COUNT = 2500; // Requested Increase
    const SPOTLIGHT_RADIUS = 550; // Larger reveal area
    const BASE_OPACITY = 0.15; // Always dimly visible
    const COLORS = ['#F94A29', '#FF7E5F', '#0F172A', '#64748B'];
    const FOCAL_LENGTH = 400;

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            // 3D Coordinates
            this.z = (Math.random() - 0.5) * 500;

            // Distribution: Biased Vortex
            // Focus more particles on the Left/Center-Left to frame "We Engineer..."
            const angle = Math.random() * Math.PI * 2;

            // Adjusted Rings:
            // 40% Inner Ring (near text)
            // 60% Outer Field
            let r;
            if (Math.random() < 0.4) {
                r = Math.random() * 300 + 100; // 100-400px radius
            } else {
                r = Math.random() * (Math.max(width, height) * 0.8) + 400;
            }

            this.x = Math.cos(angle) * r;
            this.y = Math.sin(angle) * r;

            // Shift Center slightly Left (-100px) to balance text
            this.originX = this.x - 50;
            this.originY = this.y;
            this.originZ = this.z;

            this.size = Math.random() * 4 + 1;
            this.rotation = Math.random() * Math.PI * 2;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.shape = Math.random() > 0.5 ? 'poly' : 'rect';

            this.jiggleRate = Math.random() * 0.05 + 0.02;
        }

        update(time) {
            const t = time * 0.002;
            // Jiggle
            this.x = this.originX + Math.sin(t * this.jiggleRate) * 8;
            this.y = this.originY + Math.cos(t * this.jiggleRate * 0.9) * 8;
            this.rotation += 0.01;

            // Parallax
            const perspective = FOCAL_LENGTH / (FOCAL_LENGTH + this.z);
            const parallaxX = (mouse.currentX - width / 2) * 0.08 * perspective;
            const parallaxY = (mouse.currentY - height / 2) * 0.08 * perspective;

            this.renderX = this.x + width / 2 - parallaxX;
            this.renderY = this.y + height / 2 - parallaxY;
            this.renderScale = perspective;
        }

        draw() {
            if (this.renderScale < 0 || this.z < -FOCAL_LENGTH + 50) return;

            // Visibility Logic
            const dx = this.renderX - mouse.x;
            const dy = this.renderY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Base Visibility + Spotlight Addition
            let highlight = 0;
            if (dist < SPOTLIGHT_RADIUS) {
                highlight = 1 - (dist / SPOTLIGHT_RADIUS);
                highlight = highlight * highlight; // Ease In
            }

            // Combine Base + Highlight (Clamp to 1)
            let opacity = BASE_OPACITY + (highlight * 0.85);

            // Depth Fade
            const depthFade = Math.min(1, FOCAL_LENGTH / (this.z + FOCAL_LENGTH + 200));
            opacity *= depthFade;

            if (opacity < 0.02) return;

            ctx.save();
            ctx.translate(this.renderX, this.renderY);
            ctx.scale(this.renderScale, this.renderScale);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = opacity;
            ctx.fillStyle = this.color;

            ctx.beginPath();
            if (this.shape === 'poly') {
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size, this.size);
                ctx.lineTo(-this.size, this.size);
            } else {
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            }
            ctx.fill();
            ctx.restore();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
        animate();
    }

    function resize() {
        if (!canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        if (particles.length > 0) {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        }
    }

    function animate(time) {
        ctx.clearRect(0, 0, width, height);
        mouse.currentX += (mouse.targetX - mouse.currentX) * 0.1;
        mouse.currentY += (mouse.targetY - mouse.currentY) * 0.1;
        particles.forEach(p => {
            p.update(time);
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 200);
    });

    window.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.targetX = mouse.x;
        mouse.targetY = mouse.y;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    init();
}

document.addEventListener('DOMContentLoaded', () => {
    createParticleSystem('hero-canvas');
    if (document.getElementById('contact-canvas')) {
        createParticleSystem('contact-canvas');
    }
});
