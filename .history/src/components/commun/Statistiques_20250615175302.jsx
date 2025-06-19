import React from 'react';
import { Smile, UserCheck, CalendarCheck } from 'lucide-react';

const stats = [
  { icon: <UserCheck className="h-6 w-6 text-indigo-600" />, label: 'Utilisateurs', value: '1 200+' },
  { icon: <CalendarCheck className="h-6 w-6 text-indigo-600" />, label: 'Consultations', value: '850+' },
  { icon: <Smile className="h-6 w-6 text-indigo-600" />, label: 'Satisfaction', value: '98%' },
];

const Statistiques = () => {
  return (
    <section className="mt-16 max-w-4xl mx-auto bg-indigo-50 rounded-xl py-10 px-6 shadow-sm">
      <div className="grid md:grid-cols-3 gap-6 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            {stat.icon}
            <h4 className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</h4>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistiques;
