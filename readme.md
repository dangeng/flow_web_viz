# Flow Web Visualization

This repo contains a minimum working example of a way to interactively visualize optical flow in the browser. An optical flow is displayed as is done normally, with a color map. But on mouseover an arrow is drawn on top of the flow to give the user a better sense of the motion.

This is done by preprocessing the flow into a json file of offsets, and binding event listeners to canvases.

### Getting Started

To run locally, start a webserver (to avoid CORS complaints from browser when loading jsons) with

```
python -m http.server
```

Then navigate to the webserver (probably `http://localhost:8000/`, but check the port number).

### Making JSON files

To make the json file of offsets, see the script in `assets/make_json.py`. To run, the following should work:

```
python make_json.py --flow_path topiary.v1.heavyFatBG/flow.pth
```
