/// Ordering Schedule entity definition (Rule 4.1).
class OrderingSchedule {
  final bool isWindowOpen;
  final String opensAt; // e.g. "07:00"
  final String closesAt; // e.g. "17:00"
  final String nextOpenDisplay; // e.g. "Tomorrow at 07:00 AM"
  final String closesAtDisplay; // e.g. "05:00 PM"
  final List<String> operationalDays;

  const OrderingSchedule({
    required this.isWindowOpen,
    required this.opensAt,
    required this.closesAt,
    required this.nextOpenDisplay,
    required this.closesAtDisplay,
    required this.operationalDays,
  });
}

abstract class ScheduleRepository {
  Future<OrderingSchedule> getActiveSchedule();
  Stream<OrderingSchedule> watchSchedule();
}
