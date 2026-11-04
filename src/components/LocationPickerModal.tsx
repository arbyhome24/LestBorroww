import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES_DATA, CountryRegionData } from '../data/countryRegions';
import {
  X,
  Search,
  MapPin,
  Check,
  Navigation,
  Globe,
} from 'lucide-react';

export const LocationPickerModal: React.FC = () => {
  const {
    isLocationPickerOpen,
    setIsLocationPickerOpen,
    currentCity,
    setCurrentCity,
    detectGPSLocation,
    countryCode,
    selectCountry,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  if (!isLocationPickerOpen) return null;

  const currentCountry =
    COUNTRIES_DATA.find((c) => c.code === countryCode) || COUNTRIES_DATA[0];

  const handleSelectCountry = (country: CountryRegionData) => {
    selectCountry(country.code);
    setSearchQuery('');
  };

  const handleSelectCity = (city: string, province?: string) => {
    setCurrentCity(city, province);
    setIsLocationPickerOpen(false);
  };

  const handleGPS = async () => {
    setIsLocating(true);
    await detectGPSLocation();
    setIsLocating(false);
    setIsLocationPickerOpen(false);
  };

  const query = searchQuery.toLowerCase().trim();

  // Filter provinces and cities for the active country
  const filteredProvinces = currentCountry.provinces
    .map((prov) => {
      const matchingCities = prov.cities.filter(
        (c) => c.toLowerCase().includes(query) || prov.name.toLowerCase().includes(query)
      );
      return {
        ...prov,
        cities: matchingCities,
      };
    })
    .filter((prov) => prov.cities.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 shadow-2xl p-5 overflow-hidden animate-in zoom-in-95 my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#B8893C]" />
            <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF]">
              Pilih Kota & Wilayah
            </h3>
          </div>
          <button
            onClick={() => setIsLocationPickerOpen(false)}
            className="p-1 rounded-full text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Button */}
        <button
          onClick={handleGPS}
          disabled={isLocating}
          className="w-full mb-3 p-3 rounded-2xl bg-white dark:bg-[#150E10] border border-[#B8893C] text-xs font-bold text-[#5A1624] dark:text-[#D6AE67] flex items-center justify-center gap-2 hover:bg-[#EFECE8] dark:hover:bg-[#2A1D20] transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          <Navigation className={`w-4 h-4 text-[#B8893C] ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Mendeteksi Lokasi GPS...' : 'Gunakan Lokasi Terkini Saya (GPS)'}</span>
        </button>

        {/* Search Combobox Input */}
        <div className="relative mb-3 shrink-0">
          <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={currentCountry.searchPlaceholder}
            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] focus:border-[#B8893C] focus:outline-none"
          />
        </div>

        {/* Baris Chip Negara (Bendera + Nama, Geser ke Samping, Aksen Maroon-Emas) */}
        <div className="mb-3 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            {COUNTRIES_DATA.map((country) => {
              const isSelected = countryCode === country.code;
              return (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelectCountry(country)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#5A1624] text-[#F7F3EC] border border-[#B8893C] shadow-xs'
                      : 'bg-white dark:bg-[#150E10] text-[#6B6B6B] dark:text-[#B09F94] border border-[#E5E5E5] dark:border-[#3A2A2E] hover:border-[#B8893C]/50 hover:text-[#111111] dark:hover:text-[#F5ECDF]'
                  }`}
                >
                  <span className="text-sm leading-none">{country.flag}</span>
                  <span>{country.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cities List */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1 text-xs">
          {/* Top Option: "Semua Kota" for current country with gold check if active */}
          <div
            onClick={() => handleSelectCity('Semua Kota', currentCountry.name)}
            className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              currentCity === 'Semua Kota'
                ? 'border-[#B8893C] bg-[#5A1624]/10 dark:bg-[#C2566B]/20 text-[#5A1624] dark:text-[#D6AE67] font-bold'
                : 'border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] hover:border-[#B8893C]/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#B8893C]" />
              <span>{currentCountry.allCitiesLabel}</span>
            </div>
            {currentCity === 'Semua Kota' && (
              <Check className="w-4 h-4 text-[#B8893C] stroke-[3]" />
            )}
          </div>

          {/* Grouped Provinces / Regions for Selected Country */}
          {filteredProvinces.length > 0 ? (
            filteredProvinces.map((prov) => (
              <div key={prov.id} className="space-y-1">
                <span className="text-[10px] font-bold text-[#B8893C] tracking-wider uppercase px-1">
                  {prov.name}
                </span>

                <div className="space-y-1">
                  {prov.cities.map((city) => {
                    const isSelected = currentCity === city;
                    return (
                      <div
                        key={city}
                        onClick={() => handleSelectCity(city, prov.name)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#B8893C] bg-[#5A1624]/10 dark:bg-[#C2566B]/20 text-[#5A1624] dark:text-[#D6AE67] font-bold'
                            : 'border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] hover:border-[#B8893C]/30'
                        }`}
                      >
                        <span>{city}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#B8893C] stroke-[3]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-[#6B6B6B] dark:text-[#B09F94]">
              Tidak ada kota atau wilayah yang cocok dengan "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
