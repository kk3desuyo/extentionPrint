class ImageSlider extends HTMLElement {
  edge = "start";
  styles = getComputedStyle(this);
  move = parseInt(this.styles?.getPropertyValue("--move"), 10) || 1;
  gap = parseInt(this.styles?.getPropertyValue("--gap"), 10) || 0;
  slider = this.querySelector("[data-slider]");
  navBtns = this.querySelectorAll("[data-nav-btn]");
  image = this.slider?.querySelector("img");
  controller = new AbortController();
  timer;

  constructor() {
    super();
  }

  connectedCallback() {
    if (this.slider) {
      this.detectScrollEdge();
      const { signal } = this.controller;
      this.slider.addEventListener(
        "scroll",
        () => {
          this.debounce(this.detectScrollEdge, 50);
        },
        { signal }
      );
      window.addEventListener(
        "resize",
        () => {
          this.debounce(this.detectScrollEdge, 50);
        },
        { signal }
      );
      this.navBtns.forEach((btn) =>
        btn.addEventListener(
          "click",
          () => {
            this.slider.scrollLeft = this.calcScrollLeft(btn);
          },
          { signal }
        )
      );
    }
  }

  disconnectedCallback() {
    this.controller.abort();
  }

  static get observedAttributes() {
    return ["edge"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.navBtns && name === "edge") {
      this.navBtns.forEach((btn) => btn.removeAttribute("aria-disabled"));
      if (this.navBtns[0] && newValue === "start") {
        this.navBtns[0].setAttribute("aria-disabled", "true");
      } else if (this.navBtns[1] && newValue === "end") {
        this.navBtns[1].setAttribute("aria-disabled", "true");
      }
    }
  }

  detectScrollEdge = () => {
    const scrollLeft = this.slider.scrollLeft;
    const scrollRight =
      this.slider.scrollWidth - (scrollLeft + this.slider.clientWidth);
    if (scrollLeft <= 0) {
      this.edge = "start";
    } else if (scrollRight <= 1) {
      this.edge = "end";
    } else {
      this.edge = "false";
    }
    if (this.getAttribute("edge") !== this.edge) {
      this.setAttribute("edge", this.edge);
    }
  };

  calcScrollLeft = (btn) => {
    const dir = btn.getAttribute("data-nav-btn") === "prev" ? -1 : 1;
    const imageSize = this.image?.clientWidth ?? 300;
    const totalItemsSize = imageSize * this.move;
    const totalGap = this.gap * this.move;
    return this.slider.scrollLeft + dir * (totalItemsSize + totalGap);
  };

  debounce = (fn, interval = 50) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => fn(), interval);
  };
}

customElements.define("image-slider", ImageSlider);
