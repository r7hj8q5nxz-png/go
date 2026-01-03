// 用于清洗诊断数据中假链接的脚本
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
let totalCards = window.diagnosisData.length;
let cleanedCards = 0;
let directBefore = 0;
let directAfter = 0;

// AI 幻觉特征正则表达式
const aiHallucinationPatterns = [
    /1234/g,
    /5678/g,
    /8888/g,
    /9999/g,
    /info\/1000\//g,
    /info\/\d+\/\d+\.htm/g  // 典型的整数 ID 模式
];

// 处理每个卡片
window.diagnosisData.forEach(card => {
    // 检查当前 accessPolicy
    const originalAccessPolicy = card.accessPolicy || 'direct';
    if (originalAccessPolicy === 'direct') {
        directBefore++;
    }
    
    // 只有 accessPolicy 为 direct 的卡片需要清洗
    if (originalAccessPolicy === 'direct') {
        let isFakeData = false;
        
        // 检查 sourceUrl 是否存在
        if (card.sourceUrl) {
            // 检查是否只是补全了协议的域名（没有深层路径）
            const urlObj = new URL(card.sourceUrl);
            if (urlObj.pathname === '/' || urlObj.pathname === '') {
                isFakeData = true;
            } else {
                // 检查是否包含 AI 幻觉特征
                for (const pattern of aiHallucinationPatterns) {
                    if (pattern.test(card.sourceUrl)) {
                        isFakeData = true;
                        break;
                    }
                }
            }
        }
        
        // 强制降级
        if (isFakeData) {
            card.accessPolicy = 'home_only';
            cleanedCards++;
        }
    }
    
    // 统计清理后的 direct 卡片数量
    if (card.accessPolicy === 'direct') {
        directAfter++;
    }
});

// 生成修改后的诊断数据内容
const diagnosisContent = `// 信息诊断数据 - V0.9.6 假数据清洗版
window.diagnosisData = ${JSON.stringify(window.diagnosisData, null, 4)};
`;

// 保存修改后的诊断数据
fs.writeFileSync('./data/diagnosis.js', diagnosisContent, 'utf8');

console.log('\n清洗完成！');
console.log(`共处理 ${totalCards} 条卡片`);
console.log(`清洗了 ${cleanedCards} 条包含 AI 幻觉特征的假数据`);
console.log(`清洗前 direct 卡片：${directBefore} 条`);
console.log(`清洗后 direct 卡片：${directAfter} 条`);
