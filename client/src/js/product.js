const imagesSmall = document.querySelectorAll('.product__thumb-track img');
const imageMain = document.querySelector('.main__img')
 for( let product = 0 ;product < imagesSmall.length;product++){
    imagesSmall[product].addEventListener('click',()=>{
      imageMain.src =imagesSmall[product].src;
    })
 }

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

