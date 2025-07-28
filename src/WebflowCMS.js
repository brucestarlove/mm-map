// Webflow CMS Integration Service
class WebflowCMS {
  constructor(apiToken = null, siteId = null) {
    this.apiToken = apiToken || window.WEBFLOW_API_TOKEN;
    this.siteId = siteId || window.WEBFLOW_SITE_ID;
    this.baseUrl = 'https://api.webflow.com';
  }

  // Generic method to fetch from any CMS collection
  async fetchCollection(collectionId, limit = 100) {
    if (!this.apiToken || !this.siteId) {
      console.warn('Webflow API credentials not found. Using mock data.');
      return this.getMockData(collectionId);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/collections/${collectionId}/items?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Accept-Version': '1.0.0',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching from Webflow CMS:', error);
      return this.getMockData(collectionId);
    }
  }

  // Fetch monuments from CMS
  async fetchMonuments() {
    const collectionId = window.MONUMENTS_COLLECTION_ID || 'monuments';
    const items = await this.fetchCollection(collectionId);
    
    return items.map(item => ({
      id: item._id,
      name: item.name || item.Name,
      status: item.status || item.Status,
      location: item.location || item.Location,
      coordinates: this.parseCoordinates(item.coordinates || item.Location),
      description: item.description || item.Description,
      year: item.year || item.Year,
      builtBy: item['built-by'] || item['Built By'],
      fundedBy: item['funded-by'] || item['Funded By'],
      conceptualizedBy: item['conceptualized-by'] || item['Conceptualized By'],
      tags: this.parseTags(item.tags || item.Tags),
      link: item.link || item.Link
    }));
  }

  // Fetch ecosystem data from CMS (combines patrons, organizations, programs, concepts)
  async fetchEcosystem() {
    const collectionId = window.ECOSYSTEM_COLLECTION_ID || 'ecosystem';
    const items = await this.fetchCollection(collectionId);
    
    return items.map(item => ({
      id: item._id,
      name: item.name || item.Name,
      type: item.type || item.Type,
      category: item.category || item.Category,
      association: item.association || item.Association,
      location: item.location || item.Location,
      website: item.website || item.Website,
      description: item.description || item.Description,
      tags: this.parseTags(item.tags || item.Tags)
    }));
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

  // Mock data for development/fallback
  getMockData(collectionId) {
    const mockData = {
      monuments: [
        {
          _id: '1',
          name: 'Statue of Liberty',
          status: 'Active',
          location: 'New York, NY',
          coordinates: [40.6892, -74.0445],
          description: 'A symbol of freedom and democracy, gifted by France to the United States.',
          year: '1886',
          'built-by': 'Frédéric Auguste Bartholdi',
          'funded-by': 'French-American fundraising',
          'conceptualized-by': 'Édouard de Laboulaye',
          tags: 'Freedom,Democracy,Gift,France',
          link: 'https://www.nps.gov/stli/'
        },
        {
          _id: '2',
          name: 'Mount Rushmore',
          status: 'Active',
          location: 'South Dakota',
          coordinates: [43.8791, -103.4591],
          description: 'Carved faces of four U.S. presidents into the granite face of Mount Rushmore.',
          year: '1941',
          'built-by': 'Gutzon Borglum',
          'funded-by': 'Federal Government',
          'conceptualized-by': 'Doane Robinson',
          tags: 'Presidents,Mountain,Carving',
          link: 'https://www.nps.gov/moru/'
        },
        {
          _id: '3',
          name: 'Washington Monument',
          status: 'Active',
          location: 'Washington, DC',
          coordinates: [38.8895, -77.0353],
          description: 'An obelisk built to commemorate George Washington, the first President of the United States.',
          year: '1884',
          'built-by': 'Robert Mills',
          'funded-by': 'Public fundraising',
          'conceptualized-by': 'Washington National Monument Society',
          tags: 'Presidents,Obelisk,Capital',
          link: 'https://www.nps.gov/wamo/'
        },
        {
          _id: '4',
          name: 'Lincoln Memorial',
          status: 'Active',
          location: 'Washington, DC',
          coordinates: [38.8893, -77.0502],
          description: 'A national memorial built to honor Abraham Lincoln, the 16th President of the United States.',
          year: '1922',
          'built-by': 'Henry Bacon',
          'funded-by': 'U.S. Congress',
          'conceptualized-by': 'Lincoln Memorial Commission',
          tags: 'Presidents,Memorial,Civil War',
          link: 'https://www.nps.gov/linc/'
        },
        {
          _id: '5',
          name: 'Gateway Arch',
          status: 'Active',
          location: 'St. Louis, MO',
          coordinates: [38.6247, -90.1848],
          description: 'A monument commemorating the westward expansion of the United States.',
          year: '1965',
          'built-by': 'Eero Saarinen',
          'funded-by': 'Federal Government',
          'conceptualized-by': 'Jefferson National Expansion Memorial Association',
          tags: 'Westward Expansion,Arch,Gateway',
          link: 'https://www.nps.gov/jeff/'
        }
      ],
      ecosystem: [
        {
          _id: 'p1',
          name: 'Andrew Carnegie',
          type: 'Patron',
          category: 'Philanthropist',
          association: 'Carnegie Foundation',
          location: 'New York, NY',
          website: 'https://www.carnegie.org',
          description: 'Steel magnate and philanthropist who funded numerous libraries and cultural institutions.',
          tags: 'Libraries,Education,Steel Industry,Philanthropy'
        },
        {
          _id: 'p2',
          name: 'John D. Rockefeller',
          type: 'Patron',
          category: 'Business Magnate',
          association: 'Rockefeller Foundation',
          location: 'New York, NY',
          website: 'https://www.rockefellerfoundation.org',
          description: 'Oil industry pioneer and philanthropist who funded educational and cultural institutions.',
          tags: 'Oil,Education,Philanthropy,Foundation'
        },
        {
          _id: 'p3',
          name: 'Melinda French Gates',
          type: 'Patron',
          category: 'Philanthropist',
          association: 'Pivotal Ventures',
          location: 'Seattle, WA',
          website: 'https://www.pivotalventures.org',
          description: 'Co-founder of the Gates Foundation focused on gender equality and empowerment.',
          tags: 'Gender Equality,Technology,Global Health,Education'
        },
        {
          _id: 'o1',
          name: 'National Park Service',
          type: 'Organization',
          category: 'Government Agency',
          association: 'U.S. Department of Interior',
          location: 'Washington, DC',
          website: 'https://www.nps.gov',
          description: 'Federal agency responsible for managing national parks and monuments.',
          tags: 'Parks,Conservation,Government,Heritage'
        },
        {
          _id: 'o2',
          name: 'Smithsonian Institution',
          type: 'Organization',
          category: 'Cultural Institution',
          association: 'U.S. Government',
          location: 'Washington, DC',
          website: 'https://www.si.edu',
          description: 'The world\'s largest museum, education, and research complex.',
          tags: 'Museums,Research,Education,Culture'
        },
        {
          _id: 'o3',
          name: 'National Trust for Historic Preservation',
          type: 'Organization',
          category: 'Non-profit',
          association: 'Independent',
          location: 'Washington, DC',
          website: 'https://savingplaces.org',
          description: 'A privately funded nonprofit organization working to save America\'s historic places.',
          tags: 'Historic Preservation,Architecture,Community,Heritage'
        },
        {
          _id: 'pr1',
          name: 'National Historic Preservation Act',
          type: 'Program',
          category: 'Legislation',
          association: 'U.S. Congress',
          location: 'United States',
          website: 'https://www.achp.gov/nhpa',
          description: 'Federal law that established the framework for historic preservation in the United States.',
          tags: 'Historic Preservation,Law,Heritage,Policy'
        },
        {
          _id: 'pr2',
          name: 'Arts in Education Program',
          type: 'Program',
          category: 'Educational Initiative',
          association: 'National Endowment for the Arts',
          location: 'United States',
          website: 'https://www.arts.gov',
          description: 'Federal program supporting arts education in schools and communities.',
          tags: 'Arts,Education,Creativity,Youth Development'
        },
        {
          _id: 'pr3',
          name: 'Cultural Landscape Initiative',
          type: 'Program',
          category: 'Conservation Program',
          association: 'National Park Service',
          location: 'United States',
          website: 'https://www.nps.gov/cultural-landscapes',
          description: 'Program dedicated to preserving and interpreting cultural landscapes.',
          tags: 'Cultural Landscapes,Conservation,Heritage,Environment'
        },
        {
          _id: 'c1',
          name: 'Manifest Destiny',
          type: 'Concept',
          category: 'Political Philosophy',
          association: 'American Expansion',
          location: 'United States',
          website: '',
          description: 'The belief that American expansion across the continent was justified and inevitable.',
          tags: 'Expansion,Philosophy,American History,Ideology'
        },
        {
          _id: 'c2',
          name: 'American Exceptionalism',
          type: 'Concept',
          category: 'Political Theory',
          association: 'American Identity',
          location: 'United States',
          website: '',
          description: 'The idea that the United States is inherently different from other nations.',
          tags: 'Identity,Politics,Philosophy,Nationalism'
        },
        {
          _id: 'c3',
          name: 'Cultural Memory',
          type: 'Concept',
          category: 'Social Theory',
          association: 'Memory Studies',
          location: 'Global',
          website: '',
          description: 'The shared pool of knowledge and information in the memory of a group.',
          tags: 'Memory,Culture,Identity,Heritage,Collective'
        },
        {
          _id: 'c4',
          name: 'Public Art as Civic Engagement',
          type: 'Concept',
          category: 'Arts Theory',
          association: 'Public Art Movement',
          location: 'Global',
          website: '',
          description: 'The role of public art in fostering community dialogue and civic participation.',
          tags: 'Public Art,Civic Engagement,Community,Democracy'
        }
      ]
    };

    return mockData[collectionId] || [];
  }
}

export default WebflowCMS;