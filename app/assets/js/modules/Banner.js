import BaseModule from "./BaseModule";

export default class Banner extends BaseModule {
  constructor(el, factory) {
    super(el, factory, 'Banner')
    this.el = el
    this.anchors = this.el.querySelectorAll(".js--trigger")
    this.targets = document.querySelectorAll(".js--anchor-target")

    this.register()
  }

  register() {
    Array.from(this.anchors).forEach(a => {
      a.addEventListener("click", () => {
        const target = a.getAttribute("data-target")
        const targetEl = Array.from(this.targets).filter(t => {
          return t.getAttribute("data-anchor") === target
        })[0]
        targetEl && this.scrollTo(targetEl)
      })
    })
  }

  scrollTo(el) {
    const duration = 500
    const to = el.offsetTop
    const from = window.pageYOffset || document.documentElement.scrollTop
    const startTime = new Date().getTime()

    clearInterval(this.timer)
    this.timer = setInterval(() => {
      const time = new Date().getTime() - startTime
      const step = this.easeInOutQuart(time, from, to - from, duration)
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
