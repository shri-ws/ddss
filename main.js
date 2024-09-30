let currentImageIndex = 0;

function changeBackground(images) {
    const homeSection = document.querySelector('#home');
    homeSection.style.backgroundImage = `url(${images[currentImageIndex]})`;
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

function startSlideshow(images) {
    changeBackground(images);
    setInterval(() => changeBackground(images), 5000);
}

fetch('/images')  // Fetch image URLs from the backend
    .then(response => response.json())
    .then(images => {
        startSlideshow(images);
    });
