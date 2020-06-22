export const STATUS = {
    PENDING:'未就绪',
    OK:'正常',
    WARNING:'警报',
    UNKNOWN:'未知',
    CRITICAL:'严重'
};

export const STATUS_ID = {
    1: '未就绪',
    2: '正常',
    4: '警报',
    8: '未知',
    16: '严重'
};

/**
 * 告警阈值类型map
 * @type {{"0": string, "1": string}}
 */
export const THRESHOLD_TYPE = {
  0: '状态',
  1: '数值'
};