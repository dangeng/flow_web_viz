'''
Convert a tensor, stored as .pth, representing a flow
of shape [1,2,H,W], denoting pixel offsets,
into a json object. json object consists of list 
of lists of [dx,dy]
'''
import argparse
import json
import numpy as np
import torch
from pathlib import Path

# Get args (path to flow)
parser = argparse.ArgumentParser()
parser.add_argument('--flow_path', 
                    required=True, 
                    help='Path to .pth flow. Size [1,2,H,W]')
args = parser.parse_args()
flow_path = Path(args.flow_path)

# Load flow
flow = torch.load(flow_path)
flow = flow.numpy()[0]

# Convert flow to json file (just list of lists)
dirs_grid = []
for i in range(512):
    dirs_row = []
    for j in range(512):
        dx, dy = flow[:, i, j]
        dx = np.round(dx)
        dy = np.round(dy)
        dirs_row.append([int(dx), int(dy)])
    dirs_grid.append(dirs_row)

# Dump json file
with open(flow_path.with_suffix('.json'), 'w') as f:
    json.dump(dirs_grid, f)
