# Bengal dataset log: AOI H, Cyclone Amphan

Items marked TODO still need filling in.

## Area of interest

- Box [west, south, east, north]: [88.4, 21.75, 88.9, 22.25], about 2,859 km2
- File: `aoi.geojson` (H is primary, B and C were candidates only)

## Sentinel-1 scenes

GEE collection `COPERNICUS/S1_GRD`, IW mode, VV and VH, descending pass, relative orbit 150. Values are in dB, processed by GEE (thermal noise removal, calibration, terrain correction), with no speckle filter.

| Role | Scene ID | Acquired (UTC) |
| --- | --- | --- |
| Pre-event (used) | S1A_IW_GRDH_1SDV_20200516T235636_20200516T235701_032597_03C685_E3B0 | 2020-05-16 23:56:36 |
| Post-event (used) | TODO: paste the 28 May scene ID | 2020-05-28 (TODO: time) |
| First post-event scene (extra, not used in labels) | S1B_IW_GRDH_1SDV_20200522T235550_20200522T235615_021701_029311_F87B | 2020-05-22 23:55:50 |

The 22 May scene was exported first. It is kept as an extra. The labels use 28 May.

## Sentinel-2 scenes (supporting check only)

GEE collection `COPERNICUS/S2_SR_HARMONIZED`, tile 45QXE.

| Role | Product ID | Acquired (UTC) |
| --- | --- | --- |
| Post-event reference | TODO | 2020-05-29 (TODO: time) |
| Pre-event colour reference | TODO | 2020-05-14 (TODO: time) |

- 29 May was chosen because it is about 5 hours from the 28 May radar scene and has the best clear share of the post-event dates that pair with orbit 150.
- Clear pixels: Cloud Score+ at 0.6 or higher, with a 300 m buffer around cloud and shadow. 38.9% of the AOI is clear after the buffer.

## Label rule v1 (frozen)

Script: `label_rule_v1.js`. All label logic runs on a 30 m grid (EPSG:32645).

| Setting | Value |
| --- | --- |
| Post-event VH below | -18 dB |
| Drop from pre to post | at least 2 dB |
| Pre-event water (radar) | VH below -24 dB |
| Pre-event water (optical) | MNDWI above 0, clear pixels, 11 to 19 May |
| Pre-event water (JRC) | occurrence above 50% |
| Minimum blob size | 3 pixels (about 0.27 ha at 30 m) |

Flood = dark and dropped in the radar, minus anything already water before the cyclone, minus tiny blobs.

## Numbers from the frozen run

| Quantity | Value |
| --- | --- |
| AOI | 2,858.5 km2 |
| Flood label | 58.0 km2 (2.0% of the AOI) |
| Flood on cropland | 56.2 km2 (97%) |
| Flood on tree cover | 0.92 km2 |
| Flood on mangrove | 0.07 km2 |
| Flood on built-up | 0.02 km2 |
| Clear optical area (after buffer) | 1,112.8 km2 |
| Flood inside clear area | 23.8 km2 |
| S2 new water inside clear area | 36.0 km2 |
| Overlap of the two | 12.9 km2 |
| Precision against S2 | 0.54 |
| Recall against S2 | 0.36 |

## Decisions and reasons

- **Label source:** Sentinel-1 change detection. Sentinel-2 on 29 May is a supporting check only.
- **No ready-made labels:** Copernicus EMS EMSR439 covers Bashan Char in Bangladesh only. UNOSAT and Charter products focus on Bangladesh, plus IWMI maps for West Bengal that were not confirmed downloadable.
- **Why not Sentinel-2 as the labels:** the best post-event scenes are mostly cloudy, and MNDWI barely separated real flood from mud in the blind checks.
- **Blind patch check 1** (18 points, 6 per class): 12 real flood, 3 mud or wet soil, 2 wet before, 1 can't tell. Of the 12 points the S1 label flagged, 9 were real. S1-only points were 5 of 6 real. S2-only points were 3 of 5 judgeable real.
- **Blind patch check 2** (16 points, 15 recorded here):
  - Looser rule (post VH below -17 dB, drop of at least 1 dB): 8 added points, 0 real. Rejected.
  - Small blobs (2 to 4 pixels): 4 of 4 real. This is why the minimum blob size went from 5 to 3.
  - Current-rule controls: 3 of 3 real so far (TODO: add row 16).
- These checks used small samples and show direction, not accuracy.

## Known limitations (for the report)

- The post-event image is 8 days after landfall (20 May), so the label shows lingering flooding, not the surge peak.
- Flood is found almost only on cropland. Mangroves have essentially no positives, so the transfer test cannot cover that class.
- Only about 39% of the AOI can be checked against optical imagery.
- Sentinel-2 MNDWI over-calls weak water, so agreement with it is a rough guide only.
- Ponds that were wet before the cyclone can slip through the pre-event water mask. Hand-correction handles these by shape.
- Tide state differs between acquisitions.
- The labels come from the same sensor family as the model input, so the Otsu baseline (E0) may look better than it deserves.
- The candidate label is on a 30 m grid. Hand-correction is done at 10 m.

## Files

- `aoi.geojson`
- `label_rule_v1.js`
- Chips, labels and split CSV (to come)