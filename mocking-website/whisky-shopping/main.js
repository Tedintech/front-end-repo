var client = contentful.createClient({
  space: 'mb76cwtq6x7r',
  accessToken: 'DCC4A3vuvnsljNHJ6Jv5AWOWe5nlKRBGIXY8GXmOxk4',
});

//variables

//nav
const navCart = document.querySelector('.cart');
const cartTotal = document.querySelector('.navCart-total');
//cart page
const contentClose = document.querySelector('#content-page-close');
const cartMain = document.querySelector('#cart-main');
const cartContent = document.querySelector('.cart-content');
const contentTotal = document.querySelector('.content-total');
const itemTotal = document.querySelector('.item-total');
//product

const productImg = document.querySelector('.product-img');
const productMain = document.querySelector('.product-main');
const cartClear = document.querySelector('.btn-clear');




let cart = [];
let buttons = [];


  
// class

class Products {  
   async getProducts() {
    let contentful =  await client.getEntries({
      content_type: 'whiskyShopping'});
    let items = contentful.items;
    let products = items.map(item => {
      const {price, title} = item.fields;
      const id = item.sys.id;
      const image = item.fields.image.fields.file.url;
      return {price, title, id, image};
    })
    return products;
  }
}

class Ui {
  setUpAPP(){
    let cart = Storage.getPrevCartItem();
    this.setCartValue(cart);
    cart.forEach(item => {
      this.showCartItem(item);
    })
  }
  showProducts(product){
    let result = '';
    product.forEach(item => {
      result += `
    <div class="product-content">
      <div class="img-container">
        <img class="product-image" src=${item.image} alt="whisky">
        <button class="add-cart" data-id="${item.id}"><i class="fa-solid fa-cart-plus"></i> Add To Cart</button>
      </div>
      <h3 class="product-name">${item.title}</h3>
      <span class="product-price">$${item.price}</span>
    </div>
      `
    })
    let products = document.createElement('div')
    products.classList.add('product-template');
    products.innerHTML = result;
    productMain.appendChild(products);
  }
  getAddButton(){
    const addCart = [...document.querySelectorAll('.add-cart')];
    buttons = addCart;
    addCart.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id ===id);
      if (inCart) {
        button.innerText = 'In Cart';
      }
      
      button.addEventListener('click',(event)=>{
        event.target.innerText = 'In Cart';
        event.target.disabled = true;
        //get product from products
        let cartItem = {...Storage.getProducts(id), amount: 1};
        //add product to the cart
        cart = [...cart, cartItem];
        //save cart to local storage
        Storage.saveCartItem(cart);
        //set cart value
        this.setCartValue(cart);
        //display cart item
        this.showCartItem(cartItem);
        //show the cart
      })
    })
  }
  setCartValue(cart){
    let tempTotal = 0;
    let itemTotal = 0;
    cart.map(item=> {
      tempTotal += item.price * item.amount;
      itemTotal += item.amount;
    })
    cartTotal.innerText = itemTotal;
    if (cart.length){
    contentTotal.innerText = "Your Total: $" + tempTotal;
    } else {
      contentTotal.innerText = "Your Cart is Empty ";
    }
    
  }

  showCartItem(cartItem){
    let result = '';
    let div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = result += `
    <img class="item-img" src=${cartItem.image} alt="">
    <div class="item-total">
      <span class="item-name">${cartItem.title}</span>
      <span class="item-total"></span>
      <span><a href="#" class="btn-remove" data-id="${cartItem.id}">remove</a></span>
    </div>
    <div class="amount-controll">
      <a href="#" class="amount-add"><i data-id="${cartItem.id}" class="fa fa-angle-up item-add" aria-hidden="true" ></i></a>
      <span class="item-amount" data-id="${cartItem.id}">${cartItem.amount}</span>
      <a href="#" class="amount-add"><i data-id="${cartItem.id}" class="fa fa-angle-down item-minus" aria-hidden="true" ></i></a>
    </div>
    `
    cartContent.appendChild(div);
  }
  cartLogic(){
    cartClear.addEventListener('click',()=>{
      this.clearCart()});

    cartContent.addEventListener('click',event=>{
      if (event.target.classList.contains("btn-remove")){
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement.parentElement);
        buttons.forEach(item => {
          if (item.dataset.id === id){
            item.disabled = false;
          }
        })
        this.removeItem(id);
      }
      else if (event.target.classList.contains('item-add')){
        let amountAdd = event.target;
        let id = amountAdd.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount += 1;
        // render added amount immediately
        let addItems = [...document.querySelectorAll('.item-amount')];
        let selectedItem = addItems.find((item)=>item.dataset.id === id);
        selectedItem.innerHTML = `${tempItem.amount}`;

        this.setCartValue(cart);
        Storage.saveCartItem(cart);
      }
      else if (event.target.classList.contains('item-minus')){
        let amountMinus = event.target;
        let id = amountMinus.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        if (tempItem.amount > 0){
          tempItem.amount -= 1;
        }
        // render minused amount immediately
        let minusItems = [...document.querySelectorAll('.item-amount')];
        let selectedItem = minusItems.find((item)=> item.dataset.id === id);
        selectedItem.innerHTML = `${tempItem.amount}`;

        this.setCartValue(cart);
        Storage.saveCartItem(cart);
      }
    })
    }
    
  clearCart() {
    let inCart = document.querySelectorAll('.cart-item');
    if(inCart){
      for (let i = 0; i < inCart.length; i ++){
        cartContent.removeChild(inCart[i]);
      }
    }
    let cartItem = cart.map(item => item.id);
    cartItem.forEach(id => {
      this.removeItem(id); 
      
    });
    this.setCartValue(cart);

    }
  removeItem(id){
    let removeId = buttons.find(item => item.dataset.id === id);
    removeId.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Add To Cart`;
    //disable false
    cart = cart.filter(item => item.id !== id);
    
    Storage.saveCartItem(cart);
    }
  
 

  }
  

  
class Storage {
  static setProduct(product){
    localStorage.setItem('products', JSON.stringify(product));
  }
  static getProducts(id){
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(item => item.id === id);
  }
  static saveCartItem(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  static getPrevCartItem(){
    return localStorage.getItem('cart')
    ?cart = JSON.parse(localStorage.getItem('cart'))
    :[];
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  navCart.addEventListener('mouseover', ()=>{
    cartMain.classList.remove('hidden');
  });
  contentClose.addEventListener('click', ()=>{
    cartMain.classList.add('hidden');
  });
  
  
  const products = new Products();
  const ui = new Ui;
  ui.setUpAPP();
  products.getProducts().then(product => {
    ui.showProducts(product);
    Storage.setProduct(product);
  }).then(()=>{
    ui.getAddButton();
    ui.cartLogic();
  });
  
  
})
  



