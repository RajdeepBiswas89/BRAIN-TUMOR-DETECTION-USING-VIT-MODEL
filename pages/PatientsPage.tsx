
import React from 'react';
import { Search, Filter, Plus, MoreVertical, FileText, Calendar } from 'lucide-react';

const patients = [
  { id: 'PAT-001', name: 'John Doe', age: 45, status: 'Critical', lastScan: '2024-05-12' },
  { id: 'PAT-002', name: 'Sarah Smith', age: 32, status: 'Normal', lastScan: '2024-05-14' },
  { id: 'PAT-003', name: 'Michael Brown', age: 61, status: 'Under Treatment', lastScan: '2024-05-10' },
  { id: 'PAT-004', name: 'Elena Rodriguez', age: 29, status: 'Normal', lastScan: '2024-04-28' },
  { id: 'PAT-005', name: 'David Wilson', age: 54, status: 'Critical', lastScan: '2024-05-01' },
];

const PatientsPage: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A2463]">Patients Repository</h1>
          <p className="text-gray-500 mt-1">Manage patient medical records and diagnostic history.</p>
        </div>
        <button className="px-6 py-3 bg-[#0A2463] text-white rounded-xl font-bold hover:bg-[#0A2463]/90 shadow-lg shadow-blue-900/10 flex items-center gap-2 transition-all">
          <Plus size={20} /> Add New Patient
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, ID or status..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/20"
            />
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 flex items-center gap-2 hover:bg-gray-50">
              <Filter size={18} /> Filters
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 flex items-center gap-2 hover:bg-gray-50">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Patient Info</th>
                <th className="px-6 py-4">Age/Gender</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last MRI Scan</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-[#0A2463] rounded-lg flex items-center justify-center font-bold">
                        {p.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{p.name}</p>
                        <p className="text-xs font-mono text-gray-400">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-semibold text-gray-700">{p.age} Years</p>
                      <p className="text-xs text-gray-400">Male</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      p.status === 'Critical' ? 'bg-red-50 text-red-600' :
                      p.status === 'Under Treatment' ? 'bg-orange-50 text-orange-600' :
                      'bg-teal-50 text-[#2A9D8F]'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} /> {p.lastScan}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#0A2463] hover:bg-gray-100 rounded-lg transition-all">
                        <FileText size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#0A2463] hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <p>Showing 1 to 5 of 124 patients</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Prev</button>
            <button className="px-3 py-1 bg-[#0A2463] text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;
