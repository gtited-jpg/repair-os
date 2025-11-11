import React, { useMemo } from 'react';
import { Ticket, Employee } from '../types';

interface TechnicianLeaderboardProps {
    tickets: Ticket[];
    employees: Employee[];
}

const TechnicianLeaderboard: React.FC<TechnicianLeaderboardProps> = ({ tickets, employees }) => {
    const leaderboardData = useMemo(() => {
        const techMap: { [key: string]: { count: number, avatar: string } } = {};

        employees.forEach(emp => {
            if (emp.role === 'Technician') {
                techMap[emp.name] = { count: 0, avatar: emp.image_url || '' };
            }
        });

        tickets.forEach(ticket => {
            if (ticket.status === 'Completed' && ticket.assigned_to && techMap[ticket.assigned_to]) {
                techMap[ticket.assigned_to].count += 1;
            }
        });

        return Object.entries(techMap)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5

    }, [tickets, employees]);

    return (
        <div className="space-y-4">
            {leaderboardData.map((tech, index) => (
                <div key={tech.name} className="flex items-center space-x-4">
                    <span className="font-bold text-lg text-dc-text-secondary w-6">#{index + 1}</span>
                    <img src={tech.avatar} alt={tech.name} className="w-10 h-10 rounded-full"/>
                    <div className="flex-1">
                        <p className="font-semibold text-dc-text-primary">{tech.name}</p>
                    </div>
                    <span className="font-bold text-xl text-dc-purple">{tech.count}</span>
                </div>
            ))}
        </div>
    );
};

export default TechnicianLeaderboard;