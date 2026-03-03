'use client';

import { useState } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  X,
  BookMarked,
} from 'lucide-react';
import {
  useAdminAllPlans,
  useAdminPlanDetail,
  useAdminCreatePlan,
  useAdminUpdatePlan,
  useAdminDeletePlan,
  useAdminAddLecture,
  useAdminUpdateLecture,
  useAdminDeleteLecture,
} from '@/features/bible/hooks/use-bible';
import type { AdminPlanSummary } from '@/lib/api/bible.api';
import { useToastStore } from '@/stores/toast.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { RoleGuard } from '@/features/gestion/components/role-guard';

const PLAN_EMOJIS = [
  '📖', '✝️', '🙏', '✨', '💡', '🌿', '🕊️', '🌅',
  '❤️', '🎵', '🌍', '🔥', '💎', '🌺', '⭐', '🦅',
];

// ── Plan list view ────────────────────────────────────────────────────────────

function PlanListView({ onSelectPlan }: { onSelectPlan: (plan: AdminPlanSummary) => void }) {
  const { data: plans = [], isLoading, isError } = useAdminAllPlans();

  const createMutation = useAdminCreatePlan();
  const updateMutation = useAdminUpdatePlan();
  const deleteMutation = useAdminDeletePlan();
  const { addToast } = useToastStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editPlan, setEditPlan] = useState<AdminPlanSummary | null>(null);
  const [deletePlan, setDeletePlan] = useState<AdminPlanSummary | null>(null);

  // Create form
  const [createTitre, setCreateTitre] = useState('');
  const [createDuree, setCreateDuree] = useState('7');
  const [createIcone, setCreateIcone] = useState('📖');

  // Edit form
  const [editTitre, setEditTitre] = useState('');
  const [editIcone, setEditIcone] = useState('📖');

  const handleOpenEdit = (plan: AdminPlanSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitre(plan.titre);
    setEditIcone(plan.icone ?? '📖');
    setEditPlan(plan);
  };

  const handleEditSubmit = () => {
    if (!editPlan) return;
    if (!editTitre.trim()) {
      addToast('Veuillez saisir un titre', 'error');
      return;
    }
    updateMutation.mutate(
      { planId: editPlan.id, data: { titre: editTitre.trim(), icone: editIcone } },
      {
        onSuccess: () => {
          setEditPlan(null);
          addToast('Plan modifie', 'success');
        },
        onError: () => addToast('Erreur lors de la modification', 'error'),
      }
    );
  };

  const handleCreateSubmit = () => {
    if (!createTitre.trim()) {
      addToast('Veuillez saisir un titre', 'error');
      return;
    }
    const dureeJours = parseInt(createDuree, 10);
    if (!dureeJours || dureeJours < 1) {
      addToast('Duree invalide', 'error');
      return;
    }
    createMutation.mutate(
      { titre: createTitre, dureeJours, icone: createIcone || undefined },
      {
        onSuccess: () => {
          setShowCreateModal(false);
          setCreateTitre('');
          setCreateDuree('7');
          setCreateIcone('📖');
          addToast('Plan cree avec succes', 'success');
        },
        onError: () => addToast('Erreur lors de la creation', 'error'),
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletePlan) return;
    deleteMutation.mutate(deletePlan.id, {
      onSuccess: () => {
        setDeletePlan(null);
        addToast('Plan supprime', 'success');
      },
      onError: () => addToast('Erreur lors de la suppression', 'error'),
    });
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-semibold text-forest-900 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Plans de lecture
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Creez et gerez les plans de lecture biblique
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Nouveau plan
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <span className="rounded-full border border-forest-900/10 bg-sage-200 px-3 py-1 text-xs font-medium text-forest-900">
          {plans.length} plan{plans.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest-900/20 border-t-forest-900" />
          <p className="mt-4 text-sm text-ink-400">Chargement des plans...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 py-16">
          <p className="text-ink-500 mb-2">Erreur lors du chargement</p>
          <p className="text-sm text-ink-400">Verifiez que le serveur est en ligne</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-16">
          <BookMarked className="h-10 w-10 text-ink-200 mb-4" />
          <p className="text-ink-400 mb-4">Aucun plan de lecture</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-forest-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-forest-800"
          >
            <Plus className="h-4 w-4" />
            Creer le premier plan
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="group relative flex flex-col rounded-2xl border border-forest-900/5 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="text-3xl">{plan.icone ?? '📖'}</span>
                <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={(e) => handleOpenEdit(plan, e)}
                    className="rounded-lg p-1.5 text-ink-300 transition hover:bg-forest-900/10 hover:text-forest-900"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletePlan(plan)}
                    className="rounded-lg p-1.5 text-ink-300 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mb-1 font-semibold text-ink-900 leading-snug">{plan.titre}</h3>
              <div className="mb-4 flex items-center gap-2">
                <p className="text-xs text-ink-500">{plan.dureeJours} jours</p>
                {plan.estComplet ? (
                  <span className="rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-xs font-medium text-green-700">
                    Complet
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-medium text-amber-700">
                    {plan.lecturesConfigurees}/{plan.dureeJours} jours
                  </span>
                )}
              </div>
              <button
                onClick={() => onSelectPlan(plan)}
                className="mt-auto inline-flex items-center gap-1.5 self-start rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2 text-sm font-medium text-forest-900 transition hover:bg-sage-200"
              >
                Gerer les lectures
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"
            >
              <X className="h-4 w-4" />
            </button>
            <h3
              className="mb-5 text-lg font-semibold text-ink-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Nouveau plan de lecture
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Titre</label>
                <input
                  type="text"
                  value={createTitre}
                  onChange={(e) => setCreateTitre(e.target.value)}
                  placeholder="ex: Les 40 jours avec Dieu"
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Duree (jours)</label>
                <input
                  type="number"
                  min="1"
                  value={createDuree}
                  onChange={(e) => setCreateDuree(e.target.value)}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Icone</label>
                <div className="grid grid-cols-8 gap-1.5 rounded-xl border border-forest-900/10 bg-cream-50 p-2">
                  {PLAN_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCreateIcone(emoji)}
                      className={`flex h-9 w-full items-center justify-center rounded-lg text-xl transition-all ${
                        createIcone === emoji
                          ? 'bg-forest-900 shadow-md scale-110'
                          : 'hover:bg-sage-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateSubmit}
                disabled={createMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creation...' : 'Creer le plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editPlan && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setEditPlan(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setEditPlan(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"
            >
              <X className="h-4 w-4" />
            </button>
            <h3
              className="mb-5 text-lg font-semibold text-ink-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Modifier le plan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Titre</label>
                <input
                  type="text"
                  value={editTitre}
                  onChange={(e) => setEditTitre(e.target.value)}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Icone</label>
                <div className="grid grid-cols-8 gap-1.5 rounded-xl border border-forest-900/10 bg-cream-50 p-2">
                  {PLAN_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditIcone(emoji)}
                      className={`flex h-9 w-full items-center justify-center rounded-lg text-xl transition-all ${
                        editIcone === emoji
                          ? 'bg-forest-900 shadow-md scale-110'
                          : 'hover:bg-sage-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditPlan(null)}
                className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              >
                Annuler
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={updateMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deletePlan}
        title="Supprimer ce plan ?"
        message={`Etes-vous sur de vouloir supprimer "${deletePlan?.titre ?? ''}" et toutes ses lectures ? Cette action est irreversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletePlan(null)}
      />
    </>
  );
}

// ── Plan detail view ──────────────────────────────────────────────────────────

function PlanDetailView({ plan, onBack }: { plan: AdminPlanSummary; onBack: () => void }) {
  const { data: detail, isLoading } = useAdminPlanDetail(plan.id);
  const addLectureMutation = useAdminAddLecture(plan.id);
  const updateLectureMutation = useAdminUpdateLecture(plan.id);
  const deleteLectureMutation = useAdminDeleteLecture(plan.id);
  const { addToast } = useToastStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteLectureId, setDeleteLectureId] = useState<string | null>(null);
  const [deleteLectureTitre, setDeleteLectureTitre] = useState('');

  // Edit lecture state
  const [editLecture, setEditLecture] = useState<{ id: string; reference: string; titre: string; texte: string | null } | null>(null);
  const [editRef, setEditRef] = useState('');
  const [editTitre, setEditTitre] = useState('');
  const [editTexte, setEditTexte] = useState('');

  // Add lecture form
  const [addJour, setAddJour] = useState('');
  const [addReference, setAddReference] = useState('');
  const [addTitre, setAddTitre] = useState('');
  const [addTexte, setAddTexte] = useState('');

  const handleOpenEditLecture = (lecture: { id: string; reference: string; titre: string; texte: string | null }) => {
    setEditRef(lecture.reference);
    setEditTitre(lecture.titre);
    setEditTexte(lecture.texte ?? '');
    setEditLecture(lecture);
  };

  const handleEditLectureSubmit = () => {
    if (!editLecture) return;
    if (!editRef.trim() || !editTitre.trim()) {
      addToast('Reference et titre requis', 'error');
      return;
    }
    updateLectureMutation.mutate(
      {
        lectureId: editLecture.id,
        data: {
          reference: editRef.trim(),
          titre: editTitre.trim(),
          texte: editTexte.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setEditLecture(null);
          addToast('Lecture modifiee', 'success');
        },
        onError: () => addToast('Erreur lors de la modification', 'error'),
      }
    );
  };

  const lectures = detail?.lectures ?? [];

  const handleAddSubmit = () => {
    const jourNumero = parseInt(addJour, 10);
    if (!jourNumero || jourNumero < 1) {
      addToast('Numero de jour invalide', 'error');
      return;
    }
    if (!addReference.trim() || !addTitre.trim()) {
      addToast('Reference et titre requis', 'error');
      return;
    }
    addLectureMutation.mutate(
      {
        jourNumero,
        reference: addReference.trim(),
        titre: addTitre.trim(),
        texte: addTexte.trim() || undefined,
      },
      {
        onSuccess: () => {
          setShowAddModal(false);
          setAddJour('');
          setAddReference('');
          setAddTitre('');
          setAddTexte('');
          addToast('Lecture ajoutee', 'success');
        },
        onError: () => addToast('Erreur lors de l\'ajout', 'error'),
      }
    );
  };

  const handleDeleteLecture = () => {
    if (!deleteLectureId) return;
    deleteLectureMutation.mutate(deleteLectureId, {
      onSuccess: () => {
        setDeleteLectureId(null);
        addToast('Lecture supprimee', 'success');
      },
      onError: () => addToast('Erreur lors de la suppression', 'error'),
    });
  };

  const nextJour = lectures.length > 0
    ? Math.max(...lectures.map((l) => l.jourNumero)) + 1
    : 1;

  const handleOpenAddModal = () => {
    setAddJour(String(nextJour));
    setAddReference('');
    setAddTitre('');
    setAddTexte('');
    setShowAddModal(true);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-500 transition hover:text-forest-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Tous les plans
        </button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{plan.icone ?? '📖'}</span>
              <div>
                <h1
                  className="text-2xl font-semibold text-forest-900 md:text-3xl"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {plan.titre}
                </h1>
                <p className="text-sm text-ink-500">{plan.dureeJours} jours · {lectures.length} lecture{lectures.length > 1 ? 's' : ''} configuree{lectures.length > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Ajouter une lecture
          </button>
        </div>
      </div>

      {/* Lectures list */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest-900/20 border-t-forest-900" />
          <p className="mt-4 text-sm text-ink-400">Chargement des lectures...</p>
        </div>
      ) : lectures.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-16">
          <BookOpen className="h-10 w-10 text-ink-200 mb-4" />
          <p className="text-ink-400 mb-4">Aucune lecture configuree</p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-forest-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-forest-800"
          >
            <Plus className="h-4 w-4" />
            Ajouter la premiere lecture
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-cream-50/50">
                  <th className="px-4 py-3 text-left font-medium text-ink-500 w-16">Jour</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-500 w-36">Reference</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-500">Titre</th>
                  <th className="px-4 py-3 text-center font-medium text-ink-500 w-24">Texte</th>
                  <th className="px-4 py-3 text-right font-medium text-ink-500 w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {[...lectures]
                  .sort((a, b) => a.jourNumero - b.jourNumero)
                  .map((lecture, i) => (
                    <tr
                      key={lecture.id}
                      className={`border-b border-gray-50 transition-colors hover:bg-sage-200/20 ${
                        i % 2 === 0 ? 'bg-cream-50/30' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest-900/10 text-xs font-semibold text-forest-900">
                          {lecture.jourNumero}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200">
                          {lecture.reference}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="truncate max-w-xs font-medium text-ink-900">{lecture.titre}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {lecture.texte ? (
                          <span className="inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-200">
                            Auto
                          </span>
                        ) : (
                          <span className="inline-block rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500 border border-red-200">
                            Manquant
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditLecture(lecture)}
                            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-forest-900/10 hover:text-forest-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteLectureId(lecture.id);
                              setDeleteLectureTitre(lecture.titre);
                            }}
                            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {lectures.length > 0 && (
        <div className="mt-4 rounded-xl border border-forest-900/5 bg-sage-200/30 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-ink-600">Progression du plan</span>
            <span className="font-medium text-forest-900">{lectures.length} / {plan.dureeJours} jours</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-gradient-to-r from-forest-700 to-forest-900 transition-all"
              style={{ width: `${Math.min((lectures.length / plan.dureeJours) * 100, 100)}%` }}
            />
          </div>
          {lectures.length < plan.dureeJours && (
            <p className="mt-2 text-xs text-ink-500">
              {plan.dureeJours - lectures.length} lecture{plan.dureeJours - lectures.length > 1 ? 's' : ''} restante{plan.dureeJours - lectures.length > 1 ? 's' : ''} a configurer
            </p>
          )}
          {lectures.length >= plan.dureeJours && (
            <p className="mt-2 text-xs font-medium text-green-700">Plan complet !</p>
          )}
        </div>
      )}

      {/* Add Lecture Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"
            >
              <X className="h-4 w-4" />
            </button>
            <h3
              className="mb-5 text-lg font-semibold text-ink-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Ajouter une lecture
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Jour numero</label>
                <input
                  type="number"
                  min="1"
                  value={addJour}
                  onChange={(e) => setAddJour(e.target.value)}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">
                  Reference biblique
                </label>
                <input
                  type="text"
                  value={addReference}
                  onChange={(e) => setAddReference(e.target.value)}
                  placeholder="ex: Jean 3:16-21"
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
                <p className="mt-1 text-xs text-ink-400">
                  Le texte sera recupere automatiquement depuis la Bible Louis Segond
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Titre de la lecture</label>
                <input
                  type="text"
                  value={addTitre}
                  onChange={(e) => setAddTitre(e.target.value)}
                  placeholder="ex: L'amour de Dieu pour le monde"
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">
                  Texte personnalise{' '}
                  <span className="text-xs font-normal text-ink-400">(optionnel)</span>
                </label>
                <textarea
                  value={addTexte}
                  onChange={(e) => setAddTexte(e.target.value)}
                  rows={5}
                  placeholder="Meditation complementaire redigee par le pasteur... (laissez vide pour utiliser le texte biblique automatique)"
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddSubmit}
                disabled={addLectureMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {addLectureMutation.isPending ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lecture Modal */}
      {editLecture && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setEditLecture(null)} />
          <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setEditLecture(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"
            >
              <X className="h-4 w-4" />
            </button>
            <h3
              className="mb-5 text-lg font-semibold text-ink-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Modifier la lecture
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Reference biblique</label>
                <input
                  type="text"
                  value={editRef}
                  onChange={(e) => setEditRef(e.target.value)}
                  placeholder="ex: Jean 3:16-21"
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Titre de la lecture</label>
                <input
                  type="text"
                  value={editTitre}
                  onChange={(e) => setEditTitre(e.target.value)}
                  placeholder="ex: L'amour de Dieu pour le monde"
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">
                  Texte personnalise{' '}
                  <span className="text-xs font-normal text-ink-400">(optionnel)</span>
                </label>
                <textarea
                  value={editTexte}
                  onChange={(e) => setEditTexte(e.target.value)}
                  rows={5}
                  placeholder="Laissez vide pour utiliser le texte biblique automatique"
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditLecture(null)}
                className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              >
                Annuler
              </button>
              <button
                onClick={handleEditLectureSubmit}
                disabled={updateLectureMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {updateLectureMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lecture Confirm */}
      <ConfirmDialog
        open={!!deleteLectureId}
        title="Supprimer cette lecture ?"
        message={`Etes-vous sur de vouloir supprimer "${deleteLectureTitre}" du plan ? Cette action est irreversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleDeleteLecture}
        onCancel={() => setDeleteLectureId(null)}
      />
    </>
  );
}

// ── Page root ─────────────────────────────────────────────────────────────────

function GestionBibleContent() {
  const [selectedPlan, setSelectedPlan] = useState<AdminPlanSummary | null>(null);

  return (
    <section className="mx-auto max-w-5xl">
      {selectedPlan ? (
        <PlanDetailView plan={selectedPlan} onBack={() => setSelectedPlan(null)} />
      ) : (
        <PlanListView onSelectPlan={setSelectedPlan} />
      )}
    </section>
  );
}

export default function GestionBiblePage() {
  return (
    <RoleGuard allowedRoles={['pasteur', 'admin']}>
      <GestionBibleContent />
    </RoleGuard>
  );
}
