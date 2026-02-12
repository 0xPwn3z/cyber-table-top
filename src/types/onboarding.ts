// ============================================================================
// CyberTabletop — Onboarding Wizard Type Definitions
// Types for the 3-step organization context configuration
// ============================================================================

/** Available organization sectors */
export type OrganizationSector = "financial" | "public" | "logistics";

/** Infrastructure deployment model */
export type InfrastructureType = "hybrid" | "on-premise";

/** Identifiers for critical asset categories */
export type CriticalAssetId =
  | "pii"
  | "financial_records"
  | "production_servers"
  | "email_collaboration"
  | "backup_infrastructure"
  | "trade_secrets_ip";

/** The complete onboarding configuration data */
export interface OnboardingConfig {
  organizationSector: OrganizationSector | null;
  infrastructureType: InfrastructureType | null;
  includeOTSystems: boolean;
  criticalAssets: CriticalAssetId[];
}

/** Current step index (1-based) */
export type OnboardingStep = 1 | 2 | 3 | 4;

/** Sector card display configuration */
export interface SectorOption {
  id: OrganizationSector;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  hoverBorder: string;
}

/** Infrastructure card display configuration */
export interface InfrastructureOption {
  id: InfrastructureType;
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

/** Critical asset card display configuration */
export interface CriticalAssetOption {
  id: CriticalAssetId;
  title: string;
  description: string;
  icon: string;
  highImpact: boolean;
}

/** Onboarding Zustand store shape */
export interface OnboardingState {
  config: OnboardingConfig;
  currentStep: OnboardingStep;

  // Actions
  setSector: (sector: OrganizationSector) => void;
  setInfrastructureType: (type: InfrastructureType) => void;
  setIncludeOTSystems: (include: boolean) => void;
  toggleAsset: (assetId: CriticalAssetId) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  resetOnboarding: () => void;
  isStepValid: (step: OnboardingStep) => boolean;
}
