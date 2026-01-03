// 用于执行全量降级的脚本
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

// 统计变量
let totalCards = window.diagnosisData.length;
let downgradedCount = 0;
let verifiedCount = 0;

// 处理每个卡片
window.diagnosisData.forEach(card => {
    // 只有 verified: true 的卡片才能保留 direct
    if (card.verified !== true) {
        // 强制降级
        if (card.accessPolicy !== 'home_only') {
            card.accessPolicy = 'home_only';
            downgradedCount++;
        }
    } else {
        verifiedCount++;
    }
});

// 生成修改后的诊断数据内容
const diagnosisContent = `// 信息诊断数据 - V0.9.7 全量降级版
window.diagnosisData = ${JSON.stringify(window.diagnosisData, null, 4)};
`;

// 保存修改后的诊断数据
fs.writeFileSync('./data/diagnosis.js', diagnosisContent, 'utf8');

console.log('\n全量降级完成！');
console.log(`共处理 ${totalCards} 条卡片`);
console.log(`降级了 ${downgradedCount} 条卡片为 home_only`);
console.log(`保留了 ${verifiedCount} 条 verified: true 的卡片`);
