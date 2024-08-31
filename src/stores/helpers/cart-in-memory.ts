import { ProductProps } from '@/utils/data/products';
import { ProductCartProps } from '../cart-store';

export function add(
  products: ProductCartProps[],
  newProduct: ProductProps
): ProductCartProps[] {
  const existingProduct = products.find(
    ({ product_id }) => newProduct.product_id === product_id
  );

  if (existingProduct) {
    return products.map((product) =>
      existingProduct.product_id === product.product_id
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
  }

  return [...products, { ...newProduct, quantity: 1 }];
}

export function remove(products: ProductCartProps[], productRemovedId: string) {
  const updatedProducts = products.map((product) =>
    product.product_id === productRemovedId
      ? {
          ...product,
          quantity: product.quantity > 1 ? product.quantity - 1 : 0,
        }
      : product
  );

  return updatedProducts.filter((product) => product.quantity > 0);
}
