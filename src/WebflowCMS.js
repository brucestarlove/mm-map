// Webflow CMS Integration Service
class WebflowCMS {
  constructor(apiToken = null, siteId = null) {
    this.apiToken = apiToken || window.WEBFLOW_API_TOKEN;
    this.siteId = siteId || window.WEBFLOW_SITE_ID;
    this.baseUrl = 'https://api.webflow.com';
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  // Cache management methods
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }


  // Fetch monuments from CMS
  async fetchMonuments() {
    const cacheKey = 'monuments';
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      console.log('Using cached monument data');
      return cachedData;
    }

    const monumentsUrl = window.MONUMENTS_API_URL || 'http://localhost:4321/api/api/monuments.json';
    
    try {
      const response = await fetch(monumentsUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const items = data.items || data;
      
      const processedData = items.map(item => {
        const fieldData = item.fieldData || item;
        return {
          id: item.id || item._id,
          name: fieldData.name || fieldData.Name,
          status: fieldData.status || fieldData.Status,
          location: fieldData.location || fieldData.Location,
          coordinates: this.parseCoordinates(fieldData.locationcoords || fieldData.coordinates || fieldData.Location),
          description: this.stripHtml(fieldData.description || fieldData.Description || ''),
          year: fieldData.year || fieldData.Year,
          height: fieldData.height || fieldData.Height,
          builtBy: fieldData['built-by'] || fieldData['Built By'],
          fundedBy: fieldData['funded-by'] || fieldData['Funded By'],
          conceptualizedBy: fieldData['conceptualized-by'] || fieldData['Conceptualized By'],
          tags: this.parseTags(fieldData.tags || fieldData.Tags),
          link: fieldData['link-2'] || fieldData.link || fieldData.Link
        };
      });

      this.setCachedData(cacheKey, processedData);
      console.log(`Cached ${processedData.length} monuments`);
      return processedData;
    } catch (error) {
      console.error('Error fetching monuments from API:', error);
      return [];
    }
  }

  // Fetch ecosystem data from CMS (combines patrons, organizations, programs, concepts)
  async fetchEcosystem() {
    const cacheKey = 'ecosystem';
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      console.log('Using cached ecosystem data');
      return cachedData;
    }

    const ecosystemUrl = window.ECOSYSTEM_API_URL || 'http://localhost:4321/api/api/ecosystem.json';
    
    try {
      const response = await fetch(ecosystemUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const items = data.items || data;
      
      const processedData = items.map(item => {
        const fieldData = item.fieldData || item;
        return {
          id: item.id || item._id,
          name: fieldData.name || fieldData.Name,
          type: fieldData.type || fieldData.Type,
          category: fieldData.category || fieldData.Category,
          association: fieldData.association || fieldData.Association,
          location: fieldData.location || fieldData.Location,
          website: fieldData.website || fieldData.Website,
          description: this.stripHtml(fieldData.description || fieldData.Description || ''),
          tags: this.parseTags(fieldData.tags || fieldData.Tags)
        };
      });

      this.setCachedData(cacheKey, processedData);
      console.log(`Cached ${processedData.length} ecosystem items`);
      return processedData;
    } catch (error) {
      console.error('Error fetching ecosystem from API:', error);
      return [];
    }
  }

  // Helper method to strip HTML tags from text
  stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  }

  // Helper method to parse coordinates from location string or coordinate field
  parseCoordinates(locationData) {
    if (!locationData) return null;
    
    // If it's already an array of coordinates
    if (Array.isArray(locationData) && locationData.length === 2) {
      return locationData;
    }
    
    // If it's a string with coordinates like "40.6892,-74.0445"
    if (typeof locationData === 'string' && locationData.includes(',')) {
      const coords = locationData.split(',').map(coord => parseFloat(coord.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        return coords;
      }
    }
    
    // Fallback: try to geocode the location name
    return this.geocodeLocation(locationData);
  }

  // Simple geocoding fallback for common US locations
  geocodeLocation(location) {
    const commonLocations = {
      'New York, NY': [40.7128, -74.0060],
      'Washington, DC': [38.9072, -77.0369],
      'South Dakota': [43.9695, -99.9018],
      'California': [36.7783, -119.4179],
      'Texas': [31.9686, -99.9018],
      'Florida': [27.7663, -82.6404]
    };
    
    return commonLocations[location] || null;
  }

  // Helper method to parse tags (handles both arrays and comma-separated strings)
  parseTags(tags) {
    if (!tags) return [];
    
    if (Array.isArray(tags)) {
      return tags;
    }
    
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    return [];
  }

}

export default WebflowCMS;