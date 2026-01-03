// 用于更新诊断数据的 accessPolicy 脚本
const fs = require('fs');

// 模拟 window 对象
global.window = {};

// 读取来源数据
try {
    require('./data/sources.js');
    console.log('来源数据加载成功，共', window.sourcesData.length, '条来源');
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

// 构建来源策略映射
const sourcePolicyMap = {};
window.sourcesData.forEach(source => {
    sourcePolicyMap[source.key] = source.defaultPolicy;
});

// 统计变量
let homeOnlyCount = 0;
let directCount = 0;

// 处理每个卡片
window.diagnosisData.forEach(card => {
    // 获取卡片的 sourceKey
    const sourceKey = card.sourceKey[0];
    // 获取对应的 defaultPolicy
    const defaultPolicy = sourcePolicyMap[sourceKey] || 'direct';
    
    // 根据 defaultPolicy 设置 accessPolicy
    if (defaultPolicy === 'home_only') {
        card.accessPolicy = 'home_only';
        homeOnlyCount++;
    } else {
        // B 类来源，保留 direct，但检查 articleUrl 是否合法
        card.accessPolicy = 'direct';
        directCount++;
    }
});

// 生成修改后的诊断数据内容
const diagnosisContent = `// 信息诊断数据 - V0.9.4 策略分层版
window.diagnosisData = ${JSON.stringify(window.diagnosisData, null, 4)};
`;

// 保存修改后的诊断数据
fs.writeFileSync('./data/diagnosis.js', diagnosisContent, 'utf8');

console.log('\n修改完成！');
console.log(`共处理 ${window.diagnosisData.length} 条卡片`);
console.log(`其中 ${homeOnlyCount} 条卡片设置为 accessPolicy: home_only`);
console.log(`其中 ${directCount} 条卡片设置为 accessPolicy: direct`);
console.log(`橙色按钮比例: ${Math.round((homeOnlyCount / window.diagnosisData.length) * 100)}%`);
