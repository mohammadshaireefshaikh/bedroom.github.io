/* VARIABLES */
const page = document.getElementById('page'),
      loading = document.getElementById('loading'),
      slider = document.querySelector('.swiper'),
      inner1 = document.getElementById('inner-1'),
      inner2 = document.getElementById('inner-2'),
      inner3 = document.getElementById('inner-3'),
      car = document.querySelector('model-viewer'),
      slideToButtons = document.querySelectorAll('[data-slide-to]'),
      colorButtons = document.querySelectorAll('[data-color]'),
      title = document.querySelectorAll('.title'),
      bgImage = document.querySelector('picture');
  
const innerAnimationActive = {
  duration: 1,
  delay: 0.5,
  ease: Power4.easeOut,
  autoAlpha: 1,
  yPercent: 0,
};
const innerAnimationHidden = {
  duration: 1,
  ease: Power4.easeOut,
  autoAlpha: 0,
  yPercent: -20,
};

/* VERTICAL SLIDER */
const swiper = new Swiper(slider, {
  direction: 'vertical',
  speed: 1500,
  grabCursor: true,
  touchRatio: 2,
  threshold: 1,
  preventInteractionOnTransition: true,
  mousewheel: {
    forceToAxis: true,
  },
  keyboard: {
    enabled: true,
  },
  on: {
    init: () => {
      /* SLIDER & TITLE FADE IN */
      gsap.to(slider, {
        duration: 1,
        ease: Power4.easeOut,
        autoAlpha: 1,
      });
      gsap.to(title, innerAnimationActive);
      
      /* TITLE INFINITE LOOP */
      title.forEach(function (e, i) {
        let row_width = e.getBoundingClientRect().width;
        let row_item_width = e.children[0].getBoundingClientRect().width;
        let offset = ((2 * row_item_width) / row_width) * 100 * -1;
        let duration = 30 * (i + 1);

        gsap.set(e, {
          xPercent: 0
        });

        gsap.to(e, {
          duration: duration,
          ease: "none",
          xPercent: offset,
          repeat: -1
        });
      });
    }
  },
});

/* ON LOAD */
car.addEventListener('load', (event) => {
  /* FADE OUT LOADING SCREEN */
  gsap.to(loading, {
    duration: 1,
    ease: Power4.easeOut,
    autoAlpha: 0,
  });
  
  /* 3D CHARACTERISTICS */
  const materials = car.model.materials,
        paint = materials[0];
  
  /* CHANGE CAR PAINT */
  paint.pbrMetallicRoughness.setBaseColorFactor('#CBD5E1');
  
  /* CAR POSITION */
  const exposure1 = '1',
        orbit1 = '0deg 70deg 10%',
        exposure2 = '1',
        orbit2 = '-60deg 65deg 10%',
        exposure3 = '1',
        orbit3 = '0deg 70deg 10%';
  let target1,
      target2,
      target3;
  
  const setCarPosition = () => {
    if (window.outerWidth <= 900) {
      inner1.classList.add("sm:h-1/5");
      inner2.classList.add("sm:h-1/5");
      target1 = '0m -2.75m -7.5m';
      target2 = '6.3m -3.5m -3.7m';
      target3 = '0m -2.8m -7.9m';
    } else {
      target1 = '0m -2.75m -7.5m';
      target2 = '6.5m -3.4m -3.5m';
      target3 = '0m -2.8m -7.9m';
    }
  }
  setCarPosition();
  
  const carPosition = (exposure, orbit, target) => {
    return (
      {
        duration: 1.5,
        ease: Power4.easeOut,
        attr: {
          ['exposure']: exposure,
          ['camera-orbit']: orbit,
          ['camera-target']: target,
        }
      }
    );
  };
  
  /* ANIMATION ON LOAD */
  gsap.to(car, carPosition(exposure1, orbit1, target1));
  
  /* SLIDE CHANGE */
  swiper.on('slideChange', function () {
    if ( swiper.activeIndex === 0 ) {
      gsap.to(car, carPosition(exposure1, orbit1, target1));
      page.classList.remove('bg-zinc-900');
      page.classList.add('bg-slate-200');
    } else if ( swiper.activeIndex === 1 ) {
      gsap.to(car, carPosition(exposure2, orbit2, target2));
      page.classList.remove('bg-slate-200');
      page.classList.add('bg-zinc-900');
    } else if ( swiper.activeIndex === 2 ) {
      gsap.to(car, carPosition(exposure3, orbit3, target3));
      page.classList.remove('bg-zinc-900');
      page.classList.add('bg-slate-200');
    }
    
    if ( swiper.activeIndex === 0 ) {
      gsap.to(inner1, innerAnimationActive);
      gsap.to(title, innerAnimationActive);
    } else {
      gsap.to(inner1, innerAnimationHidden);
      gsap.to(title, innerAnimationHidden);
    }
    
    if ( swiper.activeIndex === 1 ) {
      gsap.to(inner2, innerAnimationActive);
    } else {
      gsap.to(inner2, innerAnimationHidden);
    }
    
    if ( swiper.activeIndex === 2 ) {
      gsap.to(inner3, innerAnimationActive);
      gsap.to(bgImage, {
        duration: 1,
        delay: 1,
        ease: Power4.easeOut,
        autoAlpha: 1,
        yPercent: -50,
      });
    } else {
      gsap.to(inner3, innerAnimationHidden);
      gsap.to(bgImage, {
        duration: 0.5,
        ease: Power4.easeOut,
        autoAlpha: 0,
        yPercent: 0,
      });
    }
  });
  
  /* WINDOW RESIZE CAR POSITION */
  swiper.on('resize', function () {
    setCarPosition();
    
    if ( swiper.activeIndex === 0 ) {
      gsap.to(car, carPosition(exposure1, orbit1, target1));
    } else if ( swiper.activeIndex === 1 ) {
      gsap.to(car, carPosition(exposure2, orbit2, target2));
    } else if ( swiper.activeIndex === 2 ) {
      gsap.to(car, carPosition(exposure3, orbit3, target3));
    }
  });
  
  /* SLIDE TO */
  slideToButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.slideTo;
      if (index !== undefined) {
        swiper.slideTo(index);
      }
      e.preventDefault();
    });
  });
  
  /* PAINT */
  colorButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      /* CHANGE COLOR */
      const color = e.target.dataset.color;
      if (color !== undefined) {
        paint.pbrMetallicRoughness.setBaseColorFactor(color);
      }
      
      /* BUTTON ACTIVE */
      colorButtons.forEach((otherButton) => {
        otherButton.classList.remove('active');
      });
      e.target.classList.add('active');
      
      e.preventDefault();
    });
  });
});