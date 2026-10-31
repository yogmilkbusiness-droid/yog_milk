import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'contracts/retailer_repository.dart';
import 'persistence/mock_storage_service.dart';
import 'seed/mock_retailers.dart';

enum AuthStatus { unauthenticated, pendingApproval, approved, onHold }

class AuthState {
  final AuthStatus status;
  final RetailerProfileEntity? profile;
  final bool isFirstLaunch;

  const AuthState({
    required this.status,
    this.profile,
    this.isFirstLaunch = false,
  });

  bool get isAuthenticated => status == AuthStatus.approved;
  bool get isWaitingApproval => status == AuthStatus.pendingApproval;
  bool get isOnHold => status == AuthStatus.onHold;

  AuthState copyWith({
    AuthStatus? status,
    RetailerProfileEntity? profile,
    bool? isFirstLaunch,
  }) {
    return AuthState(
      status: status ?? this.status,
      profile: profile ?? this.profile,
      isFirstLaunch: isFirstLaunch ?? this.isFirstLaunch,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier()
    : super(
        AuthState(
          status: AuthStatus.approved,
          profile: mockRetailerApproved,
          isFirstLaunch: false,
        ),
      ) {
    _loadSaved();
  }

  Future<void> _loadSaved() async {
    final savedId = await MockStorageService.getActiveRetailerId();
    if (savedId != null) {
      final accounts = [
        mockRetailerApproved,
        mockRetailerClean,
        mockRetailerPendingApproval,
        mockRetailerOnHold,
      ];
      final match = accounts.cast<RetailerProfileEntity?>().firstWhere(
        (r) => r?.id == savedId,
        orElse: () => null,
      );
      if (match != null) {
        signInWithGoogle(match);
      }
    }
  }

  /// 1-tap Mock Google Sign-In with an existing or new profile
  void signInWithGoogle(RetailerProfileEntity selectedAccount) {
    AuthStatus resolvedStatus;
    if (selectedAccount.approvalStatus == RetailerApprovalStatus.onHold ||
        selectedAccount.approvalStatus == RetailerApprovalStatus.blocked) {
      resolvedStatus = AuthStatus.onHold;
    } else if (selectedAccount.approvalStatus == RetailerApprovalStatus.approved) {
      resolvedStatus = AuthStatus.approved;
    } else {
      resolvedStatus = AuthStatus.pendingApproval;
    }

    state = state.copyWith(
      status: resolvedStatus,
      profile: selectedAccount,
    );
    MockStorageService.saveActiveRetailerId(selectedAccount.id);
  }

  /// 1-tap simulated phone authentication
  void signInWithPhone(String phone) {
    if (phone.contains('98220')) {
      // Recognized registered retailer
      state = state.copyWith(
        status: AuthStatus.approved,
        profile: mockRetailerApproved,
      );
    } else {
      // New phone number -> navigate to complete profile
      state = state.copyWith(status: AuthStatus.unauthenticated, profile: null);
    }
  }

  /// Register new retailer profile
  void registerRetailer({
    required String businessName,
    required String ownerName,
    required String phone,
    required String deliveryAddress,
    required String city,
    required String area,
  }) {
    final newProfile = RetailerProfileEntity(
      id: 'ret-${DateTime.now().millisecondsSinceEpoch}',
      businessName: businessName,
      ownerName: ownerName,
      phone: phone,
      city: city,
      area: area,
      deliveryAddress: deliveryAddress,
      approvalStatus: RetailerApprovalStatus.waitingApproval,
      hasPendingPaymentBlock: false,
    );

    state = state.copyWith(
      status: AuthStatus.pendingApproval,
      profile: newProfile,
    );
  }

  void signOut() {
    state = const AuthState(
      status: AuthStatus.unauthenticated,
      profile: null,
      isFirstLaunch: false,
    );
  }

  /// Toggle simulated pending debt block for Rule 4.4 testing
  void setPendingPaymentBlock(bool hasBlock) {
    if (state.profile != null) {
      final updated = RetailerProfileEntity(
        id: state.profile!.id,
        businessName: state.profile!.businessName,
        ownerName: state.profile!.ownerName,
        phone: state.profile!.phone,
        city: state.profile!.city,
        area: state.profile!.area,
        deliveryAddress: state.profile!.deliveryAddress,
        approvalStatus: state.profile!.approvalStatus,
        hasPendingPaymentBlock: hasBlock,
      );
      state = state.copyWith(profile: updated);
    }
  }
}

final authControllerProvider = StateNotifierProvider<AuthNotifier, AuthState>((
  ref,
) {
  return AuthNotifier();
});
