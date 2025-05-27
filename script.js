// Helper functions to ensure correct rounding
function roundToCents(value) {
    return Math.round(value * 100) / 100;
}

function ceilToWhole(value) {
    return Math.ceil(value);
}

// Common Hong Kong stock fee calculation functions (apply to relevant brokers)

// Stamp Duty: 0.1% * Transaction Value (rounded up to the nearest dollar), minimum HKD 1 per transaction (HK Government)
function stampDuty(transactionValue) {
    // Calculate stamp duty and round up to the nearest whole number (dollar)
    const fee = Math.ceil(transactionValue * 0.001);
    return Math.max(fee, 1); // Minimum HKD 1 per transaction
}

// SFC Transaction Levy: 0.0027% * Transaction Value, minimum HKD 0.01 per transaction (SFC)
function sfcLevy(transactionValue) {
    const fee = transactionValue * 0.000027;
    const rounded = roundToCents(fee);
    return Math.max(rounded, 0.01); // Minimum HKD 0.01 per transaction, rounded to cents
}

// FRC Transaction Levy: 0.00015% * Transaction Value (FRC)
function frcLevy(transactionValue) {
    return roundToCents(transactionValue * 0.0000015);
}

// Exchange Fee (Trading Fee + Trading System Usage Fee): 0.00565% * Transaction Value, minimum HKD 0.01 per transaction (HKEX)
// This function is used for all brokers for the standard exchange fee.
function exchangeFee(transactionValue) {
    const fee = transactionValue * 0.0000565;
    return Math.max(roundToCents(fee), 0.01); // Minimum HKD 0.01 per transaction, rounded to cents
}

// Settlement Fee: 0.002% * Transaction Value, minimum HKD 2, maximum HKD 100 per transaction (HKSCC)
function settlementFee(transactionValue) {
    const fee = transactionValue * 0.00002;
    return Math.min(Math.max(roundToCents(fee), 2), 100); // Minimum HKD 2, Maximum HKD 100 per transaction, rounded to cents
}

// Tiger Brokers Fee Calculation Functions
// Commission: 0.029% * Transaction Value (Includes 0.02% underlying clearing fee)
function tigerCommission(transactionValue) {
    const fee = transactionValue * 0.00029; // 0.029% commission
    const rounded = roundToCents(fee);
    return Math.max(rounded, 0.01); // 最低 0.01 港元
}

// Tiger Platform Fee: Fixed or Stepped based on Monthly Order Count
function tigerPlatformFee(mode, orderCount) {
    if (mode === 'fixed') {
        return 15; // 固定平台费15港元/笔
    } else if (mode === 'stepped') {
        if (orderCount <= 5) return 30;
        if (orderCount <= 20) return 15;
        if (orderCount <= 50) return 10;
        if (orderCount <= 100) return 9;
        if (orderCount <= 500) return 8;
        if (orderCount <= 1000) return 7;
        if (orderCount <= 2000) return 6;
        if (orderCount <= 3000) return 5;
        if (orderCount <= 4000) return 4;
        if (orderCount <= 5000) return 3;
        if (orderCount <= 6000) return 2;
        return 1; // 6001笔及以上
    }
    return 0;
}

// Longbridge Brokers Fee Calculation Functions
// Commission: 0 HKD
function longbridgeCommission(transactionValue) {
    return 0; // 用户要求免佣金 (已是0，确认修改意图)
}

// Longbridge Platform Fee: Fixed or Stepped
function longbridgePlatformFee(mode, orderCount) {
    if (mode === 'fixed') {
        return 15; // 固定平台费
    } else if (mode === 'stepped') {
        if (orderCount <= 5) return 30;
        if (orderCount <= 15) return 15;
        if (orderCount <= 50) return 10;
        if (orderCount <= 3000) return 5;
        return 3; // 3001笔以上
    }
    return 0;
}

// Futu Brokers Fee Calculation Functions
// Commission: 0.03% * Transaction Value, minimum HKD 3 per order
function futuCommission(transactionValue) {
    const fee = transactionValue * 0.0003; // 0.03% of transaction value
    const rounded = roundToCents(fee);
    return Math.max(rounded, 3); // Minimum HKD 3 per order
}

// Futu Platform Fee: Fixed or Stepped
function futuPlatformFee(mode, orderCount) {
    if (mode === 'fixed') {
        return 15; // 固定式平台费
    } else if (mode === 'stepped') {
        if (orderCount <= 5) return 30;
        if (orderCount <= 20) return 15;
        if (orderCount <= 50) return 10;
        if (orderCount <= 100) return 9;
        if (orderCount <= 500) return 8;
        if (orderCount <= 1000) return 7;
        if (orderCount <= 2000) return 6;
        if (orderCount <= 3000) return 5;
        if (orderCount <= 4000) return 4;
        if (orderCount <= 5000) return 3;
        if (orderCount <= 6000) return 2;
        return 1; // 6001笔及以上
    }
    return 0;
}

// Tiger US Stock Fee Calculation Functions
// Commission: 0 USD (User requested free commission)
function tigerUSCommission(shareCount, transactionValue) {
    // Rule: 0.0039 USD/share, max 0.5% * Transaction Value
    const feePerShare = 0.0039;
    const calculatedFee = feePerShare * shareCount;
    const maxFee = 0.005 * transactionValue; // 0.5% of transaction value
    
    return roundToCents(Math.min(calculatedFee, maxFee)); // Take the minimum of the per-share fee and the maximum fee, rounded to cents
}

// Tiger US Platform Fee: Fixed
// Rule: 0.0050 USD / share, minimum 1 USD / order
function tigerUSPlatformFeeFixed(shareCount) {
    const feePerShare = 0.0050;
    const calculatedFee = feePerShare * shareCount;
    // Apply minimum 1 USD per order
    return Math.max(roundToCents(calculatedFee), 1); // Round calculated fee to cents before comparing with minimum
}

// Tiger US Platform Fee: Stepped based on Monthly Shares Traded
// Rule: Variable rate per share based on tiers, minimum 1 USD / order
function tigerUSPlatformFeeStepped(monthlyShareCount, currentOrderShareCount) {
    let feePerShare;
    if (monthlyShareCount <= 5000) {
        feePerShare = 0.0070;
    } else if (monthlyShareCount <= 10000) {
        feePerShare = 0.0060;
    } else if (monthlyShareCount <= 100000) { // 10万股
        feePerShare = 0.0050;
    } else if (monthlyShareCount <= 1000000) { // 100万股
        feePerShare = 0.0040;
    } else {
        feePerShare = 0.0030; // 100万01股以上
    }
    
    const calculatedFee = feePerShare * currentOrderShareCount;
    // Apply minimum 1 USD per order
    return Math.max(roundToCents(calculatedFee), 1); // Round calculated fee to cents before comparing with minimum
}

// Tiger US Clearing Fee (交收费)
// Rule: 0.003 USD * Shares Traded, max 7% * Transaction Value (美国结算机构)
function tigerUSClearingFee(shareCount, transactionValue) {
    const feePerShare = 0.003;
    const calculatedFee = feePerShare * shareCount;
    const maxFee = 0.07 * transactionValue; // 最高 7% * 交易金额
    
    return roundToCents(Math.min(calculatedFee, maxFee)); // 取计算值和最高值中的较小值，并四舍五入到分
}

// Tiger US SEC Regulatory Fee (证监会规费)
// Rule: 0 USD (美国证监会)
function tigerUSSECRegulatoryFee(transactionValue) {
    return 0; // 0 USD
}

// Tiger US Trading Activity Fee (交易活动费)
// Rule: 0.000166 USD * Sell Quantity, min 0.01 USD, max 8.30 USD (美国金融业监管局)
// Note: Using Shares Traded as a placeholder for Sell Quantity for now.
function tigerUSTradingActivityFee(shareCount, transactionDirection) {
    const feePerShare = 0.000166;
    const calculatedFee = feePerShare * shareCount;
    
    // Apply minimum 0.01 USD and maximum 8.30 USD
    return Math.min(Math.max(roundToCents(calculatedFee), 0.01), 8.30); // Round to cents before applying min/max
}

// Longbridge US Stock Fee Calculation Functions
// Commission: 0 USD
function longbridgeUSCommission(shareCount, price) {
    return 0;
}

// Longbridge US Platform Fee: Fixed
function longbridgeUSPlatformFeeFixed(shareCount) {
    const feePerShare = 0.0050;
    const calculatedFee = feePerShare * shareCount;
    // Apply minimum 1 USD per order
    return Math.max(roundToCents(calculatedFee), 1); // Round calculated fee to cents before comparing with minimum
}

// Longbridge US Platform Fee: Stepped based on Monthly Shares Traded
function longbridgeUSPlatformFeeStepped(monthlyShareCount, currentOrderShareCount) {
    let feePerShare;
    if (monthlyShareCount <= 5000) {
        feePerShare = 0.0070;
    } else if (monthlyShareCount <= 10000) {
        feePerShare = 0.0060;
    } else if (monthlyShareCount <= 100000) { // 10万股
        feePerShare = 0.0050;
    } else if (monthlyShareCount <= 1000000) { // 100万股
        feePerShare = 0.0040;
    } else {
        feePerShare = 0.0030; // 100万01股以上
    }
    
    const calculatedFee = feePerShare * currentOrderShareCount;
    // Apply minimum 1 USD per order
    return Math.max(roundToCents(calculatedFee), 1); // Round calculated fee to cents before comparing with minimum
}

// Longbridge US Clearing Fee (交收费) - Same rule as Tiger, using the same function
// Rule: 0.003 USD * Shares Traded, max 7% * Transaction Value
const longbridgeUSClearingFee = tigerUSClearingFee; // Reuse the function

// Longbridge US SEC Regulatory Fee (证监会规费) - Same rule as Tiger, using the same function
// Rule: 0 USD
const longbridgeUSSECRegulatoryFee = tigerUSSECRegulatoryFee; // Reuse the function

// Longbridge US Trading Activity Fee (交易活动费) - Same rule as Tiger, using the same function
// Rule: 0.000166 USD * Sell Quantity, min 0.01 USD, max 8.30 USD
const longbridgeUSTradingActivityFee = tigerUSTradingActivityFee; // Reuse the function

// Futu US Stock Fee Calculation Functions
// Commission: 0.0049 USD/share, minimum 0.99 USD per order
// Note: Previous rule was 0 USD. Updating based on provided image.
function futuUSCommission(shareCount) {
    const feePerShare = 0.0049;
    const calculatedFee = feePerShare * shareCount;
    // Apply minimum 0.99 USD per order
    return Math.max(roundToCents(calculatedFee), 0.99); // Round to cents before applying minimum
}

// Futu US Platform Fee: Fixed
// Rule: 0.005 USD/share, minimum 1 USD per order
function futuUSPlatformFeeFixed(shareCount) {
    const feePerShare = 0.005;
    const calculatedFee = feePerShare * shareCount;
    // Apply minimum 1 USD per order
    return Math.max(roundToCents(calculatedFee), 1); // Round calculated fee to cents before comparing with minimum
}

// Futu US Platform Fee: Stepped based on Monthly Shares Traded
// Rule: Variable rate per share based on tiers, minimum 1 USD per order (per stepped calculation)
function futuUSPlatformFeeStepped(monthlyShareCount, currentOrderShareCount) {
    let feePerShare;
    if (monthlyShareCount <= 500) {
        feePerShare = 0.01;
    } else if (monthlyShareCount <= 1000) {
        feePerShare = 0.008;
    } else if (monthlyShareCount <= 5000) {
        feePerShare = 0.007;
    } else if (monthlyShareCount <= 10000) {
        feePerShare = 0.006;
    } else if (monthlyShareCount <= 50000) {
        feePerShare = 0.0055;
    } else if (monthlyShareCount <= 200000) {
        feePerShare = 0.005;
    } else if (monthlyShareCount <= 500000) {
        feePerShare = 0.0045;
    } else if (monthlyShareCount <= 1000000) {
        feePerShare = 0.004;
    } else if (monthlyShareCount <= 5000000) {
        feePerShare = 0.0035;
    } else {
        feePerShare = 0.003; // 500万01股以上
    }
    
    const calculatedFee = feePerShare * currentOrderShareCount;
    // Apply minimum 1 USD per order for this stepped calculation
    return Math.max(roundToCents(calculatedFee), 1); // Round to cents before applying minimum
}

// Futu US Exchange Fee (交易费)
function futuUSExchangeFee(shareCount) {
    return roundToCents(0.00013 * shareCount);
}

// Futu US SEC Regulatory Fee (证监会规费) - UPDATED based on image
// Rule: 0.0000278 * Transaction Value, min 0.01 USD (only on sell orders, cancelled from May 14, 2025 ET)
function futuUSSECRegulatoryFee(transactionValue, transactionDirection) {
    if (transactionDirection === 'sell') {
        const calculatedFee = transactionValue * 0.0000278;
        // Note: The cancellation date (May 14, 2025) is not handled here.
        return roundToCents(Math.max(calculatedFee, 0.01));
    }
    return 0; // Only collected on sell orders
}

// Futu US Trading Activity Fee (交易活动费) - UPDATED based on image
// Rule: 0.000166 USD * Sell Quantity, min 0.01 USD, max 8.30 USD (only on sell orders)
function futuUSTradingActivityFee(shareCount, transactionDirection) {
     if (transactionDirection === 'sell') {
        const feePerShare = 0.000166;
        const calculatedFee = feePerShare * shareCount;
        // Apply minimum 0.01 USD and maximum 8.30 USD
        return roundToCents(Math.min(Math.max(calculatedFee, 0.01), 8.30)); // Round to cents before applying min/max
    }
    return 0; // Only collected on sell orders
}



// Futu US Clearing Fee (交收费) - ADDED based on image
// Rule: 0.003 USD * Shares Traded, max 7% * Transaction Value (美国结算机构)
const futuUSClearingFee = tigerUSClearingFee; // Reuse the function as the rule is the same

// IBKR US Stock Fees
function ibkrUSCommission(mode, shares, monthlyShares, transactionValue) {
    let rate;
    if (mode === 'fixed') {
        rate = 0.005; // Fixed rate
    } else if (mode === 'stepped') {
        // Tiered rates based on monthly share volume
        if (monthlyShares <= 300000) rate = 0.0035;
        else if (monthlyShares <= 3000000) rate = 0.0020;
        else if (monthlyShares <= 20000000) rate = 0.0015;
        else if (monthlyShares <= 100000000) rate = 0.0010;
        else rate = 0.0005; // > 100,000,000 shares
    } else {
        return 0;
    }

    let commission = shares * rate;
    const minCommission = mode === 'fixed' ? 1.00 : 0.35; // Minimum per order
    const maxCommission = transactionValue * 0.01; // 1% of trade value

    return Math.min(Math.max(commission, minCommission), maxCommission);
}

function ibkrUSThirdPartyFees(shares, transactionValue, direction) {
    let fees = {};
    // SEC Transaction Fee (Sell orders only, calculated on value of sale)
    fees.secFee = (direction === 'sell') ? transactionValue * 0.0000278 : 0; // Using rate from search result example
    // Note: Screenshot shows 0.00 for SEC fee, using search result rate as it's more likely correct for calculation.

    // FINRA Trading Activity Fee (Sell orders only, calculated on quantity)
    fees.finraTaf = (direction === 'sell') ? roundToCents(shares * 0.000166) : 0;

    // FINRA Consolidated Audit Trail Fee (CAT Fee) (Calculated on quantity, usually both buy and sell)
    fees.catFee = roundToCents(shares * 0.000035);

    // Note: Exchange fees, clearing fees, and pass-through fees can also apply but are complex and variable.
    // This function includes the main regulatory fees mentioned in the screenshot/search.

    fees.total = fees.secFee + fees.finraTaf + fees.catFee;

    return fees;
}

function calculateFees() {
    // 确保 currentLang 已初始化
    if (typeof currentLang === 'undefined') {
        currentLang = 'zh-CN'; // 默认使用中文
    }

    const activeTab = document.querySelector('#marketTab button:not(.text-gray-500)').id;
    
    let transactionValue, orderCount, shareCount, monthlyShareCount, platformMode;
    let tigerTotal, futuTotal, longbridgeTotal;
    let currencyUnit;
    
    if (activeTab === 'tab-hk') {
        const resultDiv = document.getElementById('result'); // 获取港股结果区域元素
        transactionValue = parseFloat(document.getElementById('transactionValue').value);
        orderCount = parseInt(document.getElementById('orderCount').value) || 1;
        platformMode = document.getElementById('platformModeSelect').value;
        currencyUnit = currentLang === 'zh-CN' ? '港元' : 'HKD';
    
    // 输入验证
    if (isNaN(transactionValue) || transactionValue <= 0) {
            resultDiv.innerHTML = `<p class="text-red-500 dark:text-red-400">${languages[currentLang].invalidInput}</p>`;
        return;
    }

        // 计算老虎证券费用 (港股)
    const tigerComm = tigerCommission(transactionValue);
    const tigerPf = tigerPlatformFee(platformMode, orderCount);
    const tigerSd = stampDuty(transactionValue); // 使用公共 stampDuty
    const tigerSl = sfcLevy(transactionValue); // 使用公共 sfcLevy
    const tigerFl = frcLevy(transactionValue); // 使用公共 frcLevy
    const tigerSf = settlementFee(transactionValue); // 使用公共 settlementFee
    const tigerEf = exchangeFee(transactionValue); // 使用公共 exchangeFee
    
    // Total Tiger fees (包含所有列出的子费用)
    tigerTotal = tigerComm + tigerPf + tigerSd + tigerSl + tigerFl + tigerSf + tigerEf;

        // 计算长桥证券费用 (港股)
    const lbComm = longbridgeCommission(transactionValue);
    const lbPf = longbridgePlatformFee(platformMode, orderCount);
    const lbSd = stampDuty(transactionValue); // 使用公共 stampDuty
    const lbTf = exchangeFee(transactionValue); // 使用公共 exchangeFee
    const lbSl = sfcLevy(transactionValue); // 使用公共 sfcLevy
    const lbFl = frcLevy(transactionValue); // 使用公共 frcLevy
    const lbSf = settlementFee(transactionValue); // 使用公共 settlementFee
    longbridgeTotal = lbComm + lbPf + lbSd + lbTf + lbSl + lbFl + lbSf;

        // 计算富途证券费用 (港股)
    const futuComm = futuCommission(transactionValue);
    const futuPf = futuPlatformFee(platformMode, orderCount);
    const futuSd = stampDuty(transactionValue); // 使用公共 stampDuty
    const futuTf = exchangeFee(transactionValue); // 使用公共 exchangeFee
    const futuSl = sfcLevy(transactionValue); // 使用公共 sfcLevy
    const futuFl = frcLevy(transactionValue); // 使用公共 frcLevy
    const futuSf = settlementFee(transactionValue); // 使用公共 settlementFee
    futuTotal = futuComm + futuPf + futuSd + futuTf + futuSl + futuFl + futuSf;

         // 找出最低总费用
        const minTotal = Math.min(tigerTotal, longbridgeTotal, futuTotal);

        // 生成结果HTML (港股)
    resultDiv.innerHTML = `
             <div class="grid grid-cols-1 mt-8 md:grid-cols-3 gap-4">
            <!-- 老虎证券卡片 -->
                 <div class="bg-yellow-50 dark:bg-broker-yellow/10 rounded-lg p-6 border-l-4 border-yellow-400 dark:border-broker-yellow break-words">
                     <div class="flex items-center mb-4">
                         <img src="public/tiger.png" alt="老虎证券" class="h-8 w-auto mr-3 rounded-full" />
                         <div>
                             <div class="text-base font-semibold text-gray-900 dark:text-dark-text leading-tight flex items-center">
                                 老虎证券
                                 ${tigerTotal === minTotal ? `<span class="ml-1 px-1.5 py-0.5 text-[10px] font-medium text-broker-primary bg-broker-primary/10 dark:bg-broker-primary/20 rounded-full">${languages[currentLang].bestPrice}</span>` : ''}
                             </div>
                             <div class="text-xs text-gray-500 dark:text-dark-text-secondary tracking-wide">TIGER BROKERS</div>
                         </div>
                     </div>
                     <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">${languages[currentLang].agencyServiceFee}</h4>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span class="${tigerComm === 0 ? 'line-through' : ''}">${tigerComm.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full">
                         <span>${languages[currentLang].platformFee}</span>
                         <span class="${tigerPf === 0 ? 'line-through' : ''}">${tigerPf.toFixed(2)} ${currencyUnit}</span>
                     </p>
                     ${platformMode === 'stepped' ? `<p class="text-xs text-gray-500 dark:text-dark-text-secondary text-right">${languages[currentLang].basedOnMonthlyOrders.replace('{count}', orderCount)}</p>` : ''}
                     
                     <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mt-4 mb-2">${languages[currentLang].collectedFee}</h4>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].transactionFee}</span><span class="${tigerEf === 0 ? 'line-through' : ''}">${tigerEf.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].stampDuty}</span><span class="${tigerSd === 0 ? 'line-through' : ''}">${tigerSd.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].sfcLevy}</span><span class="${tigerSl === 0 ? 'line-through' : ''}">${tigerSl.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].frcLevy}</span><span class="${tigerFl === 0 ? 'line-through' : ''}">${tigerFl.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].settlementFee}</span><span class="${tigerSf === 0 ? 'line-through' : ''}">${tigerSf.toFixed(2)} ${currencyUnit}</span></p>
                     <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 w-full">
                         <p class="text-base font-semibold text-gray-900 dark:text-dark-text flex justify-between w-full">
                             <span>${languages[currentLang].totalFee}</span>
                             <span>${tigerTotal.toFixed(2)} ${currencyUnit}</span>
                    </p>
                </div>
            </div>
        
            <!-- 富途证券卡片 -->
                 <div class="bg-orange-50 dark:bg-broker-orange/10 rounded-lg p-6 border-l-4 border-orange-400 dark:border-broker-orange break-words">
                     <div class="flex items-center mb-4">
                         <img src="public/futu.png" alt="富途证券" class="h-8 w-auto mr-3 rounded-full" />
                         <div>
                             <div class="text-base font-semibold text-gray-900 dark:text-dark-text leading-tight flex items-center">
                                 富途证券
                                 ${futuTotal === minTotal ? `<span class="ml-1 px-1.5 py-0.5 text-[10px] font-medium text-broker-pink bg-broker-orange/10 dark:bg-broker-orange/20 rounded-full">${languages[currentLang].bestPrice}</span>` : ''}
                             </div>
                             <div class="text-xs text-gray-500 dark:text-dark-text-secondary tracking-wide">FUTU</div>
                         </div>
                     </div>
                     <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">${languages[currentLang].agencyServiceFee}</h4>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span class="${futuComm === 0 ? 'line-through' : ''}">${futuComm.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full">
                         <span>${languages[currentLang].platformFee}</span>
                         <span class="${futuPf === 0 ? 'line-through' : ''}">${futuPf.toFixed(2)} ${currencyUnit}</span>
                     </p>
                     ${platformMode === 'stepped' ? `<p class="text-xs text-gray-500 dark:text-dark-text-secondary text-right">${languages[currentLang].basedOnMonthlyOrders.replace('{count}', orderCount)}</p>` : ''}
                     
                     <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mt-4 mb-2">${languages[currentLang].collectedFee}</h4>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].transactionFee}</span><span class="${futuTf === 0 ? 'line-through' : ''}">${futuTf.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].stampDuty}</span><span class="${futuSd === 0 ? 'line-through' : ''}">${futuSd.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].sfcLevy}</span><span class="${futuSl === 0 ? 'line-through' : ''}">${futuSl.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].frcLevy}</span><span class="${futuFl === 0 ? 'line-through' : ''}">${futuFl.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].settlementFee}</span><span class="${futuSf === 0 ? 'line-through' : ''}">${futuSf.toFixed(2)} ${currencyUnit}</span></p>
                     <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 w-full">
                         <p class="text-base font-semibold text-gray-900 dark:text-dark-text flex justify-between w-full">
                             <span>${languages[currentLang].totalFee}</span>
                             <span>${futuTotal.toFixed(2)} ${currencyUnit}</span>
                    </p>
                </div>
            </div>
        
            <!-- 长桥证券卡片 -->
                 <div class="bg-blue-50 dark:bg-broker-green/10 rounded-lg p-6 border-l-4 border-blue-500 dark:border-broker-green break-words">
                     <div class="flex items-center mb-4">
                         <img src="public/longbridge.png" alt="长桥证券" class="h-8 w-auto mr-3 rounded-full" />
                         <div>
                             <div class="text-base font-semibold text-gray-900 dark:text-dark-text leading-tight flex items-center">
                                 长桥证券
                                 ${longbridgeTotal === minTotal ? `<span class="ml-1 px-1.5 py-0.5 text-[10px] font-medium text-broker-green bg-broker-green/10 dark:bg-broker-green/20 rounded-full">${languages[currentLang].bestPrice}</span>` : ''}
                             </div>
                             <div class="text-xs text-gray-500 dark:text-dark-text-secondary tracking-wide">LONGBRIDGE</div>
                         </div>
                     </div>
                     <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">${languages[currentLang].agencyServiceFee}</h4>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span class="${lbComm === 0 ? 'line-through' : ''}">${lbComm.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full">
                         <span>${languages[currentLang].platformFee}</span>
                         <span class="${lbPf === 0 ? 'line-through' : ''}">${lbPf.toFixed(2)} ${currencyUnit}</span>
                     </p>
                     ${platformMode === 'stepped' ? `<p class="text-xs text-gray-500 dark:text-dark-text-secondary text-right">${languages[currentLang].basedOnMonthlyOrders.replace('{count}', orderCount)}</p>` : ''}
                     
                     <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mt-4 mb-2">${languages[currentLang].collectedFee}</h4>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].transactionFee}</span><span class="${lbTf === 0 ? 'line-through' : ''}">${lbTf.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].stampDuty}</span><span class="${lbSd === 0 ? 'line-through' : ''}">${lbSd.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].sfcLevy}</span><span class="${lbSl === 0 ? 'line-through' : ''}">${lbSl.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].frcLevy}</span><span class="${lbFl === 0 ? 'line-through' : ''}">${lbFl.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].settlementFee}</span><span class="${lbSf === 0 ? 'line-through' : ''}">${lbSf.toFixed(2)} ${currencyUnit}</span></p>
                     <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 w-full">
                         <p class="text-base font-semibold text-gray-900 dark:text-dark-text flex justify-between w-full">
                             <span>${languages[currentLang].totalFee}</span>
                             <span>${longbridgeTotal.toFixed(2)} ${currencyUnit}</span>
                         </p>
                     </div>
                 </div>
             </div>
             <div class="text-center text-gray-500 dark:text-dark-text-secondary mt-6 text-sm">${languages[currentLang].moreBrokers}</div>
             <p class="text-center text-gray-400 dark:text-dark-text-secondary mt-6 text-xs">${languages[currentLang].disclaimer}</p>
         `;
    } else if (activeTab === 'tab-us') {
        const usTransactionValue = parseFloat(document.getElementById('usTransactionValue').value);
        const usShareCount = parseInt(document.getElementById('usShareCount').value) || 0;
        const usMonthlyShareCount = parseInt(document.getElementById('usMonthlyShareCount').value) || usShareCount; // 如果月交易股数未输入，使用单次交易股数作为估计
        const usTransactionDirectionSelect = document.getElementById('usTransactionDirectionSelect');
        const usTransactionDirection = usTransactionDirectionSelect.value; // 'buy' or 'sell'
        const usPlatformModeSelect = document.getElementById('usPlatformModeSelect');
        const usPlatformMode = usPlatformModeSelect.value; // 'fixed' or 'stepped'
        currencyUnit = 'USD'; // 美股使用美元

        // 检查输入是否有效
        if (isNaN(usTransactionValue) || usTransactionValue <= 0 || isNaN(usShareCount) || usShareCount <= 0 || isNaN(usMonthlyShareCount) || usMonthlyShareCount < 0) {
            document.getElementById('us-result').innerHTML = `<p class="text-red-500">${languages[currentLang].invalidInput}</p>`;
            return;
        }

        // 计算老虎证券美股费用
        const tigerUSComm = tigerUSCommission(usShareCount, usTransactionValue);
        // 老虎美股平台费根据模式计算
        let tigerUSPf = 0;
        if (usPlatformMode === 'fixed') {
            tigerUSPf = tigerUSPlatformFeeFixed(usShareCount);
        } else if (usPlatformMode === 'stepped') {
             tigerUSPf = tigerUSPlatformFeeStepped(usMonthlyShareCount, usShareCount);
        }
        const tigerUSClearFee = tigerUSClearingFee(usShareCount, usTransactionValue);
        const tigerUSSecLevy = tigerUSSECRegulatoryFee(usTransactionValue);
        const tigerUSTradingFee = tigerUSTradingActivityFee(usShareCount, usTransactionDirection);
        const tigerUSTotal = tigerUSComm + tigerUSPf + tigerUSClearFee + tigerUSSecLevy + tigerUSTradingFee;

        // 计算富途证券美股费用
        const futuUSComm = futuUSCommission(usShareCount);
         let futuUSPf = 0;
        if (usPlatformMode === 'fixed') {
            futuUSPf = futuUSPlatformFeeFixed(usShareCount);
        } else if (usPlatformMode === 'stepped') {
             futuUSPf = futuUSPlatformFeeStepped(usMonthlyShareCount, usShareCount);
        }
        const futuUSClearFee = futuUSClearingFee(usShareCount, usTransactionValue);
        const futuUSSecLevy = futuUSSECRegulatoryFee(usTransactionValue, usTransactionDirection);
        const futuUSTradingFee = futuUSTradingActivityFee(usShareCount, usTransactionDirection);
        const futuUSTotal = futuUSComm + futuUSPf + futuUSClearFee + futuUSSecLevy + futuUSTradingFee;

        // 计算长桥证券美股费用
        const longbridgeUSComm = longbridgeUSCommission(usShareCount, usTransactionValue / usShareCount); // Assuming price is transactionValue / shareCount
         let longbridgeUSPf = 0;
         if (usPlatformMode === 'fixed') {
             longbridgeUSPf = longbridgeUSPlatformFeeFixed(usShareCount);
         } else if (usPlatformMode === 'stepped') {
             longbridgeUSPf = longbridgeUSPlatformFeeStepped(usMonthlyShareCount, usShareCount);
         }
        const longbridgeUSClearFee = longbridgeUSClearingFee(usShareCount, usTransactionValue);
        const longbridgeUSSecLevy = longbridgeUSSECRegulatoryFee(usTransactionValue);
        const longbridgeUSTradingFee = longbridgeUSTradingActivityFee(usShareCount, usTransactionDirection);
        const longbridgeUSTotal = longbridgeUSComm + longbridgeUSPf + longbridgeUSClearFee + longbridgeUSSecLevy + longbridgeUSTradingFee;

        // 计算盈透证券美股费用
        let ibkrUSComm = ibkrUSCommission(usPlatformMode, usShareCount, usMonthlyShareCount, usTransactionValue);
        let ibkrUSThirdPartyFeesDetail = ibkrUSThirdPartyFees(usShareCount, usTransactionValue, usTransactionDirection);
        let ibkrUSCollectedFees = ibkrUSThirdPartyFeesDetail.total;
        let ibkrUSTotal = ibkrUSComm + ibkrUSCollectedFees;


        // 找出最低总费用
        let minTotal = Math.min(tigerUSTotal, futuUSTotal, longbridgeUSTotal, ibkrUSTotal);

        // 生成结果HTML (美股)
        document.getElementById('us-result').innerHTML = `
             <div class="grid grid-cols-1 mt-8 md:grid-cols-3 gap-4">

                <!-- 老虎证券美股卡片 -->
                 <div class="bg-yellow-50 dark:bg-broker-yellow/10 rounded-lg p-6 border-l-4 border-yellow-400 dark:border-broker-yellow break-words flex flex-col">
                     <div class="flex items-center mb-4">
                         <img src="public/tiger.png" alt="老虎证券" class="h-8 w-auto mr-3 rounded-full" />
                         <div>
                             <div class="text-base font-semibold text-gray-900 dark:text-dark-text leading-tight flex items-center">
                                 老虎证券 (美股)
                                 ${tigerUSTotal === minTotal ? `<span class="ml-1 px-1.5 py-0.5 text-[10px] font-medium text-broker-primary bg-broker-primary/10 dark:bg-broker-primary/20 rounded-full">${languages[currentLang].bestPrice}</span>` : ''}
                             </div>
                             <div class="text-xs text-gray-500 dark:text-dark-text-secondary tracking-wide">TIGER BROKERS</div>
                         </div>
                     </div>
                     <div class="flex-grow">
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">${languages[currentLang].agencyServiceFee}</h4>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span class="${tigerUSComm === 0 ? 'line-through' : ''}">${tigerUSComm.toFixed(2)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].platformFee}</span><span class="${tigerUSPf === 0 ? 'line-through' : ''}">${tigerUSPf.toFixed(2)} ${currencyUnit}</span></p>
                     </div>
                    
                     <div class="flex-grow mt-4">
                         <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">${languages[currentLang].collectedFee}</h4>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usClearingFee}</span><span class="${tigerUSClearFee === 0 ? 'line-through' : ''}">${tigerUSClearFee.toFixed(2)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usSECRegulatoryFee}</span><span class="${tigerUSSecLevy === 0 ? 'line-through' : ''}">${tigerUSSecLevy.toFixed(2)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usTradingActivityFee}</span><span class="${tigerUSTradingFee === 0 ? 'line-through' : ''}">${tigerUSTradingFee.toFixed(2)} ${currencyUnit}</span></p>
                         <!-- Note: Tiger does not list a separate CAT fee, it might be included in other fees -->
                     </div>
                    
                    <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 w-full">
                        <p class="text-base font-semibold text-gray-900 dark:text-dark-text flex justify-between w-full">
                            <span>${languages[currentLang].totalFee}</span>
                            <span>${tigerUSTotal.toFixed(2)} ${currencyUnit}</span>
                        </p>
                    </div>
                </div>

                <!-- 富途证券美股卡片 -->
                <div class="bg-orange-50 dark:bg-broker-orange/10 rounded-lg p-6 border-l-4 border-orange-400 dark:border-broker-orange break-words flex flex-col">
                    <div class="flex items-center mb-4">
                        <img src="public/futu.png" alt="富途证券" class="h-8 w-auto mr-3 rounded-full" />
                        <div>
                            <div class="text-base font-semibold text-gray-900 dark:text-dark-text leading-tight flex items-center">
                                富途证券 (美股)
                                ${futuUSTotal === minTotal ? `<span class="ml-1 px-1.5 py-0.5 text-[10px] font-medium text-broker-pink bg-broker-orange/10 dark:bg-broker-orange/20 rounded-full">${languages[currentLang].bestPrice}</span>` : ''}
                            </div>
                            <div class="text-xs text-gray-500 dark:text-dark-text-secondary tracking-wide">FUTU</div>
                        </div>
                    </div>
                    <div class="flex-grow">
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">${languages[currentLang].agencyServiceFee}</h4>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span class="${futuUSComm === 0 ? 'line-through' : ''}">${futuUSComm.toFixed(2)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].platformFee}</span><span class="${futuUSPf === 0 ? 'line-through' : ''}">${futuUSPf.toFixed(2)} ${currencyUnit}</span></p>
                    </div>
                    
                    <div class="flex-grow mt-4">
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">${languages[currentLang].collectedFee}</h4>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usClearingFee}</span><span class="${futuUSClearFee === 0 ? 'line-through' : ''}">${futuUSClearFee.toFixed(2)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usSECRegulatoryFee}</span><span class="${futuUSSecLevy === 0 ? 'line-through' : ''}">${futuUSSecLevy.toFixed(2)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usTradingActivityFee}</span><span class="${futuUSTradingFee === 0 ? 'line-through' : ''}">${futuUSTradingFee.toFixed(2)} ${currencyUnit}</span></p>
                    </div>
                    
                    <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 w-full">
                        <p class="text-base font-semibold text-gray-900 dark:text-dark-text flex justify-between w-full">
                            <span>${languages[currentLang].totalFee}</span>
                            <span>${futuUSTotal.toFixed(2)} ${currencyUnit}</span>
                        </p>
                    </div>
                </div>

                 <!-- 长桥证券美股卡片 -->
                <div class="bg-blue-50 dark:bg-broker-green/10 rounded-lg p-6 border-l-4 border-blue-500 dark:border-broker-green break-words flex flex-col">
                    <div class="flex items-center mb-4">
                        <img src="public/longbridge.png" alt="长桥证券" class="h-8 w-auto mr-3 rounded-full" />
                        <div>
                            <div class="text-base font-semibold text-gray-900 dark:text-dark-text leading-tight flex items-center">
                                长桥证券 (美股)
                                ${longbridgeUSTotal === minTotal ? `<span class="ml-1 px-1.5 py-0.5 text-[10px] font-medium text-broker-green bg-broker-green/10 dark:bg-broker-green/20 rounded-full">${languages[currentLang].bestPrice}</span>` : ''}
                            </div>
                            <div class="text-xs text-gray-500 dark:text-dark-text-secondary tracking-wide">LONGBRIDGE</div>
                        </div>
                    </div>
                    <div class="flex-grow">
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">${languages[currentLang].agencyServiceFee}</h4>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span class="${longbridgeUSComm === 0 ? 'line-through' : ''}">${longbridgeUSComm.toFixed(2)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].platformFee}</span><span class="${longbridgeUSPf === 0 ? 'line-through' : ''}">${longbridgeUSPf.toFixed(2)} ${currencyUnit}</span></p>
                    </div>
                    
                    <div class="flex-grow mt-4">
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">${languages[currentLang].collectedFee}</h4>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usClearingFee}</span><span class="${longbridgeUSClearFee === 0 ? 'line-through' : ''}">${longbridgeUSClearFee.toFixed(2)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usSECRegulatoryFee}</span><span class="${longbridgeUSSecLevy === 0 ? 'line-through' : ''}">${longbridgeUSSecLevy.toFixed(2)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usTradingActivityFee}</span><span class="${longbridgeUSTradingFee === 0 ? 'line-through' : ''}">${longbridgeUSTradingFee.toFixed(2)} ${currencyUnit}</span></p>
                    </div>
                    
                    <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 w-full">
                        <p class="text-base font-semibold text-gray-900 dark:text-dark-text flex justify-between w-full">
                            <span>${languages[currentLang].totalFee}</span>
                            <span>${longbridgeUSTotal.toFixed(2)} ${currencyUnit}</span>
                        </p>
                    </div>
                </div>

                <!-- 盈透证券美股卡片 -->
                <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border-l-4 border-red-600 dark:border-red-700 break-words flex flex-col">
                    <div class="flex items-center mb-4">
                         <img src="public/ibkr.png" alt="盈透证券" class="h-8 w-auto mr-3 rounded-full" />
                         <div>
                             <div class="text-base font-semibold text-gray-900 dark:text-dark-text leading-tight flex items-center">
                                 盈透证券 (美股)
                                 ${ibkrUSTotal === minTotal ? `<span class="ml-1 px-1.5 py-0.5 text-[10px] font-medium text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-800/30 rounded-full">${languages[currentLang].bestPrice}</span>` : ''}
                             </div>
                             <div class="text-xs text-gray-500 dark:text-dark-text-secondary tracking-wide">IBKR</div>
                         </div>
                    </div>
                     <div class="flex-grow">
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">${languages[currentLang].agencyServiceFee}</h4>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span class="${ibkrUSComm === 0 ? 'line-through' : ''}">${ibkrUSComm.toFixed(2)} ${currencyUnit}</span></p>
                         <!-- IBKR does not list a separate Platform Fee in their US pricing -->
                     </div>
                    
                     <div class="flex-grow mt-4">
                         <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">${languages[currentLang].collectedFee}</h4>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usSECRegulatoryFee}</span><span class="${ibkrUSThirdPartyFeesDetail.secFee === 0 ? 'line-through' : ''}">${ibkrUSThirdPartyFeesDetail.secFee.toFixed(2) } ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usTradingActivityFee}</span><span class="${ibkrUSThirdPartyFeesDetail.finraTaf === 0 ? 'line-through' : ''}">${ibkrUSThirdPartyFeesDetail.finraTaf.toFixed(2) } ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usCATFee}</span><span class="${ibkrUSThirdPartyFeesDetail.catFee === 0 ? 'line-through' : ''}">${ibkrUSThirdPartyFeesDetail.catFee.toFixed(2) } ${currencyUnit}</span></p>
                        <!-- Note: Exchange/Clearing/Pass-Through Fees can also apply but are complex and variable -->
                     </div>
                    
                    <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 w-full">
                        <p class="text-base font-semibold text-gray-900 dark:text-dark-text flex justify-between w-full">
                            <span>${languages[currentLang].totalFee}</span>
                            <span>${ibkrUSTotal.toFixed(2)} ${currencyUnit}</span>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
}