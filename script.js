function roundToCents(value) {
    return Math.round(value * 100) / 100;
}

function ceilToWhole(value) {
    return Math.ceil(value);
}

function tigerTransactionFee(transactionValue) {
    const fee = transactionValue * 0.0000565;
    const rounded = roundToCents(fee);
    return Math.max(rounded, 0.01);
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
        resultDiv.innerHTML = '<p style="color: red;">请输入有效的正交易值！</p>';
        return;
    }

    // 计算老虎证券费用（保留原逻辑）
    const tf = tigerTransactionFee(transactionValue);
    const sd = tigerStampDuty(transactionValue);
    const sl = tigerSfcLevy(transactionValue);
    const fl = tigerFrcLevy(transactionValue);
    const sf = tigerSettlementFee(transactionValue);
    const tigerTotal = tf + sd + sl + fl + sf;

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

    // 替换表格为卡片布局（修改后）
    resultDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 老虎证券卡片 -->
            <div class="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400 break-words">
                <div class="flex items-center mb-4">
                    <img src="public/tiger.png" alt="老虎证券" class="h-8 w-auto mr-3 rounded-full" />
                    <div>
                        <div class="text-base font-semibold text-gray-900 leading-tight">老虎证券</div>
                        <div class="text-xs text-gray-500 tracking-wide">TIGER BROKERS</div>
                    </div>
                </div>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>交易佣金</span><span class='text-gray-400 line-through'>0.00 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>平台使用费</span><span class='text-gray-400 line-through'>0.00 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>交易费</span><span>${tf.toFixed(2)} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>股票印花税</span><span>${sd} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>交易征费</span><span>${sl.toFixed(2)} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>会财局交易征费</span><span>${fl.toFixed(2)} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>结算交收费</span><span>${sf.toFixed(2)} 港元</span></p>
                <div class="mt-4 border-t pt-3 w-full">
                    <p class="text-base font-semibold text-gray-900 flex justify-between w-full">
                        <span>总费用</span>
                        <span>${tigerTotal.toFixed(2)} 港元</span>
                    </p>
                </div>
            </div>
        
            <!-- 富途证券卡片 -->
            <div class="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-400 break-words">
                <div class="flex items-center mb-4">
                    <img src="public/futu.png" alt="富途证券" class="h-8 w-auto mr-3 rounded-full" />
                    <div>
                        <div class="text-base font-semibold text-gray-900 leading-tight">富途证券</div>
                        <div class="text-xs text-gray-500 tracking-wide">FUTU</div>
                    </div>
                </div>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>交易佣金</span><span>${futuComm.toFixed(2)} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>平台使用费</span><span>${futuPf} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>交易费</span><span>${futuTf.toFixed(2)} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>股票印花税</span><span>${futuSd} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>交易征费</span><span>${futuSl.toFixed(2)} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>会财局交易征费</span><span>${futuFl.toFixed(2)} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>结算交收费</span><span>${futuSf.toFixed(2)} 港元</span></p>
                <div class="mt-4 border-t pt-3 w-full">
                    <p class="text-base font-semibold text-gray-900 flex justify-between w-full">
                        <span>总费用</span>
                        <span>${futuTotal.toFixed(2)} 港元</span>
                    </p>
                </div>
            </div>
        
            <!-- 长桥证券卡片 -->
            <div class="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500 break-words">
                <div class="flex items-center mb-4">
                    <img src="public/longbridge.png" alt="长桥证券" class="h-8 w-auto mr-3 rounded-full" />
                    <div>
                        <div class="text-base font-semibold text-gray-900 leading-tight">长桥证券</div>
                        <div class="text-xs text-gray-500 tracking-wide">LONGBRIDGE</div>
                    </div>
                </div>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>交易佣金</span><span>${lbComm.toFixed(2)} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>平台使用费</span><span>${lbPf} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>股票印花税</span><span>${lbSd.toFixed(2)} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>交易费</span><span>${lbTf.toFixed(2)} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>交易征费</span><span>${lbSl.toFixed(2)} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>会财局交易征费</span><span>${lbFl.toFixed(2)} 港元</span></p>
                <p class="text-sm text-gray-600 flex justify-between w-full"><span>结算交收费</span><span>${lbSf.toFixed(2)} 港元</span></p>
                <div class="mt-4 border-t pt-3 w-full">
                    <p class="text-base font-semibold text-gray-900 flex justify-between w-full">
                        <span>总费用</span>
                        <span>${longbridgeTotal.toFixed(2)} 港元</span>
                    </p>
                </div>
            </div>
        </div>
    `;
}