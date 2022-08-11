// styled from '@/styles/_checkbox.scss';

interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Switch = ({ ...rest }: SwitchProps) => {
  return (
    <span>
      <input type="checkbox" {...rest} />
      <label htmlFor="confirm">Specials anzeigen</label>
    </span>
  );
};

export default Switch;
