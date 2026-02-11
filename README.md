diff --git a/README.md b/README.md
index 3b30f63e9f594400c7f756de73590284f3892912..21e7ff5fb1202b6d673395af219bffcb4193f3a7 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,31 @@
-This is new small app for my kids
+# Kids Math Trainer
+
+A single-page React math trainer for US elementary students (Grade 2–5).
+
+## Features
+
+- Grade-based home screen (Grade 2–5)
+- Three modes:
+  - Practice Mode
+  - Speed Mode (30-second countdown)
+  - Mixed Challenge
+- Score and streak tracking
+- Grade-appropriate Common Core style question generation
+- Multiple problem formats:
+  - Fill-in answers
+  - Multiple choice
+  - Equation style prompts
+  - Word problems
+- Audio feedback (click, correct, wrong)
+- Confetti burst on streak milestones
+- Responsive, bright, kid-friendly UI
+
+## Run
+
+Open `index.html` in a browser, or serve the folder:
+
+```bash
+python3 -m http.server 8000
+```
+
+Then visit `http://localhost:8000`.
