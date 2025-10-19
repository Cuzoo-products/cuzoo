# Google Maps API Setup Guide

## Environment Variable Setup

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Google Maps API key:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key
5. Restrict the API Key (recommended):
   - Click on the API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:5174/*`, `yourdomain.com/*`)
   - Under "API restrictions", select "Restrict key" and choose "Places API"

## Usage

The GooglePlacesInput component will automatically:

- Load the Google Maps API script with the new Places library
- Initialize the modern PlaceAutocompleteElement web component
- Return Google Maps place IDs when addresses are selected
- Use the new `gmp-placeselect` event for place selection

## Example

```typescript
<GooglePlacesInput
  onChange={(placeId, address) => {
    console.log("Place ID:", placeId);
    console.log("Address:", address);
  }}
  placeholder="Enter address"
/>
```

## Troubleshooting

- **"Google Maps API key not found"**: Make sure `VITE_GOOGLE_MAPS_API_KEY` is set in your `.env` file
- **"Failed to load Google Maps API"**: Check your API key and ensure Places API is enabled
- **No suggestions appearing**: Verify your API key has Places API access and check browser console for errors
- **Component not rendering**: Make sure you're using the new Places API (PlaceAutocompleteElement) which is required as of March 1st, 2025
- **TypeScript errors**: The component uses modern web components, so ensure your TypeScript configuration supports them
