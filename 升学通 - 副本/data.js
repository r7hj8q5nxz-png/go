const resources = [
  // --- 🏆 核心竞赛 (Core Competitions) ---
  { "id": 1, "tier": "SSR", "category": "竞赛", "title": "互联网+ 创新大赛", "tag": "教育部主导", "time": "4月启动", "desc": "保研加分权重Top1，简历核武器。" },
  { "id": 2, "tier": "SR", "category": "竞赛", "title": "挑战杯 (大挑)", "tag": "学术科技", "time": "单数年举办", "desc": "大学生科技奥林匹克，国奖直通保研。" },
  { "id": 3, "tier": "SR", "category": "竞赛", "title": "挑战杯 (小挑)", "tag": "商业计划", "time": "双数年举办", "desc": "更看重商业逻辑，文科生优势赛道。" },
  { "id": 4, "tier": "SR", "category": "竞赛", "title": "数学建模国赛", "tag": "理工必刷", "time": "9月中旬", "desc": "三天三夜极限挑战，证明抗压能力。" },
  { "id": 5, "tier": "SR", "category": "竞赛", "title": "全国大学生英语竞赛", "tag": "综测加分", "time": "4月初赛", "desc": "非英专含金量最高的英语奖项。" },

  // --- ⚖️ 法学核心 (Law Core - Basic) ---
  { "id": 6, "tier": "SR", "category": "法学", "title": "杰赛普 (Jessup)", "tag": "模拟法庭", "time": "9月启动", "desc": "法学界的奥林匹克，全英文实战，红圈所敲门砖。" },
  { "id": 7, "tier": "SSR", "category": "法学", "title": "法律职业资格考试", "tag": "执业门槛", "time": "6月报名", "desc": "法学生成人礼，没证别想做律师法官。" },

  // --- 🎓 升学与深造 (Further Study) ---
  { "id": 8, "tier": "SSR", "category": "升学", "title": "研招网 (官方入口)", "tag": "唯一官方", "time": "10月报名", "desc": "报名、调剂、查分的唯一官方渠道。" },
  { "id": 9, "tier": "SSR", "category": "升学", "title": "保研夏令营", "tag": "抢跑入场券", "time": "4月-6月", "desc": "90%的保研名额在暑假就发完了，别等九月。" },
  { "id": 10, "tier": "SR", "category": "升学", "title": "IELTS 雅思", "tag": "留学/保研", "time": "每周考", "desc": "不只留学，保研英语免修和外企面试的硬通货。" },
  { "id": 11, "tier": "SSR", "category": "留学", "title": "CSC 国家留学基金委", "tag": "公派留学", "time": "年初申请", "desc": "国家给钱让你出国读博/联培，省下一套房。" },

  // --- 🏛️ 体制与国企 (Gov & SOE) ---
  { "id": 12, "tier": "SSR", "category": "体制", "title": "国家公务员考试", "tag": "中央部委", "time": "10月报名", "desc": "真正的铁饭碗，主要面向应届生。" },
  { "id": 13, "tier": "SSR", "category": "体制", "title": "各省紧缺选调", "tag": "储备干部", "time": "9-11月", "desc": "组织部选拔，起点高，晋升快。" },
  { "id": 14, "tier": "SSR", "category": "体制", "title": "军队文职", "tag": "新兴铁饭碗", "time": "年底", "desc": "不穿军装，工资参照现役军官。" },
  { "id": 15, "tier": "SSR", "category": "体制", "title": "国家电网招聘", "tag": "电网编制", "time": "11月/3月", "desc": "待遇极好，电气、财会、计算机专业必看。" },
  { "id": 16, "tier": "SSR", "category": "体制", "title": "中国烟草招聘", "tag": "顶级国企", "time": "各省不同", "desc": "传说中的神仙单位，纳税大户，福利待遇天花板。" },
  { "id": 17, "tier": "SR", "category": "体制", "title": "教师编制考试", "tag": "事业编", "time": "各省不同", "desc": "相比教资证，这才是真正进入学校当老师的考试。" },
  { "id": 18, "tier": "R", "category": "体制", "title": "西部计划", "tag": "曲线救国", "time": "4-5月", "desc": "服务期满考研加10分，考公有定向。" },
  { "id": 19, "tier": "R", "category": "体制", "title": "三支一扶", "tag": "基层编制", "time": "上半年", "desc": "服务期满考核合格，多地直接转编。" },

  // --- 💼 就业与实习 (Career) ---
  { "id": 20, "tier": "SSR", "category": "就业", "title": "秋季校园招聘", "tag": "求职黄金期", "time": "8-11月", "desc": "身价最高时刻，岗位最多，必须抓住。" },
  { "id": 21, "tier": "SR", "category": "就业", "title": "暑期实习 (Summer)", "tag": "大厂转正", "time": "3-5月", "desc": "表现好直接发Offer，免去秋招厮杀。" },
  { "id": 22, "tier": "R", "category": "就业", "title": "牛客网 (Nowcoder)", "tag": "刷题/面经", "time": "随时", "desc": "互联网求职大本营，真题和面经最全。" },
  { "id": 23, "tier": "R", "category": "就业", "title": "实习僧", "tag": "找实习", "time": "随时", "desc": "大学生找日常实习最靠谱的垂直平台。" },
  { "id": 24, "tier": "R", "category": "就业", "title": "LinkedIn (领英)", "tag": "职场社交", "time": "随时", "desc": "打造职业人设，外企HR经常在这里“钓鱼”。" },
  { "id": 25, "tier": "R", "category": "工具", "title": "OfferShow", "tag": "薪资爆料", "time": "随时", "desc": "查真实薪资，反画饼神器。" },

  // --- 📜 硬核证书 (Certificates) ---
  { "id": 26, "tier": "SSR", "category": "证书", "title": "CPA 注册会计师", "tag": "财会天花板", "time": "4月报名", "desc": "财会生的免死金牌，签字权的唯一来源。" },
  { "id": 27, "tier": "SSR", "category": "证书", "title": "CFA 特许金融分析师", "tag": "金融第一证", "time": "季考", "desc": "进投行、券商核心岗的强力敲门砖。" },
  { "id": 28, "tier": "SR", "category": "证书", "title": "证券/基金从业资格", "tag": "入行门槛", "time": "频繁举行", "desc": "金融机构的最基础门槛，大二大三就能考。" },
  { "id": 29, "tier": "SR", "category": "证书", "title": "ACCA (国际注会)", "tag": "外企通行证", "time": "季考", "desc": "四大和外企认可度极高，本科在读就能考。" },
  { "id": 30, "tier": "SR", "category": "证书", "title": "软考 (中/高级)", "tag": "以考代评", "time": "3月/8月", "desc": "计算机行业的国考，落户、国企升职必备。" },
  { "id": 31, "tier": "SR", "category": "证书", "title": "CATTI 翻译资格", "tag": "国家级翻译", "time": "4月/9月", "desc": "含金量远超专八，外交外事部门认可。" },
  { "id": 32, "tier": "R", "category": "证书", "title": "英语四六级", "tag": "学位门槛", "time": "6月/12月", "desc": "没过六级，大厂简历直接扔。" },
  { "id": 33, "tier": "R", "category": "证书", "title": "计算机二级 (Office)", "tag": "国企必备", "time": "3月/9月", "desc": "考公、国企只认这个证，不看你会不会Python。" },
  { "id": 34, "tier": "R", "category": "证书", "title": "教师资格证", "tag": "职业保底", "time": "1月/7月", "desc": "技多不压身，事业单位隐形门槛。" },
  { "id": 35, "tier": "R", "category": "证书", "title": "普通话水平测试", "tag": "二甲起步", "time": "每月", "desc": "考教资、公务员窗口岗必备。" },
  { "id": 36, "tier": "R", "category": "技能", "title": "驾驶证 (C1/C2)", "tag": "生活必备", "time": "寒暑假", "desc": "趁大学有时间赶紧考，工作后根本没空练车。" },

  // --- 💻 理工与通用竞赛 (Tech & General) ---
  { "id": 37, "tier": "SR", "category": "竞赛", "title": "蓝桥杯大赛", "tag": "编程实战", "time": "10月报名", "desc": "互联网大厂和国企认可度较高的编程赛。" },
  { "id": 38, "tier": "SSR", "category": "竞赛", "title": "ACM/ICPC", "tag": "计算机顶流", "time": "下半年", "desc": "拿个牌子，互联网大厂免笔试直接进面。" },
  { "id": 39, "tier": "SR", "category": "竞赛", "title": "Kaggle 大数据", "tag": "数据科学", "time": "全年", "desc": "数据分析/AI方向必刷，全球认可度极高。" },
  { "id": 40, "tier": "SR", "category": "竞赛", "title": "RoboMaster", "tag": "机甲大师", "time": "9月启动", "desc": "大疆举办，硬核工程师摇篮。" },
  { "id": 41, "tier": "SR", "category": "竞赛", "title": "大广赛", "tag": "文科友好", "time": "上半年", "desc": "写文案做策划也能拿奖，刷综测利器。" },
  { "id": 42, "tier": "R", "category": "工具", "title": "学位网 / 学科评估", "tag": "选校参考", "time": "随时", "desc": "选学校看学科评估，C+985不如A+211。" },
  { "id": 43, "tier": "R", "category": "法学", "title": "专利代理师", "tag": "理工+法学", "time": "7月", "desc": "“理工科+法律”复合背景的暴利行业准入证。" },

  // --- ⚖️ 法学特供·进阶版 (Law Advanced 44-59) ---
  { "id": 44, "tier": "SSR", "category": "法学", "title": "贸仲杯 (Vis Moot)", "tag": "商事仲裁", "time": "11月", "desc": "国际商事仲裁最高赛事，涉外律师的必经之路。" },
  { "id": 45, "tier": "SR", "category": "法学", "title": "理律杯 (Li Lv Cup)", "tag": "中文模法", "time": "9月启动", "desc": "国内规格最高的中文模拟法庭，清华主办。" },
  { "id": 46, "tier": "SR", "category": "法学", "title": "ICC 国际刑事法院", "tag": "海牙决赛", "time": "3月/4月", "desc": "国际刑法顶级赛事，优胜者有机会去海牙决赛。" },
  { "id": 47, "tier": "SR", "category": "法学", "title": "国际人道法模拟法庭", "tag": "红十字会", "time": "11月", "desc": "英文赛事，红十字国际委员会主办，提升法律英语。" },
  { "id": 48, "tier": "SR", "category": "法学", "title": "学宪法 讲宪法", "tag": "教育部", "time": "6月启动", "desc": "教育部主办，法学生及文科生必参加的根正苗红赛事。" },
  { "id": 49, "tier": "SR", "category": "法学", "title": "法科学生写作大赛", "tag": "学术写作", "time": "5月启动", "desc": "法学界少有的教育部认证文书竞赛，学术保研利器。" },
  { "id": 50, "tier": "R", "category": "法学", "title": "大学生版权征文", "tag": "知识产权", "time": "3月截稿", "desc": "国家版权局主办，适合知产方向学生刷奖。" },
  { "id": 51, "tier": "SR", "category": "法学", "title": "大创 (法学类)", "tag": "科研项目", "time": "4月申报", "desc": "做法学类社会调查报告，结项优秀助推保研。" },
  { "id": 52, "tier": "SSR", "category": "法学", "title": "红圈所实习 (寒/暑)", "tag": "律所顶流", "time": "3月/9月", "desc": "金杜/君合/中伦等，实习留用是进红圈的主要路径。" },
  { "id": 53, "tier": "SSR", "category": "法学", "title": "最高人民法院实习", "tag": "最高荣誉", "time": "5月/12月", "desc": "接收法律实习生，简历上最耀眼的一笔。" },
  { "id": 54, "tier": "SSR", "category": "法学", "title": "公检法定向选调", "tag": "体制快车", "time": "10月", "desc": "专门面向法学生的公检法岗位，竞争略小。" },
  { "id": 55, "tier": "SR", "category": "法学", "title": "公司法务 (In-house)", "tag": "甲方爸爸", "time": "3-5月", "desc": "500强法务部实习，比律所更稳定，WLB。" },
  { "id": 56, "tier": "R", "category": "法学", "title": "LEC 法律英语", "tag": "涉外法治", "time": "5月/11月", "desc": "证明法律英语能力的证书，涉外律所看重。" },
  { "id": 57, "tier": "R", "category": "法学", "title": "董秘资格证", "tag": "高薪法务", "time": "需培训", "desc": "上市公司董事会秘书必备，法务转型的黄金跳板。" },
  { "id": 58, "tier": "R", "category": "法学", "title": "法律援助志愿者", "tag": "社会实践", "time": "全年", "desc": "积累办案经验的起点，刷志愿时长神器。" }
];
