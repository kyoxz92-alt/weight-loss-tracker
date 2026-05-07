// CR-Ex program library
// Session-by-session physio programs distilled from docs/conditions.md
// Sources: GOLD 2025, GINA 2025, ATS 2023 PR CPG, AACVPR 6th ed, ESC 2021/2023, ATS 2002/ERS-ATS 2014.

window.CREX_PROGRAMS = {
  copd: {
    label: "COPD",
    summary: "8-week pulmonary rehab, 2x/week, 16 sessions. Endurance + resistance + breathing + airway clearance.",
    redFlags: [
      "SpO2 <88% on prescribed O2 at rest",
      "HR rest >120 bpm",
      "SBP >180 or <90; DBP >100",
      "Fever; acute change in sputum (volume / purulence)",
      "Unstable angina; new arrhythmia"
    ],
    stopRules: [
      "SpO2 <85% despite O2 titration",
      "Borg dyspnea ≥8 not relieved by 2-min rest + PLB",
      "HR drop >10 bpm with rising workload",
      "SBP rise >250, fall >10 with ischemic features; DBP >115",
      "New chest pain, cyanosis, lightheadedness, ataxia",
      "New arrhythmia or wheeze unresponsive to bronchodilator"
    ],
    targets: {
      borgDyspnea: "4-6/10",
      spo2Floor: "≥88-90% during exercise (titrate O2)",
      mcid6mwd: "25-35 m"
    },
    sessions: [
      { n: 1, title: "Assessment & Education",
        items: [
          "6MWT #1 (baseline)",
          "1-min sit-to-stand baseline",
          "Handgrip dynamometry",
          "CAT, mMRC, Borg dyspnea baseline",
          "Pursed-lip breathing 6 reps × 4 sets",
          "Diaphragmatic breathing supine 5 min",
          "Inhaler technique check + written action plan",
          "Education: pacing (4 P's), exacerbation triggers"
        ], borg: "≤3" },
      { n: 2, title: "Baseline conditioning",
        items: [
          "6MWT #2 (use best of two for prescription)",
          "Treadmill 10 min @ 70% 6MWT speed",
          "Cycle ergometer 5 min low load",
          "Leg press 2×10 @ 50% 1-RM",
          "Seated row 2×10",
          "PLB throughout effort",
          "Stretch (pectorals, hip flexors, hamstrings) 5 min"
        ], borg: "4-5" },
      { n: 3, title: "Add lower-body strength",
        items: [
          "Treadmill 12 min @ 70% 6MWT speed",
          "Cycle 7 min low load",
          "Leg press 2×10, Seated row 2×10",
          "Knee extension 2×10 @ 50% 1-RM",
          "Biceps curl 2×10 light",
          "ACBT cycle ×3 if sputum present"
        ], borg: "4-5" },
      { n: 4, title: "Progress aerobic",
        items: [
          "Treadmill 15 min @ 75% 6MWT speed",
          "Cycle 8 min",
          "Resistance circuit 2×12 (leg press, row, knee ext, biceps)",
          "Calf raises 2×10",
          "Stair step 1×1 min if tolerated",
          "SpO2 check at minutes 5 / 10 / 15"
        ], borg: "5-6" },
      { n: 5, title: "Continuous or interval",
        items: [
          "If SpO2 drops <88%: intervals 1 min walk : 1 min rest × 12",
          "Otherwise: 18 min continuous @ 75-80% 6MWT speed",
          "Resistance 3×10 (leg press, row, knee ext, biceps)",
          "Lat pulldown 2×10"
        ], borg: "5-6" },
      { n: 6, title: "Add unsupported arm work",
        items: [
          "Aerobic 20 min @ 75-80% 6MWT speed",
          "Resistance 3×10 (+5-10% load if last set RPE ≤6)",
          "Unsupported 1-kg dowel raises 2×10",
          "PLB on effort phase"
        ], borg: "5-6" },
      { n: 7, title: "Pacing for ADLs",
        items: [
          "Aerobic 22 min @ 80% 6MWT speed",
          "Re-test 1-min sit-to-stand",
          "Resistance 3×10 progressed loads",
          "Pacing skill: shower / dressing simulation"
        ], borg: "5-6" },
      { n: 8, title: "Mid-program review",
        items: [
          "Repeat 6MWT (best of two)",
          "Repeat CAT, mMRC",
          "Re-prescribe: 80% of new 6MWT speed",
          "Aerobic 25 min at new target",
          "Resistance 3×10-12"
        ], borg: "5-6" },
      { n: 9, title: "Add balance work",
        items: [
          "Aerobic 25 min continuous (or 2×12 min intervals, 2-min recovery)",
          "Tandem stance 3×30 s",
          "Single-leg stance 3×15 s each side",
          "Resistance 3×12"
        ], borg: "5-6" },
      { n: 10, title: "Begin home walking program",
        items: [
          "Aerobic 27 min",
          "Resistance 3×12 (+5-10% load if last set RPE ≤6)",
          "Pedometer / step-goal counseling (+500 steps/week)",
          "Home walking plan handout"
        ], borg: "5-6" },
      { n: 11, title: "Stair circuit",
        items: [
          "Aerobic 30 min @ 80% peak speed",
          "Stair circuit 2×1 min",
          "Resistance 3×12",
          "Reinforce ACBT independence"
        ], borg: "5-6" },
      { n: 12, title: "Reduced rest circuits",
        items: [
          "Aerobic 30 min",
          "Resistance circuit 3×12 with 40-s rest",
          "Reassess sit-to-stand and handgrip"
        ], borg: "5-6" },
      { n: 13, title: "Arm ergometer + functional task",
        items: [
          "Aerobic 30 min + arm ergometer 5 min",
          "Functional: carry-and-walk with shopping bag",
          "Sit-to-stand with object 2×10"
        ], borg: "5-6" },
      { n: 14, title: "Transition planning",
        items: [
          "Aerobic 30-35 min",
          "Resistance 3×12 progressed",
          "Discuss community gym / maintenance class / home program"
        ], borg: "5-6" },
      { n: 15, title: "Self-directed under supervision",
        items: [
          "Patient leads warm-up, aerobic, resistance",
          "Troubleshoot home program issues",
          "Review exacerbation action plan"
        ], borg: "5-6" },
      { n: 16, title: "Discharge",
        items: [
          "Final 6MWT, CAT, mMRC",
          "Final sit-to-stand, handgrip",
          "Document MCID achievement (≥30 m on 6MWT, ≥2 on CAT)",
          "Provide 12-week home program + written action plan"
        ], borg: "—" }
    ]
  },

  asthma: {
    label: "Asthma",
    summary: "8-week conditioning + EIB-prevention warm-up program, 8 supervised sessions + 2-3 home/week.",
    redFlags: [
      "PEF <60% personal best",
      "ACT <15",
      "Current wheeze with SpO2 <94%",
      "Recent ED visit / exacerbation (defer high-intensity)"
    ],
    stopRules: [
      "PEF <60% best",
      "Wheeze unrelieved by 2 puffs SABA after 10 min",
      "SpO2 <92%",
      "Speech in single words, accessory muscle use",
      "Chest tightness with HR/BP instability",
      "Cyanosis or drowsiness — emergency referral"
    ],
    targets: {
      borgDyspnea: "4-7/10 (CR-10)",
      spo2Floor: "≥92%",
      pefDropFlag: "≥10% post-exercise = EIB"
    },
    sessions: [
      { n: 1, title: "Assessment & Education",
        items: [
          "ACT, Nijmegen questionnaire, baseline PEF",
          "6MWT, sit-to-stand",
          "Inhaler / spacer technique check",
          "Trigger map and written asthma action plan reviewed",
          "Nasal-diaphragmatic breathing (Papworth) 10 min"
        ], borg: "≤3" },
      { n: 2, title: "EIB-prevention warm-up + base aerobic",
        items: [
          "PEF pre-session",
          "Warm-up: 6 × 30-s brisk cycle sprints with 90-s recovery",
          "Continuous cycle 15 min @ 60% HRR",
          "Leg press, chest press, row 2×10 moderate",
          "Breathing retraining 10 min",
          "PEF post-session — document % drop"
        ], borg: "4-5" },
      { n: 3, title: "Postural drill + scapular setting",
        items: [
          "Sprint warm-up (6 × 30-s)",
          "Aerobic 18 min @ 65% HRR",
          "Resistance 2×12",
          "Chin tucks, wall angels ×10",
          "Reinforce nasal breathing during low-intensity blocks"
        ], borg: "4-5" },
      { n: 4, title: "Treadmill intervals",
        items: [
          "Sprint warm-up",
          "Treadmill 1:1 intervals (1 min @ 75% HRmax : 1 min recovery) × 10",
          "Resistance 3×10 progressed",
          "Buteyko-style control pause practice"
        ], borg: "5-6" },
      { n: 5, title: "Continuous + aquatic option",
        items: [
          "Sprint warm-up",
          "Continuous 25 min cycle/treadmill @ 70% HRR",
          "Resistance 3×10",
          "Introduce swimming/aquatic option if available",
          "Reassess Nijmegen, PEF stability"
        ], borg: "5-6" },
      { n: 6, title: "Mixed-modality + VCD screen",
        items: [
          "Sprint warm-up",
          "Aerobic 30 min mixed treadmill + cycle",
          "Resistance 3×12 progressed",
          "Vocal cord dysfunction screen if symptoms inspiratory"
        ], borg: "5-6" },
      { n: 7, title: "Outdoor-conditions strategy",
        items: [
          "Sprint warm-up",
          "Aerobic 30-35 min @ 75% HRR",
          "Resistance circuit 3×12 with 30-s rest",
          "Discussion: scarf/mask in cold/dry air, indoor alternatives, pollen-time avoidance"
        ], borg: "5-6" },
      { n: 8, title: "Discharge",
        items: [
          "Repeat ACT, Nijmegen, 6MWT, sit-to-stand",
          "Document outcomes (target ACT ↑≥3, 6MWD ↑≥30 m)",
          "12-week home program with EIB warm-up template",
          "Confirm action plan, SABA pre-exercise rule, ICS adherence"
        ], borg: "—" }
    ]
  },

  cabg: {
    label: "Post-CABG",
    summary: "Phase I inpatient (POD 1-7) + Phase II outpatient (36 sessions / 12 weeks). Sternal precautions / KYMITT.",
    redFlags: [
      "Sternal click / instability / pop",
      "Wound dehiscence, drainage, fever",
      "Post-op anemia (Hb <8)",
      "Uncontrolled HF, pleural effusion compromising oxygenation",
      "New arrhythmia (post-op AF common)"
    ],
    stopRules: [
      "Angina or anginal-equivalent (jaw, arm, epigastric)",
      "SBP fall ≥10 mmHg with ischemic signs / rising workload",
      "SBP >250 or DBP >115",
      "New ST changes, sustained VT, ≥2nd-degree AV block, multifocal PVCs increasing",
      "Sternal click, pop, instability, drainage, fever",
      "HR drop >10 bpm with workload",
      "Borg dyspnea ≥7 or RPE >17",
      "Patient request"
    ],
    targets: {
      hrPhase1: "rest +20 bpm cap",
      hrPhase2: "rest +20-30 bpm; 60-80% HRR by mid-program",
      borgPhase1: "≤11-13 / Borg ≤3",
      borgPhase2: "11-14 (6-20 scale) / 3-5 (CR-10)",
      kymitt: "Elbows in the tube; load-by-symptom; avoid Valsalva; no driving 4 wk; no upper-body resistance until ≥6 wk + MD clearance"
    },
    sessions: [
      // Phase I — Inpatient
      { n: 1, phase: "Phase I", title: "POD 1 — Bed mobility & breathing",
        items: [
          "Bed mobility with KYMITT (log-roll using legs, push from elbow not palm)",
          "Ankle pumps 10×/hr while awake",
          "Splinted cough with pillow",
          "Incentive spirometer 10 breaths/hr",
          "Sit at edge of bed; transfer to chair if hemodynamically stable",
          "Continuous vitals; target SpO2 ≥92%, HR rest +20 max"
        ], borg: "≤3" },
      { n: 2, phase: "Phase I", title: "POD 2 — Sit-to-stand & in-room walks",
        items: [
          "Sit-to-stand ×3-5",
          "In-room walks 2-3×/day, 50-100 ft",
          "AROM ankles/knees/hips; sub-90° shoulder AROM, elbows in tube",
          "Pain control before mobilization"
        ], borg: "≤3" },
      { n: 3, phase: "Phase I", title: "POD 3 — Hall walks",
        items: [
          "Hall walk 100-200 ft × 2-3",
          "Standing AROM",
          "Marching in place",
          "Reinforce KYMITT for ADLs (combing hair within tube, reaching)",
          "Splinted cough q4h"
        ], borg: "≤3" },
      { n: 4, phase: "Phase I", title: "POD 4 — Add seated leg work",
        items: [
          "Hall walk 300-400 ft × 3",
          "Standing AROM",
          "Seated leg extensions 1×10 (no resistance)",
          "Stairs assessment if discharge near (1 flight with rail)"
        ], borg: "≤3" },
      { n: 5, phase: "Phase I", title: "POD 5-7 — Discharge prep",
        items: [
          "Hall walks 500-800 ft × 2",
          "Stairs 1 flight independently",
          "Provide written home walking plan (5-10 min, 2-3×/day, RPE ≤11)",
          "Driving restriction 4 weeks; no lifting >5-10 lb 6 weeks (or KYMITT load-by-symptom)",
          "Phase II referral booked for week 2-4"
        ], borg: "≤3" },
      // Phase II — Outpatient
      { n: 6, phase: "Phase II", title: "S1 (~wk 2-3) — Outpatient assessment",
        items: [
          "Full assessment incl. 6MWT (sub-max; stop if SpO2 <90% or RPE >13)",
          "Telemetry baseline, BP, weight log review",
          "Treadmill 10 min @ 1.5-2.0 mph, RPE 11-12",
          "Stationary cycle 5 min low load",
          "Lower-body stretching only",
          "Education: KYMITT detail, weight monitoring (call MD if +2 kg/3 d), wound check"
        ], borg: "11-12 / 3" },
      { n: 7, phase: "Phase II", title: "S2 — Build aerobic",
        items: [
          "Treadmill 12 min RPE 11-13",
          "Cycle 8 min",
          "Upper-body AROM in tube",
          "NO upper-body resistance"
        ], borg: "11-13 / 3" },
      { n: 8, phase: "Phase II", title: "S3 — Lower-body AROM",
        items: [
          "Treadmill 15 min",
          "Cycle 10 min",
          "Seated lower-body AROM 1×10",
          "HR cap = rest +20 bpm"
        ], borg: "12 / 3-4" },
      { n: 9, phase: "Phase II", title: "S4 (wk ~3) — NuStep added",
        items: [
          "Aerobic 20 min split treadmill + cycle",
          "NuStep 5 min",
          "RPE 12-13"
        ], borg: "12-13 / 4" },
      { n: 10, phase: "Phase II", title: "S5 — Begin lower-body resistance",
        items: [
          "Aerobic 22 min",
          "Leg press 1×10 light",
          "Calf raise 1×10",
          "Seated knee extension 1×10",
          "NO upper-body load"
        ], borg: "12-13 / 4" },
      { n: 11, phase: "Phase II", title: "S6 (wk ~4) — Walking poles",
        items: [
          "Aerobic 25 min",
          "Lower-body resistance 2×10",
          "Light walking poles for posture (no pull)"
        ], borg: "12-13 / 4" },
      { n: 12, phase: "Phase II", title: "S7 — Driving clearance",
        items: [
          "Aerobic 25 min @ RPE 13",
          "Resistance 2×12 lower body",
          "Driving clearance discussion with MD"
        ], borg: "13 / 4" },
      { n: 13, phase: "Phase II", title: "S8 (wk ~5) — Add arm ergometer",
        items: [
          "Aerobic 30 min",
          "Arm ergometer 3 min very low load if pain-free and ≥5 wk post-op",
          "Sternum check"
        ], borg: "13 / 4" },
      { n: 14, phase: "Phase II", title: "S9 — Progress arm ergometer",
        items: [
          "Aerobic 30 min",
          "Arm ergometer 5 min light",
          "Lower-body resistance 2×12 progressed"
        ], borg: "13 / 4" },
      { n: 15, phase: "Phase II", title: "S10 (wk ~6) — Sternal union expected; intro UB resistance",
        items: [
          "Repeat 6MWT",
          "Begin upper-body resistance — chest press / row at 1-3 lb or 5% body weight, 1×10 each",
          "ONLY if no sternal click and surgeon-cleared",
          "KYMITT respected throughout"
        ], borg: "13 / 4" },
      { n: 16, phase: "Phase II", title: "S11 — Combined UB + LB resistance",
        items: [
          "Aerobic 30-35 min",
          "Upper-body resistance 1×10-12 light",
          "Lower-body resistance 2×12"
        ], borg: "13 / 4" },
      { n: 17, phase: "Phase II", title: "S12 (wk ~7) — Intro intervals",
        items: [
          "Aerobic 35 min including 2×3-min intervals @ RPE 14",
          "Resistance circuit (full body) 2×10-12 light"
        ], borg: "13-14 / 4-5" },
      { n: 18, phase: "Phase II", title: "S13 — Progress intensity",
        items: [
          "Aerobic 35-40 min",
          "Resistance progressed 5-10% if tolerated"
        ], borg: "13-14 / 4-5" },
      { n: 19, phase: "Phase II", title: "S14 (wk ~8) — Functional tasks",
        items: [
          "Aerobic 40 min",
          "Resistance 2×12 progressed",
          "Functional: timed sit-to-stand, lift basket within KYMITT"
        ], borg: "13-14 / 4-5" },
      { n: 20, phase: "Phase II", title: "S15 — Mid-program 6MWT",
        items: [
          "Repeat 6MWT (mid-program)",
          "Adjust prescription",
          "Aerobic 40 min @ RPE 13-14",
          "Resistance 2-3×10"
        ], borg: "13-14 / 4-5" },
      { n: 21, phase: "Phase II", title: "S16-18 (wk 9) — Stair climb",
        items: [
          "Aerobic 40 min interval/continuous mix",
          "Resistance 3×10 progressed",
          "Stair climb circuit 5-10 min"
        ], borg: "13-14 / 4-5" },
      { n: 22, phase: "Phase II", title: "S19-24 (wk 10-11) — Return to work prep",
        items: [
          "Aerobic 40-45 min, RPE 13-15 selectively",
          "Resistance 3×10-12",
          "Arm ergometer 10 min",
          "Begin return-to-work conditioning specific tasks"
        ], borg: "13-15 / 5" },
      { n: 23, phase: "Phase II", title: "S25-30 (wk 11-12) — HIIT consideration",
        items: [
          "Aerobic 45 min including 4×4 min @ 80% HRR if HF-free and cleared",
          "Resistance 3×12",
          "Begin transition planning to Phase III"
        ], borg: "13-15 / 5" },
      { n: 24, phase: "Phase II", title: "S31-35 — Independence coaching",
        items: [
          "Maintain volume / intensity",
          "Coach independence",
          "Pedometer / HR-monitor self-management"
        ], borg: "13-14 / 4-5" },
      { n: 25, phase: "Phase II", title: "S36 — Discharge",
        items: [
          "Final 6MWT, sit-to-stand, DASI, PHQ-9",
          "Lipid / BP / weight review",
          "Provide Phase III / maintenance program"
        ], borg: "—" }
    ]
  },

  hf: {
    label: "Heart Failure",
    summary: "12-week supervised program (3x/week, 36 sessions). MICT base; HIIT in stable HFrEF only. HF-ACTION / REHAB-HF model.",
    redFlags: [
      "Weight gain >2 kg in 3 days",
      "New orthopnea or PND",
      "Resting HR >100 bpm",
      "SBP <90 or symptomatic",
      "New arrhythmia or increased edema",
      "Recent decompensation hospitalization (require ≥1-6 wk stabilization)"
    ],
    stopRules: [
      "SBP fall ≥10 mmHg below resting with workload (especially with symptoms)",
      "SBP >180 / DBP >110 at peak",
      "New angina, severe dyspnea (Borg ≥7), dizziness, ataxia, confusion",
      "HR fall >10 bpm with rising workload",
      "Sustained VT, rapid AF >130 bpm, new heart block, ICD shock or rate approaching detection",
      "SpO2 <90%",
      "New crackles audible at bases mid-session",
      "Patient request"
    ],
    targets: {
      borgInitial: "11-12 / 3",
      borgMid: "12-13 / 4",
      borgLate: "13-15 / 5 (selective HIIT only if stable, MD-cleared)",
      hrCapEarly: "rest +10-15 bpm",
      hrCapMid: "rest +20 bpm",
      hrCapLate: "60-80% HRR (use RPE if AF or beta-blocker)",
      mcid6mwd: "30 m",
      mcidKccq: "5 points"
    },
    sessions: [
      { n: 1, title: "S1 — Assessment & education",
        items: [
          "NYHA class, KCCQ, 6MWT (sub-max), SPPB, handgrip",
          "Weight log review",
          "Education: daily weighing, sodium <2-3 g/day, fluid limit (often 1.5-2 L)",
          "Walk 10 min @ RPE 11",
          "Diaphragmatic breathing 5 min"
        ], borg: "11 / 3" },
      { n: 2, title: "S2 — Build aerobic base",
        items: [
          "Walk/treadmill 10 min @ HR rest +10 bpm, RPE 11",
          "Cycle 5 min low load",
          "Lower-body AROM 1×10",
          "Continuous telemetry; SpO2 ≥92%"
        ], borg: "11 / 3" },
      { n: 3, title: "S3 — Begin resistance + balance",
        items: [
          "Aerobic 12 min split treadmill / cycle",
          "Leg press 1×10 @ 30% 1-RM",
          "Seated row 1×10 light",
          "Tandem stance 3×30 s"
        ], borg: "11-12 / 3-4" },
      { n: 4, title: "S4 (wk 2) — Add chest press",
        items: [
          "Aerobic 15 min @ RPE 11-12",
          "Resistance 1×12 (leg press, row, chest press light)",
          "HR cap = rest +15 bpm initially"
        ], borg: "11-12 / 3-4" },
      { n: 5, title: "S5 — Knee extension added",
        items: [
          "Aerobic 18 min",
          "Resistance 2×10 progressed",
          "Add knee extension",
          "Reinforce daily weight log"
        ], borg: "12 / 4" },
      { n: 6, title: "S6 — Calf raises + sit-to-stand",
        items: [
          "Aerobic 20 min",
          "Resistance 2×10",
          "Calf raises, biceps curl 1-kg",
          "Sit-to-stand 2×10"
        ], borg: "12 / 4" },
      { n: 7, title: "S7 (wk 3) — Recheck orthostatic BP",
        items: [
          "Aerobic 22 min @ RPE 12",
          "Resistance 2×12",
          "Orthostatic BP rechecked"
        ], borg: "12 / 4" },
      { n: 8, title: "S8 — Add single-leg balance",
        items: [
          "Aerobic 25 min",
          "Resistance 2×12 progressed (5-10%)",
          "Single-leg stance 3×15 s each side"
        ], borg: "12-13 / 4" },
      { n: 9, title: "S9 — Introduce IMT",
        items: [
          "Aerobic 25 min",
          "Resistance circuit 2×12",
          "IMT if MIP low: 30% MIP × 30 breaths × 2/day home"
        ], borg: "12-13 / 4" },
      { n: 10, title: "S10 (wk 4) — Stair-step practice",
        items: [
          "Aerobic 27 min",
          "Resistance 2×12",
          "Stair-step 1 min × 2"
        ], borg: "12-13 / 4" },
      { n: 11, title: "S11 — Raise HR cap",
        items: [
          "Aerobic 30 min @ RPE 12-13",
          "HR cap = rest +20 bpm",
          "Resistance 3×10"
        ], borg: "12-13 / 4" },
      { n: 12, title: "S12 — Re-test STS and gait",
        items: [
          "Aerobic 30 min",
          "Resistance 3×10",
          "Repeat sit-to-stand and gait speed"
        ], borg: "12-13 / 4" },
      { n: 13, title: "S13 (wk 5) — Interval intro",
        items: [
          "Aerobic 30 min including 2×3 min @ RPE 14 (interval intro)",
          "Resistance 3×10-12"
        ], borg: "12-14 / 4-5" },
      { n: 14, title: "S14 — Carry-load functional",
        items: [
          "Aerobic 32 min",
          "Resistance progressed 5-10%",
          "Carry 2-kg load 20 m within tolerance"
        ], borg: "13 / 4-5" },
      { n: 15, title: "S15 — Mid-program 6MWT + KCCQ",
        items: [
          "Repeat 6MWT, KCCQ",
          "Adjust intensity by new HRR / speed",
          "Aerobic 35 min"
        ], borg: "13 / 4-5" },
      { n: 16, title: "S16-18 (wk 6) — HIIT consideration",
        items: [
          "Aerobic 35 min",
          "Resistance 3×10 progressed",
          "If stable HFrEF, no decompensation, ICD threshold respected: 4×2 min @ RPE 15 with 3-min active recovery"
        ], borg: "13-15 / 5" },
      { n: 17, title: "S19-21 (wk 7) — Balance circuit",
        items: [
          "Aerobic 35-40 min MICT or HIIT",
          "Resistance 3×12",
          "Balance circuit (tandem walk, single-leg stance, weight shifts)"
        ], borg: "13-15 / 5" },
      { n: 18, title: "S22-24 (wk 8) — Reassess SPPB",
        items: [
          "Aerobic 40 min",
          "Resistance progressed",
          "Reassess SPPB",
          "Vocational return discussion"
        ], borg: "13-15 / 5" },
      { n: 19, title: "S25-27 (wk 9) — 4×4 HIIT if tolerated",
        items: [
          "Aerobic 40 min, mix continuous and HIIT (4×4 min @ 85-95% HRpeak with 3-min active recovery)",
          "Resistance 3×12 with 30-s rest"
        ], borg: "13-15 / 5" },
      { n: 20, title: "S28-30 (wk 10) — Functional integration",
        items: [
          "Aerobic 40-45 min",
          "Resistance 3×12 progressed",
          "Functional integration (stairs, lifting, ADL simulation)"
        ], borg: "13-15 / 5" },
      { n: 21, title: "S31-33 (wk 11) — Transition planning",
        items: [
          "Aerobic 45 min",
          "Resistance 3×12",
          "Begin transition: community / home, telehealth maintenance"
        ], borg: "13-14 / 4-5" },
      { n: 22, title: "S34-35 (wk 12) — Self-directed",
        items: [
          "Self-directed under supervision",
          "Confirm independence with HR / RPE self-monitoring"
        ], borg: "13-14 / 4-5" },
      { n: 23, title: "S36 — Discharge",
        items: [
          "Final 6MWT, KCCQ, SPPB, handgrip",
          "Document outcomes (Δ6MWD ≥30 m MCID, ΔKCCQ ≥5)",
          "Home program; HF action plan; daily weight log template"
        ], borg: "—" }
    ]
  }
};

// 6MWT script — verbatim ATS 2002
window.CREX_6MWT_SCRIPT = {
  intro: "The object of this test is to walk as far as possible for 6 minutes. You will walk back and forth in this hallway. Six minutes is a long time to walk, so you will be exerting yourself. You will probably get out of breath or become exhausted. You are permitted to slow down, to stop, and to rest as necessary. You may lean against the wall while resting, but resume walking as soon as you are able. You will be walking back and forth around the cones. You should pivot briskly around the cones and continue back the other way without hesitation. Now I'm going to show you. Please watch the way I turn without hesitation.",
  ready: "Are you ready to do that? I am going to use this counter to keep track of the number of laps you complete. I will click it each time you turn around at this starting line. Remember that the object is to walk AS FAR AS POSSIBLE for 6 minutes, but don't run or jog. Start now, or whenever you are ready.",
  cues: [
    { atSec: 60,  text: "You are doing well. You have 5 minutes to go." },
    { atSec: 120, text: "Keep up the good work. You have 4 minutes to go." },
    { atSec: 180, text: "You are doing well. You are halfway done." },
    { atSec: 240, text: "Keep up the good work. You have only 2 minutes left." },
    { atSec: 300, text: "You are doing well. You have only 1 minute to go." },
    { atSec: 345, text: "In a moment I'm going to tell you to stop. When I do, just stop right where you are and I will come to you." },
    { atSec: 360, text: "Stop." }
  ]
};

// Reference equations (Enright & Sherrill 1998)
window.CREX_PREDICT_6MWD = function (sex, age, height_cm, weight_kg) {
  if (!age || !height_cm || !weight_kg) return null;
  if (sex === "M") {
    const pred = (7.57 * height_cm) - (5.02 * age) - (1.76 * weight_kg) - 309;
    return { predicted: Math.round(pred), lln: Math.round(pred - 153) };
  }
  if (sex === "F") {
    const pred = (2.11 * height_cm) - (2.29 * weight_kg) - (5.78 * age) + 667;
    return { predicted: Math.round(pred), lln: Math.round(pred - 139) };
  }
  return null;
};

// VO2peak estimate (Cahalin 1996a, simple)
window.CREX_VO2_FROM_6MWD = function (distance_m) {
  if (!distance_m) return null;
  return +(0.03 * distance_m + 3.98).toFixed(1);
};
