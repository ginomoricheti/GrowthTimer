import { useState } from 'react';

type Selectable = {
  id: number;
  name: string;
  color?: string;
};

type GenericSelectorProps<T extends Selectable> = {
  label: string;
  items: T[];
  defaultId?: number;
  onChange: (selectedId: number) => void;
};

const Selector = <T extends Selectable>({
  label,
  items,
  defaultId,
  onChange,
}: GenericSelectorProps<T>) => {
  const [selectedId, setSelectedId] = useState<number>(defaultId ?? items[0]?.id ?? 0);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = Number(e.target.value);
    setSelectedId(newId);
    onChange(newId);
  };

  return (
    <label>
      {label}:
      <select value={selectedId} onChange={handleChange}>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Selector;
