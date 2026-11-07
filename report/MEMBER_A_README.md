# Member A — Cross-Event Flood Mapping

## 1. Project Overview

This contribution implements a reproducible workflow for SAR-based
flood mapping and cross-event water-change analysis.

The workflow includes dataset preparation, model restoration,
unseen test evaluation, Amphan pre/post-event inference,
transition analysis, and threshold sensitivity analysis.

## 2. Model Architecture

- Architecture: U-Net
- Encoder: ResNet34
- Input channels: 2 (SAR VV and VH)
- Output channels: 1 (binary segmentation)
- Best checkpoint epoch: 22
- Best validation IoU: 0.638658
- Prediction threshold: 0.5

The saved checkpoint is restored for evaluation and inference.

## 3. Dataset and Preprocessing

Dataset split sizes:

| Split | Images |
|---|---:|
| Training | 251 |
| Validation | 86 |
| Testing | 88 |

Preprocessing includes clipped normalization, no-data masking,
and training augmentation with random crops, flips and rotations.

## 4. Unseen Test Evaluation

Global test metrics:

| Metric | Result |
|---|---:|
| IoU | 0.63605 |
| Dice | 0.77755 |
| Precision | 0.79409 |
| Recall | 0.76168 |
| Accuracy | 0.94638 |
| Specificity | 0.97229 |
| Macro positive-image IoU | 0.41107 |

Evaluation was performed on 88 unseen test images.

## 5. Amphan Zero-Shot Flood Mapping

Input image information:

- Dimensions: 1047 × 1120
- CRS: EPSG:32645
- Common valid pixels: 1,146,638
- Prediction threshold: 0.5

Weighted blended inference results:

| Measurement | Result |
|---|---:|
| Pre-event predicted water | 18.8736 km² |
| Post-event predicted water | 17.9362 km² |
| Persistent water | 17.7785 km² |
| Newly predicted water | 0.1577 km² |
| Water no longer predicted | 1.0951 km² |
| Net predicted water change | -0.9374 km² |
| Jaccard similarity | 0.93417 |

These values represent model predictions, not independently
verified measurements of actual flood-area change.

## 6. Transition Cluster Analysis

Newly predicted water:
- Number of clusters: 691
- Largest cluster: 46 pixels
- Clusters with at least 100 pixels: 0

Water no longer predicted:
- Number of clusters: 1730
- Largest cluster: 2665 pixels
- Clusters with at least 100 pixels: 8

## 7. Threshold Sensitivity

Thresholds evaluated: 0.3, 0.4, 0.5, 0.6 and 0.7.

The highest pre/post map Jaccard similarity was 0.93886 at
threshold 0.4.

The primary prediction threshold remains 0.5, as stored
in the selected checkpoint.

Map Jaccard similarity measures overlap between the two
predicted maps; it is not ground-truth segmentation accuracy.

## 8. Project Structure

Member_A/
- 01_Notebooks/
  - Member_A_Reproducible_Ready.ipynb
- 07_Reproduction_Workspace/
  - checkpoints/
  - data/
  - logs/
  - results/
  - member_a_final_artifact_manifest.csv
- README.md

## 9. Reproduction Instructions

1. Open Member_A_Reproducible_Ready.ipynb in Google Colab.
2. Mount Google Drive.
3. Confirm the project directory points to:
   /content/drive/MyDrive/Member_A/07_Reproduction_Workspace
4. Install the notebook's required dependencies.
   The verified environment used segmentation-models-pytorch 0.6.0.
5. Execute the notebook sections in order.
6. Restore the saved checkpoint before evaluation and inference.
7. Run the Amphan inference and subsequent analysis sections.
8. Run the final artifact audit to verify generated outputs.

Use the saved checkpoint for reproduction; model retraining
is not required for the evaluation and inference workflow.

## 10. Artifact Verification

Final artifact audit:

- Expected artifacts: 17
- Available artifacts: 17
- Missing artifacts: 0

Manifest:
07_Reproduction_Workspace/member_a_final_artifact_manifest.csv

All 17 expected artifacts were verified in the final audit.
