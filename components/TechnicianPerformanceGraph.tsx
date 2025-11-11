import React, { useMemo } from 'react';
import type { Ticket, Employee } from '../types';

interface TechnicianPerformanceGraphProps {
  tickets: Ticket[];
  employees: Employee[];
}

const TechnicianPerformanceGraph: React.FC<TechnicianPerformanceGraphProps> = ({ tickets, employees }) => {
  const techPerformance = useMemo(() => {
    const techs = employees.filter(e => e.role === 'Technician');
    return techs.map(tech => {
      const completedTickets = tickets.filter(
        // FIX: Corrected property name from assignedTo to assigned_to to match the Ticket type.
        t => t.assigned_to === tech.name && t.status === 'Completed'
      ).length;
      return { name: (tech.name || '').split(' ')[0], completed: completedTickets };
    }).sort((a, b) => b.completed - a.completed);
  }, [tickets, employees]);

  const maxCompleted = Math.max(...techPerformance.map(t => t.completed), 1); // Avoid division by zero

  return (
    <div className="space-y-3 pr-2">
      {techPerformance.map((tech, index) => (
        <div key={index} className="flex items-center space-x-3">
          <span className="w-20 text-sm text-dc-text-secondary truncate">{tech.name}</span>
          <div className="flex-1 bg-dc-input rounded-full h-4">
            <div
              className="bg-dc-purple h-4 rounded-full flex items-center justify-end px-2"
              style={{ width: `${(tech.completed / maxCompleted) * 100}%` }}
            >
              <span className="text-xs font-bold text-white">{tech.completed}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechnicianPerformanceGraph;