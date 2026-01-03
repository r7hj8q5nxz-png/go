// 验证卡片链接是否有效
const fs = require('fs');
const path = require('path');

// 读取 diagnosis.js 文件
const diagnosisPath = path.join(__dirname, 'data', 'diagnosis.js');
const diagnosisContent = fs.readFileSync(diagnosisPath, 'utf8');

// 读取 sources.js 文件
const sourcesPath = path.join(__dirname, 'data', 'sources.js');
const sourcesContent = fs.readFileSync(sourcesPath, 'utf8');

// 提取所有有效的 sourceKey
const validSourceKeys = [];
const sourceKeyRegex = /key:\s*"([^"]+)"/g;
let match;
while ((match = sourceKeyRegex.exec(sourcesContent)) !== null) {
    validSourceKeys.push(match[1]);
}

console.log('=== 有效 sourceKey 列表 ===');
console.log(validSourceKeys.join(', '));
console.log('\n=== 验证卡片链接 ===');

// 提取诊断数据中的所有 sourceKey
const diagnosisSourceKeys = [];
const diagnosisKeyRegex = /"sourceKey":\s*\[\s*"([^"]+)"/g;
let diagnosisMatch;
while ((diagnosisMatch = diagnosisKeyRegex.exec(diagnosisContent)) !== null) {
    diagnosisSourceKeys.push(diagnosisMatch[1]);
}

// 验证每个 sourceKey 是否有效
let validCount = 0;
let invalidCount = 0;

diagnosisSourceKeys.forEach((sourceKey, index) => {
    if (validSourceKeys.includes(sourceKey)) {
        console.log(`✅ 卡片 ${index + 1} - sourceKey: ${sourceKey} - 有效`);
        validCount++;
    } else {
        console.error(`❌ 卡片 ${index + 1} - sourceKey: ${sourceKey} - 无效`);
        invalidCount++;
    }
});

console.log('\n=== 验证结果 ===');
console.log(`总卡片数: ${diagnosisSourceKeys.length}`);
console.log(`有效链接: ${validCount}`);
console.log(`无效链接: ${invalidCount}`);

if (invalidCount === 0) {
    console.log('✅ 所有卡片链接都有效！');
} else {
    console.log('❌ 部分卡片链接无效！');
}
