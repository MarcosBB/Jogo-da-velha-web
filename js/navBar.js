class MobileNavbar {
    constructor(openButton, closeButton, navList) {
        this.openButton = document.querySelector(openButton)
        this.closeButton = document.querySelector(closeButton)
        this.navList = document.querySelector(navList)
        this.activeClass = "active"
    
        this.handleClick = this.handleClick.bind(this)
    }
        
    handleClick() {
        this.navList.classList.toggle(this.activeClass)
    }

    init() {
        this.openButton.addEventListener("click", this.handleClick)
        this.closeButton.addEventListener("click", this.handleClick)
        return this
    }
}
var clickTimeout

let slider = document.querySelector('.menu-options-option-slider')
slider.addEventListener("mousedown", function () {
    clickTimeout = setInterval(function() {
        let slideNumber = document.querySelector('#slide-value')
        slideNumber.innerHTML = slider.value
      }, 0);
});

slider.addEventListener("mouseup", function () {
    clearInterval(clickTimeout);
});

export default MobileNavbar