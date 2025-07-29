import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ProjectGet, Goal, Category } from '@/shared/types';
import { Task } from '@/shared/types/TaskTypes';
import Selector from '../Selector/Selector'; // Asegurate de importar el Selector correctamente
import './EndSessionPopup.module.css';

type EndSessionPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    project: ProjectGet;
    goal: Goal;
    task: Task;
  }) => void;
  projects: ProjectGet[];
  categories: Category[]; // 🔧 Arreglado el tipo
};

const EndSessionPopup = ({
  isOpen,
  onClose,
  onConfirm,
  projects,
  categories,
}: EndSessionPopupProps) => {
  const [selectedProject, setSelectedProject] = useState<ProjectGet | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedProject(null);
      setSelectedGoal(null);
      setSelectedCategoryId(0);
      setSelectedTask(null);
    }
  }, [isOpen]);

  const availableTasks: Task[] =
    selectedProject?.pomodoroRecords
      .map((record) => record.task)
      .filter((t): t is Task => t !== undefined) ?? [];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-[#2e2e2e] text-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-6">
          <Dialog.Title className="text-xl font-semibold">End session</Dialog.Title>

          {/* Projects */}
          <div>
            <label className="block text-sm font-medium mb-1">Projects</label>
            <select
              className="w-full bg-[#1f1f1f] text-white rounded p-2"
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const project = projects.find(p => p.id === Number(e.target.value)) || null;
                setSelectedProject(project);
                setSelectedGoal(null);
                setSelectedTask(null);
              }}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium mb-1">Goals</label>
            <select
              className="w-full bg-[#1f1f1f] text-white rounded p-2"
              value={selectedGoal?.id || ''}
              onChange={(e) => {
                const goal = selectedProject?.goals?.find(g => g.id === Number(e.target.value)) || null;
                setSelectedGoal(goal);
                setSelectedTask(null);
              }}
              disabled={!selectedProject}
            >
              <option value="">Select a goal</option>
              {selectedProject?.goals?.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task - con Selector */}
          {availableTasks.length > 0 && (
            <Selector
              label="Task"
              items={availableTasks}
              defaultId={selectedTask?.id}
              onChange={(id) => {
                const task = availableTasks.find((t) => t.id === id) || null;
                setSelectedTask(task);
              }}
            />
          )}

          {/* Category - con Selector */}
          <Selector
            label="Type of Work"
            items={categories}
            defaultId={selectedCategoryId}
            onChange={(id) => setSelectedCategoryId(id)}
          />

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
              disabled={!selectedProject || !selectedGoal || !selectedTask}
              onClick={() => {
                if (selectedProject && selectedGoal && selectedTask) {
                  onConfirm({
                    project: selectedProject,
                    goal: selectedGoal,
                    task: selectedTask,
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
