# Monument Map & Cultural Library

A React application that displays an interactive map of the USA with monument pins and detailed information. Also functions as a searchable catalog for the cultural ecosystem including Persons, Organizations, Programs, and Concepts.

## Features

- **Interactive USA Map**: Displays monuments with custom pins and detailed popups
- **API Data Integration**: Pulls real-time data from API endpoints
- **Searchable Catalog**: Browse monuments and cultural ecosystem (persons, organizations, programs, and concepts)
- **Interactive Map Integration**: Click monument list items to open map tooltips and pan to locations
- **Client-side Caching**: 5-minute cache for improved performance
- **Modern UI**: Uses brand colors (#1f3056, #263c59, #c87c35, #fefeff, #e4dfd5, #e5c422)
- **Responsive Design**: Works on desktop and mobile devices

## Development Setup

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start Development Server**:

   ```bash
   npm start
   ```

   Open http://localhost:3000 to view it in the browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Development Data Sources

The application currently pulls data from API endpoints served by mm-proxy:

- **Monuments**: `http://localhost:4321/api/api/monuments.json`
- **Ecosystem**: `http://localhost:4321/api/api/ecosystem.json`

These endpoints can be configured by setting environment variables:

- `window.MONUMENTS_API_URL` - Override default monuments endpoint
- `window.ECOSYSTEM_API_URL` - Override default ecosystem endpoint

## Data Structure

### Monuments Data

The monuments API returns data with the following structure:

```json
{
  "items": [
    {
      "id": "unique_id",
      "fieldData": {
        "name": "Monument Name",
        "status": "status_id",
        "location": "Location Name",
        "locationcoords": "latitude,longitude",
        "description": "<p>HTML description</p>",
        "year": "YYYY",
        "height": "Height with units",
        "built-by": "Builder Name",
        "funded-by": "Funding Source",
        "conceptualized-by": "Conceptualizer",
        "tags": "comma,separated,tags",
        "link-2": "https://external-link.com"
      }
    }
  ]
}
```

### Ecosystem Data

The ecosystem API returns data with the following structure:

```json
{
  "items": [
    {
      "id": "unique_id",
      "fieldData": {
        "name": "Entity Name",
        "type": "type_id",
        "category": "category_id",
        "association": "Associated Entity",
        "location": "Location",
        "website": "https://website.com",
        "description": "Description or notes",
        "tags": "comma,separated,tags"
      }
    }
  ]
}
```

**Type Mappings:**

- Person, Organization, Program, Concept

**Category Mappings:**

- Founders, Patrons, Organizations, Programs, Concepts

## Deployment

### Deploy to S3

1. **Update package.json** with your S3 bucket name:

   ```json
   "deploy": "aws s3 cp ./dist/bundle.js s3://YOUR_BUCKET_NAME/ --acl public-read"
   ```

2. **Build and Deploy**:
   ```bash
   npm run bd
   ```

### Integration

1. **Load React Libraries** in your page's `<head>` tag:

   ```html
   <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
   <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
   ```

2. **Load Your Bundle** before the closing `</body>` tag:

   ```html
   <script src="https://YOUR_BUCKET.s3.YOUR_REGION.amazonaws.com/bundle.js"></script>
   ```

3. **Create Target Div** where you want the map to appear:

   ```html
   <div id="react-target"></div>
   ```

4. **Configure API Endpoints** (optional, if using different endpoints):
   ```html
   <script>
     window.MONUMENTS_API_URL = "https://your-api.com/api/monuments.json";
     window.ECOSYSTEM_API_URL = "https://your-api.com/api/ecosystem.json";
   </script>
   ```

## Customization

- **Colors**: Modify the CSS variables in `src/styles.css`
- **Map Style**: Change the tile layer URL in `MonumentMap.js`
- **Data Fields**: Update the field mappings in `WebflowCMS.js`
- **UI Components**: Customize the layout and components in `MonumentMap.js`
- **API Endpoints**: Configure different data sources via `window.MONUMENTS_API_URL` and `window.ECOSYSTEM_API_URL`

## Application Features

### Interactive Map Functionality

- **Monument Pins**: Custom pins for each monument with coordinates
- **Popup Tooltips**: Detailed information including name, description, year, location, height, and external links
- **List Integration**: Clicking monument items in the sidebar opens corresponding map tooltips and pans to location
- **Non-monument Filtering**: Only monuments interact with the map; persons, organizations, programs, and concepts are list-only

### Data Management

- **Client-side Caching**: 5-minute cache reduces API calls and improves performance
- **Error Handling**: Graceful degradation when API endpoints are unavailable
- **HTML Parsing**: Automatically strips HTML tags from descriptions for clean display
- **Coordinate Parsing**: Handles various coordinate formats including "lat,lng" strings

## Browser Support

- Modern browsers with ES6+ support
- Mobile Safari (iOS 10+)
- Chrome (60+)
- Firefox (60+)
- Edge (79+)
