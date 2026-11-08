// ===== LABEL RULE v1 (FROZEN) =====
// AOI H, Cyclone Amphan, Sentinel-1 change detection.
// S1 pre: 16 May 2020, post: 28 May 2020 (descending, relative orbit 150).
// S2 29 May 2020 is a supporting check only. All label logic runs on a 30 m grid.

var aoi = ee.Geometry.Rectangle([88.4, 21.75, 88.9, 22.25]);

// ----- Settings (frozen) -----
var ANALYSIS_M = 30;
var CS_THRESH = 0.6;   // Cloud Score+ clear threshold
var BUFFER_M = 300;    // buffer around cloud and shadow
var VH_WATER = -18;    // post-event VH below this (dB)
var CHANGE_DB = -2;    // post minus pre must be below this (dB)
var PRE_WATER = -24;   // pre-event VH below this counts as already water (dB)
var MIN_PX = 3;        // drop flood blobs under this many 30 m pixels

var P = ee.Projection('EPSG:32645').atScale(ANALYSIS_M);

function toGrid(img) {
  return img.reduceResolution({reducer: ee.Reducer.mean(), maxPixels: 64}).reproject(P);
}

// ----- Sentinel-1 -----
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(aoi)
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
  .filter(ee.Filter.eq('relativeOrbitNumber_start', 150))
  .filter(ee.Filter.contains({leftField: '.geo', rightValue: aoi}));

var rawPre = ee.Image(s1.filterDate('2020-05-16', '2020-05-17').first()).select('VH');
var rawPost = ee.Image(s1.filterDate('2020-05-28', '2020-05-29').first()).select('VH');
var preVH = toGrid(rawPre);
var postVH = toGrid(rawPost);

// ----- Sentinel-2 with Cloud Score+ -----
var csPlus = ee.ImageCollection('GOOGLE/CLOUD_SCORE_PLUS/V1/S2_HARMONIZED');
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi)
  .linkCollection(csPlus, ['cs_cdf']);
var s2pre = ee.Image(s2.filterDate('2020-05-14', '2020-05-15').first());
var s2day = ee.Image(s2.filterDate('2020-05-29', '2020-05-30').first());

function clearGrid(img) {
  return toGrid(img.select('cs_cdf')).gte(CS_THRESH);
}

// ----- Water that existed before the cyclone -----
var preWaterS2 = s2.filterDate('2020-05-11', '2020-05-20').map(function (img) {
  return toGrid(img.normalizedDifference(['B3', 'B11'])).updateMask(clearGrid(img));
}).median().gt(0).reproject(P);
var jrc = ee.Image('JRC/GSW1_4/GlobalSurfaceWater').select('occurrence');
var permanent = jrc.gt(50).unmask(0).reproject(P);
var alreadyWater = preVH.lt(PRE_WATER).or(preWaterS2.unmask(0)).or(permanent);

// ----- FLOOD LABEL -----
var raw = postVH.lt(VH_WATER)
  .and(postVH.subtract(preVH).lt(CHANGE_DB))
  .and(alreadyWater.not());
var flood = raw.and(raw.connectedPixelCount(100, true).gte(MIN_PX)).rename('flood');

// ----- Optical clear mask and S2 supporting water -----
var clearBuf = clearGrid(s2day).not()
  .focal_max(BUFFER_M, 'circle', 'meters')
  .not().rename('clear');
var mndwi = toGrid(s2day.normalizedDifference(['B3', 'B11']));
var s2New = mndwi.gt(0).and(alreadyWater.not()).and(clearBuf);
s2New = s2New.focal_min(1, 'circle', 'pixels').focal_max(1, 'circle', 'pixels');

// ----- Land cover -----
var wc = ee.ImageCollection('ESA/WorldCover/v200').first().select('Map')
  .reduceResolution({reducer: ee.Reducer.mode(), maxPixels: 64}).reproject(P);

// ----- Numbers for data_log.md -----
var pxKm2 = ee.Image.pixelArea().divide(1e6);
function areas(masks) {
  var names = Object.keys(masks);
  var stack = ee.Image.cat(names.map(function (n) {
    return masks[n].unmask(0).rename(n);
  }));
  return stack.multiply(pxKm2).reduceRegion({
    reducer: ee.Reducer.sum(), geometry: aoi,
    crs: 'EPSG:32645', scale: ANALYSIS_M, maxPixels: 1e10
  });
}
var A = areas({
  aoi: ee.Image(1),
  clear: clearBuf,
  flood: flood,
  flood_clear: flood.and(clearBuf),
  s2new: s2New,
  overlap: flood.and(s2New),
  on_cropland: flood.and(wc.eq(40)),
  on_tree_cover: flood.and(wc.eq(10)),
  on_mangrove: flood.and(wc.eq(95)),
  on_built_up: flood.and(wc.eq(50))
});
print('Frozen rule v1, areas (km2):', A);
var ov = ee.Number(A.get('overlap'));
print('Frozen rule v1, agreement with S2 in clear areas:', ee.Dictionary({
  precision_vs_s2: ov.divide(A.get('flood_clear')),
  recall_vs_s2: ov.divide(A.get('s2new'))
}));

// ----- Map -----
Map.centerObject(aoi, 11);
Map.addLayer(s2day, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'S2 true colour 29 May');
Map.addLayer(s2pre, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'S2 true colour 14 May', false);
Map.addLayer(alreadyWater.selfMask(), {palette: ['0000ff']}, 'Water before event', false);
Map.addLayer(clearBuf.selfMask(), {palette: ['00ff00']}, 'Clear after buffer', false);
Map.addLayer(flood.selfMask(), {palette: ['ff0000']}, 'FLOOD LABEL v1');
Map.addLayer(ee.FeatureCollection([ee.Feature(aoi)])
  .style({color: 'white', fillColor: '00000000', width: 2}), {}, 'AOI H');