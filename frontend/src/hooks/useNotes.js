import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

// Fetch all notes (supports advanced query params & request cancellation)
export function useNotes(params) {
  const queryParams = {
    search: params?.search || undefined,
    category: params?.category || undefined,
    status: params?.status || undefined,
    sort: params?.sort || undefined,
    page: params?.page || 1,
    limit: params?.limit || 6,
  };

  return useQuery({
    queryKey: ['notes', queryParams],
    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get('/notes', { 
        params: queryParams,
        signal
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
}

// Fetch a single note detailed info
export function useNote(id) {
  return useQuery({
    queryKey: ['notes', 'detail', id],
    queryFn: async ({ signal }) => {
      if (!id) return null;
      const response = await axiosInstance.get(`/notes/${id}`, { signal });
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Create a new note
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNote) => {
      const response = await axiosInstance.post('/notes', newNote);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

// Update an existing note (with Optimistic Updates implementation)
export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, fields }) => {
      const response = await axiosInstance.patch(`/notes/${id}`, fields);
      return response.data.data;
    },
    // Trigger optimistic update
    onMutate: async ({ id, fields }) => {
      // Cancel outgoing queries to avoid overwriting state
      await queryClient.cancelQueries({ queryKey: ['notes'] });

      // Save previous data for rollback
      const previousNotesQueries = queryClient.getQueriesData({ queryKey: ['notes'] });

      // Optimistically update all cached lists containing this note
      queryClient.setQueriesData({ queryKey: ['notes'] }, (old) => {
        if (!old || !old.data || !old.data.notes) return old;
        return {
          ...old,
          data: {
            ...old.data,
            notes: old.data.notes.map((note) =>
              note._id === id ? { ...note, ...fields } : note
            ),
          },
        };
      });

      return { previousNotesQueries };
    },
    // If mutation fails, rollback to pre-mutate state snapshots
    onError: (err, newTodo, context) => {
      if (context?.previousNotesQueries) {
        context.previousNotesQueries.forEach(([queryKey, previousData]) => {
          queryClient.setQueryData(queryKey, previousData);
        });
      }
    },
    // Always refetch / invalidate after success/error to ensure we have true db values
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', 'detail', variables.id] });
    },
  });
}

// Delete a note
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/notes/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}
