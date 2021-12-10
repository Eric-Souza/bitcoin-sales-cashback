# Bitcoin Sales Cashbacks

## Procedure

This algorithm reads two files (sales.csv and cashback.csv) into memory and, for each sale, processes the data and finds an associated cashback (by checking if its timestamp is within five seconds of the sale's timestamp). 

The output of this script should be as follows:
- The ID of the sale.
- The timestamp of the sale in ISO 8601 format.
- The amount of the sale in Brazilian Reais, formatted with two decimal places.
- If no associated cashback exists, the next fields should be null.

Otherwise, they should be as the following:
- The ID of the associated cashback.
- The timestamp of the associated cashback in ISO 8601 format.
- The amount of the cashback in Bitcoins, formatted with eight decimal places.
- The price of Bitcoin, knowing that the cashback is supposed to be 0.5% of the value of the sale. The price of Bitcoin is the amount in Reais divided by the amount in Bitcoins.

## To run the code, type in the root folder:

```
node index.js
```
