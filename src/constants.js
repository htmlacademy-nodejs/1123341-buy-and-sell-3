'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const ExitCode = {
  error: 1,
  success: 0,
};

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};


const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_COUNT,
  FILE_NAME,
  OfferType,
  SumRestrict,
  PictureRestrict,
  USER_ARGV_INDEX,
  ExitCode
};
