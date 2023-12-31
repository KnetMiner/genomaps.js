# Development Guide

This document describe implementation details about Genomaps.js and how to deal with code changes and
extensions. See [here](UseGuide.md) for a guide on how to use the library.

## Requirements and first time installation

You need the following to build Genomap.js for the first time:

- [Node.js](https://nodejs.org/en/download/)
- NPM
- [Git](https://git-scm.com/), to clone the github repository on your PC.
- Install all dependencies: `npm install`

See [package.json](../package.json) for a list of dependencies and their versions.

## To test Genomap.js:

Genomap.js can be build via the command `npm run build`, issued from its code base root.

If that succeds, run `npm run demo` to start a demo application, reachable at http://localhost:8000/  

The `npm run demoDev` variant is the same application, but with a set of development additions, including a watch mechanism that auto-updates the server files as they are modified.

`npm run clean` removes all the build files (including NPM downloads) and allows from a fresh rebuild.

The names after run are defined in `package.json`, some of which, in turn, invokes `gulpfile.js` goals (see next section). 

## Details about the build system

The Genomaps.js build system is based on NPM and Gulp. Namely: 

* The build process is started from NPM, which lookup for actions to run in the `scripts` section of the `package.json` file
* Gulp is used for most of the building process, such as cleaning directories, packing all the dependencies in single files into `dist/`, running the test/demo server.

These are the main tasks available from the [Gulp file](gulpfile.js):

* *build* builds the combined & minified JavaScript and CSS files placing them into the `dist` folder
* *demo*: starts a test/demo server
* *demoDev*: starts the demo server, in dev mode (eg, auto-updates server files) 
* *vet* does some static code analysis


## Dependencies

Genomaps.js has been primarily written in d3.js, but Bootstrap is also used for the infobox popovers, which, in turn, requires jQuery.

These are other relevant libraries that we use:

* lodash - utility functions
* d3.promise.js - adds promises to d3's file reading functions
* simple-statistics - for the ckmeans clustering algorithm
* loglevel - for logging


## Design patterns

The d3 components have been written using Mike Bostock's [reusable charts pattern](https://bost.ocks.org/mike/chart/). The non-d3 objects have been written using closure functions with getters and setters i.e.:

	GENEMAP.Person = function(name, age) {
	  var my = {};

	  var privateFn = function() { ... }

	  my.publicFn = function(a, b, c) { ...}

	  my.age = function(value) {
		  if (!arguments.length) return age;
		  age = value;
		  return my;
	  }

	  return my;	  
	}

This was to keep them similar to the d3 objects. If the number of these objects increase it is recommended to switch using a prototype constructor pattern to avoid the overhead of duplicated function objects.

I've tried to use a global module `var GENEMAP = GENEMAP || {};` and attached all the object to this module but I've not used the module pattern to isolate the dependencies of each object. This is something that may be necessary as the codebase grows.


## Layout

The map is drawn within a contained element, the id of which has to be passed to the .draw() method.

The basic constructed layout is

- The menu markup (menu_bar.js), a `<div>` containing the buttons to control the map
- The SVG container (genemap.js), the map creates its own SVG element to contain the drawing
- zoom window (genemap.js), this is a wrapper that has the d3 zoom functionality added to it
- outline (genemap.js), this draws the document outline and sets the backgorund color
- cell containers (chromosome_cell.js), a list of cell cotnainers to contain each of the chromosomes
- gene-annotations (gene_annotations.js), a container for all the gene annotations
- qtl-annotations (qtl_annotations.js), a container for all the QTL annotations
- chromosome (chromosome.js), a container for the chromosome image
- chromosome-label (chromosome_cell.js), a container for the chromosome label


The chromosome container contents is generated by the chromosome.js code and has the following structure:

```javascript
g.chromosome - a group for each chromosome defined
	defs
		mask - the mask used for this chromosome
	text - the top label of the chromosome
	background - sets the white background
	bands-container - contains the bands and uses the mask
		bands - a collection of colored rectangular bands
	outline - the black outline to the chromosome
```

The bands themselves are drawn as a stack of rectangles, to achieve the rounded corners a rounded rectangle mask is defined and applied to the bands container. 
To get the black outline another rounded rectangle is drawn over the top of the bands container.
The background is needed to prevent any annotation lines showing through the middle of the chromosome where there are no bands.

Even though the chromosomes and annotations share the same data I decided to draw them using separate components to simplify the individual components.

## Data processing

The data is read from one or two XML files.
It is then processed by the processor, this alters the colors and combines the data into a single genome object.

```
genome
	chromosomes
		annotations
			genes
			qtls
		bands
```
			
## Layout generation

The layout functions in `auto_layout.js`, `gene_annotation_layout.js` and `gene_bands_layout.js` decorate the genome object
 with computed objects specifying how the chromosome bands and annotations should be displayed.

```
genome
    cellLayout
	chromosomes
          cell
	    layout
	        annotationClusters
	        annotationDisplayClusters
	        annotationNodes
	        
	        geneBandClusters
	        geneBandDisplayClusters
	        geneBandNodeso
```
		        
## Global Layout
`cellLayout` contains the global properties for the whole layout.
`chromosome.cell` contains the positioning information for a single chromsome cell.

The layout of the cell containers and the elements within them is control by the layout decorator (auto_layout.js).
This 'decorates' the genome data object with some layout properties that are used by the cell containers to position the cells themselves and their contents.

The position of each of the cells is calculated as follows:

 - The number of cells is calculated (number of rows and columns) based on the number of chromosomes and the number of chromosomes to put on each row.
 - Once the number of rows and columns is calculated the space (excluding the margin) is divided into these cells. This means all chromosomes will be initially visible.

The position and size of the gene-annotations, qtl-annotations, chromosome and chromosome label within the cell is calculated by:

 - The top and bottom margins and the height of the cell label is calculated as a percentage of the cell's height, the rest of the cell's height is given to the chromosome.
 - The chromosome's width is then calculated based on the aspect ratio of the chromosome. The left and right margins are calculated as a percentage of the width, the rest of the space is given to the QTL annotations (to the left of the chromosome) and the gene-annotations (to the right of the chromosome) equally.

## Individual annotation layout
`chromsome.layout` contains the computed layout for individual gene bands and annotations. 

For xxx = annotation or geneBand:

- `xxxClusters` are groups of several genes which have been merged to make it easier to display them.
- `xxxDisplayClusters` are the clusters currently being displayed (may differ from `Clusters` if a clusters has been expanded).
- `xxxNodes` contain the actual positioning and colouring information (generated by labella in the case of gene annotations).

## Infobox

The infoboxes are the popovers that appear when the annotations are clicked. They are twitter bootstrap popovers that are triggered on click (as opposed to hover).
 To dismiss them when something else is clicked there is a click handler on the html element that clears all popovers.

## Logging

Logging is handled by the loglevel library:

```javascript
log.error( 'An error message' );
```

Log level can be set in the console window with `setLevel()` and will be persisted between sessions if the second argument is true. In index.html, `log.setDefaultLevel("info")` applies only if a previously persisted log level is not found.

## Icons
Icons come from the O-Collection.
They are downloaded in svg form, then converted to png of the correct size using inkscape. E.g:

```bash
$ inkscape --export-png=assets\img\information.png --export-width=36 --export-height=36 assets/svg/information.svg
```

The colours can be edited manually in the svg files.

## Namespaced bootstrap

TODO: does this still apply?

To avoid having to use bootstrap's css on the entire site I've generated a customised version of the bootstrap css based on the answer to a question on [Stack Overflow](http://stackoverflow.com/questions/13966259/how-to-namespace-twitter-bootstrap-so-styles-dont-conflict).

This was compiled using [WinLess](http://winless.org/) although any Less compiler should work.


## Tests

**TODO: outdated, to be reviewed**

There are a number of automated tests written in Jasmine. 
These tests aren't comprehensive but do cover several areas (particularly the areas that don't directly interact with the DOM). 
To run the tests run the `gulp serve-dev` process and navigate to http://localhost:8000/SpecRunner.html.

