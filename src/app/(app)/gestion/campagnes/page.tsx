'use client';

import { RoleGuard } from '@/features/gestion/components/role-guard';
import { GestionCampagnesContent } from './campagnes-content';

export default function GestionCampagnesPage() {
  return (
    <RoleGuard allowedRoles={['pasteur', 'admin']}>
      <GestionCampagnesContent />
    </RoleGuard>
  );
}
