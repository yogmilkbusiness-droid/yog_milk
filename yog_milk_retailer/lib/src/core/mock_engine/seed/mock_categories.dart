import '../contracts/catalog_repository.dart';

final mockCategories = [
  const CategoryEntity(
    id: 'cat-cow',
    name: 'Cow Milk',
    slug: 'cow-milk',
    displayOrder: 1,
  ),
  const CategoryEntity(
    id: 'cat-buffalo',
    name: 'Buffalo Milk',
    slug: 'buffalo-milk',
    displayOrder: 2,
  ),
  const CategoryEntity(
    id: 'cat-curd',
    name: 'Curd & Taak',
    slug: 'curd-taak',
    displayOrder: 3,
  ),
  const CategoryEntity(
    id: 'cat-paneer',
    name: 'Paneer & Butter',
    slug: 'paneer-butter',
    displayOrder: 4,
  ),
  const CategoryEntity(
    id: 'cat-ghee',
    name: 'Artisanal Ghee',
    slug: 'artisanal-ghee',
    displayOrder: 5,
  ),
];
