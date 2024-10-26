const canvas = document.getElementById('plexusCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Global settings
const PARTICLE_SPEED = 0.1;
const CONNECTION_RANGE = 150;
const NUM_PARTICLES = 250;
const PARTICLE_MIN_SIZE = 1;
const PARTICLE_MAX_SIZE = 3;
const MOUSE_ATTRACTION_RADIUS = 150;  // Radius within which particles are attracted to the mouse
const MOUSE_ATTRACTION_STRENGTH = 0.03; // Controls how strongly particles are pulled to the mouse
const MAX_PARTICLE_SPEED = 0.05;          // Maximum speed of particles when not attracted

const particles = [];
const mouse = { x: null, y: null };

// Define a light source position
const lightSource = { x: canvas.width / 2, y: canvas.height / 2 }; // Initial position of the light source

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = (Math.random() - 0.5) * 2;
        this.velocityY = (Math.random() - 0.5) * 2;
        this.speed = PARTICLE_SPEED;
        this.radius = Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE) + PARTICLE_MIN_SIZE;
        this.isAttracted = false; // Track if the particle is currently attracted to the mouse
    }

    update() {
        // Calculate attraction to mouse
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Apply attraction if within a certain radius
            if (distance < MOUSE_ATTRACTION_RADIUS) {
                const attractionForce = MOUSE_ATTRACTION_STRENGTH * (MOUSE_ATTRACTION_RADIUS - distance) / MOUSE_ATTRACTION_RADIUS;
                this.velocityX += attractionForce * (dx / distance);
                this.velocityY += attractionForce * (dy / distance);
                this.isAttracted = true; // Set attracted state to true
            } else {
                this.isAttracted = false; // Reset attracted state if out of range
            }
        }

        // Calculate current speed
        const currentSpeed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);

        // Clamp speed to maximum allowed value only if not attracted
        if (!this.isAttracted && currentSpeed > MAX_PARTICLE_SPEED) {
            const speedFactor = MAX_PARTICLE_SPEED / currentSpeed;
            this.velocityX *= speedFactor;
            this.velocityY *= speedFactor;
        }

        // Bounce off the edges
        if (this.x < 0 || this.x > canvas.width) this.velocityX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.velocityY *= -1;

        // Apply velocity
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    draw() {
        // Calculate distance to light source
        const dx = lightSource.x - this.x;
        const dy = lightSource.y - this.y;
        const distanceToLight = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate brightness based on distance (closer = brighter)
        const brightness = Math.max(0, 1 - (distanceToLight / 500)); // Adjust divisor for distance sensitivity

        // Set the fill color with brightness
        ctx.fillStyle = `rgba(255, 255, 222, ${brightness})`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

// Initialize particles
for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
}

// Mouse move event
canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    
    // Update light source position to mouse
    lightSource.x = mouse.x;
    lightSource.y = mouse.y;
});

// Connect particles based on distance
function connectParticles() {
    const points = []; // Array to hold points of connected particles

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONNECTION_RANGE) {
                points.push({ x: particles[i].x, y: particles[i].y });
                points.push({ x: particles[j].x, y: particles[j].y });

                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

// Custom render function
function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    connectParticles();
    requestAnimationFrame(renderParticles); // Use the new function name
}

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let particleCount = NUM_PARTICLES;

// Function to set particle count based on viewport width
function adjustParticleCount() {
    particleCount = window.innerWidth < 768 ? 100 : NUM_PARTICLES;
    
    particles.length = 0; // Clear current particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

// Call on initial load and window resize
adjustParticleCount();
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    adjustParticleCount();
});

renderParticles(); // Start the rendering loop
