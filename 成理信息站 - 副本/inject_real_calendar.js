// 用于注入真实校历数据的脚本
const fs = require('fs');

// 模拟 window 对象
global.window = {};

// 读取诊断数据
try {
    require('./data/diagnosis.js');
    console.log('诊断数据加载成功，共', window.diagnosisData.length, '条卡片');
} catch (e) {
    console.error('诊断数据加载失败:', e);
    process.exit(1);
}

// 检查是否已存在校历数据
let hasCalendar = false;
let calendarIndex = -1;

window.diagnosisData.forEach((card, index) => {
    if (card.title && card.title.includes('校历')) {
        hasCalendar = true;
        calendarIndex = index;
    }
});

// 真实校历数据
const realCalendarData = {
    id: hasCalendar ? window.diagnosisData[calendarIndex].id : Date.now(),
    type: "关键节点",
    school: "CDUT",
    title: "2025-2026学年校历",
    diagnosis: "学校已发布2025-2026学年完整校历，包含重要教学节点",
    action: "查看校历，了解本学期教学安排和放假时间",
    steps: [
        "登录成都理工大学教务处官网",
        "查看2025-2026学年校历",
        "记录重要时间节点，如考试周、放假时间等"
    ],
    evidence: "教务处官网发布，点击可查看完整校历",
    deadline: "2026-12-31",
    targetUser: "全体在校生",
    sourceUrl: "https://www.aao.cdut.edu.cn/info/1056/3906.htm",
    sourceKey: ["jwc"],
    priority: 1,
    accessPolicy: "direct"
};

// 更新或添加校历数据
if (hasCalendar) {
    // 更新现有校历数据
    window.diagnosisData[calendarIndex] = realCalendarData;
    console.log('已更新校历数据');
} else {
    // 添加新校历数据
    window.diagnosisData.unshift(realCalendarData);
    console.log('已添加新校历数据');
}

// 生成修改后的诊断数据内容
const diagnosisContent = `// 信息诊断数据 - V0.9.6 真实校历版
window.diagnosisData = ${JSON.stringify(window.diagnosisData, null, 4)};
`;

// 保存修改后的诊断数据
fs.writeFileSync('./data/diagnosis.js', diagnosisContent, 'utf8');

console.log('\n校历数据注入完成！');
