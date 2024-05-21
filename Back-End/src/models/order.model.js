import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Delivered"],
    default: "Pending",
  },
});

export const Order = mongoose.model("Order", orderSchema);
const May_need_this_in_future = [
  {
    name: "South indian Thali",
    description: "Dosa + Idli + chutney",
    category: "south indian food",
    price: "100",
  },
  {
    name: "Rice plate",
    description: "Rice + Chole",
    category: "Rice",
    price: "40",
  },
  {
    name: "Chicken plate",
    description: "Chicken + 2 Chapati",
    category: "Chicken platter",
    price: "100",
  },
  {
    name: "Idli",
    description: "4 Idli + chutney",
    category: "South Breakfast",
    price: "40",
  },
  {
    name: "Veg north thali",
    description: "2 chapati + rice + dal + 2 bhaji",
    category: "Veg thali",
    price: "150",
  },
  {
    name: "Onion uttapa",
    description: "4 uttapa + chutney",
    category: "South indian breakfast",
    price: "70",
  },
];
