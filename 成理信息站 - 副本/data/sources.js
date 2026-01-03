// 信息来源定义 - V0.9.4 分层策略版
window.sourcesData = [
    // 校内来源
    {
        key: "cdut",
        name: "成都理工大学",
        domain: "https://www.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "jwc",
        name: "成都理工大学教务处",
        domain: "https://www.aao.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "wfxy",
        name: "文法学院",
        domain: "https://wfxy.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "cist",
        name: "信息科学与技术学院",
        domain: "http://www.cist.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "mee",
        name: "机电工程学院",
        domain: "https://mee.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "cmcc",
        name: "材料与化学化工学院",
        domain: "https://cmcc.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "ces",
        name: "地球科学学院",
        domain: "https://ces.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "cim",
        name: "管理科学学院",
        domain: "https://cim.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "math",
        name: "数学科学学院",
        domain: "https://math.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "wyxy",
        name: "外国语学院",
        domain: "https://wyxy.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "csxy",
        name: "传播科学与艺术学院",
        domain: "https://csxy.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "ne",
        name: "核技术与自动化工程学院",
        domain: "https://ne.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "hxtm",
        name: "环境与土木工程学院",
        domain: "https://hxtm.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "nyxy",
        name: "能源学院",
        domain: "https://nyxy.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "stxy",
        name: "生态环境学院",
        domain: "https://stxy.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "tyxy",
        name: "体育学院",
        domain: "https://tyxy.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "lyxy",
        name: "旅游与城乡规划学院",
        domain: "https://lyxy.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "dqwxy",
        name: "地球物理学院",
        domain: "https://dqwxy.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "cjdz",
        name: "沉积地质研究院",
        domain: "https://cjdz.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "dzdc",
        name: "地质调查研究院",
        domain: "https://dzdc.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "mksxy",
        name: "马克思主义学院",
        domain: "https://mksxy.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "jyw",
        name: "成都理工就业网",
        domain: "jy.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "direct"
    },
    {
        key: "cdut_xgb",
        name: "成都理工学工部",
        domain: "https://xsc.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "cdut_tw",
        name: "成都理工团委",
        domain: "https://youth.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    {
        key: "cdut_lib",
        name: "成都理工图书馆",
        domain: "lib.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "direct"
    },
    {
        key: "cdut_yjsy",
        name: "成都理工研究生院",
        domain: "https://www.gra.cdut.edu.cn",
        confidence: "官方",
        defaultPolicy: "home_only"
    },
    
    // 省级来源
    {
        key: "sc_edu",
        name: "四川省教育考试院",
        domain: "https://www.sceea.cn",
        confidence: "省级官方",
        defaultPolicy: "home_only"
    },
    {
        key: "sc_edt",
        name: "四川省教育厅",
        domain: "https://edu.sc.gov.cn",
        confidence: "省级官方",
        defaultPolicy: "home_only"
    },
    {
        key: "sc_rsh",
        name: "四川省人社厅",
        domain: "https://rst.sc.gov.cn",
        confidence: "省级官方",
        defaultPolicy: "home_only"
    },
    
    // 国家级来源
    {
        key: "yz_chsi",
        name: "中国研究生招生信息网",
        domain: "yz.chsi.com.cn",
        confidence: "教育部官方",
        defaultPolicy: "direct"
    },
    {
        key: "cet",
        name: "全国大学英语四六级考试官网",
        domain: "cet.neea.edu.cn",
        confidence: "教育部考试中心",
        defaultPolicy: "direct"
    },
    {
        key: "mcm",
        name: "全国大学生数学建模竞赛官网",
        domain: "mcm.edu.cn",
        confidence: "教育部赛事",
        defaultPolicy: "direct"
    },
    {
        key: "cy_ncss",
        name: "全国大学生创新创业服务网",
        domain: "cy.ncss.cn",
        confidence: "教育部赛事",
        defaultPolicy: "direct"
    },
    {
        key: "icpc",
        name: "ACM-ICPC国际官网",
        domain: "icpc.global",
        confidence: "国际赛事",
        defaultPolicy: "direct"
    },
    {
        key: "moe",
        name: "中华人民共和国教育部",
        domain: "moe.gov.cn",
        confidence: "部委官网",
        defaultPolicy: "direct"
    },
    {
        key: "ncss",
        name: "全国高等学校学生信息咨询与就业指导中心",
        domain: "ncss.cn",
        confidence: "教育部直属",
        defaultPolicy: "direct"
    }
];

