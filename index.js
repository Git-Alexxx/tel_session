const { Telegraf, session } = require('telegraf')
// const LocalSession = require('telegraf-session-local')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

// bot.use((new LocalSession({ database: 'example_db.json' })).middleware())

bot.use(session())

bot.context.db = { counter: 0 } //общее хранение

bot.hears('/count', async ctx => { // выводим информации сколько раз была нажата команда /ten

    try{
        ctx.reply(`Использовали команду /ten ${ctx.db.counter} вообщем, использовали именно Вы ${ctx.session.counter || 0}`)
    } catch(e){
        ctx.reply('Сначала введите команду /ten')
    }

})

bot.hears('/ten', (ctx, next) => { // слушаем команду /ten и считаем ее для db и для пользователя

    
    ctx.session = {counter: 0}
    ctx.state.number = 10
    ctx.db.counter++
    ctx.session.counter++
    
    return next()
})

bot.hears(/^[0-9]+$/, (ctx, next) => { // все остальные цифры из строки переводим в число

    ctx.state.number = parseInt(ctx.message.text)

    return next()
})

bot.use(ctx => { // идет проверка на число, и если число то добавляем к нему 10

    const { number } = ctx.state

    if(isNaN(number)) return ctx.reply('NaN')

    return ctx.reply(`${number} + 10 = ${number + 10}`)
    
})


bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))