import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ProjectGet, GoalGet, CategoryGet, TaskGet } from '@/shared/types';
import SelectorCreatable from '../Selector/SelectorCreatable';

type EndSessionPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    project: ProjectGet;
    goal: GoalGet;
    task: number;
    categoryId: number;
  }) => void;
  projects: ProjectGet[];
  categories: CategoryGet[];
  tasks: TaskGet[];
};

const EndSessionPopup = ({
  isOpen,
  onClose,
  onConfirm,
  projects,
  categories,
  tasks,
}: EndSessionPopupProps) => {
  const [selectedProject, setSelectedProject] = useState<ProjectGet | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<GoalGet | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number>(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setSelectedProject(null);
      setSelectedGoal(null);
      setSelectedTaskId(0);
      setSelectedCategoryId(0);
    }
  }, [isOpen]);

  const tasksOptions = tasks.map(task => ({
    value: task.id,
    label: task.name,
  }));

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-[#2e2e2e] text-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-6">
          <Dialog.Title className="text-xl font-semibold">End session</Dialog.Title>

          <SelectorCreatable
            label="Projects"
            items={projects}
            defaultId={selectedProject?.id || 0}
            onChange={(id) => {
              const project = projects.find(p => p.id === id) || null;
              setSelectedProject(project);
              setSelectedGoal(null);
              setSelectedTaskId(0);
            }}
            creatable={false}
          />

          <SelectorCreatable
            label="Area of work"
            items={categoryOptions.map(opt => ({
              id: opt.value,
              name: opt.label,
            }))}
            defaultId={selectedCategoryId}
            onChange={(id) => setSelectedCategoryId(id)}
          />

          <SelectorCreatable
            label="Goal"
            items={selectedProject?.goals || []}
            defaultId={selectedGoal?.id || 0}
            mapItem={(goal) => ({
              value: goal.id,
              label: goal.title
            })}
            onChange={(id) => {
              const goal = selectedProject?.goals?.find(g => g.id === id) || null;
              setSelectedGoal(goal);
              setSelectedTaskId(0);
            }}
            creatable={false}
          />

          <SelectorCreatable
            label="Task"
            items={tasksOptions.map(opt => ({
              id: opt.value,
              name: opt.label,
            }))}
            defaultId={selectedTaskId}
            onChange={(id) => setSelectedTaskId(id)}
          />

          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-600 rounded text-white hover:border-2 hover:border-b-neutral-50 hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-white rounded text-black hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedProject || !selectedGoal || !selectedTaskId || !selectedCategoryId}
              onClick={() => {
                if (selectedProject && selectedGoal && selectedTaskId && selectedCategoryId) {
                  onConfirm({
                    project: selectedProject,
                    goal: selectedGoal,
                    task: selectedTaskId,
                    categoryId: selectedCategoryId,
                  });
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
