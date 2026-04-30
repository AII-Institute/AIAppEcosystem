import { SupabaseClient } from '@supabase/supabase-js';
import type {
  AppId,
  AsyncResult,
  CreateOnboardingUserInput,
  OnboardingState,
  OnboardingStepKey,
  OnboardingUser,
  UpdateOnboardingStateInput,
} from '@ecosystem/types';

export function createOnboardingService(client: SupabaseClient) {
  return {
    async createUser(input: CreateOnboardingUserInput): AsyncResult<OnboardingUser> {
      const { data, error } = await client
        .from('onboarding_users')
        .insert({
          email: input.email,
          app_id: input.appId,
          role: input.role,
          display_name: input.displayName ?? null,
          avatar_color: input.avatarColor ?? null,
        })
        .select()
        .single();

      if (error) return { success: false, error: new Error(error.message) };
      return { success: true, data: mapUser(data) };
    },

    async getUser(email: string, appId: AppId): AsyncResult<OnboardingUser | null> {
      const { data, error } = await client
        .from('onboarding_users')
        .select()
        .eq('email', email)
        .eq('app_id', appId)
        .maybeSingle();

      if (error) return { success: false, error: new Error(error.message) };
      return { success: true, data: data ? mapUser(data) : null };
    },

    async getOrCreateState(
      userId: string,
      appId: AppId,
      firstStep: OnboardingStepKey,
    ): AsyncResult<OnboardingState> {
      const { data: existing, error: fetchError } = await client
        .from('onboarding_state')
        .select()
        .eq('user_id', userId)
        .eq('app_id', appId)
        .maybeSingle();

      if (fetchError) return { success: false, error: new Error(fetchError.message) };
      if (existing) return { success: true, data: mapState(existing) };

      const { data, error } = await client
        .from('onboarding_state')
        .insert({
          user_id: userId,
          app_id: appId,
          current_step: firstStep,
          status: 'in_progress',
          step_data: {},
        })
        .select()
        .single();

      if (error) return { success: false, error: new Error(error.message) };
      return { success: true, data: mapState(data) };
    },

    async updateState(
      userId: string,
      appId: AppId,
      input: UpdateOnboardingStateInput,
    ): AsyncResult<OnboardingState> {
      const { data, error } = await client
        .from('onboarding_state')
        .update({
          ...(input.currentStep !== undefined && { current_step: input.currentStep }),
          ...(input.status !== undefined && { status: input.status }),
          ...(input.stepData !== undefined && { step_data: input.stepData }),
          ...(input.completedAt !== undefined && { completed_at: input.completedAt }),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('app_id', appId)
        .select()
        .single();

      if (error) return { success: false, error: new Error(error.message) };
      return { success: true, data: mapState(data) };
    },

    async isOnboardingComplete(userId: string, appId: AppId): AsyncResult<boolean> {
      const { data, error } = await client
        .from('onboarding_state')
        .select('status')
        .eq('user_id', userId)
        .eq('app_id', appId)
        .maybeSingle();

      if (error) return { success: false, error: new Error(error.message) };
      return { success: true, data: data?.status === 'completed' };
    },
  };
}

export type OnboardingService = ReturnType<typeof createOnboardingService>;

// ── Mappers ───────────────────────────────────────────────────

function mapUser(row: Record<string, unknown>): OnboardingUser {
  return {
    id: row.id as string,
    email: row.email as string,
    appId: row.app_id as string,
    role: row.role as string,
    displayName: row.display_name as string | null,
    avatarColor: row.avatar_color as string | null,
    createdAt: row.created_at as string,
  };
}

function mapState(row: Record<string, unknown>): OnboardingState {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    appId: row.app_id as string,
    currentStep: row.current_step as string,
    status: row.status as OnboardingState['status'],
    stepData: (row.step_data as Record<string, unknown>) ?? {},
    completedAt: row.completed_at as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
