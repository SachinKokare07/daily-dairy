import React, { useState, useEffect } from 'react';
import { 
  createEntry, 
  getUserEntries, 
  updateEntry, 
  deleteEntry as deleteEntryFromDB,
  toggleFavorite as toggleFavoriteInDB 
} from '../../firebase/diaryService';
import Toast from '../Toast/Toast';
import logo from '../../assets/logo.png';

const Dashboard = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingEntry, setViewingEntry] = useState(null);
  const [currentEntry, setCurrentEntry] = useState({ title: '', content: '', mood: '😊' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [toast, setToast] = useState(null);

  const moods = ['😊', '😌', '😢', '😍', '🤔', '😴', '🥳', '😤', '😎', '🤗', '😰', '💪'];

  // Load entries from Firebase when component mounts
  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    const result = await getUserEntries(user.uid);
    
    if (result.success) {
      setEntries(result.entries);
    } else {
      console.error('Error loading entries:', result.error);
      // Don't show alert for empty state, just show empty entries
      if (!result.error.includes('Permission denied')) {
        setEntries([]); // Set empty array instead of showing error
      } else {
        setToast({ message: 'Failed to load entries', type: 'error' });
      }
    }
    setLoading(false);
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEntriesForDate = (dateStr) => {
    return entries.filter(entry => entry.date === dateStr);
  };

  const handleDateClick = (day) => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const dateStr = formatDateKey(year, month, day);
    
    const dateEntries = getEntriesForDate(dateStr);
    
    if (dateEntries.length > 0) {
      // Show entries for this date
      setSelectedDate(dateStr);
      setViewingEntry(dateEntries[0]); // Show first entry
    } else {
      // Create new entry for this date
      setSelectedDate(dateStr);
      setCurrentEntry({ 
        title: '', 
        content: '', 
        mood: '😊',
        date: dateStr 
      });
      setIsWriting(true);
    }
  };

  const changeMonth = (direction) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCalendarDate(newDate);
  };

  const handleSaveEntry = async () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) {
      setToast({ message: 'Please fill in title and content', type: 'warning' });
      return;
    }

    setSaving(true);

    try {
      const entryDate = currentEntry.date || selectedDate || new Date().toISOString().split('T')[0];
      
      if (editingId) {
        // Update existing entry
        const result = await updateEntry(editingId, {
          title: currentEntry.title,
          content: currentEntry.content,
          mood: currentEntry.mood,
          date: entryDate
        });

        if (result.success) {
          await loadEntries(); // Reload entries
          setToast({ message: 'Entry updated successfully', type: 'success' });
        } else {
          setToast({ message: 'Failed to update entry', type: 'error' });
        }
        setEditingId(null);
      } else {
        // Create new entry
        const entryData = {
          title: currentEntry.title,
          content: currentEntry.content,
          mood: currentEntry.mood,
          date: entryDate,
          isFavorite: false
        };

        const result = await createEntry(user.uid, entryData);

        if (result.success) {
          await loadEntries(); // Reload entries
          setToast({ message: 'Entry created successfully', type: 'success' });
        } else {
          setToast({ message: 'Failed to create entry', type: 'error' });
        }
      }

      setCurrentEntry({ title: '', content: '', mood: '😊' });
      setIsWriting(false);
      setSelectedDate(null);
    } catch (error) {
      console.error('Error saving entry:', error);
      setToast({ message: 'Error occurred while saving', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEditEntry = (entry) => {
    setCurrentEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood
    });
    setEditingId(entry.id);
    setIsWriting(true);
    setViewingEntry(null);
  };

  const confirmDelete = (id) => {
    setEntryToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteEntry = async () => {
    try {
      const result = await deleteEntryFromDB(entryToDelete);

      if (result.success) {
        await loadEntries(); // Reload entries
        setToast({ message: 'Entry deleted successfully', type: 'success' });
      } else {
        setToast({ message: 'Failed to delete entry', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      setToast({ message: 'Error occurred while deleting', type: 'error' });
    }

    setShowDeleteModal(false);
    setEntryToDelete(null);
    setViewingEntry(null);
  };

  const toggleFavorite = async (id) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    try {
      const result = await toggleFavoriteInDB(id, entry.isFavorite);

      if (result.success) {
        await loadEntries(); // Reload entries
      } else {
        setToast({ message: 'Failed to update favorite', type: 'error' });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setToast({ message: 'Error occurred', type: 'error' });
    }
  };

  const cancelEdit = () => {
    setIsWriting(false);
    setEditingId(null);
    setCurrentEntry({ title: '', content: '', mood: '😊' });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold text-lg">Loading your entries...</p>
        </div>
      </div>
    );
  }

  // Filter and sort entries
  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           entry.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMood = filterMood === 'all' || entry.mood === filterMood;
      return matchesSearch && matchesMood;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'favorites') return b.isFavorite - a.isFavorite;
      return 0;
    });

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg hidden sm:block">
                <img src={logo} alt="Daily Diary Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome back! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-3 flex-wrap">
              <div className="bg-white rounded-xl px-4 py-2 shadow-md">
                <span className="text-2xl">📝</span>
                <span className="ml-2 font-bold text-gray-900">{entries.length}</span>
              </div>
              <div className="bg-white rounded-xl px-4 py-2 shadow-md">
                <span className="text-2xl">⭐</span>
                <span className="ml-2 font-bold text-gray-900">{entries.filter(e => e.isFavorite).length}</span>
              </div>
            </div>
          </div>
          
          {/* View All Entries Button - Full Width */}
          <button
            onClick={() => setShowAllEntries(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center space-x-3 text-lg"
          >
            <span className="text-3xl">📚</span>
            <span>View All {entries.length} Entries</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter Bar */}
            {!isWriting && !viewingEntry && (
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="🔍 Search your entries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                    <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                  </div>
                  
                  {/* Filter by Mood */}
                  <select
                    value={filterMood}
                    onChange={(e) => setFilterMood(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none cursor-pointer"
                  >
                    <option value="all">All Moods</option>
                    {moods.map(mood => (
                      <option key={mood} value={mood}>{mood} Mood</option>
                    ))}
                  </select>
                  
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="favorites">Favorites First</option>
                  </select>
                </div>
              </div>
            )}

            {/* Write New Entry Button */}
            {!isWriting && !viewingEntry && (
              <button
                onClick={() => setIsWriting(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
              >
                <span className="text-2xl">✏️</span>
                <span>Write New Entry</span>
              </button>
            )}

            {/* Writing/Editing Area */}
            {isWriting && (
              <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingId ? '✏️ Edit Entry' : '📝 New Entry'}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                
                {/* Mood Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    How are you feeling? 😊
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {moods.map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setCurrentEntry({ ...currentEntry, mood })}
                        className={`text-3xl p-3 rounded-xl transition-all transform hover:scale-110 ${
                          currentEntry.mood === mood 
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 scale-110 shadow-lg' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title Input */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Give your entry a title..."
                    value={currentEntry.title}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-lg font-semibold"
                  />
                </div>

                {/* Content Textarea */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    placeholder="What's on your mind today? Write your thoughts, feelings, and experiences..."
                    value={currentEntry.content}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                    rows="12"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none leading-relaxed"
                  />
                  <div className="text-right text-sm text-gray-500 mt-2">
                    {currentEntry.content.length} characters
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEntry}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {editingId ? 'Updating...' : 'Saving...'}
                      </span>
                    ) : (
                      editingId ? '💾 Update Entry' : '✅ Save Entry'
                    )}
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={saving}
                    className="px-8 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* View Entry Detail */}
            {viewingEntry && (
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{viewingEntry.mood}</span>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {viewingEntry.title}
                      </h2>
                      <p className="text-gray-500">
                        📅 {new Date(viewingEntry.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingEntry(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="prose max-w-none mb-8">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {viewingEntry.content}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => toggleFavorite(viewingEntry.id)}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      viewingEntry.isFavorite
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {viewingEntry.isFavorite ? '⭐ Favorited' : '☆ Add to Favorites'}
                  </button>
                  <button
                    onClick={() => handleEditEntry(viewingEntry)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(viewingEntry.id)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )}

            {/* Entries List */}
            {!isWriting && !viewingEntry && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your Entries ({filteredEntries.length})
                </h2>
                {filteredEntries.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <span className="text-6xl mb-4 block">📭</span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No entries found</h3>
                    <p className="text-gray-600">
                      {searchQuery || filterMood !== 'all' 
                        ? 'Try adjusting your filters or search terms'
                        : 'Start writing your first entry!'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEntries.map((entry) => (
                      <EntryCard 
                        key={entry.id} 
                        entry={entry}
                        onView={() => setViewingEntry(entry)}
                        onEdit={() => handleEditEntry(entry)}
                        onDelete={() => confirmDelete(entry.id)}
                        onToggleFavorite={() => toggleFavorite(entry.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar Widget */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ◀️
                </button>
                <h3 className="text-xl font-bold text-gray-900">
                  📅 {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ▶️
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="text-xs font-semibold text-gray-500 mb-1">
                    {day}
                  </div>
                ))}
                {/* Empty cells for days before month starts */}
                {Array.from({ length: getFirstDayOfMonth(calendarDate) }, (_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                {/* Actual days of the month */}
                {Array.from({ length: getDaysInMonth(calendarDate) }, (_, i) => {
                  const day = i + 1;
                  const dateStr = formatDateKey(
                    calendarDate.getFullYear(), 
                    calendarDate.getMonth(), 
                    day
                  );
                  const hasEntries = getEntriesForDate(dateStr).length > 0;
                  const isToday = dateStr === new Date().toISOString().split('T')[0];
                  const isSelected = dateStr === selectedDate;

                  return (
                    <div
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`p-2 rounded-lg text-sm cursor-pointer transition-all relative ${
                        isToday
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-md'
                          : isSelected
                          ? 'bg-blue-500 text-white font-semibold'
                          : hasEntries
                          ? 'bg-purple-100 text-purple-600 hover:bg-purple-200 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                      {hasEntries && !isToday && !isSelected && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-100 rounded"></div>
                  <span>Has entries</span>
                </div>
              </div>
            </div>

            {/* Mood Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">😊 Mood Overview</h3>
              <div className="space-y-3">
                {Object.entries(
                  entries.reduce((acc, entry) => {
                    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                    return acc;
                  }, {})
                ).slice(0, 5).map(([mood, count]) => (
                  <div key={mood} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{mood}</span>
                      <span className="text-gray-600 font-medium">{count} entries</span>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                        style={{ width: `${(count / entries.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-scaleIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🗑️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Entry?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEntry}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Entries Modal */}
      {showAllEntries && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] shadow-2xl transform animate-scaleIn overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 sticky top-0 z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">📚 All Entries</h2>
                  <p className="text-purple-100">Total: {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}</p>
                </div>
                <button
                  onClick={() => setShowAllEntries(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-purple-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-purple-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  List
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📭</span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No entries found</h3>
                  <p className="text-gray-600">Start writing your first entry!</p>
                </div>
              ) : (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredEntries.map((entry) => (
                        <div
                          key={entry.id}
                          onClick={() => {
                            setViewingEntry(entry);
                            setShowAllEntries(false);
                          }}
                          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border border-purple-100"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-3xl">{entry.mood}</span>
                            {entry.isFavorite && <span className="text-yellow-500 text-xl">⭐</span>}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                            {entry.title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">
                            📅 {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {entry.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredEntries.map((entry) => (
                        <div
                          key={entry.id}
                          onClick={() => {
                            setViewingEntry(entry);
                            setShowAllEntries(false);
                          }}
                          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all border border-purple-100"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <span className="text-3xl">{entry.mood}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-bold text-gray-900">{entry.title}</h3>
                                  {entry.isFavorite && <span className="text-yellow-500">⭐</span>}
                                </div>
                                <p className="text-sm text-gray-500">
                                  📅 {new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredEntries.length} of {entries.length} total entries
              </p>
              <button
                onClick={() => setShowAllEntries(false)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-scaleIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🗑️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Entry?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEntry}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

const EntryCard = ({ entry, onView, onEdit, onDelete, onToggleFavorite }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all group relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1" onClick={onView}>
          <span className="text-4xl transform group-hover:scale-110 transition-transform">{entry.mood}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900">{entry.title}</h3>
              {entry.isFavorite && <span className="text-yellow-500">⭐</span>}
            </div>
            <p className="text-sm text-gray-500">
              📅 {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        
        {/* Actions Menu */}
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-400 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-700 flex items-center gap-2"
              >
                <span>👁️</span> View
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
              >
                <span>✏️</span> Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-yellow-50 text-gray-700 flex items-center gap-2"
              >
                <span>{entry.isFavorite ? '⭐' : '☆'}</span> {entry.isFavorite ? 'Unfavorite' : 'Favorite'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
              >
                <span>🗑️</span> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div onClick={onView}>
        <p className="text-gray-600 leading-relaxed line-clamp-2">
          {entry.content}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;