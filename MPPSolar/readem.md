
List of tested MPPSolar Inverters

- PIP7248MAX
- PIP8048MAX
- PIP1048MAX

We use solpiplog to the read via RS232 
Then solPipLog send the data to mqtt.

A Java Script does some nice calculations, have a look at 

you find a matching VIS view for ioBroker in the VIS directory.
Also a preview png.

VIS/menu.txt     -> Menu View
VIS/pip.png      -> Screen shot as an example
VIS/pip5kw.js    -> Calculation script PIP5048 (only charging)
VIS/pipMax.js    -> Calculation for PIP-MAX converter
VIS/pip_vis.txt  -> VIS for Inverter. (see pip.png)