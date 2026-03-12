'use client';

import { useState } from 'react';
import Link from 'next/link';
import PermissionGate from '@/components/PermissionGate';
import { HiOutlinePlus, HiOutlineCheckCircle } from 'react-icons/hi';

interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
}

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Review new lead applications', assignee: 'Jane Agent', priority: 'high', status: 'in_progress', dueDate: '2024-01-20' },
  { id: '2', title: 'Update client documentation', assignee: 'Jane Agent', priority: 'medium', status: 'todo', dueDate: '2024-01-22' },
  { id: '3', title: 'Prepare quarterly report', assignee: 'John Manager', priority: 'high', status: 'todo', dueDate: '2024-01-25' },
  { id: '4', title: 'Follow up with Acme Corp', assignee: 'Jane Agent', priority: 'low', status: 'done', dueDate: '2024-01-18' },
];

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export default function TasksPage() {
  const [tasks] = useState<Task[]>(MOCK_TASKS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineCheckCircle className="w-7 h-7 text-indigo-600" />
            Tasks
          </h1>
          <p className="text-gray-500 mt-1">{tasks.length} total tasks</p>
        </div>
        <PermissionGate permission="tasks:create">
          <Link
            href="/tasks/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium"
          >
            <HiOutlinePlus className="w-4 h-4" />
            New Task
          </Link>
        </PermissionGate>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['todo', 'in_progress', 'done'].map((status) => (
          <div key={status} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              {statusLabels[status]} ({tasks.filter((t) => t.status === status).length})
            </h3>
            <div className="space-y-3">
              {tasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition"
                  >
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{task.assignee}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Due: {task.dueDate}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}