enum RetailerApprovalStatus { approved, waitingApproval, blocked, onHold }

class RetailerProfileEntity {
  final String id;
  final String? accountCode; // e.g. "YM-ACC-0942"
  final String businessName; // e.g. "Om Sai Dairy & Sweets"
  final String ownerName; // e.g. "Ramesh Patil"
  final String phone;
  final String city; // "Pune"
  final String area; // "Kothrud"
  final String deliveryAddress;
  final RetailerApprovalStatus approvalStatus;
  final bool hasPendingPaymentBlock;
  final String? holdReason;

  const RetailerProfileEntity({
    required this.id,
    this.accountCode,
    required this.businessName,
    required this.ownerName,
    required this.phone,
    required this.city,
    required this.area,
    required this.deliveryAddress,
    required this.approvalStatus,
    required this.hasPendingPaymentBlock,
    this.holdReason,
  });
}

abstract class RetailerRepository {
  Future<RetailerProfileEntity> getCurrentRetailer();
  Future<void> updateDeliveryAddress(String newAddress);
}
