import React from 'react';
import { useTheme, THEME_PRESETS, ThemePreset } from '@/context/ThemeContext';
import { Popover } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Palette, Sun, Moon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ThemePicker: React.FC = () => {
  const { preset, sidebarStyle, mode, setPreset, setSidebarStyle, setMode } = useTheme();

  return (
    <Popover
      trigger={
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Palette className="h-3.5 w-3.5 text-brand" />
          <span className="hidden sm:inline">Bảng màu</span>
        </Button>
      }
      align="end"
      className="w-80 p-4 space-y-4"
    >
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Bảng màu chủ đạo (Theme Palette)
        </h4>
        <p className="text-[11px] text-slate-400 mb-3">Tùy chỉnh tông màu chính của hệ thống Admin CRM</p>

        <div className="grid grid-cols-1 gap-2">
          {THEME_PRESETS.map((p) => {
            const isSelected = preset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.id as ThemePreset)}
                className={cn(
                  'w-full flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all',
                  isSelected
                    ? 'border-brand bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-4 w-4 rounded-full shrink-0 shadow-xs border border-white dark:border-slate-700"
                    style={{ backgroundColor: p.primaryColor }}
                  />
                  <span>{p.name}</span>
                </div>
                {isSelected && <Check className="h-4 w-4 text-brand shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Thanh Menu bên (Sidebar Style)
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setSidebarStyle('light')}
            className={cn(
              'p-2 rounded-lg border text-center font-medium transition-all',
              sidebarStyle === 'light'
                ? 'border-brand bg-white text-slate-900 shadow-2xs font-bold'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
            )}
          >
            ☀️ Sidebar Sáng
          </button>
          <button
            type="button"
            onClick={() => setSidebarStyle('dark')}
            className={cn(
              'p-2 rounded-lg border text-center font-medium transition-all',
              sidebarStyle === 'dark'
                ? 'border-brand bg-slate-900 text-white shadow-2xs font-bold'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
            )}
          >
            🌙 Sidebar Tối
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Giao diện chung (Mode)
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode('light')}
            className={cn(
              'flex items-center justify-center gap-1.5 p-2 rounded-lg border font-medium transition-all',
              mode === 'light'
                ? 'border-brand bg-slate-100 text-slate-900 font-bold'
                : 'border-slate-200 dark:border-slate-800 text-slate-500'
            )}
          >
            <Sun className="h-3.5 w-3.5 text-amber-500" /> Sáng
          </button>
          <button
            type="button"
            onClick={() => setMode('dark')}
            className={cn(
              'flex items-center justify-center gap-1.5 p-2 rounded-lg border font-medium transition-all',
              mode === 'dark'
                ? 'border-brand bg-slate-800 text-white font-bold'
                : 'border-slate-200 dark:border-slate-800 text-slate-500'
            )}
          >
            <Moon className="h-3.5 w-3.5 text-indigo-400" /> Tối
          </button>
        </div>
      </div>
    </Popover>
  );
};
