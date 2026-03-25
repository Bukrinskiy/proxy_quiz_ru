const state = {
  selectedTask: '',
  customTask: '',
  selectedGeo: '',
  customGeo: '',
  selectedPriority: '',
  selectedPayment: '',
  currentStep: 1,
};

const TOTAL_QUESTION_STEPS = 4;
const ANALYSIS_DURATION_MS = 8000;

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

const offers = [
  {
    id: 'fast-mobile-cis',
    name: 'Proxy Stream Mobile',
    description: 'Mobile прокси для быстрого запуска и стабильной работы кабинетов.',
    geo: ['СНГ', 'Европа'],
    taskFit: ['Facebook', 'Арбитраж / реклама', 'Мультиаккаунт'],
    payment: ['Криптовалютой', 'Картой'],
    type: 'Mobile',
    price: 'от $15',
    promo: 'SAVE15',
    reason: 'Идеально подходит под Facebook и арбитражные связки.',
    url: '#offer-1',
    score: 9,
  },
  {
    id: 'seo-resi-global',
    name: 'Global Resi Pool',
    description: 'Резидентские IP с широким покрытием и приоритетом на качество.',
    geo: ['Северная Америка', 'Европа', 'Азия'],
    taskFit: ['SEO / парсинг', 'Google'],
    payment: ['Картой', 'paypal'],
    type: 'Residential',
    price: 'от $24',
    promo: 'RESI10',
    reason: 'Сильный выбор для парсинга и задач, где важен quality score IP.',
    url: '#offer-2',
    score: 8,
  },
  {
    id: 'budget-datacenter',
    name: 'Start DC Lite',
    description: 'Датасентер прокси с низким входом по цене для массовых задач.',
    geo: ['СНГ', 'Европа', 'Азия'],
    taskFit: ['Мультиаккаунт', 'SEO / парсинг', 'Другое'],
    payment: ['Криптовалютой', 'capitalist', 'Неважно'],
    type: 'Datacenter',
    price: 'от $9',
    promo: 'LITE5',
    reason: 'Хорошо подходит, если приоритет — самая низкая цена.',
    url: '#offer-3',
    score: 7,
  },
  {
    id: 'balanced-universal',
    name: 'Proxy Balance Pro',
    description: 'Универсальный тариф с хорошим балансом цены, стабильности и оплаты.',
    geo: ['СНГ', 'Северная Америка', 'Европа', 'Азия'],
    taskFit: ['Facebook', 'Google', 'Арбитраж / реклама', 'Другое'],
    payment: ['Криптовалютой', 'Картой', 'paypal', 'capitalist', 'Неважно'],
    type: 'Mix',
    price: 'от $19',
    promo: 'BALANCE12',
    reason: 'Оптимальный вариант, когда важен баланс цены и качества.',
    url: '#offer-4',
    score: 8,
  },
  {
    id: 'premium-stable',
    name: 'Stable Premium IP',
    description: 'Премиум IP-пул с максимальным упором на стабильность.',
    geo: ['Северная Америка', 'Европа', 'СНГ'],
    taskFit: ['Google', 'Facebook', 'Мультиаккаунт'],
    payment: ['Картой', 'paypal'],
    type: 'Premium Residential',
    price: 'от $29',
    promo: 'STABLE7',
    reason: 'Подходит под стабильный долгосрочный запуск без резких просадок.',
    url: '#offer-5',
    score: 9,
  },
];

const analysisStatuses = [
  'Анализируем доступные предложения',
  'Сравниваем цены и условия',
  'Проверяем доступность нужного гео',
  'Ищем лучшие условия оплаты',
  'Формируем лучший вариант под ваш запрос',
];

const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');
const questionTitle = document.getElementById('question-title');
const optionsContainer = document.getElementById('options-container');
const customInputWrap = document.getElementById('custom-input-wrap');
const customInput = document.getElementById('custom-input');
const backButton = document.getElementById('back-btn');
const nextButton = document.getElementById('next-btn');
const quizQuestionsView = document.getElementById('quiz-questions-view');
const step5View = document.getElementById('step5-view');
const analysisView = document.getElementById('analysis-view');
const resultView = document.getElementById('result-view');
const analysisSummary = document.getElementById('analysis-summary');
const resultSummary = document.getElementById('result-summary');
const analysisStatusText = document.getElementById('analysis-status-text');
const analysisProgressFill = document.getElementById('analysis-progress-fill');
const analysisProgressValue = document.getElementById('analysis-progress-value');
const mainOfferCard = document.getElementById('main-offer-card');
const extraOffersGrid = document.getElementById('extra-offers-grid');

let analysisTimer = null;
let selectedOffers = null;

function getCurrentStepConfig() {
  return steps[state.currentStep - 1];
}

function getFinalValue(selected, custom) {
  if (selected === 'Другое' && custom.trim()) {
    return custom.trim();
  }
  return selected;
}

function getAnswerSummaryItems() {
  return [
    { label: 'Задача', value: getFinalValue(state.selectedTask, state.customTask) || '—' },
    { label: 'Гео', value: getFinalValue(state.selectedGeo, state.customGeo) || '—' },
    { label: 'Приоритет', value: state.selectedPriority || '—' },
    { label: 'Оплата', value: state.selectedPayment || '—' },
  ];
}

function renderSummary(container) {
  const items = getAnswerSummaryItems();
  container.innerHTML = items
    .map((item) => `<p class="summary-item"><span class="summary-item__label">${item.label}:</span> ${item.value}</p>`)
    .join('');
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
  if (state.currentStep === 5) {
    backButton.disabled = false;
    nextButton.hidden = true;
    return;
  }

  const stepConfig = getCurrentStepConfig();
  backButton.disabled = state.currentStep === 1;
  nextButton.hidden = false;
  nextButton.disabled = !isStepValid(stepConfig);
  nextButton.textContent = state.currentStep === TOTAL_QUESTION_STEPS ? 'Подобрать оффер' : 'Далее';
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
  progressText.textContent = `${state.currentStep}/${TOTAL_QUESTION_STEPS}`;
  progressFill.style.width = `${(state.currentStep / TOTAL_QUESTION_STEPS) * 100}%`;
}

function scoreOffer(offer, answers) {
  let score = offer.score;

  if (offer.taskFit.includes(answers.task) || answers.taskIsCustom || offer.taskFit.includes('Другое')) {
    score += 4;
  }

  if (offer.geo.includes(answers.geo) || answers.geoIsCustom) {
    score += 3;
  }

  if (offer.payment.includes(answers.payment) || answers.payment === 'Неважно') {
    score += 2;
  }

  if (answers.priority === 'Самая низкая цена' && offer.price.includes('$9')) {
    score += 4;
  }

  if (answers.priority === 'Стабильность' && offer.type.toLowerCase().includes('premium')) {
    score += 4;
  }

  if (answers.priority === 'Хорошее качество IP' && offer.type.toLowerCase().includes('residential')) {
    score += 4;
  }

  if (answers.priority === 'Быстрый старт' && offer.type.toLowerCase().includes('mobile')) {
    score += 3;
  }

  if (answers.priority === 'Лучший баланс цены и качества' && offer.id === 'balanced-universal') {
    score += 5;
  }

  return score;
}

function selectOffers() {
  const answers = {
    task: state.selectedTask,
    geo: state.selectedGeo,
    payment: state.selectedPayment,
    priority: state.selectedPriority,
    taskIsCustom: state.selectedTask === 'Другое' && !!state.customTask.trim(),
    geoIsCustom: state.selectedGeo === 'Другое' && !!state.customGeo.trim(),
  };

  const scored = offers
    .map((offer) => ({ ...offer, matchScore: scoreOffer(offer, answers) }))
    .sort((a, b) => b.matchScore - a.matchScore);

  return {
    main: scored[0],
    extra: scored.slice(1, 3),
  };
}

function renderOfferCard(offer, variant = 'primary') {
  if (variant === 'primary') {
    return `
      <span class="offer-label">Лучший вариант</span>
      <h2 class="offer-title">${offer.name}</h2>
      <p class="offer-description">${offer.description}</p>
      <div class="offer-meta">
        <p><strong>Гео:</strong> ${offer.geo.join(', ')}</p>
        <p><strong>Тип:</strong> ${offer.type}</p>
        <p><strong>Оплата:</strong> ${offer.payment.join(', ')}</p>
        <p><strong>Цена:</strong> ${offer.price}</p>
        <p><strong>Промокод:</strong> ${offer.promo}</p>
      </div>
      <p class="offer-reason">${offer.reason}</p>
      <a class="btn btn--primary offer-cta" href="${offer.url}">Перейти к офферу</a>
    `;
  }

  return `
    <span class="offer-tag">${variant === 'cheap' ? 'Дешевле' : 'Альтернатива'}</span>
    <h3 class="offer-title">${offer.name}</h3>
    <p class="offer-description">${offer.description}</p>
    <p><strong>Цена:</strong> ${offer.price}</p>
    <p><strong>Промокод:</strong> ${offer.promo}</p>
    <a class="btn btn--secondary offer-cta" href="${offer.url}">Открыть</a>
  `;
}

function startAnalysisAndShowResult() {
  clearInterval(analysisTimer);

  renderSummary(analysisSummary);
  renderSummary(resultSummary);

  selectedOffers = selectOffers();
  mainOfferCard.innerHTML = renderOfferCard(selectedOffers.main, 'primary');

  extraOffersGrid.innerHTML = selectedOffers.extra
    .map((offer, index) => {
      const type = index === 0 ? 'cheap' : 'alt';
      return `<article class="offer-card offer-card--secondary">${renderOfferCard(offer, type)}</article>`;
    })
    .join('');

  analysisView.hidden = false;
  resultView.hidden = true;

  let tick = 0;
  const totalTicks = 80;

  analysisTimer = setInterval(() => {
    tick += 1;
    const progress = Math.min(100, Math.round((tick / totalTicks) * 100));
    const statusIndex = Math.min(
      analysisStatuses.length - 1,
      Math.floor((tick / totalTicks) * analysisStatuses.length),
    );

    analysisStatusText.textContent = analysisStatuses[statusIndex];
    analysisProgressFill.style.width = `${progress}%`;
    analysisProgressValue.textContent = `${progress}%`;

    if (tick >= totalTicks) {
      clearInterval(analysisTimer);
      analysisView.hidden = true;
      resultView.hidden = false;
    }
  }, ANALYSIS_DURATION_MS / totalTicks);
}

function renderStep5() {
  quizQuestionsView.hidden = true;
  step5View.hidden = false;
  progressText.textContent = 'Готово';
  progressFill.style.width = '100%';
  startAnalysisAndShowResult();
}

function renderQuestionStep() {
  const stepConfig = getCurrentStepConfig();
  questionTitle.textContent = stepConfig.title;

  renderProgress();
  renderOptions(stepConfig);
  renderCustomInput(stepConfig);
}

function render() {
  if (state.currentStep === 5) {
    renderStep5();
  } else {
    clearInterval(analysisTimer);
    step5View.hidden = true;
    quizQuestionsView.hidden = false;
    renderQuestionStep();
  }

  updateActionButtons();
}

customInput.addEventListener('input', () => {
  const stepConfig = getCurrentStepConfig();
  if (!stepConfig?.hasCustom) {
    return;
  }

  state[stepConfig.customKey] = customInput.value;
  updateActionButtons();
});

backButton.addEventListener('click', () => {
  if (state.currentStep === 5) {
    state.currentStep = 4;
    render();
    return;
  }

  if (state.currentStep > 1) {
    state.currentStep -= 1;
    render();
  }
});

nextButton.addEventListener('click', () => {
  const stepConfig = getCurrentStepConfig();
  if (!stepConfig || !isStepValid(stepConfig)) {
    return;
  }

  if (state.currentStep < TOTAL_QUESTION_STEPS) {
    state.currentStep += 1;
    render();
    return;
  }

  state.currentStep = 5;
  render();
});

render();
