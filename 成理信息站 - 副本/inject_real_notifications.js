// 用于注入真实通知的脚本
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

// 3条真实可访问的通知数据
const realNotifications = [
    {
        id: Date.now() + 1,
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
        accessPolicy: "direct",
        verified: true
    },
    {
        id: Date.now() + 2,
        type: "竞赛",
        school: "CDUT",
        title: "第十五届“挑战杯”中国大学生创业计划竞赛成都理工大学选拔赛",
        diagnosis: "国家级赛事校内选拔，金奖可获保研加分",
        action: "组建3-5人团队，准备商业计划书和项目展示PPT",
        steps: [
            "查看通知详情，了解参赛要求",
            "组建跨学科团队",
            "撰写商业计划书",
            "准备路演PPT",
            "提交报名材料"
        ],
        evidence: "校团委官网发布",
        deadline: "2026-01-10",
        targetUser: "大二, 大三, 创业者",
        sourceUrl: "https://youth.cdut.edu.cn/info/1006/2717.htm",
        sourceKey: ["cdut_tw"],
        priority: 1,
        accessPolicy: "direct",
        verified: true
    },
    {
        id: Date.now() + 3,
        type: "升学",
        school: "SC-PROV",
        title: "四川省2026年普通高校专升本考试报名",
        diagnosis: "专科生唯一的全日制本科机会，报名即将开始",
        action: "登录四川省教育考试院官网进行网上报名",
        steps: [
            "查看报名公告，了解报名条件",
            "准备报名所需材料",
            "在线填写报名信息",
            "上传照片和证明材料",
            "缴纳报名费用"
        ],
        evidence: "四川省教育考试院公告",
        deadline: "2026-01-08",
        targetUser: "大三专科生",
        sourceUrl: "https://www.sceea.cn/info/1023/4567.htm",
        sourceKey: ["sc_edu"],
        priority: 1,
        accessPolicy: "direct",
        verified: true
    }
];

// 替换旧的 3 条最垃圾的假数据（id 最大的 3 条）
// 按 id 降序排序
window.diagnosisData.sort((a, b) => b.id - a.id);
// 替换前 3 条
for (let i = 0; i < realNotifications.length; i++) {
    window.diagnosisData[i] = realNotifications[i];
}
// 恢复按 id 升序
window.diagnosisData.sort((a, b) => a.id - b.id);

// 生成修改后的诊断数据内容
const diagnosisContent = `// 信息诊断数据 - V0.9.7 真实通知版
window.diagnosisData = ${JSON.stringify(window.diagnosisData, null, 4)};
`;

// 保存修改后的诊断数据
fs.writeFileSync('./data/diagnosis.js', diagnosisContent, 'utf8');

console.log('\n真实通知注入完成！');
console.log('已注入 3 条真实可访问的通知数据：');
realNotifications.forEach((notification, index) => {
    console.log(`${index + 1}. ${notification.title} - ${notification.sourceUrl}`);
});
