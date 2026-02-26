import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PasswordRulesProps {
  password: string;
}

interface Rule {
  label: string;
  test: (pw: string) => boolean;
}

const rules: Rule[] = [
  {
    label: '8 caracteres minimum',
    test: (pw) => pw.length >= 8,
  },
  {
    label: '1 lettre majuscule',
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    label: '1 chiffre',
    test: (pw) => /\d/.test(pw),
  },
  {
    label: '1 caractere special',
    test: (pw) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pw),
  },
];

export function PasswordRules({ password }: PasswordRulesProps) {
  return (
    <div className="space-y-2">
      {rules.map((rule) => {
        const passes = password.length > 0 && rule.test(password);

        return (
          <div key={rule.label} className="flex items-center gap-2">
            {passes ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Circle className="h-4 w-4 text-ink-300" />
            )}
            <span
              className={cn(
                'text-xs transition-colors',
                passes ? 'text-success font-medium' : 'text-ink-500'
              )}
            >
              {rule.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
