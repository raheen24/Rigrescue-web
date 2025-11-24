import { useQuery, useMutation } from '@tanstack/react-query';
import { apiHelper } from './index.js';

const handleApiResponse = async (apiCall) => {
  const result = await apiCall;
  if (result.error) {
    throw new Error(result.error);
  }
  return result.response.data;
};

// Queries
export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const result = await apiHelper("GET", "/web/profile");
      if (result.error) throw new Error(result.error);
      return result.response.data;
    },
  });
};

export const useBudgetRequestsQuery = (status) => {
  return useQuery({
    queryKey: ['budgetRequests', status],
    queryFn: async () => {
      const result = await apiHelper("GET", `/web/fleet/budget-requests?status=${status}`);
      if (result.error) throw new Error(result.error);
      return result.response.data;
    },
  });
};

export const useServiceBookingsQuery = (status, search = '') => {
  const params = new URLSearchParams({ status });
  if (search) params.append('search', search);
  return useQuery({
    queryKey: ['serviceBookings', status, search],
    queryFn: async () => {
      const result = await apiHelper("GET", `/web/service-bookings?${params.toString()}`);
      if (result.error) throw new Error(result.error);
      return result.response.data.data;
    },
  });
};

export const useServiceBookingDetailsQuery = (id) => {
  return useQuery({
    queryKey: ['serviceBookingDetails', id],
    queryFn: async () => {
      const result = await apiHelper("GET", `/web/service-booking/${id}`);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.response.data.data;
    },
    enabled: !!id,
  });
};

export const useMechanicsQuery = (status, search = '') => {
  const params = new URLSearchParams({ status });
  if (search) params.append('search', search);
  return useQuery({
    queryKey: ['mechanics', status, search],
    queryFn: async () => {
      const result = await apiHelper("GET", `/web/shop/mechanics?${params.toString()}`);
      if (result.error) throw new Error(result.error);
      return result.response.data.data;
    },
  });
};

export const useProductsQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const result = await apiHelper("GET", "/web/shop/products");
      if (result.error) throw new Error(result.error);
      return result.response.data.data;
    },
  });
};

export const useProductDetailsQuery = (id) => {
  return useQuery({
    queryKey: ['productDetails', id],
    queryFn: async () => {
      const result = await apiHelper("GET", `/web/shop/product/${id}`);
      if (result.error) throw new Error(result.error);
      return result.response.data.data;
    },
  });
};

export const useProductRequestsQuery = () => {
  return useQuery({
    queryKey: ['productRequests'],
    queryFn: async () => {
      const result = await apiHelper("GET", "/web/shop/product/requests");
      if (result.error) throw new Error(result.error);
      return result.response.data.data;
    },
  });
};

export const useChatInboxQuery = () => {
  return useQuery({
    queryKey: ['chatInbox'],
    queryFn: async () => {
      const result = await apiHelper("GET", "/web/chat/inbox");
      if (result.error) throw new Error(result.error);
      return result.response.data;
    },
  });
};

export const useNotificationsQuery = (options = {}) => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const result = await apiHelper("GET", "/notifications");
      if (result.error) throw new Error(result.error);
      return result.response.data;
    },
    ...options,
  });
};

// Mutations
export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: (data) => handleApiResponse(apiHelper("POST", "/web/profile/update", {}, data)),
  });
};

export const useDeleteProfileMutation = () => {
  return useMutation({
    mutationFn: () => handleApiResponse(apiHelper("DELETE", "/web/profile/delete")),
  });
};

export const useManageBudgetRequestMutation = () => {
  return useMutation({
    mutationFn: (data) => handleApiResponse(apiHelper("POST", "/web/fleet/budget-request/manage", {}, data)),
  });
};

export const useCreateMechanicMutation = () => {
  return useMutation({
    mutationFn: (data) => handleApiResponse(apiHelper("POST", "/web/shop/mechanic/create", {}, data)),
  });
};

export const useAddProductMutation = () => {
  return useMutation({
    mutationFn: (data) => handleApiResponse(apiHelper("POST", "/web/shop/product/store", {}, data)),
  });
};

export const useUpdateProductMutation = () => {
  return useMutation({
    mutationFn: (data) => handleApiResponse(apiHelper("POST", "/web/shop/product/update", {}, data)),
  });
};

export const useDeleteProductMutation = () => {
  return useMutation({
    mutationFn: (id) => handleApiResponse(apiHelper("DELETE", `/web/shop/product/delete?product_id=${id}`)),
  });
};

export const useMarkChatAsReadMutation = () => {
  return useMutation({
    mutationFn: (data) => handleApiResponse(apiHelper("POST", "/web/chat/read-status", {}, data)),
  });
};

// Auth mutations
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      const result = await apiHelper("POST", "/web/login", {}, data);
      if (result.error) throw new Error(result.error);
      return result.response.data;
    },
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      const result = await apiHelper("POST", "/web/register", {}, data);
      if (result.error) throw new Error(result.error);
      return result.response.data;
    },
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      const result = await apiHelper("POST", "/web/verify-otp", {}, data);
      if (result.error) throw new Error(result.error);
      return result.response.data;
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      const result = await apiHelper("POST", "/web/forgot-password", {}, data);
      if (result.error) throw new Error(result.error);
      return result.response.data;
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      const result = await apiHelper("POST", "/web/change-password", {}, data);
      if (result.error) throw new Error(result.error);
      return result.response.data;
    },
  });
};

export const useCreateDriverMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      const result = await apiHelper("POST", "/web/fleet/driver/create", {}, data);
      if (result.error) throw new Error(result.error);
      return result.response.data;
    },
  });
};

export const useAddCardMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      const result = await apiHelper("POST", "/web/fleet/card/add", {}, data);
      if (result.error) throw new Error(result.error);
      return result.response.data;
    },
  });
};