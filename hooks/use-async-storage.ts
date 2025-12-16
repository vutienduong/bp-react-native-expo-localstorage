import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '@/types/todo';

const STORAGE_KEY = '@todo_app:todos';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: Error | null;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  editTodo: (id: string, newText: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load todos from AsyncStorage on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsedTodos = JSON.parse(data) as Todo[];
        setTodos(parsedTodos);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load todos'));
    } finally {
      setLoading(false);
    }
  };

  const saveTodos = async (updatedTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to save todos');
    }
  };

  const addTodo = useCallback(async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: trimmedText,
      completed: false,
      createdAt: Date.now(),
    };

    const updatedTodos = [...todos, newTodo];

    // Optimistic update
    setTodos(updatedTodos);

    try {
      await saveTodos(updatedTodos);
    } catch (err) {
      // Rollback on error
      setTodos(todos);
      setError(err instanceof Error ? err : new Error('Failed to add todo'));
      throw err;
    }
  }, [todos]);

  const toggleTodo = useCallback(async (id: string) => {
    const previousTodos = [...todos];
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
          completedAt: !todo.completed ? Date.now() : undefined,
        };
      }
      return todo;
    });

    // Optimistic update
    setTodos(updatedTodos);

    try {
      await saveTodos(updatedTodos);
    } catch (err) {
      // Rollback on error
      setTodos(previousTodos);
      setError(err instanceof Error ? err : new Error('Failed to toggle todo'));
      throw err;
    }
  }, [todos]);

  const deleteTodo = useCallback(async (id: string) => {
    const previousTodos = [...todos];
    const updatedTodos = todos.filter(todo => todo.id !== id);

    // Optimistic update
    setTodos(updatedTodos);

    try {
      await saveTodos(updatedTodos);
    } catch (err) {
      // Rollback on error
      setTodos(previousTodos);
      setError(err instanceof Error ? err : new Error('Failed to delete todo'));
      throw err;
    }
  }, [todos]);

  const editTodo = useCallback(async (id: string, newText: string) => {
    const trimmedText = newText.trim();
    if (!trimmedText) return;

    const previousTodos = [...todos];
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, text: trimmedText };
      }
      return todo;
    });

    // Optimistic update
    setTodos(updatedTodos);

    try {
      await saveTodos(updatedTodos);
    } catch (err) {
      // Rollback on error
      setTodos(previousTodos);
      setError(err instanceof Error ? err : new Error('Failed to edit todo'));
      throw err;
    }
  }, [todos]);

  const clearCompleted = useCallback(async () => {
    const previousTodos = [...todos];
    const updatedTodos = todos.filter(todo => !todo.completed);

    // Optimistic update
    setTodos(updatedTodos);

    try {
      await saveTodos(updatedTodos);
    } catch (err) {
      // Rollback on error
      setTodos(previousTodos);
      setError(err instanceof Error ? err : new Error('Failed to clear completed'));
      throw err;
    }
  }, [todos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
  };
}
