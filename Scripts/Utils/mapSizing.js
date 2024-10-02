// Scripts/Utils/mapSizing.js

export function setupMapSizing(container, data, projection) {
  const height = container.clientHeight * 0.8;

  const path = d3.geoPath().projection(projection);

  // Get bounding box of the map features
  const bounds = path.bounds(data);
  const topLeft = bounds[0];
  const bottomRight = bounds[1];

  // Calculate the map width and height based on bounding box
  const mapWidth = bottomRight[0] - topLeft[0];
  const mapHeight = bottomRight[1] - topLeft[1];

  // Define the width scale and the height scale based on the container's height
  const widthScale = (mapWidth / mapHeight) * height;
  const scale = (height / (bottomRight[1] - topLeft[1])) * 0.95;

  // Set the translation to center the map inside the container
  const offsetX =
    (widthScale - (bottomRight[0] - topLeft[0]) * scale) / 2 -
    topLeft[0] * scale;
  const offsetY =
    (height - (bottomRight[1] - topLeft[1]) * scale) / 2 - topLeft[1] * scale;

  // Return the computed sizes, projection, and path
  return {
    widthScale,
    height,
    projection: projection.scale(scale).translate([offsetX, offsetY]),
    path,
  };
}
