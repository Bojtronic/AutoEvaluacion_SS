const carouselTrack = document.getElementById("carouselTrack");
const items = document.querySelectorAll(".carousel-item");
const startBtn = document.getElementById("startBtn");

let currentIndex = 0;
const totalItems = items.length;

function updateCarousel() {
    carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    items.forEach((item, index) => {
        item.classList.toggle("active", index === currentIndex);
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
}

// Cambio automático cada 4 segundos
setInterval(nextSlide, 4000);

// Redirección a la página del test
startBtn.addEventListener("click", () => {
    window.location.href = "/html/login.html";
});
