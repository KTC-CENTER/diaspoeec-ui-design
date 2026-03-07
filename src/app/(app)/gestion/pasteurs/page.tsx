'use client';

import { useState } from 'react';
import {
  Plus,
  Loader2,
  UserCheck,
  UserMinus,
  Mail,
  Eye,
  EyeOff,
  X,
  Shield,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils/cn';
import { useToastStore } from '@/stores/toast.store';
import { useAuthStore } from '@/stores/auth.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { RoleGuard } from '@/features/gestion/components/role-guard';
import {
  getPasteurs,
  createPasteur,
  removePasteur,
  type CreatePasteurPayload,
} from '@/lib/api/members.api';
import type { User } from '@/types';

function GestionPasteursContent() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const currentUser = useAuthStore((s) => s.user);

  const { data: pasteurs = [], isLoading } = useQuery({
    queryKey: ['pasteurs'],
    queryFn: getPasteurs,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePasteurPayload) => createPasteur(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pasteurs'] });
      addToast('Pasteur ajoute avec succes', 'success');
      resetForm();
    },
    onError: (err: Error) => {
      addToast(err.message, 'error');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removePasteur(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pasteurs'] });
      addToast('Pasteur retire avec succes', 'success');
    },
    onError: (err: Error) => {
      addToast(err.message, 'error');
    },
  });

  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<User | null>(null);
  const [form, setForm] = useState({ nomComplet: '', email: '', password: '' });

  const resetForm = () => {
    setShowForm(false);
    setForm({ nomComplet: '', email: '', password: '' });
    setShowPassword(false);
  };

  const handleSubmit = () => {
    if (!form.nomComplet.trim() || !form.email.trim() || !form.password.trim()) {
      addToast('Tous les champs sont requis', 'error');
      return;
    }
    if (form.password.length < 6) {
      addToast('Le mot de passe doit contenir au moins 6 caracteres', 'error');
      return;
    }
    createMutation.mutate(form);
  };

  const initials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <section className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-semibold text-forest-900 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Pasteurs de la paroisse
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Gerez les pasteurs ayant acces a la gestion de votre paroisse
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Ajouter un pasteur
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3
              className="text-lg font-semibold text-forest-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Nouveau pasteur
            </h3>
            <button onClick={resetForm} className="rounded-lg p-1 text-ink-400 hover:bg-ink-50">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Nom complet *</label>
              <input
                value={form.nomComplet}
                onChange={(e) => setForm((p) => ({ ...p, nomComplet: e.target.value }))}
                placeholder="Pasteur Jean Mbarga"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="pasteur@example.com"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Mot de passe *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Min. 6 caracteres"
                  className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 pr-10 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-forest-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-forest-700 disabled:opacity-60"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserCheck className="h-4 w-4" />
              )}
              Ajouter
            </button>
            <button
              onClick={resetForm}
              className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
        </div>
      ) : pasteurs.length === 0 ? (
        <div className="rounded-2xl border border-forest-900/5 bg-white py-16 text-center shadow-sm">
          <Shield className="mx-auto mb-3 h-10 w-10 text-ink-300" />
          <p className="text-sm text-ink-500">Aucun pasteur pour le moment</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
          <div className="divide-y divide-gray-50">
            {pasteurs.map((p) => {
              const isSelf = p.id === currentUser?.id;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-cream-50/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-forest-900 text-sm font-semibold text-cream-100">
                      {initials(p.nomComplet)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-ink-900 truncate">
                          {p.nomComplet}
                        </p>
                        {isSelf && (
                          <span className="rounded-full bg-forest-900/10 px-2 py-0.5 text-[10px] font-medium text-forest-900">
                            Vous
                          </span>
                        )}
                      </div>
                      <p className="flex items-center gap-1 text-xs text-ink-500">
                        <Mail className="h-3 w-3" />
                        {p.email}
                      </p>
                    </div>
                  </div>
                  {!isSelf && (
                    <button
                      onClick={() => setRemoveTarget(p)}
                      className="rounded-lg p-2 text-ink-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Retirer ce pasteur"
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pasteurs.length > 0 && (
        <p className="mt-4 text-xs text-ink-500">
          {pasteurs.length} pasteur{pasteurs.length > 1 ? 's' : ''} dans votre paroisse
        </p>
      )}

      <ConfirmDialog
        open={!!removeTarget}
        title="Retirer ce pasteur"
        message={`${removeTarget?.nomComplet} sera retrocede au role de fidele. Il pourra toujours acceder a l'application mais ne pourra plus gerer la paroisse.`}
        confirmLabel="Retirer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={() => {
          if (removeTarget) removeMutation.mutate(removeTarget.id);
          setRemoveTarget(null);
        }}
        onCancel={() => setRemoveTarget(null)}
      />
    </section>
  );
}

export default function GestionPasteursPage() {
  return (
    <RoleGuard allowedRoles={['pasteur', 'admin']}>
      <GestionPasteursContent />
    </RoleGuard>
  );
}
