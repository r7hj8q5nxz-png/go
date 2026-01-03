// 生成 V2.6 可验证索引库数据脚本
const fs = require('fs');
const path = require('path');

// 读取现有数据，保留锚点卡片
const diagnosisPath = path.join(__dirname, 'data', 'diagnosis.js');
const diagnosisContent = fs.readFileSync(diagnosisPath, 'utf8');

// 锚点卡片
const anchorCards = [
    {
        "id": 9002,
        "type": "关键节点",
        "level": "university",
        "school": "CDUT",
        "title": "成都理工大学教务处规章",
        "diagnosis": "成都理工大学教务处的机构设置、办事指南和规章制度信息",
        "searchKeywords": "教务处 规章",
        "action": "了解教务处的办事流程和相关规章制度",
        "steps": [
            "访问成都理工大学教务处官网",
            "查看机构设置和办事指南",
            "了解相关规章制度"
        ],
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["jwc"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": true
    },
    {
        "id": 9001,
        "type": "关键节点",
        "level": "university",
        "school": "CDUT",
        "title": "学校简介",
        "diagnosis": "成都理工大学的学校概况、历史沿革、学科建设等基本信息",
        "searchKeywords": "学校简介",
        "action": "了解学校的基本情况和学科建设",
        "evidence": "成都理工大学官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cdut.edu.cn",
        "sourceKey": ["cdut"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": true
    }
];

// 第一步：注入【上位法】(CDUT-CORE 增量)
const nationalCards = [
    {
        "id": 10001,
        "type": "国策",
        "level": "national",
        "school": "CDUT",
        "title": "推荐免试研究生管理办法",
        "diagnosis": "教育部关于推荐优秀应届本科毕业生免试攻读硕士学位研究生的管理办法",
        "searchKeywords": "推荐免试 研究生 管理办法 教育部",
        "action": "搜索教育部推荐免试研究生管理办法，了解相关规定",
        "evidence": "中华人民共和国教育部官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.moe.gov.cn",
        "sourceKey": ["moe"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching"
    },
    {
        "id": 10002,
        "type": "国策",
        "level": "national",
        "school": "CDUT",
        "title": "学位论文抽检办法",
        "diagnosis": "教育部关于学位论文抽检的管理办法，不合格将撤销学位。",
        "searchKeywords": "学位论文 抽检 办法",
        "action": "搜索教育部学位论文抽检办法，了解相关规定",
        "evidence": "中华人民共和国教育部官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体毕业生",
        "sourceUrl": "https://www.moe.gov.cn",
        "sourceKey": ["moe"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "urgent"
    },
    {
        "id": 10003,
        "type": "省厅",
        "level": "provincial",
        "school": "CDUT",
        "title": "四川省选调生报考条件",
        "diagnosis": "四川省选调生考试的报考条件和相关政策。",
        "searchKeywords": "四川 选调生 报考 条件",
        "action": "搜索四川省选调生报考条件，了解相关规定",
        "evidence": "四川省人社厅官方发布",
        "deadline": "2026-11-30",
        "targetUser": "应届毕业生",
        "sourceUrl": "https://rst.sc.gov.cn",
        "sourceKey": ["sc_rsh"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching"
    },
    {
        "id": 10004,
        "type": "国策",
        "level": "national",
        "school": "CDUT",
        "title": "法律职业资格实施办法",
        "diagnosis": "司法部关于法律职业资格考试的实施办法。",
        "searchKeywords": "法律职业资格 实施办法",
        "action": "搜索法律职业资格实施办法，了解相关规定",
        "evidence": "中华人民共和国司法部官方发布",
        "deadline": "2026-12-31",
        "targetUser": "法学专业学生",
        "sourceUrl": "https://www.moj.gov.cn",
        "sourceKey": ["moe"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching"
    }
];

// 第二步：保留【校级】核心 (CDUT-CORE 存量) 并添加竞赛矩阵
const cdutCoreCards = [
    // 1. [红线] 毕业与学位 (生死线)
    {
        "id": 1001,
        "type": "毕业",
        "level": "university",
        "school": "CDUT",
        "title": "省教育厅论文抽检",
        "diagnosis": "拿到学位证也不安全！省教育厅每年进行\"学位论文抽检\"，不合格将撤销学位。",
        "searchKeywords": "学位论文 抽检 管理办法",
        "note": "💡 经验参考：抽检不仅仅查抄袭，还查格式和逻辑。理工科同学注意图表规范。",
        "action": "搜索省教育厅学位论文抽检管理办法，了解相关规定",
        "evidence": "四川省教育厅官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体毕业生",
        "sourceUrl": "https://www.sceea.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": []
    },
    {
        "id": 1002,
        "type": "毕业",
        "level": "university",
        "school": "CDUT",
        "title": "学士学位授予细则",
        "diagnosis": "必修/选修学分、GPA、处分情况是三大红线。",
        "searchKeywords": "学士学位 授予 细则",
        "note": "💡 经验参考：挂科超过一定数量或GPA过低将无法获得学士学位。",
        "action": "查看学士学位授予细则，了解授予条件",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": []
    },
    {
        "id": 1003,
        "type": "毕业",
        "level": "university",
        "school": "CDUT",
        "title": "毕业资格与图像采集",
        "diagnosis": "大四必做：新华社图像采集（毕业照）与教务系统毕业资格自查。缺一不可。",
        "searchKeywords": "毕业资格 审查 图像采集",
        "note": "💡 经验参考：新华社图像采集通常在 11 月进行，错过了会非常麻烦，可能导致拿不到证。",
        "action": "查看教务系统毕业资格审查通知，完成新华社图像采集",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-06-30",
        "targetUser": "大四学生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "urgent",
        "policyLevel": null,
        "tracks": []
    },

    // 2. [战略] 升学与发展
    {
        "id": 1004,
        "type": "荣誉",
        "level": "university",
        "school": "CDUT",
        "title": "四川省优秀毕业生",
        "diagnosis": "考\"紧缺选调生\"的核心门票。通常在毕业学年 10月 评选，竞争极惨烈。",
        "searchKeywords": "四川省 优秀毕业生 评选",
        "note": "💡 经验参考：这是考\"紧缺选调生\"的核心门票。评选时间通常在毕业学年上学期（10月左右）。",
        "action": "关注四川省优秀毕业生评选通知，准备相关材料",
        "evidence": "四川省教育厅官方发布",
        "deadline": "2026-10-31",
        "targetUser": "毕业学年学生",
        "sourceUrl": "https://www.sceea.cn",
        "sourceKey": ["aao"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": "provincial",
        "tracks": ["保研", "考公"]
    },
    {
        "id": 1005,
        "type": "升学",
        "level": "university",
        "school": "CDUT",
        "title": "研招网考场查询",
        "diagnosis": "考研报名、现场确认、考场安排，认准\"四川省教育考试院\"官方公告。",
        "searchKeywords": "硕士 报名 考点 公告",
        "action": "查看四川省教育考试院研招公告，了解报名流程",
        "evidence": "四川省教育考试院官方发布",
        "deadline": "2026-12-31",
        "targetUser": "考研学生",
        "sourceUrl": "https://www.sceea.cn",
        "sourceKey": ["yjs"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "urgent",
        "policyLevel": null,
        "tracks": ["考研"]
    },
    {
        "id": 1006,
        "type": "教务",
        "level": "university",
        "school": "CDUT",
        "title": "创新学分与第二课堂",
        "diagnosis": "创新学分不够？了解创新学分认定办法，获取额外学分。",
        "searchKeywords": "创新学分 认定",
        "note": "💡 经验参考：大四下学期才发现学分不够就晚了。建议大二大三多参加\"互联网+\"或讲座。",
        "action": "搜索创新学分认定办法，了解认定条件和流程",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-11-30",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["aao"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["教务", "竞赛"]
    },

    // 3. [工具] 高频索引 (非模拟工具)
    {
        "id": 1007,
        "type": "工具",
        "level": "university",
        "school": "CDUT",
        "title": "教务系统入口",
        "diagnosis": "官方查课表、查成绩、查空闲教室的唯一入口。",
        "searchKeywords": "教务管理系统 登录",
        "action": "搜索教务管理系统，直接登录查询课表和成绩",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "sufficient",
        "policyLevel": null,
        "tracks": []
    },
    {
        "id": 1008,
        "type": "工具",
        "level": "university",
        "school": "CDUT",
        "title": "GPA绩点计算规则",
        "diagnosis": "官方 GPA 算法是核心机密。下载《学分制管理规定》核算你的加权分。",
        "searchKeywords": "学分制 管理规定 绩点",
        "note": "💡 经验参考：别信第三方的计算器，下载官方 PDF 自己算最准。",
        "action": "搜索学分制管理规定，了解GPA计算规则",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["aao"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "sufficient",
        "policyLevel": null,
        "tracks": []
    },
    {
        "id": 1009,
        "type": "证书",
        "level": "university",
        "school": "CDUT",
        "title": "四六级(CET)报名",
        "diagnosis": "大学英语四六级考试报名通知，关注教务处公告。",
        "searchKeywords": "CET 报名 通知",
        "action": "搜索四六级报名通知，了解报名时间和流程",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-09-30",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["aao"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["证书"]
    },
    {
        "id": 1010,
        "type": "证书",
        "level": "university",
        "school": "CDUT",
        "title": "普通话水平测试",
        "diagnosis": "普通话水平测试报名通知，关注教务处公告。",
        "searchKeywords": "普通话 测试 报名",
        "action": "搜索普通话水平测试报名通知，了解报名时间和流程",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-10-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["aao"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["证书"]
    },
    {
        "id": 1011,
        "type": "红利",
        "level": "university",
        "school": "CDUT",
        "title": "支教团与行政保研",
        "diagnosis": "成绩不够硬保？\"研究生支教团\"和\"辅导员计划\"是你的弯道超车机会。",
        "searchKeywords": "支教团 招募 辅导员 专项",
        "action": "查看支教团和辅导员专项计划通知，了解报名条件",
        "evidence": "成都理工大学研究生院官方发布",
        "deadline": "2026-10-31",
        "targetUser": "大三学生",
        "sourceUrl": "https://www.gra.cdut.edu.cn",
        "sourceKey": ["yjs"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["保研"]
    },
    {
        "id": 1012,
        "type": "教务",
        "level": "university",
        "school": "CDUT",
        "title": "学籍异动与延毕",
        "diagnosis": "休学、复学、留级、退学预警。搞清楚\"最长修业年限\"是底线。",
        "searchKeywords": "学籍管理 实施细则 预警",
        "action": "查看学籍管理实施细则，了解学籍异动流程",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["aao"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": []
    },
    
    // ================== 竞赛矩阵 START ==================
    // A. 规则与国策层 (Authority)
    {
        "id": 2001,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国普通高校学科竞赛排行榜",
        "diagnosis": "教育部认可的权威竞赛排行榜，包含56项重要赛事，获奖可获创新学分和保研加分。",
        "searchKeywords": "学科竞赛 排行榜",
        "action": "搜索全国普通高校学科竞赛排行榜，了解权威赛事列表",
        "evidence": "中国高等教育学会官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cahe.edu.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "sufficient",
        "policyLevel": "national",
        "tracks": ["竞赛", "保研"]
    },
    {
        "id": 2002,
        "type": "双创",
        "level": "university",
        "school": "CDUT",
        "title": "大学生创新创业训练计划管理办法",
        "diagnosis": "国家级创新创业训练计划，包含创新训练项目、创业训练项目和创业实践项目三类。",
        "searchKeywords": "创新创业 训练计划 管理办法",
        "action": "搜索大学生创新创业训练计划管理办法，了解申报条件和流程",
        "evidence": "教育部官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.moe.gov.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "sufficient",
        "policyLevel": "national",
        "tracks": ["双创", "教务"]
    },
    {
        "id": 2003,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "CDUT 学科竞赛管理办法与加分细则",
        "diagnosis": "成都理工大学学科竞赛管理办法，明确了竞赛分类、加分标准和申报流程。",
        "searchKeywords": "学科竞赛 管理办法 加分",
        "note": "💡 经验参考：不同级别竞赛加分不同，国家级竞赛加分最多，可用于综合测评和保研。",
        "action": "查看成都理工大学学科竞赛管理办法，了解加分细则",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "sufficient",
        "policyLevel": null,
        "tracks": ["竞赛", "保研"]
    },
    
    // B. 认定与白名单层 (White List)
    {
        "id": 2004,
        "type": "教务",
        "level": "university",
        "school": "CDUT",
        "title": "创新学分认定办法",
        "diagnosis": "成都理工大学创新学分认定办法，明确了创新学分的获取途径和认定标准。",
        "searchKeywords": "创新学分 认定",
        "note": "💡 经验参考：参加学科竞赛、发表论文、获得专利等均可获得创新学分，毕业前需修满规定学分。",
        "action": "查看成都理工大学创新学分认定办法，了解认定标准",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["aao"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "sufficient",
        "policyLevel": null,
        "tracks": ["教务", "毕业"]
    },
    {
        "id": 2005,
        "type": "荣誉",
        "level": "university",
        "school": "CDUT",
        "title": "学科竞赛获奖名单公示",
        "diagnosis": "成都理工大学学科竞赛获奖名单公示，包含各级各类竞赛获奖情况。",
        "searchKeywords": "竞赛 获奖 名单 公示",
        "action": "关注成都理工大学教务处网站，查看学科竞赛获奖名单公示",
        "evidence": "成都理工大学教务处官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.aao.cdut.edu.cn",
        "sourceKey": ["aao"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["荣誉", "保研"]
    },
    {
        "id": 2006,
        "type": "双创",
        "level": "university",
        "school": "CDUT",
        "title": "创新创业项目立项/结题",
        "diagnosis": "成都理工大学创新创业项目立项和结题通知，包含国家级、省级和校级项目。",
        "searchKeywords": "创新创业 立项 结题",
        "action": "关注成都理工大学创新创业学院网站，查看项目申报通知",
        "evidence": "成都理工大学创新创业学院官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cdut.edu.cn",
        "sourceKey": ["aao"],
        "priority": 2,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["双创"]
    },
    
    // C. 赛事矩阵层 (The Matrix - 具体赛事)
    {
        "id": 2007,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "中国国际大学生创新大赛(互联网+)",
        "diagnosis": "教育部主办的国家级创新创业大赛，是国内最具影响力的大学生创新创业赛事之一。",
        "searchKeywords": "互联网+ 创新创业",
        "note": "💡 经验参考：分为高教主赛道、青年红色筑梦之旅、职教赛道和萌芽赛道，获奖可获创新学分和保研加分。",
        "action": "搜索中国国际大学生创新大赛官网，了解报名时间和流程",
        "evidence": "教育部官方发布",
        "deadline": "2026-06-30",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cyberpluscup.com",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "urgent",
        "policyLevel": "provincial",
        "tracks": ["竞赛", "双创"]
    },
    {
        "id": 2008,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "挑战杯大学生课外学术科技作品竞赛",
        "diagnosis": "共青团中央主办的国家级学术科技竞赛，每两年举办一次，分为自然科学类学术论文、哲学社会科学类社会调查报告和科技发明制作三类。",
        "searchKeywords": "挑战杯 课外学术科技",
        "action": "搜索挑战杯官网，了解报名时间和流程",
        "evidence": "共青团中央官方发布",
        "deadline": "2026-11-30",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.tiaozhanbei.net",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": "provincial",
        "tracks": ["竞赛", "科研"]
    },
    {
        "id": 2009,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "创青春大学生创业大赛",
        "diagnosis": "共青团中央主办的国家级创业大赛，每两年举办一次，分为创业计划竞赛、创业实践挑战赛和公益创业赛三类。",
        "searchKeywords": "创青春 创业大赛",
        "action": "搜索创青春官网，了解报名时间和流程",
        "evidence": "共青团中央官方发布",
        "deadline": "2026-08-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.chuangqingchun.net",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": "provincial",
        "tracks": ["竞赛", "双创"]
    },
    {
        "id": 2010,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国大学生数学建模竞赛",
        "diagnosis": "教育部主办的国家级数学建模竞赛，每年举办一次，分为本科组和专科组。",
        "searchKeywords": "数学建模 竞赛 报名",
        "note": "💡 经验参考：获奖可获创新学分和保研加分，是理工科学生重要的竞赛之一。",
        "action": "搜索全国大学生数学建模竞赛官网，了解报名时间和流程",
        "evidence": "教育部高等教育司官方发布",
        "deadline": "2026-09-15",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.mcm.edu.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "urgent",
        "policyLevel": null,
        "tracks": ["竞赛", "数学"]
    },
    {
        "id": 2011,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "美国大学生数学建模竞赛(MCM/ICM)",
        "diagnosis": "国际级数学建模竞赛，每年举办一次，分为MCM（数学建模竞赛）和ICM（交叉学科建模竞赛）两类。",
        "searchKeywords": "美赛 MCM 数学建模",
        "note": "💡 经验参考：国际赛事，获奖含金量高，对申请国外研究生有帮助。",
        "action": "搜索美国大学生数学建模竞赛官网，了解报名时间和流程",
        "evidence": "美国数学及其应用联合会官方发布",
        "deadline": "2026-02-15",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.comap.com",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "数学", "国际"]
    },
    {
        "id": 2012,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国大学生电子设计竞赛",
        "diagnosis": "教育部主办的国家级电子设计竞赛，每两年举办一次，分为本科组和专科组。",
        "searchKeywords": "电子设计竞赛",
        "action": "搜索全国大学生电子设计竞赛官网，了解报名时间和流程",
        "evidence": "教育部高等教育司官方发布",
        "deadline": "2026-08-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.nuedc-training.com.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "电子"]
    },
    {
        "id": 2013,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国大学生机械创新设计大赛",
        "diagnosis": "教育部主办的国家级机械创新设计竞赛，每两年举办一次，以机械设计为主，结合电子、控制、计算机等技术。",
        "searchKeywords": "机械创新设计",
        "action": "搜索全国大学生机械创新设计大赛官网，了解报名时间和流程",
        "evidence": "教育部高等教育司官方发布",
        "deadline": "2026-06-30",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cmind.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "机械"]
    },
    {
        "id": 2014,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "ACM/ICPC 程序设计竞赛",
        "diagnosis": "国际计算机协会主办的国际级程序设计竞赛，是全球最具影响力的大学生程序设计竞赛。",
        "searchKeywords": "ACM ICPC 程序设计",
        "note": "💡 经验参考：国际赛事，获奖含金量高，对计算机相关专业学生就业和深造有很大帮助。",
        "action": "搜索ACM/ICPC官网，了解报名时间和流程",
        "evidence": "国际计算机协会官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://icpc.global",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "sufficient",
        "policyLevel": null,
        "tracks": ["竞赛", "计算机", "国际"]
    },
    {
        "id": 2015,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "蓝桥杯软件和信息技术专业人才大赛",
        "diagnosis": "工业和信息化部人才交流中心主办的国家级信息技术竞赛，分为软件类和电子类两大类别。",
        "searchKeywords": "蓝桥杯 报名",
        "action": "搜索蓝桥杯官网，了解报名时间和流程",
        "evidence": "工业和信息化部人才交流中心官方发布",
        "deadline": "2026-03-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.lanqiao.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "计算机", "电子"]
    },
    {
        "id": 2016,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国大学生英语竞赛(NECCS)",
        "diagnosis": "高等学校大学外语教学指导委员会主办的国家级英语竞赛，分为A、B、C、D四个类别，分别面向不同层次的学生。",
        "searchKeywords": "大学生英语竞赛 NECCS",
        "action": "搜索全国大学生英语竞赛官网，了解报名时间和流程",
        "evidence": "高等学校大学外语教学指导委员会官方发布",
        "deadline": "2026-04-15",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.chinaneccs.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "英语"]
    },
    {
        "id": 2017,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国大学生数学竞赛",
        "diagnosis": "中国数学会主办的国家级数学竞赛，分为数学专业类和非数学专业类两个类别。",
        "searchKeywords": "大学生数学竞赛 报名",
        "action": "搜索全国大学生数学竞赛官网，了解报名时间和流程",
        "evidence": "中国数学会官方发布",
        "deadline": "2026-10-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cms.org.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "数学"]
    },
    {
        "id": 2018,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国大学生智能汽车竞赛",
        "diagnosis": "教育部高等学校自动化类专业教学指导委员会主办的国家级智能汽车竞赛，以智能汽车为载体，融合了自动控制、计算机、电子、机械等多个学科领域。",
        "searchKeywords": "智能汽车竞赛",
        "action": "搜索全国大学生智能汽车竞赛官网，了解报名时间和流程",
        "evidence": "教育部高等学校自动化类专业教学指导委员会官方发布",
        "deadline": "2026-07-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.smartcarrace.com",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "自动化", "电子"]
    },
    {
        "id": 2019,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国大学生节能减排社会实践与科技竞赛",
        "diagnosis": "教育部高等教育司主办的国家级节能减排竞赛，分为社会实践调查和科技发明制作两类。",
        "searchKeywords": "节能减排 竞赛",
        "action": "搜索全国大学生节能减排社会实践与科技竞赛官网，了解报名时间和流程",
        "evidence": "教育部高等教育司官方发布",
        "deadline": "2026-05-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.jienengjianpai.org",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "环保"]
    },
    {
        "id": 2020,
        "type": "证书",
        "level": "university",
        "school": "CDUT",
        "title": "四川省综合素质A级证书",
        "diagnosis": "共青团四川省委主办的省级综合素质证书，包含思想道德、社会实践、创新创业、文化艺术、体育锻炼和技能培训六个方面。",
        "searchKeywords": "综合素质 A级证书",
        "note": "💡 经验参考：四川省综合素质A级证书是四川省选调生报考的重要条件之一。",
        "action": "搜索四川省综合素质A级证书官网，了解申报条件和流程",
        "evidence": "共青团四川省委官方发布",
        "deadline": "2026-11-30",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.scyouth.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": "provincial",
        "tracks": ["荣誉", "选调"]
    },
    
    // D. 避坑与红线层 (Red Line)
    {
        "id": 2021,
        "type": "红线",
        "level": "university",
        "school": "CDUT",
        "title": "综测加分认定黑名单提醒",
        "diagnosis": "非白名单赛事通常不加分，部分赛事存在诈骗风险，请勿轻信非官方渠道的赛事信息。",
        "searchKeywords": "综合测评 实施细则",
        "note": "💡 经验参考：非白名单赛事通常不加分，部分赛事存在诈骗风险，请勿轻信非官方渠道的赛事信息。",
        "action": "查看成都理工大学综合测评实施细则，了解加分认定范围",
        "evidence": "成都理工大学学生工作部官方发布",
        "deadline": "2026-12-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cdut.edu.cn/xgb",
        "sourceKey": ["xgb"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "sufficient",
        "policyLevel": null,
        "tracks": ["警告", "教务"]
    },
    
    // 更多竞赛赛事...
    {
        "id": 2022,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国大学生物理实验竞赛",
        "diagnosis": "教育部高等学校物理学类专业教学指导委员会主办的国家级物理实验竞赛，分为教学赛和创新赛两个类别。",
        "searchKeywords": "物理实验竞赛",
        "action": "搜索全国大学生物理实验竞赛官网，了解报名时间和流程",
        "evidence": "教育部高等学校物理学类专业教学指导委员会官方发布",
        "deadline": "2026-06-30",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cupem.org",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "物理"]
    },
    {
        "id": 2023,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国大学生化学实验邀请赛",
        "diagnosis": "教育部高等学校化学类专业教学指导委员会主办的国家级化学实验竞赛，每两年举办一次。",
        "searchKeywords": "化学实验 邀请赛",
        "action": "搜索全国大学生化学实验邀请赛官网，了解报名时间和流程",
        "evidence": "教育部高等学校化学类专业教学指导委员会官方发布",
        "deadline": "2026-09-30",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.chemsoc.org.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "化学"]
    },
    {
        "id": 2024,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国大学生地质技能竞赛",
        "diagnosis": "教育部高等学校地质类专业教学指导委员会主办的国家级地质技能竞赛，分为地质技能综合应用、地质标本鉴定和地质构造解释三个环节。",
        "searchKeywords": "地质技能竞赛",
        "action": "搜索全国大学生地质技能竞赛官网，了解报名时间和流程",
        "evidence": "教育部高等学校地质类专业教学指导委员会官方发布",
        "deadline": "2026-08-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cugb.edu.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "地质"]
    },
    {
        "id": 2025,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国大学生结构设计竞赛",
        "diagnosis": "教育部高等学校土木工程专业教学指导委员会主办的国家级结构设计竞赛，每两年举办一次。",
        "searchKeywords": "结构设计竞赛",
        "action": "搜索全国大学生结构设计竞赛官网，了解报名时间和流程",
        "evidence": "教育部高等学校土木工程专业教学指导委员会官方发布",
        "deadline": "2026-07-31",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.csedc.org",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "土木"]
    },
    {
        "id": 2026,
        "type": "竞赛",
        "level": "university",
        "school": "CDUT",
        "title": "全国大学生水利创新设计大赛",
        "diagnosis": "教育部高等学校水利类专业教学指导委员会主办的国家级水利创新设计竞赛，每两年举办一次。",
        "searchKeywords": "水利创新设计大赛",
        "action": "搜索全国大学生水利创新设计大赛官网，了解报名时间和流程",
        "evidence": "教育部高等学校水利类专业教学指导委员会官方发布",
        "deadline": "2026-06-30",
        "targetUser": "全体在校生",
        "sourceUrl": "https://www.cws.org.cn",
        "sourceKey": ["aao"],
        "priority": 1,
        "accessPolicy": "home_only",
        "verified": false,
        "status": "approaching",
        "policyLevel": null,
        "tracks": ["竞赛", "水利"]
    }
    // ================== 竞赛矩阵 END ==================
];

// 第三步：【全院覆盖】标准化生产
// 学院列表
const colleges = [
    { key: "wfxy", name: "文法学院" },
    { key: "cist", name: "信息科学与技术学院" },
    { key: "mee", name: "机电工程学院" },
    { key: "cmcc", name: "材料与化学化工学院" },
    { key: "ces", name: "地球科学学院" },
    { key: "cim", name: "管理科学学院" },
    { key: "math", name: "数学科学学院" },
    { key: "wyxy", name: "外国语学院" },
    { key: "csxy", name: "传播科学与艺术学院" },
    { key: "ne", name: "核技术与自动化工程学院" },
    { key: "hxtm", name: "环境与土木工程学院" },
    { key: "nyxy", name: "能源学院" },
    { key: "stxy", name: "生态环境学院" },
    { key: "tyxy", name: "体育学院" },
    { key: "lyxy", name: "旅游与城乡规划学院" },
    { key: "dqwxy", name: "地球物理学院" },
    { key: "cjdz", name: "沉积地质研究院" },
    { key: "dzdc", name: "地质调查研究院" },
    { key: "mksxy", name: "马克思主义学院" }
];

// 生成学院卡片
function generateCollegeCards() {
    let collegeCards = [];
    let id = 2000;
    
    colleges.forEach(college => {
        // 获取差异化匹配的特色卡片
        let 特色Card = {
            id: id + 5,
            type: "特色",
            level: "college",
            school: "CDUT",
            title: "",
            diagnosis: "",
            searchKeywords: "",
            action: `查看${college.name}相关通知，了解详细信息`,
            evidence: `${college.name}官方发布`,
            deadline: "2026-12-31",
            targetUser: `${college.name}学生`,
            sourceUrl: `https://${college.key}.cdut.edu.cn`,
            sourceKey: [college.key],
            priority: 2,
            accessPolicy: "home_only",
            verified: false,
            status: "sufficient",
            policyLevel: null,
            tracks: []
        };
        
        // 根据学院类型设置特色卡片内容
        if (college.name.includes("管理") || college.name.includes("经济") || college.name.includes("金融") || college.name.includes("旅游")) {
            // 商/管/经 → 会计金融资格 (CPA/ACCA)
            特色Card.title = "会计金融资格考试";
            特色Card.diagnosis = `${college.name}关于会计金融资格考试的相关信息和备考指南。`;
            特色Card.searchKeywords = "会计金融资格 CPA ACCA";
            特色Card.tracks = ["证书", "就业"];
        } else if (college.name.includes("信息") || college.name.includes("机电") || college.name.includes("材料") || college.name.includes("化学") || 
                   college.name.includes("地球") || college.name.includes("核") || college.name.includes("环境") || college.name.includes("土木") || 
                   college.name.includes("能源") || college.name.includes("生态") || college.name.includes("地质") || college.name.includes("数学")) {
            // 理工科 → 工程认证/技能大赛
            特色Card.title = "工程认证与技能大赛";
            特色Card.diagnosis = `${college.name}关于工程教育认证和学科竞赛的相关信息。`;
            特色Card.searchKeywords = "工程认证 技能大赛 学科竞赛";
            特色Card.tracks = ["竞赛", "考研"];
        } else if (college.name.includes("传播") || college.name.includes("艺术") || college.name.includes("体育") || 
                   college.name.includes("外国语") || college.name.includes("马克思主义")) {
            // 艺/体 → 专业展演/赛事
            特色Card.title = "专业展演与赛事";
            特色Card.diagnosis = `${college.name}关于专业展演和赛事的相关信息。`;
            特色Card.searchKeywords = "专业展演 赛事 竞赛";
            特色Card.tracks = ["竞赛", "艺术"];
        } else {
            // 其他 → 专业特色活动
            特色Card.title = "专业特色活动";
            特色Card.diagnosis = `${college.name}的专业特色活动和相关信息。`;
            特色Card.searchKeywords = "专业特色 活动 通知";
            特色Card.tracks = ["活动"];
        }
        
        // 标准5件套 + 2条竞赛入口
        const baseCards = [
            {
                id: id + 1,
                type: "升学",
                level: "college",
                school: "CDUT",
                title: "推免实施细则",
                diagnosis: `${college.name}2026年推免生选拔细则和流程，了解综合测评要求。`,
                searchKeywords: "推免 细则 综合测评",
                action: `查看${college.name}推免实施细则，了解选拔条件和流程`,
                evidence: `${college.name}官方发布`,
                deadline: "2026-09-20",
                targetUser: `${college.name}大三学生`,
                sourceUrl: `https://${college.key}.cdut.edu.cn`,
                sourceKey: [college.key],
                priority: 2,
                accessPolicy: "home_only",
                verified: false,
                status: "approaching",
                policyLevel: null,
                tracks: ["保研"]
            },
            {
                id: id + 2,
                type: "考研",
                level: "college",
                school: "CDUT",
                title: "复试录取与调剂",
                diagnosis: `${college.name}2026年考研复试录取与调剂公告，了解复试要求和调剂政策。`,
                searchKeywords: "复试 录取 调剂",
                action: `查看${college.name}考研复试调剂公告，了解相关政策`,
                evidence: `${college.name}官方发布`,
                deadline: "2026-04-30",
                targetUser: `${college.name}考研学生`,
                sourceUrl: `https://${college.key}.cdut.edu.cn`,
                sourceKey: [college.key],
                priority: 2,
                accessPolicy: "home_only",
                verified: false,
                status: "urgent",
                policyLevel: null,
                tracks: ["考研"]
            },
            {
                id: id + 3,
                type: "节点",
                level: "college",
                school: "CDUT",
                title: "毕业论文规范",
                diagnosis: `${college.name}毕业论文查重要求和答辩红线，了解相关规定。`,
                searchKeywords: "毕业论文 查重 答辩",
                action: `查看${college.name}毕业论文工作安排，了解查重要求和时间节点`,
                evidence: `${college.name}官方发布`,
                deadline: "2026-05-15",
                targetUser: `${college.name}大四学生`,
                sourceUrl: `https://${college.key}.cdut.edu.cn`,
                sourceKey: [college.key],
                priority: 2,
                accessPolicy: "home_only",
                verified: false,
                status: "urgent",
                policyLevel: null,
                tracks: ["毕业"]
            },
            {
                id: id + 4,
                type: "教务",
                level: "college",
                school: "CDUT",
                title: "本科培养方案",
                diagnosis: `${college.name}本科人才培养方案，了解专业课程要求和学分计算。`,
                searchKeywords: "培养方案",
                action: `查看${college.name}本科人才培养方案，了解专业课程要求`,
                evidence: `${college.name}官方发布`,
                deadline: "2026-12-31",
                targetUser: `${college.name}学生`,
                sourceUrl: `https://${college.key}.cdut.edu.cn`,
                sourceKey: [college.key],
                priority: 2,
                accessPolicy: "home_only",
                verified: false,
                status: "sufficient",
                policyLevel: null,
                tracks: ["教务"]
            },
            特色Card,
            // 竞赛入口 1: 学院学科竞赛通知
            {
                id: id + 6,
                type: "竞赛",
                level: "college",
                school: "CDUT",
                title: `${college.name}学科竞赛通知`,
                diagnosis: `${college.name}关于学科竞赛的最新通知和报名信息，包括各类国家级、省级和校级竞赛。`,
                searchKeywords: "学科竞赛 通知 报名",
                action: `查看${college.name}学科竞赛通知，了解最新竞赛信息和报名流程`,
                evidence: `${college.name}官方发布`,
                deadline: "2026-12-31",
                targetUser: `${college.name}学生`,
                sourceUrl: `https://${college.key}.cdut.edu.cn`,
                sourceKey: [college.key],
                priority: 2,
                accessPolicy: "home_only",
                verified: false,
                status: "approaching",
                policyLevel: null,
                tracks: ["竞赛", "保研"]
            },
            // 竞赛入口 2: 学院获奖与加分公示
            {
                id: id + 7,
                type: "荣誉",
                level: "college",
                school: "CDUT",
                title: `${college.name}竞赛获奖与加分公示`,
                diagnosis: `${college.name}关于学科竞赛获奖名单和综合测评加分情况的公示。`,
                searchKeywords: "竞赛 获奖 公示",
                action: `查看${college.name}竞赛获奖与加分公示，了解获奖情况和加分细则`,
                evidence: `${college.name}官方发布`,
                deadline: "2026-12-31",
                targetUser: `${college.name}学生`,
                sourceUrl: `https://${college.key}.cdut.edu.cn`,
                sourceKey: [college.key],
                priority: 2,
                accessPolicy: "home_only",
                verified: false,
                status: "approaching",
                policyLevel: null,
                tracks: ["竞赛", "荣誉", "保研"]
            }
        ];
        
        collegeCards = [...collegeCards, ...baseCards];
        id += 15;
    });
    
    return collegeCards;
}

const collegeCards = generateCollegeCards();

// 合并所有卡片
const finalCards = [...anchorCards, ...nationalCards, ...cdutCoreCards, ...collegeCards];

console.log('=== 生成结果 ===');
console.log(`锚点卡片数: ${anchorCards.length}`);
console.log(`上位法卡片数: ${nationalCards.length}`);
console.log(`CDUT-CORE卡片数: ${cdutCoreCards.length}`);
console.log(`学院卡片数: ${collegeCards.length}`);
console.log(`总卡片数: ${finalCards.length}`);

// 验证生成的卡片
const validationResult = {
    missingKeywords: 0,
    missingLevel: 0,
    missingAccessPolicy: 0,
    missingSourceKey: 0
};

finalCards.forEach(card => {
    if (!card.searchKeywords) {
        validationResult.missingKeywords++;
    }
    if (!card.level) {
        validationResult.missingLevel++;
    }
    if (card.accessPolicy !== 'home_only') {
        validationResult.missingAccessPolicy++;
    }
    if (!card.sourceKey || !Array.isArray(card.sourceKey)) {
        validationResult.missingSourceKey++;
    }
});

console.log('\n=== 验证结果 ===');
console.log(`缺少 searchKeywords: ${validationResult.missingKeywords}`);
console.log(`缺少 level: ${validationResult.missingLevel}`);
console.log(`accessPolicy 错误: ${validationResult.missingAccessPolicy}`);
console.log(`缺少 sourceKey: ${validationResult.missingSourceKey}`);

if (validationResult.missingKeywords === 0 && validationResult.missingLevel === 0 && 
    validationResult.missingAccessPolicy === 0 && validationResult.missingSourceKey === 0) {
    console.log('✅ 所有卡片验证通过！');
} else {
    console.log('❌ 卡片存在问题，请检查！');
}

// 写入新的 diagnosis.js 文件
const newDiagnosisContent = `// 信息诊断数据 - V2.6 可验证索引库版
window.diagnosisData = ${JSON.stringify(finalCards, null, 4)};`;

fs.writeFileSync(diagnosisPath, newDiagnosisContent, 'utf8');

console.log('\n=== 写入结果 ===');
console.log(`已成功写入 ${diagnosisPath}`);
console.log(`新文件大小: ${newDiagnosisContent.length} 字节`);

// 输出交付报告
console.log('\n=== 交付报告 ===');
console.log(`1. 页面总条数: ${finalCards.length} 条`);
console.log(`2. "学士学位"按钮搜索词: 学士学位 授予 细则`);
console.log(`3. "文法推免细则"按钮搜索词: 推免 细则 综合测评`);
