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
  

export default MobileNavbar