async function loadCategoryProducts() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');

  const container = document.getElementById('product-list');
  const titleEl = document.getElementById('category-title');

  if (!category) {
    container.innerHTML = '<p>Không tìm thấy danh mục.</p>';
    return;
  }

  titleEl.textContent = `${category}`;

  try {
    const res = await fetch('http://localhost:3000/products');
    if (!res.ok) throw new Error('Không thể tải sản phẩm');

    const products = await res.json();
   const filtered = products.filter(p =>
   p.category?.trim().toLowerCase() === category.trim().toLowerCase()
);

    if (filtered.length === 0) {
      container.innerHTML = '<p>Không có sản phẩm nào trong danh mục này.</p>';
      return;
    }

    container.innerHTML = '';
    filtered.forEach(product => {
      const productId = product.product_id;
      const item = document.createElement('article');
      item.className = 'product__item';

      const imageUrl = product.thumbnail_url || './src/img/placeholder.png';
      const productName = product.product_name || 'Sản phẩm không tên';
      const price = product.discount_price
        ? `${Number(product.discount_price).toLocaleString()} ₫`
        : 'Liên hệ';

      item.innerHTML = `
        <div class="product__tag product__tag--new">Mới</div>
        <img src="${imageUrl}" alt="${productName}" class="img__product">
        <div class="content__product">
          <h4 class="title__product">${productName}</h4>
          <span class="product__price-new">${price}</span>
          <span class="status__product selling">Đang bán chạy</span>
        </div>
        <button class="btn" onclick="location.href='product.html?id=${productId}'">Chọn</button>
      `;

      container.appendChild(item);
    });
  } catch (err) {
    console.error('Lỗi khi tải sản phẩm theo danh mục:', err);
    container.innerHTML = '<p>Không thể tải danh mục. Vui lòng thử lại.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadCategoryProducts);
