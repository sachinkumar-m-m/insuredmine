const { Worker } = require('worker_threads');
const path = require('path');

const uploadFile = (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;

  if (!file.name || !file.mimetype) {
    return res.status(400).send('File or file details are missing.');
  }

  const filePath = path.join(__dirname, '../uploads', file.name);

  file.mv(filePath, (err) => {
    if (err) return res.status(500).send(err.message);

    const worker = new Worker(path.join(__dirname, '../workers/dataUploadWorker.js'), {
      workerData: { filePath, fileType: file.mimetype }
    });

    let responded = false;

    worker.on('message', (message) => {
      if (!responded) {
        responded = true;
        res.json(message);
      }
    });

    worker.on('error', (error) => {
      if (!responded) {
        responded = true;
        res.status(500).send(error.message);
      }
    });

    worker.on('exit', (code) => {
      if (!responded) {
        responded = true;
        if (code !== 0) {
          res.status(500).send(`Worker stopped with exit code ${code}`);
        }
      }
    });
  });
};

module.exports = { uploadFile };
