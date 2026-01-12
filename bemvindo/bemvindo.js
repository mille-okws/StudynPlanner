// landing.js — onboarding simples e confiável

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".onboarding-form");
  const inputNome = document.getElementById("nome");

  // se o usuário já passou pelo onboarding, pula direto
  const hasCycle = localStorage.getItem("hasStudyCycle");
  const userName = localStorage.getItem("userName");

  if (hasCycle && userName) {
    window.location.href = "ciclos.html";
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = inputNome.value.trim();

    if (nome.length < 2) {
      inputNome.focus();
      return;
    }

    // salva dados básicos
    localStorage.setItem("userName", nome);
    localStorage.setItem("onboardingStep", "name");

    // próximo passo do fluxo
    window.location.href = "/ciclos/ciclos.html";
  });
});
