// Disable Snap Scroll & go-to-top

const goToTopButton = document.querySelector('.go-to-top');

window.addEventListener('scroll', () => {
const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
const scrollPosition = window.scrollY;

if (scrollPosition > scrollableHeight * 0.9) { // Show button at 90% scroll
goToTopButton.classList.add('visible');
} else {
goToTopButton.classList.remove('visible');
}
});

// Smooth scroll to top and disable scroll snap only for the go-to-top action
goToTopButton.addEventListener('click', (event) => {
event.preventDefault(); // Prevent the default anchor behavior

// Temporarily disable scroll snap for the "go-to-top" action only
const originalScrollSnapTypeHtml = document.documentElement.style.scrollSnapType;
const originalScrollSnapTypeBody = document.body.style.scrollSnapType;
document.documentElement.style.scrollSnapType = 'none';
document.body.style.scrollSnapType = 'none';

// Smooth scroll to top
window.scrollTo({
top: 0,
behavior: 'smooth',
});

// Re-enable scroll snap after smooth scroll completes
setTimeout(() => {
document.documentElement.style.scrollSnapType = originalScrollSnapTypeHtml;
document.body.style.scrollSnapType = originalScrollSnapTypeBody;
}, 800); // Adjust timing based on scroll duration
});

