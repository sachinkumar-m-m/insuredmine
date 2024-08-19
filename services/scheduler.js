const schedule = require('node-schedule');
const Message = require('../models/Message'); 

const scheduleMessage = (message, day, time) => {
  const [year, month, dayOfMonth] = day.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  const scheduledDate = new Date(year, month - 1, dayOfMonth, hour, minute);

 
  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} *`;

  console.log(`Scheduling message "${message}" for ${scheduledDate} with cron expression "${cronExpression}"`);


  const job = schedule.scheduleJob(cronExpression, async () => {
    const newMessage = new Message({ text: message, date: new Date() });
    await newMessage.save();
    console.log('Message saved:', newMessage);
  });

  return { status: 'success', message: 'Job scheduled', scheduledDate };
};


const scheduleMessageHandler = async (req, res) => {
  const { message, day, time } = req.body;

  try {
 
    if (!message || !day || !time) {
      return res.status(400).json({ status: 'error', message: 'Message, day, and time are required' });
    }
    

    const result = scheduleMessage(message, day, time);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};


exports.scheduleMessageHandler = scheduleMessageHandler;
