const leftArrow = document.querySelector('.arrow-left');
const rightArrow = document.querySelector('.arrow-right');
const imgSlide = document.querySelector('.img__silde');
const slides = document.querySelectorAll('.img__item');
let index = 0;
let isTransitioning = false;
let autoSlideInterval;

// Clone slide đầu và cuối để tạo hiệu ứng vô tận
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

imgSlide.appendChild(firstClone);
imgSlide.insertBefore(lastClone, imgSlide.firstChild);

const totalSlides = slides.length + 2; // đã thêm 2 clone
imgSlide.style.transform = `translateX(calc(-100% - 20px))`; // bắt đầu ở slide 0 thực

function setTransition(enable) {
  imgSlide.style.transition = enable ? '0.5s' : 'none';
}

function goToSlide(idx) {
  setTransition(true);
  imgSlide.style.transform = `translateX(calc(${(idx + 1) * -100}% - ${(idx + 1) * 20}px))`;
  updateIndicators();
}

function moveSlide(direction) {
  if (isTransitioning) return;
  isTransitioning = true;
  index += direction;
  goToSlide(index);
}

rightArrow.addEventListener('click', () => {
  moveSlide(1);
  resetAutoSlide();
});

leftArrow.addEventListener('click', () => {
  moveSlide(-1);
  resetAutoSlide();
});

imgSlide.addEventListener('transitionend', () => {
  // Nếu đang ở clone cuối (sau ảnh cuối), nhảy về ảnh đầu thực
  if (index === slides.length) {
    setTransition(false);
    imgSlide.style.transform = `translateX(calc(-100% - 20px))`;
    index = 0;
  }
  // Nếu đang ở clone đầu (trước ảnh đầu), nhảy về ảnh cuối thực
  if (index === -1) {
    setTransition(false);
    imgSlide.style.transform = `translateX(calc(${slides.length * -100}% - ${slides.length * 20}px))`;
    index = slides.length - 1;
  }
  setTimeout(() => { isTransitioning = false; }, 20);
});

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    moveSlide(1);
  }, 3000);
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Khởi tạo vị trí ban đầu
setTransition(false);
imgSlide.style.transform = `translateX(calc(-100% - 20px))`;
startAutoSlide();

// --- Indicator ---
const indicatorContainer = document.querySelector('.banner-indicators');
function renderIndicators() {
  indicatorContainer.innerHTML = '';
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('span');
    dot.className = 'banner-indicator-dot' + (i === index ? ' active' : '');
    dot.addEventListener('click', () => {
      if (index !== i) {
        index = i;
        goToSlide(index);
        resetAutoSlide();
        updateIndicators();
      }
    });
    indicatorContainer.appendChild(dot);
  }
}
function updateIndicators() {
  const dots = indicatorContainer.querySelectorAll('.banner-indicator-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// Gọi sau mỗi lần chuyển slide
function goToSlide(idx) {
  setTransition(true);
  imgSlide.style.transform = `translateX(calc(${(idx + 1) * -100}% - ${(idx + 1) * 20}px))`;
  updateIndicators();
}

// Gọi khi khởi tạo
renderIndicators();
updateIndicators();