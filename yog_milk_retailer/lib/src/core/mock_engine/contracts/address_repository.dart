/// Address entity contract for delivery drop points and warehouse depots.
class DeliveryAddressEntity {
  final String id;
  final String title; // e.g. "Main Shop (Dawn Drop Point)", "Cold Storage Depot"
  final String businessName; // e.g. "Om Sai Dairy & Sweets"
  final String street;
  final String area;
  final String city;
  final String pincode;
  final String dropInstructions;
  final bool isDefault;
  final String contactPerson;
  final String contactPhone;

  const DeliveryAddressEntity({
    required this.id,
    required this.title,
    required this.businessName,
    required this.street,
    required this.area,
    required this.city,
    required this.pincode,
    this.dropInstructions = 'Drop crates inside chilled rack before 5:30 AM',
    this.isDefault = false,
    this.contactPerson = 'Ramesh Patil',
    this.contactPhone = '+91 98220 12345',
  });

  String get fullAddress => '$street, $area, $city $pincode';

  DeliveryAddressEntity copyWith({
    String? id,
    String? title,
    String? businessName,
    String? street,
    String? area,
    String? city,
    String? pincode,
    String? dropInstructions,
    bool? isDefault,
    String? contactPerson,
    String? contactPhone,
  }) {
    return DeliveryAddressEntity(
      id: id ?? this.id,
      title: title ?? this.title,
      businessName: businessName ?? this.businessName,
      street: street ?? this.street,
      area: area ?? this.area,
      city: city ?? this.city,
      pincode: pincode ?? this.pincode,
      dropInstructions: dropInstructions ?? this.dropInstructions,
      isDefault: isDefault ?? this.isDefault,
      contactPerson: contactPerson ?? this.contactPerson,
      contactPhone: contactPhone ?? this.contactPhone,
    );
  }
}

