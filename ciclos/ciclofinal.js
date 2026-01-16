// ciclofinal.js — Studyn Planner
// Versão FINAL, usando horas reais + dificuldade + objetivo
// Resultado coerente do ciclo de estudos

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     CHAVES (CONTRATO GLOBAL)
  ===================================================== */

  const CHAVE_CONFIG       = "studyn_configuracao_base";
  const CHAVE_ONBOARDING   = "studyn_onboarding_status";
  const CHAVE_DIFICULDADE  = "studyn_difficulty";
  const CHAVE_HORAS_SEMANA  = "studyn_horas_semanais";
  
  /* =====================================================
     UTILIDADES
  ===================================================== */

  const arredondar = n =>
    Math.round(n * 10) / 10;

  const normalizar = nome =>
    nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

  /* =====================================================
     CARGA DE DADOS
  ===================================================== */

  const configRaw = localStorage.getItem(CHAVE_CONFIG);
  const diffRaw   = localStorage.getItem(CHAVE_DIFICULDADE);
  const horasRaw  = localStorage.getItem(CHAVE_HORAS_SEMANA);

  if (!configRaw) {
    console.error("Studyn Planner — configuração base não encontrada.");
    return;
  }

  const config = JSON.parse(configRaw);

  if (!Array.isArray(config.materias)) {
    console.error("Studyn Planner — lista de matérias inválida.");
    return;
  }

  const horasSemana = Number(horasRaw) || 0;

  const dificuldades = diffRaw
    ? JSON.parse(diffRaw)
    : null;

  const dificuldadesMap =
    dificuldades?.materias || {};

  /* =====================================================
     PROCESSAMENTO — PESOS POR DIFICULDADE
  ===================================================== */

  const materiasProcessadas = config.materias.map(nome => {
    const id = normalizar(nome);

    const dificuldade =
      dificuldadesMap[id] ?? 3;

    return {
      nome,
      id,
      dificuldade,
      peso: dificuldade, // regra atual: peso linear
      horas: 0
    };
  });

  const somaPesos = materiasProcessadas.reduce(
    (s, m) => s + m.peso,
    0
  );

  materiasProcessadas.forEach(m => {
    m.horas = somaPesos > 0
      ? arredondar((m.peso / somaPesos) * horasSemana)
      : 0;
  });

  /* =====================================================
     VISÃO GERAL DO CICLO
  ===================================================== */

  const totalHoursEl =
    document.getElementById("totalHours");
  const totalSubjectsEl =
    document.getElementById("totalSubjects");
  const averageDifficultyEl =
    document.getElementById("averageDifficulty");
  const idealHoursEl =
    document.getElementById("idealHours");
  const cycleStatusEl =
    document.getElementById("cycleStatus");

  if (totalHoursEl) {
    totalHoursEl.textContent = `${horasSemana}h`;
  }

  if (totalSubjectsEl) {
    totalSubjectsEl.textContent =
      materiasProcessadas.length;
  }

  const mediaDificuldade = materiasProcessadas.length
    ? arredondar(
        materiasProcessadas.reduce(
          (s, m) => s + m.dificuldade, 0
        ) / materiasProcessadas.length
      )
    : 0;

  if (averageDifficultyEl) {
    averageDifficultyEl.textContent =
      mediaDificuldade;
  }

  /* ---------- comparação com carga ideal ---------- */

  const cargaIdeal =
    Number(config.cargaSemanal) || 0;

  if (idealHoursEl) {
    idealHoursEl.textContent =
      `${cargaIdeal}h`;
  }

  if (cycleStatusEl) {
    let status = "equilibrado";

    if (horasSemana < cargaIdeal * 0.7) {
      status = "abaixo do ideal";
    } else if (horasSemana > cargaIdeal * 1.2) {
      status = "acima do limite";
    }

    cycleStatusEl.textContent = status;
  }

  /* =====================================================
     RENDERIZAÇÃO FINAL DAS MATÉRIAS
  ===================================================== */

  const container =
    document.getElementById("subjectsResult");

  if (!container) return;

  container.innerHTML = "";

  materiasProcessadas.forEach(m => {

    const row = document.createElement("div");
    row.className = "subject-row";

    row.innerHTML = `
      <div class="subject-info">
        <span class="subject-name">
          ${m.nome}
        </span>
        <span class="subject-meta">
          Dificuldade: ${m.dificuldade}/5
        </span>
      </div>

      <div class="subject-hours">
        ${m.horas}h / semana
      </div>
    `;

    container.appendChild(row);
  });

});
