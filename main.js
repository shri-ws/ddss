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

// Fetch images list from the backend and start slideshow
fetch('/images')  // Backend API endpoint returning image URLs
    .then(response => response.json())
    .then(images => {
        startSlideshow(images);
    });
