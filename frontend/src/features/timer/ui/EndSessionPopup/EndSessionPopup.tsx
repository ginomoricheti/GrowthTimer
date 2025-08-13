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
    task: TaskGet;
    categoryId: number;
  }) => void;
  projects: ProjectGet[];
  categories: CategoryGet[];
};

const EndSessionPopup = ({
  isOpen,
  onClose,
  onConfirm,
  projects,
  categories,
}: EndSessionPopupProps) => {
  const [selectedProject, setSelectedProject] = useState<ProjectGet | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<GoalGet | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskGet | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setSelectedProject(null);
      setSelectedGoal(null);
      setSelectedTask(null);
      setSelectedCategoryId(0);
    }
  }, [isOpen]);

  const availableTasks: TaskGet[] =
    selectedProject?.pomodoroRecords
      .map((record) => record.task)
      .filter((t): t is TaskGet => t !== undefined) ?? [];

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
              setSelectedTask(null);
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
              setSelectedTask(null);
            }}
            creatable={false}
          />

          <SelectorCreatable
            label="Task"
            items={availableTasks}
            defaultId={selectedTask?.id || 0}
            mapItem={(task) => ({
              value: task.id,
              label: task.name
            })}
            onChange={(id) => {
              const task = availableTasks.find(t => t.id === id) || null;
              setSelectedTask(task);
            }}
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
              disabled={!selectedProject || !selectedGoal || !selectedTask || !selectedCategoryId}
              onClick={() => {
                if (selectedProject && selectedGoal && selectedTask && selectedCategoryId) {
                  onConfirm({
                    project: selectedProject,
                    goal: selectedGoal,
                    task: selectedTask,
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
