import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import httpService from '../httpService';
import { routes } from '../api-routes';
import { ErrorHandler } from '../errorHandler';

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, status, notes, trackingNumber, carrier }) => {
      return httpService.patchData(routes.updateOrderStatus(orderId), {
        status,
        notes,
        trackingNumber,
        carrier
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderDetails'] });
    },
    onError: (error) => ErrorHandler(error)
  });
};

export const useBulkUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderIds, status, notes }) => {
      return httpService.patchData(routes.bulkUpdateOrderStatus(), {
        orderIds,
        status,
        notes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => ErrorHandler(error)
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, reason }) => {
      return httpService.postData(routes.cancelOrder(orderId), { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderDetails'] });
    },
    onError: (error) => ErrorHandler(error)
  });
};

export const useShipOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, trackingNumber, carrier }) => {
      return httpService.postData(routes.shipOrder(orderId), {
        trackingNumber,
        carrier
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderDetails'] });
    },
    onError: (error) => ErrorHandler(error)
  });
};

export const useProcessRefund = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, amount, reason }) => {
      return httpService.postData(routes.processRefund(orderId), {
        amount,
        reason
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderDetails'] });
    },
    onError: (error) => ErrorHandler(error)
  });
};

// 3. CREATE HOOKS FILE: hooks/orders/useOrderNotes.js
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpService from '../httpService';
import { routes } from '../api-routes';
import { ErrorHandler } from '../errorHandler';

export const useGetOrderNotes = (orderId, options = {}) => {
  const { includeInternal = false, enabled = true } = options;
  
  return useQuery({
    queryKey: ['orderNotes', orderId, { includeInternal }],
    queryFn: () => httpService.getData(routes.getOrderNotes(orderId), {
      params: { includeInternal }
    }),
    enabled: enabled && !!orderId,
    select: (data) => data?.data || []
  });
};

export const useAddOrderNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, content, type = 'GENERAL', isInternal = false }) => {
      return httpService.postData(routes.addOrderNote(orderId), {
        content,
        type,
        isInternal
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['orderNotes', variables.orderId] 
      });
    },
    onError: (error) => ErrorHandler(error)
  });
};

// 4. CREATE HOOKS FILE: hooks/orders/useOrderAnalytics.js
import { useQuery } from '@tanstack/react-query';
import httpService from '../httpService';
import { routes } from '../api-routes';
import { ErrorHandler } from '../errorHandler';

export const useGetOrderStatusAnalytics = (filters = {}) => {
  const { timeframe = '30d', enabled = true } = filters;
  
  return useQuery({
    queryKey: ['orderStatusAnalytics', { timeframe }],
    queryFn: () => httpService.getData(routes.getOrderStatusAnalytics({ timeframe })),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data?.data || {}
  });
};

export const useGetFulfillmentMetrics = (filters = {}) => {
  const { timeframe = '30d', enabled = true } = filters;
  
  return useQuery({
    queryKey: ['fulfillmentMetrics', { timeframe }],
    queryFn: () => httpService.getData(routes.getFulfillmentMetrics({ timeframe })),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data?.data || {}
  });
};

export const useGetOrderProgress = (orderId) => {
  return useQuery({
    queryKey: ['orderProgress', orderId],
    queryFn: () => httpService.getData(routes.getOrderProgress(orderId)),
    enabled: !!orderId,
    select: (data) => data?.data || {}
  });
};

// 5. CREATE HOOKS FILE: hooks/orders/useOrderArchive.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpService from '../httpService';
import { routes } from '../api-routes';
import { ErrorHandler } from '../errorHandler';

export const useGetArchivedOrders = (filters = {}) => {
  const { page = 1, limit = 10, enabled = true } = filters;
  
  return useQuery({
    queryKey: ['archivedOrders', { page, limit }],
    queryFn: () => httpService.getData(routes.getArchivedOrders({ page, limit })),
    enabled,
    select: (data) => ({
      orders: data?.data || [],
      pagination: data?.pagination || {}
    })
  });
};

export const useArchiveOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, reason }) => {
      return httpService.postData(routes.archiveOrder(orderId), { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['archivedOrders'] });
    },
    onError: (error) => ErrorHandler(error)
  });
};

export const useUnarchiveOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, reason }) => {
      return httpService.postData(routes.unarchiveOrder(orderId), { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['archivedOrders'] });
    },
    onError: (error) => ErrorHandler(error)
  });
};

export const useBulkArchiveOrders = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ olderThanDays = 30, reason }) => {
      return httpService.postData(routes.bulkArchiveOrders(), {
        olderThanDays,
        reason
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['archivedOrders'] });
      queryClient.invalidateQueries({ queryKey: ['fulfillmentMetrics'] });
    },
    onError: (error) => ErrorHandler(error)
  });
};