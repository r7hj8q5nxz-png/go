// 生成高质量卡片的脚本
const fs = require('fs');
const path = require('path');

// 定义文件路径
const diagnosisPath = path.join(__dirname, 'data', 'diagnosis.js');

// 手动定义学院列表
const colleges = [
    { key: 'wfxy', name: '文法学院', domain: 'https://wfxy.cdut.edu.cn' },
    { key: 'cist', name: '信息科学与技术学院', domain: 'http://www.cist.cdut.edu.cn' },
    { key: 'mee', name: '机电工程学院', domain: 'https://mee.cdut.edu.cn' },
    { key: 'cmcc', name: '材料与化学化工学院', domain: 'https://cmcc.cdut.edu.cn' },
    { key: 'ces', name: '地球科学学院', domain: 'https://ces.cdut.edu.cn' },
    { key: 'cim', name: '管理科学学院', domain: 'https://cim.cdut.edu.cn' },
    { key: 'math', name: '数学科学学院', domain: 'https://math.cdut.edu.cn' },
    { key: 'wyxy', name: '外国语学院', domain: 'https://wyxy.cdut.edu.cn' },
    { key: 'csxy', name: '传播科学与艺术学院', domain: 'https://csxy.cdut.edu.cn' },
    { key: 'ne', name: '核技术与自动化工程学院', domain: 'https://ne.cdut.edu.cn' },
    { key: 'hxtm', name: '环境与土木工程学院', domain: 'https://hxtm.cdut.edu.cn' },
    { key: 'nyxy', name: '能源学院', domain: 'https://nyxy.cdut.edu.cn' },
    { key: 'stxy', name: '生态环境学院', domain: 'https://stxy.cdut.edu.cn' },
    { key: 'tyxy', name: '体育学院', domain: 'https://tyxy.cdut.edu.cn' },
    { key: 'lyxy', name: '旅游与城乡规划学院', domain: 'https://lyxy.cdut.edu.cn' },
    { key: 'dqwxy', name: '地球物理学院', domain: 'https://dqwxy.cdut.edu.cn' },
    { key: 'cjdz', name: '沉积地质研究院', domain: 'https://cjdz.cdut.edu.cn' },
    { key: 'dzdc', name: '地质调查研究院', domain: 'https://dzdc.cdut.edu.cn' },
    { key: 'mksxy', name: '马克思主义学院', domain: 'https://mksxy.cdut.edu.cn' }
];

console.log(`Found ${colleges.length} colleges`);

// 生成卡片数据
let cards = [];
let cardId = 1000; // 从1000开始递增

colleges.forEach(college => {
    const collegeName = college.name;
    const sourceKey = college.key;
    
    // 卡片1：推免/保研情报 (The Golden Ticket)
    cards.push({
        id: cardId++,
        type: "升学",
        school: "CDUT",
        title: `${collegeName} 本科生推免规则与往届去向参考`,
        diagnosis: "通常依据前三年必修课加权成绩 + 综合测评分。保研率通常在 15%-20% 左右（参考往年）。",
        action: "1. 核算前五学期加权平均分；2. 准备夏令营文书（6月启动）；3. 关注学院官网“推免细则”公示。",
        deadline: "2026-09-25",
        targetUser: "大三/优等生",
        sourceUrl: college.domain,
        sourceKey: [sourceKey],
        priority: 3,
        accessPolicy: "home_only",
        verified: false
    });
    
    // 卡片2：考研避坑指南 (The Battlefield)
    cards.push({
        id: cardId++,
        type: "升学",
        school: "CDUT",
        title: `${collegeName} 考研专业课与复试机制分析`,
        diagnosis: "成都理工大部分理工科专业不歧视双非，保护一志愿。复试通常包含笔试+面试，重视本科科研经历。",
        action: "1. 确认专业课代码（数一/数二）；2. 提前联系导师（部分专业）；3. 查阅近三年复试分数线。",
        deadline: "2026-12-20",
        targetUser: "大三/考研党",
        sourceUrl: college.domain,
        sourceKey: [sourceKey],
        priority: 3,
        accessPolicy: "home_only",
        verified: false
    });
    
    // 卡片3：毕业/学位红线 (The Red Line)
    cards.push({
        id: cardId++,
        type: "关键节点",
        school: "CDUT",
        title: `${collegeName} 毕业论文(设计)与学位授予红线`,
        diagnosis: "严查查重率（通常要求<20%或15%）。必修学分与第二课堂学分必须修满。",
        action: "1. 核对教务系统学分；2. 确认论文开题/中期/答辩时间节点；3. 提前进行论文查重。",
        deadline: "2026-05-30",
        targetUser: "大四/毕业生",
        sourceUrl: college.domain,
        sourceKey: [sourceKey],
        priority: 3,
        accessPolicy: "home_only",
        verified: false
    });
});

// 手动定义锚点卡片
const anchorCards = [
    {
        "id": 9002,
        "type": "关键节点",
        "school": "CDUT",
        "title": "成都理工大学教务处规章",
        "diagnosis": "成都理工大学教务处的机构设置、办事指南和规章制度信息",
        "action": "了解教务处的办事流程和相关规章制度",
        "steps": [
            "访问成都理工大学教务处官网",
            "查看机构设置和办事指南",
            "了解相关规章制度"
        ],
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["jwc"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": true
    },
    {
        "id": 9001,
        "type": "关键节点",
        "school": "CDUT",
        "title": "学校简介",
        "diagnosis": "成都理工大学的学校概况、历史沿革、学科建设等基本信息",
        "action": "了解学校的基本情况和学科建设",
        "evidence": "成都理工大学官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cdut.edu.cn",
        "sourceKey": ["cdut"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": true
    }
];

// 合并锚点卡片和新生成的卡片
const finalData = [...anchorCards, ...cards];

// 生成最终的diagnosis.js文件内容
const finalContent = `// 信息诊断数据 - V1.8 硬核情报版
window.diagnosisData = ${JSON.stringify(finalData, null, 4)};
`;

// 写入diagnosis.js文件
fs.writeFileSync(diagnosisPath, finalContent, 'utf8');

console.log(`Generated ${cards.length} cards for ${colleges.length} colleges`);
console.log(`Total cards: ${finalData.length}`);

// 验证核技术与自动化工程学院的卡片
const neCards = finalData.filter(card => 
    card.title.includes('核技术与自动化工程学院')
);
console.log('\n核技术与自动化工程学院的卡片标题：');
neCards.forEach(card => {
    console.log(`- ${card.title}`);
});
