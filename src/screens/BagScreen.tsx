import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, StatusBar, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { BagItem } from '../components/BagItem';
import {
  selectBagItems,
  selectGrandTotal,
  selectTotalItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromBag,
  clearBag
} from '../store/bagSlice';
import { BagItem as IBagItem } from '../types';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Heart, ChevronDown, BadgeCheck } from 'lucide-react-native';

export const BagScreen: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const bagItems = useSelector(selectBagItems);
  const grandTotal = useSelector(selectGrandTotal);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(bagItems.map((item: IBagItem) => item.id))
  );

  const handleToggleSelect = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleIncrease = useCallback((id: number) => {
    dispatch(increaseQuantity(id));
  }, [dispatch]);

  const handleDecrease = useCallback((id: number) => {
    dispatch(decreaseQuantity(id));
  }, [dispatch]);

  const handleRemove = useCallback((id: number) => {
    dispatch(removeFromBag(id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, [dispatch]);

  const renderItem = useCallback(({ item }: { item: IBagItem }) => (
    <BagItem
      item={item}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
      onRemove={handleRemove}
      isSelected={selectedIds.has(item.id)}
      onToggleSelect={handleToggleSelect}
    />
  ), [handleIncrease, handleDecrease, handleRemove, selectedIds, handleToggleSelect]);

  return (
    <View style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push('/')}
            style={styles.headerButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bag</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/wishlist')}
          >
            <Heart size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {bagItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../assets/tote-bag.jpg')}
              style={styles.emptyBagImage}
              resizeMode="contain"
            />
            <Text style={styles.oopsText}>OOPS ☹</Text>
            <Text style={styles.emptySubtitle}>Add items to your bag now</Text>
            <TouchableOpacity style={styles.continueButton} onPress={() => router.push('/')}>
              <Text style={styles.continueButtonText}>Start shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Delivery Info Banner */}
            <View style={styles.deliveryBanner}>
              <View style={styles.deliveryLeft}>
                <Text style={styles.deliveryIcon}>🛵</Text>
                <View>
                  <Text style={styles.deliveryTitle}>Delivering in just 60 min</Text>
                  <Text style={styles.deliveryAddress} numberOfLines={1}>
                    Full address - 29 Aparna Complex, Gurgaon...
                  </Text>
                </View>
              </View>
              <ChevronDown size={20} color="#555" />
            </View>

            {/* Free Delivery Banner */}
            <View style={styles.freeDeliveryBanner}>
              <BadgeCheck size={16} color="#4F46E5" style={{ marginRight: 6 }} />
              <Text style={styles.freeDeliveryText}>
                Yayy! Your order is eligible for FREE delivery.
              </Text>
            </View>

            {/* Deselect All */}
            <TouchableOpacity onPress={handleDeselectAll} style={styles.deselectRow}>
              <Text style={styles.deselectText}>Deselect all items</Text>
            </TouchableOpacity>

            {/* Items List */}
            <FlatList
              data={bagItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              initialNumToRender={10}
              windowSize={5}
            />

            {/* Sticky Proceed to Pay Button */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Proceed to pay</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f5f5f5',
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deliveryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deliveryIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  deliveryAddress: {
    fontSize: 12,
    color: '#777',
  },
  freeDeliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  freeDeliveryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
    flex: 1,
  },
  deselectRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  deselectText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  listContent: {
    paddingBottom: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 55,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  emptyBagImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
    opacity: 0.6,
    backgroundColor: '#f5f5f5'
  },
  oopsText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


