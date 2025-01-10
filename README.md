# Poverty Pockets Map Project

## Overview
This project visualizes poverty pockets in the Bay Area using GeoJSON data layers rendered on an interactive map powered by ArcGIS and React. The project allows users to distinguish between **adopted** and **not adopted** areas visually, with color-coded polygons on the map. Administrators can manage adoption statuses and view audit logs.

## Key Features
- **Interactive Map**: Displays census tracts in the Bay Area with income and adoption statuses.
- **Legend**: Dynamically updates based on the map's color-coded visualization.
- **Admin Panel**: Enables administrators to update adoption statuses and view metadata like the last updated date and user.
- **Future-Proofing**: Designed with modular components and authentication middleware for role-based access control.

## Technology Stack
- **React**: Frontend framework.
- **ArcGIS API for JavaScript**: Map rendering and GeoJSON layer support.
- **GeoJSON**: Spatial data format for census tracts and income data.
- **Node.js (for API)**: To handle future administrative features.
- **Middleware**: Authenticates users and ensures role-based access.

## Directory Structure
```
poverty-pockets/
├── public/
│   ├── bay_area_tracts_geometry.geojson       # GeoJSON for borders of Bay Area census tracts
│   ├── bay_data.geojson                       # GeoJSON for poverty data
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   ├── san_jose_income.geojson               # GeoJSON for income data
│   ├── san_jose_tracts.geojson               # GeoJSON for census tracts
├── src/
│   ├── components/
│   │   ├── ArcGISMap.js                      # Renders the map and integrates layers
│   │   ├── IncomeLayer.js                    # Displays income and adoption layers
│   │   ├── Legend.js                         # Displays the legend for income and adoption status
│   ├── utils/
│   │   ├── authMiddleware.js                 # Middleware for authentication and role-based access
│   │   ├── geoUtils.js                       # GeoJSON utilities for data processing
│   ├── App.js                                # Main application entry
│   ├── index.js                              # Renders the React app
├── .gitignore
├── package.json                              # Dependencies and scripts
├── package-lock.json                         # Lock file for package.json
├── README.md                                 # Project documentation (this file)
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Valyria-Studios/poverty-pockets.git
   cd poverty-pockets
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open the application in your browser at `http://localhost:3000`.

## Usage

### Map Features
- **View Census Tracts**: Census tracts are displayed with borders and income levels.
- **Legend**: Shows color codes for income and adoption statuses:
  - **Low Income**: Red
  - **Medium Income**: Yellow
  - **High Income**: Green
  - **Very High Income**: Dark Green
  - **Adopted**: Green shades
  - **Not Adopted**: Red shades

### Admin Panel (Future Implementation)
- Admins can update adoption statuses, view logs, and manage other metadata.

## Key Files

### `IncomeLayer.js`
- Displays GeoJSON layers for income and adoption statuses.
- Highlights polygons with color codes based on `adoption_status`.

### `Legend.js`
- Displays the map legend dynamically.

### `authMiddleware.js`
- Handles authentication for admin access.

### `geoUtils.js`
- Utility functions to handle GeoJSON data processing.

## Future Improvements
1. **Admin Panel Integration**:
   - Create a backend API to store adoption metadata and audit logs.
   - Use a Node.js server for data updates and role-based authentication.
2. **Enhanced Authentication**:
   - Implement secure login using JWT or OAuth.
3. **Mobile Responsiveness**:
   - Make the map fully responsive across devices.
4. **Data Updates**:
   - Integrate an external API or admin interface to update census and income data dynamically.

## Contribution Guidelines
- Fork the repository and create a feature branch.
- Ensure all PRs pass linting and are accompanied by proper documentation.
- Submit a pull request with a detailed explanation of changes.

## Contact
For further information or to report issues, please contact:
- **Maintainer**: [Your Organization Name]
- **Email**: support@valyriastudios.com

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
