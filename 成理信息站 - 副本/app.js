// V0.3 - 数据从外部 JS 文件加载
// window.diagnosisData 和 window.sourcesData 在 data/*.js 中定义

// V0.5 - 时间状态计算函数
function calculateTimeStatus(deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // 归零到当天开始
    
    const deadlineDate = parseDateSafe(deadline);
    
    if (!deadlineDate) {
        return {
            status: 'unknown',
            label: '🕒 日期未知',
            className: 'status-unknown',
            daysLeft: null
        };
    }
    
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        // 已过期
        return {
            status: 'expired',
            label: '⛔ 已截止',
            className: 'status-expired',
            daysLeft: diffDays
        };
    } else if (diffDays <= 7) {
        // 紧急
        return {
            status: 'urgent',
            label: `🔥 剩 ${diffDays} 天`,
            className: 'status-urgent',
            daysLeft: diffDays
        };
    } else if (diffDays <= 30) {
        // 临近
        return {
            status: 'approaching',
            label: `⚠️ 剩 ${diffDays} 天`,
            className: 'status-approaching',
            daysLeft: diffDays
        };
    } else {
        // 充足
        return {
            status: 'sufficient',
            label: '� 剩 ' + diffDays + ' 天',
            className: 'status-sufficient',
            daysLeft: diffDays
        };
    }
}

// V2.6.7: 安全日期解析函数
function parseDateSafe(str) {
    if (!str) return null;
    
    let normalized = str.trim();
    let year, month, day;
    
    // 支持 YYYY年MM月DD日 格式
    const chineseDateMatch = normalized.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
    if (chineseDateMatch) {
        [, year, month, day] = chineseDateMatch.map(Number);
    } else {
        // 支持 YYYY-MM-DD、YYYY/MM/DD、YYYY.MM.DD 格式
        normalized = normalized.replace(/[./]/g, '-');
        const parts = normalized.split('-');
        if (parts.length !== 3) {
            return null;
        }
        [year, month, day] = parts.map(Number);
    }
    
    // 验证日期有效性
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return null;
    }
    
    if (month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
    }
    
    // 构造日期对象
    const date = new Date(year, month - 1, day);
    
    // 再次验证日期是否有效（处理类似 2026-02-30 这样的无效日期）
    if (isNaN(date.getTime())) {
        return null;
    }
    
    // 确保日期组件正确
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        return null;
    }
    
    return date;
}

// V2.6.6: 紧迫程度计算函数（稳定实现版）
function getUrgency(deadline) {
    if (!deadline) {
        return {
            level: 'unknown',
            className: 'urgency-unknown',
            label: '⚪ 未知',
            days: null,
            diffDays: null
        };
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const ddl = new Date(deadline);
    if (isNaN(ddl.getTime())) {
        return {
            level: 'unknown',
            className: 'urgency-unknown',
            label: '⚪ 未知',
            days: null,
            diffDays: null
        };
    }

    ddl.setHours(0,0,0,0);
    const diffDays = Math.ceil((ddl - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return {
            level: 'expired',
            className: 'urgency-expired',
            label: '❌ 已截止',
            days: diffDays,
            diffDays: diffDays
        };
    }
    if (diffDays <= 7) {
        return {
            level: 'high',
            className: 'urgency-high',
            label: `🔴 紧急 · ${diffDays}天`,
            days: diffDays,
            diffDays: diffDays
        };
    }
    if (diffDays <= 30) {
        return {
            level: 'medium',
            className: 'urgency-medium',
            label: `🟡 临近 · ${diffDays}天`,
            days: diffDays,
            diffDays: diffDays
        };
    }
    return {
        level: 'low',
        className: 'urgency-low',
        label: `🟢 充裕 · ${diffDays}天`,
        days: diffDays,
        diffDays: diffDays
    };
}

// 全局状态
let allCards = [];
let validCards = [];
let filteredCount = 0;
let outdatedCount = 0;  // V0.6: 过时数据统计
let currentFilter = 'all';
let currentSort = 'deadline';
let currentSchool = 'all';  // V0.8: 学校筛选
let searchKeyword = '';

// V0.6: 快捷筛选状态
let quickFilters = {
    notExpired: true,
    starred: false,
    urgent: false
};

// V0.9: CDUT 筛选状态（叠加开关）
let cdutOnlyMode = false;

// V1.2: 当前视图模式（列表/月份）
let currentView = 'list';

// V1.2: 当前个人节奏阶段
let currentPace = '';

// V1.7: 浏览模式状态
let currentViewMode = 'detailed';

// V0.6: LocalStorage 关注管理
const STORAGE_KEY = 'campus_info_starred';

// V1.7: LocalStorage 浏览模式
const VIEW_MODE_KEY = 'campus_info_view_mode';

// V1.6: LocalStorage 置顶管理
const PINNED_KEY = 'campus_info_pinned';
const MAX_PINNED = 3;

// V1.6: LocalStorage 已读管理
const READ_KEY = 'campus_info_read';

function getStarredIds() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveStarredIds(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function toggleStar(cardId) {
    let starredIds = getStarredIds();
    const index = starredIds.indexOf(cardId);
    
    if (index > -1) {
        // 取消关注
        starredIds.splice(index, 1);
    } else {
        // 添加关注
        starredIds.push(cardId);
    }
    
    saveStarredIds(starredIds);
    return starredIds.includes(cardId);
}

function isStarred(cardId) {
    return getStarredIds().includes(cardId);
}

// V1.6: 置顶管理函数
function getPinnedIds() {
    const stored = localStorage.getItem(PINNED_KEY);
    return stored ? JSON.parse(stored) : [];
}

function savePinnedIds(ids) {
    localStorage.setItem(PINNED_KEY, JSON.stringify(ids));
}

function togglePin(cardId) {
    let pinnedIds = getPinnedIds();
    const index = pinnedIds.indexOf(cardId);
    
    if (index > -1) {
        // 取消置顶
        pinnedIds.splice(index, 1);
        savePinnedIds(pinnedIds);
        return false;
    } else {
        // 添加置顶
        if (pinnedIds.length >= MAX_PINNED) {
            // 超过限制，提示用户
            showToast('⚠️ 最多置顶3条，请先取消一个');
            return false;
        }
        pinnedIds.push(cardId);
        savePinnedIds(pinnedIds);
        return true;
    }
}

function isPinned(cardId) {
    return getPinnedIds().includes(cardId);
}

// V1.6: 已读管理函数
function getReadIds() {
    const stored = localStorage.getItem(READ_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveReadIds(ids) {
    localStorage.setItem(READ_KEY, JSON.stringify(ids));
}

function markAsRead(cardId) {
    let readIds = getReadIds();
    if (!readIds.includes(cardId)) {
        readIds.push(cardId);
        saveReadIds(readIds);
    }
}

function isRead(cardId) {
    return getReadIds().includes(cardId);
}

// V1.7: 学院筛选状态
let currentCollege = 'all';

// V2.6.7: 政策层级筛选状态
let currentPolicyLevel = 'all';

// V1.7: 生成学院快跳芯片
function generateCollegeChips() {
    const container = document.querySelector('.college-chips');
    if (!container) return;
    
    // 获取所有 CDUT 学院和部门来源
    const collegeSources = window.sourcesData?.filter(source => 
        source.name.includes('学院') || source.name.includes('研究院') || 
        source.name.includes('教务处') || source.name.includes('就业网') ||
        source.name.includes('学工部') || source.name.includes('团委') ||
        source.name.includes('图书馆') || source.name.includes('研究生院')
    ) || [];
    
    // 清空容器
    container.innerHTML = '';
    
    // 添加固定首位芯片
    const allChip = document.createElement('div');
    allChip.className = 'college-chip all active';
    allChip.textContent = '🏠 全部';
    allChip.dataset.college = 'all';
    container.appendChild(allChip);
    
    // V1.8: 添加 CDUT-CORE 芯片
    const cdutCoreChip = document.createElement('div');
    cdutCoreChip.className = 'college-chip cdut-core';
    cdutCoreChip.textContent = '🏛️ CDUT-CORE';
    cdutCoreChip.dataset.college = 'cdut_core';
    container.appendChild(cdutCoreChip);
    
    const cdutOnlyChip = document.createElement('div');
    cdutOnlyChip.className = 'college-chip cdut-only';
    cdutOnlyChip.textContent = '🏫 CDUT Only';
    cdutOnlyChip.dataset.college = 'cdut_only';
    container.appendChild(cdutOnlyChip);
    
    // 添加分隔符
    const separator = document.createElement('div');
    separator.style.width = '15px';
    container.appendChild(separator);
    
    // 动态生成学院芯片
    collegeSources.forEach(source => {
        const chip = document.createElement('div');
        chip.className = 'college-chip';
        // 显示学院简称，便于在一行内显示更多标签
        let shortName = source.name;
        if (shortName.includes('成都理工大学')) {
            shortName = shortName.replace('成都理工大学', '');
        }
        if (shortName.includes('学院')) {
            shortName = shortName.replace('学院', '院');
        }
        if (shortName.includes('研究生院')) {
            shortName = '研究生院';
        }
        if (shortName.includes('图书馆')) {
            shortName = '图书馆';
        }
        if (shortName.includes('团委')) {
            shortName = '团委';
        }
        if (shortName.includes('学工部')) {
            shortName = '学工部';
        }
        if (shortName.includes('就业网')) {
            shortName = '就业网';
        }
        if (shortName.includes('教务处')) {
            shortName = '教务处';
        }
        if (shortName.includes('研究院')) {
            shortName = shortName.replace('研究院', '院');
        }
        chip.textContent = shortName;
        chip.dataset.college = source.key;
        container.appendChild(chip);
    });
    
    // 绑定芯片点击事件
    setupCollegeChipEvents();
}

// V1.7: 加载保存的浏览模式
function loadViewMode() {
    const savedMode = localStorage.getItem(VIEW_MODE_KEY);
    if (savedMode) {
        currentViewMode = savedMode;
        // 应用保存的视图模式
        applyViewMode(currentViewMode);
    }
}

// V1.7: 保存浏览模式
function saveViewMode(mode) {
    localStorage.setItem(VIEW_MODE_KEY, mode);
}

// V1.7: 应用浏览模式
function applyViewMode(mode) {
    const cardsContainer = document.getElementById('cards-container');
    if (!cardsContainer) return;
    
    if (mode === 'compact') {
        // 应用紧凑视图
        cardsContainer.classList.add('view-compact');
        document.body.classList.add('view-compact');
    } else {
        // 应用详细视图
        cardsContainer.classList.remove('view-compact');
        document.body.classList.remove('view-compact');
    }
    
    // 更新按钮状态
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === mode) {
            btn.classList.add('active');
        }
    });
}

// V1.7: 设置浏览模式切换事件
function setupViewModeToggle() {
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.view;
            currentViewMode = mode;
            
            // 保存视图模式
            saveViewMode(mode);
            
            // 应用视图模式
            applyViewMode(mode);
        });
    });
}

// V1.7: 键盘效率工具
function setupKeyboardShortcuts() {
    // 仅在桌面端有效
    if (window.innerWidth < 768) {
        return;
    }
    
    document.addEventListener('keydown', (e) => {
        // 搜索框聚焦时禁用快捷键
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // 获取所有可见卡片
        const cards = Array.from(document.querySelectorAll('.card:not(.collapsed)'));
        if (cards.length === 0) {
            return;
        }
        
        // 当前聚焦的卡片索引
        let currentIndex = -1;
        cards.forEach((card, index) => {
            if (card.classList.contains('focused')) {
                currentIndex = index;
            }
        });
        
        // 处理按键事件
        switch (e.key.toLowerCase()) {
            case 'j':
            case 'arrowdown':
                e.preventDefault();
                // 聚焦下一张卡片
                currentIndex = (currentIndex + 1) % cards.length;
                break;
            case 'k':
            case 'arrowup':
                e.preventDefault();
                // 聚焦上一张卡片
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                break;
            default:
                return;
        }
        
        // 移除所有卡片的聚焦状态
        cards.forEach(card => card.classList.remove('focused'));
        
        // 聚焦当前卡片
        const targetCard = cards[currentIndex];
        targetCard.classList.add('focused');
        
        // 滚动到当前卡片
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 展开当前卡片
        targetCard.classList.add('expanded');
    });
}

// V1.7: 设置学院芯片事件
function setupCollegeChipEvents() {
    document.querySelectorAll('.college-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            // 移除所有活跃状态
            document.querySelectorAll('.college-chip').forEach(c => c.classList.remove('active'));
            
            // 添加当前芯片活跃状态
            chip.classList.add('active');
            
            // 获取选择的学院
            const college = chip.dataset.college;
            currentCollege = college;
            
            // 根据选择执行筛选
            if (college === 'all') {
                // 显示全部
                currentSchool = 'all';
                cdutOnlyMode = false;
            } else if (college === 'cdut_only') {
                // 只显示 CDUT
                currentSchool = 'CDUT';
                cdutOnlyMode = true;
            } else if (college === 'cdut_core') {
                // 只显示 CDUT-CORE（校级通用）
                currentSchool = 'CDUT';
                cdutOnlyMode = true;
            } else {
                // 显示特定学院
                currentSchool = 'CDUT';
                cdutOnlyMode = true;
            }
            
            // 更新学校选择器
            updateSchoolSelect();
            
            // 更新成都理工按钮状态
            const cdutBtn = document.getElementById('cdut-only-btn');
            if (cdutOnlyMode) {
                cdutBtn.classList.add('active');
            } else {
                cdutBtn.classList.remove('active');
            }
            
            // 重新渲染卡片
            renderCards(getFilteredAndSortedCards());
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupFilterButtons();
    setupCdutButton();  // V0.9: 设置成都理工按钮
    setupSearchAndSort();
    setupExportButton();
    setupQuickFilters();  // V0.6: 设置快捷筛选
    setupYearProgress();  // V0.7: 设置年度进度条
    setupDashboard();  // V1.1: 设置顶部情报仪表盘
    setupDeveloperMode();  // V1.1: 设置开发者维护模式
    setupViewToggle();  // V1.2: 设置视图切换
    restoreFilterFromHash();  // V0.4: 从 URL hash 恢复筛选状态
    generateCollegeChips();  // V1.7: 生成学院快跳芯片
    loadViewMode();  // V1.7: 加载保存的浏览模式
    setupViewModeToggle();  // V1.7: 设置浏览模式切换事件
    setupKeyboardShortcuts();  // V1.7: 设置键盘快捷键
});

// 加载数据
function loadData() {
    try {
        // 检查数据是否已加载
        if (!window.diagnosisData || !window.sourcesData) {
            throw new Error('数据文件未正确加载');
        }
        
        const rawData = window.diagnosisData;
        const totalCount = rawData.length;
        
        // V0.6: 数据硬过滤 - 只保留 deadline >= 2026-01-01 的数据
        const cutoffDate = new Date('2026-01-01');
        const dateFilteredData = rawData.filter(card => {
            const deadline = new Date(card.deadline);
            return !isNaN(deadline.getTime()) && deadline >= cutoffDate;
        });
        
        outdatedCount = totalCount - dateFilteredData.length;
        
        // 数据校验和过滤
        validCards = dateFilteredData.filter(card => validateCard(card));
        filteredCount = outdatedCount + (dateFilteredData.length - validCards.length);
        
        allCards = validCards;
        
        // 隐藏加载动画
        document.getElementById('loading').classList.add('hidden');
        
        // 渲染本周3件事
        renderWeeklyTop3();
        
        // 渲染所有卡片
        renderCards(getFilteredAndSortedCards());
        
        // 渲染 Sidebar 卡片
        renderSidebarCards();
        
        // 显示数据统计
        renderDataStats(totalCount, outdatedCount);
        
        // V1.1: 更新仪表盘统计
        updateDashboardStats();
        updateDashboardBadges();
        
    } catch (error) {
        console.error('数据加载失败:', error);
        document.getElementById('loading').innerHTML = '<p style="color: #e74c3c;">😕 数据加载失败，请刷新页面重试</p>';
    }
}

// 数据校验函数
function validateCard(card) {
    // 检查必需字段
    if (!card.id || !card.type || !card.title || !card.diagnosis) {
        console.warn(`卡片 ${card.id || '未知'} 缺少必需字段`);
        return false;
    }
    
    if (!card.action || !card.evidence || !card.deadline) {
        console.warn(`卡片 ${card.id} 缺少 action/evidence/deadline 字段`);
        return false;
    }
    
    // 检查 URL 有效性
    if (!card.sourceUrl || !/^https?:\/\//i.test(card.sourceUrl)) {
        console.warn(`卡片 ${card.id} 的 sourceUrl 无效: ${card.sourceUrl}`);
        return false;
    }
    
    // 检查日期有效性
    const deadlineDate = new Date(card.deadline);
    if (isNaN(deadlineDate.getTime())) {
        console.warn(`卡片 ${card.id} 的 deadline 无效: ${card.deadline}`);
        return false;
    }
    
    // 检查 sourceKey
    if (!card.sourceKey) {
        console.warn(`卡片 ${card.id} 缺少 sourceKey 字段`);
        return false;
    }
    
    return true;
}

// 渲染数据统计
function renderDataStats(total, outdated) {
    const statsElement = document.getElementById('data-stats');
    const validCount = total - outdated;
    statsElement.innerHTML = `共加载 <strong>${validCount}</strong> 条有效信息，已过滤 <strong>${outdated}</strong> 条过时数据`;
}

// 渲染 Sidebar 卡片
function renderSidebarCards() {
    const container = document.getElementById('sidebar-cards');
    
    // 填充逻辑：
    // 1. 优先：⭐ 置顶
    // 2. 其次：policyLevel === "national" (国策) 或 status === "紧急" (Top 6)
    // 3. 确保看板不空
    
    // 获取所有卡片
    const allCards = [...validCards];
    
    // 1. 获取已置顶卡片
    const pinnedIds = getPinnedIds();
    const pinnedCards = allCards.filter(card => pinnedIds.includes(card.id));
    
    // 2. 获取高权重卡片（国策或紧急）
    const highPriorityCards = allCards.filter(card => {
        const timeStatus = calculateTimeStatus(card.deadline);
        return card.policyLevel === 'national' || timeStatus.status === 'urgent';
    }).sort((a, b) => {
        // 优先级排序：国策优先，然后按 deadline 排序
        if (a.policyLevel === 'national' && b.policyLevel !== 'national') return -1;
        if (a.policyLevel !== 'national' && b.policyLevel === 'national') return 1;
        return new Date(a.deadline) - new Date(b.deadline);
    });
    
    // 3. 合并卡片，确保不重复
    const combinedCards = [...new Set([...pinnedCards, ...highPriorityCards])];
    
    // 4. 取前 6 张
    const sidebarCards = combinedCards.slice(0, 6);
    
    // 5. 如果还是空的，取任意卡片
    if (sidebarCards.length === 0) {
        sidebarCards.push(...allCards.slice(0, 6));
    }
    
    // 渲染卡片
    container.innerHTML = sidebarCards.map(card => createCardHTML(card)).join('');
    
    // 绑定卡片交互事件
    setupSidebarCardInteractions();
}

// 设置 Sidebar 卡片交互
function setupSidebarCardInteractions() {
    // 只需要绑定星标和置顶按钮事件，其他交互在主卡片区域已处理
    
    // V0.6: 星标按钮
    document.querySelectorAll('.sidebar-cards .star-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();  // 防止事件冒泡
            const cardId = parseInt(e.currentTarget.dataset.id);
            const isNowStarred = toggleStar(cardId);
            
            // 更新按钮显示
            if (isNowStarred) {
                e.currentTarget.textContent = '⭐';
                e.currentTarget.classList.add('starred');
                showToast('⭐ 已添加到关注');
            } else {
                e.currentTarget.textContent = '☆';
                e.currentTarget.classList.remove('starred');
                showToast('已取消关注');
            }
        });
    });
    
    // V1.6: 置顶按钮
    document.querySelectorAll('.sidebar-cards .pin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();  // 防止事件冒泡
            const cardId = parseInt(e.currentTarget.dataset.id);
            const isNowPinned = togglePin(cardId);
            
            // 更新按钮显示和样式
            if (isNowPinned) {
                e.currentTarget.classList.add('pinned');
                showToast('📌 已置顶');
            } else {
                e.currentTarget.classList.remove('pinned');
                showToast('已取消置顶');
            }
            
            // 重新渲染 Sidebar 卡片
            renderSidebarCards();
            
            // 重新渲染主卡片
            renderCards(getFilteredAndSortedCards());
        });
    });
}

// 渲染"本周建议"
function renderWeeklyTop3() {
    const container = document.getElementById('weekly-top3');
    
    // 筛选逻辑：
    // 1. 剔除标题含 "学校简介", "规章", "历史" 的卡片
    // 2. 只推 status="紧急" 且 tracks 含 "竞赛/保研/考公" 的高价值卡
    // 3. 按 deadline 排序
    const today = new Date();
    const top3 = [...validCards]
        // 清洗条件：剔除标题含特定关键词的卡片
        .filter(card => {
            const title = card.title.toLowerCase();
            return !title.includes('学校简介') && !title.includes('规章') && !title.includes('历史');
        })
        // 高价值卡条件：status="紧急" 且 tracks 含 "竞赛/保研/考公"
        .filter(card => {
            const timeStatus = calculateTimeStatus(card.deadline);
            const hasHighValueTracks = card.tracks && Array.isArray(card.tracks) && 
                                      card.tracks.some(track => ['竞赛', '保研', '考公'].includes(track));
            return timeStatus.status === 'urgent' && hasHighValueTracks;
        })
        // 按 deadline 排序
        .sort((a, b) => {
            const dateA = new Date(a.deadline);
            const dateB = new Date(b.deadline);
            return dateA - dateB;  // 距离今天最近的优先
        })
        .slice(0, 3);  // 取前3个
    
    if (top3.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    const html = `
        <div class="weekly-header">
            <h2>💡 本周建议</h2>
            <button class="weekly-share-btn" id="share-weekly-btn">📤 复制本周重点</button>
        </div>
        <div class="weekly-list">
            ${top3.map(card => {
                // V0.5: 为本周推荐也添加时间状态
                const timeStatus = calculateTimeStatus(card.deadline);
                // V0.6: 显示星标状态
                const starred = isStarred(card.id);
                const starIcon = starred ? '⭐' : '';
                return `
                    <div class="weekly-item" onclick="window.open('${normalizeUrl(card.sourceUrl, card)}', '_blank')">
                        <div class="weekly-item-header">
                            <div class="weekly-item-title">${starIcon}${card.title}</div>
                            <div class="weekly-item-status">
                                <span class="time-status ${timeStatus.className}">${timeStatus.label}</span>
                            </div>
                        </div>
                        <div class="weekly-item-action">${card.action}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    container.innerHTML = html;
    
    // V0.4: 绑定"复制本周重点"按钮事件
    setupWeeklyShareButton(top3);
}

// V0.4: 设置"复制本周重点"按钮
function setupWeeklyShareButton(top3Cards) {
    const shareBtn = document.getElementById('share-weekly-btn');
    if (!shareBtn) return;
    
    shareBtn.addEventListener('click', async (e) => {
        e.stopPropagation();  // 防止事件冒泡
        
        // 生成分享文本
        let shareText = '📌 本周校园信息划重点\n';
        
        top3Cards.forEach((card, index) => {
            shareText += `${index + 1}. ${card.title} (截止: ${formatDate(card.deadline)})\n`;
        });
        
        shareText += '— 来自：校园信息诊断平台';
        
        // 检测 URL 类型，如果是网络地址则附带链接
        const currentUrl = window.location.href;
        if (currentUrl.startsWith('http://') || currentUrl.startsWith('https://')) {
            shareText += `\n链接: ${currentUrl}`;
        }
        
        // 复制到剪贴板
        try {
            await navigator.clipboard.writeText(shareText);
            showToast('✅ 内容已复制，可直接粘贴');
        } catch (err) {
            alert('内容已复制到剪贴板：\n\n' + shareText);
        }
    });
}

// 设置筛选按钮
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-category]');  // V0.9: 排除 CDUT 按钮
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            
            // V0.4: 更新 URL hash
            updateUrlHash(currentFilter);
            
            renderCards(getFilteredAndSortedCards());
        });
    });
    
    // V2.6.7: 政策层级筛选按钮事件
    const policyButtons = document.querySelectorAll('.policy-chip');
    if (policyButtons.length > 0) {
        policyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有活跃状态
                policyButtons.forEach(b => b.classList.remove('active'));
                // 添加当前按钮活跃状态
                btn.classList.add('active');
                // 更新当前筛选
                currentPolicyLevel = btn.dataset.policy || 'all';
                // 重新渲染卡片
                renderCards(getFilteredAndSortedCards());
            });
        });
    }
}

// V0.9: 设置成都理工按钮（叠加开关）
function setupCdutButton() {
    const cdutBtn = document.getElementById('cdut-only-btn');
    
    if (!cdutBtn) return;
    
    cdutBtn.addEventListener('click', () => {
        // 切换状态
        cdutOnlyMode = !cdutOnlyMode;
        
        // 更新按钮样式
        if (cdutOnlyMode) {
            cdutBtn.classList.add('active');
        } else {
            cdutBtn.classList.remove('active');
        }
        
        // 重新渲染卡片
        renderCards(getFilteredAndSortedCards());
        
        // 显示提示
        if (cdutOnlyMode) {
            showToast('🏫 已切换至成都理工模式');
        } else {
            showToast('已显示全部信息');
        }
    });
}

// V0.4: 更新 URL hash（状态保持）
function updateUrlHash(category) {
    if (category === 'all') {
        // 清除 hash
        history.replaceState(null, '', window.location.pathname);
    } else {
        // 设置 hash
        history.replaceState(null, '', `#type=${encodeURIComponent(category)}`);
    }
}

// V0.4: 从 URL hash 恢复筛选状态
function restoreFilterFromHash() {
    const hash = window.location.hash;
    if (!hash) return;
    
    // 解析 hash，格式：#type=升学
    const match = hash.match(/#type=(.+)/);
    if (!match) return;
    
    const category = decodeURIComponent(match[1]);
    
    // 触发对应按钮的点击
    const targetBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
    if (targetBtn) {
        targetBtn.click();
    }
}

// V2.6.7: 重置所有筛选条件
function resetFilters() {
    // 重置分类筛选
    currentFilter = 'all';
    const allFilterBtn = document.querySelector('.filter-btn[data-category="all"]');
    if (allFilterBtn) {
        allFilterBtn.classList.add('active');
        document.querySelectorAll('.filter-btn[data-category]').forEach(btn => {
            if (btn.dataset.category !== 'all') {
                btn.classList.remove('active');
            }
        });
    }
    
    // 重置政策层级筛选
    currentPolicyLevel = 'all';
    const allPolicyBtn = document.querySelector('.policy-chip[data-policy="all"]');
    if (allPolicyBtn) {
        allPolicyBtn.classList.add('active');
        document.querySelectorAll('.policy-chip').forEach(btn => {
            if (btn.dataset.policy !== 'all') {
                btn.classList.remove('active');
            }
        });
    }
    
    // 重置学校筛选
    currentSchool = 'all';
    const schoolSelect = document.getElementById('school-select');
    if (schoolSelect) {
        schoolSelect.value = 'all';
    }
    
    // 重置成都理工模式
    cdutOnlyMode = false;
    const cdutBtn = document.getElementById('cdut-only-btn');
    if (cdutBtn) {
        cdutBtn.classList.remove('active');
    }
    
    // 重置学院筛选
    currentCollege = 'all';
    const allCollegeChip = document.querySelector('.college-chip.all');
    if (allCollegeChip) {
        allCollegeChip.classList.add('active');
        document.querySelectorAll('.college-chip').forEach(chip => {
            if (!chip.classList.contains('all')) {
                chip.classList.remove('active');
            }
        });
    }
    
    // 重置搜索关键词
    searchKeyword = '';
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // 重置快捷筛选
    quickFilters = {
        notExpired: true,
        starred: false,
        urgent: false
    };
    const notExpiredCheckbox = document.getElementById('filter-not-expired');
    const starredCheckbox = document.getElementById('filter-starred');
    const urgentCheckbox = document.getElementById('filter-urgent');
    if (notExpiredCheckbox) notExpiredCheckbox.checked = true;
    if (starredCheckbox) starredCheckbox.checked = false;
    if (urgentCheckbox) urgentCheckbox.checked = false;
    
    // 重置排序
    currentSort = 'deadline';
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.value = 'deadline';
    }
    
    // 重新渲染卡片
    renderCards(getFilteredAndSortedCards());
}

// 设置搜索和排序
function setupSearchAndSort() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const schoolSelect = document.getElementById('school-select');  // V0.8
    
    // 搜索功能 - 实时搜索
    searchInput.addEventListener('input', (e) => {
        searchKeyword = e.target.value.toLowerCase().trim();
        renderCards(getFilteredAndSortedCards());
    });
    
    // 排序功能
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderCards(getFilteredAndSortedCards());
    });
    
    // V0.8: 学校筛选功能
    schoolSelect.addEventListener('change', (e) => {
        currentSchool = e.target.value;
        renderCards(getFilteredAndSortedCards());
    });
}

// V0.4: 设置导出按钮
function setupExportButton() {
    const exportBtn = document.getElementById('export-btn');
    
    exportBtn.addEventListener('click', async () => {
        const currentCards = getFilteredAndSortedCards();
        
        if (currentCards.length === 0) {
            showToast('当前没有可导出的内容');
            return;
        }
        
        // 生成导出文本
        const exportText = currentCards.map(card => {
            return `[${formatDate(card.deadline)}] ${card.title} - ${card.diagnosis} (原文: ${card.sourceUrl})`;
        }).join('\n');
        
        // 复制到剪贴板
        try {
            await navigator.clipboard.writeText(exportText);
            showToast(`✅ 已导出 ${currentCards.length} 条信息，可直接粘贴`);
        } catch (err) {
            alert('内容已生成，请手动复制：\n\n' + exportText);
        }
    });
}

// V0.6: 设置快捷筛选
function setupQuickFilters() {
    const notExpiredFilter = document.getElementById('filter-not-expired');
    const starredFilter = document.getElementById('filter-starred');
    const urgentFilter = document.getElementById('filter-urgent');
    
    notExpiredFilter.addEventListener('change', (e) => {
        quickFilters.notExpired = e.target.checked;
        renderCards(getFilteredAndSortedCards());
    });
    
    starredFilter.addEventListener('change', (e) => {
        quickFilters.starred = e.target.checked;
        renderCards(getFilteredAndSortedCards());
    });
    
    urgentFilter.addEventListener('change', (e) => {
        quickFilters.urgent = e.target.checked;
        renderCards(getFilteredAndSortedCards());
    });
}

// 获取筛选和排序后的卡片
function getFilteredAndSortedCards() {
    let cards = allCards;
    
    // 分类筛选
    if (currentFilter !== 'all') {
        cards = cards.filter(card => card.type === currentFilter);
    }
    
    // V0.8: 学校筛选
    if (currentSchool !== 'all') {
        cards = cards.filter(card => card.school === currentSchool);
    }
    
    // V0.9: CDUT 叠加筛选（优先级最高）
    if (cdutOnlyMode) {
        cards = cards.filter(card => card.school === 'CDUT');
    }
    
    // V1.7: 学院筛选
    if (currentCollege !== 'all' && currentCollege !== 'cdut_only') {
        if (currentCollege === 'cdut_core') {
            // 筛选校级通用卡片
            cards = cards.filter(card => card.level === 'university');
        } else {
            // 筛选特定学院卡片
            cards = cards.filter(card => {
                // 检查卡片的 sourceKey 是否包含当前学院的 key
                return card.sourceKey && card.sourceKey.includes(currentCollege);
            });
        }
    }
    
    // V2.6.7: 政策层级筛选
    if (currentPolicyLevel !== 'all') {
        cards = cards.filter(card => {
            // 优先使用 card.policyLevel
            if (card.policyLevel) {
                return card.policyLevel === currentPolicyLevel;
            }
            
            // 兜底：使用标题/分类字段关键词判断
            const text = (card.title + ' ' + card.type + ' ' + card.diagnosis).toLowerCase();
            
            if (currentPolicyLevel === 'national') {
                return text.includes('国策') || text.includes('国家') || text.includes('教育部') || 
                       text.includes('中央') || text.includes('全国') || text.includes('部委');
            } else if (currentPolicyLevel === 'provincial') {
                return text.includes('省级') || text.includes('省厅') || text.includes('四川省') || 
                       text.includes('自治区') || text.includes('市级') || text.includes('厅');
            }
            
            return true;
        });
    }
    
    // 搜索筛选
    if (searchKeyword) {
        cards = cards.filter(card => 
            card.title.toLowerCase().includes(searchKeyword) ||
            card.diagnosis.toLowerCase().includes(searchKeyword) ||
            card.action.toLowerCase().includes(searchKeyword)
        );
    }
    
    // V0.6: 快捷筛选
    if (quickFilters.notExpired) {
        cards = cards.filter(card => {
            const status = calculateTimeStatus(card.deadline);
            return status.status !== 'expired';
        });
    }
    
    if (quickFilters.starred) {
        const starredIds = getStarredIds();
        cards = cards.filter(card => starredIds.includes(card.id));
    }
    
    if (quickFilters.urgent) {
        cards = cards.filter(card => {
            const status = calculateTimeStatus(card.deadline);
            return status.status === 'urgent';
        });
    }
    
    // V0.9: 排序（CDUT First + 过期信息自动沉底）
    cards = [...cards].sort((a, b) => {
        // 获取紧迫程度
        const urgencyA = getUrgency(a.deadline);
        const urgencyB = getUrgency(b.deadline);
        
        // 紧迫优先排序
        if (currentSort === 'urgency') {
            // 排序权重：high(1) < medium(2) < low(3) < unknown(4) < expired(5)
            const urgencyOrder = {
                'high': 1,
                'medium': 2,
                'low': 3,
                'unknown': 4,
                'expired': 5
            };
            
            const orderA = urgencyOrder[urgencyA.level] || 5;
            const orderB = urgencyOrder[urgencyB.level] || 5;
            
            if (orderA !== orderB) {
                return orderA - orderB;
            }
        }
        
        const statusA = calculateTimeStatus(a.deadline);
        const statusB = calculateTimeStatus(b.deadline);
        
        // 1. 过期的永远排在最后
        if (statusA.status === 'expired' && statusB.status !== 'expired') return 1;
        if (statusA.status !== 'expired' && statusB.status === 'expired') return -1;
        
        // 2. 非过期的：CDUT 优先
        if (a.school === 'CDUT' && b.school !== 'CDUT') return -1;
        if (a.school !== 'CDUT' && b.school === 'CDUT') return 1;
        
        // 3. 相同学校的按原有排序规则
        if (currentSort === 'deadline') {
            return new Date(a.deadline) - new Date(b.deadline);
        } else if (currentSort === 'priority') {
            return a.priority - b.priority;
        }
        return 0;
    });
    
    return cards;
}

// V1.6: 获取置顶卡片和普通卡片
function getPinnedAndNormalCards() {
    const allFilteredCards = getFilteredAndSortedCards();
    const pinnedIds = getPinnedIds();
    
    // 分离置顶卡片和普通卡片
    const pinnedCards = [];
    const normalCards = [];
    
    // 首先添加置顶卡片，保持置顶顺序
    pinnedIds.forEach(id => {
        const card = allFilteredCards.find(c => c.id === id);
        if (card) {
            pinnedCards.push(card);
        }
    });
    
    // 然后添加普通卡片（排除已置顶的）
    allFilteredCards.forEach(card => {
        if (!pinnedIds.includes(card.id)) {
            normalCards.push(card);
        }
    });
    
    return { pinnedCards, normalCards };
}

// V1.7: 按状态分组获取卡片
function getCardsByStatus() {
    const allFilteredCards = getFilteredAndSortedCards();
    const pinnedIds = getPinnedIds();
    
    // 分离置顶卡片
    const pinnedCards = [];
    const normalCards = [];
    
    allFilteredCards.forEach(card => {
        if (pinnedIds.includes(card.id)) {
            pinnedCards.push(card);
        } else {
            normalCards.push(card);
        }
    });
    
    // 按状态分组普通卡片
    const urgentCards = [];
    const warningCards = [];
    const normalStatusCards = [];
    const expiredCards = [];
    
    normalCards.forEach(card => {
        const timeStatus = calculateTimeStatus(card.deadline);
        switch (timeStatus.status) {
            case 'urgent':
                urgentCards.push(card);
                break;
            case 'approaching':
                warningCards.push(card);
                break;
            case 'sufficient':
                normalStatusCards.push(card);
                break;
            case 'expired':
                expiredCards.push(card);
                break;
        }
    });
    
    return {
        pinned: pinnedCards,
        urgent: urgentCards,
        warning: warningCards,
        normal: normalStatusCards,
        expired: expiredCards
    };
}

// V1.7: 渲染单个状态分组
function renderStatusGroup(title, icon, cards, status) {
    if (cards.length === 0) {
        return '';
    }
    
    // 过期分组默认折叠
    const isExpired = status === 'expired';
    const isCollapsed = isExpired;
    const collapseClass = isCollapsed ? 'collapsed' : '';
    
    return `
        <section class="status-group">
            <h3 class="group-header ${collapseClass}" data-status="${status}">
                ${icon} ${title} (${cards.length})
            </h3>
            <div class="group-grid ${collapseClass}">
                ${cards.map(card => createCardHTML(card)).join('')}
            </div>
        </section>
    `;
}

// 渲染卡片
function renderCards(cards) {
    const container = document.getElementById('cards-container');
    
    // 防崩兜底：检查容器是否存在
    if (!container) {
        console.error('Cards container not found');
        return;
    }
    
    // V1.7: 按状态分组获取卡片
    const { pinned, urgent, warning, normal, expired } = getCardsByStatus();
    
    if (pinned.length === 0 && urgent.length === 0 && warning.length === 0 && normal.length === 0 && expired.length === 0) {
        // 渲染空状态提示，带重置筛选按钮
        container.innerHTML = `
            <div style="text-align: center; color: #7f8c8d; grid-column: 1/-1; padding: 40px;">
                <p style="font-size: 1.2rem; margin-bottom: 20px;">暂无相关信息</p>
                <button onclick="resetFilters()" style="
                    padding: 10px 20px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    🔄 重置所有筛选
                </button>
            </div>
        `;
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 依次渲染各个状态分组
    let html = '';
    
    // 渲染置顶分组
    html += renderStatusGroup('置顶', '📌', pinned, 'pinned');
    
    // 渲染紧急分组
    html += renderStatusGroup('紧急', '🔥', urgent, 'urgent');
    
    // 渲染临近分组
    html += renderStatusGroup('临近', '⚠️', warning, 'warning');
    
    // 渲染充足分组
    html += renderStatusGroup('充足', '🕒', normal, 'normal');
    
    // 渲染已过期分组
    html += renderStatusGroup('已过期', '⛔', expired, 'expired');
    
    // 添加到容器
    container.innerHTML = html;
    
    // 绑定分组标题点击事件（用于折叠/展开）
    setupGroupHeaderInteractions();
    
    // 绑定卡片交互事件
    setupCardInteractions();
    
    // V1.1: 更新仪表盘统计
    updateDashboardStats();
    updateDashboardBadges();
}

// 创建单个卡片的 HTML
function createCardHTML(card) {
    const isValidUrl = /^https?:\/\//i.test(card.sourceUrl);
    const btnClass = isValidUrl ? 'source-btn' : 'source-btn disabled';
    const sourceInfo = getSourceInfo(card.sourceKey);
    
    // V0.5: 计算时间状态
    const timeStatus = calculateTimeStatus(card.deadline);
    
    // V1.2: 计算个人节奏样式类
    const paceClass = getCardPaceClass(card);
    
    // 组合所有卡片样式类
    let cardClass = 'card';
    if (timeStatus.status === 'expired') {
        cardClass += ' card-expired';
    }
    if (paceClass) {
        cardClass += ` ${paceClass}`;
    }
    
    // V2.6.7: 添加紧迫程度样式类
    const urgency = getUrgency(card.deadline);
    cardClass += ` ${urgency.className}`;
    
    const titleClass = timeStatus.status === 'expired' ? 'card-title card-title-expired' : 'card-title';
    
    // V0.5: 解析受众标签
    const targetUsers = card.targetUser ? card.targetUser.split(',').map(u => u.trim()) : [];
    const targetUserTags = targetUsers.map(user => 
        `<span class="target-user-tag">${user}</span>`
    ).join('');
    
    // V0.6: 星标状态
    const starred = isStarred(card.id);
    const starIcon = starred ? '⭐' : '☆';
    const starClass = starred ? 'star-btn starred' : 'star-btn';
    
    // V1.6: 置顶状态
    const pinned = isPinned(card.id);
    const pinIcon = pinned ? '📌' : '📌';
    const pinClass = pinned ? 'pin-btn pinned' : 'pin-btn';
    
    // V1.6: 已读状态
    const read = isRead(card.id);
    let readTitleClass = titleClass;
    if (read && !pinned) {
        readTitleClass += ' card-title-read';
    }
    
    // 组合所有卡片样式类
    if (pinned) {
        cardClass += ' card-pinned';
    }
    if (read && !pinned) {
        cardClass += ' card-read';
    }
    
    // V0.6: 行动步骤
    let stepsHTML = '';
    if (card.steps && card.steps.length > 0) {
        stepsHTML = `
            <div class="info-item" style="margin-top: 12px;">
                <span class="info-label">具体步骤</span>
                <ul class="action-steps">
                    ${card.steps.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // 渲染 note 内容
    let noteHTML = '';
    if (card.note) {
        noteHTML = `
            <div class="card-note">
                ${card.note}
            </div>
        `;
    }
    
    // V0.9: 省级信息标签
            const isProvince = card.school !== 'CDUT';
            const provinceTag = isProvince ? '<span class="province-tag">[省级]</span>' : '';
            
            // policyLevel 标签生成
            let policyTag = '';
            if (card.policyLevel === 'national') {
                policyTag = '<span class="level-tag national-tag">【国策】</span>';
            } else if (card.policyLevel === 'provincial') {
                policyTag = '<span class="level-tag provincial-tag">【省厅】</span>';
            } else if (card.policyLevel === 'municipal') {
                policyTag = '<span class="level-tag municipal-tag">【市级】</span>';
            }
            
            // 级别标签生成
            let levelTag = '';
            if (card.level === 'national') {
                levelTag = '<span class="level-tag national-tag">【国策】</span>';
            } else if (card.level === 'provincial') {
                levelTag = '<span class="level-tag provincial-tag">【省厅】</span>';
            } else if (card.level === 'university') {
                levelTag = '<span class="level-tag university-tag">【校级】</span>';
            } else if (card.level === 'college') {
                levelTag = '<span class="level-tag college-tag">【院级】</span>';
            }
            
            // tracks Chips 生成
            let tracksHTML = '';
            if (card.tracks && Array.isArray(card.tracks) && card.tracks.length > 0) {
                tracksHTML = `
                    <div class="tracks-chips">
                        ${card.tracks.map(track => `<span class="track-chip">${track}</span>`).join('')}
                    </div>
                `;
            }
            
            // 格式化截止日期，用于移动端折叠状态显示
            const formattedDeadline = formatDate(card.deadline);
            
            // 一次性诊断日志：输出前5条数据的日期解析结果
            if (window.cardDiagnosticCount === undefined) {
                window.cardDiagnosticCount = 0;
            }
            if (window.cardDiagnosticCount < 5) {
                console.log(`[Card ${window.cardDiagnosticCount + 1}]`);
                console.log(`  原始 deadline: ${card.deadline}`);
                const parsedDate = parseDateSafe(card.deadline);
                console.log(`  解析结果: ${parsedDate ? parsedDate.toISOString().split('T')[0] : '无效'}`);
                console.log(`  diffDays: ${timeStatus.daysLeft}`);
                console.log(`  最终 urgency: ${urgency.label}`);
                window.cardDiagnosticCount++;
            }
            
            // 生成层级标签：优先使用policyLevel，其次使用level
            let finalLevelTag = policyTag || levelTag;
            
            // 生成D-天数显示
            let daysLeftDisplay = '';
            if (timeStatus.daysLeft !== null) {
                if (timeStatus.daysLeft < 0) {
                    daysLeftDisplay = ` (已过期 ${Math.abs(timeStatus.daysLeft)} 天)`;
                } else {
                    daysLeftDisplay = ` (D-${timeStatus.daysLeft})`;
                }
            }
            
            // 判断当前视图模式
            if (currentViewMode === 'compact') {
                // 紧凑视图：单行结构
                return `
            <div class="${cardClass}" data-id="${card.id}" data-deadline="${formattedDeadline}">
                <div class="compact-row">
                    <div class="compact-left">
                        <!-- 紧迫程度标签 -->
                        <span class="urgency-badge">${urgency.label}</span>
                        <!-- 层级标签 -->
                        ${finalLevelTag}
                    </div>
                    <div class="compact-center">
                        <h2 class="${readTitleClass}">${provinceTag}${card.title}</h2>
                    </div>
                    <div class="compact-right" style="font-variant-numeric: tabular-nums;">
                        ${formattedDeadline}${daysLeftDisplay}
                    </div>
                </div>
            </div>
        `;
            } else {
                // 详细视图：原有结构
                return `
            <div class="${cardClass}" data-id="${card.id}" data-deadline="${formattedDeadline}">
                <div class="card-header">
                    <div class="card-header-left">
                        <span class="category-tag category-${card.type}">${card.type}</span>
                        <h2 class="${readTitleClass}">${provinceTag}${policyTag}${levelTag}${card.title}</h2>
                        ${targetUserTags ? `<div class="target-user-tags">${targetUserTags}</div>` : ''}
                        ${tracksHTML}
                    </div>
                    <button class="${pinClass}" data-id="${card.id}" title="置顶/取消置顶">
                        ${pinIcon}
                    </button>
                    <button class="${starClass}" data-id="${card.id}" title="关注/取消关注">
                        ${starIcon}
                    </button>
                    <div class="time-status ${timeStatus.className}">${timeStatus.label}</div>
                </div>
                
                <div class="card-urgency-info">
                    <span class="urgency-badge">${urgency.label} | ${formatDate(card.deadline)}</span>
                </div>
                
                <div class="card-actions">
                    <button class="copy-btn" data-id="${card.id}">📋 复制分享</button>
                    <button class="expand-btn" data-id="${card.id}">展开详情 ▼</button>
                </div>
                
                <div class="card-content">
                    <div class="diagnosis">${card.diagnosis}</div>
                    
                    <div class="info-item">
                        <span class="info-label">截止时间</span>
                        <span class="info-value">${formatDate(card.deadline)}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">信息来源</span>
                        <span class="info-value">${sourceInfo.name}（${sourceInfo.confidence}）${getConfidenceHtml(getConfidenceLevel(card.sourceKey))}</span>
                    </div>
                    
                    <div class="expandable-content" data-id="${card.id}">
                        <div class="info-item" style="margin-top: 12px;">
                            <span class="info-label">下一步建议</span>
                            <span class="info-value">${card.action}</span>
                        </div>
                        
                        ${stepsHTML}
                        
                        <div class="info-item">
                            <span class="info-label">信息依据</span>
                            <span class="info-value">${card.evidence}</span>
                        </div>
                    </div>
                </div>
                
                ${noteHTML}
                
                <div class="card-footer">
                    ${createSourceButton(card)}
                </div>
            </div>
        `;
            }
}

// URL 规范化函数
function normalizeUrl(url, card = null) {
    if (!url) {
        return null;
    }
    
    // 已经带有协议头，原样返回
    if (/^https?:\/\//i.test(url)) {
        return url;
    }
    
    // 以 // 开头，补全 https:
    if (url.startsWith('//')) {
        return `https:${url}`;
    }
    
    // 看起来像域名（不含协议，但有 . 和可能的端口），补全 https://
    if (/^[a-zA-Z0-9][a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:\d+)?(\/.*)?$/.test(url)) {
        return `https://${url}`;
    }
    
    // 以 / 开头，尝试用该卡片的 source.domain 拼接
    if (url.startsWith('/') && card) {
        const sourceKey = card.sourceKey[0];
        const sourceInfo = window.sourcesData.find(s => s.key === sourceKey);
        if (sourceInfo && sourceInfo.domain) {
            const baseUrl = normalizeUrl(sourceInfo.domain);
            return `${baseUrl}${url}`;
        }
    }
    
    // 其他情况，原样返回
    return url;
}

// 深度链接校验函数
function isDeepLink(url, domain = '') {
    if (!url) return false;
    
    // 1. 检查假 ID 特征
    const fakeIdPatterns = ['1234', '5678', '9999'];
    if (fakeIdPatterns.some(pattern => url.includes(pattern))) return false;
    
    // 2. 如果 url 等于 domain，不是深度链接
    if (domain && url === domain) return false;
    
    // 解析 URL
    let urlObj;
    try {
        urlObj = new URL(url);
    } catch (e) {
        return false;
    }
    
    const pathname = urlObj.pathname;
    const hostname = urlObj.hostname;
    
    // 3. 如果路径为空或只有一个斜杠，但允许部分特殊情况
    if (!pathname || pathname === '/') {
        // 允许成都理工大学官网首页和教务处首页作为特殊情况
        const allowedHomepages = [
            'https://www.cdut.edu.cn/',
            'https://www.aao.cdut.edu.cn/'
        ];
        if (allowedHomepages.includes(url)) {
            return true;
        }
        return false;
    }
    
    // 4. 检查是否以 .htm 或 .html 或 / 结尾
    const endsWithValidExtension = /(\.htm|\.html|\/)$/.test(url);
    if (!endsWithValidExtension) return false;
    
    // 5. 检查是否包含具体路径特征
    const deepPathPatterns = ['.htm', '.html', '/info/', '/content/', '/detail/', '/news/', '/notice/'];
    const hasDeepPath = deepPathPatterns.some(pattern => url.includes(pattern));
    
    return hasDeepPath;
}

// 生成官网搜索链接
function getSearchLink(item) {
    // 使用 item 的 searchKeywords 作为搜索关键词，如果没有则使用默认关键词
    let keywords = item.searchKeywords || '';
    if (!keywords) {
        const type = item.type.toLowerCase();
        if (type.includes('升学')) {
            keywords = '考研 推免 招生';
        } else if (type.includes('竞赛')) {
            keywords = '学科竞赛 获奖';
        } else if (type.includes('就业')) {
            keywords = '招聘 就业 实习';
        } else if (type.includes('关键节点')) {
            keywords = '通知 公告';
        } else {
            keywords = '通知';
        }
    }
    
    let query;
    if (item.level === 'university') {
        // 校级 (CORE)：site:cdut.edu.cn [searchKeywords] (全校范围精准搜)
        query = encodeURIComponent(`site:cdut.edu.cn ${keywords}`);
    } else {
        // 院级 (College)：成都理工大学 [source.name] [searchKeywords] (全网宽搜)
        const sourceKey = item.sourceKey[0];
        const sourceInfo = window.sourcesData.find(s => s.key === sourceKey);
        const sourceName = sourceInfo ? sourceInfo.name : '';
        query = encodeURIComponent(`成都理工大学 ${sourceName} ${keywords}`);
    }
    
    return `https://www.baidu.com/s?wd=${query}`;
}

// 创建来源按钮
function createSourceButton(card) {
    // 统一按钮文本：🔍 搜官网 | {searchKeywords}
    const searchBtnText = `🔍 搜官网 | ${card.searchKeywords || '通知'}`;
    
    // 构建搜索链接
    let searchScope = '';
    const keywords = card.searchKeywords || '通知';
    
    if (card.policyLevel === 'national' || card.policyLevel === 'provincial' || card.level === 'national' || card.level === 'provincial') {
        // policyLevel 有值 (national/provincial) 或 level 为 national/provincial -> 全网搜 (不限域名)
        searchScope = '';
    } else if (card.level === 'university') {
        // 校级 (CORE)：site:cdut.edu.cn [searchKeywords] (全校范围精准搜)
        searchScope = 'site:cdut.edu.cn';
    } else {
        // 院级 (College)：成都理工大学 [学院名] [searchKeywords] (全网宽搜)
        const sourceKey = card.sourceKey[0];
        const sourceInfo = window.sourcesData.find(s => s.key === sourceKey);
        const sourceName = sourceInfo ? sourceInfo.name : '';
        searchScope = `成都理工大学 ${sourceName}`;
    }
    
    let searchQuery = keywords;
    if (searchScope) {
        searchQuery = `${searchScope} ${keywords}`;
    }
    
    const encodedQuery = encodeURIComponent(searchQuery);
    const searchUrl = `https://www.baidu.com/s?wd=${encodedQuery}`;
    
    // 所有 home_only 卡片：只能有一个主按钮
    return `
        <div>
            <button class="source-btn home-only" 
                    onclick="window.open('${searchUrl}', '_blank');">
                ${searchBtnText}
            </button>
        </div>
    `;
}

// V1.7: 设置分组标题交互
function setupGroupHeaderInteractions() {
    document.querySelectorAll('.group-header').forEach(header => {
        header.addEventListener('click', () => {
            const group = header.closest('.status-group');
            const grid = group.querySelector('.group-grid');
            
            // 切换折叠状态
            header.classList.toggle('collapsed');
            grid.classList.toggle('collapsed');
        });
    });
}

// 设置卡片交互
function setupCardInteractions() {
    // V1.6: 移动端卡片折叠/展开功能
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            // 检查是否为移动端视图
            if (window.innerWidth >= 768) {
                return; // 桌面端不执行折叠/展开逻辑
            }
            
            // 检查是否点击了按钮，如果是则不执行折叠/展开
            if (e.target.closest('button') || e.target.closest('a')) {
                return;
            }
            
            // 切换卡片展开状态
            card.classList.toggle('expanded');
        });
    });
    
    // V0.6: 星标按钮
    document.querySelectorAll('.star-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();  // 防止事件冒泡
            const cardId = parseInt(e.currentTarget.dataset.id);
            const isNowStarred = toggleStar(cardId);
            
            // 更新按钮显示
            if (isNowStarred) {
                e.currentTarget.textContent = '⭐';
                e.currentTarget.classList.add('starred');
                showToast('⭐ 已添加到关注');
            } else {
                e.currentTarget.textContent = '☆';
                e.currentTarget.classList.remove('starred');
                showToast('已取消关注');
            }
            
            // 如果当前筛选是"只看关注"，需要重新渲染
            if (quickFilters.starred) {
                renderCards(getFilteredAndSortedCards());
            }
            
            // 标记为已读
            markAsRead(cardId);
        });
    });
    
    // V1.6: 置顶按钮
    document.querySelectorAll('.pin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();  // 防止事件冒泡
            const cardId = parseInt(e.currentTarget.dataset.id);
            const isNowPinned = togglePin(cardId);
            
            // 更新按钮显示和样式
            if (isNowPinned) {
                e.currentTarget.classList.add('pinned');
                showToast('📌 已置顶');
            } else {
                e.currentTarget.classList.remove('pinned');
                showToast('已取消置顶');
            }
            
            // 重新渲染卡片，确保置顶卡片显示在最上方
            renderCards(getFilteredAndSortedCards());
            
            // 标记为已读
            markAsRead(cardId);
        });
    });
    
    // 复制按钮
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();  // 防止事件冒泡
            const cardId = parseInt(e.target.dataset.id);
            const card = allCards.find(c => c.id === cardId);
            
            const shareText = `【${card.title}】\n${card.diagnosis}\n截止: ${formatDate(card.deadline)}\n链接: ${card.sourceUrl}`;
            
            try {
                await navigator.clipboard.writeText(shareText);
                showToast('✅ 内容已复制，可直接粘贴');
            } catch (err) {
                alert('复制失败，请手动复制以下内容：\n\n' + shareText);
            }
            
            // 标记为已读
            markAsRead(cardId);
        });
    });
    
    // 展开/收起按钮
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();  // 防止事件冒泡
            const cardId = e.target.dataset.id;
            const expandableContent = document.querySelector(`.expandable-content[data-id="${cardId}"]`);
            const isExpanded = expandableContent.classList.contains('expanded');
            
            if (isExpanded) {
                expandableContent.classList.remove('expanded');
                e.target.textContent = '展开详情 ▼';
            } else {
                expandableContent.classList.add('expanded');
                e.target.textContent = '收起详情 ▲';
            }
            
            // 标记为已读
            markAsRead(cardId);
        });
    });
    
    // V1.6: 卡片点击事件 - 标记为已读
    document.querySelectorAll('.card-title').forEach(title => {
        title.addEventListener('click', (e) => {
            e.stopPropagation();  // 防止事件冒泡
            const card = e.target.closest('.card');
            if (card) {
                const cardId = parseInt(card.dataset.id);
                markAsRead(cardId);
                // 更新标题样式
                e.target.classList.add('card-title-read');
            }
        });
    });
    
    // V1.6: 来源按钮点击事件 - 标记为已读
    document.querySelectorAll('.source-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();  // 防止事件冒泡
            const card = e.target.closest('.card');
            if (card) {
                const cardId = parseInt(card.dataset.id);
                markAsRead(cardId);
            }
        });
    });
    
    // V1.6: 百度搜索按钮点击事件 - 标记为已读
    document.querySelectorAll('.baidu-search-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();  // 防止事件冒泡
            const card = e.target.closest('.card');
            if (card) {
                const cardId = parseInt(card.dataset.id);
                markAsRead(cardId);
            }
        });
    });
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
}

// V0.7: 获取来源信息（支持多来源）
function getSourceInfo(sourceKey) {
    // 兼容旧数据：如果是字符串，转为数组
    const sourceKeys = Array.isArray(sourceKey) ? sourceKey : [sourceKey];
    
    const sources = sourceKeys
        .map(key => window.sourcesData.find(s => s.key === key))
        .filter(s => s != null);
    
    if (sources.length === 0) {
        return { name: '未知来源', confidence: '待核实', names: ['未知来源'] };
    }
    
    // 返回多来源信息
    return {
        name: sources.map(s => s.name).join(' · '),  // 用点号分隔多个来源
        confidence: sources[0].confidence,  // 使用第一个来源的可信度
        names: sources.map(s => s.name)
    };
}

// V0.4: Toast 提示功能
function showToast(message, duration = 2500) {
    // 创建或获取 toast 元素
    let toast = document.getElementById('global-toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // 设置消息内容
    toast.textContent = message;
    
    // 显示 toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 隐藏 toast
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// V0.7: 年度时间进度条
function setupYearProgress() {
    const progressText = document.getElementById('year-progress-text');
    
    if (!progressText) return;
    
    const today = new Date();
    const yearStart = new Date('2026-01-01');
    const yearEnd = new Date('2026-12-31');
    
    let percentage = 0;
    
    if (today < yearStart) {
        // 当前时间早于 2026 年
        percentage = 0;
    } else if (today > yearEnd) {
        // 当前时间晚于 2026 年
        percentage = 100;
    } else {
        // 当前时间在 2026 年内
        const totalDays = 365;  // 2026 年是平年
        const passedDays = Math.floor((today - yearStart) / (1000 * 60 * 60 * 24));
        percentage = Math.floor((passedDays / totalDays) * 100);
    }
    
    // 生成进度条视觉效果
    const barLength = 10;
    const filledLength = Math.floor((percentage / 100) * barLength);
    const progressBar = '▮'.repeat(filledLength) + '▯'.repeat(barLength - filledLength);
    
    // 更新显示文案
    progressText.textContent = `2026 余额已消耗 ${percentage}%  ${progressBar}`;
}

// V1.1: 设置顶部情报仪表盘
function setupDashboard() {
    updateDashboardStats();
    
    // 紧急徽章点击事件
    document.getElementById('dashboard-urgent').addEventListener('click', () => {
        const urgentCheckbox = document.getElementById('filter-urgent');
        urgentCheckbox.checked = !urgentCheckbox.checked;
        urgentCheckbox.dispatchEvent(new Event('change'));
        updateDashboardBadges();
    });
    
    // 临近徽章点击事件
    document.getElementById('dashboard-approaching').addEventListener('click', () => {
        // 临近筛选需要自定义实现
        // 先实现紧急和关注，临近稍后
        alert('临近筛选功能开发中...');
    });
    
    // 关注徽章点击事件
    document.getElementById('dashboard-starred').addEventListener('click', () => {
        const starredCheckbox = document.getElementById('filter-starred');
        starredCheckbox.checked = !starredCheckbox.checked;
        starredCheckbox.dispatchEvent(new Event('change'));
        updateDashboardBadges();
    });
    
    // CDUT徽章点击事件
    document.getElementById('dashboard-cdut').addEventListener('click', () => {
        const cdutBtn = document.getElementById('cdut-only-btn');
        cdutBtn.click();
        updateDashboardBadges();
        updateSchoolSelect();
    });
    
    // V1.2: 个人节奏选择器事件
    setupPaceSelector();
}

// V1.1: 更新仪表盘统计数据
function updateDashboardStats() {
    // 计算紧急数量（7天内）
    const urgentCount = validCards.filter(card => {
        const status = calculateTimeStatus(card.deadline);
        return status.status === 'urgent';
    }).length;
    
    // 计算临近数量（8-30天）
    const approachingCount = validCards.filter(card => {
        const status = calculateTimeStatus(card.deadline);
        return status.status === 'approaching';
    }).length;
    
    // 获取关注数量
    const starredCount = getStarredIds().length;
    
    // 更新DOM
    document.getElementById('urgent-count').textContent = urgentCount;
    document.getElementById('approaching-count').textContent = approachingCount;
    document.getElementById('starred-count').textContent = starredCount;
}

// V1.1: 更新仪表盘徽章状态
function updateDashboardBadges() {
    const urgentCheckbox = document.getElementById('filter-urgent');
    const starredCheckbox = document.getElementById('filter-starred');
    const cdutBtn = document.getElementById('cdut-only-btn');
    
    // 更新紧急徽章
    const urgentBadge = document.getElementById('dashboard-urgent');
    urgentBadge.classList.toggle('active', urgentCheckbox.checked);
    
    // 更新关注徽章
    const starredBadge = document.getElementById('dashboard-starred');
    starredBadge.classList.toggle('active', starredCheckbox.checked);
    
    // 更新CDUT徽章
    const cdutBadge = document.getElementById('dashboard-cdut');
    const cdutStatus = document.getElementById('cdut-status');
    const isActive = cdutBtn.classList.contains('active');
    cdutBadge.classList.toggle('active', isActive);
    cdutStatus.textContent = isActive ? 'ON' : 'OFF';
}

// V1.1: 更新学校筛选联动
function updateSchoolSelect() {
    const cdutBtn = document.getElementById('cdut-only-btn');
    const schoolSelect = document.getElementById('school-select');
    const isActive = cdutBtn.classList.contains('active');
    
    if (isActive) {
        schoolSelect.value = 'CDUT';
    } else {
        schoolSelect.value = 'all';
    }
}

// V1.1: 设置开发者维护模式
function setupDeveloperMode() {
    const footer = document.querySelector('.data-stats');
    
    // 创建开发者模式元素
    const developerMode = document.createElement('div');
    developerMode.className = 'developer-mode';
    
    // 创建切换链接
    const toggleLink = document.createElement('a');
    toggleLink.className = 'developer-toggle';
    toggleLink.textContent = '[+ 数据维护]';
    toggleLink.href = '#';
    
    // 创建内容区域
    const content = document.createElement('div');
    content.className = 'developer-content';
    content.style.display = 'none';
    
    // 创建模板标题
    const templateTitle = document.createElement('h4');
    templateTitle.textContent = '数据模板';
    
    // 创建模板内容
    const template = document.createElement('div');
    template.className = 'developer-template';
    template.textContent = JSON.stringify({
        "id": Date.now(),
        "type": "升学",
        "school": "CDUT",
        "title": "标题",
        "diagnosis": "诊断内容",
        "action": "行动建议",
        "steps": ["步骤1", "步骤2"],
        "evidence": "信息来源依据",
        "deadline": "2026-12-31",
        "targetUser": "目标用户",
        "sourceUrl": "https://example.com",
        "sourceKey": ["jwc"],
        "priority": 1,
        "accessPolicy": "home_only"
    }, null, 2);
    
    // 创建sourceKey列表标题
    const sourceKeyTitle = document.createElement('h4');
    sourceKeyTitle.textContent = '可用的sourceKey';
    
    // 创建sourceKey列表
    const sourceKeyList = document.createElement('div');
    sourceKeyList.className = 'source-key-list';
    
    // 生成sourceKey列表
    window.sourcesData.forEach(source => {
        const item = document.createElement('div');
        item.className = 'source-key-item';
        item.innerHTML = `
            <span class="source-key">${source.key}</span>
            <span class="source-name">${source.name}</span>
        `;
        sourceKeyList.appendChild(item);
    });
    
    // 组装内容
    content.appendChild(templateTitle);
    content.appendChild(template);
    content.appendChild(sourceKeyTitle);
    content.appendChild(sourceKeyList);
    
    // 组装开发者模式
    developerMode.appendChild(toggleLink);
    developerMode.appendChild(content);
    
    // 添加到footer
    footer.appendChild(developerMode);
    
    // 切换显示/隐藏
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
        toggleLink.textContent = content.style.display === 'none' ? '[+ 数据维护]' : '[- 数据维护]';
    });
}

// V1.1: 自动计算可信度
function getConfidenceLevel(sourceKeys) {
    const highConfidenceKeys = ['jwc', 'aao', 'sc_edu', 'yjs', 'cdut_yjsy', 'sc_edt', 'cdut_xgb', 'cdut_tw'];
    
    for (const key of sourceKeys) {
        if (highConfidenceKeys.includes(key)) {
            return 'high';
        }
    }
    return 'normal';
}

// V1.1: 获取可信度显示HTML
function getConfidenceHtml(confidenceLevel) {
    if (confidenceLevel === 'high') {
        return '<span class="confidence-high">官方权威</span>';
    }
    return '';
}

// V1.2: 设置视图切换
function setupViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有活跃状态
            viewBtns.forEach(b => b.classList.remove('active'));
            // 设置当前按钮为活跃
            btn.classList.add('active');
            // 更新当前视图
            currentView = btn.dataset.view;
            // 重新渲染卡片
            renderCards(getFilteredAndSortedCards());
        });
    });
}

// V1.2: 设置个人节奏选择器
function setupPaceSelector() {
    const paceBtns = document.querySelectorAll('.pace-btn');
    paceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有活跃状态
            paceBtns.forEach(b => b.classList.remove('active'));
            // 设置当前按钮为活跃
            btn.classList.add('active');
            currentPace = btn.dataset.pace;
            // 重新渲染卡片
            renderCards(getFilteredAndSortedCards());
        });
    });
}

// V1.2: 根据个人节奏获取卡片样式类
function getCardPaceClass(card) {
    if (!currentPace) {
        return '';
    }
    
    const targetUser = card.targetUser || '';
    const type = card.type || '';
    
    // 检查是否匹配当前节奏
    let isMatch = false;
    
    switch (currentPace) {
        case 'freshman':
            isMatch = /大一|大二|新生|基础/.test(targetUser);
            break;
        case 'junior':
            isMatch = /大三|考研|准备|竞赛/.test(targetUser + type);
            break;
        case 'senior':
            isMatch = /大四|应届|毕业|就业|推免/.test(targetUser + type);
            break;
        default:
            isMatch = false;
    }
    
    return isMatch ? 'pace-match' : 'pace-mismatch';
}

// V1.2: 按月份分组卡片
function groupCardsByMonth(cards) {
    const grouped = {};
    
    cards.forEach(card => {
        const deadline = new Date(card.deadline);
        const yearMonth = `${deadline.getFullYear()}-${String(deadline.getMonth() + 1).padStart(2, '0')}`;
        
        if (!grouped[yearMonth]) {
            grouped[yearMonth] = [];
        }
        grouped[yearMonth].push(card);
    });
    
    // 按月份排序
    const sortedMonths = Object.keys(grouped).sort();
    const result = [];
    
    sortedMonths.forEach(month => {
        result.push({
            month: month,
            cards: grouped[month]
        });
    });
    
    return result;
}

// V1.2: 格式化月份显示
function formatMonthDisplay(month) {
    const [year, monthNum] = month.split('-');
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return `${year}年${monthNames[Number(monthNum) - 1]}`;
}

