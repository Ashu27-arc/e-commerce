import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onApply: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedCategory,
  onSelectCategory,
  onApply
}) => {
  const sidebarItems = [
    'Suggested fliters', 'New arrivals', 'Gender', 'Price', 'Brand', 
    'Fabric', 'Fit', 'Size', 'Color', 'Discounts', 'Delivery time'
  ];
  const [activeSidebar, setActiveSidebar] = useState('Gender');

  const genderOptions = [
    { label: 'Men', apiValue: "men's clothing" },
    { label: 'Women', apiValue: "women's clothing" },
    { label: 'Boys', apiValue: 'boys' },
    { label: 'Girls', apiValue: 'girls' },
    { label: 'Unisex', apiValue: 'unisex' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={styles.bottomSheet}>
            <View style={styles.header}>
              <Text style={styles.title}>Filters</Text>
            </View>

            <View style={styles.contentRow}>
              {/* Left Sidebar */}
              <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
                {sidebarItems.map(item => (
                  <TouchableOpacity 
                    key={item} 
                    style={[
                      styles.sidebarItem, 
                      activeSidebar === item && styles.sidebarItemSelected
                    ]}
                    onPress={() => setActiveSidebar(item)}
                  >
                    <Text style={[
                      styles.sidebarText, 
                      activeSidebar === item && styles.sidebarTextSelected
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Right Content Area */}
              <View style={styles.mainContent}>
                {activeSidebar === 'Gender' ? (
                  <>
                    <Text style={styles.sectionTitle}>Select gender</Text>
                    <View style={styles.pillsContainer}>
                      {genderOptions.map(option => (
                        <TouchableOpacity 
                          key={option.label}
                          style={[
                            styles.pill,
                            selectedCategory === option.apiValue && styles.pillSelected
                          ]}
                          onPress={() => onSelectCategory(option.apiValue)}
                        >
                          <Text style={[
                            styles.pillText,
                            selectedCategory === option.apiValue && styles.pillTextSelected
                          ]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                ) : (
                  <Text style={styles.placeholderText}>Options for {activeSidebar}</Text>
                )}
              </View>
            </View>

            {/* Footer Actions */}
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={() => onSelectCategory(null)}
              >
                <Text style={styles.clearButtonText}>Clear all</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={onApply}>
                <Text style={styles.applyButtonText}>Apply filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%', // fixed height for split view
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5', // Indigo color for the title
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sidebarItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  sidebarItemSelected: {
    backgroundColor: '#fff',
  },
  sidebarText: {
    fontSize: 13,
    color: '#333',
  },
  sidebarTextSelected: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  mainContent: {
    flex: 2.2,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginBottom: 10,
    marginRight: 10,
  },
  pillSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#f0f0ff', // Very light indigo tint
  },
  pillText: {
    fontSize: 13,
    color: '#333',
  },
  pillTextSelected: {
    color: '#4F46E5',
  },
  placeholderText: {
    fontSize: 13,
    color: '#999',
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#4F46E5', // Blue outline
    marginRight: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  clearButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#4F46E5', // Solid blue
    paddingVertical: 12,
    borderRadius: 24,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
