import { Select } from '../../elements/Forms';
import { el } from '../../lib/Html';
import { getTheme, setTheme } from '../../lib/Theme';

export const ThemePicker = (): HTMLSelectElement => {
  const selectedItem: string = getTheme();
  function handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    if (target.value === 'light') setTheme('light');
    if (target.value === 'dark') setTheme('dark');
    window.location.reload();
  }
  return Select({
    onChange: handleChange,
    options: [
      el('option', ['value', 'light'], ['selected', selectedItem === 'light'])('Light'),
      el('option', ['value', 'dark'], ['selected', selectedItem === 'dark'])('Dark'),
    ],
  });
};
