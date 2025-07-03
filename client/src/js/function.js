const leftArrow = document.querySelector('.arrow-left');
const rightArrow = document.querySelector('.arrow-right');
const imgSlide = document.querySelector('.img__silde');
const slides = [...document.querySelectorAll('.img__item')];
const indicatorContainer = document.querySelector('.banner-indicators');
const productList = document.querySelectorAll('.pro__list');
let index = 0, isTransitioning = false, autoSlideInterval;

// Clone để tạo hiệu ứng vô tận
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);
imgSlide.append(lastClone, ...slides, firstClone);

const totalSlides = slides.length;

// Hàm hỗ trợ
const setTransform = (i, enable = true) => {
  imgSlide.style.transition = enable ? '0.5s' : 'none';
  imgSlide.style.transform = `translateX(calc(${(i + 1) * -100}% - ${(i + 1) * 20}px))`;
};

const moveSlide = (dir) => {
  if (isTransitioning) return;
  isTransitioning = true;
  index += dir;
  setTransform(index);
  updateIndicators();
};

const resetAutoSlide = () => {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => moveSlide(1), 3000);
};

// Sự kiện chuyển tiếp
imgSlide.addEventListener('transitionend', () => {
  if (index === totalSlides) {
    index = 0;
    setTransform(index, false);
  } else if (index === -1) {
    index = totalSlides - 1;
    setTransform(index, false);
  }
  setTimeout(() => isTransitioning = false, 20);
});

// Sự kiện nút
leftArrow.onclick = () => (moveSlide(-1), resetAutoSlide());
rightArrow.onclick = () => (moveSlide(1), resetAutoSlide());

// Indicator
const renderIndicators = () => {
  indicatorContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'banner-indicator-dot' + (i === index ? ' active' : '');
    dot.onclick = () => {
      if (index !== i) {
        index = i;
        setTransform(index);
        resetAutoSlide();
        updateIndicators();
      }
    };
    indicatorContainer.append(dot);
  });
};

const updateIndicators = () => {
  indicatorContainer.querySelectorAll('.banner-indicator-dot')
    .forEach((dot, i) => dot.classList.toggle('active', i === index));
};

// Khởi tạo
setTransform(index, false);
renderIndicators();
resetAutoSlide();

// products best nút trượt 

document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.pro_best .pro__track');
  const lists = document.querySelectorAll('.pro_best .pro__list');
  const leftBtn = document.querySelector('.pro_best .arrow-left');
  const rightBtn = document.querySelector('.pro_best .arrow-right');

  let current = 0;

  function updateSlider() {
    // Di chuyển track sang trái theo số trang hiện tại
    track.style.transform = `translateX(-${current * 100}%)`;
    leftBtn.classList.toggle('disabled', current === 0);
    rightBtn.classList.toggle('disabled', current === lists.length - 1);
  }

  leftBtn.addEventListener('click', function () {
    if (current > 0) {
      current--;
      updateSlider();
    }
  });

  rightBtn.addEventListener('click', function () {
    if (current < lists.length - 1) {
      current++;
      updateSlider();
    }
  });

  updateSlider();
});
// click product images

const imagesSmall = document.querySelectorAll('.product__thumb-track img');
const imgaeMain = document.querySelector('.main__img')
 for( let product = 0 ;product < imagesSmall.length;product++){
    imagesSmall[product].addEventListener('click',()=>{
      imgaeMain.src =imagesSmall[product].src;
    })
 }
