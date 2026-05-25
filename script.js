document.addEventListener("DOMContentLoaded", () => {
  const BASE_FILE = "base/base.png";

  const PARTS = [
    {
      key: "door",
      jp: "上台戸板",
      layerId: "layer-door",
      selId: "sel-door",
      options: [
        { id: "normal", label: "通常", file: "door/door_normal.png" },
        { id: "oborozakura", label: "おぼろ桜", file: "door/door_oborozakura.png" },
        { id: "uzunomichi", label: "渦の道", file: "door/door_uzunomichi.png" },
        { id: "w", label: "ウォールナット", file: "door/door_w.png" },
      ],
      defaultId: "normal"
    },
    {
      key: "center",
      jp: "背板中央",
      layerId: "layer-center",
      selId: "sel-center",
      options: [
        { id: "normal", label: "未選択", file: "center/center_normal2.png" },
        { id: "luminous", label: "ルミナス", file: "center/center_luminous.png" },
        { id: "kokutan", label: "黒丹調", file: "center/center_kokutan.png" },
        { id: "shitan", label: "紫丹調", file: "center/center_shitan.png" },
        { id: "kinshi", label: "金紙", file: "center/center_kinshi.png" },
        { id: "donsu", label: "緞子", file: "center/center_donsu.png" },
        { id: "uzunomichi", label: "渦の道", file: "center/center_uzunomichi.png" },
        { id: "oborozakura", label: "おぼろ桜", file: "center/center_oborozakura.png" },
        { id: "sakuranamiki-kokutan", label: "桜並木（黒丹）", file: "center/center_sakuranamiki-kokutan.png" },
        { id: "sakuranamiki-shitan", label: "桜並木（紫丹）", file: "center/center_sakuranamiki-shitan.png" },
        { id: "sakuranamiki-w", label: "桜並木（ウォールナット）", file: "center/center_sakuranamiki-w.png" },
        { id: "towazakura-kokutan", label: "永遠桜（黒丹）", file: "center/center_towazakura-kokutan.png" },
        { id: "towazakura-shitan", label: "永遠桜（紫丹）", file: "center/center_towazakura-shitan.png" },
        { id: "towazakura-w", label: "永遠桜（ウォールナット）", file: "center/center_towazakura-w.png" }
      ],
      defaultId: "normal"
    },
    {
      key: "back",
      jp: "背板全面",
      layerId: "layer-back",
      selId: "sel-back",
      options: [
        { id: "normal", label: "通常", file: "back/back_normal.png" },
        { id: "luminous", label: "ルミナス", file: "back/back_luminous.png" },
        { id: "iris", label: "アイリス", file: "back/back_iris.png" },
        { id: "kinshi", label: "金紙", file: "back/back_kinshi.png" },
        { id: "lily", label: "リリー", file: "back/back_lily.png" },
        { id: "w", label: "ウォールナット", file: "back/back_w.png" },
        { id: "uzunomichi", label: "渦の道", file: "back/back_uzunomichi.png" }
      ],
      defaultId: "normal"
    },
  ];

  const state = {
    door: null,
    center: null,
    hashira: null,
    back: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function toast(msg) {
    const t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      t.classList.remove("show");
    }, 1300);
  }

  function setImg(id, src) {
    const el = $(id);
    if (!el) return;
    const bust = "v=" + Date.now();
    el.src = src + (src.includes("?") ? "&" + bust : "?" + bust);
  }

  function setSelText(selId, label) {
    const el = $(selId);
    if (el) el.textContent = label;
  }

  function setActive(partKey, optId) {
    const wrap = document.querySelector(`[data-part="${partKey}"]`);
    if (!wrap) return;
    wrap.querySelectorAll("button.opt").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.opt === optId ? "true" : "false");
    });
  }

  function getPart(partKey) {
    return PARTS.find((p) => p.key === partKey);
  }

  function getOpt(partKey, optId) {
    const part = getPart(partKey);
    return part ? part.options.find((o) => o.id === optId) : null;
  }

  function normalizeState() {
    if (state.center && state.center !== "normal") {
      state.hashira = "on";
    }
  }

  function updateAvailability() {
    const mustHashiraOn = state.center && state.center !== "normal";

    const hashWrap = document.querySelector(`[data-part="hashira"]`);
    if (hashWrap) {
      const offBtn = hashWrap.querySelector(`button.opt[data-opt="off"]`);
      if (offBtn) {
        offBtn.disabled = mustHashiraOn;
        offBtn.title = mustHashiraOn ? "背板中央が未選択以外のときは柱OFFにできません" : "";
      }
    }
  }

  function syncUIFromState() {
    normalizeState();

    PARTS.forEach((part) => {
      const opt = getOpt(part.key, state[part.key]);
      if (!opt) return;
      setImg(part.layerId, opt.file);
      setSelText(part.selId, opt.label);
      setActive(part.key, opt.id);
    });

    updateAvailability();
  }

  function apply(partKey, optId, silent = false) {
    const part = getPart(partKey);
    const opt = getOpt(partKey, optId);
    if (!part || !opt) return;

    state[partKey] = optId;

    normalizeState();
    syncUIFromState();

    if (!silent) {
      let msg = `${part.jp}：${opt.label}`;

      if (partKey === "center" && state.center !== "normal") {
        msg += "（柱はON固定）";
      }

      toast(msg);
    }
  }

  function renderControls() {
    const root = $("controls");
    if (!root) return;
    root.innerHTML = "";

    PARTS.forEach((part) => {
      const box = document.createElement("section");
      box.className = "group";

      const head = document.createElement("div");
      head.className = "groupTitle";
      head.innerHTML = `<h3>${part.jp}</h3><div class="note">${part.options.length}項目</div>`;
      box.appendChild(head);

      const grid = document.createElement("div");
      grid.className = "btnGrid";
      grid.dataset.part = part.key;

      part.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.className = "opt";
        btn.type = "button";
        btn.textContent = opt.label;
        btn.dataset.opt = opt.id;
        btn.setAttribute("aria-pressed", "false");
        btn.addEventListener("click", () => apply(part.key, opt.id));
        grid.appendChild(btn);
      });

      box.appendChild(grid);
      root.appendChild(box);
    });
  }
async function buildExportSheet() {
      imgs.map((img) => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        });
      })
    );
  }

  async function exportAsImage() {
    try {
      await buildExportSheet();

      const sheet = $("exportSheet");

      const canvas = await html2canvas(sheet, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const link = document.createElement("a");
      link.download = "senbondo-customize.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast("画像を保存しました");
    } catch (e) {
      console.error(e);
      toast("画像保存に失敗しました");
    }
  }

  async function exportAsPDF() {
    try {
      await buildExportSheet();

      const sheet = $("exportSheet");

      const canvas = await html2canvas(sheet, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");

      const { jsPDF } = window.jspdf;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = 210;
      const pageHeight = 297;

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

      pdf.save("senbondo-customize.pdf");

      toast("PDFを保存しました");
    } catch (e) {
      console.error(e);
      toast("PDF保存に失敗しました");
    }
  }

  $("pdfBtn")?.addEventListener("click", exportAsPDF);
  $("imageBtn")?.addEventListener("click", exportAsImage);
  function resetAll() {
    setImg("layer-base", BASE_FILE);

    PARTS.forEach((part) => {
      state[part.key] = part.defaultId;
    });

    normalizeState();
    syncUIFromState();

    toast("初期状態に戻しました");
  }

  renderControls();
  resetAll();
});
