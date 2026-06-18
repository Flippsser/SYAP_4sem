import { z } from 'zod';
import { ProductFormData, ProductSchema } from '../schemas/productSchema';
import { DataShapeError } from './queryErrors';

const API_BASE_URL = 'https://dummyjson.com/products';
const LOCAL_ID_THRESHOLD = 1_000_000_000_000;
const LOCAL_PRODUCTS_STORAGE_KEY = 'local_products';
const DELETED_IDS_KEY = 'deleted_product_ids';

export const SIMPLE_CATEGORIES = ['electronics', 'clothing', 'food', 'other'] as const;

const CATEGORY_MAP: Record<string, string> = {
  smartphones: 'electronics',
  laptops: 'electronics',
  tablets: 'electronics',
  'mobile-accessories': 'electronics',
  tops: 'clothing',
  'womens-dresses': 'clothing',
  'womens-shoes': 'clothing',
  'womens-jewellery': 'clothing',
  'womens-bags': 'clothing',
  'womens-watches': 'clothing',
  'mens-shirts': 'clothing',
  'mens-shoes': 'clothing',
  'mens-watches': 'clothing',
  sunglasses: 'clothing',
  groceries: 'food',
  beauty: 'other',
  fragrances: 'other',
  furniture: 'other',
  'home-decoration': 'other',
  'kitchen-accessories': 'other',
  motorcycle: 'other',
  'skin-care': 'other',
  'sports-accessories': 'other',
  vehicle: 'other',
};

export function toSimpleCategory(dummyCat: string): string {
  return CATEGORY_MAP[dummyCat] || 'other';
}

const ProductListResponseSchema = z.object({
  products: z.array(ProductSchema),
});

export const productsQueryKey = ['products'] as const;

async function parseJson(response: Response) {
  if (!response.ok) {
    throw new Error('Ошибка запроса к API');
  }
  return response.json();
}

function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch {
    throw new DataShapeError();
  }
}

const LocalProductsSchema = z.array(ProductSchema);

function readLocalProducts() {
  const raw = localStorage.getItem(LOCAL_PRODUCTS_STORAGE_KEY);
  if (!raw) {
    return [] as z.infer<typeof ProductSchema>[];
  }

  try {
    const parsedRaw = JSON.parse(raw);
    return parseOrThrow(LocalProductsSchema, parsedRaw);
  } catch {
    localStorage.removeItem(LOCAL_PRODUCTS_STORAGE_KEY);
    return [] as z.infer<typeof ProductSchema>[];
  }
}

function writeLocalProducts(products: z.infer<typeof ProductSchema>[]) {
  localStorage.setItem(LOCAL_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

function isLocalProductId(id: number) {
  return id >= LOCAL_ID_THRESHOLD;
}

function readDeletedIds(): number[] {
  try {
    return JSON.parse(localStorage.getItem(DELETED_IDS_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeDeletedIds(ids: number[]) {
  localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(ids));
}

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}?limit=0`);
  const data = await parseJson(response);
  const parsed = parseOrThrow(ProductListResponseSchema, data);
  const localProducts = readLocalProducts();
  const deletedIds = new Set(readDeletedIds());
  const localIds = new Set(localProducts.map(p => p.id));

  const result: z.infer<typeof ProductSchema>[] = [...localProducts];

  for (const p of parsed.products) {
    if (localIds.has(p.id)) continue;
    if (deletedIds.has(p.id)) continue;
    result.push(p);
  }

  return result;
}

export async function fetchProductById(id: number) {
  const deletedIds = new Set(readDeletedIds());
  if (deletedIds.has(id)) throw new Error('Товар не найден');

  const localMatch = readLocalProducts().find((product) => product.id === id);
  if (localMatch) return localMatch;

  const response = await fetch(`${API_BASE_URL}/${id}`);
  const data = await parseJson(response);
  return parseOrThrow(ProductSchema, data);
}

export async function createProduct(product: ProductFormData) {
  const localProduct = parseOrThrow(ProductSchema, {
    id: Date.now(),
    ...product,
  });

  const currentLocalProducts = readLocalProducts();
  writeLocalProducts([localProduct, ...currentLocalProducts]);
  return localProduct;
}

export async function updateProduct(id: number, product: ProductFormData) {
  const updated = parseOrThrow(ProductSchema, { id, ...product });
  const current = readLocalProducts();
  const idx = current.findIndex((p) => p.id === id);
  if (idx >= 0) {
    current[idx] = updated;
  } else {
    current.push(updated);
  }
  writeLocalProducts(current);

  if (!isLocalProductId(id)) {
    try {
      await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    } catch { /* результат не гарантирован, сохранили локально */ }
  }

  return updated;
}

export async function deleteProduct(id: number) {
  const current = readLocalProducts();
  writeLocalProducts(current.filter((item) => item.id !== id));

  if (!isLocalProductId(id)) {
    const deletedIds = readDeletedIds();
    deletedIds.push(id);
    writeDeletedIds(deletedIds);

    try {
      await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    } catch { /* игнорируем */ }
  }
}
