// dificuldade.js — Studyn Planner (versão robusta e final)

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     CHAVES (CONTRATO GLOBAL)
  ===================================================== */

  const CHAVE_CONFIG       = "studyn_configuracao_base";
  const CHAVE_ONBOARDING   = "studyn_onboarding_status";
  const CHAVE_DIFICULDADE  = "studyn_difficulty";
  const CHAVE_HORAS_SEMANA  = "studyn_horas_semanais";


  /* =====================================================
     ESTADO CENTRAL
  ===================================================== */

  const estado = {
    objetivo: null,
    materias: [] // { nome, id, dificuldade }
  };

  /* =====================================================
     UTILIDADES
  ===================================================== */

  const gerarId = nome =>
    nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

  /* =====================================================
     CARGA INICIAL
  ===================================================== */

  function carregarMaterias() {

    if (localStorage.getItem(CHAVE_ONBOARDING) !== "completo") {
      console.error("Studyn Planner — onboarding não concluído.");
      return;
    }

    const configRaw = localStorage.getItem(CHAVE_CONFIG);
    if (!configRaw) {
      console.error("Studyn Planner — configuração base ausente.");
      return;
    }

    const config = JSON.parse(configRaw);

    if (!Array.isArray(config.materias)) {
      console.error("Studyn Planner — lista de matérias inválida.");
      return;
    }

    estado.objetivo = localStorage.getItem(
      "studyn_objetivo_principal"
    );

    estado.materias = config.materias.map(nome => ({
      nome,
      id: gerarId(nome),
      dificuldade: 3 // valor neutro inicial
    }));

    restaurarDificuldadesSalvas();
    render();
  }

  /* =====================================================
     RESTAURAÇÃO (CASO USUÁRIO VOLTE NA PÁGINA)
  ===================================================== */

  function restaurarDificuldadesSalvas() {
    const salvo = localStorage.getItem(CHAVE_DIFICULDADE);
    if (!salvo) return;

    try {
      const dados = JSON.parse(salvo);
      if (!dados.materias) return;

      estado.materias.forEach(mat => {
        if (dados.materias[mat.id]) {
          mat.dificuldade = dados.materias[mat.id];
        }
      });
    } catch (e) {
      console.warn("Studyn Planner — dificuldade salva inválida.");
    }
  }

  /* =====================================================
     RENDERIZAÇÃO
  ===================================================== */

  function render() {
    const container =
      document.getElementById("subjectsContainer");

    if (!container) return;

    container.innerHTML = "";

    estado.materias.forEach((mat, index) => {

      const card = document.createElement("div");
      card.className = "subject-card";

      card.innerHTML = `
        <div class="subject-header">
          <span class="subject-name">${mat.nome}</span>
          <span class="difficulty-value">
            Nível ${mat.dificuldade}
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value="${mat.dificuldade}"
          data-index="${index}"
        />

        <div class="difficulty-labels">
          <span>Muito fácil</span>
          <span>Muito difícil</span>
        </div>
      `;

      container.appendChild(card);
    });
  }

  /* =====================================================
     INTERAÇÃO — SLIDER
  ===================================================== */

  document.addEventListener("input", e => {

    if (!e.target.matches('input[type="range"]')) return;

    const index = Number(e.target.dataset.index);
    const valor = Number(e.target.value);

    if (!estado.materias[index]) return;

    estado.materias[index].dificuldade = valor;

    const valueSpan = e.target
      .closest(".subject-card")
      ?.querySelector(".difficulty-value");

    if (valueSpan) {
      valueSpan.textContent = `Nível ${valor}`;
    }
  });

  /* =====================================================
     SALVAR E AVANÇAR
  ===================================================== */

  const botaoSalvar =
    document.getElementById("saveDifficulty");

  if (botaoSalvar) {
    botaoSalvar.addEventListener("click", () => {

      const payload = {
        objetivo: estado.objetivo,
        materias: {}
      };

      estado.materias.forEach(mat => {
        payload.materias[mat.id] = mat.dificuldade;
      });

      localStorage.setItem(
        CHAVE_DIFICULDADE,
        JSON.stringify(payload)
      );

      window.location.href = "ciclofinal.html";
    });
  }

  /* =====================================================
     INIT
  ===================================================== */

  carregarMaterias();

});
