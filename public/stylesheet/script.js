const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
     navMenu.classList.toggle("active")
})

const slides = document.querySelectorAll(".slide")
const btnLeft = document.querySelector(".slider__btn--left")
const btnRight = document.querySelector(".slider__btn--right")
const dotContainer = document.querySelector(".dots")

const slider = document.querySelector(".slider")
slider.style.transform = "scale(0.7)"

let CurSlide = 0
const maxSlide = slides.length

const createDots = function () {
    slides.forEach(function (_, i) {
        dotContainer.insertAdjacentHTML("beforeend",` <button class="dots__dot" data-slide="${i}"></button>`)
    })
}
createDots()

const activateDots = function(slide){
    document.querySelectorAll(".dots__dot").forEach(dot => dot.classList.remove("dots__dot--active"))
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active")
}
activateDots(0)

const goToSlide = function(slide){
     slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`)
}

 goToSlide(0)

 const nextSlide = function(){
      if(CurSlide === maxSlide - 1){
        CurSlide = 0
    }else {
       CurSlide++ 
    }
    
   goToSlide(CurSlide)
   activateDots(CurSlide)
 }


const prevSlide = function(){
    if(CurSlide === 0){
        CurSlide = maxSlide-1
    } else {
       CurSlide--
    }
   
     goToSlide(CurSlide)
     activateDots(CurSlide)
}
//next slide
 btnRight.addEventListener("click",  nextSlide)
 btnLeft.addEventListener("click",  prevSlide)

 document.addEventListener("keydown", function(e){
    if(e.key === "ArrowLeft") prevSlide()
        e.key === "ArrowRight" && nextSlide()
 })

 dotContainer.addEventListener("click", function(e) {
    if(e.target.classList.contains("dots__dot")) {
        const {slide} = e.target.dataset
        goToSlide(slide)
        activateDots(CurSlide)
    }
 })

 

// lets say CurSlide = 1 
   // i = 0 at first then -100%, 0%, 100%, 200%