import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { TodoInput } from '@/components/todo-input';
import { TodoItem } from '@/components/todo-item';
import { useTodos } from '@/hooks/use-async-storage';
import { TodoFilter } from '@/types/todo';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState<TodoFilter>('all');

  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#38383a' }, 'todoBorder');
  const mutedColor = useThemeColor({ light: '#687076', dark: '#6c6c70' }, 'todoComplete');

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const hasCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={tintColor} />
        <ThemedText style={styles.loadingText}>Loading todos...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>My Todos</ThemedText>
          {activeCount > 0 && (
            <ThemedText style={[styles.count, { color: mutedColor }]}>
              {activeCount} {activeCount === 1 ? 'item' : 'items'} left
            </ThemedText>
          )}
        </View>

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: '#ff453a20', borderColor: '#ff453a' }]}>
            <ThemedText style={styles.errorText}>Error: {error.message}</ThemedText>
          </View>
        )}

        <TodoInput onAddTodo={addTodo} />

        <View style={[styles.filterContainer, { borderBottomColor: borderColor }]}>
          <Pressable
            onPress={() => setFilter('all')}
            style={({ pressed }) => [
              styles.filterButton,
              filter === 'all' && { backgroundColor: tintColor },
              pressed && styles.filterButtonPressed,
            ]}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === 'all' && { color: '#fff' },
              ]}
            >
              All
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setFilter('active')}
            style={({ pressed }) => [
              styles.filterButton,
              filter === 'active' && { backgroundColor: tintColor },
              pressed && styles.filterButtonPressed,
            ]}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === 'active' && { color: '#fff' },
              ]}
            >
              Active
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setFilter('completed')}
            style={({ pressed }) => [
              styles.filterButton,
              filter === 'completed' && { backgroundColor: tintColor },
              pressed && styles.filterButtonPressed,
            ]}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === 'completed' && { color: '#fff' },
              ]}
            >
              Completed
            </ThemedText>
          </Pressable>
        </View>

        {filteredTodos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={[styles.emptyText, { color: mutedColor }]}>
              {todos.length === 0
                ? 'No todos yet. Add one to get started!'
                : filter === 'active'
                ? 'No active todos. Great job!'
                : 'No completed todos yet.'}
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={filteredTodos}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onToggle={() => toggleTodo(item.id)}
                onDelete={() => deleteTodo(item.id)}
                onEdit={(newText) => editTodo(item.id, newText)}
              />
            )}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
        )}

        {hasCompleted && (
          <Pressable
            onPress={clearCompleted}
            style={({ pressed }) => [
              styles.clearButton,
              { borderColor },
              pressed && styles.clearButtonPressed,
            ]}
          >
            <ThemedText style={[styles.clearButtonText, { color: mutedColor }]}>
              Clear Completed
            </ThemedText>
          </Pressable>
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 14,
  },
  errorContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    color: '#ff453a',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  filterButtonPressed: {
    opacity: 0.7,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  clearButton: {
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  clearButtonPressed: {
    opacity: 0.6,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
