// styled from '@/styles/_checkbox.scss';

interface SwitchProps {
  id: string;
  checked: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}

const Switch = ({ id, label, checked, onChange, ...rest }: SwitchProps) => {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) onChange(e.target.checked);
  }

  return (
    <div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        {...rest}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Switch;
