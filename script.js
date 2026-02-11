if (window.React && window.ReactDOM) {
  const { useEffect, useMemo, useRef, useState } = React;

  const GRADE_LABELS = [2, 3, 4, 5];
  const MODE_OPTIONS = [
    { id: "practice", label: "Practice Mode" },
    { id: "speed", label: "Speed Mode (30s)" },
    { id: "mixed", label: "Mixed Challenge" }
  ];

  const praiseMessages = ["Great Job!", "Awesome!", "You got it!", "Nice work!"];

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[rand(0, arr.length - 1)];

  const normalizeAnswer = (value) =>
    String(value)
      .trim()
      .toLowerCase()
      .replace(/,/g, ".")
      .replace(/\s*([+\-*/])\s*/g, "$1")
      .replace(/\s+/g, " ");

  function createQuestion(prompt, answer, opts = {}) {
    return {
      id: `${Date.now()}-${Math.random()}`,
      prompt,
      answer: normalizeAnswer(answer),
      type: opts.type || "input",
      options: opts.options || [],
      placeholder: opts.placeholder || "Type your answer",
      inputMode: opts.inputMode || "numeric"
    };
  }

  function withChoices(question) {
    const correct = Number(question.answer);
    if (!Number.isFinite(correct)) return question;

    const spread = [correct - rand(1, 5), correct + rand(1, 6), correct + rand(7, 12)].filter(
      (n) => Number.isFinite(n) && n >= 0
    );
    const options = [...new Set([correct, ...spread])].slice(0, 4);

    while (options.length < 4) {
      options.push(correct + rand(2, 15));
    }

    options.sort(() => Math.random() - 0.5);
    return { ...question, type: "mcq", options: options.map(String) };
  }

  function grade2(mode) {
    const set = [
      () => {
        const a = rand(8, 80);
        const b = rand(5, 20);
        return createQuestion(`${a} + ${b} = ?`, a + b);
      },
      () => {
        const a = rand(30, 99);
        const b = rand(6, 25);
        return createQuestion(`${a} - ${b} = ?`, a - b);
      },
      () => {
        const b = rand(10, 60);
        const c = rand(8, 30);
        return createQuestion(`? + ${b} = ${b + c}`, c, { placeholder: "Missing number" });
      },
      () => {
        const start = rand(20, 70);
        const gave = rand(5, 18);
        return createQuestion(
          `Emma had ${start} stickers and gave ${gave} to her friend. How many are left?`,
          start - gave
        );
      }
    ];

    const q = pick(set)();
    return mode === "speed" ? withChoices(q) : q;
  }

  function grade3(mode) {
    const set = [
      () => {
        const a = rand(1, 10);
        const b = rand(1, 10);
        return createQuestion(`${a} × ${b} = ?`, a * b);
      },
      () => {
        const b = rand(2, 10);
        const ans = rand(1, 10);
        return createQuestion(`${b * ans} ÷ ${b} = ?`, ans);
      },
      () => {
        const labels = ["1/2", "1/3", "1/4"];
        const l = pick(labels);
        return createQuestion(`Which fraction shows one equal part out of ${l.split("/")[1]} parts?`, l, {
          type: "mcq",
          options: ["1/2", "1/3", "1/4", "2/4"].sort(() => Math.random() - 0.5),
          inputMode: "text"
        });
      },
      () => {
        const w = rand(3, 10);
        const h = rand(2, 8);
        return createQuestion(`A rectangle is ${w} units wide and ${h} units high. Area = ?`, w * h);
      }
    ];

    const q = pick(set)();
    return mode === "speed" && q.type !== "mcq" ? withChoices(q) : q;
  }

  function grade4(mode) {
    const set = [
      () => {
        const a = rand(12, 95);
        const b = rand(12, 45);
        return createQuestion(`${a} × ${b} = ?`, a * b);
      },
      () => {
        const divisor = rand(2, 9);
        const answer = rand(10, 45);
        return createQuestion(`${divisor * answer} ÷ ${divisor} = ?`, answer);
      },
      () => {
        const options = ["2/3", "4/6", "3/5", "5/8"].sort(() => Math.random() - 0.5);
        return createQuestion("Which fraction is equivalent to 2/3?", "4/6", {
          type: "mcq",
          options,
          inputMode: "text"
        });
      },
      () => {
        const n = rand(1200, 9800);
        const thousands = Math.floor(n / 1000) * 1000;
        const hundreds = Math.floor((n % 1000) / 100) * 100;
        const tens = Math.floor((n % 100) / 10) * 10;
        const ones = n % 10;
        return createQuestion(
          `What is the expanded form of ${n}? (use + signs)`,
          `${thousands}+${hundreds}+${tens}+${ones}`,
          { inputMode: "text", placeholder: "Example: 3000+400+20+1" }
        );
      }
    ];

    const q = pick(set)();
    return mode === "speed" && q.type !== "mcq" && /^\d+$/.test(q.answer) ? withChoices(q) : q;
  }

  function grade5(mode) {
    const set = [
      () => {
        const questions = [
          createQuestion("1/2 + 1/4 = ? (fraction)", "3/4", {
            inputMode: "text",
            placeholder: "Example: 3/4"
          }),
          createQuestion("5/6 - 1/3 = ? (fraction)", "1/2", {
            inputMode: "text",
            placeholder: "Example: 1/2"
          })
        ];
        return pick(questions);
      },
      () => {
        const a = (rand(12, 58) / 10).toFixed(1);
        const b = (rand(11, 49) / 10).toFixed(1);
        const answer = (Number(a) + Number(b)).toFixed(1);
        return createQuestion(`${a} + ${b} = ?`, answer, { inputMode: "decimal" });
      },
      () => {
        const steps = rand(3, 7);
        return createQuestion(
          `A class made ${steps} rows of 8 posters and then added 6 more posters. How many posters total?`,
          steps * 8 + 6
        );
      },
      () => {
        const a = rand(2, 8);
        const b = rand(3, 9);
        const c = rand(2, 5);
        return createQuestion(`${a} + ${b} × ${c} = ?`, a + b * c);
      }
    ];

    const q = pick(set)();
    return mode === "speed" && q.type !== "mcq" && /^\d+(\.\d+)?$/.test(q.answer) ? withChoices(q) : q;
  }

  const gradeGenerators = { 2: grade2, 3: grade3, 4: grade4, 5: grade5 };

  function generateProblem(grade, mode) {
    if (mode === "mixed") {
      const mixedGrade = pick(GRADE_LABELS);
      const maker = gradeGenerators[mixedGrade] || grade2;
      return maker("practice");
    }

    const maker = gradeGenerators[grade] || grade2;
    return maker(mode);
  }

  function playTone(freq, duration, type = "sine", volume = 0.03) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = playTone.ctx || (playTone.ctx = new AudioCtx());
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  const sounds = {
    click: () => playTone(520, 0.05, "triangle", 0.02),
    correct: () => {
      playTone(700, 0.08, "sine", 0.035);
      setTimeout(() => playTone(940, 0.12, "sine", 0.03), 80);
    },
    wrong: () => {
      playTone(220, 0.12, "sawtooth", 0.028);
      setTimeout(() => playTone(170, 0.12, "sawtooth", 0.025), 90);
    }
  };

  function GradeSelector({ onPick }) {
    return (
      <div className="screen">
        <h1>Kids Math Trainer</h1>
        <p className="sub">Choose your grade to begin.</p>
        <div className="grade-grid">
          {GRADE_LABELS.map((grade) => (
            <button
              key={grade}
              className="big-btn"
              onClick={() => {
                sounds.click();
                onPick(grade);
              }}
            >
              Grade {grade}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function ScoreBoard({ grade, mode, score, streak, praise }) {
    return (
      <header className="score-board">
        <div>
          <strong>Grade {grade}</strong>
          <span className="pill">{MODE_OPTIONS.find((m) => m.id === mode)?.label}</span>
        </div>
        <div>
          <span className="score">Score: {score}</span>
          <span className="streak">Streak: {streak}</span>
        </div>
        {praise && <div className="praise">{praise}</div>}
      </header>
    );
  }

  function TimerBar({ timeLeft, total }) {
    const pct = Math.max(0, (timeLeft / total) * 100);
    return (
      <div className="timer-wrap" aria-label="Timer">
        <div className="timer-label">Time Left: {timeLeft}s</div>
        <div className="timer-bar">
          <div className="timer-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  function ProblemCard({ question, value, onChange, onSubmit, feedback, disabled }) {
    return (
      <section className="card">
        <h2>{question.prompt}</h2>

        {question.type === "mcq" ? (
          <div className="choices">
            {question.options.map((option) => (
              <button
                key={option}
                className="choice-btn"
                disabled={disabled}
                onClick={() => onSubmit(option)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(value);
            }}
            className="answer-form"
          >
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={question.placeholder}
              disabled={disabled}
              inputMode={question.inputMode}
            />
            <button className="big-btn" type="submit" disabled={disabled || !String(value).trim()}>
              Check Answer
            </button>
          </form>
        )}

        {feedback && <p className={`feedback ${feedback.type}`}>{feedback.text}</p>}
      </section>
    );
  }

  function ConfettiBurst({ show }) {
    const bits = useMemo(() => new Array(18).fill(0), [show]);
    if (!show) return null;

    return (
      <div className="confetti-layer" aria-hidden="true">
        {bits.map((_, i) => (
          <span
            key={i}
            className="confetti"
            style={{ left: `${(i / bits.length) * 100}%`, animationDelay: `${i * 0.03}s` }}
          />
        ))}
      </div>
    );
  }

  function App() {
    const [screen, setScreen] = useState("home");
    const [grade, setGrade] = useState(2);
    const [mode, setMode] = useState("practice");
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [question, setQuestion] = useState(generateProblem(2, "practice"));
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [praise, setPraise] = useState("");
    const [burstOn, setBurstOn] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
      if (screen !== "play" || mode !== "speed") return undefined;

      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setFeedback({ type: "wrong", text: `Time is up! Final score: ${score}` });
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }, [screen, mode, score]);

    const startGame = (selectedMode) => {
      sounds.click();
      clearInterval(timerRef.current);
      setMode(selectedMode);
      setScore(0);
      setStreak(0);
      setFeedback(null);
      setAnswer("");
      setPraise("");
      setTimeLeft(30);
      setQuestion(generateProblem(grade, selectedMode));
      setScreen("play");
    };

    const nextQuestion = (chosenMode = mode) => {
      setAnswer("");
      setFeedback(null);
      setQuestion(generateProblem(grade, chosenMode));
    };

    const handleAnswer = (rawValue) => {
      if (mode === "speed" && timeLeft <= 0) return;

      const user = normalizeAnswer(rawValue);
      if (!user) return;

      if (user === question.answer) {
        sounds.correct();
        setScore((s) => s + 1);
        setStreak((prev) => {
          const updated = prev + 1;
          if (updated > 0 && updated % 3 === 0) {
            setBurstOn(true);
            setTimeout(() => setBurstOn(false), 1200);
          }
          return updated;
        });
        const say = Math.random() > 0.65 ? pick(praiseMessages) : "";
        setPraise(say);
        setFeedback({ type: "ok", text: "Correct!" });
        setTimeout(() => nextQuestion(), 650);
      } else {
        sounds.wrong();
        setStreak(0);
        setPraise("");
        setFeedback({ type: "wrong", text: `Try again! Correct: ${question.answer}` });
      }
    };

    if (screen === "home") {
      return (
        <GradeSelector
          onPick={(g) => {
            setGrade(g);
            setScreen("mode");
          }}
        />
      );
    }

    if (screen === "mode") {
      return (
        <div className="screen">
          <h1>Grade {grade}</h1>
          <p className="sub">Pick a learning mode:</p>
          <div className="mode-list">
            {MODE_OPTIONS.map((item) => (
              <button key={item.id} className="big-btn" onClick={() => startGame(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
          <button
            className="ghost-btn"
            onClick={() => {
              sounds.click();
              setScreen("home");
            }}
          >
            Back to grades
          </button>
        </div>
      );
    }

    return (
      <div className="screen play-screen">
        <ScoreBoard grade={grade} mode={mode} score={score} streak={streak} praise={praise} />
        {mode === "speed" && <TimerBar timeLeft={timeLeft} total={30} />}
        <ProblemCard
          question={question}
          value={answer}
          onChange={setAnswer}
          onSubmit={handleAnswer}
          feedback={feedback}
          disabled={mode === "speed" && timeLeft <= 0}
        />

        <div className="actions">
          <button
            className="ghost-btn"
            onClick={() => {
              sounds.click();
              nextQuestion();
            }}
          >
            Skip
          </button>
          <button
            className="ghost-btn"
            onClick={() => {
              sounds.click();
              clearInterval(timerRef.current);
              setScreen("mode");
            }}
          >
            Change Mode
          </button>
          <button
            className="ghost-btn"
            onClick={() => {
              sounds.click();
              clearInterval(timerRef.current);
              setScreen("home");
            }}
          >
            Home
          </button>
        </div>

        <ConfettiBurst show={burstOn} />
      </div>
    );
  }

  const rootEl = document.getElementById("root");
  if (rootEl) {
    ReactDOM.createRoot(rootEl).render(<App />);
  }
}
