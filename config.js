'use strict';

module.exports = {
    tgInterval: 1000,
    tgGatherTimeout: 300 * 1000,
    tgGatherRemind: 30 * 1000,
    tgReadyTimeout: 30 * 1000,

    meseEngine: './mese',
    meseMaxPlayer: 32, // TODO

    tgmesePreset: 'modern',
    tgmeseSettings: [{}, {}, {}, {}, {}, {}, {}, {}],
    tgmeseCloseTimeout: 90 * 1000,
    tgmeseCloseRemind: 20 * 1000,
    tgmeseReportTimeout: 7200 * 1000,
};
