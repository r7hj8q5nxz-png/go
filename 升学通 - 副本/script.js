(() => {
  const targetDate = new Date("2026-06-30T00:00:00");
  const startDate = new Date("2024-01-01T00:00:00");
  const filterGroup = document.getElementById("filter-group");
  let activeFilter = "all";

  const dom = {
    currentDate: document.getElementById("current-date"),
    countdownText: document.getElementById("countdown-text"),
    progressFill: document.getElementById("progress-fill"),
    progressPercent: document.getElementById("progress-percent"),
    progressLeft: document.getElementById("progress-left"),
    progressRight: document.getElementById("progress-right"),
    progressMeta: document.getElementById("progress-meta"),
    grid: document.getElementById("grid-container"),
    toast: document.getElementById("toast"),
    vision: document.querySelector(".vision"),
  };

  function updateGreeting() {
    const hour = new Date().getHours();
    let message = "晚上好。把焦虑化作行动力，乾坤由你定。";
    if (hour >= 5 && hour < 12) {
      message = "早安。别让倒计时定义你，去定义你的倒计时。";
    } else if (hour >= 12 && hour < 18) {
      message = "下午好。未来不靠等待，全凭此刻行动。";
    }
    dom.currentDate.textContent = message;
    if (dom.vision) {
      dom.vision.textContent = message;
    }
  }

  function updateCountdown() {
    const now = new Date();
    const remainingMs = Math.max(0, targetDate - now);
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

    const elapsedMs = Math.max(0, Math.min(now - startDate, targetDate - startDate));
    const totalMs = Math.max(targetDate - startDate, 1);
    const progress = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

    dom.countdownText.textContent = `${remainingDays}`;
    dom.progressFill.style.width = `${progress.toFixed(1)}%`;
    if (dom.progressPercent) dom.progressPercent.textContent = `${progress.toFixed(1)}%`;
    if (dom.progressLeft) dom.progressLeft.textContent = `已消耗 ${progress.toFixed(1)}%`;
    if (dom.progressRight) dom.progressRight.textContent = "目标日：2026.06.30";
    dom.progressMeta.textContent = `剩余 ${remainingDays} 天`;
  }

  function tagColor(category) {
    if (category.includes("竞赛")) return "tag-purple";
    if (category.includes("体制") || category.includes("升学")) return "tag-orange";
    if (category.includes("就业")) return "tag-blue";
    if (category.includes("证书") || category.includes("工具")) return "tag-green";
    return "tag-gray";
  }

  function createCard(item, index) {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-title", item.title);
    card.style.animationDelay = `${index * 0.05}s`;
    card.addEventListener("click", () => {
      const query = `${item.title} 2026 官网`;
      if (dom.toast) {
        dom.toast.textContent = `🚀 正在前往 ${item.title}...`;
        dom.toast.classList.remove("hidden");
        dom.toast.classList.add("show");
      }
      setTimeout(() => {
        window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(query)}`, "_blank");
        if (dom.toast) {
          dom.toast.classList.remove("show");
          dom.toast.classList.add("hidden");
        }
      }, 800);
    });

    const top = document.createElement("div");
    top.className = "card-top";

    const title = document.createElement("h3");
    title.className = "title";
    title.textContent = item.title;

    top.append(title);

    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = item.desc;

    const meta = document.createElement("div");
    meta.className = "meta";

    const tag = document.createElement("span");
    tag.className = `tag ${tagColor(item.category)}`;
    tag.textContent = `${item.category} · ${item.tag}`;

    const time = document.createElement("span");
    time.className = "pill time";
    time.textContent = item.time;

    meta.append(tag, time);
    card.append(top, desc, meta);

    const external = document.createElement("span");
    external.className = "external";
    external.textContent = "↗";
    card.appendChild(external);

    return card;
  }

  function sortResources(list) {
    const tierScore = { SSR: 2, SR: 1, R: 0 };
    return [...list].sort((a, b) => {
      const tDiff = (tierScore[b.tier] || 0) - (tierScore[a.tier] || 0);
      if (tDiff !== 0) return tDiff;
      return a.id - b.id;
    });
  }

  function filteredResources() {
    switch (activeFilter) {
      case "law":
        return resources.filter((r) => r.category.includes("法学") || r.category.toLowerCase().includes("law"));
      case "competitions":
        return resources.filter((r) => r.category === "竞赛");
      case "gradgov":
        return resources.filter((r) => r.category.includes("升学") || r.category.includes("体制"));
      case "career":
        return resources.filter((r) => ["就业", "证书", "工具"].some((key) => r.category.includes(key)));
      default:
        return resources;
    }
  }

  function renderGrid() {
    dom.grid.innerHTML = "";
    sortResources(filteredResources()).forEach((item, idx) => {
      dom.grid.appendChild(createCard(item, idx));
    });
  }

  function setActiveFilter(key) {
    activeFilter = key;
    if (filterGroup) {
      filterGroup.querySelectorAll(".seg-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filter === key);
      });
    }
    dom.grid.classList.add("fade-out");
    setTimeout(() => {
      renderGrid();
      dom.grid.classList.remove("fade-out");
      dom.grid.classList.add("fade-in");
      setTimeout(() => dom.grid.classList.remove("fade-in"), 180);
    }, 140);
  }

  function bindFilters() {
    if (!filterGroup) return;
    filterGroup.addEventListener("click", (e) => {
      const btn = e.target.closest(".seg-btn");
      if (!btn) return;
      const key = btn.dataset.filter;
      if (key === activeFilter) return;
      setActiveFilter(key);
    });
  }

  updateGreeting();
  updateCountdown();
  renderGrid();
  bindFilters();
})();
