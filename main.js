const images = [
    "static/img/slideshow/slideshow1.jpg",
    "static/img/slideshow/slideshow2.jpg",
    "static/img/slideshow/slideshow3.jpg"
];

let currentImageIndex = 0;
const homeSection = document.querySelector('#home');

function changeBackground() {
    homeSection.style.backgroundImage = `url(${images[currentImageIndex]})`;
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

// Set initial background
changeBackground();

// Automatically change the background every 5 seconds
setInterval(changeBackground, 5001);
