import React from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface KPIStatCardProps {
  icon: string;
  title: string;
  value: string;
  iconBgColor?: string;
}

const KPIStatCard: React.FC<KPIStatCardProps> = ({ icon, title, value, iconBgColor = 'bg-dc-purple/20' }) => {
  
  const getIconColor = () => {
    if (iconBgColor.includes('green')) return 'text-green-300';
    if (iconBgColor.includes('teal')) return 'text-teal-300';
    if (iconBgColor.includes('amber')) return 'text-amber-300';
    return 'text-dc-purple';
  }

  return (
    <Panel className="p-5 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${iconBgColor}`}>
        <Icon name={icon} className={`w-6 h-6 ${getIconColor()}`} />
      </div>
      <div>
        <p className="text-sm text-dc-text-secondary font-medium">{title}</p>
        <p className="text-2xl font-bold text-dc-text-primary">{value}</p>
      </div>
    </Panel>
  );
};

export default KPIStatCard;
