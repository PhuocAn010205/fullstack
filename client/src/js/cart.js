function formatVND(value) {
    if (typeof value !== 'number') {
        console.warn('Giá trị không hợp lệ:', value);
        return '0 đ';
    }
    return value.toLocaleString('vi-VN') + ' đ';
}

function updateCartBadge() {
    let count = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            count++;
        }
    });

    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

function updateCart() {
    let total = 0;

    document.querySelectorAll('.cart-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const qtyInput = item.querySelector('.quantity-input');
        const unitPriceElement = item.querySelector('.unit-price');
        const subtotalElement = item.querySelector('.subtotal');

        let qty = parseInt(qtyInput.value.replace(/[^\d]/g, '')) || 1;
        qty = Math.max(1, qty);
        qtyInput.value = qty;

        const unitPrice = parseInt(unitPriceElement.textContent.replace(/\./g, '').replace(/[^\d]/g, '')) || 0;
        const subtotal = qty * unitPrice;

        if (subtotalElement) {
            subtotalElement.textContent = formatVND(subtotal);
        }

        if (checkbox && checkbox.checked) {
            total += subtotal;
        }
    });

    const totalFormatted = formatVND(total);
    const totalElement = document.getElementById('total');
    if (totalElement) totalElement.textContent = totalFormatted;

    const tmpPriceElement = document.querySelector('.tmp-price');
    if (tmpPriceElement) tmpPriceElement.textContent = totalFormatted;

    updateCartBadge();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.cart-item').forEach(item => {
        const btnMinus = item.querySelector('.btn-minus');
        const btnPlus = item.querySelector('.btn-plus');
        const qtyInput = item.querySelector('.quantity-input');
        const checkbox = item.querySelector('input[type="checkbox"]');

        if (btnMinus) {
            btnMinus.addEventListener('click', () => {
                let qty = parseInt(qtyInput.value.replace(/[^\d]/g, '')) || 1;
                qty = Math.max(1, qty - 1);
                qtyInput.value = qty;
                updateCart();
            });
        }

        if (btnPlus) {
            btnPlus.addEventListener('click', () => {
                let qty = parseInt(qtyInput.value.replace(/[^\d]/g, '')) || 1;
                qtyInput.value = qty + 1;
                updateCart();
            });
        }

        if (qtyInput) {
            qtyInput.addEventListener('input', () => {
                qtyInput.value = qtyInput.value.replace(/[^0-9]/g, '');
                updateCart();
            });
        }

        if (checkbox) {
            checkbox.addEventListener('change', updateCart);
        }
    });

    updateCart();
});
