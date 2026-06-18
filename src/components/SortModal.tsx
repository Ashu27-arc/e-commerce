import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

export type SortOption = 'price_asc' | 'price_desc' | 'rating_desc' | null;

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  selectedSort,
  onSelectSort,
}) => {
  const options: { label: string; value: SortOption | string }[] = [
    { label: 'Newest arrivals', value: 'newest' },
    { label: 'Price - low to high', value: 'price_asc' },
    { label: 'Price - high to low', value: 'price_desc' },
    { label: 'Offers and dicounts', value: 'offers' },
    { label: 'Best sellers', value: 'rating_desc' },
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
              <Text style={styles.title}>Sort by</Text>
            </View>

            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.optionButton}
                  onPress={() => {
                    if (['price_asc', 'price_desc', 'rating_desc'].includes(option.value as string)) {
                      onSelectSort(option.value as SortOption);
                    } else {
                      onSelectSort(null);
                    }
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedSort === option.value && styles.optionTextSelected
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
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
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5', // Indigo color for the title
  },
  optionsContainer: {
    marginBottom: 10,
  },
  optionButton: {
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextSelected: {
    color: '#000',
    fontWeight: '600', // Just make it slightly bolder if selected, though image doesn't show selected state clearly
  },
});
