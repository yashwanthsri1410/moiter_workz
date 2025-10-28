import useTheme from "../hooks/useTheme";

const ThemeSwitcher = () => {
  const { toggleTheme } = useTheme();
  return (
    <button
      className="text-white w-6 h-6 rounded-md bg-[var(--primary-color)] absolute bottom-0 right-0"
      onClick={toggleTheme}
    ></button>
  );
};

export default ThemeSwitcher;
