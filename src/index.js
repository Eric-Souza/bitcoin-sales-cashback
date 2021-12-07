const fs = require('fs');

try {
  // Reads files
  const salesFile = fs.readFileSync('sales.csv', 'UTF-8');
  const cashbackFile = fs.readFileSync('cashback.csv', 'UTF-8');

  // Splits content by new line
  const salesFileLines = salesFile.split(/\r?\n/);
  const cashbackFileLines = cashbackFile.split(/\r?\n/);

  const mainOutput = [];
  const salesWithoutCashback = [];

  // Reads files line by line and separates all sales with and without an associated cashback into 2 arrays
  for (let i = 0; i < salesFileLines.length; i++) {
    // Goes to next line if current one isn't valid or is blank
    if (
      salesFileLines[i] === 'id,amount,created_at,ref' ||
      salesFileLines[i] === ''
    )
      i++;

    // For each sale line, checks if there's an associated cashback
    for (let j = 0; j < cashbackFileLines.length; j++) {
      if (
        cashbackFileLines[j] === 'id,amount,created_at,ref' ||
        cashbackFileLines[j] === ''
      )
        j++;

      const salesSplitLine = salesFileLines[i].split(',');
      const cashbackSplitLine = cashbackFileLines[j].split(',');

      const salesId = salesSplitLine[0];
      const salesCents = salesSplitLine[1];
      const salesTimestamp = salesSplitLine[2];

      const cashbackId = cashbackSplitLine[0];
      const cashbackSatochis = cashbackSplitLine[1];
      const cashbackTimestamp = cashbackSplitLine[2];

      // Parses date from ISO 8601 to Javascript
      const salesJsTs = new Date(salesTimestamp);
      const cashbackJsTs = new Date(cashbackTimestamp);

      var salesBrReais = (salesCents / 100).toFixed(2);
      var cashbackBitcoins = (cashbackSatochis * 0.00000001).toFixed(8); // Bitcoin = Satochi * 10^-8

      var bitcoinPrice = (
        ((5 / 100) * salesBrReais) /
        cashbackBitcoins
      ).toFixed(2);

      var secondsBetweenDates =
        (cashbackJsTs.getTime() - salesJsTs.getTime()) / 1000;

      var cashbackOutput = null;
      var output = `${salesId},${salesTimestamp},${salesBrReais},${cashbackOutput}`;

      // Checks if current sale has an associated cashback (within 5 seconds after sale)
      if (secondsBetweenDates >= 0 && secondsBetweenDates <= 5) {
        cashbackOutput = `${cashbackId},${cashbackTimestamp},${cashbackBitcoins},${bitcoinPrice}`;
        output = `${salesId},${salesTimestamp},${salesBrReais},${cashbackOutput}`;

        // Pushes to main output array containing all sales with an associated cashback while removing possible duplicates
        if (!mainOutput.includes(output)) mainOutput.push(output);
      }

      // If it doesn't, pushes to an array containing all sales without cashback
      else {
        cashbackOutput = null;
        output = `${salesId},${salesTimestamp},${salesBrReais},${cashbackOutput}`;

        if (!salesWithoutCashback.includes(output))
          salesWithoutCashback.push(output);
      }
    }
  }

  // Checks and filters sales that don't have an associated cashback
  salesWithoutCashback.map((saleWithoutCashback) => {
    let saleId = saleWithoutCashback.split(',').shift();

    if (
      !mainOutput.find((el) => el.split(',').shift() === saleId) &&
      saleWithoutCashback.split(',').shift() !== ''
    )
      // Adds valid sale without cashback to main output array
      mainOutput.push(saleWithoutCashback);
  });

  // Sorts the final output in ascending order by id
  const customSort = (a, b) => {
    return Number(a.match(/(\d+)/g)[0]) - Number(b.match(/(\d+)/g)[0]);
  };

  // Prints the sorted final output
  mainOutput.sort(customSort).map((finalOutput) => console.log(finalOutput));
} catch (err) {
  console.error(err);
}
