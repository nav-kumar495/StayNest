import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, Minus, Plus } from 'lucide-react';
import './SearchBar.css';

const LOCATIONS = [
  { id: 'near', title: 'Nearby', desc: "Find what's around you", icon: <Navigation size={20} /> },
  { id: 'ngoa', title: 'North Goa, Goa', desc: 'Popular beach destination', icon: <MapPin size={20} /> },
  { id: 'sgoa', title: 'South Goa, Goa', desc: 'For sights like Basilica of Bom Jesus', icon: <MapPin size={20} /> },
  { id: 'lonavala', title: 'Lonavala, Maharashtra', desc: 'For nature lovers', icon: <MapPin size={20} /> },
  { id: 'mumbai', title: 'Mumbai, Maharashtra', desc: 'For its top-notch dining', icon: <MapPin size={20} /> }
];

const RECENT_SEARCHES = [
  { id: 'goa_recent', title: 'Goa', desc: '2–3 Apr · 2 guests', icon: <MapPin size={20} /> }
];

const SearchBar = ({ onSearch }) => {
  const [activePopover, setActivePopover] = useState(null); // 'where', 'when', 'who'
  
  // States
  const [locationStr, setLocationStr] = useState('');
  const [dates, setDates] = useState({ start: null, end: null });
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });
  
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalGuests = guests.adults + guests.children;
  
  const handleSearchClick = (e) => {
    e.stopPropagation();
    setActivePopover(null);
    if(onSearch) {
      onSearch({ 
        location: locationStr, 
        dates, 
        guests: totalGuests 
      });
    }
  };

  const updateGuest = (type, operation) => {
    setGuests(prev => {
      const current = prev[type];
      let next = operation === 'add' ? current + 1 : current - 1;
      if (next < 0) next = 0;
      
      const newGuests = { ...prev, [type]: next };
      // Auto-add adult if there are none and adding children/infants
      if (type !== 'adults' && next > 0 && newGuests.adults === 0) {
        newGuests.adults = 1;
      }
      return newGuests;
    });
  };

  return (
    <div className="search-bar-wrapper" ref={containerRef}>
      <div className={`search-bar-container ${activePopover ? 'has-active' : ''}`}>
        
        {/* Where Button */}
        <div 
          className={`search-segment where-segment ${activePopover === 'where' ? 'active' : ''}`}
          onClick={() => setActivePopover('where')}
        >
          <div className="segment-content">
            <span className="segment-label">Where</span>
            <input 
              type="text" 
              placeholder="Search destinations" 
              className="segment-input"
              value={locationStr}
              onChange={(e) => setLocationStr(e.target.value)}
            />
          </div>
        </div>
        
        <div className="segment-divider"></div>

        {/* When Button */}
        <div 
          className={`search-segment when-segment ${activePopover === 'when' ? 'active' : ''}`}
          onClick={() => setActivePopover('when')}
        >
          <div className="segment-content">
            <span className="segment-label">When</span>
            <span className={`segment-value ${!dates.start ? 'placeholder' : ''}`}>
              {dates.start ? `${dates.start} - ${dates.end}` : 'Add dates'}
            </span>
          </div>
        </div>

        <div className="segment-divider"></div>

        {/* Who Button */}
        <div 
          className={`search-segment who-segment ${activePopover === 'who' ? 'active' : ''}`}
          onClick={() => setActivePopover('who')}
        >
          <div className="segment-content">
            <span className="segment-label">Who</span>
            <span className={`segment-value ${totalGuests === 0 ? 'placeholder' : ''}`}>
              {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}
            </span>
          </div>
          <button className="search-btn-circular" onClick={handleSearchClick}>
            <Search size={18} strokeWidth={3} />
            <span className="search-btn-text">Search</span>
          </button>
        </div>
      </div>

      {/* Popovers */}
      <div className="popovers-layer">
        {activePopover === 'where' && (
          <div className="popover-panel where-popover">
            <div className="popover-section">
              <h4 className="popover-title">Recent searches</h4>
              <div className="suggestion-list">
                {RECENT_SEARCHES.map(item => (
                  <div key={item.id} className="suggestion-item" onClick={() => { setLocationStr(item.title); setActivePopover(null); }}>
                    <div className="suggestion-icon-wrap">
                      {item.icon}
                    </div>
                    <div className="suggestion-text">
                      <div className="suggestion-title">{item.title}</div>
                      <div className="suggestion-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="popover-section auto-mt">
              <h4 className="popover-title">Suggested destinations</h4>
              <div className="suggestion-list">
                {LOCATIONS.map(item => (
                  <div key={item.id} className="suggestion-item" onClick={() => { setLocationStr(item.title); setActivePopover(null); }}>
                    <div className="suggestion-icon-wrap">
                      {item.icon}
                    </div>
                    <div className="suggestion-text">
                      <div className="suggestion-title">{item.title}</div>
                      <div className="suggestion-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activePopover === 'when' && (
          <div className="popover-panel when-popover">
             <div className="when-tabs">
               <button className="when-tab active">Dates</button>
               <button className="when-tab">Months</button>
               <button className="when-tab">Flexible</button>
             </div>
             
             {/* Mock Calendar Grid */}
             <div className="calendar-mock-container">
                <div className="calendar-months">
                  
                  {/* Month 1: March */}
                  <div className="calendar-month">
                    <div className="month-header">
                      <button className="nav-arrow">&lt;</button>
                      <h5>March 2026</h5>
                      <span className="nav-arrow placeholder">&gt;</span>
                    </div>
                    <div className="days-grid">
                      {['S','M','T','W','T','F','S'].map(d=><div key={`m1-${d}`} className="day-name">{d}</div>)}
                      {/* Empty days for March 1 is Sunday */}
                      {/* Simplified grid for visual accuracy */}
                      {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                        <div 
                          key={`mar-${day}`} 
                          className={`day ${day >= 22 && day <= 28 ? 'active-range' : ''} ${day === 22 || day === 28 ? 'active-day' : ''}`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Month 2: April */}
                  <div className="calendar-month">
                    <div className="month-header">
                       <span className="nav-arrow placeholder">&lt;</span>
                       <h5>April 2026</h5>
                       <button className="nav-arrow">&gt;</button>
                    </div>
                     <div className="days-grid">
                      {['S','M','T','W','T','F','S'].map(d=><div key={`m2-${d}`} className="day-name">{d}</div>)}
                      {/* April 1 is Wednesday in 2026 */}
                      <div className="day empty"></div><div className="day empty"></div><div className="day empty"></div>
                      {Array.from({length: 30}, (_, i) => i + 1).map(day => (
                        <div key={`apr-${day}`} className="day">{day}</div>
                      ))}
                    </div>
                  </div>

                </div>
                
                <div className="flexible-pills">
                  <button className="flex-pill active">Exact dates</button>
                  <button className="flex-pill">± 1 day</button>
                  <button className="flex-pill">± 2 days</button>
                  <button className="flex-pill">± 3 days</button>
                  <button className="flex-pill">± 7 days</button>
                </div>
             </div>
          </div>
        )}

        {activePopover === 'who' && (
          <div className="popover-panel who-popover">
            {[
              { id: 'adults', label: 'Adults', desc: 'Ages 13 or above' },
              { id: 'children', label: 'Children', desc: 'Ages 2–12' },
              { id: 'infants', label: 'Infants', desc: 'Under 2' },
              { id: 'pets', label: 'Pets', desc: 'Bringing a service animal?' },
            ].map((row, index, arr) => (
              <div className={`guest-row ${index === arr.length - 1 ? 'last-row' : ''}`} key={row.id}>
                <div className="guest-info">
                  <div className="guest-label">{row.label}</div>
                  {row.id === 'pets' ? (
                    <a href="#" className="guest-desc" style={{textDecoration:'underline'}}>{row.desc}</a>
                  ) : (
                    <div className="guest-desc">{row.desc}</div>
                  )}
                </div>
                <div className="guest-controls">
                  <button 
                    className="guest-btn" 
                    onClick={() => updateGuest(row.id, 'sub')}
                    disabled={guests[row.id] === 0}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="guest-count">{guests[row.id]}</span>
                  <button 
                    className="guest-btn" 
                    onClick={() => updateGuest(row.id, 'add')}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
