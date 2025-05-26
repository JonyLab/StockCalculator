function roundToCents(value) {
    return Math.round(value * 100) / 100;
}

function ceilToWhole(value) {
    return Math.ceil(value);
}

function tigerTransactionFee(transactionValue) {
    const fee = transactionValue * 0.00029; // 0.029%佣金
    const rounded = roundToCents(fee);
    return Math.max(rounded, 0.01);
}

function tigerPlatformFee() {
    return 15; // 固定平台费15港元/笔
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
    const commission = transactionValue * 0.0003; // 0.03%佣金
    return Math.max(commission, 3); // 最低3港元
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
    const commission = transactionValue * 0.0003; // 万3佣金
    return Math.max(commission, 3); // 最低3港元
}

function futuPlatformFee(mode, orderCount) {
    if (mode === 'fixed') {
        return 15; // 固定式平台费
    } else if (mode === 'stepped') {
        if (orderCount <= 5) return 30;
        if (orderCount <= 20) return 15;
        if (orderCount <= 50) return 10;
        return 10; // 超过50笔按最后一档计算（用户原规则未明确，暂设为10）
    }
    return 0;
}

function calculateFees() {
    const transactionValue = parseFloat(document.getElementById('transactionValue').value);
    // 获取合并后的订单笔数输入
    const orderCount = parseInt(document.getElementById('orderCount').value) || 1;
    const futuOrderCount = orderCount;
    const longbridgeOrderCount = orderCount;
    const futuPlatformMode = document.getElementById('futuPlatformMode').value;
    // 长桥输入值获取（保留原逻辑）
    const longbridgePlatformMode = document.getElementById('longbridgePlatformMode').value;
    const resultDiv = document.getElementById('result');

    // 输入验证
    if (isNaN(transactionValue) || transactionValue <= 0) {
        resultDiv.innerHTML = `<p class="text-red-500 dark:text-red-400">${languages[currentLang].invalidInput}</p>`;
        return;
    }

    // 计算老虎证券费用
    const tf = tigerTransactionFee(transactionValue);
    const pf = tigerPlatformFee();
    const sd = tigerStampDuty(transactionValue);
    const sl = tigerSfcLevy(transactionValue);
    const fl = tigerFrcLevy(transactionValue);
    const sf = tigerSettlementFee(transactionValue);
    const tigerTotal = tf + pf + sd + sl + fl + sf;

    // 计算长桥证券费用（保留原逻辑）
    const lbComm = longbridgeCommission(transactionValue);
    const lbPf = longbridgePlatformFee(longbridgePlatformMode, longbridgeOrderCount);
    const lbSd = longbridgeStampDuty(transactionValue);
    const lbTf = tigerTransactionFee(transactionValue);
    const lbSl = tigerSfcLevy(transactionValue);
    const lbFl = tigerFrcLevy(transactionValue);
    const lbSf = tigerSettlementFee(transactionValue);
    const longbridgeTotal = lbComm + lbPf + lbSd + lbTf + lbSl + lbFl + lbSf;

    // 计算富途证券费用
    const futuComm = futuCommission(transactionValue);
    const futuPf = futuPlatformFee(futuPlatformMode, futuOrderCount);
    // 富途其他费用与老虎相同（交易费、印花税等）
    const futuTf = tigerTransactionFee(transactionValue);
    const futuSd = tigerStampDuty(transactionValue);
    const futuSl = tigerSfcLevy(transactionValue);
    const futuFl = tigerFrcLevy(transactionValue);
    const futuSf = tigerSettlementFee(transactionValue);
    const futuTotal = futuComm + futuPf + futuTf + futuSd + futuSl + futuFl + futuSf;

    // 找出最低总费用
    const minTotal = Math.min(tigerTotal, longbridgeTotal, futuTotal);

    // 根据语言设置货币单位
    const currencyUnit = currentLang === 'zh-CN' ? '港元' : 'HKD';

    // 生成最优惠标签 HTML
    const tigerBestPriceTag = tigerTotal === minTotal ? `<span class="ml-1 px-1.5 py-0.5 text-[10px] font-medium text-broker-primary bg-broker-primary/10 dark:bg-broker-primary/20 rounded-full">${languages[currentLang].bestPrice}</span>` : '';
    const futuBestPriceTag = futuTotal === minTotal ? `<span class="ml-1 px-1.5 py-0.5 text-[10px] font-medium text-broker-pink bg-broker-pink/10 dark:bg-broker-pink/20 rounded-full">${languages[currentLang].bestPrice}</span>` : '';
    const longbridgeBestPriceTag = longbridgeTotal === minTotal ? `<span class="ml-1 px-1.5 py-0.5 text-[10px] font-medium text-broker-green bg-broker-green/10 dark:bg-broker-green/20 rounded-full">${languages[currentLang].bestPrice}</span>` : '';

    // 生成结果HTML
    resultDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 老虎证券卡片 -->
            <div class="bg-yellow-50 dark:bg-broker-primary/10 rounded-lg p-6 border-l-4 border-yellow-400 dark:border-broker-primary break-words">
                <div class="flex items-center mb-4">
                    <img src="public/tiger.png" alt="老虎证券" class="h-8 w-auto mr-3 rounded-full" />
                    <div>
                        <div class="text-base font-semibold text-gray-900 dark:text-dark-text leading-tight flex items-center">
                            老虎证券
                            ${tigerBestPriceTag}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-dark-text-secondary tracking-wide">TIGER BROKERS</div>
                    </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span>${tf.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].platformFee}</span><span>${pf} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].transactionFee}</span><span>${tf.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].stampDuty}</span><span>${sd} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].sfcLevy}</span><span>${sl.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].frcLevy}</span><span>${fl.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].settlementFee}</span><span>${sf.toFixed(2)} ${currencyUnit}</span></p>
                <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 w-full">
                    <p class="text-base font-semibold text-gray-900 dark:text-dark-text flex justify-between w-full">
                        <span>${languages[currentLang].totalFee}</span>
                        <span>${tigerTotal.toFixed(2)} ${currencyUnit}</span>
                    </p>
                </div>
            </div>

            <!-- 富途证券卡片 -->
            <div class="bg-orange-50 dark:bg-broker-pink/10 rounded-lg p-6 border-l-4 border-orange-400 dark:border-broker-pink break-words">
                <div class="flex items-center mb-4">
                    <img src="public/futu.png" alt="富途证券" class="h-8 w-auto mr-3 rounded-full" />
                    <div>
                        <div class="text-base font-semibold text-gray-900 dark:text-dark-text leading-tight flex items-center">
                            富途证券
                            ${futuBestPriceTag}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-dark-text-secondary tracking-wide">FUTU</div>
                    </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span>${futuComm.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].platformFee}</span><span>${futuPf} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].transactionFee}</span><span>${futuTf.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].stampDuty}</span><span>${futuSd} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].sfcLevy}</span><span>${futuSl.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].frcLevy}</span><span>${futuFl.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].settlementFee}</span><span>${futuSf.toFixed(2)} ${currencyUnit}</span></p>
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
                            ${longbridgeBestPriceTag}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-dark-text-secondary tracking-wide">LONGBRIDGE</div>
                    </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].commission}</span><span>${lbComm.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].platformFee}</span><span>${lbPf} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].stampDuty}</span><span>${lbSd.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].transactionFee}</span><span>${lbTf.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].sfcLevy}</span><span>${lbSl.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].frcLevy}</span><span>${lbFl.toFixed(2)} ${currencyUnit}</span></p>
                <p class="text-sm text-gray-600 dark:text-dark-text-secondary flex justify-between w-full"><span>${languages[currentLang].settlementFee}</span><span>${lbSf.toFixed(2)} ${currencyUnit}</span></p>
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
}