(() => {
  "use strict";

  const KEYS = {
    patients: "cr-ex.patients.v1",
    tests:    "cr-ex.tests.v1",
    sessions: "cr-ex.sessions.v1",
  };

  const PROGRAMS = window.CREX_PROGRAMS;
  const SCRIPT_6MWT = window.CREX_6MWT_SCRIPT;

  // ---------------------- storage ----------------------
  const store = {
    load(key)        { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } },
    save(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  };

  const state = {
    view: "patients",
    selectedPatientId: null,
    patients: store.load(KEYS.patients),
    tests:    store.load(KEYS.tests),
    sessions: store.load(KEYS.sessions),
    test6mwt: null,   // active test runtime
  };

  function persist() {
    store.save(KEYS.patients, state.patients);
    store.save(KEYS.tests,    state.tests);
    store.save(KEYS.sessions, state.sessions);
  }

  function uid() {
    return crypto.randomUUID ? crypto.randomUUID() : "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  function todayIso() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  }

  function getPatient(id)    { return state.patients.find(p => p.id === id); }
  function patientTests(id)  { return state.tests.filter(t => t.patientId === id).sort((a,b)=>b.createdAt-a.createdAt); }
  function patientSessions(id){return state.sessions.filter(s => s.patientId === id).sort((a,b)=>a.sessionN-b.sessionN || a.createdAt-b.createdAt);}

  // ---------------------- DOM helpers ----------------------
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else if (v === true) node.setAttribute(k, "");
      else if (v !== false && v != null) node.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return node;
  }

  // ---------------------- views ----------------------
  function render() {
    $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === state.view));
    const root = $("#app");
    root.innerHTML = "";
    const view = ({
      patients:  renderPatients,
      sixmwt:    renderSixmwt,
      sessions:  renderSessions,
      reference: renderReference,
    })[state.view] || renderPatients;
    root.appendChild(view());
  }

  // ===== Patients view =====
  function renderPatients() {
    const wrap = el("section", { class: "view" });

    wrap.appendChild(el("div", { class: "card" },
      el("h2", {}, "Add patient"),
      patientForm()
    ));

    const list = el("div", { class: "card" }, el("h2", {}, "Patient list"));
    if (state.patients.length === 0) {
      list.appendChild(el("div", { class: "empty" }, "No patients yet."));
    } else {
      const ul = el("ul", { class: "patient-list" });
      for (const p of [...state.patients].sort((a,b)=>a.name.localeCompare(b.name))) {
        const tests = patientTests(p.id);
        const sessions = patientSessions(p.id);
        ul.appendChild(el("li", { class: "patient-item" },
          el("div", { class: "patient-main" },
            el("div", { class: "patient-name" }, p.name),
            el("div", { class: "patient-meta" },
              `${p.condition ? PROGRAMS[p.condition]?.label || p.condition : "—"} · `,
              `${p.age || "?"} yr · ${p.sex || "?"} · ${p.height || "?"} cm · ${p.weight || "?"} kg`
            ),
            el("div", { class: "patient-meta" },
              `${tests.length} 6MWT${tests.length===1?"":"s"} · ${sessions.length} session${sessions.length===1?"":"s"}`
            ),
          ),
          el("div", { class: "patient-actions" },
            el("button", { class: "btn btn-sm", onclick: () => { state.selectedPatientId = p.id; state.view = "sixmwt"; render(); } }, "6MWT"),
            el("button", { class: "btn btn-sm", onclick: () => { state.selectedPatientId = p.id; state.view = "sessions"; render(); } }, "Sessions"),
            el("button", { class: "btn btn-sm btn-ghost", onclick: () => deletePatient(p.id) }, "Delete"),
          )
        ));
      }
      list.appendChild(ul);
    }
    wrap.appendChild(list);
    return wrap;
  }

  function patientForm() {
    const form = el("form", { class: "form-grid", onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const patient = {
        id: uid(),
        createdAt: Date.now(),
        name: fd.get("name").trim(),
        age: Number(fd.get("age")) || null,
        sex: fd.get("sex"),
        height: Number(fd.get("height")) || null,
        weight: Number(fd.get("weight")) || null,
        condition: fd.get("condition"),
        comorbidities: fd.get("comorbidities").trim(),
        baselineO2: fd.get("baselineO2").trim(),
        notes: fd.get("notes").trim(),
      };
      if (!patient.name || !patient.condition) return;
      state.patients.push(patient);
      persist();
      render();
    }});
    form.appendChild(field("Name", el("input", { name: "name", required: true, placeholder: "e.g. Patient ID or initials" })));
    form.appendChild(field("Age", el("input", { name: "age", type: "number", min: 0, max: 120 })));
    form.appendChild(field("Sex", select("sex", [["", "—"], ["M","Male"], ["F","Female"], ["X","Other"]])));
    form.appendChild(field("Height (cm)", el("input", { name: "height", type: "number", step: "0.1" })));
    form.appendChild(field("Weight (kg)", el("input", { name: "weight", type: "number", step: "0.1" })));
    form.appendChild(field("Condition", select("condition", [
      ["", "— select —"],
      ["copd","COPD"],
      ["asthma","Asthma"],
      ["cabg","Post-CABG"],
      ["hf","Heart Failure"],
    ], true)));
    form.appendChild(field("Baseline O2", el("input", { name: "baselineO2", placeholder: "e.g. RA, 2L NC" })));
    form.appendChild(field("Comorbidities", el("input", { name: "comorbidities", placeholder: "e.g. T2DM, HTN" })));
    form.appendChild(field("Notes", el("input", { name: "notes" }), { full: true }));
    form.appendChild(el("div", { class: "form-actions" },
      el("button", { class: "btn btn-primary", type: "submit" }, "Add patient")
    ));
    return form;
  }

  function deletePatient(id) {
    if (!confirm("Delete patient and all their tests/sessions?")) return;
    state.patients = state.patients.filter(p => p.id !== id);
    state.tests    = state.tests.filter(t => t.patientId !== id);
    state.sessions = state.sessions.filter(s => s.patientId !== id);
    if (state.selectedPatientId === id) state.selectedPatientId = null;
    persist();
    render();
  }

  // ===== 6MWT view =====
  function renderSixmwt() {
    const wrap = el("section", { class: "view" });
    wrap.appendChild(patientPicker());

    const p = state.selectedPatientId ? getPatient(state.selectedPatientId) : null;
    if (!p) {
      wrap.appendChild(el("div", { class: "card empty" }, "Select a patient to begin a 6MWT."));
      return wrap;
    }

    if (state.test6mwt && state.test6mwt.patientId === p.id) {
      wrap.appendChild(renderActiveTest(p));
    } else {
      wrap.appendChild(renderTestSetup(p));
    }

    // History
    const tests = patientTests(p.id);
    const hist = el("div", { class: "card" }, el("h2", {}, "Previous tests"));
    if (tests.length === 0) {
      hist.appendChild(el("div", { class: "empty" }, "No tests yet."));
    } else {
      const ul = el("ul", { class: "history" });
      for (const t of tests) {
        const pred = window.CREX_PREDICT_6MWD(p.sex, p.age, p.height, p.weight);
        const pct = pred && t.distance ? Math.round(100 * t.distance / pred.predicted) : null;
        ul.appendChild(el("li", { class: "history-item" },
          el("div", { class: "history-main" },
            el("div", { class: "history-title" }, `${t.date} · ${t.distance} m${pct ? ` (${pct}% pred)` : ""}`),
            el("div", { class: "history-meta" },
              `Pre HR ${t.pre.hr||"-"} · BP ${t.pre.sbp||"-"}/${t.pre.dbp||"-"} · SpO2 ${t.pre.spo2||"-"}% · Borg ${t.pre.borgD||"-"}`
            ),
            el("div", { class: "history-meta" },
              `Post HR ${t.post.hr||"-"} · SpO2 nadir ${t.spo2Nadir||"-"}% · Borg ${t.post.borgD||"-"} · Stops ${t.stops||0}`
            ),
            t.notes ? el("div", { class: "history-meta" }, "Notes: " + t.notes) : null
          ),
          el("button", { class: "btn btn-sm btn-ghost", onclick: () => deleteTest(t.id) }, "Delete")
        ));
      }
      hist.appendChild(ul);
    }
    wrap.appendChild(hist);
    return wrap;
  }

  function deleteTest(id) {
    if (!confirm("Delete this test?")) return;
    state.tests = state.tests.filter(t => t.id !== id);
    persist();
    render();
  }

  function renderTestSetup(p) {
    const card = el("div", { class: "card" }, el("h2", {}, `New 6MWT — ${p.name}`));
    card.appendChild(el("div", { class: "info" }, "Patient should rest seated for 10 minutes. Take baseline vitals before starting."));
    const form = el("form", { class: "form-grid", onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      state.test6mwt = {
        id: uid(),
        patientId: p.id,
        date: todayIso(),
        pre: {
          hr: numOrNull(fd.get("hr")),
          sbp: numOrNull(fd.get("sbp")),
          dbp: numOrNull(fd.get("dbp")),
          spo2: numOrNull(fd.get("spo2")),
          borgD: numOrNull(fd.get("borgD")),
          borgRPE: numOrNull(fd.get("borgRPE")),
        },
        o2: fd.get("o2").trim(),
        aid: fd.get("aid"),
        contraindications: fd.get("contraind").trim(),
        // runtime
        running: false,
        startedAt: null,
        elapsed: 0,
        laps: 0,
        spo2Readings: [],
        spo2Nadir: null,
        cuesGiven: [],
        log: [],
      };
      // Pre-test contraindication check
      const ci = checkContraindications(state.test6mwt.pre);
      if (ci.length) {
        if (!confirm("⚠ Possible contraindication:\n\n" + ci.join("\n") + "\n\nProceed anyway?")) {
          state.test6mwt = null;
          return;
        }
      }
      render();
    }});
    form.appendChild(field("Resting HR (bpm)", el("input", { name: "hr", type: "number", min: 0, max: 250, required: true })));
    form.appendChild(field("Resting SBP", el("input", { name: "sbp", type: "number", min: 0, max: 300 })));
    form.appendChild(field("Resting DBP", el("input", { name: "dbp", type: "number", min: 0, max: 200 })));
    form.appendChild(field("Resting SpO2 (%)", el("input", { name: "spo2", type: "number", min: 0, max: 100, required: true })));
    form.appendChild(field("Borg dyspnea (0-10)", el("input", { name: "borgD", type: "number", min: 0, max: 10, step: "0.5" })));
    form.appendChild(field("Borg RPE (0-10)", el("input", { name: "borgRPE", type: "number", min: 0, max: 10, step: "0.5" })));
    form.appendChild(field("O2 supplementation", el("input", { name: "o2", placeholder: "e.g. RA, 2L NC" })));
    form.appendChild(field("Walking aid", select("aid", [["none","None"],["cane","Cane"],["walker","Walker"],["rollator","Rollator"]])));
    form.appendChild(field("Contraindications notes", el("input", { name: "contraind", placeholder: "If any" }), { full: true }));
    form.appendChild(el("div", { class: "form-actions" },
      el("button", { class: "btn btn-primary", type: "submit" }, "Read instructions to patient →")
    ));
    card.appendChild(form);
    return card;
  }

  function checkContraindications(v) {
    const out = [];
    if (v.hr  != null && v.hr  > 120) out.push(`Resting HR ${v.hr} > 120 bpm (relative)`);
    if (v.sbp != null && v.sbp > 180) out.push(`Resting SBP ${v.sbp} > 180 mmHg (relative)`);
    if (v.dbp != null && v.dbp > 100) out.push(`Resting DBP ${v.dbp} > 100 mmHg (relative)`);
    return out;
  }

  function renderActiveTest(p) {
    const t = state.test6mwt;
    const card = el("div", { class: "card" }, el("h2", {}, `6MWT in progress — ${p.name}`));

    // Verbatim ATS instructions block (collapsible)
    const instr = el("details", { class: "instr", open: !t.running ? true : false },
      el("summary", {}, "ATS verbatim instructions (read aloud)"),
      el("p", { class: "script" }, SCRIPT_6MWT.intro),
      el("p", { class: "script" }, "(Demonstrate one lap.)"),
      el("p", { class: "script" }, SCRIPT_6MWT.ready)
    );
    card.appendChild(instr);

    // Timer & lap counter
    const elapsed = t.elapsed;
    const remain = Math.max(0, 360 - elapsed);
    const mm = String(Math.floor(remain / 60)).padStart(1, "0");
    const ss = String(remain % 60).padStart(2, "0");
    const timerEl = el("div", { class: "timer" }, `${mm}:${ss}`);
    const progress = el("div", { class: "progress-bar" },
      el("div", { class: "progress-fill", style: `width:${Math.min(100, (elapsed/360)*100)}%` })
    );

    const cueText = t.lastCue ? el("div", { class: "cue" }, t.lastCue) : el("div", { class: "cue muted" }, t.running ? "Stay quiet between cues." : "Press Start when patient begins walking.");

    const controls = el("div", { class: "test-controls" },
      !t.running
        ? el("button", { class: "btn btn-primary btn-lg", onclick: startTimer }, "Start")
        : el("button", { class: "btn btn-warn btn-lg", onclick: pauseTimer }, "Pause / Stop early"),
      el("div", { class: "lap-block" },
        el("div", { class: "lap-label" }, "Laps"),
        el("div", { class: "lap-count" }, String(t.laps)),
        el("div", { class: "lap-buttons" },
          el("button", { class: "btn btn-sm", onclick: () => { state.test6mwt.laps += 1; render(); } }, "+1"),
          el("button", { class: "btn btn-sm btn-ghost", onclick: () => { state.test6mwt.laps = Math.max(0, state.test6mwt.laps - 1); render(); } }, "-1")
        )
      ),
      el("div", { class: "spo2-block" },
        el("div", { class: "lap-label" }, "Log SpO2"),
        el("input", { id: "spo2-log", type: "number", min: 0, max: 100, placeholder: "%" }),
        el("button", { class: "btn btn-sm", onclick: logSpo2 }, "Log"),
        el("div", { class: "muted" }, "Nadir: " + (t.spo2Nadir == null ? "—" : t.spo2Nadir + "%"))
      ),
      el("div", { class: "stop-block" },
        el("div", { class: "lap-label" }, "Stops"),
        el("button", { class: "btn btn-sm btn-warn", onclick: () => { state.test6mwt.stops = (state.test6mwt.stops||0)+1; render(); } }, "+1 stop"),
        el("div", { class: "muted" }, "Total: " + (t.stops || 0))
      )
    );

    card.appendChild(timerEl);
    card.appendChild(progress);
    card.appendChild(cueText);
    card.appendChild(controls);

    // Stop criteria reminder
    card.appendChild(el("details", { class: "stop-criteria" },
      el("summary", {}, "Stop criteria — terminate if:"),
      el("ul", {},
        ...["Chest pain / angina","Intolerable dyspnea","Leg cramps / claudication","Staggering / ataxia","Diaphoresis with pallor or cyanosis","Pale or ashen appearance","Confusion or light-headedness"]
          .map(s => el("li", {}, s))
      )
    ));

    // Post-test form (visible after timer finishes or stopped)
    if (t.elapsed >= 360 || t.stoppedEarly) {
      card.appendChild(renderPostTestForm(p, t));
    }

    // Cancel
    card.appendChild(el("div", { class: "form-actions" },
      el("button", { class: "btn btn-sm btn-ghost", onclick: () => {
        if (confirm("Cancel this test? Data will be discarded.")) {
          stopTimer();
          state.test6mwt = null;
          render();
        }
      } }, "Cancel test")
    ));

    return card;
  }

  let timerHandle = null;
  function startTimer() {
    const t = state.test6mwt;
    if (!t || t.running) return;
    t.running = true;
    t.startedAt = Date.now() - (t.elapsed * 1000);
    tickTimer();
    timerHandle = setInterval(tickTimer, 1000);
    render();
  }
  function pauseTimer() {
    const t = state.test6mwt;
    if (!t) return;
    t.running = false;
    t.stoppedEarly = t.elapsed < 360;
    clearInterval(timerHandle);
    timerHandle = null;
    render();
  }
  function stopTimer() {
    clearInterval(timerHandle);
    timerHandle = null;
  }
  function tickTimer() {
    const t = state.test6mwt;
    if (!t || !t.running) return;
    const sec = Math.floor((Date.now() - t.startedAt) / 1000);
    t.elapsed = Math.min(sec, 360);

    // Find next cue
    for (const c of SCRIPT_6MWT.cues) {
      if (t.elapsed >= c.atSec && !t.cuesGiven.includes(c.atSec)) {
        t.cuesGiven.push(c.atSec);
        t.lastCue = c.text;
        speak(c.text);
      }
    }

    if (t.elapsed >= 360) {
      t.running = false;
      stopTimer();
    }
    render();
  }
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch {}
  }
  function logSpo2() {
    const input = $("#spo2-log");
    if (!input) return;
    const v = Number(input.value);
    if (!v) return;
    const t = state.test6mwt;
    t.spo2Readings.push({ atSec: t.elapsed, value: v });
    if (t.spo2Nadir == null || v < t.spo2Nadir) t.spo2Nadir = v;
    input.value = "";
    render();
  }

  function renderPostTestForm(p, t) {
    const div = el("div", { class: "subcard" }, el("h3", {}, "Post-test vitals & save"));
    const form = el("form", { class: "form-grid", onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const partialMeters = numOrNull(fd.get("partial")) || 0;
      const distance = (t.laps * 30) + partialMeters;

      const post = {
        hr: numOrNull(fd.get("phr")),
        sbp: numOrNull(fd.get("psbp")),
        dbp: numOrNull(fd.get("pdbp")),
        spo2: numOrNull(fd.get("pspo2")),
        borgD: numOrNull(fd.get("pborgD")),
        borgRPE: numOrNull(fd.get("pborgRPE")),
        recovery1: numOrNull(fd.get("rec1")),
        recovery2: numOrNull(fd.get("rec2")),
      };

      const record = {
        id: t.id,
        patientId: p.id,
        date: t.date,
        createdAt: Date.now(),
        pre: t.pre,
        post,
        o2: t.o2,
        aid: t.aid,
        contraindications: t.contraindications,
        elapsedSec: t.elapsed,
        laps: t.laps,
        partialMeters,
        distance,
        spo2Nadir: t.spo2Nadir,
        spo2Readings: t.spo2Readings,
        stops: t.stops || 0,
        stoppedEarly: !!t.stoppedEarly,
        terminationReason: fd.get("termReason").trim(),
        notes: fd.get("notes").trim(),
      };

      state.tests.push(record);
      persist();
      state.test6mwt = null;

      // Show summary
      alert(buildTestSummary(p, record));
      render();
    }});

    form.appendChild(field("Partial lap (m)", el("input", { name: "partial", type: "number", min: 0, max: 30, step: "0.1", required: true, placeholder: "0-30" })));
    form.appendChild(field("Post HR", el("input", { name: "phr", type: "number", min: 0, max: 250 })));
    form.appendChild(field("Post SBP", el("input", { name: "psbp", type: "number", min: 0, max: 300 })));
    form.appendChild(field("Post DBP", el("input", { name: "pdbp", type: "number", min: 0, max: 200 })));
    form.appendChild(field("Post SpO2", el("input", { name: "pspo2", type: "number", min: 0, max: 100 })));
    form.appendChild(field("Post Borg dyspnea", el("input", { name: "pborgD", type: "number", min: 0, max: 10, step: "0.5" })));
    form.appendChild(field("Post Borg RPE", el("input", { name: "pborgRPE", type: "number", min: 0, max: 10, step: "0.5" })));
    form.appendChild(field("Recovery HR @ 1 min", el("input", { name: "rec1", type: "number", min: 0, max: 250 })));
    form.appendChild(field("Recovery HR @ 2 min", el("input", { name: "rec2", type: "number", min: 0, max: 250 })));
    form.appendChild(field("Termination reason (if early)", el("input", { name: "termReason" }), { full: true }));
    form.appendChild(field("Notes", el("input", { name: "notes" }), { full: true }));
    form.appendChild(el("div", { class: "form-actions" },
      el("button", { class: "btn btn-primary", type: "submit" }, "Save test")
    ));
    div.appendChild(form);
    return div;
  }

  function buildTestSummary(p, r) {
    const pred = window.CREX_PREDICT_6MWD(p.sex, p.age, p.height, p.weight);
    const vo2 = window.CREX_VO2_FROM_6MWD(r.distance);
    const speedMmin = +(r.distance / 6).toFixed(1);
    const targetSpeed = +(speedMmin * 0.8).toFixed(1);
    const lines = [
      `6MWT — ${p.name} — ${r.date}`,
      `Distance: ${r.distance} m`,
      pred ? `Predicted (Enright): ${pred.predicted} m  (LLN ${pred.lln} m)` : null,
      pred ? `% predicted: ${Math.round(100*r.distance/pred.predicted)}%` : null,
      vo2 ? `Estimated VO2peak (Cahalin): ${vo2} mL/kg/min` : null,
      `Avg walking speed: ${speedMmin} m/min`,
      `Training target (80% of avg speed): ${targetSpeed} m/min`,
      `SpO2 nadir: ${r.spo2Nadir ?? "—"}%`,
      r.spo2Nadir != null && r.pre.spo2 != null ? `SpO2 drop: ${r.pre.spo2 - r.spo2Nadir}%` : null,
      r.spo2Nadir != null && r.spo2Nadir < 88 ? "⚠ Desaturation <88% — consider ambulatory O2 evaluation." : null,
      r.distance < 350 && p.condition === "copd" ? "⚠ COPD: 6MWD <350 m — increased mortality / hospitalization risk." : null,
      r.distance < 332 ? "⚠ <332 m — adverse prognostic threshold (PAH; consider in HF/COPD context)." : null,
    ].filter(Boolean);
    return lines.join("\n");
  }

  // ===== Sessions view =====
  function renderSessions() {
    const wrap = el("section", { class: "view" });
    wrap.appendChild(patientPicker());

    const p = state.selectedPatientId ? getPatient(state.selectedPatientId) : null;
    if (!p) {
      wrap.appendChild(el("div", { class: "card empty" }, "Select a patient to start a session."));
      return wrap;
    }
    const program = PROGRAMS[p.condition];
    if (!program) {
      wrap.appendChild(el("div", { class: "card empty" }, "No program available for this condition."));
      return wrap;
    }

    if (state.activeSession && state.activeSession.patientId === p.id) {
      wrap.appendChild(renderActiveSession(p, program));
    } else {
      wrap.appendChild(renderSessionPicker(p, program));
    }

    // History
    const sessions = patientSessions(p.id);
    const hist = el("div", { class: "card" }, el("h2", {}, "Session history"));
    if (sessions.length === 0) {
      hist.appendChild(el("div", { class: "empty" }, "No sessions yet."));
    } else {
      const ul = el("ul", { class: "history" });
      for (const s of sessions) {
        const tmpl = program.sessions.find(x => x.n === s.sessionN);
        ul.appendChild(el("li", { class: "history-item" },
          el("div", { class: "history-main" },
            el("div", { class: "history-title" }, `S${s.sessionN}: ${s.title} · ${s.date}`),
            el("div", { class: "history-meta" },
              `Pre HR ${s.pre.hr||"-"} · BP ${s.pre.sbp||"-"}/${s.pre.dbp||"-"} · SpO2 ${s.pre.spo2||"-"}% · Borg ${s.pre.borgD||"-"}`
            ),
            el("div", { class: "history-meta" },
              `Items completed: ${s.completed.length}/${(tmpl?.items||[]).length} · Adverse: ${s.adverse || "none"}`
            ),
            s.notes ? el("div", { class: "history-meta" }, "Notes: " + s.notes) : null
          ),
          el("button", { class: "btn btn-sm btn-ghost", onclick: () => deleteSession(s.id) }, "Delete")
        ));
      }
      hist.appendChild(ul);
    }
    wrap.appendChild(hist);
    return wrap;
  }

  function deleteSession(id) {
    if (!confirm("Delete this session record?")) return;
    state.sessions = state.sessions.filter(s => s.id !== id);
    persist();
    render();
  }

  function renderSessionPicker(p, program) {
    const card = el("div", { class: "card" }, el("h2", {}, `Sessions — ${p.name} (${program.label})`));
    card.appendChild(el("div", { class: "info" }, program.summary));

    const completedNs = new Set(patientSessions(p.id).map(s => s.sessionN));
    const ul = el("ul", { class: "session-list" });
    for (const s of program.sessions) {
      const done = completedNs.has(s.n);
      ul.appendChild(el("li", { class: "session-row" + (done ? " done" : "") },
        el("div", { class: "session-row-main" },
          el("div", { class: "session-row-title" }, `${s.phase ? s.phase + " · " : ""}S${s.n}: ${s.title}`),
          el("div", { class: "session-row-meta" }, `${s.items.length} items · target Borg ${s.borg}`)
        ),
        el("button", { class: "btn btn-sm" + (done ? " btn-ghost" : " btn-primary"), onclick: () => startSession(p, s) }, done ? "Repeat" : "Start")
      ));
    }
    card.appendChild(ul);
    return card;
  }

  function startSession(p, sessionTemplate) {
    state.activeSession = {
      id: uid(),
      patientId: p.id,
      sessionN: sessionTemplate.n,
      title: sessionTemplate.title,
      phase: sessionTemplate.phase || null,
      borgTarget: sessionTemplate.borg,
      template: sessionTemplate,
      pre: null,
      completed: [],
      itemNotes: {},
      vitalsDuring: [],
      adverse: "",
      notes: "",
      step: "pre",  // pre -> exercise -> post
    };
    render();
  }

  function renderActiveSession(p, program) {
    const s = state.activeSession;
    const card = el("div", { class: "card" }, el("h2", {}, `S${s.sessionN}: ${s.title} — ${p.name}`));
    card.appendChild(el("div", { class: "info" }, `Target Borg dyspnea / RPE: ${s.borgTarget}`));

    // Red flags (always visible)
    card.appendChild(el("details", { class: "redflags" },
      el("summary", {}, "Defer-the-day red flags"),
      el("ul", {}, ...program.redFlags.map(r => el("li", {}, r)))
    ));

    if (s.step === "pre") {
      card.appendChild(renderSessionPreForm(p, s));
    } else if (s.step === "exercise") {
      card.appendChild(renderSessionChecklist(p, s, program));
    } else if (s.step === "post") {
      card.appendChild(renderSessionPostForm(p, s));
    }

    card.appendChild(el("div", { class: "form-actions" },
      el("button", { class: "btn btn-sm btn-ghost", onclick: () => {
        if (confirm("Cancel this session? Data will be discarded.")) {
          state.activeSession = null;
          render();
        }
      } }, "Cancel session")
    ));
    return card;
  }

  function renderSessionPreForm(p, s) {
    const div = el("div", { class: "subcard" }, el("h3", {}, "Pre-session vitals"));
    const form = el("form", { class: "form-grid", onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      s.date = todayIso();
      s.pre = {
        weight: numOrNull(fd.get("weight")),
        weightChange3d: numOrNull(fd.get("weightChange")),
        hr: numOrNull(fd.get("hr")),
        rhythm: fd.get("rhythm"),
        sbp: numOrNull(fd.get("sbp")),
        dbp: numOrNull(fd.get("dbp")),
        sbpStanding: numOrNull(fd.get("sbpStand")),
        dbpStanding: numOrNull(fd.get("dbpStand")),
        spo2: numOrNull(fd.get("spo2")),
        o2: fd.get("o2").trim(),
        rr: numOrNull(fd.get("rr")),
        borgD: numOrNull(fd.get("borgD")),
        borgRPE: numOrNull(fd.get("borgRPE")),
        pef: numOrNull(fd.get("pef")),
        pain: fd.get("pain").trim(),
        symptoms: fd.get("symptoms").trim(),
        meds: fd.get("meds").trim(),
      };
      s.step = "exercise";
      render();
    }});
    form.appendChild(field("Weight (kg)", el("input", { name: "weight", type: "number", step: "0.1" })));
    form.appendChild(field("Δ weight 3 d (kg)", el("input", { name: "weightChange", type: "number", step: "0.1", placeholder: "HF flag if ≥2" })));
    form.appendChild(field("HR rest", el("input", { name: "hr", type: "number", min: 0, max: 250, required: true })));
    form.appendChild(field("Rhythm", select("rhythm", [["sinus","Sinus"],["af","AF"],["paced","Paced"],["other","Other"]])));
    form.appendChild(field("SBP supine", el("input", { name: "sbp", type: "number", min: 0, max: 300 })));
    form.appendChild(field("DBP supine", el("input", { name: "dbp", type: "number", min: 0, max: 200 })));
    form.appendChild(field("SBP standing", el("input", { name: "sbpStand", type: "number", min: 0, max: 300 })));
    form.appendChild(field("DBP standing", el("input", { name: "dbpStand", type: "number", min: 0, max: 200 })));
    form.appendChild(field("SpO2 (%)", el("input", { name: "spo2", type: "number", min: 0, max: 100, required: true })));
    form.appendChild(field("O2 supplementation", el("input", { name: "o2", placeholder: "e.g. RA, 2L NC" })));
    form.appendChild(field("Resp rate", el("input", { name: "rr", type: "number", min: 0, max: 60 })));
    form.appendChild(field("Borg dyspnea (0-10)", el("input", { name: "borgD", type: "number", min: 0, max: 10, step: "0.5" })));
    form.appendChild(field("Borg RPE (0-10)", el("input", { name: "borgRPE", type: "number", min: 0, max: 10, step: "0.5" })));
    form.appendChild(field("PEF (asthma)", el("input", { name: "pef", type: "number" })));
    form.appendChild(field("Pain (NRS, location)", el("input", { name: "pain" })));
    form.appendChild(field("Symptoms checklist", el("input", { name: "symptoms", placeholder: "orthopnea, PND, edema, chest pain..." }), { full: true }));
    form.appendChild(field("Medication changes since last session", el("input", { name: "meds" }), { full: true }));
    form.appendChild(el("div", { class: "form-actions" },
      el("button", { class: "btn btn-primary", type: "submit" }, "Continue to checklist →")
    ));
    div.appendChild(form);
    return div;
  }

  function renderSessionChecklist(p, s, program) {
    const div = el("div", { class: "subcard" });
    div.appendChild(el("h3", {}, "Exercise checklist"));

    // Stop criteria (always available, prominent)
    div.appendChild(el("details", { class: "stop-criteria", open: true },
      el("summary", {}, "Stop the session immediately if:"),
      el("ul", {}, ...program.stopRules.map(r => el("li", {}, r)))
    ));

    const ul = el("ul", { class: "exercise-checklist" });
    s.template.items.forEach((item, i) => {
      const id = "item-" + i;
      const checked = s.completed.includes(i);
      const li = el("li", { class: "checklist-item" + (checked ? " done" : "") },
        el("label", {},
          el("input", {
            type: "checkbox",
            checked,
            onchange: (e) => {
              if (e.target.checked && !s.completed.includes(i)) s.completed.push(i);
              else s.completed = s.completed.filter(x => x !== i);
              render();
            }
          }),
          el("span", { class: "checklist-text" }, item)
        ),
        el("input", {
          class: "item-note",
          placeholder: "note (optional)",
          value: s.itemNotes[i] || "",
          oninput: (e) => { s.itemNotes[i] = e.target.value; }
        })
      );
      ul.appendChild(li);
    });
    div.appendChild(ul);

    // Mid-session vitals quick log
    div.appendChild(el("h3", {}, "Mid-session vitals (optional)"));
    const midForm = el("div", { class: "form-grid" });
    midForm.appendChild(field("HR", el("input", { id: "mid-hr", type: "number", min: 0, max: 250 })));
    midForm.appendChild(field("SpO2", el("input", { id: "mid-spo2", type: "number", min: 0, max: 100 })));
    midForm.appendChild(field("Borg", el("input", { id: "mid-borg", type: "number", min: 0, max: 10, step: "0.5" })));
    midForm.appendChild(field("Note", el("input", { id: "mid-note" })));
    midForm.appendChild(el("div", { class: "form-actions" },
      el("button", { class: "btn btn-sm", onclick: () => {
        const reading = {
          atIso: new Date().toISOString(),
          hr: numOrNull($("#mid-hr").value),
          spo2: numOrNull($("#mid-spo2").value),
          borg: numOrNull($("#mid-borg").value),
          note: $("#mid-note").value,
        };
        if (reading.hr || reading.spo2 || reading.borg || reading.note) {
          s.vitalsDuring.push(reading);
        }
        $("#mid-hr").value = ""; $("#mid-spo2").value = ""; $("#mid-borg").value = ""; $("#mid-note").value = "";
        render();
      } }, "Log reading")
    ));
    div.appendChild(midForm);

    if (s.vitalsDuring.length) {
      const t = el("table", { class: "mini-table" },
        el("thead", {}, el("tr", {},
          el("th", {}, "Time"), el("th", {}, "HR"), el("th", {}, "SpO2"), el("th", {}, "Borg"), el("th", {}, "Note")
        )),
        el("tbody", {}, ...s.vitalsDuring.map(r => el("tr", {},
          el("td", {}, new Date(r.atIso).toLocaleTimeString()),
          el("td", {}, r.hr ?? "—"), el("td", {}, r.spo2 ?? "—"), el("td", {}, r.borg ?? "—"), el("td", {}, r.note || "")
        )))
      );
      div.appendChild(t);
    }

    div.appendChild(el("div", { class: "form-actions" },
      el("button", { class: "btn btn-primary", onclick: () => { s.step = "post"; render(); } }, "Continue to post-session →"),
      el("button", { class: "btn btn-ghost", onclick: () => { s.step = "pre"; render(); } }, "← Back to pre-session")
    ));
    return div;
  }

  function renderSessionPostForm(p, s) {
    const div = el("div", { class: "subcard" }, el("h3", {}, "Post-session"));
    const form = el("form", { class: "form-grid", onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      s.post = {
        hr: numOrNull(fd.get("phr")),
        sbp: numOrNull(fd.get("psbp")),
        dbp: numOrNull(fd.get("pdbp")),
        spo2: numOrNull(fd.get("pspo2")),
        borgD: numOrNull(fd.get("pborgD")),
        borgRPE: numOrNull(fd.get("pborgRPE")),
        fatigue: numOrNull(fd.get("pfatigue")),
        pef: numOrNull(fd.get("ppef")),
      };
      s.adverse = fd.get("adverse").trim();
      s.notes = fd.get("notes").trim();
      s.nextPlan = fd.get("nextPlan").trim();
      s.createdAt = Date.now();

      // Save and clear active
      const tmpl = s.template;
      const record = {
        id: s.id, patientId: s.patientId, sessionN: s.sessionN, title: s.title, phase: s.phase,
        borgTarget: s.borgTarget, date: s.date, createdAt: s.createdAt,
        pre: s.pre, post: s.post,
        completed: s.completed, itemNotes: s.itemNotes,
        vitalsDuring: s.vitalsDuring, adverse: s.adverse, notes: s.notes, nextPlan: s.nextPlan,
        templateItems: tmpl.items,
      };
      state.sessions.push(record);
      persist();
      state.activeSession = null;
      render();
    }});
    form.appendChild(field("Post HR", el("input", { name: "phr", type: "number", min: 0, max: 250 })));
    form.appendChild(field("Post SBP", el("input", { name: "psbp", type: "number", min: 0, max: 300 })));
    form.appendChild(field("Post DBP", el("input", { name: "pdbp", type: "number", min: 0, max: 200 })));
    form.appendChild(field("Post SpO2", el("input", { name: "pspo2", type: "number", min: 0, max: 100 })));
    form.appendChild(field("Post Borg dyspnea", el("input", { name: "pborgD", type: "number", min: 0, max: 10, step: "0.5" })));
    form.appendChild(field("Post Borg RPE", el("input", { name: "pborgRPE", type: "number", min: 0, max: 10, step: "0.5" })));
    form.appendChild(field("Fatigue (0-10)", el("input", { name: "pfatigue", type: "number", min: 0, max: 10 })));
    form.appendChild(field("Post PEF (asthma)", el("input", { name: "ppef", type: "number" })));
    form.appendChild(field("Adverse events", el("input", { name: "adverse", placeholder: "none / desat / hypotension / sternal / fall / other" }), { full: true }));
    form.appendChild(field("Notes", el("input", { name: "notes" }), { full: true }));
    form.appendChild(field("Next-session plan", el("input", { name: "nextPlan", placeholder: "e.g. ↑ aerobic 3 min, +5% leg press load" }), { full: true }));
    form.appendChild(el("div", { class: "form-actions" },
      el("button", { class: "btn btn-primary", type: "submit" }, "Save session"),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => { state.activeSession.step = "exercise"; render(); } }, "← Back to checklist")
    ));
    div.appendChild(form);
    return div;
  }

  // ===== Reference view =====
  function renderReference() {
    const wrap = el("section", { class: "view ref" });

    wrap.appendChild(refCard("6MWT — Verbatim ATS instructions",
      [SCRIPT_6MWT.intro, "(Demonstrate one lap.)", SCRIPT_6MWT.ready].map(p => el("p", { class: "script" }, p))
    ));

    wrap.appendChild(refCard("6MWT — Minute-by-minute encouragement",
      el("ul", {}, ...SCRIPT_6MWT.cues.map(c => el("li", {}, `@ ${Math.floor(c.atSec/60)}:${String(c.atSec%60).padStart(2,"0")} — "${c.text}"`)))
    ));

    wrap.appendChild(refCard("6MWT — Contraindications & stop criteria",
      el("p", {}, el("b", {}, "Absolute: "), "MI or unstable angina within prior month."),
      el("p", {}, el("b", {}, "Relative: "), "Resting HR >120, SBP >180, DBP >100."),
      el("p", {}, el("b", {}, "Stop the test for: "), "Chest pain, intolerable dyspnea, leg cramps/claudication, staggering, diaphoresis with pallor/cyanosis, ashen appearance, confusion.")
    ));

    wrap.appendChild(refCard("6MWT — Reference equation (Enright & Sherrill 1998)",
      el("p", {}, el("b", {}, "Men: "), "6MWD = (7.57 × ht) − (5.02 × age) − (1.76 × wt) − 309 m   [LLN −153 m]"),
      el("p", {}, el("b", {}, "Women: "), "6MWD = (2.11 × ht) − (2.29 × wt) − (5.78 × age) + 667 m   [LLN −139 m]")
    ));

    wrap.appendChild(refCard("MCID by population",
      el("ul", {},
        el("li", {}, "COPD: 25–35 m"),
        el("li", {}, "PAH: ~33 m"),
        el("li", {}, "Heart failure: 30–50 m (pooled ~30)"),
        el("li", {}, "IPF/ILD: 24–45 m"),
        el("li", {}, "CABG / cardiac rehab: ~25–60 m (mean post-rehab gain ~60 m)")
      )
    ));

    wrap.appendChild(refCard("Prescription from 6MWT",
      el("ul", {},
        el("li", {}, "Endurance training intensity: 70–80% of avg 6MWT speed"),
        el("li", {}, "Avg speed = 6MWD ÷ 360 s"),
        el("li", {}, "Borg dyspnea target: 4–6/10 (CR-10)"),
        el("li", {}, "Re-test every 4–12 weeks; adjust to 80% of new 6MWD-derived speed"),
        el("li", {}, "Use intervals if Borg ≥7 within 2 min at continuous prescription")
      )
    ));

    wrap.appendChild(refCard("Borg CR-10 dyspnea / RPE scale",
      el("table", { class: "mini-table" },
        el("thead", {}, el("tr", {}, el("th", {}, "Score"), el("th", {}, "Description"))),
        el("tbody", {},
          ...[["0","Nothing at all"],["0.5","Very, very slight"],["1","Very slight"],["2","Slight"],["3","Moderate"],["4","Somewhat severe"],["5","Severe"],["7","Very severe"],["10","Maximal"]]
            .map(r => el("tr", {}, el("td", {}, r[0]), el("td", {}, r[1])))
        )
      )
    ));

    wrap.appendChild(refCard("BODE index components (COPD)",
      el("ul", {},
        el("li", {}, "B — BMI (>21 = 0; ≤21 = 1)"),
        el("li", {}, "O — Obstruction (FEV1 % predicted: ≥65=0, 50–64=1, 36–49=2, ≤35=3)"),
        el("li", {}, "D — Dyspnea (mMRC 0–1=0, 2=1, 3=2, 4=3)"),
        el("li", {}, "E — Exercise (6MWD ≥350=0, 250–349=1, 150–249=2, ≤149=3)"),
        el("li", {}, "Total 0–10. 4-yr survival: BODE 0–2 ≈ 80%; 7–10 ≈ 18%.")
      )
    ));

    wrap.appendChild(refCard("KYMITT (Keep Your Move in the Tube) — post-CABG",
      el("ul", {},
        el("li", {}, "Keep elbows close to torso (within an imaginary tube around the trunk)."),
        el("li", {}, "Symmetric, low-load reaching is generally safe; avoid asymmetric loaded reaches."),
        el("li", {}, "Guide load by pain / clicking, not arbitrary weight cutoffs."),
        el("li", {}, "Avoid Valsalva (no breath-holding lifts). Splinted cough with a pillow."),
        el("li", {}, "No driving 4 weeks; surgeon-cleared upper-body resistance from ~6 weeks.")
      )
    ));

    wrap.appendChild(refCard("EIB-prevention warm-up (asthma)",
      el("ul", {},
        el("li", {}, "Pre-exercise SABA 15 min before, if prescribed."),
        el("li", {}, "Option A: 6–8 × 30-sec near-maximal sprints with 1.5-min recoveries."),
        el("li", {}, "Option B: 15 min continuous moderate warm-up at ~60% VO2max."),
        el("li", {}, "Both induce a 1–2 hour refractory period."),
        el("li", {}, "Avoid abrupt stopping (prolongs cooling/drying)."),
        el("li", {}, "PEF post-exercise drop ≥10% = EIB.")
      )
    ));

    wrap.appendChild(refCard("HF decompensation (always defer / refer)",
      el("ul", {},
        el("li", {}, "Weight gain >2 kg in 3 days (or >2.3 kg in a week)"),
        el("li", {}, "New orthopnea, PND, or night cough"),
        el("li", {}, "New peripheral edema or worsening of existing"),
        el("li", {}, "Resting HR >100, SBP <90 with symptoms"),
        el("li", {}, "New rapid AF >130 bpm, sustained VT, ICD shock")
      )
    ));

    return wrap;
  }

  function refCard(title, ...children) {
    return el("div", { class: "card ref-card" }, el("h2", {}, title), ...children);
  }

  // ---------------------- shared widgets ----------------------
  function patientPicker() {
    const wrap = el("div", { class: "card patient-picker" });
    if (state.patients.length === 0) {
      wrap.appendChild(el("div", { class: "empty" }, "No patients. Add one in the Patients tab."));
      return wrap;
    }
    const sel = el("select", { onchange: (e) => { state.selectedPatientId = e.target.value || null; render(); } });
    sel.appendChild(el("option", { value: "" }, "— select patient —"));
    for (const p of [...state.patients].sort((a,b)=>a.name.localeCompare(b.name))) {
      const opt = el("option", { value: p.id }, `${p.name} · ${PROGRAMS[p.condition]?.label || p.condition || "—"}`);
      if (p.id === state.selectedPatientId) opt.selected = true;
      sel.appendChild(opt);
    }
    wrap.appendChild(el("label", {}, "Patient: ", sel));
    return wrap;
  }

  function field(label, input, opts = {}) {
    return el("div", { class: "field" + (opts.full ? " full" : "") },
      el("label", {}, label),
      input
    );
  }

  function select(name, options, required = false) {
    const s = el("select", { name, required: required ? true : false });
    for (const [v, l] of options) s.appendChild(el("option", { value: v }, l));
    return s;
  }

  function numOrNull(v) {
    if (v === "" || v == null) return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  }

  // ---------------------- export / import ----------------------
  function exportData() {
    const blob = new Blob([JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      patients: state.patients,
      tests: state.tests,
      sessions: state.sessions,
    }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cr-ex-export-${todayIso()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data.patients) throw new Error("Invalid file");
        if (!confirm(`Import ${data.patients.length} patients, ${data.tests?.length||0} tests, ${data.sessions?.length||0} sessions? This will REPLACE current data.`)) return;
        state.patients = data.patients || [];
        state.tests    = data.tests    || [];
        state.sessions = data.sessions || [];
        persist();
        render();
      } catch (e) {
        alert("Import failed: " + e.message);
      }
    };
    reader.readAsText(file);
  }

  // ---------------------- bootstrap ----------------------
  $$(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      state.view = tab.dataset.view;
      render();
    });
  });
  $("#export-btn").addEventListener("click", exportData);
  $("#import-btn").addEventListener("click", () => $("#import-file").click());
  $("#import-file").addEventListener("change", (e) => {
    if (e.target.files[0]) importData(e.target.files[0]);
    e.target.value = "";
  });

  render();
})();
