class CollectionProduct extends HTMLElement {
  constructor() {
    super();
  }

  get headerTarget() {
    return this.dataset.headerTarget
  }

  connectedCallback(){
    this.addToCartForm = this.querySelector('form.collection-add-cart')
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addToCartForm.addEventListener('submit', this.handleSubmit)
  }

  handleSubmit(e) {
    e.preventDefault()
    let formData = {
    'items': [{
      'id': this.querySelector('input[name=id]').value,
      'quantity': 1
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

    const addCartBtn = this.querySelector('button')
    let addCartBtnText = addCartBtn.innerHTML
    addCartBtn.innerHTML = 'Added!'
    addCartBtn.disabled = true
    setTimeout(() => {
      addCartBtn.innerHTML = addCartBtnText
      addCartBtn.disabled = false
    }, 500);
  }
}

customElements.define('collection-product', CollectionProduct)