const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the Stylist model to whatever makes sense in this case
const stylistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Stylist = model('Stylist', stylistSchema);

module.exports = Stylist;
