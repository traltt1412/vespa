import BaseModule from "./BaseModule";

export default class ScrollTop extends BaseModule {
  constructor(el, factory) {
    super(el, factory, 'ScrollTop')
    this.el = el
    this.timer = null
    this.scrollTimer = null

    this.register()
  }

  register() {
    this.el.addEventListener("click", () => {
      this.scrollTo(document.querySelector('body'))
    })

    window.addEventListener("scroll", () => {
      this.scrollTimer && clearTimeout(this.scrollTimer)
      this.scrollTimer = setTimeout(() => {
        const top = window.pageYOffset || document.documentElement.scrollTop
        if (top <= 100) {
          this.el.classList.add("hide")
        } else {
          this.el.classList.remove("hide")
        }
      }, 300)
    })
  }

  scrollTo(el) {
    const duration = 500
    const to = el.offsetTop - 20
    const from = window.pageYOffset || document.documentElement.scrollTop
    const startTime = new Date().getTime()

    clearInterval(this.timer)
    this.timer = setInterval(() => {
      const time = new Date().getTime() - startTime
      const step = this.easeInOutQuart(time, from, to - from, duration)
      console.log(step)
      window.scrollTo(0, step)

      if (time >= duration) {
        window.scrollTo(0, to)
        clearInterval(this.timer)
      }
    }, 1000 / 60)
  }

  easeInOutQuart(t, b, c, d) {
    if (t > d) return b + c
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b
  }

  getChildren(n, skipMe) {
    const r = [];
    for (; n; n = n.nextSibling)
      if (n.nodeType == 1 && n != skipMe)
        r.push(n);
    return r;
  }

  getSiblings(n) {
    return this.getChildren(n.parentNode.firstChild, n);
  }
}
