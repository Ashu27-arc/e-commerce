import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { BagItem as IBagItem } from '../types';
import { Trash2, Plus } from 'lucide-react-native';

interface BagItemProps {
  item: IBagItem;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}

export const BagItem: React.FC<BagItemProps> = React.memo(({ 
  item, onIncrease, onDecrease, onRemove, isSelected, onToggleSelect 
}) => {
  const currentPriceInINR = Math.floor(item.price * 80);
  const originalPriceInINR = Math.floor(item.price * 2.5 * 80);

  return (
    <View style={styles.container}>
      {/* Checkbox */}
      <TouchableOpacity 
        style={[styles.checkbox, isSelected && styles.checkboxSelected]}
        onPress={() => onToggleSelect(item.id)}
      >
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      </View>

      {/* Product Details */}
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.descLine} numberOfLines={1}>Product description line 1</Text>
        <Text style={styles.descLine} numberOfLines={1}>Product description line 2</Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{currentPriceInINR}</Text>
          <Text style={styles.originalPrice}>₹{originalPriceInINR}</Text>
        </View>

        {/* TRY N BUY */}
        <Text style={styles.tryNBuy}>
          TRY<Text style={styles.tryNBuyN}> N </Text>BUY
        </Text>

        {/* Quantity Controls */}
        <View style={styles.quantityRow}>
          <TouchableOpacity 
            onPress={() => item.quantity === 1 ? onRemove(item.id) : onDecrease(item.id)} 
            style={styles.qtyBtn}
          >
            <Trash2 size={14} color="#555" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => onIncrease(item.id)} style={styles.qtyBtn}>
            <Plus size={14} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 10,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  imageContainer: {
    width: 90,
    height: 110,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  descLine: {
    fontSize: 12,
    color: '#999',
    marginBottom: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  originalPrice: {
    fontSize: 13,
    color: '#aaa',
    textDecorationLine: 'line-through',
  },
  tryNBuy: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginTop: 2,
    marginBottom: 8,
  },
  tryNBuyN: {
    color: '#4F46E5',
    fontWeight: '800',
    fontStyle: 'italic',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    minWidth: 20,
    textAlign: 'center',
  },
});


