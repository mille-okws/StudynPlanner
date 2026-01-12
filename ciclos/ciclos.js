document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     ESTADO CENTRAL
  ===================================================== */

  const state = {
    weeklyHours: 0,
    dailyHours: {
      mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0
    },
    subjects: []
  };

  /* =====================================================
     UTILIDADES
  ===================================================== */

  const clamp = (v, min = 0, max = Infinity) =>
    Math.min(Math.max(v, min), max);

  const roundToHalf = (n) =>
    Math.round(n * 2) / 2;

  const sum = arr => arr.reduce((a, b) => a + b, 0);

  /* =====================================================
     CÁLCULOS DERIVADOS (REAIS)
  ===================================================== */

  function totalDailyHours() {
    return sum(Object.values(state.dailyHours));
  }

  function subjectHours(subject) {
    return roundToHalf((subject.percentage / 100) * state.weeklyHours);
  }

  /* =====================================================
     UI — RESUMO
  ===================================================== */

  function updateSummary() {
    document.getElementById("weeklyHoursDisplay").textContent =
      state.weeklyHours ? `${state.weeklyHours.toFixed(1)}h` : "0h";

    document.getElementById("programmedHoursDisplay").textContent =
      `${totalDailyHours().toFixed(1)}h`;

    updateDayProgress();
  }

  function updateDayProgress() {
    const todayKey = ["sun","mon","tue","wed","thu","fri","sat"][new Date().getDay()];
    const planned = state.dailyHours[todayKey] || 0;
    const pct = planned > 0
      ? clamp((planned / state.weeklyHours) * 100, 0, 100)
      : 0;

    document.getElementById("dayProgressBar").style.width = `${pct}%`;
    document.getElementById("dayProgressLabel").textContent =
      `${pct.toFixed(0)}% do dia organizado`;
  }

  /* =====================================================
     DISTRIBUIÇÃO AUTOMÁTICA
  ===================================================== */

  function distributeWeeklyToDays() {
    const days = Object.keys(state.dailyHours);
    const perDay = roundToHalf(state.weeklyHours / days.length);

    days.forEach(d => {
      state.dailyHours[d] = perDay;
      const input = document.querySelector(`input[data-day="${d}"]`);
      if (input) input.value = perDay.toFixed(1);
    });
  }

  function recalcWeeklyFromDays() {
    state.weeklyHours = roundToHalf(totalDailyHours());
    document.getElementById("weeklyHours").value =
      state.weeklyHours.toFixed(1);
  }

  /* =====================================================
     STEPPERS (HORAS)
  ===================================================== */

  document.addEventListener("click", e => {
    const btn = e.target.closest(".stepper-btn");
    if (!btn || btn.dataset.subjStep) return;

    const step = 0.5;
    const action = btn.dataset.action;

    if (btn.dataset.target === "weeklyHours") {
      const input = document.getElementById("weeklyHours");
      let val = parseFloat(input.value) || 0;
      val += action === "increase" ? step : -step;
      state.weeklyHours = clamp(roundToHalf(val), 0, 168);
      input.value = state.weeklyHours.toFixed(1);

      distributeWeeklyToDays();
      renderSubjects();
      updateSummary();
    }

    if (btn.dataset.day) {
      const input = document.querySelector(`input[data-day="${btn.dataset.day}"]`);
      let val = parseFloat(input.value) || 0;
      val += action === "increase" ? step : -step;
      val = clamp(roundToHalf(val), 0, 24);

      input.value = val.toFixed(1);
      state.dailyHours[btn.dataset.day] = val;

      recalcWeeklyFromDays();
      renderSubjects();
      updateSummary();
    }
  });

  document.addEventListener("change", e => {
    const el = e.target;
    if (!el.dataset.day && el.id !== "weeklyHours") return;

    const val = clamp(roundToHalf(parseFloat(el.value) || 0), 0, 168);
    el.value = val.toFixed(1);

    if (el.id === "weeklyHours") {
      state.weeklyHours = val;
      distributeWeeklyToDays();
    }

    if (el.dataset.day) {
      state.dailyHours[el.dataset.day] = val;
      recalcWeeklyFromDays();
    }

    renderSubjects();
    updateSummary();
  });

  /* =====================================================
     MATÉRIAS
  ===================================================== */

  document.getElementById("addSubject").addEventListener("click", () => {
    const name = prompt("Nome da matéria:");
    if (!name) return;

    state.subjects.push({
      id: crypto.randomUUID(),
      name,
      percentage: 0
    });

    renderSubjects();
    updateSummary();
  });

  function renderSubjects() {
    const container = document.getElementById("subjectsList");
    container.innerHTML = "";

    state.subjects.forEach(subj => {
      const hours = subjectHours(subj);

      const card = document.createElement("div");
      card.className = "subject-card";

      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>${subj.name}</strong>
          <span style="font-size:.85rem;color:#8b949e;">
            ${hours.toFixed(1)}h
          </span>
        </div>

        <div class="stepper" style="margin-top:10px;">
          <button class="stepper-btn" data-subj-step="down" data-id="${subj.id}">−</button>
          <input type="number" value="${subj.percentage}" min="0" max="100" data-subj-id="${subj.id}">
          <button class="stepper-btn" data-subj-step="up" data-id="${subj.id}">+</button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-subj-step]");
    if (!btn) return;

    const subj = state.subjects.find(s => s.id === btn.dataset.id);
    if (!subj) return;

    subj.percentage = clamp(
      subj.percentage + (btn.dataset.subjStep === "up" ? 5 : -5),
      0, 100
    );

    renderSubjects();
  });

  /* =====================================================
     BOTÃO = SALVAR
  ===================================================== */

  document.getElementById("recalculateCycle").addEventListener("click", () => {
    console.log("Ciclo salvo:", structuredClone(state));

    alert("Ciclo salvo com sucesso!");
  });

  updateSummary();
});
