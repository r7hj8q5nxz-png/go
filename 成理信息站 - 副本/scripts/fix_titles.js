const fs = require('fs');

// 读取诊断数据文件
const filePath = './data/diagnosis.js';
const content = fs.readFileSync(filePath, 'utf8');

// 定义需要替换的学院简称与全称映射
const collegeMap = {
    '【文法院】': '文法学院',
    '【信科院】': '信息科学与技术学院',
    '【机电院】': '机电工程学院',
    '【材化院】': '材料与化学化工学院',
    '【地科院】': '地球科学学院',
    '【管科院】': '管理科学学院',
    '【数科院】': '数学科学学院',
    '【外院】': '外国语学院',
    '【传艺院】': '传播科学与艺术学院',
    '【核自院】': '核技术与自动化工程学院',
    '【环工院】': '环境与土木工程学院',
    '【能源院】': '能源学院',
    '【生态院】': '生态环境学院',
    '【体育院】': '体育学院'
};

// 批量替换标题
let modifiedContent = content;

Object.entries(collegeMap).forEach(([prefix, fullName]) => {
    // 使用更简单的字符串替换方法，避免正则表达式转义问题
    const searchString = `${prefix}${fullName}`;
    modifiedContent = modifiedContent.replace(new RegExp(searchString, 'g'), prefix);
});

// 写入修改后的内容
fs.writeFileSync(filePath, modifiedContent, 'utf8');

console.log('=== 标题修改完成 ===');
console.log('修改内容：已移除所有带有【学院简称】标题中的学院全称');
console.log('修改范围：所有14个学院的信息卡片');
console.log('修改文件：data/diagnosis.js');
