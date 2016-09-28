'use strict';

const fs = require('fs');
const tgbot = require('node-telegram-bot-api');
const config = require('./config');

const token = String(fs.readFileSync('token'));
const bot = new tgbot(token, config.bot);

const gathers = {};
const games = {};
const userGames = {};

const readyTime = (ready, date, now) => {
    if (ready) {
        return 'Game will start in: '
            + Math.round((date - now) / 1000) + ' seconds\n';
    } else {
        return 'Press /ready to start the game\n'
            + 'Or game will expire in: '
            + Math.round((date - now) / 1000) + ' seconds\n';
    }
};

const nameList = (users) => {
    let result = 'Players:\n';

    for (const i in users) {
        if (users[i].username) {
            result += '@' + users[i].username + '\n'
        } else {
            result += users[i].first_name + ' ' + users[i].last_name + '\n'
        }
    }

    return result;
};

setInterval(() => {
    const now = Date.now();

    for (const i in gathers) {
        const gather = gathers[i];

        if (gather.date < now) {
            delete gathers[i];

            if (gather.ready) {
                const game = games[i] = gather;

                game.closeDate = now + config.closeTimeout;

                bot.sendMessage(
                    i,
                    'Game started\n'
                    + '\n'
                    + nameList(game.users)
                );
            } else {
                for (const i in gather.users) {
                    delete userGames[i];
                }

                bot.sendMessage(
                    i,
                    'Game expired\n'
                    + '\n'
                    + 'Please /join the game again'
                );
            }
        }
    }

    for (const i in games) {
        const game = games[i];

        if (game.closeDate < now) {
            for (const j in game.users) {
                bot.sendMessage(
                    j,
                    'test\n'
                );
            }
        }
    }
}, config.interval);

bot.onText(/\/join/, (msg, match) => {
    const now = Date.now();

    if (games[msg.chat.id]) {
        bot.sendMessage(
            msg.chat.id,
            'Fail: Game is running now\n',
            {
                reply_to_message_id: msg.message_id,
            }
        );
    } else if (userGames[msg.from.id]) {
        bot.sendMessage(
            msg.chat.id,
            'Fail: You are in a game now\n',
            {
                reply_to_message_id: msg.message_id,
            }
        );
    } else {
        bot.sendMessage(
            msg.from.id,
            'Hello from MESE bot\n'
        ).then(() => {
            if (gathers[msg.chat.id]) {
                const gather = gathers[msg.chat.id];

                gather.users[msg.from.id] = msg.from;
                gather.total += 1;
                userGames[msg.from.id] = msg.from;

                bot.sendMessage(
                    msg.chat.id,
                    'OK: Join game\n'
                    + '\n'
                    + readyTime(gather.ready, gather.date, now)
                    + '\n'
                    + nameList(gather.users)
                    + '\n'
                    + '/join /flee\n',
                    {
                        reply_to_message_id: msg.message_id,
                    }
                );
            } else {
                const gather = gathers[msg.chat.id] = {
                    chat: msg.chat,
                    users: {},
                    total: 0,
                    date: now + config.gatherTimeout,
                };

                gather.users[msg.from.id] = msg.from;
                gather.total += 1;
                userGames[msg.from.id] = msg.from;

                bot.sendMessage(
                    msg.chat.id,
                    'OK: New game\n'
                    + '\n'
                    + readyTime(gather.ready, gather.date, now)
                    + '\n'
                    + nameList(gather.users)
                    + '\n'
                    + '/join /flee\n',
                    {
                        reply_to_message_id: msg.message_id,
                    }
                );
            }
        }, () => {
            bot.sendMessage(
                msg.chat.id,
                'Fail: Please start @' + config.botName + '\n',
                {
                    reply_to_message_id: msg.message_id,
                    reply_markup: {
                        inline_keyboard: [[{
                            text: 'Start',
                            url: 'https://telegram.me/' + config.botName,
                        }]],
                    },
                }
            );
        });
    }
});

bot.onText(/\/flee/, (msg, match) => {
    const now = Date.now();

    if (games[msg.chat.id]) {
        bot.sendMessage(
            msg.chat.id,
            'Fail: Game is running now\n',
            {
                reply_to_message_id: msg.message_id,
            }
        );
    } else if (gathers[msg.chat.id]) {
        const gather = gathers[msg.chat.id];

        if (gather.users[msg.from.id]) {
            delete gather.users[msg.from.id];
            gather.total -= 1;
            delete userGames[msg.from.id];
        }

        if (gather.total > 0) {
            bot.sendMessage(
                msg.chat.id,
                'OK: Leave game\n'
                + '\n'
                + readyTime(gather.ready, gather.date, now)
                + '\n'
                + nameList(gather.users)
                + '\n'
                + '/join /flee\n',
                {
                    reply_to_message_id: msg.message_id,
                }
            );
        } else {
            delete gathers[msg.chat.id];

            bot.sendMessage(
                msg.chat.id,
                'OK: Leave game\n'
                + '\n'
                + 'Game is canceled\n',
                {
                    reply_to_message_id: msg.message_id,
                }
            );
        }
    } else {
        bot.sendMessage(
            msg.chat.id,
            'Fail: Game does not exist\n',
            {
                reply_to_message_id: msg.message_id,
            }
        );
    }
});

bot.onText(/\/ready/, (msg, match) => {
    const now = Date.now();

    if (games[msg.chat.id]) {
        bot.sendMessage(
            msg.chat.id,
            'Fail: Game is running now\n',
            {
                reply_to_message_id: msg.message_id,
            }
        );
    } else if (gathers[msg.chat.id]) {
        const gather = gathers[msg.chat.id];

        if (!gather.ready) {
            gather.ready = true;
            gather.date = now + config.readyTimeout;
        }

        bot.sendMessage(
            msg.chat.id,
            'OK: Ready to start\n'
            + '\n'
            + readyTime(gather.ready, gather.date, now)
            + '\n'
            + nameList(gather.users)
            + '\n'
            + '/join /flee\n',
            {
                reply_to_message_id: msg.message_id,
            }
        );
    } else {
        bot.sendMessage(
            msg.chat.id,
            'Fail: Game does not exist\n',
            {
                reply_to_message_id: msg.message_id,
            }
        );
    }
});
