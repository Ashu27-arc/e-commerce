import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Product } from '../types';
import { Heart } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist, selectIsWishlisted } from '../store/wishlistSlice';

interface ProductCardProps {
  product: Product;
  onAddToBag: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with 16 padding on sides and 16 gap

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onAddToBag }) => {
  const dispatch = useDispatch();
  const isWishlisted = useSelector((state: any) => selectIsWishlisted(state, product.id));

  // Use category as brand, capitalize first letters
  const categoryName = product.category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // FakeStore API prices are in USD. Converting to INR (x80) for the UI matching.
  const currentPriceInINR = Math.floor(product.price * 80);
  const originalPriceInINR = Math.floor(product.price * 2.5 * 80);
  const discount = Math.floor(((originalPriceInINR - currentPriceInINR) / originalPriceInINR) * 100);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onAddToBag(product)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        <TouchableOpacity 
          style={styles.heartButton}
          onPress={() => dispatch(toggleWishlist(product))}
        >
          <Heart 
            size={20} 
            color={isWishlisted ? "#ff4444" : "#666"} 
            fill={isWishlisted ? "#ff4444" : "transparent"} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.details}>
        <Text style={styles.brandTitle} numberOfLines={1}>
          {categoryName}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {product.title}
        </Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{currentPriceInINR}</Text>
          <View style={styles.tryBuyContainer}>
            <Text style={styles.tryText}>TRY</Text>
            <Text style={styles.nText}> N </Text>
            <Text style={styles.buyText}>BUY</Text>
          </View>
        </View>
        
        <View style={styles.discountRow}>
          <Text style={styles.originalPrice}>₹{originalPriceInINR}</Text>
          <Text style={styles.discountText}>{discount}% OFF</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: cardWidth,
    height: cardWidth * 1.3,
    backgroundColor: '#fff', // Changed to white to better support API's product images
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
  },
  details: {
    paddingTop: 8,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  tryBuyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  nText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5', // Indigo color for N
    fontStyle: 'italic',
  },
  buyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5', // Indigo color
  },
});
