import { useState, useEffect, useCallback, useRef } from "react";

const DRAFT_STORAGE_KEY = "ramesses_custom_draft";

interface Concept {
  id: string;
  name: string;
  overview: string;
  metal: string;
  center_stone: {
    shape: string;
    size_mm: string;
    type: string;
  };
  setting_style: string;
  band: {
    width_mm: string;
    style: string;
    pave: string;
    shoulders: string;
  };
  gallery_details: string;
  prongs: string;
  accent_stones: string;
  manufacturing_notes: string;
  images: {
    hero: string;
    side: string;
    top: string;
  };
}

interface GeneralForm {
  pieceType: string;
  metal: string;
  style: string;
  stonePreferences: string;
  budget: string;
  description: string;
}

interface EngagementForm {
  style: string;
  stoneShape: string;
  centerStoneType: string;
  centerStoneSize: string;
  metal: string;
  ringSize: string;
  budget: string;
  specialRequests: string;
}

export interface CustomDraft {
  activeFlow: "general" | "engagement" | null;
  generalForm: GeneralForm;
  engagementForm: EngagementForm;
  concepts: Concept[];
  timestamp: number;
}

const DEFAULT_GENERAL_FORM: GeneralForm = {
  pieceType: "",
  metal: "",
  style: "",
  stonePreferences: "",
  budget: "",
  description: "",
};

const DEFAULT_ENGAGEMENT_FORM: EngagementForm = {
  style: "",
  stoneShape: "",
  centerStoneType: "",
  centerStoneSize: "",
  metal: "",
  ringSize: "",
  budget: "",
  specialRequests: "",
};

export function useCustomDraft() {
  const [hasDraft, setHasDraft] = useState(false);
  const [draftData, setDraftData] = useState<CustomDraft | null>(null);
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const isInitialized = useRef(false);

  // Check for existing draft on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (stored) {
        const parsed: CustomDraft = JSON.parse(stored);
        
        // Check if draft has meaningful data (not just empty defaults)
        const hasContent = 
          parsed.activeFlow !== null ||
          parsed.concepts.length > 0 ||
          parsed.generalForm.pieceType !== "" ||
          parsed.engagementForm.style !== "";

        if (hasContent) {
          setDraftData(parsed);
          setHasDraft(true);
          setShowRestoreBanner(true);
        }
      }
    } catch (error) {
      console.error("Error loading draft:", error);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, []);

  // Save draft to localStorage
  const saveDraft = useCallback((draft: CustomDraft) => {
    try {
      const draftToSave = {
        ...draft,
        concepts: [], // Never save concepts to localStorage - they're too large
        timestamp: Date.now(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftToSave));
      setDraftData(draftToSave);
      setHasDraft(true);
    } catch (error) {
      console.warn('Draft save failed:', error);
      // Do nothing - don't crash
    }
  }, []);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setDraftData(null);
      setHasDraft(false);
      setShowRestoreBanner(false);
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  }, []);

  // Dismiss the restore banner without clearing draft
  const dismissBanner = useCallback(() => {
    setShowRestoreBanner(false);
  }, []);

  // Get restore data and dismiss banner
  const restoreDraft = useCallback(() => {
    setShowRestoreBanner(false);
    return draftData;
  }, [draftData]);

  // Discard draft (clear and dismiss)
  const discardDraft = useCallback(() => {
    clearDraft();
  }, [clearDraft]);

  return {
    hasDraft,
    showRestoreBanner,
    draftData,
    saveDraft,
    clearDraft,
    dismissBanner,
    restoreDraft,
    discardDraft,
    DEFAULT_GENERAL_FORM,
    DEFAULT_ENGAGEMENT_FORM,
  };
}
