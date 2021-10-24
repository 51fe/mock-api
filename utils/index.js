/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
function formatDate(time, cFormat, padZero = false) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (padZero && result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 解析年月日
 * @param dateStr
 * @param splitter
 * @returns {number}
 */
function parseDate(dateStr, splitter = '') {
  const re = new RegExp(`^(\\d{4})${splitter}(\\d{2})${splitter}(\\d{2})$`)
  const result = dateStr.match(re)
  if (Array.isArray(result)) {
    return new Date(result[1], result[2] - 1, result[3]).getTime()
  }
  return 0
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 按字段分组统计
 * @param arr
 * @param key
 * @param dimensions
 * @returns {{}[]}
 */
function groupCount(arr, key, dimensions) {
  const values = [...new Set(arr.map(item => item[key]))]
  return values.map(value => {
    const obj = {
      [key]: value,
    }
    const group = arr.filter(item =>item[key] === value)
    dimensions.forEach(key => {
      obj[key] = group.reduce((sum, item) => sum + item[key], 0)
    })
    return obj
  })
}

module.exports = {
  deepClone,
  formatDate,
  parseDate,
  groupCount
}
