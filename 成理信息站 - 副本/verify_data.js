// 验证诊断数据的数量和结构
const fs = require('fs');
const path = require('path');

// 读取 diagnosis.js 文件
const diagnosisPath = path.join(__dirname, 'data', 'diagnosis.js');
const content = fs.readFileSync(diagnosisPath, 'utf8');

// 简单统计卡片数量
const totalCards = (content.match(/\{\s*"id":/g) || []).length;
console.log('总数据条数:', totalCards);

// 统计锚点卡片数量
const anchorCards = (content.match(/"verified":\s*true/g) || []).length;
console.log('锚点卡片数量:', anchorCards);

// 统计校级卡片数量
const universityCards = (content.match(/"level":\s*"university"/g) || []).length;
console.log('校级卡片数量:', universityCards);

// 统计院级卡片数量
const collegeCards = (content.match(/"level":\s*"college"/g) || []).length;
console.log('院级卡片数量:', collegeCards);

// 统计文法学院卡片数量
const wfxyCards = (content.match(/"sourceKey":\s*\[\s*"wfxy"/g) || []).length;
console.log('文法学院卡片数量:', wfxyCards);

// 统计CDUT-CORE卡片数量（不包括锚点）
const cdutCoreCards = universityCards - anchorCards;
console.log('CDUT-CORE 卡片数量:', cdutCoreCards);

// 验证所有卡片都有必需的字段
const requiredFields = ['level', 'searchKeywords', 'accessPolicy', 'sourceKey'];
const hasAllFields = requiredFields.every(field => {
    // 检查是否有卡片缺少该字段
    const missingField = new RegExp(`\{[^}]*?(?!"${field}":)[^}]*?\}`, 'gs');
    const matches = content.match(missingField);
    return !matches || matches.length === 0;
});

if (hasAllFields) {
    console.log('所有卡片都包含必需的字段');
} else {
    console.error('部分卡片缺少必需的字段');
}

// 输出验证结果
console.log('\n=== 验证结果 ===');
if (anchorCards === 2 && cdutCoreCards === 10 && collegeCards === 6) {
    console.log('✅ 所有验证通过！');
    console.log(`✅ 总数据条数: ${totalCards} (2锚点 + 10校级 + 6院级)`);
    console.log(`✅ 校级卡片数量: ${universityCards} (2锚点 + 10 CDUT-CORE)`);
    console.log(`✅ 院级卡片数量: ${collegeCards}`);
    console.log(`✅ 文法学院卡片数量: ${wfxyCards}`);
} else {
    console.log('❌ 验证失败！');
    if (anchorCards !== 2) {
        console.log(`❌ 锚点卡片数量应为 2，实际为 ${anchorCards}`);
    }
    if (cdutCoreCards !== 10) {
        console.log(`❌ CDUT-CORE卡片数量应为 10，实际为 ${cdutCoreCards}`);
    }
    if (collegeCards !== 6) {
        console.log(`❌ 院级卡片数量应为 6，实际为 ${collegeCards}`);
    }
    if (wfxyCards !== 6) {
        console.log(`❌ 文法学院卡片数量应为 6，实际为 ${wfxyCards}`);
    }
}
