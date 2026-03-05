import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export function useReportComment() {
  return useMutation({
    mutationFn: async ({ commentId, raison }: { commentId: string; raison?: string }) => {
      return apiClient.post(ENDPOINTS.COMMENT_REPORT(commentId), { raison });
    },
  });
}
