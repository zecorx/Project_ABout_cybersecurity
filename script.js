'use strict';

/* Интерактивный тест: вопросы хранятся локально, ответы никуда не отправляются. */
const quizQuestions = [
  {
    question: 'Какую задачу выполняет HTTPS?',
    options: ['Ускоряет процессор устройства', 'Защищает передачу данных с помощью TLS', 'Заменяет HTML на сервере', 'Полностью скрывает сам факт посещения сайта'],
    answer: 1,
    explanation: 'HTTPS использует TLS для защиты конфиденциальности и целостности данных, а также проверки подлинности сервера.'
  },
  {
    question: 'Какой порт обычно используется для HTTPS?',
    options: ['21', '80', '443', '8080'],
    answer: 2,
    explanation: 'Стандартный порт HTTPS — 443. Для обычного HTTP по умолчанию используется порт 80.'
  },
  {
    question: 'Чем DDoS отличается от классической DoS-атаки?',
    options: ['DDoS всегда атакует только базы данных', 'DDoS использует множество распределённых источников', 'DDoS возможна только на смартфонах', 'Между ними нет различий'],
    answer: 1,
    explanation: 'Ключевое отличие DDoS — распределённость нагрузки между множеством устройств или источников.'
  },
  {
    question: 'Что называют ботнетом?',
    options: ['Сеть устройств, заражённых вредоносным ПО и управляемых без ведома владельцев', 'Резервную копию сайта', 'Программу для оформления веб-страниц', 'Тип цифрового сертификата'],
    answer: 0,
    explanation: 'Ботнет — сеть устройств, которые могут выполнять команды вредоносной программы без ведома владельцев.'
  },
  {
    question: 'На каком уровне OSI обычно рассматривают HTTP-запросы?',
    options: ['L1 — физический', 'L3 — сетевой', 'L4 — транспортный', 'L7 — прикладной'],
    answer: 3,
    explanation: 'HTTP относится к прикладному уровню, который обозначают как L7.'
  },
  {
    question: 'Для чего предназначен WAF?',
    options: ['Для охлаждения серверной комнаты', 'Для проверки и фильтрации запросов к веб-приложению', 'Для хранения доменных имён', 'Для замены протокола HTTPS'],
    answer: 1,
    explanation: 'WAF анализирует веб-запросы и помогает блокировать обращения, которые нарушают заданные правила безопасности.'
  }
];

function initQuiz() {
  const root = document.getElementById('quiz-root');
  if (!root) return;

  const progress = document.getElementById('quiz-progress');
  const progressFill = document.getElementById('quiz-progress-fill');
  const scoreLabel = document.getElementById('quiz-score-label');
  const questionTitle = document.getElementById('quiz-question');
  const optionsBox = document.getElementById('quiz-options');
  const feedback = document.getElementById('quiz-feedback');
  const checkButton = document.getElementById('quiz-check');
  const nextButton = document.getElementById('quiz-next');
  const resultBox = document.getElementById('quiz-result');
  const resultTitle = document.getElementById('quiz-result-title');
  const resultText = document.getElementById('quiz-result-text');
  const restartButton = document.getElementById('quiz-restart');

  let currentIndex = 0;
  let score = 0;
  let selectedIndex = null;
  let answered = false;

  function renderQuestion() {
    const current = quizQuestions[currentIndex];
    selectedIndex = null;
    answered = false;
    progress.textContent = `Вопрос ${currentIndex + 1} из ${quizQuestions.length}`;
    progressFill.style.width = `${(currentIndex / quizQuestions.length) * 100}%`;
    scoreLabel.textContent = `${score} ${score === 1 ? 'балл' : score >= 2 && score <= 4 ? 'балла' : 'баллов'}`;
    questionTitle.textContent = current.question;
    optionsBox.replaceChildren();
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
    checkButton.hidden = false;
    checkButton.disabled = true;
    nextButton.hidden = true;

    current.options.forEach((option, index) => {
      const label = document.createElement('label');
      label.className = 'quiz-option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'quiz-answer';
      input.value = String(index);
      input.addEventListener('change', () => {
        if (answered) return;
        selectedIndex = index;
        checkButton.disabled = false;
        optionsBox.querySelectorAll('.quiz-option').forEach((item) => item.classList.remove('selected'));
        label.classList.add('selected');
      });
      const marker = document.createElement('span');
      marker.className = 'option-marker';
      marker.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span');
      text.textContent = option;
      label.append(input, marker, text);
      optionsBox.append(label);
    });
  }

  function showResult() {
    root.hidden = true;
    resultBox.hidden = false;
    progress.textContent = 'Готово';
    progressFill.style.width = '100%';
    scoreLabel.textContent = `${score} / ${quizQuestions.length}`;
    const ratio = score / quizQuestions.length;
    resultTitle.textContent = ratio === 1 ? 'Безупречно!' : ratio >= 0.66 ? 'Хороший результат!' : 'Есть что повторить!';
    resultText.textContent = `Правильных ответов: ${score} из ${quizQuestions.length}. ${ratio >= 0.66 ? 'Основные понятия уже знакомы — можно двигаться дальше.' : 'Вернись к разделам сайта и попробуй пройти тест ещё раз.'}`;
  }

  checkButton.addEventListener('click', () => {
    if (selectedIndex === null || answered) return;
    answered = true;
    const current = quizQuestions[currentIndex];
    const correct = selectedIndex === current.answer;
    if (correct) score += 1;
    const chosenLabel = optionsBox.querySelectorAll('.quiz-option')[selectedIndex];
    const correctLabel = optionsBox.querySelectorAll('.quiz-option')[current.answer];
    chosenLabel.classList.add(correct ? 'correct' : 'incorrect');
    correctLabel.classList.add('correct');
    optionsBox.querySelectorAll('input').forEach((input) => { input.disabled = true; });
    feedback.textContent = `${correct ? 'Верно! ' : 'Не совсем. '}${current.explanation}`;
    feedback.classList.add(correct ? 'feedback-good' : 'feedback-retry');
    checkButton.hidden = true;
    nextButton.hidden = false;
    nextButton.textContent = currentIndex === quizQuestions.length - 1 ? 'Результат →' : 'Следующий вопрос →';
    scoreLabel.textContent = `${score} ${score === 1 ? 'балл' : score >= 2 && score <= 4 ? 'балла' : 'баллов'}`;
  });

  nextButton.addEventListener('click', () => {
    if (!answered) return;
    currentIndex += 1;
    if (currentIndex >= quizQuestions.length) {
      showResult();
    } else {
      renderQuestion();
    }
  });

  restartButton.addEventListener('click', () => {
    currentIndex = 0;
    score = 0;
    resultBox.hidden = true;
    root.hidden = false;
    renderQuestion();
  });

  renderQuestion();
}

document.addEventListener('DOMContentLoaded', initQuiz);
