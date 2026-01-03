const https = require('https');

// 目标URL
const url = 'https://www.cdut.edu.cn/jgsz/jxdw.htm';

// 发送HTTPS GET请求
https.get(url, (res) => {
    let data = '';

    // 接收数据
    res.on('data', (chunk) => {
        data += chunk;
    });

    // 数据接收完毕
    res.on('end', () => {
        try {
            // 输出页面前2000个字符，查看实际页面结构
            console.log('页面前2000字符：');
            console.log(data.substring(0, 2000));
            
        } catch (error) {
            console.error('解析HTML出错:', error);
        }
    });

}).on('error', (error) => {
    console.error('请求失败:', error);
});