import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const RadioButton = ({ options, initialSelectedValue = null, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(initialSelectedValue);

  useEffect(() => {
    setSelectedOption(initialSelectedValue);
  }, [initialSelectedValue]);

  const handleSelectOption = (option) => {
    setSelectedOption(option.value);
    if(initialSelectedValue !== null) {
      onSelect(option.value);
    }
    else{
      onSelect(option);
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleSelectOption(option)}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              marginLeft: 12,
              borderWidth: 2,
              borderColor: selectedOption === option.value ? 'blue' : 'gray',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {selectedOption === option.value && (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: 'blue',
                }}
              />
            )}
          </View>
          <Text style={{ marginLeft: 8, fontSize: 18 }}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButton;
