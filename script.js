/**
 * 11-класс Физика - §22 "Токтун жумушу жана кубаттуулугу"
 * Интерактивдүү веб-тиркеменин JavaScript модулу.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------------------
  // 1. ТЕМА ЖАНА НАВИГАЦИЯ
  // ----------------------------------------------------
  const themeBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("physics_theme") || "light";
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (themeBtn) themeBtn.textContent = "☀️";
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      themeBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
      localStorage.setItem("physics_theme", newTheme);
    });
  }

  // Бөлүмдөр ортосунда өтүү
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".section");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-section");
      navButtons.forEach((b) => b.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      btn.classList.add("active");
      const targetSection = document.getElementById(target);
      if (targetSection) {
        targetSection.classList.add("active");
        targetSection.scrollIntoView({ behavior: "smooth" });

        // Эгер графика бөлүгү ачылса, размерди жана графикти жаңыртуу
        if (target === "graphs" && typeof resizeCanvas === "function") {
          setTimeout(() => {
            resizeCanvas();
            drawGraph();
          }, 50);
        }
      }
    });
  });

  // ----------------------------------------------------
  // 2. АНЫКТАМАЛАР (АККОРДЕОН КАРТОЧКАЛАР)
  // ----------------------------------------------------
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("open");
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("open");
      }
    });
  });

  // ----------------------------------------------------
  // 3. ФОРМУЛАЛАРДЫН КОРУТУНДУСУ (СТЕППЕР)
  // ----------------------------------------------------
  const derivationSteps = [
    {
      num: "22.1",
      formula: "A = Uq, &nbsp; q = It &rArr; A = UIt",
      text: "Туруктуу токтун чынжырдын бөлүгүндө аткарган жумушу: чыңалууну, ток күчүн жана убакытты көбөйткөнгө барабар.",
    },
    {
      num: "22.2",
      formula: "a = uit",
      text: "Өтө кыска убакыт (t) ичинде өзгөрмө токту туруктуу деп эсептеп, көз ирмемдеги жумушту (a) табабыз.",
    },
    {
      num: "22.3",
      formula: "u = U<sub>m</sub> cos ωt",
      text: "Гармоникалык мыйзам боюнча өзгөрмө чыңалуунун убакытка көз карандылыгы.",
    },
    {
      num: "22.4",
      formula: "i = I<sub>m</sub> cos(ωt + φ)",
      text: "Ток күчү да ошол эле жыштыкта өзгөрөт, бирок чыңалуудан φ фазалык бурчка жылышкан.",
    },
    {
      num: "22.5",
      formula:
        'P = <span class="fraction"><span class="numerator">A</span><span class="denominator">t</span></span> &nbsp; же &nbsp; P = UI',
      text: "Туруктуу токтун кубаттуулугу — бирдик убакытта аткарылган жумуш.",
    },
    {
      num: "22.6",
      formula: "p = ui",
      text: "Өзгөрмө токтун көз ирмемдеги кубаттуулугу — убакыттын берилген учурундагы u жана i маанилеринин көбөйтүндүсү.",
    },
    {
      num: "22.7",
      formula:
        'p = U<sub>m</sub>I<sub>m</sub> cos ωt · cos(ωt + φ)<br><small>Өзгөртүү: cos α · cos β = ½[cos(α−β) + cos(α+β)]</small><br>&rArr; p = <span class="fraction"><span class="numerator">U<sub>m</sub>I<sub>m</sub></span><span class="denominator">2</span></span> cos φ + <span class="fraction"><span class="numerator">U<sub>m</sub>I<sub>m</sub></span><span class="denominator">2</span></span> cos(2ωt + φ)',
      text: "Тригонометриялык формула аркылуу көз ирмемдеги кубаттуулукту эки мүчөнүн суммасына ажыратабыз.",
    },
    {
      num: "22.8",
      formula:
        'P̄ = <span class="fraction"><span class="numerator">U<sub>m</sub>I<sub>m</sub></span><span class="denominator">2</span></span> cos φ = <span class="fraction"><span class="numerator">U<sub>m</sub></span><span class="denominator">√2</span></span> · <span class="fraction"><span class="numerator">I<sub>m</sub></span><span class="denominator">√2</span></span> cos φ',
      text: "Мезгил ичиндеги орточо кубаттуулук. Экинчи мүчө cos(2ωt + φ) мезгил ичинде орточо нөлгө барабар.",
    },
    {
      num: "22.9",
      formula: "P = UI cos φ",
      text: "Өзгөрмө токтун толук активдүү кубаттуулугу. Мында U жана I — аракет этүүчү маанилер, ал эми cos φ — кубаттуулуктун коэффициенти.",
    },
  ];

  let currentStep = 0;
  const stepPrevBtn = document.getElementById("step-prev");
  const stepNextBtn = document.getElementById("step-next");
  const stepResetBtn = document.getElementById("step-reset");
  const stepCounter = document.getElementById("step-counter");
  const stepContent = document.getElementById("step-content");

  function renderStep() {
    if (!stepContent || !stepCounter) return;
    const step = derivationSteps[currentStep];
    stepCounter.textContent = `${currentStep + 1} / ${derivationSteps.length}`;
    stepContent.innerHTML = `
            <div class="highlight-formula">(${step.num}) &nbsp; ${step.formula}</div>
            <p style="font-size: 1.1rem; text-align: center;">${step.text}</p>
        `;
    if (stepPrevBtn) stepPrevBtn.disabled = currentStep === 0;
    if (stepNextBtn)
      stepNextBtn.disabled = currentStep === derivationSteps.length - 1;
  }

  if (stepPrevBtn)
    stepPrevBtn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    });
  if (stepNextBtn)
    stepNextBtn.addEventListener("click", () => {
      if (currentStep < derivationSteps.length - 1) {
        currentStep++;
        renderStep();
      }
    });
  if (stepResetBtn)
    stepResetBtn.addEventListener("click", () => {
      currentStep = 0;
      renderStep();
    });
  renderStep();

  // ----------------------------------------------------
  // 4. ИНТЕРАКТИВДҮҮ SVG ЭЛЕКТР СХЕМАСЫ
  // ----------------------------------------------------
  const switchBtn = document.getElementById("switch-btn");
  const switchStatus = document.getElementById("switch-status");
  const switchLine = document.getElementById("switch-line");
  const electronsGroup = document.getElementById("electrons-group");
  const electrons = document.querySelectorAll(".electron");
  let isCircuitClosed = false;
  let animFrameId = null;
  let electronPos = [0, 0.12, 0.25, 0.37, 0.5, 0.62, 0.75, 0.87];

  function getPointOnCircuit(t) {
    t = t % 1;
    if (t < 0) t += 1;
    let totalLen = 400 + 190 + 400 + 190;
    let dist = t * totalLen;
    if (dist < 400) return { x: 100 + dist, y: 80 };
    dist -= 400;
    if (dist < 190) return { x: 500, y: 80 + dist };
    dist -= 190;
    if (dist < 400) return { x: 500 - dist, y: 270 };
    dist -= 400;
    return { x: 100, y: 270 - dist };
  }

  function animateElectrons() {
    if (!isCircuitClosed) return;
    electronPos = electronPos.map((p) => (p + 0.005) % 1);
    electrons.forEach((el, index) => {
      let pt = getPointOnCircuit(electronPos[index]);
      el.setAttribute("cx", pt.x);
      el.setAttribute("cy", pt.y);
    });
    animFrameId = requestAnimationFrame(animateElectrons);
  }

  if (switchBtn) {
    switchBtn.addEventListener("click", () => {
      isCircuitClosed = !isCircuitClosed;
      if (isCircuitClosed) {
        switchBtn.textContent = "Ачкычты ач";
        if (switchStatus) {
          switchStatus.textContent = "Ачкыч жабык (Ток агып жатат)";
          switchStatus.className = "status-badge status-on";
        }
        if (switchLine) {
          switchLine.setAttribute("x2", "400");
          switchLine.setAttribute("y2", "270");
        }
        if (electronsGroup) electronsGroup.setAttribute("opacity", "1");
        animateElectrons();
      } else {
        switchBtn.textContent = "Ачкычты жап";
        if (switchStatus) {
          switchStatus.textContent = "Ачкыч ачык (Ток акпайт)";
          switchStatus.className = "status-badge status-off";
        }
        if (switchLine) {
          switchLine.setAttribute("x2", "385");
          switchLine.setAttribute("y2", "230");
        }
        if (electronsGroup) electronsGroup.setAttribute("opacity", "0");
        if (animFrameId) cancelAnimationFrame(animFrameId);
      }
    });
  }

  // ----------------------------------------------------
  // 5. CANVAS ГРАФИК АНИМАЦИЯСЫ
  // ----------------------------------------------------
  const canvas = document.getElementById("graph-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;

  const umSlider = document.getElementById("um-slider");
  const imSlider = document.getElementById("im-slider");
  const phiSlider = document.getElementById("phi-slider");
  const freqSlider = document.getElementById("freq-slider");

  const umVal = document.getElementById("um-val");
  const imVal = document.getElementById("im-val");
  const phiVal = document.getElementById("phi-val");
  const freqVal = document.getElementById("freq-val");

  const chkU = document.getElementById("chk-u");
  const chkI = document.getElementById("chk-i");
  const chkP = document.getElementById("chk-p");
  const chkPAvg = document.getElementById("chk-p-avg");

  const calcU = document.getElementById("calc-u");
  const calcI = document.getElementById("calc-i");
  const calcCos = document.getElementById("calc-cos");
  const calcP = document.getElementById("calc-p");
  const calcPRange = document.getElementById("calc-p-range");

  const playPauseBtn = document.getElementById("play-pause-btn");
  const resetGraphBtn = document.getElementById("reset-graph-btn");
  const presetBtns = document.querySelectorAll(".preset-btn");
  const presetInfo = document.getElementById("preset-info");

  let isPlaying = true;
  let timeOffset = 0;
  let graphAnimId = null;

  window.resizeCanvas = function () {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    if (ctx) ctx.scale(dpr, dpr);
  };

  window.addEventListener("resize", resizeCanvas);

  function updateCalculatedValues(Um, Im, phiDeg) {
    const U = Um / Math.SQRT2;
    const I = Im / Math.SQRT2;
    const phiRad = (phiDeg * Math.PI) / 180;
    const cosPhi = Math.cos(phiRad);
    const P = U * I * cosPhi;
    const pMax = ((Um * Im) / 2) * (1 + cosPhi);
    const pMin = ((Um * Im) / 2) * (-1 + cosPhi);

    if (calcU) calcU.textContent = U.toFixed(1);
    if (calcI) calcI.textContent = I.toFixed(1);
    if (calcCos) calcCos.textContent = cosPhi.toFixed(2);
    if (calcP) calcP.textContent = P.toFixed(1);
    if (calcPRange)
      calcPRange.textContent = `${pMax.toFixed(0)} / ${pMin.toFixed(0)}`;
  }

  window.drawGraph = function () {
    if (!canvas || !ctx) return;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    const Um = umSlider ? parseFloat(umSlider.value) : 311;
    const Im = imSlider ? parseFloat(imSlider.value) : 10;
    const phiDeg = phiSlider ? parseFloat(phiSlider.value) : 0;
    const freq = freqSlider ? parseFloat(freqSlider.value) : 2;
    const phiRad = (phiDeg * Math.PI) / 180;

    updateCalculatedValues(Um, Im, phiDeg);

    const centerY = height / 2;
    const scaleY =
      (height / 2 - 20) /
      (Um * Im > 0 ? Math.max(Um, Im * 15, (Um * Im) / 20) : 1);

    ctx.beginPath();
    ctx.strokeStyle = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--border-color");
    ctx.lineWidth = 1;
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    const stepX = 2;
    const omega = 2 * Math.PI * freq;

    if (chkP && chkP.checked) {
      for (let x = 0; x < width; x += stepX) {
        let t1 = (x / width) * (2 / freq) + timeOffset;
        let u1 = Um * Math.cos(omega * t1);
        let i1 = Im * Math.cos(omega * t1 + phiRad);
        let p1 = u1 * i1;
        let y1 = centerY - p1 * scaleY * 0.05;

        ctx.beginPath();
        ctx.moveTo(x, centerY);
        ctx.lineTo(x, y1);
        ctx.lineTo(x + stepX, y1);
        ctx.lineTo(x + stepX, centerY);
        ctx.closePath();
        ctx.fillStyle =
          p1 >= 0 ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)";
        ctx.fill();
      }
    }

    if (chkU && chkU.checked) {
      ctx.beginPath();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += stepX) {
        let t = (x / width) * (2 / freq) + timeOffset;
        let u = Um * Math.cos(omega * t);
        let y = centerY - u * scaleY;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    if (chkI && chkI.checked) {
      ctx.beginPath();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += stepX) {
        let t = (x / width) * (2 / freq) + timeOffset;
        let i = Im * Math.cos(omega * t + phiRad);
        let y = centerY - i * 10 * scaleY;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    if (chkP && chkP.checked) {
      ctx.beginPath();
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += stepX) {
        let t = (x / width) * (2 / freq) + timeOffset;
        let u = Um * Math.cos(omega * t);
        let i = Im * Math.cos(omega * t + phiRad);
        let p = u * i;
        let y = centerY - p * scaleY * 0.05;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    if (chkPAvg && chkPAvg.checked) {
      const U = Um / Math.SQRT2;
      const I = Im / Math.SQRT2;
      const Pavg = U * I * Math.cos(phiRad);
      const yAvg = centerY - Pavg * scaleY * 0.05;

      ctx.beginPath();
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.moveTo(0, yAvg);
      ctx.lineTo(width, yAvg);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  function loop() {
    if (isPlaying) {
      timeOffset += 0.003;
    }
    drawGraph();
    graphAnimId = requestAnimationFrame(loop);
  }

  function bindSlider(slider, display) {
    if (!slider || !display) return;
    slider.addEventListener("input", () => {
      display.textContent = slider.value;
      drawGraph();
    });
  }

  bindSlider(umSlider, umVal);
  bindSlider(imSlider, imVal);
  bindSlider(phiSlider, phiVal);
  bindSlider(freqSlider, freqVal);

  [chkU, chkI, chkP, chkPAvg].forEach((chk) => {
    if (chk) chk.addEventListener("change", drawGraph);
  });

  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      isPlaying = !isPlaying;
      playPauseBtn.textContent = isPlaying ? "Пауза" : "Ойнотуу";
    });
  }

  if (resetGraphBtn) {
    resetGraphBtn.addEventListener("click", () => {
      if (umSlider) {
        umSlider.value = 311;
        umVal.textContent = 311;
      }
      if (imSlider) {
        imSlider.value = 10;
        imVal.textContent = 10;
      }
      if (phiSlider) {
        phiSlider.value = 0;
        phiVal.textContent = 0;
      }
      if (freqSlider) {
        freqSlider.value = 2;
        freqVal.textContent = 2;
      }
      timeOffset = 0;
      drawGraph();
    });
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-preset");
      if (type === "res") {
        if (phiSlider) {
          phiSlider.value = 0;
          phiVal.textContent = 0;
        }
        if (presetInfo)
          presetInfo.textContent =
            "Активдүү каршылык (φ=0°): Ток менен чыңалуу бир фазада. Энергия толугу менен пайдалуу сарпталат (P̄ > 0).";
      } else if (type === "ind") {
        if (phiSlider) {
          phiSlider.value = -90;
          phiVal.textContent = -90;
        }
        if (presetInfo)
          presetInfo.textContent =
            "Таза индуктивдүүлүк (φ=−90°): Ток чыңалуудан 90° калат. Орточо кубаттуулук P̄ = 0.";
      } else if (type === "cap") {
        if (phiSlider) {
          phiSlider.value = 90;
          phiVal.textContent = 90;
        }
        if (presetInfo)
          presetInfo.textContent =
            "Таза сыйымдуулук (φ=+90°): Ток чыңалуудан 90° озот. Орточо кубаттуулук P̄ = 0.";
      }
      drawGraph();
    });
  });

  setTimeout(() => {
    resizeCanvas();
    loop();
  }, 200);

  // ----------------------------------------------------
  // 6. КАЛЬКУЛЯТОР ЖАНА БИРДИКТЕР
  // ----------------------------------------------------
  const calcTabBtns = document.querySelectorAll(".calc-tab-btn");
  const calcModes = document.querySelectorAll(".calc-mode-content");

  calcTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      calcTabBtns.forEach((b) => b.classList.remove("active"));
      calcModes.forEach((m) => m.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.getAttribute("data-tab");
      const modeEl = document.getElementById(target);
      if (modeEl) modeEl.classList.add("active");
    });
  });

  const calcWorkBtn = document.getElementById("calc-work-btn");
  const calcPowerBtn = document.getElementById("calc-power-btn");
  const calcError = document.getElementById("calc-error");
  const calcResult = document.getElementById("calc-result");

  function showError(msg) {
    if (!calcError || !calcResult) return;
    calcError.textContent = msg;
    calcError.style.display = "block";
    calcResult.style.display = "none";
  }

  function showResult(html) {
    if (!calcError || !calcResult) return;
    calcError.style.display = "none";
    calcResult.innerHTML = html;
    calcResult.style.display = "block";
  }

  if (calcWorkBtn) {
    calcWorkBtn.addEventListener("click", () => {
      const U = parseFloat(document.getElementById("work-u").value);
      const I = parseFloat(document.getElementById("work-i").value);
      const t = parseFloat(document.getElementById("work-t").value);

      if (isNaN(U) || isNaN(I) || isNaN(t)) {
        showError("Ката: Бардык талааларды сандар менен толтуруңуз!");
        return;
      }
      if (U < 0 || I < 0 || t < 0) {
        showError("Ката: Терс сандарды киргизүүгө болбойт!");
        return;
      }

      const A = U * I * t;
      const kJ = A / 1000;
      showResult(`
                <h4>Эсептөө кадамдары (A = UIt):</h4>
                <p>1) Көбөйтүү: A = ${U} В × ${I} А × ${t} с</p>
                <p>2) Жыйынтык: <strong>A = ${A.toFixed(2)} Дж</strong> (${kJ.toFixed(3)} кДж)</p>
            `);
    });
  }

  const inputModeRadios = document.querySelectorAll('input[name="input-mode"]');
  const labelU = document.getElementById("label-u");
  const labelI = document.getElementById("label-i");

  inputModeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "amplitude") {
        if (labelU)
          labelU.innerHTML = "Амплитудалык чыңалуу U<sub>m</sub> (В):";
        if (labelI)
          labelI.innerHTML = "Амплитудалык ток күчү I<sub>m</sub> (А):";
      } else {
        if (labelU) labelU.innerHTML = "Аракет этүүчү чыңалуу U (В):";
        if (labelI) labelI.innerHTML = "Аракет этүүчү ток күчү I (А):";
      }
    });
  });

  if (calcPowerBtn) {
    calcPowerBtn.addEventListener("click", () => {
      const valU = parseFloat(document.getElementById("power-u").value);
      const valI = parseFloat(document.getElementById("power-i").value);
      const phiDeg = parseFloat(document.getElementById("power-phi").value);
      const isAmplitude =
        document.querySelector('input[name="input-mode"]:checked').value ===
        "amplitude";

      if (isNaN(valU) || isNaN(valI) || isNaN(phiDeg)) {
        showError("Ката: Бардык талааларды туура толтуруңуз!");
        return;
      }
      if (valU < 0 || valI < 0) {
        showError("Ката: Чыңалуу жана ток терс боло албайт!");
        return;
      }

      let U, I, Um, Im;
      if (isAmplitude) {
        Um = valU;
        Im = valI;
        U = Um / Math.SQRT2;
        I = Im / Math.SQRT2;
      } else {
        U = valU;
        I = valI;
        Um = U * Math.SQRT2;
        Im = I * Math.SQRT2;
      }

      const phiRad = (phiDeg * Math.PI) / 180;
      const cosPhi = Math.cos(phiRad);
      const P = U * I * cosPhi;

      showResult(`
                <h4>Эсептөө кадамдары (P = UI cos φ):</h4>
                <p>1) Аракет этүүчү маанилер: U = ${U.toFixed(1)} В, I = ${I.toFixed(1)} А</p>
                <p>2) Кубаттуулуктун коэффициенти: cos(${phiDeg}°) = ${cosPhi.toFixed(3)}</p>
                <p>3) Жыйынтык: P = ${U.toFixed(1)} × ${I.toFixed(1)} × ${cosPhi.toFixed(3)} = <strong>${P.toFixed(2)} Вт</strong></p>
            `);
    });
  } // ----------------------------------------------------
  // 7. БИРДИКТЕРДИ КОТОРУУ
  // ----------------------------------------------------
  const unit1Input = document.getElementById("unit-val-1");
  const unit2Input = document.getElementById("unit-val-2");
  const selectUnit1 = document.getElementById("select-unit-1");
  const selectUnit2 = document.getElementById("select-unit-2");
  const swapUnitsBtn = document.getElementById("swap-units-btn");

  const unitFactors = {
    W: 1,
    gW: 100,
    kW: 1000,
  };

  function convertUnits(fromFirst) {
    if (!unit1Input || !unit2Input || !selectUnit1 || !selectUnit2) return;
    const u1 = selectUnit1.value;
    const u2 = selectUnit2.value;

    if (fromFirst) {
      const val1 = parseFloat(unit1Input.value);
      if (isNaN(val1)) {
        unit2Input.value = "";
        return;
      }
      const watts = val1 * unitFactors[u1];
      const result = watts / unitFactors[u2];
      unit2Input.value = result.toFixed(4).replace(/\.?0+$/, "");
    } else {
      const val2 = parseFloat(unit2Input.value);
      if (isNaN(val2)) {
        unit1Input.value = "";
        return;
      }
      const watts = val2 * unitFactors[u2];
      const result = watts / unitFactors[u1];
      unit1Input.value = result.toFixed(4).replace(/\.?0+$/, "");
    }
  }

  if (unit1Input)
    unit1Input.addEventListener("input", () => convertUnits(true));
  if (unit2Input)
    unit2Input.addEventListener("input", () => convertUnits(false));
  if (selectUnit1)
    selectUnit1.addEventListener("change", () => convertUnits(true));
  if (selectUnit2)
    selectUnit2.addEventListener("change", () => convertUnits(true));

  if (swapUnitsBtn) {
    swapUnitsBtn.addEventListener("click", () => {
      const tempUnit = selectUnit1.value;
      selectUnit1.value = selectUnit2.value;
      selectUnit2.value = tempUnit;
      convertUnits(true);
    });
  }

  // ----------------------------------------------------
  // 8. ТЕСТ ЖАНА LOCALSTORAGE
  // ----------------------------------------------------
  const quizQuestions = [
    {
      q: "1. Чынжырдын бөлүгүндөгү турактуу токтун жумушу эмнеге барабар?",
      opts: ["A = UIt", "A = UI/t", "A = I²Rt²", "A = U/I"],
      ans: 0,
      exp: "Китеп боюнча (22.1) формуласы: A = Uq, q = It болгондуктан A = UIt.",
    },
    {
      q: "2. Токтун кубаттуулугу кандай аныкталат?",
      opts: ["P = A · t", "P = A / t же P = UI", "P = U / I", "P = I² / R"],
      ans: 1,
      exp: "Кубаттуулук жумуштун ал аткарылган убакытка болгон катышы катары аныкталат (22.5).",
    },
    {
      q: "3. Орточо кубаттуулук кантип аныкталат?",
      opts: ["P = U_m I_m", "P = UI cos φ", "P = UI sin φ", "P = u · i"],
      ans: 1,
      exp: "(22.9) формуласы боюнча өзгөрмө токтун орточо кубаттуулугу P = UI cos φ.",
    },
    {
      q: "4. Кубаттуулуктун СИ системасындагы бирдиги кандай?",
      opts: ["1 Джоуль (Дж)", "1 Ватт (Вт)", "1 Ампер (А)", "1 Вольт (В)"],
      ans: 1,
      exp: "Кубаттуулуктун бирдиги Вт (Ватт). 1 Вт = 1 А · 1 В.",
    },
    {
      q: "5. Кубаттуулуктун коэффициенти деген эмне?",
      opts: ["sin φ", "tg φ", "cos φ", "ctg φ"],
      ans: 2,
      exp: "Чыңалуу менен токтун ортосундагы фазалык жылышуунун косинусу (cos φ) кубаттуулуктун коэффициенти деп аталат.",
    },
    {
      q: "6. (Эсеп) Чыңалуу 220 В, ток күчү 5 А болгон чынжырда 10 секундда токтун аткарган жумушун тапкыла.",
      opts: ["1100 Дж", "11000 Дж", "2200 Дж", "5500 Дж"],
      ans: 1,
      exp: "A = UIt = 220 В × 5 А × 10 с = 11000 Дж (11 кДж).",
    },
    {
      q: "7. (Эсеп) Чыңалуунун амплитудасы U_m = 141.4 В болсо, анын аракет этүүчү мааниси U канчага барабар?",
      opts: ["200 В", "100 В", "141.4 В", "70.7 В"],
      ans: 1,
      exp: "U = U_m / √2 = 141.4 / 1.414 = 100 В.",
    },
    {
      q: "8. (Эсеп) Активдүү каршылыкта (φ = 0°) U = 220 В жана I = 2 А болсо, орточо кубаттуулук канча болот?",
      opts: ["0 Вт", "440 Вт", "220 Вт", "880 Вт"],
      ans: 1,
      exp: "cos(0°) = 1. P = UI cos φ = 220 × 2 × 1 = 440 Вт.",
    },
    {
      q: "9. (Эсеп) Таза индуктивдүү чынжырда (φ = −90°) орточо кубаттуулук неге барабар?",
      opts: ["P = UI", "P = 0", "P = UI / 2", "P = -UI"],
      ans: 1,
      exp: "cos(−90°) = 0, ошондуктан орточо кубаттуулук P = UI × 0 = 0 Вт болот.",
    },
    {
      q: "10. (Эсеп) 1 кВт канча гектоватка (гВт) барабар?",
      opts: ["100 гВт", "10 гВт", "1000 гВт", "0.1 гВт"],
      ans: 1,
      exp: "1 кВт = 1000 Вт, ал эми 1 гВт = 100 Вт. Демек, 1 кВт = 10 гВт.",
    },
  ];

  const quizList = document.getElementById("quiz-list");
  const submitQuizBtn = document.getElementById("submit-quiz-btn");
  const resetQuizBtn = document.getElementById("reset-quiz-btn");
  const quizResultCard = document.getElementById("quiz-result-card");

  function renderQuiz() {
    if (!quizList) return;
    quizList.innerHTML = "";
    quizQuestions.forEach((qItem, qIdx) => {
      const qDiv = document.createElement("div");
      qDiv.className = "quiz-q-card";

      let optionsHtml = "";
      qItem.opts.forEach((opt, oIdx) => {
        optionsHtml += `
                    <label class="option-label">
                        <input type="radio" name="q_${qIdx}" value="${oIdx}">
                        ${opt}
                    </label>
                `;
      });

      qDiv.innerHTML = `
                <p><strong>${qItem.q}</strong></p>
                <div class="quiz-options">${optionsHtml}</div>
                <div id="exp_${qIdx}" class="quiz-explanation"></div>
            `;
      quizList.appendChild(qDiv);
    });

    const savedScore = localStorage.getItem("physics_quiz_score");
    if (savedScore && quizResultCard) {
      quizResultCard.style.display = "block";
      quizResultCard.innerHTML = `<p>Акыркы сакталган жыйынтык: <strong>${savedScore} / ${quizQuestions.length}</strong> упай.</p>`;
    }
  }

  if (submitQuizBtn) {
    submitQuizBtn.addEventListener("click", () => {
      let score = 0;
      quizQuestions.forEach((qItem, qIdx) => {
        const selected = document.querySelector(
          `input[name="q_${qIdx}"]:checked`,
        );
        const expEl = document.getElementById(`exp_${qIdx}`);

        if (selected) {
          const userAns = parseInt(selected.value, 10);
          if (userAns === qItem.ans) {
            score++;
            if (expEl) {
              expEl.textContent = "Туура! " + qItem.exp;
              expEl.className = "quiz-explanation correct";
            }
          } else {
            if (expEl) {
              expEl.textContent = "Туура эмес! " + qItem.exp;
              expEl.className = "quiz-explanation incorrect";
            }
          }
        } else {
          if (expEl) {
            expEl.textContent = "Жооп тандалган жок. " + qItem.exp;
            expEl.className = "quiz-explanation incorrect";
          }
        }
      });

      localStorage.setItem("physics_quiz_score", score);
      if (quizResultCard) {
        quizResultCard.style.display = "block";
        quizResultCard.innerHTML = `<h3>Сиздин жыйынтык: ${score} / ${quizQuestions.length} упай!</h3>`;
      }
    });
  }

  if (resetQuizBtn) {
    resetQuizBtn.addEventListener("click", () => {
      localStorage.removeItem("physics_quiz_score");
      if (quizResultCard) quizResultCard.style.display = "none";
      renderQuiz();
    });
  }

  renderQuiz();
});