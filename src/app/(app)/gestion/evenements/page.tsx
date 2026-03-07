'use client';

import { RoleGuard } from '@/features/gestion/components/role-guard';
import { GestionEvenementsContent } from './evenements-content';

export default function GestionEvenementsPage() {
  return (
    <RoleGuard allowedRoles={['pasteur', 'responsable_zone', 'admin']}>
      <GestionEvenementsContent />
    </RoleGuard>
  );
}
