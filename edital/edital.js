document.addEventListener("DOMContentLoaded", () => {
  const materiasContainer = document.getElementById("materiasContainer");
  if (!materiasContainer) return;

  // 1. Pega a configuração do onboarding (onde estão os nomes das matérias)
  const configString = localStorage.getItem("studyn_configuracao_base");
  let materias = [];

  if (configString) {
    try {
      const config = JSON.parse(configString);
      materias = config.materias || [];
    } catch (err) {
      console.error("Erro ao ler config:", err);
    }
  }

  if (materias.length === 0) {
    materiasContainer.innerHTML = "<p>Nenhuma matéria cadastrada. Complete o onboarding!</p>";
    return;
  }

  // 2. Itera sobre as matérias cadastradas
  materias.forEach(nomeMateria => {
    // Normaliza o nome para o link e para a chave (Ex: "Matemática" -> "matematica")
    const slug = nomeMateria
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    // 3. RECUPERA OS DADOS DA MATÉRIA ESPECÍFICA
    // Usamos a mesma chave que você definiu: studyn-planner-matematica
    const STORAGE_KEY = `studyn-planner-${slug}`;
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    // 4. CALCULA O PROGRESSO BASEADO NO QUE ESTÁ SALVO
    // Pegamos todos os valores do objeto (true ou false) e contamos os verdadeiros
    const totalItens = Object.keys(savedData).length;
    const itensConcluidos = Object.values(savedData).filter(status => status === true).length;
    
    // Se a matéria ainda não foi aberta, o total será 0, então evitamos divisão por zero
    const porcentagem = totalItens > 0 ? Math.round((itensConcluidos / totalItens) * 100) : 0;

    // 5. CRIA O CARD NA TELA
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-body">
        <h3>${nomeMateria}</h3>
        <p>Acompanhe seu progresso conforme o edital.</p>
        
        <div class="progress-container" style="background: #eee; border-radius: 10px; height: 10px; margin: 10px 0; overflow: hidden;">
          <div class="progress-bar" style="width: ${porcentagem}%; background: #4CAF50; height: 100%; transition: width 0.5s ease;"></div>
        </div>
        
        <div class="progress-info" style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #666;">
          <span>${porcentagem}% concluído</span>
          <span>${itensConcluidos} tópicos</span>
        </div>
      </div>
    `;

    // 6. REDIRECIONAMENTO
    card.addEventListener("click", () => {
      // Leva para a pasta materias/nome-da-materia.html
      window.location.href = `materias/${slug}.html`;
    });

    materiasContainer.appendChild(card);
  });
});