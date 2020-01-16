require('dotenv').config()
const linebot = require('linebot')
const rp = require('request-promise')

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已開啟')
})

bot.on('message', event => {
  if (event.message.type === 'text') {
    const usermsg = event.message.text
    rp('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json').then(htmlString => {
      let json = JSON.parse(htmlString)
      json = json.filter(j => {
        if (j.sna === usermsg) return true
        else return false
      })
      if (json.length > 0) event.reply(json[0].sbi)
      else event.reply('沒有資料')
    })
      .catch(() => {
        event.reply('發生錯誤')
      })
  }
})
