import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useGoals } from '@/shared/context/GoalsContext';
import { useProjects } from '@/shared/context/ProjectsContext';

type CreateGoalPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateGoalPopup = ({ isOpen, onClose }: CreateGoalPopupProps) => {
  const { createGoal } = useGoals();
  const { projects, fetchProjects } = useProjects();
  const [title, setTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [targetHours, setTargetHours] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Reset fields on open/close popup
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setTargetHours(0);
      setSelectedProjectId(projects.length > 0 ? projects[0].id : null);
    }
  }, [isOpen, projects]);

  useEffect(() => {
    if (projects.length > 0 && selectedProjectId === null) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    if (projects.length === 0) {
      setLoading(true);
      fetchProjects().finally(() => setLoading(false));
    }
  }, [projects, fetchProjects]);

  const handleConfirm = async () => {
    if (!selectedProjectId || targetHours <= 0 || !title) return;

    await createGoal({
      title,
      idProject: selectedProjectId,
      targetMinutes: targetHours * 60,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-[#2e2e2e] text-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-6">
          <Dialog.Title className="text-xl font-semibold">Create Goal</Dialog.Title>

          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded p-2  text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Project */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Project</label>
            <select
              value={selectedProjectId ?? ''}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              disabled={loading || projects.length === 0}
              className="w-full rounded p-2  text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className=" text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Hours */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Target Hours</label>
            <input
              type="number"
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              className="w-full rounded p-2  text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
              min={0}
              step={0.1}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-white rounded text-black hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title || !selectedProjectId || targetHours <= 0 || loading}
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateGoalPopup;
