import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Project, Goal, Category } from '@/shared/types'
import './EndSessionPopup.module.css'

type EndSessionPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    project: Project;
    goal: Goal;
    category: Category;
  }) => void;
  projects: (Project & { goals: Goal[] })[];
  categories: Category[];
};

const EndSessionPopup = ({
  isOpen,
  onClose,
  onConfirm,
  projects,
  categories,
}: EndSessionPopupProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedProject(null);
      setSelectedGoal(null);
      setSelectedCategoryCode('');
    }
  }, [isOpen]);

  const selectedCategory = categories.find(cat => cat.code === selectedCategoryCode) || null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-[#2e2e2e] text-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-6">
          <Dialog.Title className="text-xl font-semibold">End session</Dialog.Title>

          {/* Proyecto */}
          <div>
            <label className="block text-sm font-medium mb-1">Projects</label>
            <select
              className="w-full bg-[#1f1f1f] text-white rounded p-2"
              value={selectedProject?.code || ''}
              onChange={(e) => {
                const project = projects.find(p => p.code === e.target.value) || null;
                setSelectedProject(project);
                setSelectedGoal(null);
              }}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.code} value={project.code}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Objetivo */}
          <div>
            <label className="block text-sm font-medium mb-1">Goals</label>
            <select
              className="w-full bg-[#1f1f1f] text-white rounded p-2"
              value={selectedGoal?.code || ''}
              onChange={(e) => {
                const goal = selectedProject?.goals?.find(g => g.code === e.target.value) || null;
                setSelectedGoal(goal);
              }}
              disabled={!selectedProject}
            >
              <option value="">Select a goal</option>
              {selectedProject?.goals?.map((goal) => (
                <option key={goal.code} value={goal.code}>
                  {goal.name}
                </option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium mb-1">Type of Work</label>
            <select
              className="w-full bg-[#1f1f1f] text-white rounded p-2"
              value={selectedCategoryCode}
              onChange={(e) => setSelectedCategoryCode(e.target.value)}
            >
              <option value="">Select a tag</option>
              {categories.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded hover:border-2 hover:border-b-neutral-50 hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-white text-white rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedProject || !selectedGoal || !selectedCategory}
              onClick={() => {
                if (selectedProject && selectedGoal && selectedCategory) {
                  onConfirm({ project: selectedProject, goal: selectedGoal, category: selectedCategory });
                  onClose();
                }
              }}
            >
              Confirm
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EndSessionPopup;
