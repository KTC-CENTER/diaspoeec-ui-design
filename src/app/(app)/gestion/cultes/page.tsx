'use client';

import { RoleGuard } from '@/features/gestion/components/role-guard';
import { GestionCultesContent } from './cultes-content';

export default function GestionCultesPage() {
  return (
    <RoleGuard allowedRoles={['pasteur', 'admin']}>
      <GestionCultesContent />
    </RoleGuard>
  );
}
