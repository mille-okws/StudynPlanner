// bemvindo.js — Onboarding completo Studyn Planner (LOCK 100%)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".onboarding-form");
  const inputNome = document.getElementById("nome");
  const selectObjetivo = document.getElementById("objetivo");

  if (!form || !inputNome || !selectObjetivo) {
    console.error("Studyn Planner — elementos do onboarding não encontrados.");
    return;
  }

  /* ===============================
     RECUPERAÇÃO DE DADOS SALVOS
  =============================== */

  const nomeSalvo = localStorage.getItem("studyn_nome_usuario");
  const objetivoSalvo = localStorage.getItem("studyn_objetivo_principal");

  if (nomeSalvo) inputNome.value = nomeSalvo;
  if (objetivoSalvo) selectObjetivo.value = objetivoSalvo;

  /* ===============================
     CONFIGURAÇÕES POR OBJETIVO
  =============================== */

  const STUDYN_CONFIGS = {
    enem: {
      tipo: "vestibular",
      cargaSemanal: 30,
      revisoes: "3-7-30",
      materias: [
        "Linguagens",
        "Matemática",
        "Ciências Humanas",
        "Ciências da Natureza",
        "Redação"
      ]
    },

    fuvest: {
      tipo: "vestibular",
      cargaSemanal: 35,
      revisoes: "1-7-21",
      materias: [
        "Português",
        "Literatura",
        "Matemática",
        "História",
        "Geografia",
        "Física",
        "Química",
        "Biologia"
      ]
    },

    ita: {
      tipo: "militar-engenharia",
      cargaSemanal: 45,
      revisoes: "1-7-14",
      materias: [
        "Matemática",
        "Física",
        "Química",
        "Inglês"
      ]
    },

    ime: {
      tipo: "militar-engenharia",
      cargaSemanal: 45,
      revisoes: "1-7-14",
      materias: [
        "Matemática",
        "Física",
        "Química",
        "Português"
      ]
    },

    "colegio-naval": {
      tipo: "militar",
      cargaSemanal: 35,
      revisoes: "3-7-21",
      materias: [
        "Matemática",
        "Português",
        "Inglês",
        "Estudos Navais"
      ]
    },

    "escola-naval": {
      tipo: "militar",
      cargaSemanal: 40,
      revisoes: "1-7-21",
      materias: [
        "Matemática",
        "Português",
        "Física",
        "Inglês"
      ]
    },

    efomm: {
      tipo: "marinha-mercante",
      cargaSemanal: 40,
      revisoes: "3-7-21",
      materias: [
        "Matemática",
        "Português",
        "Física",
        "Inglês"
      ]
    },

    afa: {
      tipo: "militar-aeronautica",
      cargaSemanal: 45,
      revisoes: "1-7-14",
      materias: [
        "Matemática",
        "Física",
        "Português",
        "Inglês"
      ]
    },

    outros: {
      tipo: "personalizado",
      cargaSemanal: 25,
      revisoes: "7-21-45",
      materias: []
    }
  };

  /* ===============================
     SUBMIT DO ONBOARDING
  =============================== */

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = inputNome.value.trim();
    let objetivoSelecionado = selectObjetivo.value.trim().toLowerCase();

    if (!nome || !objetivoSelecionado) {
      alert("Preencha seu nome e selecione um objetivo.");
      return;
    }

    /* ===============================
       NORMALIZAÇÃO (LOCK TOTAL)
    =============================== */

    if (objetivoSelecionado === "ita/ime" || objetivoSelecionado === "ita-ime") {
      objetivoSelecionado = "ita";
    }

    if (!STUDYN_CONFIGS[objetivoSelecionado]) {
      console.warn("Objetivo não reconhecido — usando modo personalizado.");
      objetivoSelecionado = "outros";
    }

    const configuracaoFinal = STUDYN_CONFIGS[objetivoSelecionado];

    /* ===============================
       PERSISTÊNCIA ISOLADA
    =============================== */

    localStorage.setItem("studyn_nome_usuario", nome);
    localStorage.setItem("studyn_objetivo_principal", objetivoSelecionado);
    localStorage.setItem(
      "studyn_configuracao_base",
      JSON.stringify(configuracaoFinal)
    );
    localStorage.setItem("studyn_onboarding_status", "completo");

    /* ===============================
       REDIRECIONAMENTO
    =============================== */

    window.location.href = "ciclos/ciclos.html";
  });
});
