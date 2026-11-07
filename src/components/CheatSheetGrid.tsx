import { CheatSheetCard } from './CheatSheetCard';
import { cheatSheets } from '../data/cheatSheets';
import { useMemo } from 'react';
import { cheatSheetCategories } from '../config';

interface CheatSheetGridProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
}

export function CheatSheetGrid({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
}: CheatSheetGridProps) {
  /**
   * Filter cheat sheets by category and search query.
   * Memoized to avoid unnecessary re-computation.
   */
  const filteredSheets = useMemo(() => {
    return cheatSheets.filter(sheet => {
      const categoryMatch = selectedCategory === 'all' || sheet.category === selectedCategory;
      const searchQuery_lower = searchQuery.toLowerCase();

      const searchMatch =
        !searchQuery ||
        sheet.title.toLowerCase().includes(searchQuery_lower) ||
        sheet.description.toLowerCase().includes(searchQuery_lower) ||
        sheet.tags.some(tag => tag.toLowerCase().includes(searchQuery_lower));

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Cheat Sheets</h3>

      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {cheatSheetCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-all font-medium ${
              selectedCategory === category.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
            aria-pressed={selectedCategory === category.id}
          >
            {category.label}
          </button>
        ))}
      </div>

      <>
          {/* Results counter */}
          <p className="text-slate-600 mb-6 text-sm">
            {filteredSheets.length} cheat sheet{filteredSheets.length !== 1 ? 's' : ''}
          </p>

          {/* Cheat sheets grid */}
          {filteredSheets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSheets.map(sheet => (
                <CheatSheetCard key={sheet.id} sheet={sheet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500 text-lg mb-2">No cheat sheets found</p>
              <p className="text-slate-400 text-sm">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
      </>
    </div>
  );
}