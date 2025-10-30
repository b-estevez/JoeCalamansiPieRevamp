class ProductItem extends HTMLElement {
  constructor() {
    super();
  }

  get headerTarget() {
    return this.dataset.headerTarget
  }

  connectedCallback(){
    this.addToCartForm = this.querySelector('form.product-add-cart')
    this.quantityButtons = this.querySelectorAll('button.quantity')
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addToCartForm.addEventListener('submit', this.handleSubmit)
    this.quantityButtons.forEach((button) => {
      button.addEventListener('click', this.handleClick) 
    })
    
  }

  handleClick(e) {
    const input = this.querySelector('#quantityInput')
    const action = e.currentTarget.dataset.type
    
    switch(action) {
      case 'increment':
        input.value++
        break;
      case 'decrement':
        if (input.value > 0) {
          input.value--
        }
        break;
      case 'remove-item':
        input.value = 0
    }

    input.dispatchEvent(new Event('input', {bubbles: true}))
  }

  handleSubmit(e) {
    e.preventDefault()
    let formData = {
    'items': [{
      'id': this.querySelector('input[name=id]').value,
      'quantity': this.querySelector('input').value
      }]
    }

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then((response) => {
      document.querySelector(this.headerTarget)
        .dispatchEvent(new Event('change', {bubbles: true}))
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    const addCartBtn = this.querySelector('#product-add-to-cart-btn')
    let addCartBtnText = addCartBtn.innerHTML
    addCartBtn.innerHTML = 'Added!'
    addCartBtn.disabled = true
    setTimeout(() => {
      addCartBtn.innerHTML = addCartBtnText
      addCartBtn.disabled = false
    }, 500);
  }
}

customElements.define("product-item", ProductItem)



// Product Image Controls

const largeImage = document.querySelector(`.large-product-image`);
const productImageContainer = document.querySelector(`#product-images`);


function swapImage(event){
  if(event.target.classList.contains("mini-product-image")){

    if(largeImage.src != event.target.src)

      largeImage.style.opacity = 0;
      setTimeout(() => {
        largeImage.src = event.target.src;
      }, 350);
    // largeImage.style.opacity = 1; 
  }
}

productImageContainer.addEventListener('click',swapImage);
largeImage.addEventListener('transitionend',(e)=> e.target.style.opacity = 1);