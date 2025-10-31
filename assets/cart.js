class CartItem extends HTMLElement {
  constructor() {
    super();
    this.debouncedHandleChange = this.debounce(this.handleChange.bind(this), 500)
  }

  get sectionId() {
    return this.dataset.sectionId
  }

  get headerTarget() {
    return this.dataset.headerTarget
  }

  get itemKey() {
    return this.dataset.itemKey
  }

  connectedCallback() {
    this.quantityButtons = this.querySelectorAll('button.quantity')
    this.input = this.querySelector('input')
    this.handleClick = this.handleClick.bind(this)

    this.quantityButtons.forEach((button) => {
      button.addEventListener('click', this.handleClick) 
    })
    this.input.addEventListener('input', this.debouncedHandleChange)
  }

  handleClick(e) {
    const input = this.querySelector('input')
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

  handleChange(e) {
    const input = this.querySelector('input')
    this.updateItemQty(input.value)
  }

  updateItemQty(qty) {
    const updates = {
      'id': this.itemKey,
      'quantity': parseInt(qty)
    }

    fetch(window.Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    }).then(response => {
      const url = new URL(location.href)
      this.updateSection(url)
      document.querySelector(this.headerTarget)
        .dispatchEvent(new Event('change', {bubbles: true}))
    })
    .catch((error) => {
      console.error('Error:', error);
    }); 
  }

  updateSection(url) {
    url.searchParams.set("section-id", this.sectionId)
    fetch(url.toString())
      .then((response) => {
        return response.text()
      })
      .then((html) => {
        const temp = document.createElement('div')
        temp.innerHTML = html        

        document.querySelector('.cart-main').innerHTML = 
        temp.querySelector('.cart-main').innerHTML
      })

      url.searchParams.delete("section-id")
      window.history.pushState({}, "", url.toString())
  }

  debounce(func, delay) {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), delay);
    }
  }
}

customElements.define("cart-item", CartItem)