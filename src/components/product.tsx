import { forwardRef } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Image,
  View,
  Text,
} from 'react-native';

type ProductDataProps = {
  name: string;
  description: string;
  cover: string;
  quantity?: number;
};

type ProductProps = TouchableOpacityProps & {
  data: ProductDataProps;
};

export const Product = forwardRef<TouchableOpacity, ProductProps>(
  ({ data, ...rest }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        className="w-full flex-row items-center pb-4"
        activeOpacity={0.7}
        {...rest}
      >
        <Image
          src={`https://products-covers.s3.sa-east-1.amazonaws.com/${data.cover}`}
          className="w-20 h-20 rounded-md"
        />

        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="text-slate-100 font-subtitle text-base flex-1">
              {data.name}
            </Text>

            {data.quantity && (
              <Text className="text-slate-400 font-subtitle text-sm">
                x {data.quantity}
              </Text>
            )}
          </View>

          <Text className="text-slate-400 text-xs leading-5 mt-0.5">
            {data.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);
