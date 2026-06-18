import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Dimensions, Platform, StatusBar, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, getCategories } from '../api/client';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { addToBag, selectTotalItems } from '../store/bagSlice';
import { FilterModal } from '../components/FilterModal';
import { SortModal, SortOption } from '../components/SortModal';
import { Filter, ArrowUpDown, ShoppingBag, ChevronLeft, Search, Heart, ShoppingCart } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';

export const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modals state
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter and Sort state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [appliedCategory, setAppliedCategory] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<SortOption>(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const totalItems = useSelector(selectTotalItems);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInitialData();
    setRefreshing(false);
  }, []);

  const handleAddToBag = useCallback((product: Product) => {
    dispatch(addToBag(product));
  }, [dispatch]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search Filter
    if (searchQuery) {
      result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Filter
    if (appliedCategory) {
      result = result.filter(p => p.category === appliedCategory);
    }

    // Sort
    if (selectedSort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'rating_desc') {
      result.sort((a, b) => b.rating.rate - a.rating.rate);
    }

    return result;
  }, [products, appliedCategory, selectedSort]);

  const renderItem = useCallback(({ item }: { item: Product }) => (
    <ProductCard product={item} onAddToBag={handleAddToBag} />
  ), [handleAddToBag]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchInitialData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                }
              }} 
              style={styles.backButton}
            >
              <ChevronLeft size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <ShoppingCart size={24} color="#4F46E5" style={{marginRight: 8}} />
              <Text style={styles.headerTitle}>T-shirts</Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={() => setSearchVisible(!searchVisible)}>
              <Search size={22} color={searchVisible ? "#4F46E5" : "#000"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/wishlist')}>
              <Heart size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bagButton} onPress={() => router.push('/bag')}>
              <ShoppingBag size={22} color="#000" />
              {totalItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        {searchVisible && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              clearButtonMode="always"
            />
          </View>
        )}

        {/* Subheader */}
        <View style={styles.subheader}>
          <Text style={styles.subheaderText}>
            Showing <Text style={styles.blueText}>93 results</Text> for <Text style={styles.underlineText}>Slim Fit XL Men's</Text> T-shirts
          </Text>
        </View>

        {/* Product Grid */}
        <FlatList
          data={filteredAndSortedProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          }
        />

        {/* Sticky Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomBarButton} onPress={() => setSortVisible(true)}>
            <ArrowUpDown size={18} color="#4F46E5" style={{ marginRight: 6 }} />
            <Text style={styles.bottomBarText}>Sort by</Text>
          </TouchableOpacity>
          
          <View style={styles.verticalDivider} />
          
          <TouchableOpacity style={styles.bottomBarButton} onPress={() => setFilterVisible(true)}>
            <Filter size={18} color="#4F46E5" style={{ marginRight: 6 }} />
            <Text style={styles.bottomBarText}>Filters</Text>
            {appliedCategory && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>

        <FilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onApply={() => {
            setAppliedCategory(selectedCategory);
            setFilterVisible(false);
          }}
        />

        <SortModal
          visible={sortVisible}
          onClose={() => setSortVisible(false)}
          selectedSort={selectedSort}
          onSelectSort={setSelectedSort}
        />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 10,
  },
  bagButton: {
    padding: 6,
    marginLeft: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#4F46E5', // Indigo badge
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f5f5f5',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  subheader: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  subheaderText: {
    fontSize: 12,
    color: '#666',
  },
  blueText: {
    color: '#4F46E5', // Indigo color for results
    fontWeight: '600',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Padding for sticky bottom bar
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 50,
    left: '15%',
    right: '15%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  bottomBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  bottomBarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  verticalDivider: {
    width: 1.5,
    height: 24,
    backgroundColor: '#999',
  },
  filterDot: {
    position: 'absolute',
    top: 4,
    right: 18,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4F46E5',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
