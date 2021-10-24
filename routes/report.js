const express = require('express')
const Mock = require('mockjs')
const { parseDate } = require("../utils")
const { formatDate, groupCount } = require("../utils")
const router = express.Router()

function getList(start, end) {
  const list = []
  const count = (start - end) / (1000 * 24 * 3600)
  for (let i = count; i < 1; i++) {
    const total = '@integer(120, 150)'
    const carrierTotal = '@integer(40, 50)'
    list.push(Mock.mock({
      reportDate: formatDate(end + 1000 * 24 * 3600 * i, '{m}.{d}', false),
      total,
      success: '@integer(120, @total)',
      carrierRateList: [{
        carrier: '移动',
        total: carrierTotal,
        success: '@integer(40, @total)'
      }, {
        carrier: '联通',
        total: carrierTotal,
        success: '@integer(40, @total)'
      }, {
        carrier: '电信',
        total: carrierTotal,
        success: '@integer(40, @total)'
      }]
    }))
  }

  const arr = list.map(item => item.carrierRateList).flat()
  return {
    list,
    carrierRateList: groupCount(arr, 'carrier', ['total', 'success'])
  }
}

router.get('/count', function (req, res) {
  const { startTime, endTime } = req.query
  if (!startTime || !endTime) {
    res.status(400).json({ message: '缺少必要的参数' })
    return;
  }
  const start = parseDate(startTime)
  const end = parseDate(endTime)
  if (start <= end) {
    const { carrierRateList, list } = getList(start, end)
    res.json({
      code: 200,
      data: {
        carrierRateList,
        list
      },
      msg: 'success'
    })
  } else {
    res.status(400).json({ message: '起始时间不能大于结束时间' })
  }
})


router.get("/compare", function (req, res) {
  const { scale, type } = req.query
  const items = new Map([
    ['d', {
      count: 24,
      h: 1
    }],
    ['w', {
      count: 28,
      h: 6
    }],
    ['m', {
      count: 30,
      h: 24
    }]
  ])
  const list = []
  const startDate = new Date(2021, 8, 1, 0, 0, 0);
  const { count, h } = items.get(scale)
  const half = Math.round(count / 2)
  const isMultiple = type !== 'single'
  for (let i = 0; i < count; i++) {
    list.push(
      Mock.mock({
        date: startDate.getTime() + 1000 * 3600 * h * i,
        on: isMultiple ? "@float(20, 24, 2, 2)"
          : i < half ? "@float(20, 24, 2, 2)"
            : '',
        off: isMultiple ? "@float(22, 25, 2, 2)"
          : i < half ? ''
            : "@float(22, 25, 2, 2)"
      })
    );
  }

  res.json({
    code: 200,
    data: {
      data: list
    },
    msg: "success"
  })
})

module.exports = router
