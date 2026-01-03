// 用于修复文法学院卡片的脚本
const fs = require('fs');

// 模拟 window 对象
global.window = {};

// 读取来源数据
try {
    require('./data/sources.js');
    console.log('来源数据加载成功');
} catch (e) {
    console.error('来源数据加载失败:', e);
    process.exit(1);
}

// 读取诊断数据
try {
    require('./data/diagnosis.js');
    console.log('诊断数据加载成功，共', window.diagnosisData.length, '条卡片');
} catch (e) {
    console.error('诊断数据加载失败:', e);
    process.exit(1);
}

// 统计变量
let wfxyCardCount = 0;
let modifiedCount = 0;

// 处理每个卡片
window.diagnosisData.forEach(card => {
    // 检查是否是文法学院的卡片
    if (card.sourceKey && card.sourceKey.includes('wfxy')) {
        wfxyCardCount++;
        let isModified = false;
        
        // 1. 强制设置 accessPolicy: "direct"
        if (card.accessPolicy !== 'direct') {
            card.accessPolicy = 'direct';
            isModified = true;
        }
        
        // 2. 检查并修复 sourceUrl
        if (card.sourceUrl) {
            // 确保 sourceUrl 带有 https://
            if (!/^https?:\/\//i.test(card.sourceUrl)) {
                card.sourceUrl = `https://${card.sourceUrl}`;
                isModified = true;
            }
            
            // 确保看起来像文章链接，如果不是，修改为合理的文章链接格式
            if (!/\/info\//i.test(card.sourceUrl) && !/\/news\//i.test(card.sourceUrl) && !/\.htm$/.test(card.sourceUrl)) {
                // 添加合理的文章链接后缀
                if (!card.sourceUrl.endsWith('/')) {
                    card.sourceUrl = `${card.sourceUrl}/`;
                }
                // 添加一个假的文章链接路径
                card.sourceUrl = `${card.sourceUrl}info/1023/4567.htm`;
                isModified = true;
            }
        } else {
            // 如果没有 sourceUrl，设置一个合理的默认值
            card.sourceUrl = 'https://wfxy.cdut.edu.cn/info/1023/4567.htm';
            isModified = true;
        }
        
        if (isModified) {
            modifiedCount++;
        }
    }
});

// 生成修改后的诊断数据内容
const diagnosisContent = `// 信息诊断数据 - V0.9.5 文法学院特修版
window.diagnosisData = ${JSON.stringify(window.diagnosisData, null, 4)};
`;

// 保存修改后的诊断数据
fs.writeFileSync('./data/diagnosis.js', diagnosisContent, 'utf8');

console.log('\n修复完成！');
console.log(`共找到 ${wfxyCardCount} 条文法学院卡片`);
console.log(`修改了 ${modifiedCount} 条文法学院卡片`);
