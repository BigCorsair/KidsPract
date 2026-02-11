const gradeContent = {
  2: {
    title: "2 класс",
    description: "Сложение, вычитание и простые текстовые задачи до 100.",
    examples: ["7 + 5 = ?", "14 - 8 = ?", "30 + 20 = ?"],
    tasks: [
      "У Маши было 12 конфет, она отдала 4. Сколько осталось?",
      "В коробке 25 карандашей, добавили ещё 15. Сколько стало?",
      "На дереве сидело 18 птиц, 6 улетели. Сколько осталось?"
    ],
    exercises: [
      "Реши 10 примеров на сложение до 50.",
      "Реши 10 примеров на вычитание до 50.",
      "Сравни числа: >, <, = (23 и 32, 45 и 45, 17 и 19)."
    ]
  },
  3: {
    title: "3 класс",
    description: "Таблица умножения, деление и задачи на два действия.",
    examples: ["6 × 7 = ?", "56 ÷ 8 = ?", "9 × 4 = ?"],
    tasks: [
      "У Пети 4 коробки по 6 яблок. Сколько яблок всего?",
      "72 карандаша разложили поровну в 9 пеналов. По сколько в каждом?",
      "В библиотеке 35 книг и привезли ещё 28. Сколько книг стало?"
    ],
    exercises: [
      "Повтори таблицу умножения от 2 до 9.",
      "Реши 8 задач на деление с остатком и без.",
      "Реши 5 задач на два действия (сложение + умножение)."
    ]
  },
  4: {
    title: "4 класс",
    description: "Многозначные числа, письменные вычисления, дроби и логика.",
    examples: ["348 + 275 = ?", "900 - 467 = ?", "3/4 + 1/4 = ?"],
    tasks: [
      "В школу привезли 145 учебников в один день и 189 в другой. Сколько всего?",
      "Из 560 тетрадей выдали 238. Сколько осталось?",
      "Половина класса (12 учеников) пошла на экскурсию. Сколько всего учеников в классе?"
    ],
    exercises: [
      "Реши 6 примеров на письменное сложение и вычитание.",
      "Реши 5 примеров на умножение двузначного числа на однозначное.",
      "Сравни дроби: 1/2 и 2/4, 3/5 и 4/5, 7/8 и 3/8."
    ]
  },
  5: {
    title: "5 класс",
    description: "Дроби, проценты, уравнения и задачи на логику.",
    examples: ["2/3 + 1/6 = ?", "15% от 200 = ?", "3x + 5 = 20"],
    tasks: [
      "В магазине скидка 20% на товар стоимостью 500 ₽. Какая цена со скидкой?",
      "Из 48 учеников 3/4 участвуют в олимпиаде. Сколько учеников участвуют?",
      "Реши уравнение: 4x - 7 = 21."
    ],
    exercises: [
      "Реши 8 примеров на сложение и вычитание дробей.",
      "Реши 5 задач на нахождение процента от числа.",
      "Реши 6 линейных уравнений вида ax + b = c."
    ]
  }
};

const gradeSelect = document.getElementById("grade-select");
const gradeTitle = document.getElementById("grade-title");
const gradeDescription = document.getElementById("grade-description");
const examplesList = document.getElementById("examples-list");
const tasksList = document.getElementById("tasks-list");
const exercisesList = document.getElementById("exercises-list");

function fillList(element, items) {
  element.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
}

function renderGrade(grade) {
  const content = gradeContent[grade];

  if (!content) {
    return;
  }

  gradeTitle.textContent = content.title;
  gradeDescription.textContent = content.description;
  fillList(examplesList, content.examples);
  fillList(tasksList, content.tasks);
  fillList(exercisesList, content.exercises);
}

Object.keys(gradeContent).forEach((grade) => {
  const option = document.createElement("option");
  option.value = grade;
  option.textContent = `${grade} grade`;
  gradeSelect.appendChild(option);
});

gradeSelect.addEventListener("change", (event) => {
  renderGrade(event.target.value);
});

gradeSelect.value = "2";
renderGrade("2");
