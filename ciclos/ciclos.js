// ciclos.js — Studyn Planner
// Versão FINAL, coerente com onboarding, dificuldade e ciclofinal
// Responsável por: horas reais do usuário + matérias base

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     CHAVES (CONTRATO GLOBAL)
  ===================================================== */

  const CHAVE_CONFIG        = "studyn_configuracao_base";
  const CHAVE_ONBOARDING    = "studyn_onboarding_status";
  const CHAVE_HORAS_SEMANA  = "studyn_horas_semanais";

  /* =====================================================
     ESTADO CENTRAL
  ===================================================== */

  const estado = {
    horasPorDia: {
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0
    },
    horasSemana: 0,
    materias: [] // { nome, id, percentual }
  };

  /* =====================================================
     UTILIDADES
  ===================================================== */

  const arredondar = n =>
    Math.round(n * 10) / 10;

  const gerarId = nome =>
    nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

  const soma = arr =>
    arr.reduce((a, b) => a + b, 0);

  /* =====================================================
     CARGA INICIAL
  ===================================================== */

  function carregar() {

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
      console.error("Studyn Planner — matérias inválidas.");
      return;
    }

    /* ---------- matérias base ---------- */

    const percentualBase = 100 / config.materias.length;

    estado.materias = config.materias.map(nome => ({
      nome,
      id: gerarId(nome),
      percentual: percentualBase
    }));

    /* ---------- restauração de horas ---------- */

    document
      .querySelectorAll("input[data-day]")
      .forEach(input => {

        const dia = input.dataset.day;
        const valor = Number(input.value) || 0;

        estado.horasPorDia[dia] = valor;
      });

    recalcular();
  }

  /* =====================================================
     RECÁLCULO CENTRAL
  ===================================================== */

  function recalcular() {

    estado.horasSemana = soma(
      Object.values(estado.horasPorDia)
    );

    /* ---------- persistência REAL ---------- */
    localStorage.setItem(
      CHAVE_HORAS_SEMANA,
      estado.horasSemana
    );

    /* ---------- topo ---------- */

    const weeklyDisplay =
      document.getElementById("weeklyHoursDisplay");

    if (weeklyDisplay) {
      weeklyDisplay.textContent =
        `${arredondar(estado.horasSemana)}h`;
    }

    renderMaterias();
  }

  /* =====================================================
     RENDERIZAÇÃO DAS MATÉRIAS
  ===================================================== */

  function renderMaterias() {

    const container =
      document.getElementById("subjectsList");

    if (!container) return;

    container.innerHTML = "";

    estado.materias.forEach(materia => {

      const horas = arredondar(
        (materia.percentual / 100) *
        estado.horasSemana
      );

      const card = document.createElement("div");
      card.className = "subject-card";

      card.innerHTML = `
        <strong>${materia.nome}</strong>
        <span>${horas}h / semana</span>
      `;

      container.appendChild(card);
    });
  }

  /* =====================================================
     INTERAÇÕES — BOTÕES + INPUT
  ===================================================== */

  document.addEventListener("click", e => {

    const botao = e.target.closest(
      ".stepper-btn[data-day]"
    );

    if (!botao) return;

    const dia = botao.dataset.day;
    const acao = botao.dataset.action;

    const input = document.querySelector(
      `input[data-day="${dia}"]`
    );

    if (!input) return;

    let valor = Number(input.value) || 0;
    valor += acao === "increase" ? 1 : -1;
    valor = Math.max(0, valor);

    input.value = valor;
    estado.horasPorDia[dia] = valor;

    recalcular();
  });

  document.addEventListener("change", e => {

    if (!e.target.matches("input[data-day]")) return;

    const dia = e.target.dataset.day;
    const valor = Math.max(0, Number(e.target.value) || 0);

    e.target.value = valor;
    estado.horasPorDia[dia] = valor;

    recalcular();
  });

  /* =====================================================
     BOTÃO — CONTINUAR
  ===================================================== */

  const botaoContinuar =
    document.getElementById("recalculateCycle");

  if (botaoContinuar) {
    botaoContinuar.addEventListener("click", () => {

      // garantia final de persistência
      localStorage.setItem(
        CHAVE_HORAS_SEMANA,
        estado.horasSemana
      );

      window.location.href = "dificuldade.html";
    });
  }

  /* =====================================================
     INIT
  ===================================================== */

  carregar();

});
