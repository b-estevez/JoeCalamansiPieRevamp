class UpsellProducts extends HTMLElement {
  constructor() {
    super();
  }

  get exludedProducts() {
    return JSON.parse(this.dataset.exludedProducts)
  }

  connectedCallback() {
    let excluded = []
    this.pageType = this.dataset.pageType
    this.upsellProducts = this.querySelectorAll("div[data-product-handle]")

    switch (this.pageType) {
      case 'product':
        excluded = [window.location.pathname.replace('/products/', '')]
        break;
      case 'cart':
        excluded = [...this.exludedProducts]
        break;
    }

    this.makeProductInvisible(excluded)

  }

  makeProductInvisible(productsToExclude) {
    this.upsellProducts.forEach((upsellProduct) => {
      const upsellHandle = upsellProduct.dataset.productHandle
      console.log(productsToExclude, upsellHandle, productsToExclude.includes(upsellHandle))
      if (productsToExclude.includes(upsellHandle)){
        console.log(upsellHandle, productsToExclude)
       upsellProduct.style.display = 'none'
      }
    })
  }
}

customElements.define('upsell-products', UpsellProducts)