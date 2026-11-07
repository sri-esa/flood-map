
# Member A — Cross-Event Flood Mapping

## Overview

This contribution focuses on Sentinel-1 SAR-based flood segmentation and cross-event flood mapping using a U-Net deep learning model.

## Model Architecture

- Architecture: U-Net
- Encoder: ResNet-34
- Encoder weights: ImageNet pretrained
- Input channels: Sentinel-1 VV and VH
- Output channels: 1
- Loss function: Binary Cross-Entropy + Dice Loss

## Dataset

Sen1Floods11 hand-labelled dataset.

| Split | Images |
|---|---:|
| Training | 251 |
| Validation | 86 |
| Testing | 88 |
| Total | 425 |

## Final Test Results

| Metric | Score |
|---|---:|
| IoU | 0.63606 |
| Dice | 0.77755 |
| Precision | 0.79404 |
| Recall | 0.76174 |
| Accuracy | 0.94638 |
| Specificity | 0.97228 |

Best checkpoint: Epoch 22.

## Amphan Cross-Event Analysis

The trained model was applied to pre-event and post-event Sentinel-1 imagery for the Amphan experiment.

Weighted blended predictions:

| Measurement | Area |
|---|---:|
| Pre-event predicted water | 18.8729 km² |
| Post-event predicted water | 17.9365 km² |
| Newly predicted water | 0.1575 km² |
| Water no longer predicted | 1.0939 km² |
| Net predicted change | -0.9364 km² |

These are model predictions, not independently verified flood-area measurements.

## Google Drive Structure

The complete notebook, checkpoints, logs, evaluation reports and Amphan outputs are maintained in the shared Google Drive under `flood_mapping/Member_A`.

- 01_Notebooks
- 02_Model_Checkpoints
- 03_Training_Logs
- 04_Test_Evaluation
- 05_Amphan_Results
- 06_Documentation

## Reproducibility

Refer to `01_Notebooks/Member_A_Final.ipynb` in the shared Google Drive for the complete experimental workflow.

Large model checkpoints and GeoTIFF outputs are maintained in Google Drive rather than committed to this repository.
