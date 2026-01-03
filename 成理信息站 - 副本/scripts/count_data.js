const fs = require('fs');

// 移除 JavaScript 文件中的注释
function removeComments(code) {
    // 移除单行注释
    let result = code.replace(/\/\/.*$/gm, '');
    // 移除多行注释
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    return result;
}

// 读取并处理 sources.js 文件
const sourcesContent = fs.readFileSync('./data/sources.js', 'utf8');
const cleanedSourcesContent = removeComments(sourcesContent);
const sourcesMatch = cleanedSourcesContent.match(/window\.sourcesData\s*=\s*(\[.*?\]);/);

if (sourcesMatch) {
    const sourcesJsonStr = sourcesMatch[1];
    const sourcesData = JSON.parse(sourcesJsonStr);
    
    // 统计学院数量
    const colleges = sourcesData.filter(item => 
        item.name.includes('学院') && 
        !item.name.includes('就业') && 
        !item.name.includes('学工') && 
        !item.name.includes('团委') && 
        !item.name.includes('图书馆') && 
        !item.name.includes('研究生')
    );
    
    console.log('=== 学院统计 ===');
    console.log('总学院数量:', colleges.length);
    console.log('学院列表:');
    colleges.forEach((college, index) => {
        console.log(`${index + 1}. ${college.name} (${college.key}) - ${college.domain}`);
    });
}

// 读取并处理 diagnosis.js 文件
const diagnosisContent = fs.readFileSync('./data/diagnosis.js', 'utf8');
const cleanedDiagnosisContent = removeComments(diagnosisContent);
const diagnosisMatch = cleanedDiagnosisContent.match(/window\.diagnosisData\s*=\s*(\[.*?\]);/);

if (diagnosisMatch) {
    const diagnosisJsonStr = diagnosisMatch[1];
    const diagnosisData = JSON.parse(diagnosisJsonStr);
    
    console.log('\n=== 数据统计 ===');
    console.log('总数据量:', diagnosisData.length);
    
    // 统计各学院的卡片数量
    const collegeCardCount = {};
    
    diagnosisData.forEach(card => {
        // 提取学院简称
        const collegeMatch = card.title.match(/【(.*?)】/);
        if (collegeMatch) {
            const collegeName = collegeMatch[1];
            collegeCardCount[collegeName] = (collegeCardCount[collegeName] || 0) + 1;
        }
    });
    
    console.log('\n=== 各学院卡片数量 ===');
    Object.entries(collegeCardCount).sort(([a], [b]) => a.localeCompare(b)).forEach(([college, count]) => {
        console.log(`${college}: ${count} 条`);
    });
}
