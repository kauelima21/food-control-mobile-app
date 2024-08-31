import { Button } from '@/components/button';
import { Header } from '@/components/header';
import { Input } from '@/components/input';
import { LinkButton } from '@/components/link-button';
import { Product } from '@/components/product';
import { TextArea } from '@/components/textarea';
import { api } from '@/services/api';
import { ProductCartProps, useCartStore } from '@/stores/cart-store';
import { formatCurrency } from '@/utils/functions/format-currency';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { View, Text, ScrollView, Alert, Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const PHONE_NUMBER = '5586998624957';

export default function Cart() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const cartStore = useCartStore();
  const navigation = useNavigation();
  const total = cartStore.products.reduce(
    (total, product) => total + product.price_in_cents * product.quantity,
    0
  );

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert('Remover', `Deseja remover ${product.name} do carrinho?`, [
      {
        text: 'Cancelar',
      },
      { text: 'Remover', onPress: () => cartStore.remove(product.product_id) },
    ]);
  }

  async function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert('Pedido', 'Informe os dados da entrega.');
    }

    const productsMessage = cartStore.products
      .map((product) => `\n ${product.quantity} ${product.name}`)
      .join('');

    const products = cartStore.products;

    const response = await api.post('/orders', {
      customer_name: name,
      phone,
      address,
      products,
      price_in_cents: total,
    });

    const message = `
      🍔 NOVO PEDIDO
      \n ID: ${response.data.order_id}
      \n 🤝 Cliente: ${name.trim()}
      \n 📱 Contato: ${phone.trim()}
      \n 🛵 Entregar em: ${address.trim()}
      ${productsMessage}
      \n Valor total: ${formatCurrency(total / 100)}
      `;

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
    );
    cartStore.clear();
    navigation.goBack();
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho"></Header>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={100}
      >
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length > 0 ? (
              <View className="border-b border-slate-700">
                {cartStore.products.map((product) => (
                  <Product
                    key={product.product_id}
                    data={product}
                    onPress={() => handleProductRemove(product)}
                  />
                ))}
              </View>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Seu carrinho está vazio.
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4">
              <Text className="text-white text-xl font-subtitle">Total:</Text>
              <Text className="text-lime-400 text-2xl font-heading">
                {formatCurrency(total / 100)}
              </Text>
            </View>

            <View className="space-y-4">
              <Input placeholder="Seu nome" onChangeText={setName} />

              <Input placeholder="Seu telefone" onChangeText={setPhone} />

              <TextArea
                placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..."
                onChangeText={setAddress}
                //   blurOnSubmit={true}
                //   onSubmitEditing={handleOrder}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20}></Feather>
          </Button.Icon>
        </Button>
        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  );
}
