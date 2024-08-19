const express = require('express');
const schedule = require('node-schedule');
const Message = require('../models/Message'); 

const router = express.Router(); 


const scheduleMessage = (message, day, time) => {
  // Parse day and time
  const [year, month, dayOfMonth] = day.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);


  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} *`;

  console.log(`Scheduling message "${message}" with cron expression "${cronExpression}"`);

  const job = schedule.scheduleJob(cronExpression, async () => {
    const newMessage = new Message({ text: message, date: new Date() });
    await newMessage.save();
    console.log('Message saved:', newMessage);
  });

  return { status: 'success', message: 'Job scheduled', cronExpression };
};


router.post('/scheduleMessage', async (req, res) => {
  const { message, day, time } = req.body;

  try {
    const result = scheduleMessage(message, day, time);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router; 
