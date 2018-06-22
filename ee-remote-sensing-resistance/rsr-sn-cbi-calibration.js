/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cbi_sn = ee.FeatureCollection("users/mkoontz/cbi_sn");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var rsr = require('users/mkoontz/ee-remote-sensing-resistance:rsr-functions.js');

// Purpose: Take the image of model variables and return values of those variables 
// at points
// This is good for calibrating remote sensed metrics to on-the-ground CBI plot data

var target_cbi_plots = cbi_sn;

// Map the point reducer function (which also runs the variable retriever function)
// over all of the CBI point features; drop NULLs

// // Define the window of time (in months) that we will use to gather
// // images prior to the fire. For example, if the window is 3 months,
// // and the fire burned on June 2, 2010, we will collect all Landsat
// // images taken between March 1, 2010 and June 1, 2010 to 
// // calculate pre-fire metrics and all Landsat images between March 1,
// // 2011 and June 1, 2011 to calculate post-fire metrics
var timeWindow = 16*3;
// The resampling method for interpolation: 'none' (uses nearest neighbor for reductions), 'bilinear', or 'bicubic'
var resample_method = 'bicubic';
var sats_string = '57';
var sats = ee.List(sats_string.split(''));

var calibrated_cbi = target_cbi_plots.map(rsr.calibrate_cbi({ timeWindow: timeWindow,
                                                              resample_method: resample_method,
                                                              sats: sats
}),
                                            true);

var cbi_calibration_description = "cbi-calibration_" + timeWindow + "-day-window_L" + sats_string + "_" + resample_method + "-interp_texture_10000";

Export.table.toDrive({
  'collection': calibrated_cbi,
  'description': cbi_calibration_description,
  'folder': 'ee',
  'fileNamePrefix': cbi_calibration_description,
  'fileFormat': 'GeoJSON'
});
