import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/header';
import { CategoryButton } from '@/components/category-button';
import { View, FlatList, SectionList, Text } from 'react-native';
import { Link } from 'expo-router';
import { ProductProps } from '@/utils/data/products';
import { Product } from '@/components/product';
import { useCartStore } from '@/stores/cart-store';
import { api } from '@/services/api';

export default function Home() {
  const [menu, setMenu] = useState<{ title: string; data: ProductProps[] }[]>();
  const [categories, setCategories] = useState<string[]>([]);
  const cartStore = useCartStore();
  const [category, setCategory] = useState('Esfirras');
  const sectionListRef = useRef<SectionList<ProductProps>>(null);
  const cartQuantityItems = cartStore.products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  async function fetchProducts() {
    const response = await api.get<{ products: ProductProps[] }>('/products');
    const menu = Object.entries(
      response.data.products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }

        acc[product.category].push(product);

        return acc;
      }, {} as { [category: string]: ProductProps[] })
    ).map(([title, data]) => ({
      title,
      data,
    }));

    setMenu(menu);
    setCategories(menu.map((item) => item.title));
  }

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory);
    const sectionIndex = categories.findIndex(
      (category) => category == selectedCategory
    );
    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex,
        itemIndex: 0,
      });
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!menu) {
    return <Text>SEM PRODUTOS</Text>;
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Cardápio" cartQuantityItems={cartQuantityItems} />

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === category}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        horizontal
        className="max-h-10 mt-5"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
      />

      <SectionList
        ref={sectionListRef}
        sections={menu}
        keyExtractor={(item) => item.product_id}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-xl text-white font-heading mt-8 mb-3">
            {title}
          </Text>
        )}
        renderItem={({ item }) => (
          <Link href={`/product/${item.product_id}`} asChild>
            <Product data={item} />
          </Link>
        )}
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
