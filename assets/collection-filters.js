class CollectionFilters extends HTMLElement {
  constructor() {
    super();
  }

  get sectionId() {
    return this.dataset.sectionId
  }

  connectedCallback() {
    this.filterInputs = this.querySelectorAll("input")
    this.handleClickAvailability = this.handleClickAvailability.bind(this)
    this.handleChangePrice = this.handleChangePrice.bind(this)
    this.resetPrice = this.resetPrice.bind(this)
    this.resetAvailability = this.resetAvailability.bind(this)

    this.filterInputs.forEach((input) => {
      if (input.name == 'availability'){
        input.addEventListener('change', this.handleClickAvailability)
      }

      if (input.name == 'price'){
        input.addEventListener('keydown', this.handleChangePrice)
      }

    });

    this.querySelector('span.reset-price').addEventListener('click', this.resetPrice)
    this.querySelector('span.reset-availability').addEventListener('click', this.resetAvailability)

  }

  handleClickAvailability(e) {
    const input = e.currentTarget
    const url = new URL(
      input.checked ? input.dataset.addUrl : input.dataset.removeUrl, 
      window.location.origin
    )

    console.log(input)

    this.update(url)
  }

  handleChangePrice(e) {
    if (e.type == "keydown" && e.key == "Enter") {
      const input_min = document.querySelector('#price-min')
      const input_max = document.querySelector('#price-max')
      const url = new URL(location.href)


      url.searchParams.delete(input_min.dataset.param)
      url.searchParams.delete(input_max.dataset.param)
      url.searchParams.set(input_min.dataset.param, input_min.value)
      url.searchParams.set(input_max.dataset.param, input_max.value)

      this.update(url)
    }

  }

  resetPrice(e) {
    const input_min = document.querySelector('#price-min')
    const input_max = document.querySelector('#price-max')
    const reset = e.currentTarget
    const url = new URL(location.href)

    url.searchParams.delete(input_min.dataset.param)
    url.searchParams.delete(input_max.dataset.param)
    url.searchParams.set(input_min.dataset.param, reset.dataset.resetMin)
    url.searchParams.set(input_max.dataset.param, reset.dataset.resetMax)

    this.update(url)

  }

  resetAvailability() {
    const availability = this.querySelectorAll('.availability-popover input')
    const url = new URL(location.href)

    availability.forEach((input) => {
      input.checked = false
      url.searchParams.delete(input.dataset.param)
    })

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

        document.querySelector('.collection-products').innerHTML = 
        temp.querySelector('.collection-products').innerHTML

        document.querySelector('.availability-popover').innerHTML = 
        temp.querySelector('.availability-popover').innerHTML


        document.querySelector('.price-popover').innerHTML =
        temp.querySelector('.price-popover').innerHTML

        this.connectedCallback()
      })


      url.searchParams.delete("section-id")
      window.history.pushState({}, "", url.toString())
  }
}

customElements.define("collection-filter", CollectionFilters)