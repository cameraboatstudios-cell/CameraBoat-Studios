document.addEventListener("DOMContentLoaded", () => {

  const scrollImage = document.querySelector(".scroll-image");
  if (scrollImage) {
    const observer = new IntersectionObserver(
      (entries) => {
        scrollImage.classList.toggle("visible", entries[0].isIntersecting);
      },
      { rootMargin: "-40% 0px" }
    );

    observer.observe(scrollImage);
  }

  const slideImage = document.querySelector(".slide-image");
  let slideTicking = false;

  function toggleSlideImage() {
    if (!slideImage) return;
    const rect = slideImage.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    slideImage.classList.toggle(
      "visible",
      rect.top < windowHeight - 100 && rect.bottom > 100
    );
  }

  window.addEventListener("scroll", () => {
    if (!slideTicking) {
      requestAnimationFrame(() => {
        toggleSlideImage();
        slideTicking = false;
      });
      slideTicking = true;
    }
  });


  const posterTrack = document.querySelector(".poster-track");
  let posters = posterTrack
    ? Array.from(posterTrack.querySelectorAll(".poster"))
    : [];
  let currentPoster = 2; // center index

  if (posterTrack && posters.length > 0) {
    const fragmentBefore = document.createDocumentFragment();
    const fragmentAfter = document.createDocumentFragment();

    posters
      .slice(-3)
      .forEach((p) => fragmentBefore.appendChild(p.cloneNode(true)));
    posters
      .slice(0, 3)
      .forEach((p) => fragmentAfter.appendChild(p.cloneNode(true)));

    posterTrack.prepend(fragmentBefore);
    posterTrack.append(fragmentAfter);

    posters = Array.from(posterTrack.querySelectorAll(".poster"));

    function wrapIndex(i) {
      return (i + posters.length) % posters.length;
    }

    function updateCarousel(noTransition = false) {
      posterTrack.style.transition = noTransition
        ? "none"
        : "transform 0.6s ease";

      posters.forEach((p) => (p.className = "poster"));

      const indices = [
        wrapIndex(currentPoster - 2),
        wrapIndex(currentPoster - 1),
        wrapIndex(currentPoster),
        wrapIndex(currentPoster + 1),
        wrapIndex(currentPoster + 2),
      ];

      const classes = ["left2", "left1", "active", "right1", "right2"];
      indices.forEach((idx, i) => posters[idx]?.classList.add(classes[i]));

      const activePoster = posters[wrapIndex(currentPoster)];
      const bg = document.querySelector(".movie-posters-bg");
      if (bg && activePoster) {
        const img = activePoster.querySelector("img");
        if (img?.src) {
          bg.style.backgroundImage = `url(${img.src})`;
        }
      }

      if (currentPoster >= posters.length - 3) {
        setTimeout(() => {
          currentPoster = 3;
          updateCarousel(true);
        }, 600);
      } else if (currentPoster <= 2) {
        setTimeout(() => {
          currentPoster = posters.length - 4;
          updateCarousel(true);
        }, 600);
      }
    }

    const posterNext = document.querySelector(".poster-next");
    const posterPrev = document.querySelector(".poster-prev");

    posterNext?.addEventListener("click", () => {
      currentPoster++;
      updateCarousel();
    });

    posterPrev?.addEventListener("click", () => {
      currentPoster--;
      updateCarousel();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        currentPoster--;
        updateCarousel();
      } else if (e.key === "ArrowRight") {
        currentPoster++;
        updateCarousel();
      }
    });

    updateCarousel(true);
  }

  let updateTitleSlideFn = null; // will assign later

  const openTitleBtn = document.querySelector("#openTitle");
  openTitleBtn?.addEventListener("click", () => {
    const section = document.querySelector("#title-section");
    if (section) {
      section.classList.remove("hidden");
      section.scrollIntoView({ behavior: "smooth" });

      if (updateTitleSlideFn) {
        setTimeout(() => {
          updateTitleSlideFn();
        }, 50);
      }
    }
  });

  const titleSection = document.querySelector("#title-section");
  const titleSlider = titleSection?.querySelector(".cards_inner");
  let titleCards = titleSection
    ? Array.from(titleSection.querySelectorAll(".card"))
    : [];
  const titlePrevBtn = titleSection?.querySelector(".nav_btn.prev");
  const titleNextBtn = titleSection?.querySelector(".nav_btn.next");

  if (titleSlider && titleCards.length > 0 && titlePrevBtn && titleNextBtn) {

    titleCards.forEach(card => {
      const clone = card.cloneNode(true);
      titleSlider.appendChild(clone);
    });

    titleCards = Array.from(titleSection.querySelectorAll(".card"));

    let titleIndex = 0;

    function getTitleCardWidth() {
      return titleCards[0].offsetWidth + 20; // 20px gap
    }

    function updateTitleSlide(noTransition = false) {
      const w = getTitleCardWidth();

      titleSlider.style.transition = noTransition ? "none" : "transform 0.5s ease";
      titleSlider.style.transform = `translateX(-${titleIndex * w}px)`;
    }

    titleNextBtn.addEventListener("click", () => {
      titleIndex++;
      updateTitleSlide();

      if (titleIndex >= titleCards.length / 2) {
        setTimeout(() => {
          titleIndex = 0;
          updateTitleSlide(true);
        }, 500);
      }
    });

    titlePrevBtn.addEventListener("click", () => {
      titleIndex--;
      if (titleIndex < 0) {
        titleIndex = titleCards.length / 2 - 1;
        updateTitleSlide(true);
        setTimeout(() => {
          titleIndex--;
          updateTitleSlide();
        }, 20);
      } else {
        updateTitleSlide();
      }
    });

    window.addEventListener("resize", () => updateTitleSlide(true));

    updateTitleSlide(true);
  }

});
