import React from 'react';
import { useLocation } from 'react-router-dom';

type Location = {
  loc_id?: string;
  location_name: string;
  parking_available?: string;
  new_flag?: string;
};

type Theater = {
  theater_id: string;
  theater_name: string;
  theater_cost: string;
  location_name?: string;
  per_persons?: string;
  max_persons?: string;
  decoration_price?: string;
  selected_slot?: string;
};

type Occasion = {
  occasion_id: string;
  occasion_name: string;
  occasion_image_url: string;
  no_of_names: string;
};

type Cake = {
  cake_name: string;
  egg_eggless: 'eggless' | 'egg';
};

type BookingSummaryProps = {
  selectedLocation: Location | null;
  selectedTheater: Theater | null;
  selectedOccasion: Occasion | null;
  selectedCakes?: { cake: Cake; quantity: number; weight: string; price: string }[] | null;
  isVeg?: boolean;
  selectedAddons?: { [key: number]: { addon_name: string; quantity: number } } | null;
  onProceed?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
  isProceedDisabled?: boolean;
};

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedLocation,
  selectedTheater,
  selectedOccasion,
  selectedCakes,
  isVeg,
  selectedAddons,
  onProceed,
  isProceedDisabled,
}) => {
  const location = useLocation();
  const isLocationsPage = location.pathname === '/locations';
  const isTheatersPage = location.pathname === '/theaters';
  const isOccasionsPage = location.pathname === '/occasions';
  const isCakesPage = location.pathname === '/select-cakes';
  const isAddonsPage = location.pathname === '/select-addons';

  const calculateTotalCakePrice = (): number => {
    if (!selectedCakes || selectedCakes.length === 0) return 0;
    return selectedCakes.reduce((total, { quantity, price }) => {
      return total + (parseFloat(price) || 0) * quantity;
    }, 0);
  };

  return (
    <div className="relative w-full max-w-[320px] min-h-[280px] bg-white rounded-xl p-5 shadow-lg text-black overflow-hidden">
      <div className="absolute inset-0 rounded-xl overflow-hidden z-0">
        <div
          className="absolute inset-0 animate-rotate-border-1"
          style={{
            background: 'linear-gradient(var(--angle), #8B5CF6 50%, transparent 50%)',
            mask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
            maskComposite: 'exclude',
            padding: '1px',
            borderRadius: 'inherit',
            // @ts-ignore
            '--angle': '0deg',
          }}
        />
        <div
          className="absolute inset-0 animate-rotate-border-2"
          style={{
            background: 'linear-gradient(var(--angle), #EC4899 50%, transparent 50%)',
            mask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
            maskComposite: 'exclude',
            padding: '1px',
            borderRadius: 'inherit',
            // @ts-ignore
            '--angle': '180deg',
          }}
        />
      </div>

      <style>{`
        @keyframes rotateBorder1 {
          0% { --angle: 0deg; }
          100% { --angle: 360deg; }
        }
        @keyframes rotateBorder2 {
          0% { --angle: 180deg; }
          100% { --angle: 540deg; }
        }
        .animate-rotate-border-1 {
          animation: rotateBorder1 4s linear infinite;
        }
        .animate-rotate-border-2 {
          animation: rotateBorder2 4s linear infinite;
        }
      `}</style>

      <div className="relative z-10">
        <h2 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">
          Booking Summary
        </h2>

        <div className="space-y-3 text-sm">
          {(isLocationsPage || isTheatersPage || isOccasionsPage || isCakesPage || isAddonsPage) && (
            <p>
              <span className="font-medium text-black">Location:</span>{' '}
              {selectedLocation?.location_name ?? <span className="text-gray-500">Not selected</span>}
            </p>
          )}

          {(isTheatersPage || isOccasionsPage || isCakesPage || isAddonsPage) && (
            <>
              <p>
                <span className="font-medium text-black">Theater:</span>{' '}
                {selectedTheater?.theater_name ?? <span className="text-gray-500">Not selected</span>}
              </p>
              <p>
                <span className="font-medium text-black">Slot:</span>{' '}
                {selectedTheater?.selected_slot ?? <span className="text-gray-500">Not selected</span>}
              </p>
            </>
          )}

          {(isOccasionsPage || isCakesPage || isAddonsPage) && (
            <p>
              <span className="font-medium text-black">Occasion:</span>{' '}
              {selectedOccasion?.occasion_name ?? <span className="text-gray-500">Not selected</span>}
            </p>
          )}

          {(isCakesPage || isAddonsPage) && (
            <>
              <div>
                <span className="font-medium text-black">Cakes:</span>{' '}
                {selectedCakes && selectedCakes.length > 0 ? (
                  <ul className="mt-1 space-y-1 text-gray-800">
                    {selectedCakes.map(({ cake, quantity, weight, price }, index) => {
                      const totalPrice = (parseFloat(price) || 0) * quantity;
                      return (
                        <li key={index} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>
                            {cake.cake_name} ({quantity} x {weight}, {cake.egg_eggless}) - ₹{totalPrice.toFixed(2)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <span className="text-gray-500">Not selected</span>
                )}
              </div>
              <p>
                <span className="font-medium text-black">Total Cake Price:</span>{' '}
                {selectedCakes && selectedCakes.length > 0 ? (
                  `₹${calculateTotalCakePrice().toFixed(2)}`
                ) : (
                  <span className="text-gray-500">₹0.00</span>
                )}
              </p>
            </>
          )}

          {isAddonsPage && (
            <p>
              <span className="font-medium text-black">Selected Add-ons:</span>{' '}
              {selectedAddons && Object.keys(selectedAddons).length > 0 ? (
                Object.values(selectedAddons)
                  .map((addon) => `${addon.addon_name} (${addon.quantity})`)
                  .join(', ')
              ) : (
                <span className="text-gray-500">Not selected</span>
              )}
            </p>
          )}
        </div>

        {onProceed && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={onProceed}
              disabled={isProceedDisabled}
              className="bg-indigo-600 text-white text-sm font-medium py-2 px-5 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Proceed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;