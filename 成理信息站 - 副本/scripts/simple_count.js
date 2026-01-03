const fs = require('fs');

// 读取 sources.js 文件
const sourcesContent = fs.readFileSync('./data/sources.js', 'utf8');

// 统计学院数量
const collegeCount = (sourcesContent.match(/学院/g) || []).length;
console.log('=== 学院统计 ===');
console.log('总学院数量:', collegeCount);

// 读取 diagnosis.js 文件
const diagnosisContent = fs.readFileSync('./data/diagnosis.js', 'utf8');

// 统计数据量
const dataCount = (diagnosisContent.match(/"id":/g) || []).length;
console.log('\n=== 数据统计 ===');
console.log('总数据量:', dataCount);

// 统计各学院的卡片数量
const collegeCardCount = {};

// 提取所有标题中的学院简称
const titles = diagnosisContent.match(/"title": "(.*?)"/g) || [];
titles.forEach(title => {
    const collegeMatch = title.match(/【(.*?)】/);
    if (collegeMatch) {
        const collegeName = collegeMatch[1];
        collegeCardCount[collegeName] = (collegeCardCount[collegeName] || 0) + 1;
    }
});

console.log('\n=== 各学院卡片数量 ===');
Object.entries(collegeCardCount).forEach(([college, count]) => {
    console.log(`${college}: ${count} 条`);
});
