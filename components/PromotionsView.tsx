import React, { useState, useEffect } from 'react';
import type { Promotion, Employee } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';
import CampaignBuilderModal from './CampaignBuilderModal';
import PromotionCard from './PromotionCard';

interface PromotionsViewProps {
    addLogEntry: (action: string, details: string) => void;
    currentUser: Employee;
}

const PromotionsView: React.FC<PromotionsViewProps> = ({ addLogEntry, currentUser }) => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);

    useEffect(() => {
        const fetchPromos = async () => {
            setIsLoading(true);
            const data = await api.getPromotions();
            setPromotions(data);
            setIsLoading(false);
        };
        fetchPromos();
    }, []);

    const handleLaunchCampaign = async (campaignData: Omit<Promotion, 'id' | 'clicks' | 'conversions' | 'status'>) => {
        const newPromo = await api.createPromotion({
            ...campaignData,
            organization_id: currentUser.organization_id
        });
        setPromotions(prev => [newPromo, ...prev]);
        addLogEntry('PROMO_LAUNCH', `Launched new campaign: ${newPromo.name}`);
        setIsBuilderOpen(false);
    };
    
    const activePromos = promotions.filter(p => p.status === 'Active');
    const scheduledPromos = promotions.filter(p => p.status === 'Scheduled');
    const expiredPromos = promotions.filter(p => p.status === 'Expired');

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-dc-text-primary">Promotions</h1>
                <button onClick={() => setIsBuilderOpen(true)} className="bg-dc-purple px-4 py-2.5 rounded-lg font-semibold flex items-center space-x-2 hover:bg-dc-purple/80 transition">
                    <Icon name="plus" className="w-5 h-5"/>
                    <span>New Campaign</span>
                </button>
            </div>

            {isLoading ? <p>Loading promotions...</p> : (
                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-dc-text-primary mb-4">Active Campaigns</h2>
                        {activePromos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activePromos.map(promo => <PromotionCard key={promo.id} promotion={promo} />)}
                            </div>
                        ) : <p className="text-dc-text-secondary italic">No active campaigns.</p>}
                    </section>
                     <section>
                        <h2 className="text-xl font-bold text-dc-text-primary mb-4">Scheduled Campaigns</h2>
                        {scheduledPromos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {scheduledPromos.map(promo => <PromotionCard key={promo.id} promotion={promo} />)}
                            </div>
                        ) : <p className="text-dc-text-secondary italic">No scheduled campaigns.</p>}
                    </section>
                     <section>
                        <h2 className="text-xl font-bold text-dc-text-primary mb-4">Past Campaigns</h2>
                        {expiredPromos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {expiredPromos.map(promo => <PromotionCard key={promo.id} promotion={promo} />)}
                            </div>
                        ) : <p className="text-dc-text-secondary italic">No past campaigns.</p>}
                    </section>
                </div>
            )}

            {isBuilderOpen && <CampaignBuilderModal onClose={() => setIsBuilderOpen(false)} onLaunch={handleLaunchCampaign} />}
        </div>
    );
};

export default PromotionsView;