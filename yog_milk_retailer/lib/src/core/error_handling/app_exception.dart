/// Master typed domain exceptions for Yog Milk Retailer Application.
sealed class AppException implements Exception {
  final String message;
  final String? code;
  final dynamic details;

  const AppException(this.message, {this.code, this.details});

  @override
  String toString() => 'AppException(code: $code, message: $message)';
}

/// Thrown when an order is attempted while the admin-configured ordering window is closed.
class ScheduleClosedException extends AppException {
  final String? nextOpenTime;

  const ScheduleClosedException({
    String message = 'The ordering window is currently closed.',
    this.nextOpenTime,
  }) : super(message, code: 'SCHEDULE_CLOSED');
}

/// Thrown when an order is attempted while a previous order has paymentStatus == PENDING.
class PendingPaymentBlockedException extends AppException {
  final String blockingOrderCode;
  final double pendingAmount;

  const PendingPaymentBlockedException({
    required this.blockingOrderCode,
    required this.pendingAmount,
    String message =
        'Ordering is blocked due to an unresolved pending payment.',
  }) : super(message, code: 'PENDING_PAYMENT_BLOCK');
}

/// Thrown when retailer account is not yet verified by operations.
class UnapprovedRetailerException extends AppException {
  const UnapprovedRetailerException({
    String message =
        'Your retailer account is pending verification by YOG MILK staff.',
  }) : super(message, code: 'UNAPPROVED_RETAILER');
}

/// Thrown when network / mock latency simulated error occurs.
class NetworkException extends AppException {
  const NetworkException({
    String message =
        'Unable to reach dairy operations server. Please check your connection.',
  }) : super(message, code: 'NETWORK_ERROR');
}

/// Thrown when validation rules fail (e.g. minimum order quantity).
class ValidationException extends AppException {
  const ValidationException(super.message, {super.code = 'VALIDATION_FAILED'});
}
