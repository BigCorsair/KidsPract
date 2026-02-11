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

const normalizeAnswer = (value) => String(value).trim().toLowerCase();

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
  const spread = [correct - rand(1, 5), correct + rand(1, 6), correct + rand(7, 12)]
    .filter((n) => Number.isFinite(n) && n >= 0);

  const options = [...new Set([correct, ...spread])].slice(0, 4);
  while (options.length < 4) options.push(correct + rand(2, 15));
  options.sort(() => Math.random() - 0.5);

  return { ...question, type: "mcq", options: options.map(String) };
}

function playTone(freq, duration, type = "sine", volume = 0.03) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = playTone.ctx || (playTone.ctx = new AudioCtx());
  if (ctx.state === "suspended") ctx.resume();

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
    playTone(700, 0.08);
    setTimeout(() => playTone(940, 0.12), 80);
  },
  wrong: () => {
    playTone(220, 0.12, "sawtooth");
    setTimeout(() => playTone(170, 0.12, "sawtooth"), 90);
  }
};
