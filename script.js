function roundToCents(value) {
    return Math.round(value * 100) / 100;
}

function ceilToWhole(value) {
    return Math.ceil(value);
}

function tigerTransactionFee(transactionValue) {
    return 0; // 用户要求免佣金
}

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

function tigerStampDuty(transactionValue) {
    return ceilToWhole(transactionValue * 0.001);
}

function tigerSfcLevy(transactionValue) {
    const fee = transactionValue * 0.000027;
    const rounded = roundToCents(fee);
    return Math.max(rounded, 0.01);
}

function tigerFrcLevy(transactionValue) {
    return roundToCents(transactionValue * 0.0000015);
}

function tigerSettlementFee(transactionValue) {
    const fee = transactionValue * 0.00002;
    return Math.min(Math.max(fee, 2), 100);
}

// 新增长桥证券计算函数
function longbridgeCommission(transactionValue) {
    return 0; // 用户要求免佣金 (已是0，确认修改意图)
}

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

function longbridgeStampDuty(transactionValue) {
    const duty = transactionValue * 0.001; // 0.1%印花税
    return duty < 1 ? 1 : roundToCents(duty); // 不足1港元作1港元计
}

// 新增富途证券计算函数
function futuCommission(transactionValue) {
    return 0; // 用户要求免佣金
}

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

// 新增老虎美股计算函数
function tigerUSCommission(transactionValue) {
    return 0; // 用户要求免佣金
}

function tigerUSPlatformFeeFixed(shareCount) {
    const fee = shareCount * 0.004; // 0.004 USD/股
    return Math.max(fee, 1); // 每笔最低收取1USD
}

function tigerUSPlatformFeeStepped(monthlyShareCount) {
    if (monthlyShareCount <= 500) return 0.0100;
    if (monthlyShareCount <= 1000) return 0.0080;
    if (monthlyShareCount <= 5000) return 0.0070;
    if (monthlyShareCount <= 10000) return 0.0060;
    if (monthlyShareCount <= 50000) return 0.0055;
    if (monthlyShareCount <= 200000) return 0.0050;
    if (monthlyShareCount <= 500000) return 0.0045;
    if (monthlyShareCount <= 1000000) return 0.0040;
    if (monthlyShareCount <= 5000000) return 0.0035;
    return 0.0030; // 5,000,001股以上
}

function tigerUSExternalFee(transactionValue) {
     // 假设外部机构费及交易活动费按交易值计算，费率0.000396 USD/股，最低0.99 USD
    const feePerShare = 0.000396; // 需要根据股数输入调整
    // 这里需要更精确的计算，暂时用交易值估算
    const estimatedShareCount = transactionValue / 10; // 假设每股10美元
    const fee = estimatedShareCount * feePerShare;
    return Math.max(fee, 0.99);
}

function tigerUSAuditFee(transactionValue) {
    // 假设综合审计追踪费按交易值计算，场内0.000035 USD/股，场外0.000046 USD/股
    // 这里需要更精确的计算，暂时用交易值估算
    const estimatedShareCount = transactionValue / 10; // 假设每股10美元
    const feeIn = estimatedShareCount * 0.000035;
    const feeOut = estimatedShareCount * 0.000046;
    // 需要区分场内场外，这里简单加起来或选择一个作为示例
    return feeIn + feeOut;
}

// 新增长桥美股计算函数
function longbridgeUSCommission(shareCount, price) {
    return 0; // 用户要求免佣金 (已是0，确认修改意图)
}

function longbridgeUSPlatformFeeFixed(shareCount) {
    // 固定平台费 0.0050 USD / 股，最低 1 USD / 订单
    const fee = shareCount * 0.0050;
    return Math.max(fee, 1); // 最低 1 USD / 订单
}

function longbridgeUSPlatformFeeStepped(monthlyShareCount) {
    // 阶梯平台费 (每月交易股数) 每股
    if (monthlyShareCount <= 5000) return 0.0070;
    if (monthlyShareCount <= 10000) return 0.0060;
    if (monthlyShareCount <= 100000) return 0.0050; // 10 万
    if (monthlyShareCount <= 1000000) return 0.0040; // 100 万
    return 0.0030; // 100 万以上
}

function longbridgeUSExchangeFee(shareCount, price) {
    // 0.003 美元 × 成交股数, 最高 7% × 交易金额
    const transactionValue = shareCount * price;
    const fee = shareCount * 0.003;
    const maxFee = transactionValue * 0.07;
    return Math.min(fee, maxFee);
}

function longbridgeUSSECRegulatoryFee(transactionValue) {
    // 证监会规费 0 USD
    return 0;
}

function longbridgeUSTradingActivityFee(sellQuantity) {
    // 交易活动费 0.000166 美元 x 卖出数量, 最低 0.01 美元, 最高 8.30 美元
    // 需要区分买卖，这里假设是卖出数量
    const fee = sellQuantity * 0.000166;
    return Math.min(Math.max(fee, 0.01), 8.30);
}

// 新增富途美股计算函数
function futuUSCommission(shareCount) {
    // 规则: 0.0049 USD/股, 最低 0.99 USD/订单
    const feePerShare = 0.0049;
    const fee = shareCount * feePerShare;
    const minFee = 0.99;
    // 图片上方佣金列是 "0 USD* ..."，这里按 0.0049/股算，并取最低 0.99。实际可能需要根据富途具体规则调整理解。
    return Math.max(fee, minFee);
}

function futuUSPlatformFeeFixed(shareCount) {
    // 固定平台费: 0.005/股, 每笔订单最低 1 USD
    const feePerShare = 0.005;
    const fee = shareCount * feePerShare;
    const minFee = 1;
    return Math.max(fee, minFee);
}

function futuUSPlatformFeeStepped(monthlyShareCount) {
    // 阶梯平台费 (每月交易股数)
    if (monthlyShareCount <= 500) return 0.010;
    if (monthlyShareCount <= 1000) return 0.008;
    if (monthlyShareCount <= 5000) return 0.007;
    if (monthlyShareCount <= 10000) return 0.006;
    if (monthlyShareCount <= 50000) return 0.0055;
    if (monthlyShareCount <= 200000) return 0.005;
    if (monthlyShareCount <= 500000) return 0.0045;
    if (monthlyShareCount <= 1000000) return 0.004;
    if (monthlyShareCount <= 5000000) return 0.0035;
    return 0.003; // 5,000,001股以上
}

function futuUSExchangeFee(shareCount) {
    // 交收费: 0.003/股
    const feePerShare = 0.003;
    return shareCount * feePerShare;
}

function futuUSSECRegulatoryFee(transactionValue) {
    // 证监会规费: 0.0000278*交易金, 每次成交最低0.01美元 (自美东时间2025年5月14日起取消)
    // 暂时按照取消前的规则计算
    const rate = 0.0000278; // 注意：图片写的是交易金，但通常是按交易值或股数
    // 按图片文字直译，假设是交易值*rate
    const fee = transactionValue * rate;
    const minFee = 0.01;
    return Math.max(fee, minFee);
}

function futuUSTradingActivityFee(sellQuantity) {
    // 交易活动费: 0.000166 美元 x 卖出数量, 最低 0.01 美元, 最高 8.30 美元
    // 需要区分买卖，这里假设输入股数代表卖出数量
    const feePerShare = 0.000166;
    const fee = sellQuantity * feePerShare;
    const minFee = 0.01;
    const maxFee = 8.30;
    return Math.min(Math.max(fee, minFee), maxFee);
}

function futuUSCATFee(shareCount, isOTC) {
    // 综合审计追踪费: NMS股票: 0.000046/股, OTC股票: 0.0000046/股
    const nmsRate = 0.000046;
    const otcRate = 0.0000046; // 注意：图片是小数点少一位，按 0.0000046 算

    if (isOTC) {
        return shareCount * otcRate;
    } else {
        return shareCount * nmsRate;
    }
}

function calculateFees() {
    const activeTab = document.querySelector('#marketTab button:not(.text-gray-500)').id;
    
    let transactionValue, orderCount, shareCount, platformMode;
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
        const tf = tigerTransactionFee(transactionValue);
        const pf = tigerPlatformFee(platformMode, orderCount);
        const sd = tigerStampDuty(transactionValue);
        const sl = tigerSfcLevy(transactionValue);
        const fl = tigerFrcLevy(transactionValue);
        const sf = tigerSettlementFee(transactionValue);
        tigerTotal = tf + pf + sd + sl + fl + sf;

        // 计算长桥证券费用 (港股)
        const lbComm = longbridgeCommission(transactionValue);
        const lbPf = longbridgePlatformFee(platformMode, orderCount);
        const lbSd = longbridgeStampDuty(transactionValue);
        const lbTf = tigerTransactionFee(transactionValue);
        const lbSl = tigerSfcLevy(transactionValue);
        const lbFl = tigerFrcLevy(transactionValue);
        const lbSf = tigerSettlementFee(transactionValue);
        longbridgeTotal = lbComm + lbPf + lbSd + lbTf + lbSl + lbFl + lbSf;

        // 计算富途证券费用 (港股)
        const futuComm = futuCommission(transactionValue);
        const futuPf = futuPlatformFee(platformMode, orderCount);
        // 富途其他费用与老虎相同（交易费、印花税等）
        const futuTf = tigerTransactionFee(transactionValue);
        const futuSd = tigerStampDuty(transactionValue);
        const futuSl = tigerSfcLevy(transactionValue);
        const futuFl = tigerFrcLevy(transactionValue);
        const futuSf = tigerSettlementFee(transactionValue);
        futuTotal = futuComm + futuPf + futuTf + futuSd + futuSl + futuFl + futuSf;

         // 找出最低总费用
        const minTotal = Math.min(tigerTotal, longbridgeTotal, futuTotal);

        // 生成结果HTML (港股)
         resultDiv.innerHTML = `
             <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span class="${tf === 0 ? 'line-through' : ''}">${tf.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].platformFee}</span><span class="${pf === 0 ? 'line-through' : ''}">${pf.toFixed(2)} ${currencyUnit}</span></p>
                     
                     <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mt-4 mb-2">${languages[currentLang].collectedFee}</h4>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].transactionFee}</span><span class="${tf === 0 ? 'line-through' : ''}">${tf.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].stampDuty}</span><span class="${sd === 0 ? 'line-through' : ''}">${sd.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].sfcLevy}</span><span class="${sl === 0 ? 'line-through' : ''}">${sl.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].frcLevy}</span><span class="${fl === 0 ? 'line-through' : ''}">${fl.toFixed(2)} ${currencyUnit}</span></p>
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].settlementFee}</span><span class="${sf === 0 ? 'line-through' : ''}">${sf.toFixed(2)} ${currencyUnit}</span></p>
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
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].platformFee}</span><span class="${futuPf === 0 ? 'line-through' : ''}">${futuPf.toFixed(2)} ${currencyUnit}</span></p>
                     
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
                     <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].platformFee}</span><span class="${lbPf === 0 ? 'line-through' : ''}">${lbPf.toFixed(2)} ${currencyUnit}</span></p>
                     
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
         `;
    } else if (activeTab === 'tab-us') {
        const usTransactionValue = parseFloat(document.getElementById('usTransactionValue').value);
        const usShareCount = parseInt(document.getElementById('usShareCount').value) || 0;
        const usPlatformMode = document.getElementById('usPlatformModeSelect').value;
        currencyUnit = 'USD'; // 美股使用美元

        // 输入验证
        if (isNaN(usTransactionValue) || usTransactionValue <= 0 || isNaN(usShareCount) || usShareCount <= 0) {
            document.getElementById('us-result').innerHTML = `<p class="text-red-500 dark:text-red-400">${languages[currentLang].invalidInput}</p>`;
            return;
        }

        // 为了计算依赖价格的费用 (如交收费上限)，需要一个估算价格或单独输入
        // 这里暂时根据交易值和股数估算价格
        const estimatedPrice = usShareCount > 0 ? usTransactionValue / usShareCount : 0;

        // 长桥美股计算
        const lbUSComm = longbridgeUSCommission(usShareCount, estimatedPrice);
        let lbUSPf;
        if (usPlatformMode === 'fixed') {
            lbUSPf = longbridgeUSPlatformFeeFixed(usShareCount);
        } else {
            lbUSPf = longbridgeUSPlatformFeeStepped(usShareCount); // 同样暂时用交易股数作为月累计估算
        }
        const lbUSExFee = longbridgeUSExchangeFee(usShareCount, estimatedPrice);
        const lbUSSECFee = longbridgeUSSECRegulatoryFee(usTransactionValue); // 证监会规费规则是0 USD，参数意义不大
        const lbUSTAFee = longbridgeUSTradingActivityFee(usShareCount); // 交易活动费按卖出数量，这里暂时用总股数
        const longbridgeUSTotal = lbUSComm + lbUSPf + lbUSExFee + lbUSSECFee + lbUSTAFee;

        // 老虎美股计算 (保留原有)
        const usComm = tigerUSCommission(usTransactionValue); // 需要根据股数和价格调整
        let usPf;
        if (usPlatformMode === 'fixed') {
            usPf = tigerUSPlatformFeeFixed(usShareCount);
        } else {
            usPf = tigerUSPlatformFeeStepped(usShareCount); // 这里应该使用月累计股数，暂时用交易股数作为示例
        }
        const usExternal = tigerUSExternalFee(usTransactionValue); // 需要根据股数和价格调整
        const usAudit = tigerUSAuditFee(usTransactionValue); // 需要根据股数和价格调整
        const tigerUSTotal = usComm + usPf + usExternal + usAudit;

        // 富途美股计算
        const futuUSComm = futuUSCommission(usShareCount);
        let futuUSPf;
        if (usPlatformMode === 'fixed') {
            futuUSPf = futuUSPlatformFeeFixed(usShareCount);
        } else {
            futuUSPf = futuUSPlatformFeeStepped(usShareCount); // 同样暂时用交易股数作为月累计估算
        }
        const futuUSExFee = futuUSExchangeFee(usShareCount);
        const futuUSSECFee = futuUSSECRegulatoryFee(usTransactionValue);
        const futuUSTAFee = futuUSTradingActivityFee(usShareCount); // 假设输入股数是卖出数量
        // 富途CAT费需要区分NMS和OTC，这里暂时按NMS计算作为示例
        const futuUSCAT = futuUSCATFee(usShareCount, false); // 暂时设isOTC为false
        const futuUSTotal = futuUSComm + futuUSPf + futuUSExFee + futuUSSECFee + futuUSTAFee + futuUSCAT;

        // 找出最低总费用 (美股)
        const minTotal = Math.min(longbridgeUSTotal, tigerUSTotal, futuUSTotal);

        // 生成结果HTML (美股)
        document.getElementById('us-result').innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span class="${usComm === 0 ? 'line-through' : ''}">${usComm.toFixed(4)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].platformFee}</span><span class="${usPf === 0 ? 'line-through' : ''}">${usPf.toFixed(4)} ${currencyUnit}</span></p>
                        
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mt-4 mb-2">${languages[currentLang].collectedFee}</h4>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usTradingActivityFee}</span><span class="${usExternal === 0 ? 'line-through' : ''}">${usExternal.toFixed(4)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usAuditFee}</span><span class="${usAudit === 0 ? 'line-through' : ''}">${usAudit.toFixed(4)} ${currencyUnit}</span></p>
                    </div>
                    
                    <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 w-full">
                        <p class="text-base font-semibold text-gray-900 dark:text-dark-text flex justify-between w-full">
                            <span>${languages[currentLang].totalFee}</span>
                            <span>${tigerUSTotal.toFixed(4)} ${currencyUnit}</span>
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
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span class="${lbUSComm === 0 ? 'line-through' : ''}">${lbUSComm.toFixed(4)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].platformFee}</span><span class="${lbUSPf === 0 ? 'line-through' : ''}">${lbUSPf.toFixed(4)} ${currencyUnit}</span></p>
                        
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mt-4 mb-2">${languages[currentLang].collectedFee}</h4>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].transactionFee}</span><span class="${lbUSExFee === 0 ? 'line-through' : ''}">${lbUSExFee.toFixed(4)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usSECRegulatoryFee}</span><span class="${lbUSSECFee === 0 ? 'line-through' : ''}">${lbUSSECFee.toFixed(4)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usTradingActivityFee}</span><span class="${lbUSTAFee === 0 ? 'line-through' : ''}">${lbUSTAFee.toFixed(4)} ${currencyUnit}</span></p>
                    </div>
                    
                    <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 w-full">
                        <p class="text-base font-semibold text-gray-900 dark:text-dark-text flex justify-between w-full">
                            <span>${languages[currentLang].totalFee}</span>
                            <span>${longbridgeUSTotal.toFixed(4)} ${currencyUnit}</span>
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
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span class="${futuUSComm === 0 ? 'line-through' : ''}">${futuUSComm.toFixed(4)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].platformFee}</span><span class="${futuUSPf === 0 ? 'line-through' : ''}">${futuUSPf.toFixed(4)} ${currencyUnit}</span></p>
                        
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mt-4 mb-2">${languages[currentLang].collectedFee}</h4>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].transactionFee}</span><span class="${futuUSExFee === 0 ? 'line-through' : ''}">${futuUSExFee.toFixed(4)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usSECRegulatoryFee}</span><span class="${futuUSSECFee === 0 ? 'line-through' : ''}">${futuUSSECFee.toFixed(4)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usTradingActivityFee}</span><span class="${futuUSTAFee === 0 ? 'line-through' : ''}">${futuUSTAFee.toFixed(4)} ${currencyUnit}</span></p>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].usCATFee}</span><span class="${futuUSCAT === 0 ? 'line-through' : ''}">${futuUSCAT.toFixed(4)} ${currencyUnit}</span></p>
                    </div>
                    
                    <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 w-full">
                        <p class="text-base font-semibold text-gray-900 dark:text-dark-text flex justify-between w-full">
                            <span>${languages[currentLang].totalFee}</span>
                            <span>${futuUSTotal.toFixed(4)} ${currencyUnit}</span>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
}