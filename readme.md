Remote sensing resistance
================

This repository represents the entirety of the "remote sensing resistance" project which seeks to address the question: Does heterogeneity in forest structure make a forest resistant to wildfire? That is, does greater heterogeneity decrease wildfire severity when a fire inevitably occurs?

We rely on Google Earth Engine and R as our GIS. All Earth Engine code is in the ee-remote-sensing-resistance folder, which is itself a repository housed in Google's version control system. We mirror it here such that this repository remains a complete representation of the project.

The written manuscript is in the ms folder. The primary document is a .Rmd file, which is rendered as a .docx and as a .pdf. The .pdf is viewable on GitHub. I'm hoping this setup will allow programming-savy co-authors to interact with the code and the writing through the same version control framework, but also allow some flexibility for a more-typical "track changes on a Microsoft Word document" sort of relationship with the work.

## Data sources

### Jepson Ecoregion data for delineating "Sierra Nevada"

"Jepson Flora Project (eds.) 2016. Jepson eFlora, http://ucjeps.berkeley.edu/eflora/ [accessed on Mar 07, 2016]"

Contact Dr. David Baxter for a GIS layer.

### Fire Return Interval Departure data source for designating "yellow pine/mixed-conifer" (ypmc)

https://www.fs.usda.gov/detail/r5/landmanagement/gis/?cid=STELPRDB5327836

### Composite Burn Index (CBI) data sources

Zhu, Z.; C. Key; D. Ohlen; N. Benson. 2006. Evaluate Sensitivities of Burn-Severity Mapping Algorithms for Different Ecosystems and Fire Histories in the United States. Final Report to the Joint Fire Science Program, Project JFSP 01-1-4-12, October 12, 2006. 35pp. [link](https://archive.usgs.gov/archive/sites/www.nrmsc.usgs.gov/science/fire/cbi/plotdata.html)

Sikkink, Pamela G.; Dillon, Gregory K.; Keane,Robert E.; Morgan, Penelope; Karau, Eva C.; Holden, Zachary A.; Silverstein, Robin P. 2013. Composite Burn Index (CBI) data and field photos collected for the FIRESEV project, western United States. Fort Collins, CO: Forest Service Research Data Archive. [link](https://doi.org/10.2737/RDS-2013-0017)

## Reproducing the analysis

All scripts are numbered in the order of these steps. Note that some steps
involve uploading assets to Earth Engine, so these steps won't have a script
associated with them. In this case, there will be a discontinuity in the 
numbering of the scripts to highlight that there will be a step (of some kind)
to complete before moving on.

Raw data are found in "data/data_raw/". Data carpentry 
(aka munging/wrangling/cleaning) steps can be found in "data/data_carpentry/". 
The resulting data products from carpentry steps are stored in 
"data/data_output/".

Analyses scripts are found in "analyses/". Intermediate output (e.g., a summary
table from a model, a .rds file representing an R object of a long-running 
model) can be found in "analyses/analyses_output/"

1. data/data_carpentry/01_convert-jepson-ecoregions.R
2. In Earth Engine, run the 02_create-raster-template.js script to create a 
template raster co-registered with the Landsat product that will be used for
the yellow pine/mixed-conifer mask.
3. data/data_carpentry/03_create-ypmc-mask.R
4. data/data_carpentry/04_subset-frap-perimeter-database.R
5. data/data_carpentry/05_clean-cbi-data.R
6. Upload the CBI data output from 05_clean-cbi-data.R to Earth Engine. 
The Earth Engine asset is publicly available at: 
ee.FeatureCollection("users/mkoontz/cbi_sn")

7. In Earth Engine, run the 07_rsr-sn-cbi-calibration.js script to generate (and
export) eight .geoJSON files with the CBI plot information along with a number of
spectral severity calculations. Each .geoJSON file represents one combination of
interpolation type (bicubic or bilinear) and four time windows used to collate
the pre- and post-fire imagery (16, 32, 48, and 64 days). The resulting .geoJSON
files should be downloaded from your Google Drive and saved in:
"data/data_output/ee_cbi-calibration/"

8. analyses/08_cbi-k-fold-cross-validation.R

9. Upload the fire perimeters containing some yellow pine/mixed-conifer (ypmc) 
pixels output from the 04_subset-frap-perimeter-database.R script to Earth 
Engine. The Earth Engine asset is publicly available at: 
ee.FeatureCollection("users/mkoontz/fire18_1_sn_ypmc")

10. Using the best interpolation, spectral severity. and time window from the 
cross-fold validation, calculate the fire severity, vegetation characteristics,
and regional climate characteristics that we will use for modelling by running
the 10_rsr-frap-fires-assessment.js script in Earth Engine. The resulting 
.geoJSON should be downloaded from your Google Drive and saved as:
"data/data_output/ee_fire-samples/fires-strat-samples_2018_48-day-window_L4578_none-interp.geojson"

11. Prepare the fire samples for analysis by running 
"analyses/11_configure-fire-samples.R"

12. Build the primary analysis models for the paper (four separate models-- one
for each neighborhood window size) by running 
"analyses/12_probability-of-high-severity-build-models.R"

13. Summarize the posterior distributions of the estimated coefficients of
the models built in step 12 by running 
"analyses/13_probability-of-high-severity.R"

14. Perform model comparisons between models built at different scales to 
determine the primary scale of effect of the heterogeneity. Run the
"analyses/14_model-comparison.R" script.

15. Calculate summary information for the CBI calibration step by running
"analyses/15_cbi-summary-stats.R"

16. Calculate some additional attribute information for the USFS Region 5 GIS
dataset-- the current best severity dataset for the Sierra Nevada. 
Run "data/data_carpentry/16_ypmc-pixel-count-usfs-r5.R"

17. Compare the currently best-available YPMC wildfire dataset (USFS Region 5
Geospatial) to what we have developed by running 
"analyses/17_fire-perims-summary-stats.R"

18. Get Spearman's correlation between prefire NDVI of central pixel and the
prefire neighborhood mean NDVI of surrounding pixels to help support the 
interpretation of model coefficients.

## Recreating figures

19. Generate a rasterized version of the fire perimeters to display on the
geographic setting map by running 
"figures/figures_carpentry/19_rasterize-fire-perimeters.R"

20. Create Figure 1 (geographic extent of study) by running
"figures/figures_carpentry/20_geographic-extent-of-study.R"

21. Create Figure 2 (demonstration of calibration of algorithm to ground-based
severity) by running 
"figures/figures_carpentry/21_remote-sensed-severity-calibration.R"

22. In Earth Engine, generate two example severity maps of fires by running
22_rsr-visualize.js. Download the resulting raster files from your Google Drive
and store them in "figures/"

23. Generate Figure 3 (example severity maps for Hamm and American fires) by
running "figures/figures_carpentry/23_pre-post-rbr-visualization.R"

24. Generate Figure 4 (heterogeneity toy example) by running
"figures/figures_carpentry/24_heterogeneity-demo-raster.R"

25. Generate Figure 5 (effects of covariates on probability of high severity
fire) by running 
"figures/figures_carpentry/25_prob-hi-sev_main-effects-with-credible-intervals.R"

26. Generate Supplemental Figure 1 (cartoon of image acquisition algorithm) by
running "figures/figures_carpentry/26_image-acquisition-algorithm.R"

27. Generate Supplemental Figure 2 (central pixel/neighborhood NDVI decoupling)
toy example by running 
"figures/figures_carpentry/27_decoupling-center-neighborhood-ndvi.R"

## Export full geoTIFF images of each fire (with severity and predictor variables)

28. Run "data/data_carpentry/28_ee-get-fire-ids-and-dates-for-mass-EE-export.R"
to get the fire IDs and the fire dates to pass to the Earth Engine python
interface in order to avoid needing to use .getInfo() calls to get the same 
information. A way to make this smoother might be to read in the .csv 
representing the FRAP perimeters' metadata (including the Earth Engine system
index) to the python code directly. This approach is a bit of a kludge...

29. Paste the fire IDs and the fire alarm dates derived from step 28 as a python
list in the "data/data_carpentry/29_ee-get-frap-derived-imagery.ipynb" file and
run this script to iterate through all those fire ids and calulate severity
plus the predictor varibles for the model (including regional climate, 
vegetation values, raw band values for Landsat before and after the fire, 
heterogeneity of vegetation, etc.)

30. Connect the original FRAP database of fire perimeters with the Earth Engine-
derived metadata from the samples of those fires. Also create a table of the
metadata for the rasters.

## Demonstrate how to work with rasters available on the Open Science Framework

31. Rasters are available as a "component" to the full project on the OSF at this
address: https://osf.io/ke4qj/. The 
"data/data_carpentry/31_basic-manipulations-of-remote-sensing-resistance-rasters.R"
gives a few examples of how to find fire rasters of interest, name the bands,
and visualize them.

## Generating the manuscript documents

32. The main text of the manuscript is an RMarkdown file that can found in
"docs/manuscript/remote-sensing-resistance.Rmd". Knitting this document will
create the .pdf version of the main text, assuming the rest of the steps have
been completed to generate intermediate data and analyses outputs, as well as 
to generate figures.

33. The supplemental material of the manuscript is also an RMarkdown file that
can be found in "docs/manuscript/remote-sensing-resistance_supp-methods.Rmd".
Like the main text, knitting this file will generate the supplemental information
document so long as the prior steps have been completed.
