/* =========================
   DASHBOARD — JS PLACEHOLDER
   ========================= */

/* ---------- TIMER (mock) ---------- */
const timerElement = document.querySelector(".timer");

// tempo fake só pra visual
let tempoSegundos = 2 * 60 * 60 + 45 * 60; // 02:45:00

function formatarTempo(segundos) {
  const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
  const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
  const s = String(segundos % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

if (timerElement) {
  timerElement.textContent = formatarTempo(tempoSegundos);
}

/* ---------- CHECKLIST (placeholder) ---------- */
const checkboxes = document.querySelectorAll(
  ".lista-metas input[type='checkbox']"
);

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    // futuro: salvar estado (localStorage / backend)
    console.log(
      `Meta "${checkbox.parentElement.textContent.trim()}" :`,
      checkbox.checked ? "concluída" : "pendente"
    );
  });
});

/* ---------- RADAR (placeholder visual) ---------- */
const canvas = document.getElementById("radarMaterias");

if (canvas) {
  const ctx = canvas.getContext("2d");

  const materias = [
    { nome: "Dir. Adm", valor: 40 },
    { nome: "Dir. Const", valor: 30 },
    { nome: "R. Lógico", valor: 15 },
    { nome: "Info", valor: 15 },
  ];

  const size = canvas.width;
  const center = size / 2;
  const radius = size * 0.35;

  ctx.translate(center, center);

  // grade
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(0, 0, (radius / 5) * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  // eixos
  materias.forEach((_, i) => {
    const angle = (Math.PI * 2 * i) / materias.length;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius
    );
    ctx.stroke();
  });

  // área
  ctx.beginPath();
  materias.forEach((m, i) => {
    const angle = (Math.PI * 2 * i) / materias.length;
    const r = (m.valor / 100) * radius;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();

  ctx.fillStyle = "rgba(111,220,140,0.35)";
  ctx.strokeStyle = "#6fdc8c";
  ctx.fill();
  ctx.stroke();
}

/* ---------- HOOKS FUTUROS ---------- */
/*
- salvar progresso no localStorage
- sincronizar timer com página foco.html
- tornar radar dinâmico
- transformar dashboard em PWA
- conectar com banco / API
*/
