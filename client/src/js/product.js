document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    alert('Không tìm thấy ID sản phẩm. Vui lòng quay lại danh sách.');
    window.location.href = '/';
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/products/${productId}`);
    if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
    const product = await res.json();
     const breadcrumb = document.querySelector('.breadcrumb');
  if (breadcrumb && product.category) {
    breadcrumb.innerHTML = `
      <li>
        <a href="home.html">Trang chủ</a>
        <span>></span>
      </li>
      <li>
        <a href="#!">${product.category}</a>
      </li>
    `;
  }

    const imageRes = await fetch(`http://localhost:3000/api/images/${productId}`);
    const imageData = await imageRes.json();
    const gallery = imageData.map(img => img.image_url);

    document.title = product.product_name || 'Chi tiết sản phẩm';

    const container = document.querySelector('#productDetail');
    container.innerHTML = `
      <div class="product__box">
        <div class="product__card">
          <div class="product__img-big">
            <img class="main__img" src="${product.thumbnail_url}" alt="${product.product_name}">
          </div>
          <div class="product__thumb-slider">
            <div class="product__thumb-track">
              ${gallery.map(url => `<img src="${url}" alt="">`).join('')}
            </div>
          </div>
        </div>
        <div class="product__content">
          <h2 class="heading__title">${product.product_name}</h2>
          <a href="#" class="link">
            <img src="./src/img/real.png" alt="real">
          </a>
          <h2 class="price">${Number(product.current_price).toLocaleString()} ₫</h2>
          <p class="content__desc">Giá đã bao gồm thuế. Phí vận chuyển và các chi phí khác (nếu có) sẽ được thể hiện khi đặt hàng.</p>
          <div class="product-item__action">
            <span class="product-item__like"><i class="fa-solid fa-heart"></i> 25.4k</span>
            <span class="product-item__sold">Đã bán 6.1k</span>
          </div>
          <div class="information">
            <a href="#" class="link__bc"><i class="fa-solid fa-file"></i><span>xem giấy công bố sản phẩm</span></a>
          </div>
          <p class="classify">Phân loại sản phẩm</p>
          <button class="btn btn__type">${product.product_type || 'Chưa phân loại'}</button>
         <div class="about__product">
  <div class="about__product-content">${product.description.replace(/\n/g, ' ')}</div>
</div>
        </div>
      </div>
    `;

    // ✅ Sau khi render HTML xong, gắn sự kiện click vào ảnh nhỏ
    const imagesSmall = document.querySelectorAll('.product__thumb-track img');
    const imageMain = document.querySelector('.main__img');
    imagesSmall.forEach(img => {
      img.addEventListener('click', () => {
        imageMain.src = img.src;
      });
    });

  } catch (err) {
    console.error('❌ Lỗi khi tải chi tiết sản phẩm:', err);
    alert('Có lỗi khi tải sản phẩm. Vui lòng thử lại.');
  }
});

//  tăng giảm sản phẩm

const decreaseBtn =document.getElementById('decreaseQty');
const increasBtn = document.getElementById('increaseQty');
const qtyInput = document.getElementById('qtyInput');

function updateDecrease( ){
  const currentValue = parseInt(qtyInput.value);
  if(currentValue <= parseInt(qtyInput.min)){
    decreaseBtn.classList.add('an');
    decreaseBtn.an = true; /* vô hiệu hóa */
  }else {
    decreaseBtn.classList.remove('an');
    decreaseBtn.an =false;
  }
}
updateDecrease();
decreaseBtn.addEventListener('click',()=>{
     let currentValue = parseInt(qtyInput.value);
     if(currentValue > parseInt(qtyInput.min)){
          qtyInput.value = currentValue - 1 ;
          updateDecrease();
     }
});

increasBtn.addEventListener('click',()=>{
    let currentValue = parseInt(qtyInput.value);
    qtyInput.value = currentValue +1;
 updateDecrease();
});
qtyInput.addEventListener('change',()=> {
    let current = parseInt(qtyInput.value);
    if(isNaN(currentValue)|| currentValue <1){
       qtyInput.value = 1;
    }
    updateDecrease();
});
