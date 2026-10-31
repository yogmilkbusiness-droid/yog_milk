import '../contracts/retailer_repository.dart';

/// Authentic seed retailers in Western Maharashtra (Pune, Mumbai, Satara).
final mockRetailerApproved = RetailerProfileEntity(
  id: 'ret-001',
  businessName: 'Om Sai Dairy & Sweets',
  ownerName: 'Ramesh Patil',
  phone: '+91 98220 12345',
  city: 'Pune',
  area: 'Kothrud',
  deliveryAddress: 'Shop No. 4, Anand Nagar, Paud Road, Kothrud, Pune 411038',
  approvalStatus: RetailerApprovalStatus.approved,
  hasPendingPaymentBlock:
      true, // Has pending COD on Order #YM-2026-8841 (₹2,450.00)
);

final mockRetailerClean = RetailerProfileEntity(
  id: 'ret-002',
  businessName: 'Shree Krishna Milk Centre',
  ownerName: 'Sunil Shinde',
  phone: '+91 98220 54321',
  city: 'Pune',
  area: 'Hadapsar',
  deliveryAddress: 'Booth 12, Gadital Chowk, Hadapsar, Pune 411028',
  approvalStatus: RetailerApprovalStatus.approved,
  hasPendingPaymentBlock: false, // Clean account, no pending payments
);

final mockRetailerPendingApproval = RetailerProfileEntity(
  id: 'ret-003',
  businessName: 'Gajanan Daily Needs',
  ownerName: 'Vinod More',
  phone: '+91 98220 99887',
  city: 'Pune',
  area: 'Wakad',
  deliveryAddress: 'Dutta Mandir Road, Wakad, Pune 411057',
  approvalStatus: RetailerApprovalStatus.waitingApproval,
  hasPendingPaymentBlock: false,
);

final mockRetailerOnHold = RetailerProfileEntity(
  id: 'ret-004',
  accountCode: 'YM-ACC-0942',
  businessName: 'Sharma General Store',
  ownerName: 'Rajesh Sharma',
  phone: '+91 98220 33445',
  city: 'Pune',
  area: 'Sinhagad Road',
  deliveryAddress: 'Shop 8, Manik Baug, Sinhagad Road, Pune 411051',
  approvalStatus: RetailerApprovalStatus.onHold,
  hasPendingPaymentBlock: false,
  holdReason: 'Morning route restructuring in your sector / pending dawn verification.',
);
