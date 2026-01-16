document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // SELECIONA TODOS OS CARDS
  // =============================
  const cards = document.querySelectorAll(".cards .card");

  if (!cards.length) {
    console.warn("Nenhum card encontrado na página.");
    return;
  }

  // =============================
  // TORNA CADA CARD CLICÁVEL
  // =============================
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const link = card.dataset.link;
      if (link) {
        window.location.href = link;
      }
    });

    card.style.cursor = "pointer";
  });

  // =============================
  // SWIPE / DRAG MOBILE & TABLET
  // =============================
  const container = document.querySelector(".cards");
  if (!container) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  // MOUSE
  container.addEventListener("mousedown", e => {
    isDown = true;
    container.classList.add("active-swipe");
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
    container.classList.remove("active-swipe");
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
    container.classList.remove("active-swipe");
  });

  container.addEventListener("mousemove", e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });

  // TOUCH
  let touchStartX = 0;
  let scrollStart = 0;

  container.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].pageX;
    scrollStart = container.scrollLeft;
  });

  container.addEventListener("touchmove", e => {
    const touchX = e.touches[0].pageX;
    const walk = (touchX - touchStartX) * 2;
    container.scrollLeft = scrollStart - walk;
  });
});
