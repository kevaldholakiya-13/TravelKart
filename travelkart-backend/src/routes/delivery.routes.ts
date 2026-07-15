import { Router } from 'express';
import { sendSuccess, sendError, isDeliverable, getDeliveryDays } from '../utils/helpers';

const router = Router();

// Check Delivery Availability
router.post('/check', (req, res) => {
  try {
    const { pincode } = req.body;

    if (!pincode) {
      return sendError(res, 400, 'Pincode is required');
    }

    const deliverable = isDeliverable(pincode.trim());
    const estimatedDays = getDeliveryDays(pincode.trim());

    if (!deliverable) {
      return sendSuccess(res, 200, 'Delivery not available at this location', {
        isDeliverable: false,
        pincode: pincode.trim(),
        estimatedDays: 0,
      });
    }

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);

    sendSuccess(res, 200, 'Delivery available', {
      isDeliverable: true,
      pincode: pincode.trim(),
      estimatedDays,
      estimatedDate: estimatedDate.toISOString().split('T')[0],
      shippingCharge: 299,
    });
  } catch (error: any) {
    sendError(res, 500, 'Error checking delivery', error);
  }
});

// Get Deliverable Cities
router.get('/cities', (req, res) => {
  try {
    const cities = [
      { name: 'Ahmedabad', state: 'Gujarat', pincodes: ['380001', '380002', '380015'] },
      { name: 'Bangalore', state: 'Karnataka', pincodes: ['560001', '560034', '560052'] },
      { name: 'Mumbai', state: 'Maharashtra', pincodes: ['400001', '400051', '400084'] },
      { name: 'Delhi', state: 'Delhi', pincodes: ['110001', '110002', '110003'] },
      { name: 'Hyderabad', state: 'Telangana', pincodes: ['500001', '500034', '500081'] },
    ];

    sendSuccess(res, 200, 'Deliverable cities retrieved', { cities });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving cities', error);
  }
});

// Track Delivery
router.get('/track/:trackingNumber', (req, res) => {
  try {
    const { trackingNumber } = req.params;

    // Mock delivery tracking data
    const trackingData = {
      trackingNumber,
      status: 'In Transit',
      lastUpdate: new Date().toISOString(),
      location: 'Ahmedabad Distribution Center',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      events: [
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Order Confirmed',
          location: 'Warehouse',
        },
        {
          date: new Date().toISOString(),
          status: 'In Transit',
          location: 'Ahmedabad Distribution Center',
        },
      ],
    };

    sendSuccess(res, 200, 'Tracking information retrieved', trackingData);
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving tracking information', error);
  }
});

// Get Shipping Charges
router.post('/shipping-charges', (req, res) => {
  try {
    const { pincode, weight = 1 } = req.body;

    if (!pincode) {
      return sendError(res, 400, 'Pincode is required');
    }

    const deliverable = isDeliverable(pincode);

    if (!deliverable) {
      return sendSuccess(res, 200, 'Delivery not available', {
        available: false,
        charges: 0,
      });
    }

    // Calculate shipping based on weight
    const baseCharge = 299;
    const extraCharge = (weight - 1) * 50;
    const totalCharge = Math.max(baseCharge, baseCharge + extraCharge);

    sendSuccess(res, 200, 'Shipping charges calculated', {
      available: true,
      baseCharge,
      extraCharge,
      totalCharge,
      weight,
      estimatedDays: getDeliveryDays(pincode),
    });
  } catch (error: any) {
    sendError(res, 500, 'Error calculating shipping charges', error);
  }
});

export default router;
