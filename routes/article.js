const express = require('express');
const router = express.Router()
const Mock = require('mockjs')

const List = []
const count = 100

const names = ['3d.png','angular.png','aws.png','babel.png','chart.png','chrome.png',
'cloud.png','cnadle.png','configuration.png','css.png','deploy.png','dev.png','edge.png',
'github.png','graphql.png','html5.png','javascript.png','light.png','next.png','nodejs.png',
'npm.png','nuxt.png','php.png','python.png','react.png','redux-action.png',
'redux-reducer.png','tools.png','typescript.png','vue.png','vuex.png','webpack.png']

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@ctitle(5, 10)',
    discription: '@cparagraph(1)',
    content: '@cparagraph(3)',
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    'image_uri|1': names,
    platforms: ['a-platform']
  }))
}

router.get('/list', function (req, res) {
  const { importance, type, title, page = 1, limit = 20, sort } = req.query

  let mockList = List.filter(item => {
    if (importance && item.importance !== +importance) return false
    if (type && item.type !== type) return false
    if (title && item.title.indexOf(title) < 0) return false
    return true
  })

  if (sort === '-id') {
    mockList = mockList.reverse()
  }

  const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

  res.json({
    code: 200,
    data: {
      total: mockList.length,
      items: pageList
    },
    msg: 'success'
  })
})


router.get('/detail', function (req, res) {
  const { id } = config.query
  for (const article of List) {
    if (article.id === +id) {
      res.json({
        code: 200,
        data: article,
        msg: 'success'
      })
    }
  }
})

router.post('/create', function (req, res) {
  res.json({
    code: 200,
    data: 'success'
  })
})

router.post('/update', function (req, res) {
  res.json({
    code: 200,
    data: 'success'
  })
})

module.exports = router

