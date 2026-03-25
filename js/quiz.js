const state = {
  selectedTask: '',
  customTask: '',
  selectedGeo: '',
  customGeo: '',
  selectedPriority: '',
  selectedPayment: '',
  currentStep: 1,
};

const steps = [
  {
    title: 'Для чего вам нужны прокси?',
    options: ['Facebook', 'Google', 'SEO / парсинг', 'Мультиаккаунт', 'Арбитраж / реклама', 'Другое'],
    stateKey: 'selectedTask',
    customKey: 'customTask',
    customPlaceholder: 'Коротко опишите задачу',
    hasCustom: true,
  },
  {
    title: 'Какое гео вам нужно?',
    options: ['СНГ', 'Северная Америка', 'Европа', 'Азия', 'Другое'],
    stateKey: 'selectedGeo',
    customKey: 'customGeo',
    customPlaceholder: 'Введите нужное гео',
    hasCustom: true,
  },
  {
    title: 'Что для вас важнее всего?',
    options: ['Самая низкая цена', 'Стабильность', 'Хорошее качество IP', 'Быстрый старт', 'Лучший баланс цены и качества'],
    stateKey: 'selectedPriority',
    hasCustom: false,
  },
  {
    title: 'Как вам удобнее оплачивать?',
    options: ['Криптовалютой', 'Картой', 'paypal', 'capitalist', 'Неважно'],
    stateKey: 'selectedPayment',
    hasCustom: false,
  },
];

const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');
const questionTitle = document.getElementById('question-title');
const optionsContainer = document.getElementById('options-container');
const customInputWrap = document.getElementById('custom-input-wrap');
const customInput = document.getElementById('custom-input');
const backButton = document.getElementById('back-btn');
const nextButton = document.getElementById('next-btn');

function getCurrentStepConfig() {
  return steps[state.currentStep - 1];
}

function isStepValid(stepConfig) {
  const selectedValue = state[stepConfig.stateKey];
  if (!selectedValue) {
    return false;
  }

  if (stepConfig.hasCustom && selectedValue === 'Другое') {
    const customValue = state[stepConfig.customKey];
    return customValue.trim().length > 0;
  }

  return true;
}

function updateActionButtons() {
  const stepConfig = getCurrentStepConfig();
  backButton.disabled = state.currentStep === 1;
  nextButton.disabled = !isStepValid(stepConfig);
}

function renderOptions(stepConfig) {
  optionsContainer.innerHTML = '';

  stepConfig.options.forEach((option) => {
    const optionButton = document.createElement('button');
    optionButton.type = 'button';
    optionButton.className = 'quiz-option';
    optionButton.textContent = option;

    if (state[stepConfig.stateKey] === option) {
      optionButton.classList.add('is-selected');
    }

    optionButton.addEventListener('click', () => {
      state[stepConfig.stateKey] = option;
      if (stepConfig.hasCustom && option !== 'Другое') {
        state[stepConfig.customKey] = '';
      }
      render();
    });

    optionsContainer.appendChild(optionButton);
  });
}

function renderCustomInput(stepConfig) {
  if (!stepConfig.hasCustom || state[stepConfig.stateKey] !== 'Другое') {
    customInputWrap.hidden = true;
    customInput.value = '';
    return;
  }

  customInputWrap.hidden = false;
  customInput.placeholder = stepConfig.customPlaceholder;
  customInput.value = state[stepConfig.customKey] || '';
}

function renderProgress() {
  progressText.textContent = `${state.currentStep}/4`;
  progressFill.style.width = `${(state.currentStep / 4) * 100}%`;
}

function render() {
  const stepConfig = getCurrentStepConfig();
  questionTitle.textContent = stepConfig.title;

  renderProgress();
  renderOptions(stepConfig);
  renderCustomInput(stepConfig);
  updateActionButtons();
}

customInput.addEventListener('input', () => {
  const stepConfig = getCurrentStepConfig();
  if (!stepConfig.hasCustom) {
    return;
  }

  state[stepConfig.customKey] = customInput.value;
  updateActionButtons();
});

backButton.addEventListener('click', () => {
  if (state.currentStep > 1) {
    state.currentStep -= 1;
    render();
  }
});

nextButton.addEventListener('click', () => {
  const stepConfig = getCurrentStepConfig();
  if (!isStepValid(stepConfig)) {
    return;
  }

  if (state.currentStep < steps.length) {
    state.currentStep += 1;
    render();
  }
});

render();
