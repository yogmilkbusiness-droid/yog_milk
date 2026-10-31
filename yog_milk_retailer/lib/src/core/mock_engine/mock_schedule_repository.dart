import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'contracts/schedule_repository.dart';

class ScheduleState {
  final bool isWindowOpen;
  final String opensAt;
  final String closesAt;
  final String closesAtDisplay;
  final String nextOpenDisplay;

  const ScheduleState({
    required this.isWindowOpen,
    this.opensAt = '07:00',
    this.closesAt = '17:00',
    this.closesAtDisplay = '05:00 PM',
    this.nextOpenDisplay = 'Tomorrow at 07:00 AM',
  });

  ScheduleState copyWith({
    bool? isWindowOpen,
    String? opensAt,
    String? closesAt,
    String? closesAtDisplay,
    String? nextOpenDisplay,
  }) {
    return ScheduleState(
      isWindowOpen: isWindowOpen ?? this.isWindowOpen,
      opensAt: opensAt ?? this.opensAt,
      closesAt: closesAt ?? this.closesAt,
      closesAtDisplay: closesAtDisplay ?? this.closesAtDisplay,
      nextOpenDisplay: nextOpenDisplay ?? this.nextOpenDisplay,
    );
  }

  OrderingSchedule toEntity() {
    return OrderingSchedule(
      isWindowOpen: isWindowOpen,
      opensAt: opensAt,
      closesAt: closesAt,
      nextOpenDisplay: nextOpenDisplay,
      closesAtDisplay: closesAtDisplay,
      operationalDays: const [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
    );
  }
}

class ScheduleNotifier extends StateNotifier<ScheduleState> {
  ScheduleNotifier() : super(const ScheduleState(isWindowOpen: true));

  void toggleWindow(bool isOpen) {
    state = state.copyWith(isWindowOpen: isOpen);
  }
}

final scheduleProvider = StateNotifierProvider<ScheduleNotifier, ScheduleState>(
  (ref) {
    return ScheduleNotifier();
  },
);
