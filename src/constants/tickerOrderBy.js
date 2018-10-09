export const NAME = {
  name: 'Name',
  value: 'NAME',
  ASC: (a, b) => (a.pair < b.pair ? -1 : 1),
  DESC: (a, b) => (a.pair > b.pair ? -1 : 1),
}

export const LAST = {
  name: 'Last',
  value: 'LAST',
  ASC: (a, b) => (a.last < b.last ? -1 : 1),
  DESC: (a, b) => (a.last > b.last ? -1 : 1),
}

export const PERCENT_CHANGE = {
  name: '24h %',
  value: 'PERCENT_CHANGE',
  ASC: (a, b) => (parseFloat(a.percentChange) < parseFloat(b.percentChange) ? -1 : 1),
  DESC: (a, b) => (parseFloat(a.percentChange) > parseFloat(b.percentChange) ? -1 : 1),
}

export default {
  NAME,
  LAST,
  PERCENT_CHANGE,
  options: [NAME, LAST, PERCENT_CHANGE],
}
