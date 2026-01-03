// V1.8.2 高质量卡片生成脚本
const fs = require('fs');
const path = require('path');

// 定义文件路径
const diagnosisPath = path.join(__dirname, 'data', 'diagnosis.js');

// 手动定义学院列表（从sources.js中提取）
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

colleges.forEach(college => {
    const collegeName = college.name;
    const sourceKey = college.key;
    const domain = college.domain;
    
    console.log(`Generating cards for ${collegeName}...`);
    
    // 【卡片1｜官方】推免 / 保研细则入口（必有）
    cards.push({
        id: cardId++,
        type: "升学",
        school: "CDUT",
        title: `${collegeName} 本科生推免（保研）细则入口`,
        diagnosis: "本学院推免（保研）政策与流程的官方入口，通常在每年9月发布。具体条件以学院官网当年发布的推免通知为准。",
        action: "1. 访问学院官网；2. 查找'推免'或'保研'相关栏目；3. 关注当年推免细则的发布时间。",
        evidence: `${collegeName}官方发布`,
        deadline: "2026-09-25",
        targetUser: "大三/优等生",
        sourceUrl: domain,
        sourceKey: [sourceKey],
        priority: 2,
        accessPolicy: "home_only",
        verified: false
    });
    
    // 【卡片2｜官方】毕业论文 / 设计流程（必有）
    cards.push({
        id: cardId++,
        type: "关键节点",
        school: "CDUT",
        title: `${collegeName} 毕业论文（设计）流程与关键时间节点`,
        diagnosis: "涵盖本学院毕业论文（设计）的选题、开题、撰写、答辩等关键环节的官方流程与时间安排。",
        action: "1. 访问学院官网教学管理栏目；2. 查找毕业论文（设计）相关通知；3. 了解开题、中期检查、答辩等时间节点。",
        evidence: `${collegeName}官方发布`,
        deadline: "2026-05-30",
        targetUser: "大四/毕业生",
        sourceUrl: domain,
        sourceKey: [sourceKey],
        priority: 2,
        accessPolicy: "home_only",
        verified: false
    });
    
    // 【卡片3｜官方】学科竞赛 / 科研项目入口（必有）
    cards.push({
        id: cardId++,
        type: "竞赛",
        school: "CDUT",
        title: `${collegeName} 本科生学科竞赛与科研训练项目通知汇总`,
        diagnosis: "本学院重点支持的学科竞赛和科研训练项目的官方入口，包含报名条件、时间安排和奖励政策。",
        action: "1. 访问学院官网通知公告栏目；2. 关注竞赛和科研项目相关通知；3. 按照要求准备报名材料。",
        evidence: `${collegeName}官方发布`,
        deadline: "2026-12-31",
        targetUser: "全体本科生",
        sourceUrl: domain,
        sourceKey: [sourceKey],
        priority: 2,
        accessPolicy: "home_only",
        verified: false
    });
    
    // 【卡片4｜官方】培养方案 / 学分 / 考核制度（必有）
    cards.push({
        id: cardId++,
        type: "关键节点",
        school: "CDUT",
        title: `${collegeName} 本科培养方案与学分考核要求`,
        diagnosis: "本学院各专业的培养方案、学分要求和考核制度的官方说明，包含必修课程、选修课程和毕业要求。",
        action: "1. 访问学院官网教学管理栏目；2. 查找各专业培养方案；3. 核对毕业所需学分和课程要求。",
        evidence: `${collegeName}官方发布`,
        deadline: "2026-12-31",
        targetUser: "全体本科生",
        sourceUrl: domain,
        sourceKey: [sourceKey],
        priority: 2,
        accessPolicy: "home_only",
        verified: false
    });
    
    // 【卡片5｜辅助｜仅此一条】升学 / 考研经验解读（必有）
    cards.push({
        id: cardId++,
        type: "升学",
        school: "CDUT",
        title: `${collegeName} 升学与考研路径经验解读（参考）`,
        diagnosis: "基于往年公开信息整理，仅供参考，最终以学院当年通知为准。",
        action: "1. 了解学院往年推免和考研情况；2. 结合自身情况制定升学规划；3. 关注学院官方通知获取最新信息。",
        evidence: "基于往年公开信息整理",
        deadline: "2026-12-20",
        targetUser: "大三/考研党",
        sourceUrl: domain,
        sourceKey: [sourceKey],
        priority: 3,
        accessPolicy: "home_only",
        verified: false
    });
    
    // 【可选】为部分学院添加第六条卡片（官方信息）
    cards.push({
        id: cardId++,
        type: "关键节点",
        school: "CDUT",
        title: `${collegeName} 本科生实习与实践教学要求`,
        diagnosis: "本学院本科生实习、实践教学的官方要求和安排，包含实习时间、地点和考核方式。",
        action: "1. 访问学院官网教学管理栏目；2. 查找实习与实践教学相关通知；3. 按照要求完成实习任务。",
        evidence: `${collegeName}官方发布`,
        deadline: "2026-12-31",
        targetUser: "全体本科生",
        sourceUrl: domain,
        sourceKey: [sourceKey],
        priority: 2,
        accessPolicy: "home_only",
        verified: false
    });
});

// 合并锚点卡片和新生成的卡片
const finalData = [...anchorCards, ...cards];

// 生成最终的diagnosis.js文件内容
const finalContent = `// 信息诊断数据 - V1.8.2 高质量版
window.diagnosisData = ${JSON.stringify(finalData, null, 4)};
`;

// 写入diagnosis.js文件
fs.writeFileSync(diagnosisPath, finalContent, 'utf8');

console.log(`\nGenerated ${cards.length} cards for ${colleges.length} colleges`);
console.log(`Total cards: ${finalData.length}`);

// 验证每个学院的卡片数量
console.log('\n各学院卡片数量统计：');
colleges.forEach(college => {
    const collegeCards = finalData.filter(card => 
        card.title.includes(college.name)
    );
    console.log(`${college.name}: ${collegeCards.length}条`);
});

// 随机选择一个学院，列出其5条标题用于核查
const randomCollege = colleges[Math.floor(Math.random() * colleges.length)];
const randomCollegeCards = finalData.filter(card => 
    card.title.includes(randomCollege.name)
);
console.log(`\n随机抽查 - ${randomCollege.name}的卡片标题：`);
randomCollegeCards.slice(0, 5).forEach((card, index) => {
    console.log(`${index + 1}. ${card.title}`);
});

console.log('\nV1.8.2 内容重构完成！');
