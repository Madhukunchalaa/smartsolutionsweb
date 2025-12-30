/**
 * Antigravity Particles - v4 (Refactored for Reusability)
 * Replicates the Google Antigravity confetti/shard cloud aesthetic.
 * Supports multiple canvas instances.
 */

function createParticleSystem(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return; // Exit if canvas doesn't exist (e.g. on other pages)

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: -9999, y: -9999 };

    // Configuration
    const PARTICLE_COUNT = 100; // Slightly reduced per instance for performance
    const COLORS = ['#F94A29', '#FF7E5F', '#0F172A', '#CBD5E1'];

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * (Math.min(width, height) * 0.6);

            this.x = width / 2 + Math.cos(angle) * (Math.random() * radius);
            this.y = height / 2 + Math.sin(angle) * (Math.random() * radius * 0.8);

            this.size = Math.random() * 4 + 1;
            this.ax = (Math.random() - 0.5) * 0.05;
            this.ay = (Math.random() - 0.5) * 0.05;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;

            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.02;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.shape = Math.random() > 0.3 ? 'poly' : 'rect';
        }

        update() {
            this.vx += this.ax;
            this.vy += this.ay;
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotSpeed;

            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const force = (200 - dist) / 200;
                this.vx += (dx / dist) * force * 0.5;
                this.vy += (dy / dist) * force * 0.5;
            }

            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.init();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            if (this.shape === 'poly') {
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size, this.size);
                ctx.lineTo(-this.size, this.size);
            } else {
                ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
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
        width = canvas.width = canvas.parentElement.offsetWidth; // Use parent width
        height = canvas.height = canvas.parentElement.offsetHeight; // Use parent height
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => {
        // Offset mouse by canvas position to be accurate relative to the specific canvas
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    init();
}

// Initialize for both sections
document.addEventListener('DOMContentLoaded', () => {
    createParticleSystem('hero-canvas');
    createParticleSystem('contact-canvas');
});
