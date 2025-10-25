class CollectionSort extends HTMLElement {
  constructor() {
    super();
  }

  get sectionId() {
    return this.dataset.sectionId
  }

  connectedCallback() {
    this.sort = this.querySelector('ul.sort-options')
    this.handleClickSort = this.handleClickSort.bind(this)

    this.sort.addEventListener('click', this.handleClickSort)
  }

  handleClickSort(e) {
    const sort_by = e.target.dataset.sortValue
    const url = new URL('', window.location.href)

    url.searchParams.delete('sort_by')
    url.searchParams.set('sort_by', sort_by)

    this.update(url)
  }

  update(url) {
    url.searchParams.set('section-id', this.sectionId)
    fetch(url.toString())
      .then((response) => {
        return response.text()
      })
      .then((html) => {
        const temp = document.createElement('div')
        temp.innerHTML = html        

        document.querySelector('.collection-main').innerHTML = 
        temp.querySelector('.collection-main').innerHTML
      })

      url.searchParams.delete("section-id")
      window.history.pushState({}, "", url.toString())
  }
}

customElements.define("collection-sort", CollectionSort)