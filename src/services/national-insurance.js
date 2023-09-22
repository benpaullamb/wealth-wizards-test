const R = require('ramda');
const moment = require('moment');
const RD = require('../utils/ramda-decimal');

const allBands = require('../config/ni');

const isDateOnOrAfter = R.curry(
  (date, dateString) => moment.utc(dateString, 'YYYY-MM-DD')
    .isSameOrBefore(date),
);

const noBandsError = (date) => new Error(`National Insurance bands unavailable for date ${date}`);

const bandsOnDate = (date) => {
  const month = moment.utc(date, 'YYYY-MM-DD');

  return R.compose(
    R.when(R.isNil, () => {
      throw noBandsError(date);
    }),
    R.prop('bands'),
    R.last,
    R.filter(R.propSatisfies(isDateOnOrAfter(month), 'startDate')),
  )(allBands);
};

// TODO this should do more than return the number it's given
const slice = R.curry((floor, ceiling, num) => {
  const floorDecimal = RD.decimal(floor);
  const ceilingDecimal = RD.decimal(ceiling);
  const numDecimal = RD.decimal(num);

  if (numDecimal.equals(0)) return numDecimal;
  if (floorDecimal.equals(0)) {
    if (numDecimal.greaterThanOrEqualTo(floorDecimal) && numDecimal.lessThanOrEqualTo(ceilingDecimal)) return numDecimal;
    if (numDecimal.greaterThanOrEqualTo(ceilingDecimal)) return ceilingDecimal;
  } else {
    if (numDecimal.lessThanOrEqualTo(floorDecimal)) return RD.ZERO;
    if (numDecimal.greaterThanOrEqualTo(floorDecimal) && numDecimal.lessThanOrEqualTo(ceilingDecimal)) return numDecimal.minus(floorDecimal);
    if (numDecimal.greaterThan(ceilingDecimal)) return ceilingDecimal.minus(floorDecimal);
  }
  return numDecimal;
});

const calcForBand = R.curry(
  (income, { floor, ceiling, rate }) => RD.multiply(
    slice(floor, ceiling, income),
    rate,
  ),
);

module.exports = (runDate) => {
  const bands = bandsOnDate(runDate || moment.utc());
  return R.compose(
    RD.sum,
    R.flip(R.map)(bands),
    calcForBand,
  );
};

// for unit tests
module.exports.bandsOnDate = bandsOnDate;
module.exports.slice = slice;
