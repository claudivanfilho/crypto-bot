import mongoose from 'mongoose'

const Schema = mongoose.Schema

const robotSchema = new Schema({
  id: String,
  pair: String,
  minPrice: Number,
  minProfit: Number,
  limitBuyPrice: Number,
  buyAnalyser: {
    BTC_QUANTITY: Number,
    BASE_FLOOR: Number,
    BASE_FLOOR_2: Number,
    BASE_MIN_TO_BUY: Number,
    BASE_CEIL: Number,
    BASE_CEIL_2: Number,
    BASE_MIN_TO_SELL: Number,
    BLOCK_CEIL: Number,
  },
  watchFloor: {
    active: Boolean,
    btc: Number,
    bidMargin: Number,
    numberOfOrders: Number,
    marginOrders: Number,
    amounts: [Number],
  },
  watchCeil: {
    active: Boolean,
    bidMargin: Number,
    numberOfOrders: Number,
    marginOrders: Number,
    amounts: [Number],
  },
  marginLimit: Number,
  canBuy: Boolean,
  paused: Boolean,
  keepBuying: Boolean,
  keepSelling: Boolean,
  fixedSellPrice: Number,
  marginFixedSell: { type: Number, default: 3 },
  immediate: { type: Boolean, default: false },
  sellHead: Number,
})

export default mongoose.model('Robot', robotSchema)
