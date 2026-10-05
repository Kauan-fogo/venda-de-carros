document.addEventListener("DOMContentLoaded", () => {
  // Inicializações
  initTheme();
  initCalculator();
  initFilters();
});

/* ==========================================================================
   1. GERENCIAMENTO DE TEMA (DARK / LIGHT MODE)
   ========================================================================== */
const themeToggleBtn = document.getElementById("themeToggle");
const themeText = themeToggleBtn.querySelector(".theme-text");
const htmlElement = document.documentElement;

function initTheme() {
  // Verifica o tema salvo no localStorage ou usa a preferência do sistema
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  if (savedTheme === "light" || (!savedTheme && systemPrefersLight)) {
    enableLightTheme();
  } else {
    enableDarkTheme();
  }
}

function enableLightTheme() {
  htmlElement.classList.remove("dark");
  htmlElement.classList.add("light");
  themeText.textContent = "Modo Escuro";
  localStorage.setItem("theme", "light");
}

function enableDarkTheme() {
  htmlElement.classList.remove("light");
  htmlElement.classList.add("dark");
  themeText.textContent = "Modo Claro";
  localStorage.setItem("theme", "dark");
}

// Evento do clique no botão de alternar tema
themeToggleBtn.addEventListener("click", () => {
  if (htmlElement.classList.contains("dark")) {
    enableLightTheme();
  } else {
    enableDarkTheme();
  }
});

/* ==========================================================================
   2. FILTRAGEM DO ESTOQUE
   ========================================================================== */
function initFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const carCards = document.querySelectorAll(".car-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Atualiza botão ativo
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      // Oculta/Exibe cards com transição
      carCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filterValue === "todos" || filterValue === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   3. CALCULADORA DE FINANCIAMENTO
   ========================================================================== */
const carValueInput = document.getElementById("carValue");
const entryValueInput = document.getElementById("entryValue");
const installmentsSelect = document.getElementById("installments");
const installmentResult = document.getElementById("installmentResult");

function initCalculator() {
  carValueInput.addEventListener("input", calculateInstallments);
  entryValueInput.addEventListener("input", calculateInstallments);
  installmentsSelect.addEventListener("change", calculateInstallments);

  calculateInstallments();
}

function calculateInstallments() {
  const carValue = parseFloat(carValueInput.value) || 0;
  const entryValue = parseFloat(entryValueInput.value) || 0;
  const months = parseInt(installmentsSelect.value) || 36;
  
  // Taxa de juros de exemplo (1.49% a.m.)
  const monthlyRate = 0.0149; 

  const loanAmount = carValue - entryValue;

  if (loanAmount <= 0) {
    installmentResult.textContent = "R$ 0,00";
    return;
  }

  // Fórmula do Coeficiente de Financiamento (Tabela Price)
  const pmpt = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months))) / 
               (Math.pow(1 + monthlyRate, months) - 1);

  // Formatação em Moeda (BRL)
  installmentResult.textContent = pmpt.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

/* ==========================================================================
   4. MODAL DE CONTATO / INTERESSE
   ========================================================================== */
const modal = document.getElementById("contactModal");
const modalTitle = document.getElementById("modalTitle");

function openModal(carName) {
  modalTitle.textContent = `Interesse: ${carName}`;
  modal.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
}

// Fechar modal ao clicar fora da caixa do conteúdo
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function handleFormSubmit(event) {
  event.preventDefault();
  alert("Obrigado pelo interesse! Um de nossos consultores entrará em contato em instantes.");
  closeModal();
  event.target.reset();
}