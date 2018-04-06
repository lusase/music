const express  = require('express')
const axios = require('axios')

function getPort() {
  const argv = process.argv.slice(2)
  const _index = argv.indexOf('-p')
  let port = 3000
  if (_index > -1 && argv[_index + 1]) {
    port = +argv[_index + 1]
  }
  return port
}

const app = express()

const apiRoutes = express.Router()

apiRoutes.get('/getCdInfo', function(req,res) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(err => {
    console.log(err);
  })
})

apiRoutes.get('/getDiscList',function(req,res){
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url,{
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(err => {
    console.log(err);
  })
})

apiRoutes.get('/lyric',function(req,res){
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url,{
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    const reg = /^\w+\(({[\s\S]*})\)$/
    if(reg.test(response.data)){
      res.json(JSON.parse(response.data.match(reg)[1]))
      return
    }
    res.json(response.data)
  }).catch(e => {
    console.log(e)
  })
})

app.use('/api',apiRoutes)

const port = getPort()

app.listen(port, () => {
  console.log(`music-api-proxy start at port ${port}`)
})


process.on('uncaughtException', function(err){
    console.log('caught exception :' + err)
    throw err
})
