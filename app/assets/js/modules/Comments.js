import BaseModule from "./BaseModule";
import axios from "axios"

export default class Comments extends BaseModule {
  constructor(el, factory) {
    super(el, factory, 'Comments')
    this.endPoint = el.getAttribute("data-end-point")
    this.btnLoadMore = el.querySelector(".js--load-more")
    this.container = el.querySelector(".comment-list")
    this.totalHolder = el.querySelector(".total")
    this.total = 0
    this.limit = 10
    this.last = 0

    this.register()
  }

  register() {
    axios.get(this.endPoint).then(({data}) => {
      this.comments = data.comments
      this.init(data.comments)
      this.btnLoadMore.addEventListener("click", () => {
        this.loadMore()
      })
    })
  }

  init(comments) {
    this.comments = comments
    this.total = this.comments.length
    this.totalHolder.innerHTML = this.total
    this.loadMore()
  }
  
  loadMore() {
    let nextLast = this.last + this.limit
    nextLast = nextLast > this.total ? this.total : nextLast

    for (let i = this.last; i < nextLast; i++) {
      const p = document.createElement("p")
      p.classList.add("comment")
      p.innerHTML = this.comments[i]
      this.container.appendChild(p)
    }

    this.last = nextLast
    if (this.last >= this.total) {
      this.btnLoadMore.hidden = true
    }
  }
}
