
# Cross-Event Flood Mapping

A SAR-based flood mapping project using deep learning for flood segmentation and cross-event water-change analysis.

## Project Structure

```text
flood-map/
├── data/
│   ├── aoi.geojson
│   └── README.md
├── src/
│   └── README.md
├── notebooks/
│   ├── Member_A_Final.ipynb
│   ├── Member_A_Reproducible_Ready.ipynb
│   └── README.md
├── results/
│   ├── member_a_final_artifact_manifest.csv
│   └── README.md
├── report/
│   ├── REPRODUCIBILITY.md
│   └── README.md
├── README.md
└── requirements.txt
```

## Project Overview

The project uses Sentinel-1 SAR imagery for flood segmentation and cross-event water-change analysis.

The Member A contribution includes:
- Dataset preparation and preprocessing.
- U-Net model restoration and evaluation.
- Unseen test-set evaluation.
- Amphan pre-event and post-event flood mapping.
- Weighted tile blending.
- Spatial transition cluster analysis.
- Prediction threshold sensitivity analysis.

## Model Architecture

- Architecture: U-Net
- Encoder: ResNet34
- Input channels: 2 (VV and VH)
- Output channels: 1 (binary segmentation)
- Best checkpoint epoch: 22
- Best validation IoU: 0.638658
- Prediction threshold: 0.5

## Test Evaluation

| Metric | Result |
|---|---:|
| IoU | 0.63605 |
| Dice | 0.77755 |
| Precision | 0.79409 |
| Recall | 0.76168 |
| Accuracy | 0.94638 |
| Specificity | 0.97229 |

Evaluation was performed on 88 unseen test images.

## Amphan Flood Mapping

Weighted blended zero-shot inference results:

| Measurement | Result |
|---|---:|
| Pre-event predicted water | 18.8736 km² |
| Post-event predicted water | 17.9362 km² |
| Newly predicted water | 0.1577 km² |
| Water no longer predicted | 1.0951 km² |
| Net predicted change | -0.9374 km² |
| Jaccard similarity | 0.93417 |

These measurements represent model predictions and should not be interpreted as independently verified flood-area measurements.

## Threshold Sensitivity

Five thresholds were evaluated: 0.3, 0.4, 0.5, 0.6 and 0.7.

The primary prediction threshold remains 0.5, as specified by the selected checkpoint.

## Data and Reproduction

Large SAR datasets, processed datasets and model checkpoints are maintained separately in Google Drive rather than being uploaded to this repository.

See:
- `data/README.md` for dataset organisation.
- `report/REPRODUCIBILITY.md` for reproduction instructions.
- `notebooks/` for the project notebooks.
- `results/member_a_final_artifact_manifest.csv` for the verified artifact inventory.

## Artifact Verification

The final Member A artifact audit verified:

- Expected artifacts: 17
- Available artifacts: 17
- Missing artifacts: 0

