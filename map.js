// Initialize the map
const map = L.map('map').setView([30, 0], 2); // Centered at midpoint with zoom level 2

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Coordinates
const indiaCoords = [12.9716, 77.5946]; // Bangalore, India
const usCoords = [38.9072, -77.0369];  // Washington, D.C., USA
const controlCoords = [70, -15]; // More curve adjustment

// Add location markers
const indiaMarker = L.marker(indiaCoords, { title: "Bangalore, India" }).addTo(map);
const usMarker = L.marker(usCoords, { title: "Washington, D.C., USA" }).addTo(map);

// Add name placeholders
indiaMarker.bindPopup('<div class="location-label">Bangalore, India</div>').openPopup();
usMarker.bindPopup('<div class="location-label">Washington, D.C., USA</div>');

// Plane marker
const planeIcon = L.divIcon({
    className: 'plane-wrapper',
    html: '<i class="fa-solid fa-plane-departure fa-flip-horizontal fa-xl" style="color: #0b61a2;"></i>',
    iconSize: [24, 24]
});

const planeMarker = L.marker(indiaCoords, { icon: planeIcon }).addTo(map);

// Generate intermediate points along the curve
const generateCurvePoints = (start, control, end, steps) => {
    const points = [];
    for (let t = 0; t <= 1; t += 1 / steps) {
        const lat =
            (1 - t) * (1 - t) * start[0] +
            2 * (1 - t) * t * control[0] +
            t * t * end[0];
        const lng =
            (1 - t) * (1 - t) * start[1] +
            2 * (1 - t) * t * control[1] +
            t * t * end[1];
        points.push([lat, lng]);
    }
    return points;
};

const pathPoints = generateCurvePoints(indiaCoords, controlCoords, usCoords, 200);

// Animation variables
let currentStep = 0;

const animatePlane = () => {
    if (currentStep < pathPoints.length) {
        const nextPosition = pathPoints[currentStep];
        planeMarker.setLatLng(nextPosition); // Move the plane
        currentStep++;
        setTimeout(animatePlane, 20); // Adjust animation speed
    }
};

animatePlane();

// Draw dotted path line for reference
L.polyline(pathPoints, { 
    color: 'blue', 
    weight: 2, 
    dashArray: '5, 10' // Make the line dotted
}).addTo(map);