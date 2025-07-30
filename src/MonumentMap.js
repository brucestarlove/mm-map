import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import WebflowCMS from './WebflowCMS';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom monument marker icon
const monumentIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12.5" cy="12.5" r="12" fill="#c87c35" stroke="#1f3056" stroke-width="1"/>
      <circle cx="12.5" cy="12.5" r="4" fill="#fefeff"/>
    </svg>
  `),
  iconSize: [25, 25],
  iconAnchor: [12.5, 12.5],
  popupAnchor: [0, -12.5]
});

const MonumentMap = () => {
  const [monuments, setMonuments] = useState([]);
  const [ecosystem, setEcosystem] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('monuments');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Refs for controlling map interactions
  const mapRef = useRef(null);
  const markerRefs = useRef({});

  // Initialize Webflow CMS service
  const cms = new WebflowCMS();

  // Load data from Webflow CMS
  useEffect(() => {
    const loadData = async () => {
      try {
        const [monumentsData, ecosystemData] = await Promise.all([
          cms.fetchMonuments(),
          cms.fetchEcosystem()
        ]);

        setMonuments(monumentsData);
        setEcosystem(ecosystemData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Clear selected item when filter or search changes
  useEffect(() => {
    setSelectedItem(null);
  }, [activeFilter, searchTerm]);

  const getAllData = () => [...monuments, ...ecosystem];

  const getFilteredData = () => {
    const allData = getAllData();
    
    // If there's a search term, search across ALL data regardless of filter
    if (searchTerm.trim()) {
      return allData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.tags && Array.isArray(item.tags) && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // If no search term, filter by active category
    switch (activeFilter) {
      case 'monuments': return monuments;
      case 'patrons': return ecosystem.filter(item => item.type === 'Person');
      case 'organizations': return ecosystem.filter(item => item.type === 'Organization');
      case 'programs': return ecosystem.filter(item => item.type === 'Program');
      case 'concepts': return ecosystem.filter(item => item.type === 'Concept');
      default: return monuments;
    }
  };

  const filteredData = getFilteredData();

  const handleItemClick = (item) => {
    // Only set selected item and interact with map for monuments
    const isMonument = monuments.some(monument => monument.id === item.id);
    
    if (isMonument) {
      setSelectedItem(item);
      
      // Open the tooltip for the corresponding marker
      const markerRef = markerRefs.current[item.id];
      if (markerRef && markerRef.openPopup) {
        markerRef.openPopup();
        
        // Pan to the marker location
        if (mapRef.current && item.coordinates) {
          mapRef.current.setView(item.coordinates, Math.max(mapRef.current.getZoom(), 8));
        }
      }
    } else {
      // For non-monuments, don't set as selected (no highlighting)
      setSelectedItem(null);
    }
  };

  const renderResultItem = (item) => {
    const isMonument = monuments.some(monument => monument.id === item.id);
    const isSelected = isMonument && selectedItem?.id === item.id;
    
    return (
      <div
        key={item.id}
        className={`result-item ${isSelected ? 'selected' : ''}`}
        onClick={() => handleItemClick(item)}
      >
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      {item.year && <p className="year">Built: {item.year}</p>}
      {item.association && <p><strong>Association:</strong> {item.association}</p>}
      {item.location && <p>📍 {item.location}</p>}
      {item.website && <p><a href={item.website} target="_blank" rel="noopener noreferrer">Visit Website</a></p>}
      {item.tags && Array.isArray(item.tags) && (
        <div className="result-tags">
          {item.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
    );
  };

  return (
    <div className="monument-map-container">
      <header className="header">
        <h1>Monument Map & Cultural Library</h1>
        <p>Explore monuments, patrons, organizations, programs, and concepts that inspire awe and ambition</p>
      </header>
      
      <div className="content">
        <aside className="sidebar">
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Search across all monuments, people, and organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className={`filter-section ${searchTerm.trim() ? 'search-active' : ''}`}>
              <div className="filter-label">
                {searchTerm.trim() ? 'Browse by type:' : 'Filter results:'}
              </div>
              <div className="filter-pills">
                <button
                  className={`filter-pill ${activeFilter === 'monuments' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('monuments')}
                  disabled={searchTerm.trim()}
                >
                  Monuments
                </button>
                <button
                  className={`filter-pill ${activeFilter === 'patrons' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('patrons')}
                  disabled={searchTerm.trim()}
                >
                  Persons
                </button>
                <button
                  className={`filter-pill ${activeFilter === 'organizations' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('organizations')}
                  disabled={searchTerm.trim()}
                >
                  Organizations
                </button>
                <button
                  className={`filter-pill ${activeFilter === 'programs' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('programs')}
                  disabled={searchTerm.trim()}
                >
                  Programs
                </button>
                <button
                  className={`filter-pill ${activeFilter === 'concepts' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('concepts')}
                  disabled={searchTerm.trim()}
                >
                  Concepts
                </button>
              </div>
            </div>
          </div>
          
          <div className="results-section">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              filteredData.map(renderResultItem)
            )}
          </div>
        </aside>
        
        <main className="map-container">
          <MapContainer
            ref={mapRef}
            center={[39.8283, -98.5795]}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {monuments.filter(monument => monument.coordinates).map((monument) => (
              <Marker
                key={monument.id}
                ref={(ref) => { markerRefs.current[monument.id] = ref; }}
                position={monument.coordinates}
                icon={monumentIcon}
                eventHandlers={{
                  click: () => handleItemClick(monument),
                }}
              >
                <Popup className="monument-popup">
                  <h3>{monument.name}</h3>
                  <p>{monument.description}</p>
                  <p className="year">Built: {monument.year}</p>
                  <p><strong>Location:</strong> {monument.location}</p>
                  {monument.height && <p><strong>Height:</strong> {monument.height}</p>}
                  {monument.tags && Array.isArray(monument.tags) && (
                    <div className="tags">
                      {monument.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  {monument.link && (
                    <p><a href={monument.link} target="_blank" rel="noopener noreferrer">Learn More</a></p>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </main>
      </div>
    </div>
  );
};

export default MonumentMap;