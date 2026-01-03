// 生成学院差异化数据脚本 - 最终版
const fs = require('fs');
const path = require('path');

// 学院列表（直接从sources.js中提取）
const collegeSources = [
    { key: "cist", name: "信息科学与技术学院" },
    { key: "mee", name: "机电工程学院" },
    { key: "cmcc", name: "材料与化学化工学院" },
    { key: "ces", name: "地球科学学院" },
    { key: "cim", name: "管理科学学院" },
    { key: "math", name: "数学科学学院" },
    { key: "wyxy", name: "外国语学院" },
    { key: "csxy", name: "传播科学与艺术学院" },
    { key: "ne", name: "核技术与自动化工程学院" },
    { key: "hxtm", name: "环境与土木工程学院" },
    { key: "nyxy", name: "能源学院" },
    { key: "stxy", name: "生态环境学院" },
    { key: "tyxy", name: "体育学院" },
    { key: "lyxy", name: "旅游与城乡规划学院" },
    { key: "dqwxy", name: "地球物理学院" },
    { key: "cjdz", name: "沉积地质研究院" },
    { key: "dzdc", name: "地质调查研究院" },
    { key: "mksxy", name: "马克思主义学院" }
];

console.log('=== 学院列表 ===');
console.log(collegeSources.map(source => `${source.key}: ${source.name}`).join('\n'));
console.log(`\n学院数量: ${collegeSources.length}`);

// 生成随机 deadline
const months = [3, 5, 6, 9, 11];
function generateRandomDeadline() {
    const month = months[Math.floor(Math.random() * months.length)];
    const day = Math.floor(Math.random() * 28) + 1;
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `2026-${formattedMonth}-${formattedDay}`;
}

// 生成第6条差异化卡片
function generateDifferentiatedCard(学院名, sourceKey, id) {
    let type, title, keywords;
    
    if (学院名.includes('商') || 学院名.includes('管') || 学院名.includes('经')) {
        // 财经类
        type = '证书';
        title = `${学院名} 会计/金融类职业资格支持政策`;
        keywords = '证书 CPA ACCA';
    } else if (学院名.includes('外语')) {
        // 外语类
        type = '证书';
        title = `${学院名} 专四/专八考试报名与安排`;
        keywords = '专四 专八 报名';
    } else if (学院名.includes('艺术') || 学院名.includes('传播') || 学院名.includes('体育')) {
        // 艺体类
        type = '艺体';
        title = `${学院名} 专业展演与专业赛事通知`;
        keywords = '展演 比赛 作品';
    } else {
        // 理工科
        type = '认证';
        title = `${学院名} 工程教育认证与专业技能等级`;
        keywords = '工程认证 技能大赛';
    }
    
    return {
        id,
        type,
        level: 'college',
        school: 'CDUT',
        title,
        diagnosis: `${title}，请关注学院官网获取详细信息`,
        searchKeywords: keywords,
        action: `查看${学院名}官网的相关通知，了解具体要求和时间安排`,
        evidence: `${学院名}官方发布`,
        deadline: generateRandomDeadline(),
        targetUser: `${学院名}学生`,
        sourceUrl: `https://${sourceKey}.cdut.edu.cn`,
        sourceKey: [sourceKey],
        priority: 2,
        accessPolicy: 'home_only',
        verified: false,
        status: 'sufficient'
    };
}

// 生成学院卡片
let newCards = [];
let nextId = 3000; // 从3000开始分配新ID

collegeSources.forEach(source => {
    const 学院名 = source.name;
    const sourceKey = source.key;
    
    console.log(`\n=== 生成 ${学院名} 卡片 ===`);
    
    // 标准5条卡片
    const standardCards = [
        {
            id: nextId++,
            type: '升学',
            level: 'college',
            school: 'CDUT',
            title: `${学院名} 本科生推免(保研)实施细则`,
            diagnosis: `${学院名}2026年推免生选拔细则和流程`,
            searchKeywords: '推免 细则 综合测评',
            action: `查看${学院名}官网的推免通知，了解学院具体选拔条件`,
            evidence: `${学院名}官方发布`,
            deadline: generateRandomDeadline(),
            targetUser: `${学院名}大三学生`,
            sourceUrl: `https://${sourceKey}.cdut.edu.cn`,
            sourceKey: [sourceKey],
            priority: 2,
            accessPolicy: 'home_only',
            verified: false,
            status: 'approaching'
        },
        {
            id: nextId++,
            type: '考研',
            level: 'college',
            school: 'CDUT',
            title: `${学院名} 考研复试录取与调剂公告`,
            diagnosis: `${学院名}2026年考研复试录取与调剂公告`,
            searchKeywords: '复试 调剂 录取',
            action: `查看${学院名}官网的复试通知，了解调剂政策和流程`,
            evidence: `${学院名}官方发布`,
            deadline: generateRandomDeadline(),
            targetUser: `${学院名}考研学生`,
            sourceUrl: `https://${sourceKey}.cdut.edu.cn`,
            sourceKey: [sourceKey],
            priority: 2,
            accessPolicy: 'home_only',
            verified: false,
            status: 'urgent'
        },
        {
            id: nextId++,
            type: '节点',
            level: 'college',
            school: 'CDUT',
            title: `${学院名} 毕业论文(设计)工作安排`,
            diagnosis: `${学院名}2026年毕业论文(设计)工作安排和要求`,
            searchKeywords: '毕业论文 查重 答辩',
            action: `查看${学院名}官网的毕业论文通知，了解查重要求和时间节点`,
            evidence: `${学院名}官方发布`,
            deadline: generateRandomDeadline(),
            targetUser: `${学院名}大四学生`,
            sourceUrl: `https://${sourceKey}.cdut.edu.cn`,
            sourceKey: [sourceKey],
            priority: 2,
            accessPolicy: 'home_only',
            verified: false,
            status: 'approaching'
        },
        {
            id: nextId++,
            type: '竞赛',
            level: 'college',
            school: 'CDUT',
            title: `${学院名} 学科竞赛与科研项目通知`,
            diagnosis: `${学院名}2026年学科竞赛与科研项目通知`,
            searchKeywords: '学科竞赛 科研',
            action: `查看${学院名}官网的竞赛通知，了解报名条件和时间`,
            evidence: `${学院名}官方发布`,
            deadline: generateRandomDeadline(),
            targetUser: `${学院名}学生`,
            sourceUrl: `https://${sourceKey}.cdut.edu.cn`,
            sourceKey: [sourceKey],
            priority: 2,
            accessPolicy: 'home_only',
            verified: false,
            status: 'sufficient'
        },
        {
            id: nextId++,
            type: '教务',
            level: 'college',
            school: 'CDUT',
            title: `${学院名} 本科人才培养方案与学分核查`,
            diagnosis: `${学院名}本科人才培养方案与学分核查通知`,
            searchKeywords: '培养方案 学分',
            action: `查看${学院名}官网的培养方案，了解专业课程要求`,
            evidence: `${学院名}官方发布`,
            deadline: generateRandomDeadline(),
            targetUser: `${学院名}学生`,
            sourceUrl: `https://${sourceKey}.cdut.edu.cn`,
            sourceKey: [sourceKey],
            priority: 2,
            accessPolicy: 'home_only',
            verified: false,
            status: 'sufficient'
        }
    ];
    
    // 添加差异化第6条
    const differentiatedCard = generateDifferentiatedCard(学院名, sourceKey, nextId++);
    const collegeCards = [...standardCards, differentiatedCard];
    
    newCards = newCards.concat(collegeCards);
    console.log(`生成 ${学院名} 卡片 ${collegeCards.length} 条`);
});

console.log('\n=== 生成结果 ===');
console.log(`学院数量: ${collegeSources.length}`);
console.log(`每条学院生成卡片数: 6`);
console.log(`新生成卡片总数: ${newCards.length}`);

// 保护的卡片（锚点卡片、校级卡片和文法学院卡片）
const protectedCards = [
    // 锚点卡片
    {
        "id": 9002,
        "type": "关键节点",
        "level": "university",
        "school": "CDUT",
        "title": "成都理工大学教务处规章",
        "diagnosis": "成都理工大学教务处的机构设置、办事指南和规章制度信息",
        "searchKeywords": "教务处 规章",
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
        "level": "university",
        "school": "CDUT",
        "title": "学校简介",
        "diagnosis": "成都理工大学的学校概况、历史沿革、学科建设等基本信息",
        "searchKeywords": "学校简介",
        "action": "了解学校的基本情况和学科建设",
        "evidence": "成都理工大学官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cdut.edu.cn",
        "sourceKey": ["cdut"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": true
    },
    // 全校通用信息 (CDUT-CORE)
    {
        "id": 1001,
        "type": "教务",
        "level": "university",
        "school": "CDUT",
        "title": "转专业实施细则",
        "diagnosis": "成都理工大学转专业的实施细则和申请流程，适用于全校各专业学生",
        "searchKeywords": "转专业 实施细则",
        "action": "访问教务处官网，查找转专业实施细则，了解申请条件和流程",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-03-15",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["jwc"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "urgent"
    },
    {
        "id": 1002,
        "type": "证书",
        "level": "university",
        "school": "CDUT",
        "title": "大学英语四六级报名通知",
        "diagnosis": "成都理工大学2026年大学英语四六级考试报名通知和相关要求",
        "searchKeywords": "CET 报名 通知",
        "action": "关注教务处官网，及时了解四六级报名时间和流程",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-04-20",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["jwc"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching"
    },
    {
        "id": 1003,
        "type": "教务",
        "level": "university",
        "school": "CDUT",
        "title": "补考与重修安排",
        "diagnosis": "成都理工大学2026年补考与重修的安排和相关要求",
        "searchKeywords": "补考 重修 安排",
        "action": "查看教务处官网的补考与重修通知，了解考试时间和地点",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-03-10",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["jwc"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "urgent"
    },
    {
        "id": 1004,
        "type": "教务",
        "level": "university",
        "school": "CDUT",
        "title": "辅修/双学位申请指南",
        "diagnosis": "成都理工大学辅修/双学位的申请条件和流程",
        "searchKeywords": "辅修 学位",
        "action": "查看教务处官网的辅修/双学位通知，了解申请要求和时间",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-04-30",
        "targetUser": "大二/大三学生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["jwc"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false
    },
    {
        "id": 1005,
        "type": "升学",
        "level": "university",
        "school": "CDUT",
        "title": "全校推免生选拔通告",
        "diagnosis": "成都理工大学2026年推荐免试攻读硕士学位研究生的选拔通知",
        "searchKeywords": "推荐免试 通知",
        "action": "关注教务处官网的推免通知，了解选拔条件和流程",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-09-15",
        "targetUser": "大三学生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["jwc"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false
    },
    {
        "id": 1006,
        "type": "升学",
        "level": "university",
        "school": "CDUT",
        "title": "硕士研究生考试考场安排",
        "diagnosis": "成都理工大学2026年硕士研究生考试的考场安排和注意事项",
        "searchKeywords": "硕士 考场 安排",
        "action": "查看研究生院官网的考场安排通知，了解考试地点和时间",
        "evidence": "成都理工大学研究生院官方发布",
        "deadline": "2026-12-20",
        "targetUser": "考研学生",
        "sourceUrl": "https://www.gra.cdut.edu.cn",
        "sourceKey": ["cdut_yjsy"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false
    },
    {
        "id": 1007,
        "type": "就业",
        "level": "university",
        "school": "CDUT",
        "title": "选调生选拔公告",
        "diagnosis": "2026年四川省选调生选拔公告和相关要求",
        "searchKeywords": "选调生",
        "action": "查看就业网的选调生通知，了解报名条件和流程",
        "evidence": "成都理工大学就业网官方发布",
        "deadline": "2026-10-30",
        "targetUser": "应届毕业生",
        "sourceUrl": "https://jy.cdut.edu.cn",
        "sourceKey": ["jyw"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false
    },
    {
        "id": 1008,
        "type": "就业",
        "level": "university",
        "school": "CDUT",
        "title": "双选会/招聘会通知",
        "diagnosis": "成都理工大学2026年双选会和招聘会的安排和相关要求",
        "searchKeywords": "双选会 招聘",
        "action": "关注就业网的双选会通知，了解参会企业和时间",
        "evidence": "成都理工大学就业网官方发布",
        "deadline": "2026-11-15",
        "targetUser": "应届毕业生",
        "sourceUrl": "https://jy.cdut.edu.cn",
        "sourceKey": ["jyw"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false
    },
    {
        "id": 1009,
        "type": "留学",
        "level": "university",
        "school": "CDUT",
        "title": "出国交流项目申请",
        "diagnosis": "成都理工大学2026年出国交流项目的申请条件和流程",
        "searchKeywords": "交流 项目",
        "action": "查看国际处官网的交流项目通知，了解申请要求和时间",
        "evidence": "成都理工大学国际处官方发布",
        "deadline": "2026-05-20",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cdut.edu.cn",
        "sourceKey": ["jwc"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false
    },
    {
        "id": 1010,
        "type": "节点",
        "level": "university",
        "school": "CDUT",
        "title": "2026-2027学年校历与放假通知",
        "diagnosis": "成都理工大学2026-2027学年的校历和放假安排",
        "searchKeywords": "校历 放假",
        "action": "查看学校办公室官网的校历通知，了解教学周和放假时间",
        "evidence": "成都理工大学学校办公室官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cdut.edu.cn",
        "sourceKey": ["jwc"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false
    },
    // 文法学院差异化信息 (College-Specific)
    {
        "id": 2001,
        "type": "升学",
        "level": "college",
        "school": "CDUT",
        "title": "文法学院推免细则",
        "diagnosis": "成都理工大学文法学院2026年推免生选拔细则和流程",
        "searchKeywords": "推免 细则",
        "action": "查看文法学院官网的推免通知，了解学院具体选拔条件",
        "evidence": "成都理工大学文法学院官方发布",
        "deadline": "2026-09-20",
        "targetUser": "文法学院大三学生",
        "sourceUrl": "https://wfxy.cdut.edu.cn",
        "sourceKey": ["wfxy"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching"
    },
    {
        "id": 2002,
        "type": "证书",
        "level": "college",
        "school": "CDUT",
        "title": "法律职业资格考试指南",
        "diagnosis": "法律职业资格考试的报名条件和备考指南，适用于法学专业学生",
        "searchKeywords": "法律职业资格",
        "action": "查看文法学院官网的法考通知，了解考试时间和备考建议",
        "evidence": "成都理工大学文法学院官方发布",
        "deadline": "2026-06-30",
        "targetUser": "法学专业学生",
        "sourceUrl": "https://wfxy.cdut.edu.cn",
        "sourceKey": ["wfxy"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false
    },
    {
        "id": 2003,
        "type": "节点",
        "level": "college",
        "school": "CDUT",
        "title": "文法学院毕业论文红线",
        "diagnosis": "文法学院毕业论文的查重要求和答辩红线",
        "searchKeywords": "毕业论文 查重",
        "action": "查看文法学院官网的毕业论文通知，了解查重要求和时间节点",
        "evidence": "成都理工大学文法学院官方发布",
        "deadline": "2026-05-15",
        "targetUser": "文法学院大四学生",
        "sourceUrl": "https://wfxy.cdut.edu.cn",
        "sourceKey": ["wfxy"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "urgent"
    },
    {
        "id": 2004,
        "type": "竞赛",
        "level": "college",
        "school": "CDUT",
        "title": "模拟法庭/口译大赛通知",
        "diagnosis": "文法学院2026年模拟法庭和口译大赛的报名通知",
        "searchKeywords": "学科竞赛",
        "action": "查看文法学院官网的竞赛通知，了解报名条件和时间",
        "evidence": "成都理工大学文法学院官方发布",
        "deadline": "2026-04-10",
        "targetUser": "文法学院学生",
        "sourceUrl": "https://wfxy.cdut.edu.cn",
        "sourceKey": ["wfxy"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false
    },
    {
        "id": 2005,
        "type": "考研",
        "level": "college",
        "school": "CDUT",
        "title": "法硕复试调剂指南",
        "diagnosis": "法律硕士研究生复试调剂的相关信息和指南",
        "searchKeywords": "复试 调剂",
        "action": "查看文法学院官网的复试通知，了解调剂政策和流程",
        "evidence": "成都理工大学文法学院官方发布",
        "deadline": "2026-03-30",
        "targetUser": "法学专业考研学生",
        "sourceUrl": "https://wfxy.cdut.edu.cn",
        "sourceKey": ["wfxy"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false
    },
    {
        "id": 2006,
        "type": "教务",
        "level": "college",
        "school": "CDUT",
        "title": "文法学院培养方案",
        "diagnosis": "成都理工大学文法学院各专业的培养方案和课程设置",
        "searchKeywords": "培养方案",
        "action": "查看文法学院官网的培养方案，了解专业课程要求",
        "evidence": "成都理工大学文法学院官方发布",
        "deadline": "2026-12-31",
        "targetUser": "文法学院学生",
        "sourceUrl": "https://wfxy.cdut.edu.cn",
        "sourceKey": ["wfxy"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false
    }
];

console.log('\n=== 资产保护结果 ===');
console.log(`保留卡片数: ${protectedCards.length}`);

// 合并所有卡片
const finalCards = [...protectedCards, ...newCards];

console.log('\n=== 最终结果 ===');
console.log(`总卡片数: ${finalCards.length}`);
console.log(`预计总卡片数: ${protectedCards.length} + ${collegeSources.length} * 6 = ${protectedCards.length + collegeSources.length * 6}`);

// 验证新生成的卡片
const validationResult = {
    missingKeywords: 0,
    wrongLevel: 0
};

newCards.forEach(card => {
    if (!card.searchKeywords) {
        validationResult.missingKeywords++;
    }
    if (card.level !== 'college') {
        validationResult.wrongLevel++;
    }
});

console.log('\n=== 验证结果 ===');
console.log(`缺少 searchKeywords: ${validationResult.missingKeywords}`);
console.log(`level 错误: ${validationResult.wrongLevel}`);

if (validationResult.missingKeywords === 0 && validationResult.wrongLevel === 0) {
    console.log('✅ 所有新生成卡片验证通过！');
} else {
    console.log('❌ 新生成卡片存在问题，请检查！');
}

// 写入新的 diagnosis.js 文件
const diagnosisPath = path.join(__dirname, 'data', 'diagnosis.js');
const newDiagnosisContent = `// 信息诊断数据 - V1.9.6 全量学院版
window.diagnosisData = ${JSON.stringify(finalCards, null, 4)};`;

fs.writeFileSync(diagnosisPath, newDiagnosisContent, 'utf8');

console.log('\n=== 写入结果 ===');
console.log(`已成功写入 ${diagnosisPath}`);
console.log(`新文件大小: ${newDiagnosisContent.length} 字节`);

// 输出核技术与自动化工程学院的第6条卡片标题
const neCards = newCards.filter(card => card.sourceKey && card.sourceKey.includes('ne'));
if (neCards.length >= 6) {
    const ne6thCard = neCards[5]; // 第6条卡片（索引5）
    console.log(`\n=== 核技术与自动化工程学院第6条卡片 ===`);
    console.log(`标题: ${ne6thCard.title}`);
}
