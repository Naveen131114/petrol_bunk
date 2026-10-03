import { DayEntry } from '../models/day-entry.model.js';
import { FuelInward } from '../models/fuel-inward.model.js';
import { StockReconciliation } from '../models/stock-reconciliation.model.js';

const total = (values, field) => values.reduce((sum, value) => sum + (value[field] ?? 0), 0);

export async function calculateReconciliation({ businessId, branchId, fuelType, periodStart, periodEnd, physicalClosingStock }) {
  const base = { businessId, branchId, fuelType };
  const range = { $gte: periodStart, $lte: periodEnd };
  const [inwards, sales, preceding] = await Promise.all([
    FuelInward.find({ ...base, date: range }).lean(),
    DayEntry.find({ ...base, date: range }).lean(),
    StockReconciliation.findOne({ ...base, periodEnd: { $lt: periodStart } }).sort({ periodEnd: -1 }).lean(),
  ]);
  const openingStock = preceding?.physicalClosingStock ?? 0;
  const purchasedLitres = total(inwards, 'litres');
  const soldLitres = total(sales, 'soldLitres');
  const purchaseAmount = total(inwards, 'purchaseAmount');
  const salesRevenue = total(sales, 'salesAmount');
  const expectedClosingStock = openingStock + purchasedLitres - soldLitres;
  const averagePurchaseCost = purchasedLitres ? purchaseAmount / purchasedLitres : 0;
  return { openingStock, purchasedLitres, soldLitres, expectedClosingStock, physicalClosingStock, variance: expectedClosingStock - physicalClosingStock, purchaseAmount, salesRevenue, averagePurchaseCost, estimatedCostOfSales: soldLitres * averagePurchaseCost, estimatedGrossProfit: salesRevenue - soldLitres * averagePurchaseCost };
}
