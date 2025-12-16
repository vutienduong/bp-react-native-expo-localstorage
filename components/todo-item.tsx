import React, { useState } from 'react';
import { StyleSheet, Pressable, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newText: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const textColor = useThemeColor({}, 'text');
  const completedColor = useThemeColor({ light: '#687076', dark: '#6c6c70' }, 'todoComplete');
  const checkboxColor = useThemeColor({}, 'todoCheckbox');
  const deleteColor = useThemeColor({ light: '#ff3b30', dark: '#ff453a' }, 'todoDelete');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#38383a' }, 'todoBorder');
  const inputBg = useThemeColor({ light: '#f0f0f0', dark: '#2c2c2e' }, 'todoInput');

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onDelete();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(trimmed);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, { borderBottomColor: borderColor }]}>
      <Pressable
        onPress={handleToggle}
        style={styles.checkbox}
      >
        <IconSymbol
          name={todo.completed ? 'checkmark.circle.fill' : 'circle'}
          size={24}
          color={todo.completed ? checkboxColor : borderColor}
        />
      </Pressable>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={[styles.editInput, { backgroundColor: inputBg, color: textColor, borderColor }]}
            value={editText}
            onChangeText={setEditText}
            onSubmitEditing={handleSaveEdit}
            onBlur={handleSaveEdit}
            autoFocus
            returnKeyType="done"
          />
        </View>
      ) : (
        <Pressable
          onLongPress={handleLongPress}
          style={styles.textContainer}
        >
          <ThemedText
            style={[
              styles.text,
              todo.completed && {
                textDecorationLine: 'line-through',
                color: completedColor,
              },
            ]}
          >
            {todo.text}
          </ThemedText>
        </Pressable>
      )}

      <Pressable
        onPress={handleDelete}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.deleteButtonPressed,
        ]}
      >
        <IconSymbol
          name="trash"
          size={20}
          color={deleteColor}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  checkbox: {
    marginRight: 12,
    padding: 4,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  editContainer: {
    flex: 1,
  },
  editInput: {
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 8,
  },
  deleteButtonPressed: {
    opacity: 0.6,
  },
});
