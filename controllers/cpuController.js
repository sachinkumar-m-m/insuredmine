const os = require('os');
const { exec } = require('child_process');
const apiResponse = require('../helper/apiResponse')



exports.trackCpuUsage = async (req, res) => {
  const cpuUsage = os.loadavg()[0]; 
  if (cpuUsage > 0.7) { 
    exec('pm2 restart all', (err, stdout, stderr) => {
      if (err) {
        return apiResponse.successResponseWithData(res, "Failed to restart server", err)
      }
      return apiResponse.successResponseWithData(res, "Server restarted due to high CPU usage", cpuUsage)
    });
  } else {
    return apiResponse.successResponseWithData(res, "CPU usage is normal", cpuUsage)
  }
};
