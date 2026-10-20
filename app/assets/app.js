/* Shop bench for one truck. Copy follows the 12 Oct 2026 package. */
(function () {
  "use strict";
  var KEY = "stephs-wj-2004";
  var LOCK_STEPS = { 6: true, 7: true, 10: true, 11: true };
  var STEPS_505 = { start: 1, idle: 1, vac: 1, coils: 1, pintle: 1, replace: 1, clean: 1, relearn: 1, verify: 1, elec: 1, wiggle: 1, circuit: 1 };
  var STEPS_161 = { stored: 1, oil: 1, connector: 1, fuse: 1, ohms: 1, power: 1, control: 1, result: 1, endno: 1, endoil: 1 };
  var CRUMB = {
    start: "P0505 stored", idle: "Idle", vac: "Vacuum", coils: "IAC ohms", pintle: "Pintle",
    replace: "New IAC", clean: "Throttle body", relearn: "Relearn", verify: "Verify",
    elec: "Electrical", wiggle: "Wiggle", circuit: "Circuits",
    stored: "P0161 stored", oil: "Oil gate", connector: "Connector", fuse: "Fuse",
    ohms: "Heater ohms", power: "Power", control: "Control", result: "Result",
    endno: "Not stored", endoil: "Oil stop"
  };
  var ORDER = [
    "STOP DRIVING if the manifold is glowing or oil is reaching hot exhaust.",
    "Let the vehicle cool completely. An hour is a minimum after a glow. Do not spray water. Do not degrease a hot pipe.",
    "Find and fix the vacuum leak. TEST REQUIRED. Leak is a LIKELY high-idle cause and only a POSSIBLE lean-glow cause. Do not relearn yet.",
    "Replace the damaged IAC with a NEW correct unit. 4874373AB CATALOG LISTED. Verify by VIN. No used motors. Pintle was moved; ohms in range do not save it.",
    "Do NOT move the new IAC pintle. Not in the box, not to seat it, not to clean behind the tip. If it does not sit flush, look for a pinched O-ring.",
    "Clean the throttle body. Plate must close. Cable must return. Do not soak the TPS.",
    "Reset the PCM and perform the idle relearn. Only after 3–6. Cable throttle. No pedal relearn.",
    "Verify warm idle. 700–800 rpm screen. Above about 1000 rpm: back to the leak, the plate, and the IAC O-ring. Do not reset again and hope.",
    "Locate and repair the oil leak. Degrease cold. Trace fresh oil. LIKELY places: valve cover, filter-adapter O-rings, oil-pressure sender, pan gasket, rear main. Do not replace a rear main until the adapter, the pan, and the sender are ruled out.",
    "Recheck and repair the P0161 heater circuit. Separate fault. Replace the sensor only if the element or the sensor connector failed, and only after oil is no longer reaching it.",
    "Clear codes. Photograph the scan tool first. Freeze frame is gone once you clear.",
    "Start, monitor, and rescan. Watch the manifold from the side. Watch for a new oil track.",
    "If the manifold glows again, STOP immediately. Key off. Cool. Tow. Do not repeat the relearn. Lean, misfire, timing signal, and a restricted catalyst are all still open."
  ];
  var ORDER_TAG = [
    ["stop", "STOP"], ["stop", "STOP"], ["test", "TEST REQUIRED"], ["cat", "CATALOG LISTED"],
    ["stop", "STOP"], null, null, ["test", "TEST REQUIRED"],
    ["likely", "LIKELY"], ["test", "TEST REQUIRED"], null, null,
    ["stop", "STOP"]
  ];
  var COUNTER = "2004 Grand Cherokee, 4.0L, this VIN. California package if I count four oxygen sensors. I need the Bank 2 Sensor 2, rear pipe, after the rear mini-cat — or the short CCV hoses, 4854265 — or a new IAC, 4874373AB, and I will not let anyone push the pintle. If the counter's picture does not match the part in my hand, I do not buy it.";
  var IAC_CAVEAT = " Good ohms do not save a pushed pintle. Not a 2004 FSM limit.";
  var JUMPS = [
    { test: /\bp0?161\b|\bb2s2\b|bank\s*2\s*sensor\s*2/, mode: "walk", tree: "p0161" },
    { test: /\bpintle\b/, mode: "walk", tree: "p0505", step: "pintle" },
    { test: /key-?on|\bpcm\b|solo pcm|412/, mode: "common", page: "now" },
    { test: /\bp0?505\b/, mode: "walk", tree: "p0505" },
    { test: /4874373/, mode: "bench", map: "hoses", part: true },
    { test: /\bbooster\b/, mode: "bench", map: "hoses", node: "booster" },
    { test: /do[- ]?not[- ]?buy|\b23142\b|56029001|\b53030006\b/, mode: "bench", map: "hoses", filter: "no", part: true },
    { test: /death wobble|track bar/, mode: "common", page: "wobble" },
    { test: /crank sensor|hot stall|\bcps\b/, mode: "common", page: "hotstall" },
    { test: /under[- ]?hood|\bpdc\b|power distribution/, mode: "common", page: "pdc" },
    { test: /junction block|driver.?side fuse|interior fuse/, mode: "common", page: "junction" },
    { test: /\biod\b|parasitic|dead battery/, mode: "common", page: "iod" },
    { test: /\bskim\b|security light/, mode: "common", page: "skim" },
    { test: /blend door|blower resistor|only on high/, mode: "common", page: "hvac" },
    { test: /manifold crack|cold tick|exhaust tick/, mode: "common", page: "crack" },
    { test: /mini-?cat|exhaust|downstream|\bmanifold\b/, mode: "bench", map: "exhaust" },
    { test: /\bhose\b|\bccv\b|\bpcv\b|\b47128\b|\b4854265\b|\bevap\b|\bpurge\b|\bhvac\b|55115901/, mode: "bench", map: "hoses" },
    { test: /diagram|schematic/, mode: "common", page: "figs" },
    { test: /\bfuses?\b/, mode: "common", page: "how" }
  ];
  var LINK = {
    iacStore: "https://store.mopar.com/oem-parts/mopar-air-idle-speed-motor-4874373ab",
    iacSearch: "https://www.amazon.com/s?k=4874373AB+idle+air+control",
    ccvSearch: "https://www.amazon.com/s?k=Dorman+47128",
    smokeSearch: "https://www.amazon.com/s?k=automotive+EVAP+smoke+machine",
    dyeSearch: "https://www.amazon.com/s?k=automotive+oil+leak+UV+dye"
  };
  var GUIDES = [
    { id: "01", title: "Master diagnostic", hint: "ID, both codes, test record", pdf: "../01_Master_Vehicle_Diagnostic_Guide.pdf", stem: "01_Master_Vehicle_Diagnostic_Guide", n: 6 },
    { id: "02", title: "P0161 heater", hint: "Bank 2 Sensor 2", pdf: "../02_P0161_O2_Sensor_Heater_Guide.pdf", stem: "02_P0161_O2_Sensor_Heater_Guide", n: 4 },
    { id: "03", title: "P0505 / IAC", hint: "Pintle, clean, relearn", pdf: "../03_P0505_IAC_Guide.pdf", stem: "03_P0505_IAC_Guide", n: 4 },
    { id: "04", title: "Vacuum and EVAP", hint: "Leak tests, in order", pdf: "../04_Vacuum_EVAP_Leak_Guide.pdf", stem: "04_Vacuum_EVAP_Leak_Guide", n: 4 },
    { id: "05", title: "Glowing manifold", hint: "Stop driving", pdf: "../05_Glowing_Manifold_EMERGENCY.pdf", stem: "05_Glowing_Manifold_EMERGENCY", n: 2 },
    { id: "06", title: "Oil and fire", hint: "Stop driving", pdf: "../06_Oil_Leak_Fire_Hazard_Guide.pdf", stem: "06_Oil_Leak_Fire_Hazard_Guide", n: 2 },
    { id: "07", title: "Repair order", hint: "Steps 1–13", pdf: "../07_Repair_Priority_Sheet.pdf", stem: "07_Repair_Priority_Sheet", n: 2 },
    { id: "08", title: "Flowcharts", hint: "P0505 and P0161", pdf: "../08_Diagnostic_Flowchart.pdf", stem: "08_Diagnostic_Flowchart", n: 2 },
    { id: "09", title: "Parts", hint: "What checked out", pdf: "../09_Parts_Reference_Sheet.pdf", stem: "09_Parts_Reference_Sheet", n: 2 },
    { id: "10", title: "One-page card", hint: "Print for the vehicle", pdf: "../10_One_Page_Quick_Reference.pdf", stem: "10_One_Page_Quick_Reference", n: 1 },
    { id: "11", title: "Hoses and exhaust", hint: "Working map", pdf: "../11_Parts_and_Hose_Lines.pdf", stem: "11_Parts_and_Hose_Lines", n: 3 }
  ];
  function buy(href, label) {
    return '<a class="buy" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + "</a>";
  }
  function buyRow(pairs) {
    return '<p class="buy-row">' + pairs.map(function (p) { return buy(p[0], p[1]); }).join("") + "</p>";
  }
  function guideById(id) {
    for (var i = 0; i < GUIDES.length; i++) if (GUIDES[i].id === id) return GUIDES[i];
    return null;
  }
  function pageJpg(g, n) {
    var nn = (n < 10 ? "0" : "") + n;
    return "../JPEG/" + g.stem + "_p" + nn + ".jpg";
  }
  function openGuideBtn(id, label) {
    return '<button type="button" class="textbtn" data-act="open-guide" data-guide="' + id + '">' + label + "</button>";
  }
  var HOSE_BOX = { w: 760, h: 420 };
  var HOSE_LAYOUT = [
    { id: "ccv", x: 16, y: 16, w: 210, h: 72, tone: "tone-warn" },
    { id: "evap", x: 534, y: 16, w: 210, h: 72, tone: "tone-test" },
    { id: "booster", x: 16, y: 104, w: 210, h: 72, tone: "tone-test" },
    { id: "hvac", x: 534, y: 104, w: 210, h: 72, tone: "tone-warn" },
    { id: "iac", x: 16, y: 192, w: 210, h: 72, tone: "tone-stop" },
    { id: "tb", x: 534, y: 192, w: 210, h: 72, tone: "tone-warn" },
    { id: "intake", x: 230, y: 286, w: 300, h: 114, tone: "tone-test" }
  ];
  var HOSE_PATH = {
    ccv: ["ccv", "intake"], booster: ["booster", "intake"], evap: ["evap", "intake"],
    hvac: ["hvac", "intake"], iac: ["iac", "intake"], tb: ["tb", "intake"],
    intake: ["intake", "ccv", "booster", "evap", "hvac", "iac", "tb"]
  };
  var EX_BOX = { w: 790, h: 430 };
  var EX_LAYOUT = [
    { id: "manifold", x: 12, y: 48, w: 110, h: 250, tone: "tone-stop" },
    { id: "b1s1", x: 160, y: 36, w: 140, h: 68, tone: "tone-test" },
    { id: "fmini", x: 330, y: 36, w: 120, h: 68, tone: "" },
    { id: "b1s2", x: 470, y: 36, w: 150, h: 68, tone: "tone-test" },
    { id: "b2s1", x: 160, y: 200, w: 140, h: 68, tone: "tone-test" },
    { id: "rmini", x: 330, y: 200, w: 120, h: 68, tone: "" },
    { id: "b2s2", x: 470, y: 186, w: 160, h: 88, tone: "tone-stop", flag: "node-p0161" },
    { id: "main", x: 656, y: 148, w: 120, h: 88, tone: "" },
    { id: "oil", x: 160, y: 318, w: 470, h: 90, tone: "tone-stop" }
  ];
  var EX_PATH = {
    manifold: ["b1s1", "b2s1"],
    b1s1: ["b1s1"],
    fmini: ["b1s1", "fmini"],
    b1s2: ["b1s1", "fmini", "b1s2"],
    b2s1: ["b2s1"],
    rmini: ["b2s1", "rmini"],
    b2s2: ["b2s1", "rmini", "b2s2"],
    main: ["b1s1", "fmini", "b1s2", "topjoin", "b2s1", "rmini", "b2s2", "botjoin", "main"],
    oil: ["oil"]
  };
  var NODES = {
    ccv: {
      short: "CCV / PCV", sub: "Front and rear elbows",
      name: "CCV / PCV elbows", tag: ["cat", "CATALOG LISTED"],
      where: "Front and rear of the valve cover, into the intake or the air duct. The rear piece is short and often split. Oil vapor and vacuum both use this path.",
      part: "Dorman 47128 / Chrysler 4854265. Two hoses, about 2.56 in. Not the whole crankcase harness.",
      dont: "Do not block a PCV port to cure high idle. The crankcase then pressurizes, and oil comes out onto the exhaust.",
      links: [[LINK.ccvSearch, "Amazon search: Dorman 47128"]]
    },
    booster: {
      short: "Brake booster", sub: "Large hose + check valve",
      name: "Brake booster", tag: ["test", "TEST REQUIRED"],
      where: "Large hose from the booster to a manifold port, with a check valve in the line. A split here raises idle and can make the pedal hard.",
      part: "Match the hose and the valve. No number on this sheet.",
      dont: "Do not pinch this hose if that pedal is your only brake and the truck is not secured. Wheels chocked, Park, parking brake set."
    },
    evap: {
      short: "EVAP purge", sub: "Solenoid, then canister",
      name: "EVAP purge", tag: ["poss", "POSSIBLE"],
      where: "Solenoid to an intake port, then back toward the canister. A stuck-open purge valve can act as an idle leak.",
      part: "Replace the cracked hose or the solenoid only after a test. No canister number on this sheet.",
      dont: "Do not buy a canister, leak-detection pump, or tank seals because of P0505."
    },
    hvac: {
      short: "HVAC / cruise", sub: "Elbow at the intake",
      name: "HVAC / cruise elbow", tag: ["win", "NARROW"],
      where: "Small elbow and check valve at the intake, then the HVAC and cruise vacuum harness.",
      part: "55115901AG only if the VIN is in the 31 Mar–6 Apr 2004 build window (rapid response 04-008). That failure collapses and restricts HVAC/cruise vacuum. It does not raise idle. A cracked elbow of the same age can.",
      dont: "Do not buy 55115901AG to fix a high idle. A collapsed elbow and a cracked elbow are not the same fault."
    },
    iac: {
      short: "IAC base O-ring", sub: "Not a hose",
      name: "IAC base O-ring", tag: ["stop", "STOP"],
      where: "Not a hose. The O-ring under the motor is an air leak if it is missing, twisted, or flattened.",
      part: "Comes with the new IAC. No separate number on this sheet.",
      dont: "Do not push the pintle to seat it. If it does not sit flush, look for a pinched O-ring.",
      links: [[LINK.iacStore, "Mopar store: 4874373AB"], [LINK.iacSearch, "Amazon search: 4874373AB"]]
    },
    intake: {
      short: "Intake gasket", sub: "Seam, all the way around",
      name: "Intake gasket seam", tag: ["test", "TEST REQUIRED"],
      where: "Leak point all the way around the head-to-manifold seam, including the ends. Ports on this map are grouped for readability, not a measured left/right layout.",
      part: "No part number. Match by VIN only after smoke or a hiss names this seam.",
      dont: "Do not buy a gasket on the gauge alone. Do not pull fuel lines, heater hoses, or power-steering hoses while chasing a vacuum leak."
    },
    tb: {
      short: "TB gasket", sub: "Buy only what smoke names",
      name: "Throttle-body gasket", tag: ["test", "TEST REQUIRED"],
      where: "Between the throttle body and the intake. Left off, pinched, or flattened during an IAC job.",
      part: "No number. Buy only what the smoke test or the crack identifies.",
      dont: "Do not soak the TPS. The plate must close. The cable must return."
    },
    manifold: {
      short: "Manifold", sub: "GLOW = STOP",
      name: "Exhaust manifold", tag: ["stop", "STOP"],
      where: "Cast iron on the passenger side. Confirm that on the truck. A glow is a stop, not a parts order.",
      part: "Replace only if it is cracked after it is cool enough to inspect. No gasket or manifold number on this sheet.",
      dont: "Do not spray water. Do not drive it. Tow if it has to move. Do not idle it to see."
    },
    b1s1: {
      short: "1/1 upstream", sub: "Bank 1 Sensor 1",
      name: "1/1 upstream", tag: ["likely", "LIKELY"],
      where: "Bank 1 Sensor 1, before the front mini-cat. Upstream sensors trim fuel. Sensors sit in the downpipes, not in the cast manifold.",
      part: "Before-catalyst candidates, position not proven: 56028995AA and 56028994AA. Order by VIN for this bung only.",
      dont: "Do not swap sensors. P0161 is not this sensor."
    },
    fmini: {
      short: "Front mini-cat", sub: "Bank 1",
      name: "Front mini-cat", tag: ["likely", "LIKELY"],
      where: "Mini-catalyst on the front branch, after Bank 1 Sensor 1 and before Bank 1 Sensor 2. California package draws two mini-cats ahead of a main cat. Confirm the count.",
      part: "No part number. Buy a cat only after a temperature or pressure test shows a restriction.",
      dont: "Do not cut it out. This is a California-emissions engine if you counted four sensors. Repair it."
    },
    b1s2: {
      short: "1/2 downstream", sub: "P0161 is not this one",
      name: "1/2 downstream", tag: ["likely", "LIKELY"],
      where: "Bank 1 Sensor 2, after the front mini-cat and before the main cat. It watches that mini-cat.",
      part: "After-catalyst candidates, position not proven: 56028997AA and 05139021AA. Not a mapped bung.",
      dont: "P0161 is not this sensor. Do not swap it with Bank 2 Sensor 2."
    },
    b2s1: {
      short: "2/1 upstream", sub: "Bank 2 Sensor 1",
      name: "2/1 upstream", tag: ["likely", "LIKELY"],
      where: "Bank 2 Sensor 1, before the rear mini-cat. Upstream sensors trim fuel. Bank 2 is the rear three cylinders. LIKELY. Confirm the bung.",
      part: "Before-catalyst candidates, position not mapped: 56028995AA and 56028994AA.",
      dont: "Do not swap sensors. Harness length and the connector are different at each bung."
    },
    rmini: {
      short: "Rear mini-cat", sub: "Before sensor 2/2",
      name: "Rear mini-cat", tag: ["likely", "LIKELY"],
      where: "Mini-catalyst on the rear branch. Bank 2 Sensor 2 sits after this cat and before the main cat.",
      part: "No part number. A cat is not the first part for P0161.",
      dont: "Do not cut it out. Buy one only after a temperature or pressure test shows a restriction."
    },
    b2s2: {
      short: "2/2 · P0161", sub: "Bank 2 Sensor 2 heater",
      name: "2/2 downstream", tag: ["test", "TEST REQUIRED"],
      where: "Bank 2 Sensor 2, rear downstream, after the rear mini-cat, before the main cat. P0161 is the heater circuit only. LIKELY position. Confirm the bung. Count sensors. Two = federal, four = the California layout.",
      part: "Order one sensor by VIN for the bung that failed. Do not order NTK 23142 or Mopar 56029001AB. NOT CONFIRMED. Candidates, position not mapped: 56028995AA, 56028994AA before catalyst; 56028997AA, 05139021AA after catalyst. One owner report tied 05139021AA to rear downstream, body stamped 56044598AA. Single report, not confirmation.",
      dont: "Do not swap sensors. Do not add anti-seize to a coated new sensor. Do not grease the connector. Do not solder sensor leads. Cited install torque 22 ft-lb (30 N·m) is LIKELY, from the WJ guide."
    },
    main: {
      short: "Main cat", sub: "Do not cut it out",
      name: "Main cat", tag: ["test", "TEST REQUIRED"],
      where: "After the two branches join. Then the muffler. Three catalysts on the California package. LIKELY.",
      part: "No part number. Buy a cat only after a temperature or pressure test shows a restriction.",
      dont: "Do not cut it out. Not a first part. Not a test."
    },
    oil: {
      short: "Oil paths", sub: "Not a part to buy blind",
      name: "Oil paths", tag: ["likely", "LIKELY"],
      where: "Callout, not a sensor. Valve-cover rail, filter-adapter O-rings, oil-pressure sender, pan rail, rear main. LIKELY places, none confirmed until fresh oil is traced. Passenger side first. Confirm on the truck.",
      part: "No gasket numbers. Match by VIN after the fresh oil is traced.",
      dont: "Do not replace a rear main until the adapter, the pan, and the sender are ruled out. Do not install a new oxygen sensor into an oil spray."
    }
  };

  var state;
  var orderWarn = "";
  var lockFlash = "";
  var scrollParts = false;
  var scrollPage = false;
  var scrollLib = false;
  var focusQ = false;

  function fresh() {
    return {
      hazardGlow: false,
      hazardOil: false,
      mode: "board",
      walk: {
        tree: "p0505",
        p0505: { step: "start", trail: ["start"], answers: {} },
        p0161: { step: "stored", trail: ["stored"], answers: {} }
      },
      order: [false, false, false, false, false, false, false, false, false, false, false, false, false],
      meter: { rpm: "", cold: false, iac: "", pair: "", heater: "", heaterTemp: "cold", vac: "", flicker: false },
      record: {
        vin8: "", miles: "", date: "", sensors: "", glowNote: "", oilPath: "",
        coolant: "", gear: "", ac: "", warmRpm: "", driveRpm: "",
        iacOhms: "", iacB: "", vacuum: "", smoke: "",
        mapKey: "", mapIdle: "", stftIdle: "", ltftIdle: "", stft2500: "", ltft2500: "", upstream: "",
        heaterOhms: "", heaterVolts: "", controlNote: "",
        freeze: "", cleared: "", codesBefore: "", codesAfter: "", notes: ""
      },
      bench: { map: "hoses", node: "", filter: "all" },
      pages: { guide: "", n: 1 },
      common: { id: "" }
    };
  }

  function load() {
    var base = fresh();
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return base;
      var s = JSON.parse(raw);
      if (!s || typeof s !== "object") return base;
      base.hazardGlow = !!s.hazardGlow;
      base.hazardOil = !!s.hazardOil;
      if (s.mode === "board" || s.mode === "walk" || s.mode === "order" || s.mode === "bench" || s.mode === "record" || s.mode === "pages" || s.mode === "common") base.mode = s.mode;
      if (s.walk) {
        if (s.walk.tree === "p0161" || s.walk.tree === "p0505") base.walk.tree = s.walk.tree;
        ["p0505", "p0161"].forEach(function (t) {
          var src = s.walk[t];
          if (!src) return;
          var ok = t === "p0505" ? STEPS_505 : STEPS_161;
          if (ok[src.step]) base.walk[t].step = src.step;
          if (Array.isArray(src.trail) && src.trail.length && src.trail.every(function (id) { return ok[id]; })) base.walk[t].trail = src.trail.slice();
          if (src.answers && typeof src.answers === "object") base.walk[t].answers = src.answers;
          if (base.walk[t].trail.indexOf(base.walk[t].step) < 0) base.walk[t].trail.push(base.walk[t].step);
        });
      }
      if (Array.isArray(s.order) && s.order.length === 13) base.order = s.order.map(Boolean);
      if (s.meter && typeof s.meter === "object") {
        ["rpm", "iac", "pair", "heater", "vac"].forEach(function (k) {
          if (typeof s.meter[k] === "string") base.meter[k] = s.meter[k];
        });
        base.meter.cold = !!s.meter.cold;
        base.meter.flicker = !!s.meter.flicker;
        base.meter.heaterTemp = s.meter.heaterTemp === "hot" ? "hot" : "cold";
      }
      if (s.record && typeof s.record === "object") {
        Object.keys(base.record).forEach(function (k) {
          if (typeof s.record[k] === "string") base.record[k] = s.record[k];
        });
      }
      if (s.bench && typeof s.bench === "object") {
        if (s.bench.map === "hoses" || s.bench.map === "exhaust") base.bench.map = s.bench.map;
        if (typeof s.bench.node === "string" && NODES[s.bench.node]) base.bench.node = s.bench.node;
        if (s.bench.filter === "all" || s.bench.filter === "cat" || s.bench.filter === "cand" || s.bench.filter === "no" || s.bench.filter === "test") base.bench.filter = s.bench.filter;
      }
      if (s.pages && typeof s.pages === "object" && guideById(s.pages.guide)) {
        base.pages.guide = s.pages.guide;
        var pn = Number(s.pages.n);
        if (pn >= 1 && pn <= guideById(s.pages.guide).n) base.pages.n = pn;
      }
      if (s.common && typeof s.common.id === "string" && libPage(s.common.id)) base.common.id = s.common.id;
    } catch (e) { return fresh(); }
    return base;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c];
    });
  }
  function chip(kind, text) { return '<span class="tag ' + kind + '">' + esc(text) + "</span>"; }
  function hazardOn() { return state.hazardGlow || state.hazardOil; }

  function numOf(raw) {
    var t = String(raw == null ? "" : raw).trim();
    if (!t) return null;
    var n = parseFloat(t);
    return isFinite(n) ? n : null;
  }
  function isOL(raw) { return /^o\.?l\.?$/i.test(String(raw || "").trim()); }

  function classRpm(raw, cold) {
    var t = String(raw || "").trim();
    if (!t) return { chip: "TEST REQUIRED", kind: "test", sentence: "Enter rpm." };
    var n = numOf(t);
    if (n == null) return { chip: "TEST REQUIRED", kind: "test", sentence: "Enter rpm." };
    if (n < 700) {
      if (cold) return { chip: "TEST REQUIRED", kind: "test", sentence: "Cold idle is supposed to be higher. Do not judge the IAC until the engine is warm. Record coolant temp." };
      return { chip: "TEST REQUIRED", kind: "test", sentence: "Below the 700–800 screen. Cold idle is supposed to be higher. Record coolant temp before you condemn it." };
    }
    if (n <= 800) return { chip: "IN SCREEN", kind: "good", sentence: "In the 700–800 screen. TSB 18-008-04 about 744 rpm is the bulletin text for domestic 2004 4.0L ERH built before 6 March 2004, not proof this VIN has that software." };
    if (n < 1000) return { chip: "ABOVE SCREEN", kind: "poss", sentence: "Above the 700–800 screen. Go back to smoke, the plate, and the IAC O-ring." };
    return { chip: "NOT NORMAL", kind: "stop", sentence: "At or above about 1000 rpm. Not a normal warm no-load result after a real relearn." };
  }
  function classIac(raw) {
    var t = String(raw || "").trim();
    if (!t) return { chip: "TEST REQUIRED", kind: "test", sentence: "Enter ohms or OL." + IAC_CAVEAT };
    if (isOL(t)) return { chip: "OPEN", kind: "stop", sentence: "Open coil." + IAC_CAVEAT };
    var n = numOf(t);
    if (n == null) return { chip: "TEST REQUIRED", kind: "test", sentence: "Enter ohms or OL." + IAC_CAVEAT };
    if (n < 1) return { chip: "SHORT", kind: "stop", sentence: "Shorted, or on the wrong terminals." + IAC_CAVEAT };
    if (n < 40) return { chip: "UNDER SCREEN", kind: "poss", sentence: "Under the 40–80 screen. Field notes often 48–60 Ω." + IAC_CAVEAT };
    if (n <= 80) return { chip: "LIKELY", kind: "likely", sentence: "In the 40–80 LIKELY screen. If the pintle was moved, still replace." + IAC_CAVEAT };
    if (n < 1000) return { chip: "HIGH", kind: "poss", sentence: "Above the 40–80 screen." + IAC_CAVEAT };
    return { chip: "OPEN", kind: "stop", sentence: "Open, or many thousands of ohms." + IAC_CAVEAT };
  }
  function heaterBand(raw, temp) {
    if (temp === "hot") return "hot";
    var t = String(raw || "").trim();
    if (!t) return "empty";
    if (isOL(t)) return "open";
    var n = numOf(t);
    if (n == null) return "empty";
    if (n < 1) return "short";
    if (n < 4) return "low";
    if (n <= 10) return "in";
    if (n < 1000) return "out";
    return "open";
  }
  function classHeater(raw, temp) {
    var band = heaterBand(raw, temp);
    if (band === "hot") return { chip: "INVALID", kind: "stop", sentence: "Hot reading is invalid. Resistance rises as the sensor gets hot. Let it cool. No pass or fail from this number." };
    if (band === "empty") return { chip: "TEST REQUIRED", kind: "test", sentence: "Enter cold heater ohms, or OL. The heater is the only cold pair that reads a handful of ohms. Signal terminals of a cold narrowband do not." };
    if (band === "short") return { chip: "SHORT", kind: "stop", sentence: "Near 0 Ω. Shorted heater. Check the fuse too. A short can open it. Do not guess the cavity." };
    if (band === "low") return { chip: "UNDER SCREEN", kind: "poss", sentence: "Under the 4–10 Ω screen. Not a short. Remeasure cold, on the sensor side, one pair only." };
    if (band === "in") return { chip: "LIKELY", kind: "likely", sentence: "In the 4–10 Ω screen. Keep testing power and control. In range does not clear the circuit. LIKELY screen, not a confirmed 2004 FSM limit. Earlier 4.0L procedures cite about 4–7 Ω." };
    if (band === "out") return { chip: "OUT OF SCREEN", kind: "poss", sentence: "Out of the 4–10 Ω screen. Not OL. Let it cool and remeasure on the sensor side." };
    return { chip: "OPEN", kind: "stop", sentence: "Open heater. OL, or many thousands of ohms, sensor cold, on the sensor side." };
  }
  function classVac(raw, flicker) {
    var flick = flicker ? " Needle flickers: leak or misfire. A flicker is not a steady needle." : "";
    var t = String(raw || "").trim();
    if (!t) return { chip: "TEST REQUIRED", kind: "test", sentence: "Enter inHg." + flick };
    var n = numOf(t);
    if (n == null) return { chip: "TEST REQUIRED", kind: "test", sentence: "Enter inHg." + flick };
    if (n < 17) return { chip: "LOW", kind: "poss", sentence: "Below the 17–21 screen. Several causes: leak, late timing, low compression, restricted exhaust. LIKELY screen near about 700 ft, not a factory limit." + flick };
    if (n <= 21) return { chip: "LIKELY", kind: "likely", sentence: "In the 17–21 inHg LIKELY screen near about 700 ft. Not a factory limit. Do not condemn a gasket on the gauge alone." + flick };
    return { chip: "ABOVE SCREEN", kind: "poss", sentence: "Above the 17–21 screen. Record it. Do not condemn a gasket on the gauge alone." + flick };
  }

  function sheets() {
    return '<details class="sheets"><summary>From the sheets</summary><div class="sheet-grid">' +
      '<article class="card stop" data-find="sheet glow"><h3>Glow stop ' + chip("stop", "STOP") + " " + chip("poss", "POSSIBLE") + '</h3><p>STOP DRIVING. Cool completely. Do not spray water. Do not drive it. Tow if it has to move. Bright orange or red iron can crack the casting, burn valves, melt a catalyst, and ignite oil. An hour is a minimum after a glow, not a guarantee. Causes still open, each POSSIBLE: lean burn, misfire afterburn, retarded timing, restricted cat. If the glow returns, key off and tow. Do not repeat the relearn.</p><button type="button" class="textbtn" data-act="mode" data-mode="order">Open the repair order</button></article>' +
      '<article class="card stop" data-find="sheet oil"><h3>Oil sources ' + chip("likely", "LIKELY") + '</h3><p>Oil on hot iron or on an oxygen sensor can ignite. Separate from idle and from P0161. Degrease cold. Do not degrease a hot pipe. Trace fresh oil, not old black film. LIKELY places, none confirmed: valve cover, filter-adapter O-rings, sender, pan gasket, rear main. Rule out the adapter, the pan, and the sender before a rear main. Dry the plug before a new sensor.</p><button type="button" class="textbtn" data-act="mode" data-mode="order">Open the repair order</button></article>' +
      '<article class="card test" data-find="sheet leak"><h3>Leak test order ' + chip("likely", "LIKELY") + " " + chip("poss", "POSSIBLE") + '</h3><p>Cold visual first. Listen only after the fire risk is down. Smoke is the preferred test. Then the gauge, scan data, and a selective pinch. No carb cleaner, brake cleaner, or propane while oil is on the exhaust or the manifold has glowed. A leak is a LIKELY high-idle cause on this MAP engine and only a POSSIBLE lean cause. Do not relearn a leak. Do not block a PCV port to cure high idle.</p><button type="button" class="textbtn" data-act="goto" data-mode="bench" data-map="hoses">Open the hose map</button></article>' +
      "</div></details>";
  }

  function hazardPanels() {
    var html = "";
    if (state.hazardGlow) html += glowCard();
    if (state.hazardOil) html += oilCard("Oil hazard is on. Guide 06 before a sensor, a relearn, or a drive.");
    return html;
  }

  function renderBoard() {
    return '<section><p class="kicker">Board · three problems, kept apart</p><h1>Do not collapse these into one story</h1>' +
      '<p class="lede">If the manifold is glowing or oil is on the exhaust, turn that hazard on before any other step. Walk one code at a time. Pages is every printed sheet. Common is a separate page for each fuse box and the other WJ problems. The lid on the truck wins over those charts.</p>' +
      '<article class="card stop" data-find="parked not driven key-on p0505 pcm oil fire current status"><h3>Current status ' + chip("stop", "STOP") + " " + chip("stated", "STATED") + '</h3><p>14 Oct 2026. Parked. Not being driven. Oil is on the manifold and that manifold has been glowing. P0505 returns at key-on, before the engine starts. That rules out a vacuum leak as the cause of this code. It does not yet prove a bad PCM. Do not start it.</p><button type="button" class="textbtn" data-act="lib" data-id="now">Open the current-status page</button></article>' +
      '<div class="haz-board"><button type="button" class="haz-lg' + (state.hazardGlow ? " is-on" : "") + '" data-act="hazard" data-which="glow" aria-pressed="' + (state.hazardGlow ? "true" : "false") + '">Manifold is glowing</button>' +
      '<button type="button" class="haz-lg' + (state.hazardOil ? " is-on" : "") + '" data-act="hazard" data-which="oil" aria-pressed="' + (state.hazardOil ? "true" : "false") + '">Oil is on the exhaust or a sensor</button></div>' +
      hazardPanels() +
      '<p id="empty-search" class="empty" hidden>Nothing on this screen matches. Type P0161, pintle, booster, or 4874373AB.</p>' +
      '<div class="split3">' +
      '<article class="card poss" data-find="pintle iac p0505 idle lean glow misfire possible chain">' +
      "<h3>Problem A · Idle chain " + chip("poss", "POSSIBLE") + "</h3>" +
      '<ol class="chain"><li>Pintle moved by hand</li><li>IAC may be damaged or held open</li><li>Extra air</li><li>High or unstable idle</li><li>P0505 may set</li><li>Mixture may go lean</li><li>Exhaust may glow</li></ol>' +
      "<p>Each arrow is unproven until tested. A misfire can glow the manifold without that chain.</p></article>" +
      '<article class="card stop" data-find="oil fire exhaust sensor leak separate">' +
      "<h3>Problem B · Oil and fire " + chip("stop", "STOP") + "</h3>" +
      "<p>Oil leak, then oil on hot exhaust or a sensor, then a fire hazard. Separate from the idle chain. Separate from P0161. Fix the leak before a sensor that was sitting in the oil is replaced.</p></article>" +
      '<article class="card test" data-find="p0161 heater bank 2 sensor 2 downstream">' +
      "<h3>Problem C · P0161 " + chip("test", "TEST REQUIRED") + "</h3>" +
      "<p>P0161 is the Bank 2 Sensor 2 heater circuit only. Not a mixture code. Not the cause of a high idle. Rear downstream, after the rear mini-cat. Confirm the bung. Do not swap sensors.</p></article>" +
      "</div>" +
      '<h2>Vehicle</h2><table class="strip"><tbody>' +
      "<tr data-find=\"laredo erh vin 242\"><th>Vehicle and engine " + chip("stated", "STATED") + " " + chip("likely", "LIKELY") + "</th><td>2004 Grand Cherokee WJ Laredo, 4.0L I6, 242 ci, sales code ERH. VIN 8th character usually S. Verify the VIN.</td></tr>" +
      "<tr data-find=\"map maf speed density vacuum\"><th>Air metering " + chip("conf", "CONFIRMED") + "</th><td>Speed-density MAP. No MAF. A vacuum leak is not automatically unmetered air.</td></tr>" +
      "<tr data-find=\"iac throttle cable relearn\"><th>Throttle and idle " + chip("conf", "CONFIRMED") + "</th><td>Cable throttle, 4-wire stepper IAC. Not drive-by-wire. Do not use an electronic-throttle pedal relearn.</td></tr>" +
      "<tr data-find=\"750 rpm idle screen\"><th>Stated idle target " + chip("stated", "STATED") + "</th><td>About 750 rpm. Inside the 700-800 screen already on this bench. Not a new factory limit, and not proof of the 744 rpm bulletin.</td></tr>" +
      "<tr data-find=\"parked key-on p0505 pcm\"><th>14 Oct 2026 " + chip("stop", "STOP") + "</th><td>Parked, not driven. Oil on the manifold. Manifold has glowed. P0505 returns at key-on before start. See the current-status page before any PCM purchase.</td></tr>" +
      "<tr data-find=\"coil distributor timing\"><th>Ignition " + chip("conf", "CONFIRMED") + "</th><td>Coil rail, no distributor. Timing is not set with a wrench.</td></tr>" +
      "<tr data-find=\"california federal oxygen sensors\"><th>Emissions " + chip("stated", "STATED") + " " + chip("test", "TEST REQUIRED") + "</th><td>California 4-sensor package is stated by the owner. Federal 4.0L of this year uses 2 sensors. Count sensors before buying. Purchase state does not decide the package.</td></tr>" +
      "<tr data-find=\"bank sensor p0161 downstream mini-cat\"><th>Banks " + chip("likely", "LIKELY") + "</th><td>Bank 1 = front cylinders 1–3 (radiator end). Bank 2 = rear cylinders 4–6. Sensor 1 = upstream, before that branch's mini-cat. Sensor 2 = downstream, after the mini-cat, before the main cat. Sensors sit in the downpipes, not in the cast manifold. P0161 = Bank 2 Sensor 2 = rear downstream. Confirm on the truck. Do not swap sensors.</td></tr>" +
      "</tbody></table>" +
      '<div class="jumps">' +
      '<button type="button" data-act="goto" data-mode="walk" data-tree="p0505">Walk P0505</button>' +
      '<button type="button" data-act="goto" data-mode="walk" data-tree="p0161">Walk P0161</button>' +
      '<button type="button" data-act="mode" data-mode="order">Order</button>' +
      '<button type="button" data-act="goto" data-mode="bench" data-map="hoses">Hose map</button>' +
      '<button type="button" data-act="goto" data-mode="bench" data-map="exhaust">Exhaust map</button>' +
      '<button type="button" data-act="goto" data-mode="bench" data-map="hoses" data-filter="no" data-part="1">Do-not-buy list</button>' +
      '<button type="button" data-act="mode" data-mode="pages">Printed pages</button>' +
      '<button type="button" data-act="mode" data-mode="common">Common issues</button>' +
      "</div>" + sheets() + "</section>";
  }

  function choiceBtn(key, id, label, current) {
    var on = current === id;
    return '<button type="button" class="choice' + (on ? " is-on" : "") + '" data-act="choose" data-key="' + key + '" data-choice="' + id + '" aria-pressed="' + (on ? "true" : "false") + '">' + label + "</button>";
  }
  function liveMeter(which, label, withReadout) {
    var val = which === "rpm" ? state.meter.rpm : which === "iac" ? state.meter.iac : state.meter.heater;
    var extra = "";
    if (which === "heater") {
      extra = '<div class="seg" role="group" aria-label="Heater temperature">' +
        '<button type="button" data-act="heater-temp" data-temp="cold" aria-pressed="' + (state.meter.heaterTemp === "cold" ? "true" : "false") + '">Cold</button>' +
        '<button type="button" data-act="heater-temp" data-temp="hot" aria-pressed="' + (state.meter.heaterTemp === "hot" ? "true" : "false") + '">Hot</button></div>';
    }
    if (which === "rpm") {
      extra = '<label class="check"><input type="checkbox" data-meter="cold"' + (state.meter.cold ? " checked" : "") + "> Cold engine</label>";
    }
    var read = withReadout === false ? "" : '<div class="classif" data-live="' + which + '"></div>';
    return '<label class="inline-meter">' + label + '<input data-meter="' + (which === "rpm" ? "rpm" : which === "iac" ? "iac" : "heater") + '" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(val) + '"></label>' + extra + read;
  }
  function navRow(canBack, showNext, ready, need) {
    var next = "";
    if (showNext) next = '<button type="button" id="next-btn" data-act="next" data-need="' + (need || "") + '"' + (ready ? "" : " disabled") + ">Next</button>";
    return '<div class="nav"><button type="button" data-act="back"' + (canBack ? "" : " disabled") + '>Back</button><button type="button" data-act="restart">Restart</button>' + next + "</div>";
  }
  function qOpen(title, tagHtml) {
    return '<article class="qcard" data-find="question"><p class="kicker">Walk</p><h2 id="q-title" tabindex="-1">' + title + "</h2>" + (tagHtml || "");
  }
  function crumbs(tree, w) {
    return '<nav class="crumbs" aria-label="Answers">' + w.trail.map(function (id, i) {
      var last = i === w.trail.length - 1;
      return '<button type="button" data-act="crumb" data-step="' + id + '"' + (last ? ' aria-current="step"' : "") + ">" + esc(CRUMB[id] || id) + "</button>";
    }).join("") + "</nav>";
  }

  function glowCard() {
    return qOpen("Key off. Leave this tree.", chip("stop", "STOP")) +
      "<p>The manifold-is-glowing hazard is on. This idle tree stops here. STOP DRIVING. Park outdoors, away from the building and dry grass if anything is smoking. Park. Parking brake set.</p>" +
      "<ul class=\"proc\">" +
      "<li>Get people away from the wheel well. ABC or BC extinguisher within reach. If you see flame, get clear and call the fire department.</li>" +
      "<li>Let it cool completely. An hour is a minimum after a glow, not a guarantee. The casting holds heat.</li>" +
      "<li>Do not open the radiator cap. Do not spray water on red iron. Thermal shock cracks it.</li>" +
      "<li>Do not drive it to a shop. Do not idle it to see. Tow it if it has to move.</li>" +
      "</ul>" +
      "<p>An active glow is bright orange or red while it is running or has just been shut off. Brown, blue, or purple on a cold manifold is old heat stain. " + chip("poss", "POSSIBLE") + " past overheat. Stain is not the same as watching it glow. If you saw it glow, that observation stands after the color fades.</p>" +
      "<p>Causes still open, each " + chip("poss", "POSSIBLE") + " " + chip("test", "TEST REQUIRED") + ". More than one can be true. A vacuum leak can raise idle. A misfire can be what actually glows the iron. Test both. Do not cut a catalyst out.</p>" +
      "<ul class=\"proc\">" +
      "<li>Lean combustion. More air than the fuel that was delivered. Prove it with upstream O2 and trims, not with the leak alone.</li>" +
      "<li>Misfire, fuel burning in the exhaust. A dead coil or a fouled plug can do this. Read misfire counters if the scan tool has them.</li>" +
      "<li>Retarded ignition timing. This engine has a coil rail and no distributor. Timing is not set with a wrench. A crank or cam signal belongs in this pile.</li>" +
      "<li>Restricted catalyst. Often the result of a misfire or of burning oil, not the first event. Low power, and vacuum that falls as rpm rises, are clues. Temperature or pressure test only on a later, cooler run.</li>" +
      "</ul>" +
      "<p>Continued running can crack the manifold, burn valves and seats, melt a mini-cat or the main cat, cook the oxygen sensors, and light any oil film. Guide 06.</p>" +
      "<p>After it is cool enough: look for cracks, fresh scale, oil washed onto the iron, and a sensor wire melted to the pipe. Do not start it for a short check until oil is off the exhaust and an extinguisher is out. When a start is allowed, watch from the side. Idle only. If any orange returns, key off and tow.</p>" +
      "<p>Turning the hazard off only lifts the lock. It does not mark a repair done.</p>" +
      "<p>" + openGuideBtn("05", "Open Guide 05") + "</p></article>";
  }
  function oilCard(why) {
    return qOpen("Stop for the oil card.", chip("stop", "STOP")) +
      "<p>" + why + "</p>" +
      "<p>Oil on hot iron or on an oxygen sensor can ignite. A manifold that has been glowing makes that ignition likely. This problem is separate from the idle code and separate from P0161.</p>" +
      "<p><b>If you see smoke or flame from the oil:</b> engine off. Everyone out and away. Do not open the hood into a fireball if the fire is already rolling out of it. Call the fire department. Use an extinguisher only from a safe direction with a clear exit. Do not drive the truck away from the fire.</p>" +
      "<ol class=\"proc\">" +
      "<li>Confirm the iron is cold enough to hold a hand on. Do not degrease a hot pipe. Solvent on hot iron is another fire.</li>" +
      "<li>Degrease the passenger side, cold, with ventilation and no smoking. Valve-cover rail, filter area, block side, sensor connectors, top of the pipe. Do not soak connectors. Wipe them. Rags go into a metal can.</li>" +
      "<li>Start only when the pipe is clean and has not been glowing. Idle. The first wet line of new oil is the source. Old black film lies about direction. UV dye is the right tool if it is a seep rather than a run.</li>" +
      "<li>Repair that source before any oxygen sensor that was sitting in the oil is replaced.</li>" +
      "</ol>" +
      "<table class=\"strip\"><thead><tr><th>Look here</th><th>What fresh oil does</th></tr></thead><tbody>" +
      "<tr><td>Valve-cover gasket " + chip("likely", "LIKELY") + "</td><td>Passenger rail and corners, then down onto the manifold. Check bolt torque and bolt seals before you condemn only the gasket. A CCV elbow next to it is a different part.</td></tr>" +
      "<tr><td>Filter-adapter O-rings " + chip("likely", "LIKELY") + "</td><td>Oil runs down the block toward the starter. Often miscalled a rear main. If the wet starts at the filter housing, do the O-rings. The surface has to be clean.</td></tr>" +
      "<tr><td>Oil-pressure sender</td><td>A weep from the hex can look like the adapter or the pan. Do not add thread tape that can enter the oil passage.</td></tr>" +
      "<tr><td>Oil-pan gasket</td><td>Corners and side rails. Drips lower. Road speed can blow it back onto the pipe. The higher wet point is the one hitting the manifold at idle.</td></tr>" +
      "<tr><td>Rear main seal</td><td>At the inspection cover or thrown around the bellhousing. Do not replace it until the adapter, the pan, and the sender are ruled out with a clean-and-watch.</td></tr>" +
      "</tbody></table>" +
      "<p>None of those is confirmed until the fresh oil is traced to it. No gasket numbers on this sheet. Match by VIN after you know which one. Passenger side first. Confirm that on the truck.</p>" +
      "<p>Oil in the connector can cause P0161. " + chip("poss", "POSSIBLE") + " Oil on the body more often kills the signal than the heater. If the heater circuit later tests good, do not replace the sensor because oil was nearby.</p>" +
      buyRow([[LINK.dyeSearch, "Amazon search: oil-leak UV dye"]]) +
      "<p>Turning the hazard off only lifts the lock. It does not mark a repair done.</p>" +
      "<p>" + openGuideBtn("06", "Open Guide 06") + "</p></article>";
  }

  function relearnMissing(a) {
    var b = (a && a.relearnBox) || {};
    var m = [];
    if (b.reset !== "battery" && b.reset !== "scan") m.push("the reset (battery 15 minutes, or a scan tool)");
    if (!b.keyon) m.push("key on about 10 seconds, foot off the pedal");
    if (!b.warm) m.push("idle to full warm with no throttle blip");
    if (!b.ac) m.push("about two minutes with the A/C on");
    if (b.drive !== "did" && b.drive !== "skip") m.push("Drive idle, or skip it because the truck is not safe in gear");
    return m;
  }
  function relearnReady(a) { return relearnMissing(a).length === 0; }
  function idleReadTable() {
    return '<table class="strip"><thead><tr><th>Warm idle after the relearn</th><th>Meaning</th></tr></thead><tbody>' +
      "<tr><td>About 700–800 in Park, loads off, and it recovers after the A/C comes on</td><td>Idle control is plausible. Rescan. A pending code still needs the electrical tests.</td></tr>" +
      "<tr><td>Still above about 1,000 rpm, no load</td><td>Extra air or a motor the PCM cannot close. Back to smoke, the plate, the cable, and the IAC O-ring. Do not keep resetting.</td></tr>" +
      "<tr><td>Hunts more than about 100 rpm, warm, no load</td><td>" + chip("test", "TEST REQUIRED") + " A remaining leak, a dirty plate edge, a poor IAC, or a hose collapsing.</td></tr>" +
      "<tr><td>Stalls as it warms, or only with the A/C on</td><td>IAC not opening under load, a connector not latched, or a leak the PCM cannot trim out. Check the plug before a second motor.</td></tr>" +
      "<tr><td>Idle is normal and P0505 returns immediately</td><td>Treat it as the circuit. A good idle does not clear a shorted driver wire.</td></tr>" +
      "</tbody></table>";
  }

  function step505(w) {
    var a = w.answers;
    var canBack = w.trail.length > 1;
    var id = w.step;
    if (id === "start") {
      return qOpen("P0505 stored? Save freeze frame before anyone clears it.", chip("test", "TEST REQUIRED")) +
        "<p>Next does not clear anything. Photograph the scan tool. Freeze frame is the evidence.</p>" +
        navRow(canBack, true, true, "") + "</article>";
    }
    if (id === "idle") {
      var rpm = classRpm(state.meter.rpm, state.meter.cold);
      var extra = "";
      if (a.idle === "yes" && rpm.chip === "IN SCREEN") extra = " You called it high or unstable. A hunt can sit inside the band. A steady number in this band is not, by itself, a high idle.";
      if (a.idle === "no" && (rpm.chip === "ABOVE SCREEN" || rpm.chip === "NOT NORMAL")) extra = " The meter is not in the 700–800 screen. High idle belongs on the YES path, not the electrical branch.";
      return qOpen("High or unstable? Warm, Park, loads off.", chip("test", "TEST REQUIRED")) +
        "<p>Screen 700–800 rpm. TSB 18-008-04 about 744 rpm is " + chip("conf", "CONFIRMED") + " as the bulletin text for domestic 2004 4.0L ERH built before 6 March 2004, not proof this VIN has that software. Cold idle is supposed to be higher. Above about 1000 rpm warm, no load, after a real relearn, is not normal.</p>" +
        liveMeter("rpm", "Warm rpm", false) +
        '<div class="choices">' + choiceBtn("idle", "yes", "Yes — high or unstable", a.idle) + choiceBtn("idle", "no", "No — idle already in the 700–800 screen", a.idle) + "</div>" +
        '<div class="classif" data-live="rpm"></div>' +
        (extra ? '<p class="classif">' + esc(extra) + "</p>" : "") +
        navRow(canBack, true, !!a.idle, "choice") + "</article>";
    }
    if (id === "vac") {
      return qOpen("Vacuum leaks first. Tests in this order.", chip("likely", "LIKELY") + " " + chip("poss", "POSSIBLE")) +
        "<p>A leak is a LIKELY idle cause on this MAP engine. It does not prove a lean mixture. POSSIBLE lean only. Do not relearn yet. Do not block a PCV port to cure high idle.</p>" +
        "<ol class=\"proc\">" +
        "<li><b>Cold visual.</b> Engine off and cool. Bend every elbow and short hose. Replace anything cracked, oil-soft, or white-hard at a fitting. Tug each connection. Front CCV elbow, the short rear hose, booster hose and check valve, purge hose, IAC base O-ring, throttle-body gasket, intake seam.</li>" +
        "<li><b>Listen, only after the fire risk is down.</b> Manifold not glowing, oil cleaned off the exhaust. A length of hose as a stethoscope along the intake seam, the booster hose, and the purge line.</li>" +
        "<li><b>Smoke, engine off.</b> Preferred test. Into a manifold vacuum port. Block the intake inlet lightly. Watch the booster hose, the EVAP line, the intake gasket seam, the IAC base, the throttle-body gasket, and every CCV fitting.</li>" +
        "<li><b>Vacuum gauge,</b> warm idle, only after a safe start is allowed. About 17–21 inHg near this elevation, steady. " + chip("likely", "LIKELY") + " screen, not a factory limit. A flicker can be a leak or a misfire. Do not condemn a gasket on the gauge alone.</li>" +
        "<li><b>Scan data.</b> Key-on MAP should read barometric, about 98–100 kPa near this elevation, before start. Then RPM, STFT, LTFT, and upstream O2 at idle and at about 2500 rpm. A leak often shows high rpm with MAP higher than a normal idle, and trims that are not dramatically positive. Trims largely positive only at idle still suggest a small leak or an exhaust leak ahead of an upstream sensor. Write the numbers.</li>" +
        "<li><b>Pinch, selective.</b> One suspect hose at a time, hose pliers, watching rpm. A drop means that hose was admitting air. Do not pinch a hard plastic line. Do not pinch the booster hose if that pedal is your only brake and the truck is not secured. Wheels chocked, Park, parking brake set.</li>" +
        "</ol>" +
        "<p>Not approved on this job: carb cleaner, brake cleaner, or propane under the hood. This engine has an oil film and a possible extreme exhaust temperature. If someone already sprayed it, do not repeat it.</p>" +
        "<p>MAP on this engine is typically in the intake, not on a long hose. Do not add a hose that is not there. A failed MAP is " + chip("poss", "POSSIBLE") + " and is not the leading theory on a truck whose IAC pintle was pushed.</p>" +
        buyRow([[LINK.smokeSearch, "Amazon search: EVAP smoke machine"]]) +
        '<div class="choices">' + choiceBtn("vac", "found", "Leak found — fix it before any relearn", a.vac) + choiceBtn("vac", "none", "No leak found on smoke and visual", a.vac) + choiceBtn("vac", "notyet", "Not tested yet", a.vac) + "</div>" +
        (a.vac === "found" ? '<p class="classif">Fix what smoke or the visual found. Smoke it again after the hoses are sealed. A relearn on a leaking engine teaches the PCM the leak. Then the new IAC, if the pintle was moved.</p>' : "") +
        (a.vac === "none" ? '<p class="classif">No leak on this pass. The idle chain is still unproven. Do not skip the IAC history.</p>' : "") +
        (a.vac === "notyet" ? '<p class="classif">Do not buy a motor to skip the smoke test. Do not relearn yet.</p>' : "") +
        "<p>" + openGuideBtn("04", "Open Guide 04") + "</p>" +
        navRow(canBack, true, !!a.vac, "choice") + "</article>";
    }
    if (id === "coils") {
      return qOpen("IAC coils.", chip("likely", "LIKELY") + " " + chip("test", "TEST REQUIRED")) +
        "<p>Screen about 40–80 Ω each coil, isolated from the other coil and the case. LIKELY screen, not a 2004 FSM limit. Field notes often 48–60 Ω. Connector latched. O-ring present.</p>" +
        liveMeter("iac", "One coil, ohms", false) +
        '<div class="choices">' + choiceBtn("coils", "checked", "Coil reading is the one on the meter", a.coils) + choiceBtn("coils", "notyet", "Not measured yet", a.coils) + "</div>" +
        '<div class="classif" data-live="iac"></div>' +
        '<p class="classif">Good ohms do not save a pushed pintle. Not a 2004 FSM limit.</p>' +
        navRow(canBack, true, !!a.coils, "choice") + "</article>";
    }
    if (id === "pintle") {
      if (!a.pintle) a.pintle = "yes";
      return qOpen("Was the pintle moved by hand?", chip("stated", "STATED")) +
        "<p>Default on this truck is yes. That history is stated. An ohms test cannot see a stripped screw.</p>" +
        '<div class="choices">' + choiceBtn("pintle", "yes", "Yes — stated. Treat the motor as damaged.", a.pintle) + choiceBtn("pintle", "no", "No — recording that it was not moved", a.pintle) + "</div>" +
        (a.pintle === "yes" ? '<p class="classif">Treat the motor as damaged even if ohms are in range. No used motor. Do not touch the new pintle.</p>' : "") +
        (a.pintle === "no" ? '<p class="classif">A normal ohm reading still does not prove the screw is intact if it was pushed. This truck was stated as moved. Do not install a used motor.</p>' : "") +
        navRow(canBack, true, !!a.pintle, "choice") + "</article>";
    }
    if (id === "replace") {
      return qOpen("Replace with a NEW IAC.", chip("cat", "CATALOG LISTED")) +
        "<p>Catalog candidate Mopar 4874373AB for Grand Cherokee 1998–2004. Verify by VIN. No used motor. Do not touch the new pintle. Prefer new Mopar. A poor aftermarket IAC can bring P0505 back. " + chip("poss", "POSSIBLE") + " Some listings use 4874373AB and then say they do not fit a Grand Cherokee. If the listing and the truck disagree, do not buy it.</p>" +
        buyRow([[LINK.iacStore, "Mopar store: 4874373AB"], [LINK.iacSearch, "Amazon search: 4874373AB"]]) +
        "<ol class=\"proc\">" +
        "<li>Negative battery cable off and secured, so the PCM is not stepping a motor you are handling.</li>" +
        "<li>Two screws, commonly a T20. Reported torque 7 N·m (60 in-lb). " + chip("likely", "LIKELY") + " Do not overtighten into the aluminum.</li>" +
        "<li>O-ring present, clean, not twisted. Do not oil it. A dry ring seats. A missing ring is a vacuum leak at the base.</li>" +
        "<li>Set the motor straight in. If it does not sit flush, the ring is pinched or the pintle is against the passage. Remove it and look. Do not push the pintle to make it fit.</li>" +
        "<li>Latch the plug until it clicks. Seat the air duct and the CCV hose at the duct. Those are leak points too.</li>" +
        "</ol>" +
        '<div class="choices">' + choiceBtn("replace", "installed", "New IAC is in. Pintle was not touched.", a.replace) + choiceBtn("replace", "notyet", "Not installed yet", a.replace) +
        (a.pintle === "no" ? choiceBtn("replace", "skip", "Not replacing — recording that the pintle was not moved", a.replace) : "") + "</div>" +
        (a.replace === "installed" ? '<p class="classif">Leave the new pintle where the factory left it. If it does not sit flush, look for a pinched O-ring. Do not push it.</p>' : "") +
        (a.replace === "notyet" ? '<p class="classif">Do not relearn until the new motor is in and the leak is fixed.</p>' : "") +
        (a.replace === "skip" ? '<p class="classif">A normal ohm reading still does not prove the screw is intact if it was pushed. Skipping the motor does not clear that history.</p>' : "") +
        navRow(canBack, true, !!a.replace, "choice") + "</article>";
    }
    if (id === "clean") {
      return qOpen("Clean the throttle body.", chip("test", "TEST REQUIRED")) +
        "<p>Plate must close. Cable must return. Do not soak the TPS. A cable that holds the plate open will not be fixed by any IAC.</p>" +
        "<ol class=\"proc\">" +
        "<li>Key off. Air duct off so you can see the plate. IAC connector off before any spray.</li>" +
        "<li>Carbon on the plate edge, and a plate that does not sit closed. Open it by the cam and let go. It has to return fully.</li>" +
        "<li>Hold the plate open with the cam. Throttle-body cleaner on a towel and on the bore. Do not flood the TPS or the IAC plug. Do not pry the plate with a screwdriver.</li>" +
        "<li>With the IAC out, clean the bypass passage. Do not spray out a new IAC and do not push its pintle to clean behind the tip.</li>" +
        "<li>Wipe the bore so solvent is not ingested on the first start. Confirm the plate closes and the cable returns.</li>" +
        "</ol>" +
        '<div class="choices">' + choiceBtn("clean", "closed", "Plate closes and the cable returns", a.clean) + choiceBtn("clean", "notyet", "Plate or cable not confirmed", a.clean) + "</div>" +
        (a.clean ? '<p class="classif">' + (a.clean === "closed" ? "Plate and cable are recorded as returning. Do not relearn a leak that is still open." : "Do not relearn until the plate closes on its own.") + "</p>" : "") +
        navRow(canBack, true, !!a.clean, "choice") + "</article>";
    }
    if (id === "relearn") {
      if (!a.relearnBox || typeof a.relearnBox !== "object") a.relearnBox = {};
      var box = a.relearnBox;
      function tick(key, val, label) {
        var on = val ? box[key] === val : !!box[key];
        return '<button type="button" class="step' + (on ? " is-on" : "") + '" data-act="recheck" data-key="' + key + '"' + (val ? ' data-val="' + val + '"' : "") + ' aria-pressed="' + (on ? "true" : "false") + '"><span class="num">' + (on ? "✓" : "") + "</span><span>" + label + "</span></button>";
      }
      var missing = relearnMissing(a);
      return qOpen("PCM reset / idle relearn.", chip("test", "TEST REQUIRED")) +
        "<p>Only after the leak is fixed, the plate closes, and the new IAC is in with the pintle untouched. Resetting first teaches the computer the fault. This is not an electronic-throttle relearn. There is no accelerator-pedal procedure. Foot off the pedal the whole time, except the brake when you select Drive.</p>" +
        "<p>If the manifold starts to glow during this idle, turn the hazard on and key off. Do not finish the relearn on a glowing exhaust.</p>" +
        '<div class="checks">' +
        tick("reset", "battery", "Battery negative off at least 15 minutes. Have the radio anti-theft code first if this truck uses one.") +
        tick("reset", "scan", "Or a scan tool cleared Chrysler adaptive fuel and idle memory. Cleaner if you have it.") +
        tick("keyon", "", "Key on, engine off, about 10 seconds. Foot off the pedal. Then start. Shop practice for this cable throttle. " + chip("likely", "LIKELY") + " Not a quoted FSM script.") +
        tick("warm", "", "Park, brake set, wheels chocked, loads off. Idle with no throttle until fully warm. That can take 10 to 15 minutes. Do not blip it.") +
        tick("ac", "", "When warm, idle about two minutes with the A/C on, then A/C off and let it settle.") +
        tick("drive", "did", "Brakes hold and the shifter is safe: foot on the brake, idle in Drive about two minutes, loads off, then briefly with the A/C on. Back to Park.") +
        tick("drive", "skip", "Skipped Drive. The truck is not safe to put in gear.") +
        "</div>" +
        (missing.length ? '<p class="reason">Still open: ' + esc(missing.join("; ")) + ".</p>" : '<p class="classif">The steps above are ticked. Mark the relearn done only if the foot stayed off the pedal.</p>') +
        '<div class="choices">' + choiceBtn("relearn", "done", "Relearn done. Foot stayed off the pedal.", a.relearn) + choiceBtn("relearn", "notyet", "Not yet", a.relearn) + "</div>" +
        (a.relearn === "done" ? '<p class="classif">Recorded. Next is the warm-idle check, not a drive. If orange shows up, key off.</p>' : "") +
        (a.relearn === "notyet" ? '<p class="classif">Next stays off. Do not verify from a relearn that has not been done. Do not relearn a leak.</p>' : "") +
        idleReadTable() +
        "<p>" + openGuideBtn("03", "Open Guide 03") + "</p>" +
        navRow(canBack, true, a.relearn === "done", "choice") + "</article>";
    }
    if (id === "verify") {
      var rpmV = classRpm(state.meter.rpm, state.meter.cold);
      var driveOk = !hazardOn() && rpmV.chip === "IN SCREEN";
      return qOpen("Verify warm idle.", chip("test", "TEST REQUIRED")) +
        "<p>Screen 700–800. If still high, go back to smoke. Do not buy a second motor yet.</p>" +
        liveMeter("rpm", "Warm rpm") +
        '<p class="classif" id="drive-note">' + esc(rpmV.sentence) + (rpmV.chip === "IN SCREEN" ? " Park, loads off, is the screen. A drive is a separate result." : " Go back to smoke, the plate, and the IAC O-ring. Do not buy a second motor yet.") + "</p>" +
        idleReadTable() +
        "<p>" + openGuideBtn("03", "Open Guide 03") + "</p>" +
        '<button type="button" class="choice' + (a.drive ? " is-on" : "") + '" data-act="drive-verify" aria-disabled="' + (driveOk ? "false" : "true") + '">Verify with a drive</button>' +
        (a.drive ? '<p class="classif">Verify with a drive only if the manifold stays dark and no fresh oil is tracking. Watch from the side. If orange returns, key off, cool, and tow. Do not repeat the relearn.</p>' : "") +
        '<p class="reason" id="drive-why"' + (driveOk ? " hidden" : "") + ">" + (hazardOn() ? "Verify with a drive is refused while a hazard is on." : "Idle is not in the 700–800 screen. Do not use a drive to paper over it.") + "</p>" +
        navRow(canBack, false, false, "") + "</article>";
    }
    if (id === "elec") {
      return qOpen("Idle is in the screen. P0505 is the electrical monitor until proven otherwise.", chip("likely", "LIKELY")) +
        "<p>P0505 on this family is often an IAC driver-circuit short to ground or battery. LIKELY, dealer-tech reporting, not an FSM page in hand. A normal idle does not erase a shorted driver wire.</p>" +
        "<p>Also watch for P1294, target idle not reached. High idle plus P1294 sends you back to the YES column.</p>" +
        '<div class="choices">' + choiceBtn("p1294", "yes", "P1294 is stored and the idle is high", a.p1294) + choiceBtn("p1294", "no", "No P1294 with a high idle", a.p1294) + "</div>" +
        (a.p1294 === "yes" ? '<p class="classif">High idle plus P1294 goes back to vacuum, then the IAC. Do not stay on the electrical branch.</p>' : "") +
        (a.p1294 === "no" ? '<p class="classif">Stay on the circuit. A normal idle still does not erase a shorted driver wire.</p>' : "") +
        navRow(canBack, true, !!a.p1294, "choice") + "</article>";
    }
    if (id === "wiggle") {
      return qOpen("Connector, harness, both coils.", chip("test", "TEST REQUIRED")) +
        "<p>Inspect the connector. Wiggle the harness while watching the code. Check both coils. Compare what the meter says with the screen.</p>" +
        liveMeter("iac", "One coil, ohms") +
        '<div class="choices">' + choiceBtn("wiggle", "fault", "Code changed on a wiggle, or a coil is out of range", a.wiggle) + choiceBtn("wiggle", "clean", "Coils in range and the wiggle did nothing", a.wiggle) + "</div>" +
        (a.wiggle === "fault" ? '<p class="classif">A connector or a wire is in play. Do not condemn the PCM yet.</p>' : "") +
        (a.wiggle === "clean" ? '<p class="classif">A quiet wiggle and ohms in range do not erase a shorted driver wire. Compare all four circuits.</p>' : "") +
        navRow(canBack, true, !!a.wiggle, "choice") + "</article>";
    }
    return qOpen("Compare all four circuits.", chip("likely", "LIKELY") + " " + chip("poss", "POSSIBLE")) +
      "<p>Condemn the PCM only after the motor and the wires test good. A poor aftermarket IAC can bring the code back. POSSIBLE.</p>" +
      '<div class="choices">' +
      choiceBtn("circuit", "wires", "Wires or the connector are not good yet", a.circuit) +
      choiceBtn("circuit", "pcm", "Motor and wires test good", a.circuit) +
      choiceBtn("circuit", "after", "An aftermarket IAC was used", a.circuit) +
      "</div>" +
      (a.circuit === "wires" ? '<p class="classif">Repair the wire or the connector. Do not condemn the PCM. Do not call this a completed diagnosis.</p>' : "") +
      (a.circuit === "pcm" ? '<p class="classif">The PCM driver is the remaining suspect. POSSIBLE. Not confirmed. Only after the motor and the wires test good.</p>' : "") +
      (a.circuit === "after" ? '<p class="classif">A poor aftermarket IAC can bring P0505 back. POSSIBLE. Prefer a new Mopar 4874373AB, verified by VIN. Do not push the pintle.</p>' : "") +
      navRow(canBack, false, false, "") + "</article>";
  }

  function matrix161() {
    var band = heaterBand(state.meter.heater, state.meter.heaterTemp);
    var power = state.walk.p0161.answers.power;
    var control = state.walk.p0161.answers.control;
    var row = "none";
    var splice = false;
    var text = "No matrix row matches yet.";
    if (band === "hot") text = "Hot reading is invalid. Let the sensor cool. This tree will not pass or fail a hot ohm reading.";
    else if (band === "empty") text = "Cold heater ohms are not in yet. No row matches.";
    else if (band === "low" || band === "out") text = "That ohm reading is outside the 4–10 screen and it is not an open or a short. No row matches. Cool the sensor and remeasure on the sensor side.";
    else if (band === "open" || band === "short") {
      if (power === "here") { row = "sensor"; text = "Open or short, harness has feed. Sensor, after the oil gate."; }
      else if (power === "one") text = "Open or short, but power is missing on this sensor. The sensor row needs a harness that has feed. Do not order yet.";
      else if (power === "all") text = "Open or short, and power is missing on every sensor. A shorted heater can open the fuse. Prove the fuse or the ASD feed before you call it the sensor. Do not guess the cavity.";
      else text = "Open or short on a cold sensor. Prove the harness feed before you order the sensor.";
    } else if (band === "in") {
      if (power === "one") { row = "feed"; splice = true; text = "4–10 Ω, power missing on this sensor only. Repair this feed wire."; }
      else if (power === "all") { row = "asd"; text = "4–10 Ω, power missing on every sensor. Fuse or ASD relay."; }
      else if (power === "here" && control === "dead") { row = "ctrl"; splice = true; text = "4–10 Ω, 10–12 V, control dead and other sensors work. Control wire, then PCM."; }
      else if (power === "here" && control === "pulses") { row = "inter"; splice = true; text = "4–10 Ω, 10–12 V, control pulls or pulses. Intermittent connector or wire. Do not replace yet."; }
      else if (power === "here") text = "4–10 Ω and 10–12 V are in. Control is not classified. Do not replace the sensor. In range does not clear the circuit.";
      else text = "4–10 Ω is in the screen. In range does not clear the circuit. Power is not measured, so no row matches.";
    }
    return { row: row, splice: splice, text: text };
  }

  function partsGate() {
    return '<div class="card stop"><h3>Parts gate ' + chip("no", "NOT CONFIRMED") + '</h3><p>Do not order NTK 23142 or Mopar 56029001AB. Neither checked out as the 2004 Grand Cherokee 4.0L Bank 2 Sensor 2. Order one sensor by VIN for the bung that failed. Prefer new Mopar or NTK. Candidates, position not mapped: 56028995AA, 56028994AA (before catalyst); 56028997AA, 05139021AA (after catalyst). One owner report tied 05139021AA to rear downstream, body stamped 56044598AA. Single report, not confirmation. Do not swap sensors. Do not add anti-seize to a coated new sensor. Do not grease the connector. Do not solder sensor leads. Cited install torque 22 ft-lb (30 N·m) is ' + chip("likely", "LIKELY") + ", from the WJ guide.</p></div>";
  }
  function spliceRule() {
    return '<div class="card test"><h3>Splice rule — wire repair only</h3><p>Adhesive-lined heat-shrink butt, 22–16 AWG, ratcheting crimper, heat gun, several inches off the exhaust, stagger joints, loom and clip to the original path. No solder-seal, T-taps, wire nuts, tape-only joints, or dielectric grease in the O2 plug. A Weather-Pack assortment does not replace the O2 or IAC housing. 2005–2013 Grand Cherokee 4-pin pigtails (WK, including 5161925AA) are the wrong generation.</p></div>';
  }

  function step161(w) {
    var a = w.answers;
    var canBack = w.trail.length > 1;
    var id = w.step;
    if (id === "stored") {
      return qOpen("P0161 stored?", chip("conf", "CONFIRMED") + " " + chip("test", "TEST REQUIRED")) +
        "<p>OBD-II title: O2 sensor heater circuit, Bank 2 Sensor 2. This tree does not diagnose idle and it does not diagnose a glow.</p>" +
        '<div class="choices">' + choiceBtn("stored", "yes", "Yes — P0161 is stored", a.stored) + choiceBtn("stored", "no", "No — P0161 is not stored", a.stored) + "</div>" +
        (a.stored === "yes" ? '<p class="classif">Heater circuit only. Save freeze frame before anyone clears it.</p>' : "") +
        (a.stored === "no" ? '<p class="classif">Do not use this tree to explain a high idle or a glow.</p>' : "") +
        navRow(canBack, true, !!a.stored, "choice") + "</article>";
    }
    if (id === "oil") {
      return qOpen("Oil gate. Is oil in this connector or on this sensor?", chip("poss", "POSSIBLE") + " " + chip("stop", "STOP")) +
        "<p>If oil is here, stop. Fix the leak and dry the plug before a new sensor. Otherwise the part gets bought twice. Oil in the connector can cause P0161. Oil on the body more often kills the signal than the heater.</p>" +
        (state.hazardOil ? '<p class="reason">The oil hazard is on. “Dry” is refused until that hazard is off. Turning it off does not mark the leak fixed.</p>' : "") +
        '<div class="choices">' + choiceBtn("oil", "yes", "Yes — oil is in the plug or on this sensor", a.oil) + choiceBtn("oil", "no", "No — this plug and this sensor are dry", a.oil) + "</div>" +
        (a.oil === "yes" ? '<p class="classif">Stop. Guide 06 before a new sensor. If the heater later tests good, do not replace the sensor because oil was nearby.</p>' : "") +
        (a.oil === "no" && !state.hazardOil ? '<p class="classif">Dry at this plug. Keep going. Nearby oil is not, by itself, a reason to replace a heater that tests good.</p>' : "") +
        navRow(canBack, true, a.oil === "yes" || (a.oil === "no" && !state.hazardOil), "choice") + "</article>";
    }
    if (id === "endoil") return oilCard("Oil is in this connector or on this sensor, or the oil hazard stopped the gate.") + navRow(canBack, false, false, "");
    if (id === "endno") {
      return qOpen("P0161 is not stored.", chip("test", "TEST REQUIRED")) +
        "<p>This tree stops. It does not diagnose idle and it does not diagnose a glow. Do not buy an oxygen sensor from a code that is not there.</p>" +
        navRow(canBack, false, false, "") + "</article>";
    }
    if (id === "connector") {
      return qOpen("Connector and wiring. Cold engine.", chip("test", "TEST REQUIRED")) +
        "<p>Oil, corrosion, spread pins, melted insulation, harness touching the pipe. Pull the connector body, not the wire. Do not grease the plug. Do not solder the sensor leads.</p>" +
        '<div class="choices">' + choiceBtn("connector", "bad", "Damage, oil, or melted insulation", a.connector) + choiceBtn("connector", "ok", "Shell, pins, and routing look intact", a.connector) + "</div>" +
        (a.connector === "bad" ? '<p class="classif">Repair the connector or move the harness off the pipe before you condemn the sensor.</p>' : "") +
        (a.connector === "ok" ? '<p class="classif">Visual pass is not an electrical pass. Measure the fuse, then the cold heater.</p>' : "") +
        navRow(canBack, true, !!a.connector, "choice") + "</article>";
    }
    if (id === "fuse") {
      return qOpen("ASD fuse. Read the under-hood PDC lid.", chip("test", "TEST REQUIRED")) +
        "<p>Measure it. Do not guess the cavity. A fuse can look intact and be open. Heater power on this family is an ASD feed, not a constant key-on wire. No fuse number is printed here.</p>" +
        '<div class="choices">' + choiceBtn("fuse", "good", "Fuse measures good", a.fuse) + choiceBtn("fuse", "open", "Fuse is open", a.fuse) + choiceBtn("fuse", "unknown", "Not measured", a.fuse) + "</div>" +
        (a.fuse === "good" ? '<p class="classif">A good fuse does not clear this sensor’s branch. Keep going.</p>' : "") +
        (a.fuse === "open" ? '<p class="classif">An open fuse can kill every heater feed. A shorted heater can open it. Do not guess which cavity. Read the lid.</p>' : "") +
        (a.fuse === "unknown" ? '<p class="classif">Do not skip the lid. Do not invent a cavity.</p>' : "") +
        navRow(canBack, true, !!a.fuse, "choice") + "</article>";
    }
    if (id === "ohms") {
      var heatReady = state.meter.heaterTemp === "cold" && heaterBand(state.meter.heater, "cold") !== "empty";
      return qOpen("Heater resistance. Sensor cold. Sensor side.", chip("likely", "LIKELY") + " " + chip("test", "TEST REQUIRED")) +
        "<p>Screen about 4–10 Ω. Earlier 4.0L procedures cite about 4–7 Ω. LIKELY screen, not a confirmed 2004 FSM limit. OL or many thousands = open heater. Near 0 Ω = shorted heater. In range does not clear the circuit. The heater is the only cold pair that reads a handful of ohms. Do not print wire colors. Hot readings are invalid.</p>" +
        liveMeter("heater", "Heater ohms") +
        navRow(canBack, true, heatReady, "heater") + "</article>";
    }
    if (id === "power") {
      return qOpen("Heater power.", chip("test", "TEST REQUIRED")) +
        "<p>About 10–12 V while the ASD feed is actually energized. Measure during the prime, while cranking, or running. A steady key-on 0 V can be the relay already dropped out (often about 1 second). Backprobe. Do not pierce wires. Compare with another sensor's heater feed.</p>" +
        '<div class="choices">' +
        choiceBtn("power", "here", "About 10–12 V on this sensor", a.power) +
        choiceBtn("power", "one", "Missing on this sensor only", a.power) +
        choiceBtn("power", "all", "Missing on every sensor", a.power) +
        choiceBtn("power", "unknown", "Not measured — key-on 0 V is not a result", a.power) +
        "</div>" +
        (a.power === "here" ? '<p class="classif">Feed is present on this sensor while the ASD is on. Power alone does not clear the heater.</p>' : "") +
        (a.power === "one" ? '<p class="classif">This branch only. If ohms are in the 4–10 screen, the row is “repair this feed wire.”</p>' : "") +
        (a.power === "all" ? '<p class="classif">Every heater feed dead points at the fuse or the ASD relay, not at one sensor. Do not guess the cavity.</p>' : "") +
        (a.power === "unknown" ? '<p class="classif">No row can match until this feed is measured with the ASD actually on.</p>' : "") +
        navRow(canBack, true, !!a.power, "choice") + "</article>";
    }
    if (id === "control") {
      return qOpen("PCM control.", chip("test", "TEST REQUIRED")) +
        "<p>Often pulsed, not a hard ground. Do not leave a jumper to ground. A heater around 5 Ω at 12 V draws about 2.5 A. Compare with another sensor. Condemn the PCM only after the wire and the connector test good.</p>" +
        '<div class="choices">' +
        choiceBtn("control", "pulses", "Control pulls or pulses", a.control) +
        choiceBtn("control", "dead", "Control dead, and other sensors work", a.control) +
        choiceBtn("control", "unknown", "Not measured", a.control) +
        "</div>" +
        (a.control === "pulses" ? '<p class="classif">It is being commanded. If ohms and power are in range, do not replace the sensor yet.</p>' : "") +
        (a.control === "dead" ? '<p class="classif">This control is dead while others work. Control wire, then the PCM. Not a sensor order yet.</p>' : "") +
        (a.control === "unknown" ? '<p class="classif">Without the control test, an in-range heater is not a pass.</p>' : "") +
        navRow(canBack, true, !!a.control, "choice") + "</article>";
    }
    var m = matrix161();
    var rows = [
      ["sensor", "Open or short", "Harness has feed", "—", "Sensor, after the oil gate"],
      ["feed", "4–10 Ω", "Missing on this sensor only", "—", "Repair this feed wire"],
      ["asd", "4–10 Ω", "Missing on every sensor", "—", "Fuse or ASD relay"],
      ["ctrl", "4–10 Ω", "10–12 V", "Dead, others work", "Control wire, then PCM"],
      ["inter", "4–10 Ω", "10–12 V", "Pulls or pulses", "Intermittent connector or wire. Do not replace yet"]
    ];
    var table = '<table class="strip"><thead><tr><th>Ohms</th><th>Power</th><th>Control</th><th>Do this</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr' + (m.row === r[0] ? ' class="is-hit"' : "") + "><td>" + r[1] + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td><td>" + (m.row === r[0] ? "<b>" + r[4] + "</b>" : r[4]) + "</td></tr>";
      }).join("") + "</tbody></table>";
    return qOpen("Result from this matrix.", chip("test", "TEST REQUIRED")) +
      '<p class="classif">' + esc(m.text) + "</p>" + table +
      (m.row === "ctrl" ? "<p>Condemn the PCM only after the control wire and the connector test good.</p>" : "") +
      (m.splice ? spliceRule() : "") +
      partsGate() +
      "<p>" + openGuideBtn("02", "Open Guide 02") + "</p>" +
      navRow(canBack, false, false, "") + "</article>";
  }

  function renderWalk() {
    var tree = state.walk.tree;
    var w = state.walk[tree];
    var body;
    if (tree === "p0505" && state.hazardGlow) body = glowCard();
    else if (tree === "p0505" && state.hazardOil && (w.step === "relearn" || w.step === "verify")) body = oilCard("Oil hazard is on before a verify step. Guide 06. Verify with a drive is refused.");
    else body = tree === "p0505" ? step505(w) : step161(w);
    var banner = tree === "p0161"
      ? '<p class="banner-inline">Heater circuit only. Does not diagnose idle and does not diagnose a glow. Bank 2 Sensor 2, rear downstream, after the rear mini-cat, before the main cat. LIKELY. Confirm the bung. Count sensors. Two = federal, four = the California layout.</p>'
      : '<p class="kicker">Guide 08 · P0505 · do not add branches</p>';
    var note = tree === "p0505"
      ? '<details class="note"><summary>Note</summary><p>Unplugging the IAC freezes the pintle where it sits. It is a comparison, not a repair. A motor that was pushed does not get plugged back in for a second chance.</p></details>'
      : "";
    var oilLocked = tree === "p0505" && state.hazardOil && !state.hazardGlow && (w.step === "relearn" || w.step === "verify");
    if (oilLocked) body += navRow(w.trail.length > 1, false, false, "");
    return '<p id="empty-search" class="empty" hidden>Nothing on this screen matches. Type P0161, pintle, booster, or 4874373AB.</p><section class="walk"><div class="seg" role="tablist" aria-label="Tree"><button type="button" role="tab" data-act="tree" data-tree="p0505" aria-selected="' + (tree === "p0505" ? "true" : "false") + '">P0505</button><button type="button" role="tab" data-act="tree" data-tree="p0161" aria-selected="' + (tree === "p0161" ? "true" : "false") + '">P0161</button></div>' +
      banner + crumbs(tree, w) + body + note + sheets() + "</section>";
  }

  function finishState() {
    var missing = [];
    var open = [];
    state.order.forEach(function (v, i) { if (!v) open.push(i + 1); });
    if (open.length) missing.push("Steps still open: " + open.join(", ") + ".");
    if (state.hazardGlow) missing.push("Manifold-is-glowing hazard is on.");
    if (state.hazardOil) missing.push("Oil-on-the-exhaust hazard is on.");
    var rpm = classRpm(state.meter.rpm, state.meter.cold);
    if (rpm.chip !== "IN SCREEN") missing.push("Warm idle meter is not in the 700–800 screen. " + rpm.sentence);
    return { ok: missing.length === 0, missing: missing };
  }
  function finishHtml() {
    var f = finishState();
    if (f.ok) {
      return '<article class="card good finish" id="finish"><h2>Finish rule met</h2><p>The manifold stays dark. No fresh oil reaches the pipe or a sensor. Warm idle is in the 700–800 rpm screen in Park with loads off. P0505 and P0161 stay off after the drive cycle you can safely complete. Anything less is an unfinished test.</p><p>This is the package finish rule. It is not a confirmed diagnosis of the idle chain.</p></article>';
    }
    return '<article class="card stop finish" id="finish"><h2>Unfinished test</h2><p>Anything less is an unfinished test.</p><ul>' + f.missing.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul></article>";
  }
  function renderOrder() {
    var next = -1;
    state.order.some(function (v, i) { if (!v) { next = i; return true; } return false; });
    var items = ORDER.map(function (text, i) {
      var on = state.order[i];
      var locked = hazardOn() && LOCK_STEPS[i];
      var tag = ORDER_TAG[i];
      var tagHtml = tag ? chip(tag[0], tag[1]) + " " : "";
      return '<div data-find="step ' + (i + 1) + ' ' + esc(text) + '"><button type="button" class="step' + (on ? " is-on" : "") + (i === next ? " is-next" : "") + (locked ? " is-locked" : "") + '" data-act="step" data-step="' + i + '" role="checkbox" aria-checked="' + (on ? "true" : "false") + '" aria-disabled="' + (locked ? "true" : "false") + '"><span class="num">' + (i + 1) + '</span><span>' + tagHtml + esc(text) + "</span></button>" +
        (locked ? '<p class="reason">Locked while a hazard is on. Cool completely. Do not drive it. Turning the hazard off does not mark this step done.</p>' : "") +
        "</div>";
    }).join("");
    return '<section><p class="kicker">Guide 07 · repair order</p><h1>Do the work in this order</h1><p class="lede">The highlighted step is the next one still open. A later check is kept, with a warning, except steps 7, 8, 11, and 12 while a hazard is on.</p>' +
      "<p>" + openGuideBtn("07", "Open Guide 07") + "</p>" +
      (orderWarn ? '<p class="warnline">' + esc(orderWarn) + "</p>" : "") +
      '<p id="empty-search" class="empty" hidden>Nothing on this screen matches. Type P0161, pintle, booster, or 4874373AB.</p>' +
      '<div class="order-list">' + items + "</div>" + finishHtml() + "</section>";
  }

  function boxStyle(n, box) {
    return "left:" + (n.x / box.w * 100).toFixed(2) + "%;top:" + (n.y / box.h * 100).toFixed(2) + "%;width:" + (n.w / box.w * 100).toFixed(2) + "%;height:" + (n.h / box.h * 100).toFixed(2) + "%;";
  }
  function nodeBtn(n, box) {
    var info = NODES[n.id];
    var on = state.bench.node === n.id;
    return '<button type="button" class="node ' + (n.tone || "") + " " + (n.flag || "") + (on ? " is-on" : "") + '" style="' + boxStyle(n, box) + '" data-act="node" data-node="' + n.id + '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(info.short) + "<small>" + esc(info.sub) + "</small></button>";
  }
  function hoseSvg() {
    return '<svg class="map-svg" viewBox="0 0 760 420" role="img" aria-label="Working hose map. Not a factory vacuum diagram.">' +
      '<text x="380" y="14" text-anchor="middle" fill="#3e4c59" font-size="14" font-family="Segoe UI, Calibri, Arial, sans-serif">FRONT OF THE SHEET IS THE RADIATOR END · ports grouped, not measured</text>' +
      '<line class="seam" data-wire="intake" x1="380" y1="52" x2="380" y2="286"/>' +
      '<line class="wire" data-wire="ccv" x1="226" y1="52" x2="380" y2="52"/>' +
      '<line class="wire" data-wire="evap" x1="534" y1="52" x2="380" y2="52"/>' +
      '<line class="wire" data-wire="booster" x1="226" y1="140" x2="380" y2="140"/>' +
      '<line class="wire" data-wire="hvac" x1="534" y1="140" x2="380" y2="140"/>' +
      '<line class="wire" data-wire="iac" x1="226" y1="228" x2="380" y2="228"/>' +
      '<line class="wire" data-wire="tb" x1="534" y1="228" x2="380" y2="228"/>' +
      "</svg>";
  }
  function exSvg() {
    return '<svg class="map-svg" viewBox="0 0 790 430" role="img" aria-label="Passenger-side exhaust map. Confirm on the truck.">' +
      '<text x="66" y="28" text-anchor="middle" fill="#3e4c59" font-size="14" font-family="Segoe UI, Calibri, Arial, sans-serif">PASSENGER</text>' +
      '<text x="230" y="22" fill="#3e4c59" font-size="14" font-family="Segoe UI, Calibri, Arial, sans-serif">FRONT · cylinders 1–3 · Bank 1</text>' +
      '<text x="230" y="190" fill="#3e4c59" font-size="14" font-family="Segoe UI, Calibri, Arial, sans-serif">REAR · cylinders 4–6 · Bank 2</text>' +
      '<line class="wire" data-wire="b1s1" x1="122" y1="70" x2="160" y2="70"/>' +
      '<line class="wire" data-wire="fmini" x1="300" y1="70" x2="330" y2="70"/>' +
      '<line class="wire" data-wire="b1s2" x1="450" y1="70" x2="470" y2="70"/>' +
      '<path class="wire" data-wire="topjoin" d="M620 70 H648 V190 H656"/>' +
      '<line class="wire" data-wire="b2s1" x1="122" y1="234" x2="160" y2="234"/>' +
      '<line class="wire" data-wire="rmini" x1="300" y1="234" x2="330" y2="234"/>' +
      '<line class="wire" data-wire="b2s2" x1="450" y1="230" x2="470" y2="230"/>' +
      '<path class="wire" data-wire="botjoin" d="M630 230 H648 V190"/>' +
      '<line class="wire" data-wire="main" x1="648" y1="190" x2="656" y2="190"/>' +
      '<path class="wire" data-wire="oil" d="M66 298 V340 H160" stroke-dasharray="5 4"/>' +
      "</svg>";
  }
  function detailHtml() {
    var n = NODES[state.bench.node];
    var scope = state.bench.map === "exhaust" ? "exhaust map" : "hose map";
    if (!n) return '<section class="detail card" data-find="' + scope + '"><h3>Select a node</h3><p>Where it runs, the part to compare, and what not to do show up here. The path for that node lights.</p></section>';
    return '<section class="detail card" data-find="' + esc(scope + " " + n.name + " " + n.where + " " + n.part) + '"><h3>' + esc(n.name) + " " + chip(n.tag[0], n.tag[1]) + "</h3>" +
      "<h4>Where it runs</h4><p>" + esc(n.where) + "</p><h4>Part to compare</h4><p>" + esc(n.part) + "</p>" +
      (n.links ? buyRow(n.links) + "<p>Match the listing to this VIN before you buy. A search is not a fitment confirmation.</p>" : "") +
      "<h4>Do not</h4><p>" + esc(n.dont) + "</p></section>";
  }
  function partsHtml() {
    var rows = [
      ["cat", "IAC, new", "4874373AB", "Verify by VIN. Buy new. Do not push the pintle. Standard AC176 is a cited aftermarket cross. Prefer new Mopar. This PCM is reported picky about poor aftermarket IACs.", "POSSIBLE", "poss", "iac 4874373ab standard ac176 pintle"],
      ["cat", "Short CCV hoses", "Dorman 47128 / Chrysler 4854265", "Two hoses, about 2.56 in. Not the whole crankcase harness. Match the piece in your hand.", "", "", "ccv pcv 47128 4854265 dorman"],
      ["cand", "O2, before catalyst", "56028995AA and 56028994AA", "2004 4.0L published list. Position not proven. Do not buy a set.", "CANDIDATE", "cand", "56028995aa 56028994aa oxygen upstream"],
      ["cand", "O2, after catalyst", "56028997AA and 05139021AA", "One owner report tied 05139021AA to rear downstream, body stamped 56044598AA. Not proof.", "CANDIDATE", "cand", "56028997aa 05139021aa 56044598aa downstream"],
      ["win", "HVAC vacuum line", "55115901AG", "Elbow and check valve only. Build dates 31 Mar–6 Apr 2004. That failure blocks HVAC and cruise. It does not raise idle.", "VIN WINDOW", "win", "55115901ag hvac cruise elbow"],
      ["test", "Booster hose, purge hose, intake gasket, TB gasket", "Match by VIN", "Buy only what the smoke test or the crack identifies. Not a set.", "TEST REQUIRED", "test", "booster purge intake gasket throttle"],
      ["test", "Valve cover, filter-adapter O-rings, sender, pan, rear main", "Match by VIN after the fresh oil is traced", "Adapter and valve cover are the common ones. Rear main is the expensive miss. Rule the adapter, the pan, and the sender out first.", "TEST REQUIRED", "test", "valve cover adapter sender pan rear main oil"],
      ["no", "NTK 23142", "23142", "Other Jeeps: 2001–2003 Wrangler/TJ downstream Bank 1 Sensor 2, and 2002–2003 Liberty Bank 2 Sensor 2. Not this Grand Cherokee Bank 2 Sensor 2.", "NOT CONFIRMED", "no", "ntk 23142 do not buy"],
      ["no", "Mopar 56029001AB", "56029001AB", "No fitment found. Nearby real numbers differ (56028994AA, 56029049AA).", "NOT CONFIRMED", "no", "56029001ab do not buy"],
      ["no", "53030006", "53030006", "Not a confirmed vacuum elbow. 53030008 is a PT Cruiser tee.", "NOT CONFIRMED", "no", "53030006 53030008 elbow do not buy"]
    ];
    var kindTag = {
      cat: ["cat", "CATALOG LISTED"],
      cand: ["cand", "CANDIDATE"],
      win: ["win", "VIN WINDOW"],
      test: ["test", "TEST REQUIRED"],
      no: ["no", "NOT CONFIRMED"]
    };
    return rows.map(function (r) {
      var base = kindTag[r[0]];
      var tags = chip(base[0], base[1]);
      if (r[4] && r[4] !== base[1]) tags += " " + chip(r[5], r[4]);
      var extra = "";
      if (r[2] === "4874373AB") extra = buyRow([[LINK.iacStore, "Mopar store: 4874373AB"], [LINK.iacSearch, "Amazon search: 4874373AB"]]) + "<p>Match the listing to this VIN. A search is not a fitment confirmation. Some listings use the number and then say they do not fit a Grand Cherokee.</p>";
      if (r[2].indexOf("47128") >= 0) extra = buyRow([[LINK.ccvSearch, "Amazon search: Dorman 47128"]]) + "<p>Match the piece in your hand. Two short hoses, not the whole crankcase harness.</p>";
      return '<article class="part" data-kind="' + r[0] + '" data-find="' + esc(r[6]) + '"><h3>' + esc(r[1]) + " " + tags + '</h3><p class="pn">' + esc(r[2]) + "</p><p>" + esc(r[3]) + "</p>" + extra + "</article>";
    }).join("");
  }
  function renderBench() {
    var map = state.bench.map;
    var box = map === "hoses" ? HOSE_BOX : EX_BOX;
    var layout = map === "hoses" ? HOSE_LAYOUT : EX_LAYOUT;
    var filters = [["all", "All"], ["cat", "Catalog listed"], ["cand", "Candidate"], ["no", "Not confirmed"], ["test", "Test required"]];
    return '<section><p class="kicker">Guide 11 · bench</p><h1>' + (map === "hoses" ? "Hoses" : "Exhaust") + "</h1>" +
      '<p class="banner-inline">This is a working map, not a factory vacuum diagram. Ports are grouped for readability, not a measured left/right layout. Match the hose in your hand.</p>' +
      '<div class="seg" role="tablist" aria-label="Maps"><button type="button" role="tab" data-act="map" data-map="hoses" aria-selected="' + (map === "hoses" ? "true" : "false") + '">Hoses</button><button type="button" role="tab" data-act="map" data-map="exhaust" aria-selected="' + (map === "exhaust" ? "true" : "false") + '">Exhaust</button></div>' +
      '<p id="empty-search" class="empty" hidden>Nothing on this screen matches. Type P0161, pintle, booster, or 4874373AB.</p>' +
      '<div class="map-wrap">' + (map === "hoses" ? hoseSvg() : exSvg()) + '<div class="map-nodes">' + layout.map(function (n) { return nodeBtn(n, box); }).join("") + "</div></div>" +
      (map === "hoses" ? "<p>Do not pull fuel lines, heater hoses, or power-steering hoses while chasing a vacuum leak.</p>" : "<p>Count sensors before you buy. Two = federal. Four = the California layout drawn here. Do not cut a catalyst out.</p>") +
      detailHtml() +
      '<h2 id="parts">Parts to compare</h2><p>55115901AG is a VIN-window part. It stays on All. It is not a catalog-listed idle part.</p>' +
      '<div class="filters">' + filters.map(function (f) {
        return '<button type="button" class="textbtn" data-act="filter" data-filter="' + f[0] + '" aria-pressed="' + (state.bench.filter === f[0] ? "true" : "false") + '">' + f[1] + "</button>";
      }).join("") + "</div>" +
      '<div class="parts">' + partsHtml() + "</div>" +
      '<section class="counter"><h3>Counter script</h3><textarea id="counter-text" readonly>' + esc(COUNTER) + '</textarea><p><button type="button" class="textbtn" data-act="copy">Copy the counter script</button></p><p id="copy-status" aria-live="polite"></p></section></section>';
  }

  function yn(name, key) {
    var cur = state.record[key];
    var lockYes = key === "cleared" && hazardOn();
    return '<div class="yn" role="group" aria-label="' + esc(name) + '">' +
      '<button type="button" class="textbtn" data-act="rec-yn" data-key="' + key + '" data-val="yes" aria-pressed="' + (cur === "yes" ? "true" : "false") + '" aria-disabled="' + (lockYes ? "true" : "false") + '">Yes</button>' +
      '<button type="button" class="textbtn" data-act="rec-yn" data-key="' + key + '" data-val="no" aria-pressed="' + (cur === "no" ? "true" : "false") + '">No</button></div>' +
      (lockYes ? '<p class="reason">Marking codes cleared is refused while a hazard is on. Photograph the scan tool. Freeze frame is gone once you clear.</p>' : "") +
      (key === "cleared" && cur === "yes" && hazardOn() ? '<p class="reason">A stored “yes” is not a clearance you can act on while a hazard is on.</p>' : "");
  }
  function field(label, key, find, hint, wide) {
    var val = state.record[key];
    return '<label class="field' + (wide ? " wide" : "") + '" data-find="' + esc(find) + '"><span>' + esc(label) + "</span>" +
      (hint ? "<small>" + hint + "</small>" : "") +
      '<input data-rec="' + key + '" autocomplete="off" spellcheck="false" value="' + esc(val) + '"></label>';
  }
  function briefText() {
    var lines = ["2004 Grand Cherokee Laredo 4.0L — shop notes"];
    lines.push("Hazards: manifold glowing " + (state.hazardGlow ? "YES" : "no") + ". Oil on exhaust " + (state.hazardOil ? "YES" : "no") + ".");
    var rpm = classRpm(state.meter.rpm, state.meter.cold);
    var iac = classIac(state.meter.iac);
    var heat = classHeater(state.meter.heater, state.meter.heaterTemp);
    var vac = classVac(state.meter.vac, state.meter.flicker);
    lines.push("Meter rpm: " + (state.meter.rpm || "—") + (state.meter.cold ? " cold" : "") + " — " + rpm.chip);
    lines.push("Meter IAC ohms: " + (state.meter.iac || "—") + (state.meter.pair ? " pair " + state.meter.pair : "") + " — " + iac.chip);
    lines.push("Meter heater ohms: " + (state.meter.heater || "—") + " " + state.meter.heaterTemp + " — " + heat.chip);
    lines.push("Meter vacuum: " + (state.meter.vac || "—") + (state.meter.flicker ? " flicker" : "") + " — " + vac.chip);
    var doneN = state.order.filter(Boolean).length;
    var nextOpen = 0;
    state.order.some(function (v, i) { if (!v) { nextOpen = i + 1; return true; } return false; });
    lines.push("Repair order: " + doneN + " of 13 checked." + (nextOpen ? " Next open: " + nextOpen + "." : " All checked."));
    var labels = {
      vin8: "VIN last 8", miles: "Mileage", date: "Date", sensors: "Sensor count",
      glowNote: "Glow or stain", oilPath: "Fresh oil from", coolant: "Coolant", gear: "Gear", ac: "A/C",
      warmRpm: "Warm rpm Park", driveRpm: "Warm rpm Drive", iacOhms: "IAC coil A", iacB: "IAC coil B",
      vacuum: "Vacuum", smoke: "Smoke escaped at", mapKey: "MAP key-on", mapIdle: "MAP idle",
      stftIdle: "STFT idle", ltftIdle: "LTFT idle", stft2500: "STFT 2500", ltft2500: "LTFT 2500",
      upstream: "Upstream O2", heaterOhms: "B2S2 heater ohms", heaterVolts: "B2S2 heater volts",
      controlNote: "B2S2 control", freeze: "Freeze frame saved", cleared: "Codes cleared",
      codesBefore: "Codes before clear", codesAfter: "Codes after repair", notes: "Notes"
    };
    Object.keys(labels).forEach(function (k) {
      if (state.record[k]) lines.push(labels[k] + ": " + state.record[k]);
    });
    var fin = finishState();
    lines.push(fin.ok ? "Finish rule met on the numbers in this browser. Not a confirmed diagnosis." : "Unfinished: " + fin.missing.join(" "));
    return lines.join("\n");
  }
  function renderPages() {
    var g = guideById(state.pages.guide);
    var list = '<p class="kicker">Printed sheets</p><h1>Every page</h1>' +
      '<p class="lede">Same sheets as the binder. Swipe a page, or use Previous and Next. The PDF is the sharper copy.</p>' +
      '<p class="buy-row">' + buy("../00_MASTER_REFERENCE.pdf", "All pages, one PDF") + "</p>" +
      '<div class="guide-list">' + GUIDES.map(function (item) {
        return '<button type="button" class="guide" data-act="open-guide" data-guide="' + item.id + '" data-find="guide ' + item.id + " " + esc(item.title) + " " + esc(item.hint) + '"><span class="num">' + item.id + "</span><span><b>" + esc(item.title) + "</b><small>" + esc(item.hint) + " · " + item.n + (item.n === 1 ? " page" : " pages") + "</small></span></button>";
      }).join("") + "</div>";
    if (!g) {
      return "<section>" + list + '<p id="empty-search" class="empty" hidden>Nothing on this screen matches.</p></section>';
    }
    var n = state.pages.n;
    if (n < 1 || n > g.n) n = 1;
    return '<section class="viewer"><p class="kicker">Guide ' + g.id + "</p><h1>" + esc(g.title) + "</h1>" +
      '<div class="pager"><button type="button" data-act="page" data-dir="-1"' + (n <= 1 ? " disabled" : "") + ">Previous</button><span>Page " + n + " of " + g.n + '</span><button type="button" data-act="page" data-dir="1"' + (n >= g.n ? " disabled" : "") + ">Next</button></div>" +
      '<p class="buy-row">' + buy(g.pdf, "Open this guide as a PDF") + '<button type="button" class="textbtn" data-act="open-guide" data-guide="">All guides</button></p>' +
      '<figure class="sheetpage"><img src="' + esc(pageJpg(g, n)) + '" alt="Guide ' + esc(g.id) + " page " + n + " of " + g.n + ", " + esc(g.title) + '"></figure>' +
      '<div class="pager"><button type="button" data-act="page" data-dir="-1"' + (n <= 1 ? " disabled" : "") + '>Previous</button><button type="button" data-act="page" data-dir="1"' + (n >= g.n ? " disabled" : "") + ">Next</button></div>" +
      '<p id="empty-search" class="empty" hidden>Nothing on this screen matches.</p></section>';
  }
  function renderRecord() {
    return '<section><p class="kicker">Guide 01 · test record</p><h1>Write the reading, not a conclusion</h1><p>Nothing on this form is sent anywhere. It stays in this browser. Copy it when you want to paste the numbers into WhatsApp.</p>' +
      '<p class="buy-row"><button type="button" data-act="pull-meter">Use the live meter</button><button type="button" data-act="copy-notes">Copy notes for WhatsApp</button></p><p id="copy-status" aria-live="polite"></p>' +
      '<p id="empty-search" class="empty" hidden>Nothing on this screen matches. Type P0161, pintle, booster, or 4874373AB.</p>' +
      '<div class="form">' +
      field("VIN last 8", "vin8", "vin", "Verify the truck before you order parts.", false) +
      field("Mileage", "miles", "mileage", "", false) +
      field("Date", "date", "date", "", false).replace("<input ", '<input type="date" ') +
      field("Sensor count", "sensors", "sensor count california federal", "Count them. Two = federal. Four = the California layout.", false) +
      field("Glow or stain", "glowNote", "glow stain manifold", "Active orange or red, or cold heat stain only.", true) +
      field("Fresh oil from", "oilPath", "oil path leak", "The first new wet line, not old black film.", true) +
      field("Coolant temp", "coolant", "coolant temp", "Record it before you condemn a cold idle.", false) +
      field("Gear", "gear", "gear park drive", "Park and Drive are different loads.", false) +
      '<div class="field" data-find="a/c air conditioning"><span>A/C</span><div class="yn"><button type="button" class="textbtn" data-act="rec-yn" data-key="ac" data-val="on" aria-pressed="' + (state.record.ac === "on" ? "true" : "false") + '">On</button><button type="button" class="textbtn" data-act="rec-yn" data-key="ac" data-val="off" aria-pressed="' + (state.record.ac === "off" ? "true" : "false") + '">Off</button></div></div>' +
      field("Warm RPM, Park", "warmRpm", "warm rpm idle", "Screen 700–800. The live meter classifies. This box is the written number.", false) +
      field("Warm RPM, Drive", "driveRpm", "drive rpm", "Only if the truck is safe in gear. Brake held, loads off.", false) +
      field("IAC coil A ohms", "iacOhms", "iac ohms pintle", "Screen about 40–80 Ω. Isolated from the other coil and the case. Good ohms do not save a pushed pintle.", false) +
      field("IAC coil B ohms", "iacB", "iac coil b ohms", "Same screen. Both coils.", false) +
      field("Vacuum inHg", "vacuum", "vacuum inhg gauge", "LIKELY screen about 17–21 near this elevation. Note a flicker.", false) +
      field("Smoke escaped at", "smoke", "smoke test leak", "The joint the smoke left from. Blank if not smoked yet.", true) +
      field("MAP key-on", "mapKey", "map key barometric", "Should read barometric, about 98–100 kPa near this elevation, before start. A failed MAP is POSSIBLE, not the leading theory.", false) +
      field("Idle MAP", "mapIdle", "idle map", "", false) +
      field("STFT at idle", "stftIdle", "stft idle trim", "", false) +
      field("LTFT at idle", "ltftIdle", "ltft idle trim", "", false) +
      field("STFT at about 2500 rpm", "stft2500", "stft 2500 trim", "", false) +
      field("LTFT at about 2500 rpm", "ltft2500", "ltft 2500 trim", "", false) +
      field("Upstream O2", "upstream", "upstream o2 oxygen", "Prove lean here, not from a vacuum leak alone.", false) +
      field("B2S2 heater ohms", "heaterOhms", "heater ohms p0161", "Cold. Sensor side. Screen about 4–10 Ω. OL = open heater.", false) +
      field("B2S2 heater volts", "heaterVolts", "heater volts asd", "About 10–12 V while the ASD feed is actually on.", false) +
      field("B2S2 control", "controlNote", "control pcm heater", "Pulls, pulses, or dead. Compare with another sensor.", false) +
      field("Codes before clear", "codesBefore", "codes freeze frame", "Photograph the scan tool. Include freeze frame.", true) +
      '<div class="field" data-find="freeze frame"><span>Freeze frame saved</span>' + yn("Freeze frame saved", "freeze") + "</div>" +
      '<div class="field" data-find="codes cleared"><span>Codes cleared</span>' + yn("Codes cleared", "cleared") + "</div>" +
      field("Codes after repair", "codesAfter", "codes after rescan", "After idle is verified. Not before.", true) +
      '<label class="field wide" data-find="notes"><span>Notes</span><textarea data-rec="notes" rows="5">' + esc(state.record.notes) + "</textarea></label>" +
      "</div><p>" + openGuideBtn("01", "Open Guide 01, the test record sheet") + "</p></section>";
  }

  var CHIP_KIND = { stop: 1, test: 1, likely: 1, poss: 1, conf: 1, cat: 1, stated: 1, no: 1, good: 1, win: 1, cand: 1 };
  var CARD_KIND = { stop: 1, test: 1, poss: 1, good: 1 };
  function libRoot() {
    var lib = window.STEPHS_LIB;
    if (!lib || !Array.isArray(lib.pages)) return { groups: [], pages: [] };
    return lib;
  }
  function libPage(id) {
    if (!id) return null;
    var pages = libRoot().pages;
    for (var i = 0; i < pages.length; i++) if (pages[i].id === id) return pages[i];
    return null;
  }
  function inline(s) {
    return esc(s).replace(/\{\{([a-z]+):([^}]+)\}\}/g, function (_, kind, text) {
      if (!CHIP_KIND[kind]) return text;
      return '<span class="tag ' + kind + '">' + text + "</span>";
    });
  }
  function blockFind(b) {
    if (!b) return "";
    if (b.t === "table") {
      return [b.caption || ""].concat(b.heads || []).concat((b.rows || []).map(function (r) { return r.join(" "); })).join(" ");
    }
    return [b.text, b.title, b.label, b.caption].concat(b.items || []).filter(Boolean).join(" ");
  }
  function renderBlock(b) {
    var find = ' data-find="' + esc(blockFind(b)) + '"';
    if (b.t === "p") return "<p" + find + ">" + inline(b.text) + "</p>";
    if (b.t === "h") return "<h2" + find + ">" + inline(b.text) + "</h2>";
    if (b.t === "ul" || b.t === "ol") {
      var tag = b.t === "ol" ? "ol" : "ul";
      return "<" + tag + ' class="proc"' + find + ">" + (b.items || []).map(function (item) {
        return "<li>" + inline(item) + "</li>";
      }).join("") + "</" + tag + ">";
    }
    if (b.t === "card") {
      var kind = CARD_KIND[b.kind] ? b.kind : "test";
      return '<article class="card ' + kind + '"' + find + "><h3>" + inline(b.title || "") + "</h3><p>" + inline(b.text || "") + "</p></article>";
    }
    if (b.t === "table") {
      var heads = (b.heads || []).map(function (h) { return "<th>" + inline(h) + "</th>"; }).join("");
      var rows = (b.rows || []).map(function (r) {
        return '<tr data-find="' + esc(r.join(" ")) + '">' + r.map(function (cell, i) {
          return (i === 0 ? "<th>" : "<td>") + inline(cell) + (i === 0 ? "</th>" : "</td>");
        }).join("") + "</tr>";
      }).join("");
      return '<div class="table-wrap"' + find + '><table class="strip"><caption>' + inline(b.caption || "") + "</caption><thead><tr>" + heads + "</tr></thead><tbody>" + rows + "</tbody></table></div>";
    }
    if (b.t === "go") return '<p class="jumps"><button type="button" data-act="lib" data-id="' + esc(b.id) + '">' + inline(b.label || "Open") + "</button></p>";
    if (b.t === "links") return buyRow(b.items || []);
    if (b.t === "guide") return "<p>" + openGuideBtn(b.id, b.label || "Open the guide") + "</p>";
    if (b.t === "fig") return renderFig(b.id);
    if (b.t === "jump") {
      var attrs = 'type="button" data-act="' + esc(b.act || "mode") + '"';
      if (b.mode) attrs += ' data-mode="' + esc(b.mode) + '"';
      if (b.tree) attrs += ' data-tree="' + esc(b.tree) + '"';
      if (b.map) attrs += ' data-map="' + esc(b.map) + '"';
      if (b.node) attrs += ' data-node="' + esc(b.node) + '"';
      return "<p class=\"jumps\"><button " + attrs + ">" + inline(b.label || "Open") + "</button></p>";
    }
    return "";
  }
  function renderFig(id) {
    var figs = window.STEPHS_FIGS || {};
    var fig = figs[id];
    if (!fig) return "";
    return '<figure class="fig" data-find="' + esc((fig.find || "") + " " + (fig.title || "") + " " + (fig.caption || "")) + '"><p class="dtitle">' + esc(fig.title || "") + '</p><div class="diag">' + fig.html + '</div><figcaption>' + inline(fig.caption || "") + "</figcaption></figure>";
  }
  function renderCommon() {
    var lib = libRoot();
    var page = libPage(state.common && state.common.id);
    if (!lib.pages.length) {
      return "<section><h1>Common library did not load</h1><p>assets/library.js is missing. The rest of the bench still runs.</p></section>";
    }
    if (!page) {
      var html = '<section><p class="kicker">Common issues · this WJ only</p><h1>Separate pages. The lid still wins.</h1>' +
        '<p class="lede">2004 Grand Cherokee WJ, stated 4.0L. Not a 2005 and later WK, and not a diesel chart. Owner-manual rows are marked PUBLISHED. Service-chart rows are marked CHART. If the cover in the truck disagrees, the cover wins. Diagrams are shop drawings, not the lid and not a factory schematic. Idle, oil-fire, and P0161 stay on their own walks.</p>';
      (lib.groups || []).forEach(function (g) {
        var pages = lib.pages.filter(function (p) { return p.group === g.id; });
        if (!pages.length) return;
        html += "<h2>" + esc(g.title) + '</h2><div class="guide-list">';
        pages.forEach(function (p) {
          html += '<button type="button" class="guide" data-act="lib" data-id="' + esc(p.id) + '" data-find="' + esc((p.find || "") + " " + p.title + " " + (p.blurb || "")) + '"><span class="num">' + esc(p.code || "") + "</span><span><b>" + esc(p.title) + "</b><small>" + esc(p.blurb || "") + "</small></span></button>";
        });
        html += "</div>";
      });
      return html + '<p id="empty-search" class="empty" hidden>Nothing on this screen matches.</p></section>';
    }
    var figHtml = (page.figs || []).map(renderFig).join("");
    var body = (page.blocks || []).map(renderBlock).join("");
    return '<section><p class="kicker">' + esc(page.kicker || "Common issues") + "</p><h1>" + esc(page.title) + "</h1>" +
      '<p class="buy-row"><button type="button" data-act="lib" data-id="">All common issues</button></p>' +
      (page.figAfter ? body + figHtml : figHtml + body) +
      '<p class="lib-foot buy-row"><button type="button" data-act="lib" data-id="">All common issues</button></p>' +
      '<p id="empty-search" class="empty" hidden>Nothing on this screen matches. Clear the search to see the whole page.</p></section>';
  }

  function render() {
    document.body.dataset.mode = state.mode;
    document.body.dataset.tree = state.walk.tree;
    var html = state.mode === "board" ? renderBoard() : state.mode === "walk" ? renderWalk() : state.mode === "order" ? renderOrder() : state.mode === "bench" ? renderBench() : state.mode === "pages" ? renderPages() : state.mode === "common" ? renderCommon() : renderRecord();
    document.getElementById("stage").innerHTML = html;
    document.querySelectorAll(".mode").forEach(function (b) {
      var on = b.dataset.mode === state.mode;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-current", on ? "page" : "false");
    });
    applyFilter();
    paintMap();
    updateMeters();
    if (focusQ) {
      var h = document.getElementById("q-title");
      if (h) h.focus();
      focusQ = false;
    }
    if (scrollParts) {
      var p = document.getElementById("parts");
      if (p) p.scrollIntoView({ block: "start" });
      scrollParts = false;
    }
    if (scrollPage) {
      var fig = document.querySelector(".sheetpage");
      if (fig) fig.scrollIntoView({ block: "start" });
      scrollPage = false;
    }
    if (scrollLib) {
      var libTitle = document.querySelector("#stage h1");
      if (libTitle) libTitle.scrollIntoView({ block: "start" });
      scrollLib = false;
    }
  }

  function paintMap() {
    if (state.mode !== "bench") return;
    var paths = state.bench.map === "exhaust" ? EX_PATH : HOSE_PATH;
    var hot = paths[state.bench.node] || [];
    document.querySelectorAll("[data-wire]").forEach(function (el) {
      el.classList.toggle("is-hot", hot.indexOf(el.getAttribute("data-wire")) >= 0);
    });
  }

  function applyFilter() {
    var q = (document.getElementById("q").value || "").trim().toLowerCase();
    var items = document.querySelectorAll("#stage [data-find]");
    var shown = 0;
    items.forEach(function (el) {
      var ok = true;
      if (el.classList.contains("qcard") && state.mode === "board" && hazardOn()) {
        el.hidden = false;
        shown += 1;
        return;
      }
      if (el.classList.contains("part") && state.bench.filter !== "all" && el.dataset.kind !== state.bench.filter) ok = false;
      if (ok && q) {
        var hay = ((el.dataset.find || "") + " " + el.textContent).toLowerCase();
        ok = hay.indexOf(q) >= 0;
      }
      el.hidden = !ok;
      if (ok) shown += 1;
    });
    var empty = document.getElementById("empty-search");
    if (empty) empty.hidden = !(q && items.length > 0 && shown === 0);
  }

  function updateChrome() {
    document.body.classList.toggle("hazard-lock", hazardOn());
    var g = document.getElementById("haz-glow");
    var o = document.getElementById("haz-oil");
    g.setAttribute("aria-pressed", state.hazardGlow ? "true" : "false");
    o.setAttribute("aria-pressed", state.hazardOil ? "true" : "false");
    g.classList.toggle("is-on", state.hazardGlow);
    o.classList.toggle("is-on", state.hazardOil);
    var banner = document.getElementById("banner");
    banner.hidden = !hazardOn();
    var which = [];
    if (state.hazardGlow) which.push("Manifold is glowing.");
    if (state.hazardOil) which.push("Oil is on the exhaust or a sensor.");
    document.getElementById("banner-which").textContent = which.join(" ");
    document.getElementById("banner-lock").textContent = lockFlash || "Locked while this is on: repair steps 7, 8, 11, and 12, verify with a drive, and marking codes cleared.";
  }
  function refuse(msg) {
    lockFlash = msg;
    updateChrome();
  }
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function setChip(id, info) {
    var el = document.getElementById(id);
    if (!el) return;
    el.className = "tag " + info.kind;
    el.textContent = info.chip;
  }
  function updateMeters() {
    var rpm = classRpm(state.meter.rpm, state.meter.cold);
    var iac = classIac(state.meter.iac);
    var heat = classHeater(state.meter.heater, state.meter.heaterTemp);
    var vac = classVac(state.meter.vac, state.meter.flicker);
    setChip("chip-rpm", rpm); setText("say-rpm", rpm.sentence);
    setChip("chip-iac", iac); setText("say-iac", iac.sentence);
    setChip("chip-heat", heat); setText("say-heat", heat.sentence);
    setChip("chip-vac", vac); setText("say-vac", vac.sentence);
    var dock = document.getElementById("dock");
    if (dock) {
      dock.innerHTML = '<button type="button" data-act="dock" aria-pressed="' + (document.body.classList.contains("meter-open") ? "true" : "false") + '">' +
        chip(rpm.kind, "RPM " + rpm.chip) + chip(iac.kind, "IAC " + iac.chip) + chip(heat.kind, "HEAT " + heat.chip) + chip(vac.kind, "VAC " + vac.chip) + "</button>";
    }
    var cold = document.getElementById("m-cold");
    var flick = document.getElementById("m-flick");
    if (cold && document.activeElement !== cold) cold.checked = !!state.meter.cold;
    if (flick && document.activeElement !== flick) flick.checked = !!state.meter.flicker;
    ["m-rpm", "m-iac", "m-pair", "m-heat", "m-vac"].forEach(function (id) {
      var el = document.getElementById(id);
      var key = el && el.dataset.meter;
      if (!el || !key || document.activeElement === el) return;
      var v = state.meter[key] || "";
      if (el.value !== v) el.value = v;
    });
    document.querySelectorAll('[data-act="heater-temp"]').forEach(function (b) {
      var on = b.dataset.temp === state.meter.heaterTemp;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.classList.toggle("is-on", on);
    });
    document.querySelectorAll("[data-live]").forEach(function (el) {
      var info = el.dataset.live === "rpm" ? rpm : el.dataset.live === "iac" ? iac : heat;
      el.innerHTML = chip(info.kind, info.chip) + " " + esc(info.sentence);
    });
    var next = document.getElementById("next-btn");
    if (next && next.dataset.need === "heater") {
      var ready = state.meter.heaterTemp === "cold" && heaterBand(state.meter.heater, "cold") !== "empty";
      next.disabled = !ready;
    }
    var drive = document.querySelector("[data-act='drive-verify']");
    if (drive) {
      var driveOk = !hazardOn() && rpm.chip === "IN SCREEN";
      drive.setAttribute("aria-disabled", driveOk ? "false" : "true");
      var note = document.getElementById("drive-note");
      if (note) note.textContent = rpm.sentence + (rpm.chip === "IN SCREEN" ? " Park, loads off, is the screen. A drive is a separate result." : " Go back to smoke, the plate, and the IAC O-ring. Do not buy a second motor yet.");
      var why = document.getElementById("drive-why");
      if (why) {
        why.hidden = driveOk;
        why.textContent = hazardOn() ? "Verify with a drive is refused while a hazard is on." : "Idle is not in the 700–800 screen. Do not use a drive to paper over it.";
      }
    }
    if (state.mode === "order") {
      var box = document.getElementById("finish");
      if (box) box.outerHTML = finishHtml();
    }
  }

  function goNext(tree, id) {
    var w = state.walk[tree];
    var i = w.trail.lastIndexOf(w.step);
    w.trail = w.trail.slice(0, i + 1);
    w.trail.push(id);
    w.step = id;
    if (tree === "p0505" && id === "pintle" && !w.answers.pintle) w.answers.pintle = "yes";
  }
  function nextId(tree) {
    var w = state.walk[tree];
    var a = w.answers;
    var id = w.step;
    if (tree === "p0505") {
      if (id === "start") return "idle";
      if (id === "idle") return a.idle === "yes" ? "vac" : a.idle === "no" ? "elec" : "";
      if (id === "vac") return a.vac ? "coils" : "";
      if (id === "coils") return a.coils ? "pintle" : "";
      if (id === "pintle") return a.pintle ? "replace" : "";
      if (id === "replace") return a.replace ? "clean" : "";
      if (id === "clean") return a.clean ? "relearn" : "";
      if (id === "relearn") return a.relearn === "done" ? "verify" : "";
      if (id === "elec") return a.p1294 === "yes" ? "vac" : a.p1294 === "no" ? "wiggle" : "";
      if (id === "wiggle") return a.wiggle ? "circuit" : "";
      return "";
    }
    if (id === "stored") return a.stored === "yes" ? "oil" : a.stored === "no" ? "endno" : "";
    if (id === "oil") return a.oil === "yes" ? "endoil" : a.oil === "no" ? "connector" : "";
    if (id === "connector") return a.connector ? "fuse" : "";
    if (id === "fuse") return a.fuse ? "ohms" : "";
    if (id === "ohms") return (state.meter.heaterTemp === "cold" && heaterBand(state.meter.heater, "cold") !== "empty") ? "power" : "";
    if (id === "power") return a.power ? "control" : "";
    if (id === "control") return a.control ? "result" : "";
    return "";
  }

  function maybeJump() {
    if (state.mode !== "board") return false;
    var q = (document.getElementById("q").value || "").trim().toLowerCase();
    if (q.length < 4) return false;
    var hit = null;
    JUMPS.some(function (j) { if (j.test.test(q)) { hit = j; return true; } return false; });
    if (!hit) return false;
    var before = state.mode + state.common.id + state.walk.tree + state.walk[state.walk.tree].step + state.bench.map + state.bench.node + state.bench.filter;
    if (hit.page) {
      state.mode = "common";
      state.common.id = libPage(hit.page) ? hit.page : "";
      scrollLib = true;
    } else state.mode = hit.mode;
    if (hit.tree) {
      state.walk.tree = hit.tree;
      if (hit.step) {
        var w = state.walk[hit.tree];
        if (w.trail.indexOf(hit.step) < 0) w.trail.push(hit.step);
        w.step = hit.step;
        if (hit.step === "pintle" && !w.answers.pintle) w.answers.pintle = "yes";
      }
    }
    if (hit.map) state.bench.map = hit.map;
    if (hit.node) state.bench.node = hit.node;
    if (hit.filter) state.bench.filter = hit.filter;
    if (hit.part) scrollParts = true;
    var after = state.mode + state.common.id + state.walk.tree + state.walk[state.walk.tree].step + state.bench.map + state.bench.node + state.bench.filter;
    if (before === after) return false;
    var search = document.getElementById("q");
    if (search) search.value = "";
    save();
    return true;
  }

  function onClick(e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var act = b.dataset.act;
    if (act === "hazard") {
      if (b.dataset.which === "glow") state.hazardGlow = !state.hazardGlow;
      else state.hazardOil = !state.hazardOil;
      if (!hazardOn()) lockFlash = "";
      save();
      updateChrome();
      render();
      return;
    }
    if (act === "mode") {
      document.body.classList.remove("meter-open");
      state.mode = b.dataset.mode;
      if (state.mode === "common") state.common.id = "";
      save();
      render();
      return;
    }
    if (act === "lib") {
      document.body.classList.remove("meter-open");
      state.mode = "common";
      state.common.id = libPage(b.dataset.id) ? b.dataset.id : "";
      scrollLib = true;
      save();
      render();
      return;
    }
    if (act === "goto") {
      document.body.classList.remove("meter-open");
      state.mode = b.dataset.mode;
      if (b.dataset.tree) state.walk.tree = b.dataset.tree;
      if (b.dataset.map) state.bench.map = b.dataset.map;
      if (b.dataset.filter) state.bench.filter = b.dataset.filter;
      if (b.dataset.node) state.bench.node = b.dataset.node;
      if (b.dataset.part) scrollParts = true;
      save();
      render();
      return;
    }
    if (act === "clear-search") {
      document.getElementById("q").value = "";
      applyFilter();
      document.getElementById("q").focus();
      return;
    }
    if (act === "clear-notes") {
      if (!window.confirm("Clear this truck's notes? Hazard toggles, the walk, the repair order, the meters, and the test record on this browser will be wiped.")) return;
      state = fresh();
      orderWarn = "";
      lockFlash = "";
      try { localStorage.removeItem(KEY); } catch (err) { /* ignore */ }
      document.getElementById("q").value = "";
      updateChrome();
      render();
      return;
    }
    if (act === "tree") {
      state.walk.tree = b.dataset.tree;
      save();
      focusQ = true;
      render();
      return;
    }
    if (act === "back") {
      var w = state.walk[state.walk.tree];
      if (w.trail.length < 2) return;
      w.trail.pop();
      w.step = w.trail[w.trail.length - 1];
      while (state.hazardOil && !state.hazardGlow && state.walk.tree === "p0505" && (w.step === "relearn" || w.step === "verify") && w.trail.length > 1) {
        w.trail.pop();
        w.step = w.trail[w.trail.length - 1];
      }
      save();
      focusQ = true;
      render();
      return;
    }
    if (act === "restart") {
      var t = state.walk.tree;
      var first = t === "p0505" ? "start" : "stored";
      state.walk[t] = { step: first, trail: [first], answers: {} };
      save();
      focusQ = true;
      render();
      return;
    }
    if (act === "crumb") {
      var w2 = state.walk[state.walk.tree];
      var idx = w2.trail.indexOf(b.dataset.step);
      if (idx < 0) return;
      w2.trail = w2.trail.slice(0, idx + 1);
      w2.step = b.dataset.step;
      save();
      focusQ = true;
      render();
      return;
    }
    if (act === "choose") {
      var w3 = state.walk[state.walk.tree];
      if (state.walk.tree === "p0161" && w3.step === "oil" && b.dataset.choice === "no" && state.hazardOil) {
        refuse("Oil is on the exhaust or a sensor. The dry answer is refused. Guide 06. Turning the hazard off does not mark the leak fixed.");
        return;
      }
      if (state.walk.tree === "p0505" && w3.step === "relearn" && b.dataset.choice === "done" && !relearnReady(w3.answers)) return;
      w3.answers[b.dataset.key] = b.dataset.choice;
      save();
      render();
      var again = document.querySelector('[data-choice="' + b.dataset.choice + '"]');
      if (again) again.focus();
      return;
    }
    if (act === "next") {
      var tree = state.walk.tree;
      var nxt = nextId(tree);
      if (!nxt) return;
      if (tree === "p0505" && state.hazardGlow) {
        refuse("Manifold is glowing. This tree stays stopped. Key off. Do not drive it.");
        return;
      }
      if (tree === "p0505" && state.hazardOil && (nxt === "relearn" || nxt === "verify")) {
        refuse("Oil is on the exhaust or a sensor. Verify with a drive is refused until that hazard is off.");
        goNext(tree, nxt);
        save();
        focusQ = true;
        render();
        return;
      }
      goNext(tree, nxt);
      save();
      focusQ = true;
      render();
      return;
    }
    if (act === "drive-verify") {
      if (hazardOn()) {
        refuse("Verify with a drive is refused while a hazard is on. Cool completely. Do not drive it.");
        return;
      }
      var rpm = classRpm(state.meter.rpm, state.meter.cold);
      if (rpm.chip !== "IN SCREEN") {
        refuse("Verify with a drive is refused. Warm idle is not in the 700–800 screen. Go back to smoke. Do not buy a second motor yet.");
        return;
      }
      state.walk.p0505.answers.drive = "yes";
      save();
      render();
      return;
    }
    if (act === "heater-temp") {
      state.meter.heaterTemp = b.dataset.temp === "hot" ? "hot" : "cold";
      save();
      updateMeters();
      if (state.mode === "walk" && state.walk.tree === "p0161" && state.walk.p0161.step === "ohms") {
        var nb = document.getElementById("next-btn");
        if (nb) {
          var ready = state.meter.heaterTemp === "cold" && heaterBand(state.meter.heater, "cold") !== "empty";
          nb.disabled = !ready;
        }
      }
      return;
    }
    if (act === "step") {
      var i = Number(b.dataset.step);
      var locked = hazardOn() && LOCK_STEPS[i];
      if (locked) {
        refuse("Step " + (i + 1) + " stays locked while a hazard is on. Cool completely. Do not drive it. Turning the hazard off does not mark it done.");
        return;
      }
      var turningOn = !state.order[i];
      if (turningOn) {
        var earlier = [];
        for (var j = 0; j < i; j++) if (!state.order[j]) earlier.push(j + 1);
        orderWarn = earlier.length ? "Step " + earlier[0] + " is still open. Step " + (i + 1) + " was checked out of order. The sheet wants the earlier step first. The check was kept." : "";
      } else orderWarn = "";
      state.order[i] = turningOn;
      save();
      render();
      return;
    }
    if (act === "node") {
      state.bench.node = b.dataset.node;
      save();
      render();
      var nb2 = document.querySelector('[data-node="' + b.dataset.node + '"]');
      if (nb2) nb2.focus();
      return;
    }
    if (act === "map") {
      state.bench.map = b.dataset.map;
      var ids = (state.bench.map === "hoses" ? HOSE_LAYOUT : EX_LAYOUT).map(function (n) { return n.id; });
      if (ids.indexOf(state.bench.node) < 0) state.bench.node = "";
      save();
      render();
      return;
    }
    if (act === "filter") {
      state.bench.filter = b.dataset.filter;
      save();
      render();
      return;
    }
    if (act === "open-guide") {
      document.body.classList.remove("meter-open");
      var gid = b.dataset.guide || "";
      state.mode = "pages";
      state.pages.guide = guideById(gid) ? gid : "";
      state.pages.n = 1;
      save();
      render();
      return;
    }
    if (act === "page") {
      var pg = guideById(state.pages.guide);
      if (!pg) return;
      var pn = state.pages.n + (Number(b.dataset.dir) || 0);
      if (pn < 1 || pn > pg.n) return;
      state.pages.n = pn;
      scrollPage = true;
      save();
      render();
      return;
    }
    if (act === "recheck") {
      var wr = state.walk.p0505;
      if (!wr.answers.relearnBox || typeof wr.answers.relearnBox !== "object") wr.answers.relearnBox = {};
      var box = wr.answers.relearnBox;
      var rkey = b.dataset.key;
      if (b.dataset.val) box[rkey] = box[rkey] === b.dataset.val ? "" : b.dataset.val;
      else box[rkey] = !box[rkey];
      if (wr.answers.relearn === "done" && !relearnReady(wr.answers)) wr.answers.relearn = "";
      save();
      focusQ = true;
      render();
      return;
    }
    if (act === "dock") {
      document.body.classList.toggle("meter-open");
      updateMeters();
      return;
    }
    if (act === "pull-meter") {
      var mtr = state.meter;
      if (mtr.rpm) state.record.warmRpm = mtr.rpm;
      if (mtr.iac) state.record.iacOhms = mtr.iac + (mtr.pair ? " (" + mtr.pair + ")" : "");
      if (mtr.heater) state.record.heaterOhms = mtr.heater + (mtr.heaterTemp === "hot" ? " (hot, invalid)" : " (cold)");
      if (mtr.vac) state.record.vacuum = mtr.vac + (mtr.flicker ? " flicker" : "");
      save();
      render();
      var pulled = document.getElementById("copy-status");
      if (pulled) pulled.textContent = "Meter readings are in the form. A hot heater number is marked invalid.";
      return;
    }
    if (act === "copy-notes") {
      var noteStatus = document.getElementById("copy-status");
      var noteText = briefText();
      function noteMark(msg) { if (noteStatus) noteStatus.textContent = msg; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(noteText).then(function () { noteMark("Copied. Paste it into WhatsApp."); }).catch(function () { noteMark("Clipboard blocked."); });
      } else noteMark("Clipboard blocked.");
      return;
    }
    if (act === "copy") {
      var status = document.getElementById("copy-status");
      var ta = document.getElementById("counter-text");
      function mark(msg) { if (status) status.textContent = msg; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(COUNTER).then(function () { mark("Copied."); }).catch(function () {
          ta.focus();
          ta.select();
          try {
            mark(document.execCommand("copy") ? "Copied." : "Clipboard blocked. The script is selected — copy it from the box.");
          } catch (err) {
            mark("Clipboard blocked. The script is selected — copy it from the box.");
          }
        });
      } else {
        ta.focus();
        ta.select();
        try { mark(document.execCommand("copy") ? "Copied." : "Select the script and copy it."); }
        catch (err2) { mark("Select the script and copy it."); }
      }
      return;
    }
    if (act === "rec-yn") {
      var key = b.dataset.key;
      var val = b.dataset.val;
      if (key === "cleared" && val === "yes" && hazardOn()) {
        refuse("Marking codes cleared is refused while a hazard is on. Freeze frame is gone once you clear. Do not drive it.");
        return;
      }
      state.record[key] = state.record[key] === val ? "" : val;
      save();
      render();
      return;
    }
  }

  function onInput(e) {
    var t = e.target;
    if (t.id === "q") {
      if (maybeJump()) render();
      else applyFilter();
      return;
    }
    if (t.dataset.meter) {
      var key = t.dataset.meter;
      if (t.type === "checkbox") state.meter[key] = t.checked;
      else state.meter[key] = t.value;
      document.querySelectorAll('[data-meter="' + key + '"]').forEach(function (el) {
        if (el === t) return;
        if (el.type === "checkbox") el.checked = t.type === "checkbox" ? t.checked : !!state.meter[key];
        else if (document.activeElement !== el) el.value = state.meter[key];
      });
      save();
      updateMeters();
      return;
    }
    if (t.dataset.rec) {
      state.record[t.dataset.rec] = t.value;
      save();
    }
  }

  function onKey(e) {
    if (state.mode === "pages" && state.pages.guide && (e.key === "ArrowRight" || e.key === "ArrowLeft") && !e.target.closest("input, textarea")) {
      var gk = guideById(state.pages.guide);
      if (!gk) return;
      var nk = state.pages.n + (e.key === "ArrowRight" ? 1 : -1);
      if (nk < 1 || nk > gk.n) return;
      e.preventDefault();
      state.pages.n = nk;
      scrollPage = true;
      save();
      render();
      return;
    }
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    var nodes = Array.prototype.slice.call(document.querySelectorAll(".map-nodes .node"));
    var i = nodes.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    var dir = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : -1;
    nodes[(i + dir + nodes.length) % nodes.length].focus();
  }

  var swipeX = null;
  document.addEventListener("touchstart", function (e) {
    if (state.mode !== "pages" || !state.pages.guide || !e.target.closest(".sheetpage")) { swipeX = null; return; }
    swipeX = e.changedTouches[0].clientX;
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (swipeX == null) return;
    var dx = e.changedTouches[0].clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) < 48) return;
    var gs = guideById(state.pages.guide);
    if (!gs) return;
    var ns = state.pages.n + (dx < 0 ? 1 : -1);
    if (ns < 1 || ns > gs.n) return;
    state.pages.n = ns;
    scrollPage = true;
    save();
    render();
  }, { passive: true });

  state = load();
  document.getElementById("q").value = "";
  document.addEventListener("click", onClick);
  document.addEventListener("input", onInput);
  document.addEventListener("change", onInput);
  document.addEventListener("keydown", onKey);
  updateChrome();
  render();
})();
