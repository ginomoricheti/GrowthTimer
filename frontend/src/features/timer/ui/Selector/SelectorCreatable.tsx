/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

type OptionType = {
  value: number;
  label: string;
  color?: string;
};

type SelectorCreatableProps<T> = {
  label: string;
  items: T[];
  valueId?: number;
  onChange: (selectedId: number, createdLabel?: string) => void;
  mapItem?: (item: T) => OptionType;
  creatable?: boolean;
  isDisabled?: boolean;
};

function SelectorCreatable<T>({
  label,
  items,
  valueId,
  onChange,
  mapItem,
  creatable = true,
  isDisabled = false,
}: SelectorCreatableProps<T>) {
  const options: OptionType[] = useMemo(
    () =>
      items.map(item =>
        mapItem
          ? mapItem(item)
          : { value: (item as any).id, label: (item as any).name, color: (item as any).color }
      ),
    [items, mapItem]
  );

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    () => options.find(opt => opt.value === valueId) || null
  );

  useEffect(() => {
    const newOptions = items.map(item =>
      mapItem
        ? mapItem(item)
        : { value: (item as any).id, label: (item as any).name, color: (item as any).color }
    );

    const found = newOptions.find(opt => opt.value === valueId) || null;
    setSelectedOption(found);
  }, [items, valueId, mapItem]);

  useEffect(() => {
    if (selectedOption) {
      const exists = options.find(opt => opt.value === selectedOption.value);
      if (!exists) {
        setSelectedOption(null);
        onChange(0);
      }
    }
  }, [options, selectedOption, onChange]);

  const handleChange = (newValue: any, actionMeta: any) => {
    if (!newValue) {
      setSelectedOption(null);
      onChange(0);
      return;
    }

    setSelectedOption(newValue);

    if (creatable && actionMeta.action === 'create-option') {
      onChange(-1, newValue.label);
    } else {
      onChange(newValue.value);
    }
  };

  const customStyles = {
    control: (styles: any) => ({ ...styles, backgroundColor: '#1f1f1f', color: 'white' }),
    singleValue: (styles: any) => ({ ...styles, color: 'white' }),
    menu: (styles: any) => ({ ...styles, backgroundColor: '#2e2e2e', zIndex: 9999 }),
    menuPortal: (styles: any) => ({ ...styles, zIndex: 9999 }),
    option: (styles: any, { isFocused }: any) => ({
      ...styles,
      backgroundColor: isFocused ? '#3a3a3a' : '#2e2e2e',
      color: 'white',
    }),
  };

  const SelectComponent = creatable ? CreatableSelect : Select;

  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-white">{label}</label>
      <SelectComponent
        isDisabled={isDisabled}
        isClearable
        options={options}
        value={selectedOption}
        onChange={handleChange}
        styles={customStyles}
        placeholder={creatable
          ? `Select or create ${label.toLowerCase()}`
          : `Select ${label.toLowerCase()}`}
        menuPortalTarget={document.body}
      />
    </div>
  );
}

export default SelectorCreatable;
