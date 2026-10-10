import type { Request, Response } from 'express';
import { Order, PAID_STATUSES } from '../../models/Order.js';
import { Product } from '../../models/Product.js';
import { User } from '../../models/User.js';
import { roundMoney } from '../../utils/pricing.js';

const LOW_STOCK_THRESHOLD = 5;
const SALES_DAYS = 30;
const DAY = 24 * 60 * 60 * 1000;

// @desc:   dashboard numbers: revenue, counts, orders by status, low stock, recent orders and daily sales
// @access: private (admin)
// @route:  GET /api/admin/stats
export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  const since = new Date(Date.now() - (SALES_DAYS - 1) * DAY);
  since.setUTCHours(0, 0, 0, 0);
  const paid = { status: { $in: PAID_STATUSES } };

  const [[revenue], byStatus, usersCount, productsCount, lowStock, recentOrders, sales] = await Promise.all([
    Order.aggregate<{ total: number }>([{ $match: paid }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.aggregate<{ _id: string; count: number }>([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    User.countDocuments(),
    Product.countDocuments({ isAvailable: true }),
    Product.find({ isAvailable: true, qtyInStock: { $lte: LOW_STOCK_THRESHOLD } })
      .sort({ qtyInStock: 1 })
      .limit(5)
      .select('name slug image qtyInStock'),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'id name email'),
    Order.aggregate<{ _id: string; total: number; orders: number }>([
      { $match: { ...paid, paidAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
          total: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
    ]),
  ]);

  const salesByDate = new Map(sales.map((day) => [day._id, day]));
  const salesByDay = Array.from({ length: SALES_DAYS }, (_, index) => {
    const date = new Date(since.getTime() + index * DAY).toISOString().slice(0, 10);
    const day = salesByDate.get(date);
    return { date, total: roundMoney(day?.total ?? 0), orders: day?.orders ?? 0 };
  });

  const ordersByStatus = Object.fromEntries(byStatus.map(({ _id, count }) => [_id, count]));

  res.status(200).json({
    revenue: roundMoney(revenue?.total ?? 0),
    ordersCount: byStatus.reduce((acc, { count }) => acc + count, 0),
    ordersByStatus,
    usersCount,
    productsCount,
    lowStock,
    recentOrders,
    salesByDay,
  });
};
