const { workerData, parentPort } = require('worker_threads');
const fs = require('fs');
const csv = require('csv-parser');
const MongoClient = require('mongodb').MongoClient;
const ExcelJS = require('exceljs');

async function processFile() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(process.env.DB_NAME);


    if (workerData.fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(workerData.filePath);
      const worksheet = workbook.getWorksheet(1);

      for (const row of worksheet.getRows(2, worksheet.rowCount - 1)) {
        try {
          const [agentName, userType, policyMode, producer, policyNumber, premiumAmountWritten, premiumAmount, policyType, companyName, categoryName, policyStartDate, policyEndDate, csr, accountName, email, gender, firstname, city, accountType, phone, address, state, zip, dob, primary, applicantId, agencyId, hasActiveClientPolicy] = row.values;

          const agentResult =await db.collection('agents').updateOne(
            { name: agentName },
            { $set: { name: agentName } },
            { upsert: true }
          );
          const agentId = agentResult.upsertedId || (await db.collection('agents').findOne({ name }))._id;
          const userResult = await db.collection('users').updateOne(
            { email },
            { $set: { firstName: firstname, dob, address, phone, state, zip, email, gender, userType } },
            { upsert: true }
          );
          const userId = userResult.upsertedId || (await db.collection('users').findOne({ email }))._id;


          const accountResult = await db.collection('accounts').updateOne(
            { accountName },
            { $set: { accountName } },
            { upsert: true }
          );
          const accountId = accountResult.upsertedId || (await db.collection('accounts').findOne({ accountName }))._id;

    
          const policyCategoryResult = await db.collection('policycategories').updateOne(
            { categoryName },
            { $set: { categoryName } },
            { upsert: true }
          );
          const policyCategoryId = policyCategoryResult.upsertedId || (await db.collection('policycategories').findOne({ categoryName }))._id;

          const policyCarrierResult = await db.collection('policycarriers').updateOne(
            { companyName },
            { $set: { companyName } },
            { upsert: true }
          );
          const policyCarrierId = policyCarrierResult.upsertedId || (await db.collection('policycarriers').findOne({ companyName }))._id;

          await db.collection('policies').updateOne(
            { policyNumber },
            {
              $set: {
                policyStartDate,
                policyEndDate,
                policyCategoryId,
                policyCarrierId,
                userId,
                policyType: policyType,
                premiumAmount: premiumAmount,
                applicantId: applicantId,
                agencyId: agentId,
                hasActiveClientPolicy: hasActiveClientPolicy,
                accountType:accountType,
                policyMode:policyMode,
                accountId:accountId,
                csr:csr
              }
            },
            { upsert: true }
          );

        } catch (err) {
          console.error('Error processing row:', err);
        }
      }

    } else if (workerData.fileType === 'text/csv') {
      await processCsvFile(db);

    } else {
      throw new Error('Unsupported file type');
    }

    parentPort.postMessage({ status: 'success' });

  } catch (error) {
    console.error('Error processing file:', error);
    parentPort.postMessage({ status: 'error', message: error.message });
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
}

async function processCsvFile(db) {
  return new Promise((resolve, reject) => {
    const operations = [];

    fs.createReadStream(workerData.filePath)
      .pipe(csv())
      .on('data', (row) => {
        const promise = (async () => {
          try {
            const {
              agent, userType, policy_mode, policy_number, premium_amount,
              policy_type, company_name, category_name, policy_start_date,
              policy_end_date, csr, account_name, email, gender, firstname,
              city, account_type, phone, address, state, zip, dob,
              Applicant_ID, agency_id, hasActive_ClientPolicy
            } = row;

           const agentResult = await db.collection('agents').updateOne(
              { name: agent },
              { $set: { name: agent } },
              { upsert: true }
            );
            const agentId = agentResult.upsertedId || (await db.collection('agents').findOne({ name: agent }))._id;

            const userResult = await db.collection('users').updateOne(
              { email },
              { $set: { firstName: firstname, dob, address, phone, state, city, zip, email, gender, userType } },
              { upsert: true }
            );
            const userId = userResult.upsertedId || (await db.collection('users').findOne({ email }))._id;

            const accountResult = await db.collection('accounts').updateOne(
              { accountName: account_name },
              { $set: { accountName: account_name } },
              { upsert: true }
            );
            const accountId = accountResult.upsertedId || (await db.collection('accounts').findOne({ accountName: account_name }))._id;

            const policyCategoryResult = await db.collection('policycategories').updateOne(
              { categoryName: category_name },
              { $set: { categoryName: category_name } },
              { upsert: true }
            );
            const policyCategoryId = policyCategoryResult.upsertedId || (await db.collection('policycategories').findOne({ categoryName: category_name }))._id;

            const policyCarrierResult = await db.collection('policycarriers').updateOne(
              { companyName: company_name },
              { $set: { companyName: company_name } },
              { upsert: true }
            );
            const policyCarrierId = policyCarrierResult.upsertedId || (await db.collection('policycarriers').findOne({ companyName: company_name }))._id;

            // Insert or update policy
            await db.collection('policies').updateOne(
              { policyNumber: policy_number },
              {
                $set: {
                  policyStartDate: policy_start_date,
                  policyEndDate: policy_end_date,
                  policyCategoryId,
                  policyCarrierId,
                  userId,
                  policyType: policy_type,
                  premiumAmount: premium_amount,
                  applicantId: Applicant_ID,
                  agencyId: agentId,
                  hasActiveClientPolicy: hasActive_ClientPolicy,
                  accountType:account_type,
                  policyMode:policy_mode,
                  accountId:accountId,
                  csr:csr

                }
              },
              { upsert: true }
            );

  

          } catch (err) {
            console.error('Error processing CSV row:', err);
          }
        })();
        operations.push(promise);
      })
      .on('end', async () => {
        try {
          await Promise.all(operations);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        reject(err);
      });
  });
}

processFile();


