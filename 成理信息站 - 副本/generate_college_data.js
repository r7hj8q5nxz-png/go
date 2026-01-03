// 生成学院差异化数据脚本
const fs = require('fs');
const path = require('path');

// 读取 sources.js 文件
const sourcesPath = path.join(__dirname, 'data', 'sources.js');
const sourcesContent = fs.readFileSync(sourcesPath, 'utf8');

// 读取 diagnosis.js 文件
const diagnosisPath = path.join(__dirname, 'data', 'diagnosis.js');
const diagnosisContent = fs.readFileSync(diagnosisPath, 'utf8');

// 提取并清理 sourcesData
const sourcesMatch = sourcesContent.match(/window\.sourcesData\s*=\s*(\[.*?\]);/s);
if (!sourcesMatch) {
    console.error('无法提取 sourcesData');
    process.exit(1);
}

let sourcesJsonString = sourcesMatch[1];
sourcesJsonString = sourcesJsonString.replace(/\/\/.*$/gm, '');
sourcesJsonString = sourcesJsonString.replace(/\/\*[\s\S]*?\*\//g, '');
const sourcesData = JSON.parse(sourcesJsonString);

// 提取并清理 diagnosisData
const diagnosisMatch = diagnosisContent.match(/window\.diagnosisData\s*=\s*(\[.*?\]);/s);
if (!diagnosisMatch) {
    console.error('无法提取 diagnosisData');
    process.exit(1);
}

let diagnosisJsonString = diagnosisMatch[1];
diagnosisJsonString = diagnosisJsonString.replace(/\/\/.*$/gm, '');
diagnosisJsonString = diagnosisJsonString.replace(/\/\*[\s\S]*?\*\//g, '');
const diagnosisData = JSON.parse(diagnosisJsonString);

// 资产保护：保留需要的卡片
const protectedCards = diagnosisData.filter(card => {
    // 保留锚点卡片
    if (card.verified === true) {
        return true;
    }
    // 保留校级通用卡片
    if (card.level === 'university') {
        return true;
    }
    // 保留文法学院卡片
    if (card.sourceKey && card.sourceKey.includes('wfxy')) {
        return true;
    }
    return false;
});

console.log('=== 资产保护结果 ===');
console.log(`原始卡片数: ${diagnosisData.length}`);
console.log(`保留卡片数: ${protectedCards.length}`);

// 获取所有学院来源（除去文法学院和非学院来源）
const collegeSources = sourcesData.filter(source => {
    // 只保留学院来源，排除部门、省级、国家级来源
    return (
        (source.name.includes('学院') || source.name.includes('研究院')) &&
        source.key !== 'wfxy' &&
        source.key !== 'cdut' &&
        !source.name.includes('成都理工')
    );
});

console.log('\n=== 学院列表 ===');
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
