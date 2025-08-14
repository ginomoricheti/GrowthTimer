import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useProjects } from '@/shared/context/ProjectsContext';
import { useCategories } from '@/shared/context/CategoryContext';

const CreateProjectPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { createProject } = useProjects();
  const { categories } = useCategories(); // obtenemos las categorías desde el context
  
  const [name, setName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [color, setColor] = useState('#3b82f6');

  const predefinedColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#f97316', '#ec4899', '#06b6d4',
    '#84cc16', '#6366f1', '#ef4444', '#14b8a6'
  ];

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setSelectedCategoryId(categories.length > 0 ? categories[0].id : 0);
      setColor('#3b82f6');
    }
  }, [isOpen, categories]);

  const handleConfirm = async () => {
    await createProject({
      name,
      idCategory: selectedCategoryId,
      color,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-[#2e2e2e] text-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-6">
          <Dialog.Title className="text-xl font-semibold">Create Project</Dialog.Title>

          {/* Nombre del proyecto */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full rounded p-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Category</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              className="w-full rounded p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-gray-700 text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color del proyecto */}
          <div>
            <label className="block mb-2 text-sm font-medium text-white">Project Color</label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-8 rounded border-2 border-gray-600 bg-transparent cursor-pointer"
                />
                <span className="text-sm text-gray-300">Custom color: {color}</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {predefinedColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    onClick={() => setColor(presetColor)}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      color === presetColor 
                        ? 'border-white shadow-lg scale-110' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: presetColor }}
                    title={presetColor}
                  />
                ))}
              </div>
            </div>
          </div>


          {/* Vista previa del color */}
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border border-gray-600" style={{ backgroundColor: color }} />
              <span className="text-sm text-gray-300">Preview: {name || 'Project Name'}</span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-white rounded text-black hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!name.trim() || !selectedCategoryId}
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

export default CreateProjectPopup;
