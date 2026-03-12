'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineClipboardCheck,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineFlag,
  HiOutlineTag,
  HiOutlineAnnotation,
  HiOutlinePaperClip,
} from 'react-icons/hi';

interface TaskForm {
  title: string;
  description: string;
  assignee: string;
  priority: string;
  status: string;
  dueDate: string;
  category: string;
  estimatedHours: string;
  tags: string;
}

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TaskForm>({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    category: '',
    estimatedHours: '',
    tags: '',
  });

  const updateField = (field: keyof TaskForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call (replace with real API when backend supports tasks)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Task created successfully!');
      router.push('/tasks');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      category: '',
      estimatedHours: '',
      tags: '',
    });
  };

  // Mock team members for assignee dropdown
  const teamMembers = [
    { id: '1', name: 'Jane Agent' },
    { id: '2', name: 'John Manager' },
    { id: '3', name: 'System Admin' },
    { id: '4', name: 'Bob Customer' },
  ];

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/tasks')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition mb-2"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Tasks
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineCheckCircle className="w-7 h-7 text-indigo-600" />
            Create New Task
          </h1>
          <p className="text-gray-500 mt-1">
            Define a new task and assign it to a team member
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Information */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineClipboardCheck className="w-5 h-5 text-indigo-500" />
            Task Information
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., Review new lead applications"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe what needs to be done in detail..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={form.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition appearance-none bg-white"
                  >
                    <option value="">Select category</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="support">Support</option>
                    <option value="operations">Operations</option>
                    <option value="documentation">Documentation</option>
                    <option value="research">Research</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tags
                </label>
                <div className="relative">
                  <HiOutlinePaperClip className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => updateField('tags', e.target.value)}
                    placeholder="e.g., urgent, client-facing"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment & Scheduling */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineUser className="w-5 h-5 text-indigo-500" />
            Assignment & Scheduling
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Assign To <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={form.assignee}
                  onChange={(e) => updateField('assignee', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition appearance-none bg-white"
                >
                  <option value="">Select team member</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Due Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                  required
                  min={today}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Estimated Hours
              </label>
              <input
                type="number"
                value={form.estimatedHours}
                onChange={(e) => updateField('estimatedHours', e.target.value)}
                placeholder="e.g., 4"
                min="0.5"
                step="0.5"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition"
              />
            </div>
          </div>
        </div>

        {/* Status & Priority */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineFlag className="w-5 h-5 text-indigo-500" />
            Status & Priority
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    value: 'todo',
                    label: 'To Do',
                    icon: '📋',
                    activeColor: 'border-blue-400 bg-blue-50 text-blue-700',
                  },
                  {
                    value: 'in_progress',
                    label: 'In Progress',
                    icon: '🔄',
                    activeColor: 'border-amber-400 bg-amber-50 text-amber-700',
                  },
                  {
                    value: 'done',
                    label: 'Done',
                    icon: '✅',
                    activeColor: 'border-emerald-400 bg-emerald-50 text-emerald-700',
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('status', opt.value)}
                    className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 text-xs font-semibold transition
                      ${
                        form.status === opt.value
                          ? opt.activeColor
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    value: 'low',
                    label: 'Low',
                    icon: '🟢',
                    activeColor: 'border-green-400 bg-green-50 text-green-700',
                  },
                  {
                    value: 'medium',
                    label: 'Medium',
                    icon: '🟡',
                    activeColor: 'border-amber-400 bg-amber-50 text-amber-700',
                  },
                  {
                    value: 'high',
                    label: 'High',
                    icon: '🔴',
                    activeColor: 'border-red-400 bg-red-50 text-red-700',
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('priority', opt.value)}
                    className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 text-xs font-semibold transition
                      ${
                        form.priority === opt.value
                          ? opt.activeColor
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        {form.title && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
            <h3 className="text-sm font-semibold text-indigo-900 mb-3">Task Preview</h3>
            <div className="bg-white rounded-xl p-4 border border-indigo-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900">{form.title}</p>
                  {form.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{form.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {form.assignee && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                        <HiOutlineUser className="w-3 h-3" />
                        {form.assignee}
                      </span>
                    )}
                    {form.dueDate && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                        <HiOutlineCalendar className="w-3 h-3" />
                        {new Date(form.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    {form.estimatedHours && (
                      <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                        {form.estimatedHours}h estimated
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${form.status === 'todo' ? 'bg-blue-100 text-blue-700' :
                        form.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'}`
                      }
                    >
                      {form.status === 'in_progress' ? 'In Progress' : form.status}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${form.priority === 'low' ? 'bg-green-100 text-green-700' :
                        form.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'}`
                      }
                    >
                      {form.priority}
                    </span>
                    {form.category && (
                      <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium capitalize">
                        {form.category}
                      </span>
                    )}
                  </div>
                  {form.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {form.tags.split(',').map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-lg"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
          <button
            type="button"
            onClick={() => router.push('/tasks')}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium order-3 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium order-2"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <HiOutlineCheckCircle className="w-4 h-4" />
                Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}