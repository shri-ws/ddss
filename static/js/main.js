const images = {{ slideshow_images|tojson }};
let currentImageIndex = 0;
const homeSection = document.querySelector('#home');

function changeBackground() {
    homeSection.style.backgroundImage = `url(${images[currentImageIndex]})`;
    homeSection.style.backgroundSize = 'cover';
    homeSection.style.backgroundPosition = 'center';
    homeSection.style.transition = 'background-image 1s ease-in-out';
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

// Set initial background
changeBackground();

// Automatically change the background every 5 seconds
setInterval(changeBackground, 5001);