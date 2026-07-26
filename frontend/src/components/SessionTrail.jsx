import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { key: 'browse', label: 'Browse', fullLabel: 'Browse Items' },
  { key: 'product_detail', label: 'Details', fullLabel: 'View Item Details' },
  { key: 'cart', label: 'Cart', fullLabel: 'Add to Cart' },
  { key: 'checkout', label: 'Order', fullLabel: 'Place Order' },
];

export default function SessionTrail({ currentStepKey }) {
  const currentIndex = STEPS.findIndex((step) => step.key === currentStepKey);
  const activeStep = STEPS[currentIndex];

  return (
    <div className="surface-card px-4 py-5 sm:px-6 sm:py-6 md:px-8 rounded-xl shadow-sm border border-white/5">
      {/* Changed parent alignment to items-start to lock the timeline elements row vertically */}
      <div className="flex items-start justify-between w-full">
        {STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isActive = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <React.Fragment key={step.key}>
              {/* Flex-1 gives equal layout distribution, items-center horizontally balances icons */}
              <div className="flex flex-col items-center flex-1 relative min-w-[70px] sm:min-w-[120px]">
                
                {/* Step Circle */}
                <div
                  className={[
                    'flex h-7 w-7 items-center justify-center rounded-full border text-[10px] transition-all duration-500 sm:h-8 sm:w-8 sm:text-xs font-semibold tracking-wider',
                    isComplete && 'border-orange bg-orange text-white',
                    isActive && 'border-navy bg-navy text-white shadow-md shadow-navy/10',
                    isFuture && 'border-gray-300 bg-white text-gray-400',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {isComplete ? <Check size={13} strokeWidth={2.5} /> : String(index + 1).padStart(2, '0')}
                </div>

                {/* Step Labels with high-contrast font colors */}
                <span
                  className={[
                    'mt-2.5 whitespace-nowrap text-[9px] sm:text-[11px] font-medium tracking-wide font-sans text-center',
                    isActive ? 'text-navy font-bold' : isComplete ? 'text-orange' : 'text-gray-500', 
                  ].join(' ')}
                >
                  <span className="hidden sm:inline">{step.fullLabel}</span>
                  <span className="sm:hidden">{step.label}</span>
                </span>
              </div>

              {/* Seamless Connecting Line */}
              {index < STEPS.length - 1 && (
                <div className="hidden sm:flex items-center flex-1 h-8"> 
                  <div
                    className={[
                      'h-[2px] w-full transition-all duration-700 rounded-full',
                      index < currentIndex ? 'bg-orange' : 'bg-gray-200',
                    ].join(' ')}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {activeStep && (
        <p className="mt-4 text-center text-xs text-gray-500 sm:hidden">
          Currently on: <span className="font-semibold text-navy">{activeStep.fullLabel}</span>
        </p>
      )}
    </div>
  );
}