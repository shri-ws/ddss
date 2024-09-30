const danceStyles = [
    { style: "Classical", image: "static/img/classical.jpg", description: "Experience the grace of Bharatanatyam and Kathak." },
    { style: "Bollywood", image: "static/img/bollywood.jpg", description: "Dance to the latest Bollywood hits!" },
    { style: "Zumba", image: "static/img/zumba.jpg", description: "Get fit with fun and energetic Zumba routines." },
    { style: "Mehndi", image: "static/img/mehndi.jpg", description: "Celebrate with traditional Mehndi dance performances." },
    { style: "Wedding Choreography", image: "static/img/wedding.jpg", description: "Perfect moves for your special day." }
];

let currentStyleIndex = 0;
const homeSection = document.querySelector('#home');
const styleTitle = document.querySelector('#style-title');
const styleDescription = document.querySelector('#style-description');

function changeDanceStyle() {
    const currentStyle = danceStyles[currentStyleIndex];
    homeSection.style.backgroundImage = `url(${currentStyle.image})`;
    styleTitle.textContent = currentStyle.style;
    styleDescription.textContent = currentStyle.description;
    currentStyleIndex = (currentStyleIndex + 1) % danceStyles.length;
}

// Set initial style
changeDanceStyle();

// Automatically change style every 5 seconds
setInterval(changeDanceStyle, 5000);
