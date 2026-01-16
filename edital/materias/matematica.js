document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main[data-materia]");
  if (!main) return;

  const materia = main.dataset.materia;
  const checklistContainer = document.getElementById("checklist");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  // Chave única para esta matéria
  const STORAGE_KEY = `studyn-planner-${materia}`;

  const topicosPorMateria = {
    "Números e Operações": [
      "Reconhecer diferentes significados e representações dos números e operações",
      "Identificar padrões numéricos ou princípios de contagem",
      "Resolver situação-problema envolvendo conhecimentos numéricos",
      "Avaliar a razoabilidade de um resultado numérico",
      "Avaliar propostas de intervenção na realidade usando conhecimentos numéricos"
    ],
    "Geometria e Espaço": [
      "Interpretar a localização e movimentação de pessoas/objetos no espaço",
      "Identificar características de figuras planas ou espaciais",
      "Resolver situação-problema envolvendo conhecimentos geométricos",
      "Usar conhecimentos geométricos na seleção de argumentos"
    ],
    "Grandezas e Medidas": [
      "Identificar relações entre grandezas e unidades de medida",
      "Utilizar noção de escalas na leitura de representações",
      "Resolver situação-problema envolvendo medidas de grandezas",
      "Avaliar resultados de medições",
      "Avaliar propostas de intervenção usando grandezas e medidas"
    ],
    "Variação de Grandezas": [
      "Identificar a relação de dependência entre grandezas",
      "Resolver situação-problema envolvendo variação de grandezas",
      "Analisar informações sobre variação de grandezas",
      "Avaliar propostas de intervenção com variação de grandezas"
    ],
    "Álgebra": [
      "Identificar representações algébricas que expressem relações entre grandezas",
      "Interpretar gráficos cartesianos",
      "Resolver situação-problema com modelagem algébrica",
      "Usar conhecimentos algébricos/geométricos em argumentações",
      "Avaliar propostas usando álgebra"
    ],
    "Estatística e Probabilidade": [
      "Interpretar informações de gráficos e tabelas",
      "Resolver problema com dados em tabelas ou gráficos",
      "Analisar informações como recurso de construção de argumentos",
      "Calcular medidas de tendência central e dispersão",
      "Resolver problemas de estatística e probabilidade",
      "Usar estatística e probabilidade como recurso",
      "Avaliar propostas usando conceitos estatísticos"
    ]
  };

  // 1. Carregar dados salvos ou criar objeto vazio
  let savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  // 2. Função para salvar e atualizar progresso
  function updateUI() {
    const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
    const total = checkboxes.length;
    let checkedCount = 0;

    checkboxes.forEach((cb) => {
      // Atualiza o objeto com o estado atual de cada checkbox
      savedData[cb.id] = cb.checked;
      if (cb.checked) {
        checkedCount++;
        cb.parentElement.querySelector("label").classList.add("completed");
      } else {
        cb.parentElement.querySelector("label").classList.remove("completed");
      }
    });

    // Calcula porcentagem
    const percent = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

    // Atualiza Barra e Texto
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${percent}%`;

    // Salva no LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
  }

  // 3. Gerar a lista na tela
  Object.entries(topicosPorMateria).forEach(([secao, topicos]) => {
    const sectionTitle = document.createElement("h2");
    sectionTitle.textContent = secao;
    checklistContainer.appendChild(sectionTitle);

    const ul = document.createElement("ul");
    ul.className = "sub-checklist";

    topicos.forEach((topico, index) => {
      const li = document.createElement("li");
      
      // Criar ID único e imutável (usando a matéria, seção e índice)
      const checkboxId = `${materia}-${secao.replace(/\s+/g, "")}-${index}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = checkboxId;
      
      // Define se começa marcado baseado no que foi salvo
      checkbox.checked = !!savedData[checkboxId];

      const label = document.createElement("label");
      label.htmlFor = checkboxId;
      label.textContent = topico;

      // Evento de clique
      checkbox.addEventListener("change", updateUI);

      li.appendChild(checkbox);
      li.appendChild(label);
      ul.appendChild(li);
    });

    checklistContainer.appendChild(ul);
  });

  // 4. Roda uma vez ao carregar para desenhar o progresso inicial
  updateUI();
});