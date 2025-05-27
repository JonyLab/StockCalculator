const languages = {
    'zh-CN': {
        title: '券商费率对比计算器',
        hkTab: '🇭🇰 港股',
        usTab: '🇺🇸 美股',
        transactionValueLabel: '输入交易值（港元）',
        transactionValuePlaceholder: '请输入交易金额',
        orderCountLabel: '每月交易笔数',
        orderCountPlaceholder: '请输入每月交易笔数',
        platformModeLabel: '平台费模式',
        usTransactionValueLabel: '输入交易值（美元）',
        usTransactionValuePlaceholder: '请输入交易金额',
        usShareCountLabel: '交易股数',
        usShareCountPlaceholder: '请输入交易股数',
        usMonthlyShareCountLabel: '每月交易股数',
        usMonthlyShareCountPlaceholder: '请输入每月交易股数',
        usPlatformModeLabel: '美股平台费模式',
        usTransactionDirectionLabel: '交易方向',
        usTradingActivityFee: '交易活动费',
        calculateButton: '计算费用',
        comingSoon: '开发中，尽情期待...',
        moreBrokers: '更多券商支持中...',
        bestPrice: '最优惠',
        // 费用项目
        commission: '佣金',
        platformFee: '平台费',
        agencyServiceFee: '代理服务费用',
        collectedFee: '代收费用',
        transactionFee: '交易费',
        stampDuty: '印花税',
        usClearingFee: '交收费',
        sfcLevy: '证监会征费',
        frcLevy: '财务汇报局征费',
        settlementFee: '结算费',
        totalFee: '总费用',
        basedOnMonthlyOrders: "基于每月第 {count} 笔订单",
        // 富途美股新增费用
        usSECRegulatoryFee: '证监会规费',
        usCATFee: '综合审计追踪费',
        // 平台费模式
        fixedMode: '固定式',
        steppedMode: '阶梯式',
        // 交易方向选项
        buyDirection: '买入',
        sellDirection: '卖出',
        // 错误提示
        invalidInput: '请输入有效的正交易值！',
        // 免责声明
        disclaimer: '以上计算过程及结果均依据对应平台官网在特定时间点提供的数据，不保证具备最新时效性，本网站开发者不对其准确性负责，详细计费规则请以对应平台实际情况为准',
        // 主题模式
        lightMode: '亮色模式',
        darkMode: '暗色模式'
    },
    'en-US': {
        title: 'Broker Fee Comparison Calculator',
        hkTab: '🇭🇰 HK Stocks',
        usTab: '🇺🇸 US Stocks',
        transactionValueLabel: 'Transaction Value (HKD)',
        transactionValuePlaceholder: 'Enter transaction amount',
        orderCountLabel: 'Monthly Orders',
        orderCountPlaceholder: 'Enter monthly order count',
        platformModeLabel: 'Platform Fee Mode',
        usTransactionValueLabel: 'Transaction Value (USD)',
        usTransactionValuePlaceholder: 'Enter transaction amount',
        usShareCountLabel: 'Shares Traded',
        usShareCountPlaceholder: 'Enter number of shares',
        usMonthlyShareCountLabel: 'Monthly Shares Traded',
        usMonthlyShareCountPlaceholder: 'Enter monthly share count',
        usPlatformModeLabel: 'US Platform Fee Mode',
        usTransactionDirectionLabel: 'Transaction Direction',
        usTradingActivityFee: 'Trading Activity Fee',
        calculateButton: 'Calculate Fees',
        comingSoon: 'Coming Soon...',
        moreBrokers: 'More brokers support is coming soon...',
        bestPrice: 'Best Price',
        // Fee items
        commission: 'Commission',
        platformFee: 'Platform Fee',
        agencyServiceFee: 'Agency Service Fee',
        collectedFee: 'Collected Fee',
        transactionFee: 'Transaction Fee',
        stampDuty: 'Stamp Duty',
        usClearingFee: 'Clearing Fee',
        sfcLevy: 'SFC Levy',
        frcLevy: 'FRC Levy',
        settlementFee: 'Settlement Fee',
        totalFee: 'Total Fee',
        basedOnMonthlyOrders: "(based on the {count}th monthly order)",
        // Futu US new fees
        usSECRegulatoryFee: 'SEC Regulatory Fee',
        usCATFee: 'Consolidated Audit Trail Fee',
        // Platform fee modes
        fixedMode: 'Fixed',
        steppedMode: 'Stepped',
        // Transaction direction options
        buyDirection: 'Buy',
        sellDirection: 'Sell',
        // Error messages
        invalidInput: 'Please enter a valid positive transaction value!',
        // Disclaimer
        disclaimer: 'The above calculation process and results are based on data provided by the respective platform\'s official website at specific points in time, and are not guaranteed to be the most up-to-date. The developer of this website is not responsible for their accuracy. For detailed billing rules, please refer to the actual situation of the respective platform.',
        // Theme modes
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode'
    }
}; 