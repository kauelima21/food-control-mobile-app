import { View, Image, Text } from 'react-native';
import { useLocalSearchParams, useNavigation, Redirect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { formatCurrency } from '@/utils/functions/format-currency';
import { Button } from '@/components/button';
import { LinkButton } from '@/components/link-button';
import { useCartStore } from '@/stores/cart-store';
import { useEffect, useState } from 'react';
import { ProductProps } from '@/utils/data/products';
import { api } from '@/services/api';

export default function Product() {
  const [product, setProduct] = useState<ProductProps>();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const cartStore = useCartStore();

  async function findProduct() {
    const response = await api.get<{ product: ProductProps }>(
      `/products/${id}`
    );
    setProduct(response.data.product);
  }

  useEffect(() => {
    findProduct();
  }, []);

  function handleAddToCart() {
    if (product) {
      cartStore.add(product);
      navigation.goBack();
    }
  }

  // if (!product) {
  //   return <Redirect href="/" />;
  // }

  return (
    product && (
      <View className="flex-1">
        <Image
          src={`https://products-covers.s3.sa-east-1.amazonaws.com/${product.cover}`}
          className="w-full h-52"
          resizeMode="cover"
        />

        <View className="p-5 mt-8 flex-1">
          <Text className="text-white text-xl font-heading">
            {product.name}
          </Text>
          <Text className="text-lime-400 text-2xl font-heading my-2">
            {formatCurrency(product.price_in_cents / 100)}
          </Text>

          <Text className="text-slate-400 font-body text-base leading-6 mb-6">
            {product.description}
          </Text>

          {/* {product.ingredients.map((ingredient) => (
          <Text
            key={ingredient}
            className="text-slate-400 font-body text-base leading-6"
          >
            {'\u2022'} {ingredient}
          </Text>
        ))} */}
        </View>

        <View className="p-5 pb-8 gap-5">
          <Button onPress={handleAddToCart}>
            <Button.Icon>
              <Feather name="plus-circle" size={20} />
            </Button.Icon>
            <Button.Text>Adicionar ao pedido</Button.Text>
          </Button>

          <LinkButton title="Voltar ao cardápio" href="/" />
        </View>
      </View>
    )
  );
}
