import { calculateReconciliation } from '../services/reconciliation.js';
import { StockReconciliation } from '../models/stock-reconciliation.model.js';
import { asyncHandler } from '../utils/async-handler.js';

export const preview = asyncHandler(async (req, res) => {
  res.json({ reconciliation: await calculateReconciliation({ ...req.query, businessId: req.user.businessId }) });
});
export const save = asyncHandler(async (req, res) => {
  const calculation = await calculateReconciliation({ ...req.body, businessId: req.user.businessId });
  const reconciliation = await StockReconciliation.create({ ...req.body, ...calculation, businessId: req.user.businessId, createdBy: req.user.id });
  res.status(201).json({ reconciliation });
});
