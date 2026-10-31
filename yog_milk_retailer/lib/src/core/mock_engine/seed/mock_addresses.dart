import '../contracts/address_repository.dart';

final mockInitialAddresses = <DeliveryAddressEntity>[
  const DeliveryAddressEntity(
    id: 'addr-001',
    title: 'Main Dairy Booth (Primary Drop Point)',
    businessName: 'Om Sai Dairy & Sweets',
    street: 'Shop No. 4, Anand Nagar, Paud Road',
    area: 'Kothrud',
    city: 'Pune',
    pincode: '411038',
    dropInstructions:
        'Deliver before 5:30 AM. Place milk crates inside chilled crate rack on veranda.',
    isDefault: true,
    contactPerson: 'Ramesh Patil',
    contactPhone: '+91 98220 12345',
  ),
  const DeliveryAddressEntity(
    id: 'addr-002',
    title: 'Ambad Godown & Cold Storage',
    businessName: 'Om Sai Cold Storage Depot',
    street: 'Plot No. 18, MIDC Sector 2',
    area: 'Ambad',
    city: 'Nashik',
    pincode: '422010',
    dropInstructions:
        'Bulk paneer and ghee storage. Gate security takes morning delivery sign-off.',
    isDefault: false,
    contactPerson: 'Sunil Patil',
    contactPhone: '+91 98220 54321',
  ),
  const DeliveryAddressEntity(
    id: 'addr-003',
    title: 'Market Yard Institutional Depot',
    businessName: 'Patil Agro Distributing',
    street: 'Gate 4, Shop 22, Market Yard',
    area: 'Gultekdi',
    city: 'Pune',
    pincode: '411037',
    dropInstructions:
        'Bulk 200ml taak and butter dispatches. Contact godown manager directly.',
    isDefault: false,
    contactPerson: 'Kailas Jadhav',
    contactPhone: '+91 98220 98765',
  ),
];

