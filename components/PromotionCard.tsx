import React from 'react';
import { Promotion } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface PromotionCardProps {
    promotion: Promotion;
}

const statusStyles = {
    Active: 'bg-green-500/20 text-green-300',
    Scheduled: 'bg-blue-500/20 text-blue-300',
    Expired: 'bg-gray-500/20 text-gray-400'
};

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
    return (
        <Panel className="p-5 flex flex-col space-y-4">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-dc-text-primary">{promotion.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[promotion.status]}`}>
                    {promotion.status}
                </span>
            </div>
            <p className="text-sm text-dc-text-secondary flex-1">{promotion.description}</p>
            <div className="text-2xl font-bold text-dc-purple text-center py-2 bg-dc-input rounded-lg">
                {promotion.type === 'percentage' ? `${promotion.value}% OFF` : `$${promotion.value.toFixed(2)} OFF`}
            </div>
            <div className="text-xs text-dc-text-secondary border-t border-dc-border pt-3 space-y-2">
                <div className="flex justify-between">
                    <span className="font-semibold">Duration:</span>
                    <span>{promotion.startDate} to {promotion.endDate}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="font-semibold flex items-center gap-1"><Icon name="cursor-click" className="w-3 h-3"/> Clicks:</span>
                    <span>{promotion.clicks}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold flex items-center gap-1"><Icon name="shopping-cart" className="w-3 h-3"/> Conversions:</span>
                    <span>{promotion.conversions}</span>
                </div>
            </div>
        </Panel>
    );
};

export default PromotionCard;