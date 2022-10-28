const router = require('./routes/auth.routes');

router.post('/', (req, res) => {
  const { service } = req.body;

  let price = 0;
  let durationInMinutes = 0;

  // service = [ "haircut", "color" ]

  if (service.includes('haircut')) {
    price += 20;
    durationInMinutes += 30;
  }

  if (service.includes('color')) {
    price += 30;
    durationInMinutes += 60;
  }

  Appointment.create();

  // price = 50
  // durationInMinutes = 90
});
