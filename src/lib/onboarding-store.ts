import { create } from "zustand";
import type {
  OnboardingState,
  OnboardingConfig,
  OnboardingStep,
  OrganizationSector,
  InfrastructureType,
  CriticalAssetId,
} from "@/types/onboarding";

// ============================================================================
// Default onboarding configuration
// ============================================================================

const DEFAULT_CONFIG: OnboardingConfig = {
  organizationSector: null,
  infrastructureType: null,
  includeOTSystems: false,
  criticalAssets: [],
};

// ============================================================================
// Onboarding Store
// ============================================================================

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  config: { ...DEFAULT_CONFIG },
  currentStep: 1,

  setSector: (sector: OrganizationSector) => {
    set((state) => ({
      config: { ...state.config, organizationSector: sector },
    }));
  },

  setInfrastructureType: (type: InfrastructureType) => {
    set((state) => ({
      config: { ...state.config, infrastructureType: type },
    }));
  },

  setIncludeOTSystems: (include: boolean) => {
    set((state) => ({
      config: { ...state.config, includeOTSystems: include },
    }));
  },

  toggleAsset: (assetId: CriticalAssetId) => {
    set((state) => {
      const current = state.config.criticalAssets;
      const next = current.includes(assetId)
        ? current.filter((id) => id !== assetId)
        : [...current, assetId];
      return { config: { ...state.config, criticalAssets: next } };
    });
  },

  nextStep: () => {
    const { currentStep, isStepValid } = get();
    if (!isStepValid(currentStep)) return;
    if (currentStep < 4) {
      set({ currentStep: (currentStep + 1) as OnboardingStep });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as OnboardingStep });
    }
  },

  goToStep: (step: OnboardingStep) => {
    set({ currentStep: step });
  },

  resetOnboarding: () => {
    set({
      config: { ...DEFAULT_CONFIG },
      currentStep: 1,
    });
  },

  isStepValid: (step: OnboardingStep): boolean => {
    const { config } = get();
    switch (step) {
      case 1:
        return config.organizationSector !== null;
      case 2:
        return config.infrastructureType !== null;
      case 3:
        return config.criticalAssets.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  },
}));
