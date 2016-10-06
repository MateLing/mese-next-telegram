'use strict';

module.exports = {
    tgInterval: 1000,
    tgGatherTimeout: 1024 * 1000,
    tgGatherRemind: 30 * 1000,
    tgReadyTimeout: 5 * 1000,

    meseEngine: './mese',
    meseMaxPlayer: 32, // TODO
    
    tgmesePreset: 'modern',
    tgmeseSettings: [{},
                     {
    price_max: 150,
    price_min: 6,
    mk_limit: 99999,
    ci_limit: 99999,
    loan_limit: 99999,
    unit_fee: 0,
    mpi_factor_a: 42,
    mpi_factor_b: 17,
    mpi_factor_c: 14,
    mpi_factor_d: 10,
    mpi_factor_e: 10,
    mpi_factor_f: 7,
    demand: 150,
},{
    demand: 175,
},{
    demand: 205,
},{
    demand: 245,
},{
    demand: 185,
},{
    demand: 150,
},{
    demand: 100
}],
    tgmeseCloseTimeout: 75 * 1000,
    tgmeseCloseRemind: 30 * 1000,
    tgmeseReportTimeout: 7200 * 1000,
};
