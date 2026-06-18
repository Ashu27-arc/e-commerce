import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems } from '../store/wishlistSlice';
import { addToBag } from '../store/bagSlice';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Heart } from 'lucide-react-native';

export const WishlistScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  const handleAddToBag = useCallback((product: Product) => {
    dispatch(addToBag(product));
  }, [dispatch]);

  const renderItem = useCallback(({ item }: { item: Product }) => (
    <ProductCard product={item} onAddToBag={handleAddToBag} />
  ), [handleAddToBag]);

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
          <Text style={styles.headerTitle}>Wishlist</Text>
          <View style={{ width: 32 }} />
        </View>

        {wishlistItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heart size={80} color="#ccc" strokeWidth={1} style={{ marginBottom: 20 }} />
            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtitle}>Save items that you like in your wishlist.</Text>
            <TouchableOpacity style={styles.continueButton} onPress={() => router.push('/')}>
              <Text style={styles.continueButtonText}>Start shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={wishlistItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
