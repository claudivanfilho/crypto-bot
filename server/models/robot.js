import mongoose from 'mongoose'

const Schema = mongoose.Schema

const robotSchema = new Schema({
  id: String,
  pair: String,
  paused: Boolean,
  buy: {
    active: { type: Boolean, default: false },
    coveringBid: Boolean,
    upperBreakpointPrice: Number,
    lowerBreakpointPrice: Number,
    btcValue: Number,
    bidAmountToActive: Number,
    bidAmountToCover: Number,
    askAmountToStop: Number,
  },
  sell: {
    active: { type: Boolean, default: false },
    minProfit: Number,
    coveringAsk: Boolean,
    lowerBreakpointPrice: Number,
    marginLimit: Number,
    fixedPrice: Number,
    marginFixedPrice: { type: Number, default: 3 },
    askAmountToCover: Number,
    immediate: { type: Boolean, default: false },
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
})

export default mongoose.model('Robot', robotSchema)
