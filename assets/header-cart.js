class HeaderCart extends HTMLElement {
  constructor() {
    super();
  }

  get sectionId() {
    return this.dataset.sectionId
  }

  connectedCallback(){
    this.cartCount = this.querySelector('div.cart-count')
    this.handleChange = this.handleChange.bind(this)

    this.cartCount.addEventListener('change', this.handleChange)
  }

  handleChange(e) {
    const url = new URL(location.href)
    this.update(url)
  }

  update(url) {
    url.searchParams.set("section-id", this.sectionId)
    fetch(url.toString())
      .then((response) => {
        return response.text()
      })
      .then((html) => {
        const temp = document.createElement('div')
        temp.innerHTML = html        

        document.querySelector('div.cart-count').innerHTML = 
        temp.querySelector('div.cart-count').innerHTML
      })
  }
}

customElements.define("header-cart", HeaderCart)