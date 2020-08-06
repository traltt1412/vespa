import BaseModule from "./BaseModule";

export default class Header extends BaseModule {
  constructor(el, factory) {
    super(el, factory, 'Header')
    this.el = el
    this.hamburger = el.querySelector(".hamburger")
    this.items = el.querySelectorAll(".menu-item")
    this.contents = document.querySelectorAll(".content-dynamic")
    this.itemsHasSub = [...this.items].filter(item => {
      return item.classList.contains("has-sub")
    })

    this.register()
  }

  register() {
    this.items.forEach(item => {
      item.addEventListener("click", e => {
        const targetContent = [...this.contents].filter(c => {
          return c.getAttribute("data-content") === item.getAttribute("data-target")
        })

        if (targetContent.length) {
          this.items.forEach(i => {
            i.classList.remove("active")
          })
          item.classList.add("active")
          const closest = item.closest(".secondary__submenu")
          if (closest) {
            const siblings = this.getSiblings(closest)
            siblings[0].classList.add("active")
          }

          this.contents.forEach(content => {
            content.hidden = true
            // content.querySelector(".right-hidden").classList.remove("fly-in")
          })

          targetContent.forEach(tc => {
            tc.hidden = false
          })

          // setTimeout(() => {
          //   this.scrollTo(targetContent[0])
          //   // targetContent[0].querySelector(".right-hidden").classList.add("fly-in")
          // }, 100)
        }

        if (!item.classList.contains("has-sub")) {
          this.el.classList.remove("expanded")
        }
      })
    })

    this.itemsHasSub.forEach(item => {
      item.addEventListener("click", e => {
        if (item.classList.contains("expanded")) {
          item.classList.remove("expanded")
        } else {
          item.classList.add("expanded")
        }
      })
    })

    this.hamburger.addEventListener("click", e => {
      if (this.el.classList.contains("expanded")) {
        this.el.classList.remove("expanded")
      } else {
        this.el.classList.add("expanded")
      }
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
