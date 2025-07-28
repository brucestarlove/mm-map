# Monument Map & Cultural Library

A React component for embedding in Webflow that displays an interactive map of the USA with monument pins and coordinates pulled from Webflow CMS collections. Also functions as a searchable catalog for the cultural ecosystem including Patrons, Organizations, Programs, and Concepts.

## Features

- **Interactive USA Map**: Displays monuments with custom pins and detailed popups
- **Webflow CMS Integration**: Pulls data from your Webflow CMS collections
- **Searchable Catalog**: Browse monuments and cultural ecosystem (patrons, organizations, programs, and concepts)
- **Modern UI**: Uses your brand colors (#1f3056, #263c59, #c87c35, #fefeff, #e4dfd5, #e5c422)
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

## Webflow Integration

### 1. Set Up Your CMS Collections

Create these collections in your Webflow CMS:

**Monuments Collection** (required fields):
- ID (auto-generated)
- Name (text)
- Status (text)
- Location (text)
- Description (rich text)
- Year (text)
- Built By (text)
- Funded By (text)
- Conceptualized By (text)
- Tags (text, comma-separated)
- Link (link)
- Coordinates (text, format: "latitude,longitude")

**Ecosystem Collection** (required fields):
- ID (auto-generated)
- Name (text)
- Type (text) - Values: "Patron", "Organization", "Program", or "Concept"
- Category (text)
- Association (text)
- Location (text)
- Website (link)
- Description (rich text)
- Tags (text, comma-separated)

### 2. Configure API Access

Add these script variables to your Webflow page's custom code (in the `<head>` section):

```html
<script>
  // Webflow API Configuration
  window.WEBFLOW_API_TOKEN = 'your_api_token_here';
  window.WEBFLOW_SITE_ID = 'your_site_id_here';
  
  // Collection IDs (get these from your Webflow CMS)
  window.MONUMENTS_COLLECTION_ID = 'your_monuments_collection_id';
  window.ECOSYSTEM_COLLECTION_ID = 'your_ecosystem_collection_id';
</script>
```

### 3. Deploy to S3

1. **Update package.json** with your S3 bucket name:
   ```json
   "deploy": "aws s3 cp ./dist/bundle.js s3://YOUR_BUCKET_NAME/ --acl public-read"
   ```

2. **Build and Deploy**:
   ```bash
   npm run bd
   ```

### 4. Add to Webflow

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

## Data Format

### Monument Coordinates
Coordinates should be in the format: `"latitude,longitude"` (e.g., "40.6892,-74.0445")

### Tags
Tags should be comma-separated strings (e.g., "Freedom,Democracy,Gift,France")

## Customization

- **Colors**: Modify the CSS variables in `src/styles.css`
- **Map Style**: Change the tile layer URL in `MonumentMap.js`
- **Data Fields**: Update the field mappings in `WebflowCMS.js`
- **UI Components**: Customize the layout and components in `MonumentMap.js`

## Fallback Data

The component includes mock data that will be used if:
- Webflow API credentials are not configured
- API requests fail
- Collections are not found

This ensures the component always works during development and provides a fallback in production.

## Browser Support

- Modern browsers with ES6+ support
- Mobile Safari (iOS 10+)
- Chrome (60+)
- Firefox (60+)
- Edge (79+)