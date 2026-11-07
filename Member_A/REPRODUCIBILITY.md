
# Member A — Reproducibility Guide

## 1. Environment

The experiments were conducted using Google Colab with GPU acceleration.

The final model uses:

- PyTorch
- Segmentation Models PyTorch
- U-Net architecture
- ResNet-34 encoder
- ImageNet pretrained weights

See `requirements.txt` for the Python dependencies.

## 2. Dataset

Dataset: Sen1Floods11 Hand-Labeled Dataset.

The dataset contains Sentinel-1 VV and VH SAR imagery with corresponding flood labels.

Dataset splits used:

| Split | Images |
|---|---:|
| Training | 251 |
| Validation | 86 |
| Testing | 88 |
| Total | 425 |

Raw imagery and labels are not included in this GitHub directory.

The original workflow retrieves dataset files from the Sen1Floods11 Google Cloud Storage source.

## 3. Model Training

The final experiment uses:

- U-Net with ResNet-34 encoder
- Two input channels: VV and VH
- One output channel
- Binary Cross-Entropy + Dice Loss
- Adam optimizer
- Learning rate: 0.0001
- Maximum epochs: 25
- Early stopping patience: 7

Best checkpoint: Epoch 22.

## 4. Final Test Performance

| Metric | Result |
|---|---:|
| IoU | 0.63606 |
| Dice | 0.77755 |
| Precision | 0.79404 |
| Recall | 0.76174 |
| Accuracy | 0.94638 |
| Specificity | 0.97228 |

These metrics were obtained on the unseen test split.

## 5. Amphan Cross-Event Analysis

The final trained model was applied to pre-event and post-event Sentinel-1 imagery associated with Cyclone Amphan.

Weighted tile blending was also used to reduce patch-boundary artefacts.

| Measurement | Predicted area |
|---|---:|
| Pre-event water | 18.8729 km² |
| Post-event water | 17.9365 km² |
| Newly predicted water | 0.1575 km² |
| Water no longer predicted | 1.0939 km² |
| Net predicted change | -0.9364 km² |

These represent model-predicted changes and should not be interpreted as independently validated flood-area measurements.

## 6. Google Drive Artifacts

The shared Google Drive contains the final project artifacts.

Location: `flood_mapping/Member_A/`

| Folder | Contents |
|---|---|
| 01_Notebooks | Final Colab notebook |
| 02_Model_Checkpoints | Best and latest model checkpoints |
| 03_Training_Logs | Training history and normalization statistics |
| 04_Test_Evaluation | Test metrics and error analysis |
| 05_Amphan_Results | GeoTIFF outputs, graphs and cluster analysis |
| 06_Documentation | Project documentation |

## 7. Reproduction Instructions

1. Open `Member_A_Final.ipynb` in Google Colab.
2. Connect Google Drive.
3. Obtain the Sen1Floods11 dataset files using the dataset acquisition cells.
4. Check the project directory and file paths.
5. Install any missing dependencies from `requirements.txt`.
6. Execute the notebook cells in their intended order.
7. Train the model using the training cells.
8. Evaluate the best checkpoint on the unseen test split.
9. Run the Amphan inference and analysis sections.

Do not assume that the notebook can be executed from top to bottom without checking its data paths and runtime requirements.

## 8. Model and Result Storage

Large model checkpoints, GeoTIFF files and experimental outputs are stored in the shared Google Drive rather than committed to GitHub.

This keeps the GitHub repository lightweight while allowing project members to access the experimental artifacts.
