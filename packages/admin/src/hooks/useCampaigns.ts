import { useState, useCallback } from 'react';
import { DEMO_CAMPAIGNS, DEMO_CAMPAIGN_ENTRIES } from '../data/demoData';
import type { Campaign, CampaignEntry } from '@rco/shared';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(DEMO_CAMPAIGNS);
  const [loading] = useState(false);

  const addCampaign = useCallback(
    async (data: Partial<Campaign>) => {
      const id = `camp-${Date.now()}`;
      const newCampaign: Campaign = {
        id,
        type: data.type || 'rockstar',
        title: data.title || '',
        month: data.month || '',
        year: data.year || new Date().getFullYear(),
        isActive: false,
        displayOrder: campaigns.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: 'demo',
      };
      setCampaigns((prev) => [...prev, newCampaign]);
      console.log('[Demo] Added campaign:', newCampaign.title);
      return id;
    },
    [campaigns.length]
  );

  const updateCampaign = useCallback(
    async (id: string, data: Partial<Campaign>) => {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c))
      );
      console.log('[Demo] Updated campaign:', id);
    },
    []
  );

  const deleteCampaign = useCallback(async (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    console.log('[Demo] Deleted campaign:', id);
  }, []);

  const toggleActive = useCallback(
    async (id: string, isActive: boolean) => {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive } : c))
      );
      console.log('[Demo] Toggled campaign:', id, 'active:', isActive);
    },
    []
  );

  return { campaigns, loading, addCampaign, updateCampaign, deleteCampaign, toggleActive };
}

export function useCampaignEntries(campaignId: string | null, _campaign?: Campaign | null) {
  const initialEntries = campaignId ? (DEMO_CAMPAIGN_ENTRIES[campaignId] || []) : [];
  const [entries, setEntries] = useState<CampaignEntry[]>(initialEntries);
  const [loading] = useState(false);

  const addEntry = useCallback(
    async (data: Partial<CampaignEntry>) => {
      if (!campaignId) return;
      const newEntry: CampaignEntry = {
        id: `entry-${Date.now()}`,
        employeeRef: data.employeeRef || '',
        employeeName: data.employeeName || '',
        employeeTitle: data.employeeTitle || '',
        employeeTenure: data.employeeTenure || '',
        employeeInitials: data.employeeInitials || '',
        photoUrl: data.photoUrl || null,
        quote: data.quote || '',
        badgeText: data.badgeText || '',
        isVisible: true,
        displayOrder: entries.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setEntries((prev) => [...prev, newEntry]);
      console.log('[Demo] Added entry:', newEntry.employeeName);
    },
    [campaignId, entries.length]
  );

  const updateEntry = useCallback(
    async (entryId: string, data: Partial<CampaignEntry>) => {
      setEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, ...data } : e))
      );
      console.log('[Demo] Updated entry:', entryId);
    },
    []
  );

  const deleteEntry = useCallback(
    async (entryId: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
      console.log('[Demo] Deleted entry:', entryId);
    },
    []
  );

  return { entries, loading, addEntry, updateEntry, deleteEntry };
}
