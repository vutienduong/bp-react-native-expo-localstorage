import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

export function TodoInput({ onAddTodo }: TodoInputProps) {
  const [text, setText] = useState('');

  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#2c2c2e' }, 'todoInput');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#38383a' }, 'todoBorder');
  const tintColor = useThemeColor({}, 'tint');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onAddTodo(trimmed);
      setText('');
    }
  };

  return (
    <View style={[styles.container, { borderColor }]}>
      <TextInput
        style={[styles.input, { backgroundColor, color: textColor }]}
        value={text}
        onChangeText={setText}
        placeholder="Add a new todo..."
        placeholderTextColor={useThemeColor({ light: '#999', dark: '#666' }, 'icon')}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
      >
        <IconSymbol
          name="plus.circle.fill"
          size={32}
          color={tintColor}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 8,
    padding: 4,
  },
  addButtonPressed: {
    opacity: 0.6,
  },
});
