#target photoshop;
app.bringToFront();
cTID = function (s) { return cTID[s] || (cTID[s] = app.charIDToTypeID(s)); };
sTID = function (s) { return app.stringIDToTypeID(s); };
var preferred_size = [200, 200];
var check_data = [];
var defaultImage = "";
var bannerBackground = []; 
var bannerIMGs = [];
var bannerIMGs_dialog = [];
var bannerSizes = {};
var CSV_data = [];
var checkbox = [];
const settingsID = "exportOptions";
const checkboxID = [];
var nameOfCSV = [];
var selCSVInp_text = "empty";
var fileList = "empty";
var selCSVInp_banner;
var units = getUnits();
var PSDPath;

var workFolderPath = get_working_folder_path();
get_Images(Folder(workFolderPath+"/links"));
get_CSV_data(selCSVInp_text, nameOfCSV);
var nameOfCurrentJob = get_current_job();
var currentWorkFolderPath = workFolderPath + "/" + nameOfCurrentJob;
create_folder(currentWorkFolderPath);
var default_folders = ["Received", "PSD", "Export"];
for (var i = 0; i < default_folders.length; i++) {
  var default_folder = currentWorkFolderPath + "/" + "0" + i + " " + default_folders[i];
  create_folder(default_folder);
  if (default_folders[i] == CSV_data[0]) {
    var CSV_data_selected = get_output_name(CSV_data);
    for (var x = 0, len = CSV_data_selected.length; x < len; x++) {
      var num = x + 1;
      var default_Export_folder = currentWorkFolderPath + "/" + "0" + i + " " + default_folders[i] + "/" + "0" + num + " " + CSV_data_selected[x];
      create_folder(default_Export_folder);
    }
  }
  if (default_folders[i] == "PSD") {

    var default_Export_folder = currentWorkFolderPath + "/" + "0" + i + " " + default_folders[i];
    create_folder(default_Export_folder);
    var newDoc = app.documents.add(1000, 500, 2, nameOfCurrentJob);

    var fileName = app.activeDocument.name.replace(/\.[^\.]+$/, '');
    var fileType = ".psd";
    var saveFilePSD = saveFilePSD = File(default_Export_folder + '/' + fileName + fileType);
    SavePSD(saveFilePSD);
    PSDPath = saveFilePSD;
  }
}
//_____________________________________________[SECTION 2]

selCSVInp_text = "banner.csv"
get_CSV_data(selCSVInp_text, nameOfCSV);
var yMyValue = 0;
var xMyValue = 0;
var xNext = 0;
var yNext = 0;
var ySwitch = 0;
var padInp;


var logosD = [];

var xLogosD = [];
var yLogosD = [];
var isBackgroundSame = [];

var numberOfs = [];

var isLogoSame = [];
var logos = [];
var xLogos = [];
var yLogos = [];
var isCTASame = [];
var isBoxSame = [];
var sBackgounds = [];

var inProgressCTA = "";
var isWhite;
var isTransparent;
var isBlack;
var delta;
var banner_checkboxID = [];
var bannerData = [];
var bannerLogo = [];

var dialogBannerBackground = [];
var dialogBannerLogo = [];
var dialogBannerCTA = [];
var dialogBannerBox = [];
var dialogBannerBackgroundPer;
var delta;
delta = 0;
for (var i = 0; i < CSV_data.length; i++) {
  if (CSV_data[i].name == "logo.csv") {
    bannerLogo = CSV_data[i].name_;
  }
}
for (var ix = 0; ix < CSV_data.length; ix++) {
  if (CSV_data[ix].name == selCSVInp_text) {
    for (var i = 0, len = CSV_data[ix].name_.length; i < len; i++) {
      banner_checkboxID[i] = stringIDToTypeID(CSV_data[ix].name_[i].name);
      checkbox[i] = false;
      isBackgroundSame.push({
        id: i,
        isBG : false,
        data:{},
      });
      isLogoSame[i] = false;
      isCTASame[i] = false;
      isBoxSame[i] = false;
      numberOfs[i] = parseInt(CSV_data[ix].name_[i].numberOf);
      logos[i] = CSV_data[ix].name_[i].sLogo;
      sBackgounds[i] = CSV_data[ix].name_[i].sBackgound;
      xLogos[i] = parseInt(CSV_data[ix].name_[i].xLogoPos);
      yLogos[i] = parseInt(CSV_data[ix].name_[i].yLogoPos);

      bannerData.push({
        id: i,
        print:false,
        name: CSV_data[ix].name_[i].name,
        height: CSV_data[ix].name_[i].height,
        width: CSV_data[ix].name_[i].width,
        duplicate: parseInt(CSV_data[ix].name_[i].numberOf),
        artboard: "empty",
        artboardPos: "empty",
        background:{
          name:"00_default.png",
          path: defaultImage,
          backgroundIMG:"00_default.png",
          xPos:8,
          yPos:7,
          isSame: false,
        },
        logo: {
          name:"00_default.png",
          path: defaultImage,
          xPos: parseInt(CSV_data[ix].name_[i].xLogoPos),
          yPos: parseInt(CSV_data[ix].name_[i].yLogoPos),
          isSame: false,
        }, 
        CTA: {
          name: "00_default.png",
          path: defaultImage,
          CTASize: CSV_data[ix].name_[i].CTASize,
          xPos: parseInt(CSV_data[ix].name_[i].xCTAPos),
          yPos: parseInt(CSV_data[ix].name_[i].yCTAPos),
          isSame: false,
        }, 
        box: {
          name: "00_default.png",
          path: defaultImage,
          xPos: parseInt(CSV_data[ix].name_[i].xBoxPos),
          yPos: parseInt(CSV_data[ix].name_[i].yBoxPos),
          isSame: false,
        }
      });
    }
  }
}
get_sort_data();
main()

function main() {
  try {
    var result = get_option_dialogs();
    if(result != 2){
      set_doc_zoom(22);
      for (var i = 0; i < bannerData.length; i++) {
        if(bannerData[i].print == true){
          app.refresh();
          var pad = convertUnits(toAbsNum("50", 0), units, 'px');
          var bgKey = isWhite.value ? 1 : (isBlack.value ? 2 : 3);
          var deltaX = 0;
          if(i == 4){
            set_doc_zoom(12);
          }
          xNext = 0;
          for (var x = 0; x < bannerData[i].duplicate; x++) {
            bannerData[i].artboard = i+"."+x+" "+ bannerData[i].name;
            get_background_img(bannerData[i],i,x);
            bannerData[i].artboardPosXY = i + "." + x ;
            createArtboard( bannerData[i], delta, deltaX, bgKey);
            SavePSD( PSDPath );
            makeFrame( PSDPath,bannerData[i] );
            deltaX = parseFloat( deltaX + bannerData[i].width + pad+30);
            xNext = xNext + bannerData[i].width + 100;

          }
          delta = parseFloat(delta + bannerData[i].height + pad);
          yNext = yNext + bannerData[i].height + 50;
        }
      }

    }
    alert("test");
  }
  catch (e) {
    alert(e + ' ' + e.line);
  }

}


//_____________________________________________[ Below don't touch functions ]
function get_sort_data(){
  for (var i = 0; i < bannerData.length; i++) {
    var key ="_"+bannerData[i].name;
    var logo ="logo";
    var CTA = "CTA";
    var box = "box";
    defaultImage = new File(workFolderPath+"/links/dialog"+"/00_default.png");
    bannerSizes[key] = {
      name:["00_default.png"],
      data:[defaultImage],
      data_dialog:[defaultImage],
    };
    bannerSizes["logo"] = {
      name:["00_default.png"],
      data:[defaultImage],
      data_dialog:[defaultImage],
    };
    bannerSizes["CTA"] = {
      name:["00_default.png"],
      data:[defaultImage],
      data_dialog:[defaultImage],
    };
    bannerSizes["box"] = {
      name:["00_default.png"],
      data:[defaultImage],
      data_dialog:[defaultImage],
    };

    for (var xc = 0; xc < bannerBackground.length; xc++) {
      if (bannerBackground[xc].indexOf(key) != -1) {
          bannerSizes[key].name.push(bannerBackground[xc]);
          bannerSizes[key].data.push(bannerIMGs[xc] );
          bannerSizes[key].data_dialog.push(bannerIMGs_dialog[xc] );
      }
      if (bannerBackground[xc].indexOf(logo) != -1) {
          bannerSizes[logo].name.push(bannerBackground[xc]);
          bannerSizes[logo].data.push(bannerIMGs[xc] );
          bannerSizes[logo].data_dialog.push(bannerIMGs_dialog[xc] );
      }
      if (bannerBackground[xc].indexOf(CTA) != -1) {
          bannerSizes[CTA].name.push(bannerBackground[xc]);
          bannerSizes[CTA].data.push(bannerIMGs[xc] );
          bannerSizes[CTA].data_dialog.push(bannerIMGs_dialog[xc] );
      }
      if (bannerBackground[xc].indexOf(box) != -1) {
          bannerSizes[box].name.push(bannerBackground[xc]);
          bannerSizes[box].data.push(bannerIMGs[xc] );
          bannerSizes[box].data_dialog.push(bannerIMGs_dialog[xc] );
      }
    }
  }
}
function get_background_img(bannerDataSelected,i,x) {

  if(bannerDataSelected.background.isSame == false || bannerDataSelected.logo.isSame == false || bannerDataSelected.CTA.isSame == false || bannerDataSelected.box.isSame == false){
   var dialogIsNot = new Window("dialog");
    dialogIsNot.text = "Select assets for "+i+x+" "+bannerDataSelected.name;
    dialogIsNot.orientation = "row";
    dialogIsNot.alignChildren = ["left", "top"];
    dialogIsNot.spacing = 10;
    dialogIsNot.margins = 16;

  if(bannerDataSelected.background.isSame == false){
    //____________________________________________[groupName]
    var groupBG = dialogIsNot.add("group", undefined, { name: "group1" });
        groupBG.preferredSize.width = 150;
        groupBG.orientation = "column";
        groupBG.alignChildren = ["fill", "top"];
        groupBG.spacing = 10;
        groupBG.margins = 0;
        groupBG.alignment = ["left", "fill"];

    var panelBG = groupBG.add("panel", undefined, undefined, { name: "panel1" });
        panelBG.text = "Background";
        panelBG.orientation = "column";
        panelBG.alignChildren = ["left", "top"];
        panelBG.spacing = 16;
        panelBG.margins = 10;
        panelBG.alignment = ["fill", "top"];
  
        dialogBannerBackgroundPer = panelBG.add('dropdownlist', undefined, bannerSizes["_"+bannerDataSelected.name].name);
        dialogBannerBackgroundPer.selection = 0;
  }

  if(bannerDataSelected.logo.isSame == false){
    //____________________________________________[groupName]
    var groupLogo = dialogIsNot.add("group", undefined, { name: "group1" });
        groupLogo.preferredSize.width = 150;
        groupLogo.orientation = "column";
        groupLogo.alignChildren = ["fill", "top"];
        groupLogo.spacing = 10;
        groupLogo.margins = 0;
        groupLogo.alignment = ["left", "fill"];

    var panelLogo = groupLogo.add("panel", undefined, undefined, { name: "panel1" });
        panelLogo.text = "Logo";
        panelLogo.orientation = "column";
        panelLogo.alignChildren = ["left", "top"];
        panelLogo.spacing = 16;
        panelLogo.margins = 10;
        panelLogo.alignment = ["fill", "top"];
  
        dialogBannerLogoPer = panelLogo.add('dropdownlist', undefined,bannerSizes.logo.name);
        dialogBannerLogoPer.selection = 0;
  }

  if(bannerDataSelected.CTA.isSame == false){
    //____________________________________________[groupName]
    var groupCTA = dialogIsNot.add("group", undefined, { name: "group1" });
        groupCTA.preferredSize.width = 150;
        groupCTA.orientation = "column";
        groupCTA.alignChildren = ["fill", "top"];
        groupCTA.spacing = 10;
        groupCTA.margins = 0;
        groupCTA.alignment = ["left", "fill"];

    var panelCTA = groupCTA.add("panel", undefined, undefined, { name: "panel1" });
        panelCTA.text = "CTA";
        panelCTA.orientation = "column";
        panelCTA.alignChildren = ["left", "top"];
        panelCTA.spacing = 16;
        panelCTA.margins = 10;
        panelCTA.alignment = ["fill", "top"];
  
        dialogBannerCTAPer = panelCTA.add('dropdownlist', undefined,  bannerSizes.CTA.name);
        dialogBannerCTAPer.selection = 0;
  }
  if(bannerDataSelected.box.isSame == false){
    //____________________________________________[groupName]
    var groupBox = dialogIsNot.add("group", undefined, { name: "group1" });
        groupBox.preferredSize.width = 150;
        groupBox.orientation = "column";
        groupBox.alignChildren = ["fill", "top"];
        groupBox.spacing = 10;
        groupBox.margins = 0;
        groupBox.alignment = ["left", "fill"];

    var panelBox = groupBox.add("panel", undefined, undefined, { name: "panel1" });
        panelBox.text = "Box";
        panelBox.orientation = "column";
        panelBox.alignChildren = ["left", "top"];
        panelBox.spacing = 16;
        panelBox.margins = 10;
        panelBox.alignment = ["fill", "top"];
  
        dialogBannerBoxPer = panelBox.add('dropdownlist', undefined, bannerSizes.box.name);
        dialogBannerBoxPer.selection = 0;
  }


    
  //____________________________________________[groupBasicTwo] 
  var groupBasicTwo = dialogIsNot.add("group", undefined, { name: "group2" });
  groupBasicTwo.orientation = "column";
  groupBasicTwo.alignChildren = ["fill", "top"];
  groupBasicTwo.spacing = 10;
  groupBasicTwo.margins = 0;

  var ok = groupBasicTwo.add("button", undefined, undefined, { name: "ok" });
  ok.text = "OK";
  var cancel = groupBasicTwo.add("button", undefined, undefined, { name: "cancel" });
  cancel.text = "Cancel";
  ok.onClick = function () {
    upDateBackground();
    dialogIsNot.close(1);
  };
  function upDateBackground(){
    if(bannerDataSelected.background.isSame == false){
      bannerDataSelected.background.name = dialogBannerBackgroundPer.selection.text;
    }
    bannerDataSelected.background.backgroundIMG = bannerDataSelected.background.name;
    bannerDataSelected.artboardPos = i+""+x;

    if(bannerDataSelected.logo.isSame == false){
      bannerDataSelected.logo.name = dialogBannerLogoPer.selection.text;
      bannerDataSelected.logo.backgroundIMG = bannerDataSelected.logo.name;
    }

    if(bannerDataSelected.CTA.isSame == false){
      bannerDataSelected.CTA.name = dialogBannerCTAPer.selection.text;
    }

    if(bannerDataSelected.box.isSame == false){
      bannerDataSelected.box.name = dialogBannerBoxPer.selection.text;
    }
  }
  dialogIsNot.center();
  return dialogIsNot.show();
}else{
  bannerDataSelected.artboardPos = i+""+x;
  bannerDataSelected.background.backgroundIMG = bannerDataSelected.background.name;
}
  
}
function getMeThisLayer(aLayerName,bannerDataArtboard)
{
  try
  {
    var doc = app.activeDocument;
    app.activeDocument.activeLayer = app.activeDocument.layerSets.getByName(bannerDataArtboard.artboard)
    var newColor = [255, 0, 0]; // Example: Light gray
    app.activeDocument.activeLayer.backgroundColor = newColor; 

    for (var i = 0; i < doc.layers.length; i++) {

          var newLayer = app.activeDocument.activeLayer.artLayers.add(); 
          newLayer.blendMode = BlendMode.NORMAL;
          
          newLayer.name = aLayerName;

          app.activeDocument.activeLayer = app.activeDocument.layerSets.getByName(bannerDataArtboard.artboard)
          var findLayer = doc.activeLayer.layers.getByName(aLayerName);

          if (findLayer.name === aLayerName && doc.activeLayer.name === bannerDataArtboard.artboard) {
            app.activeDocument.activeLayer = doc.activeLayer.layers.getByName(aLayerName)
          return
        }
        if(aLayerName == Logolayer)
          {
            var newLayer = app.activeDocument.activeLayer.artLayers.add(); 
            newLayer.blendMode = BlendMode.NORMAL;
            
            newLayer.name = aLayerName;
  
            app.activeDocument.activeLayer = app.activeDocument.layerSets.getByName(bannerDataArtboard.artboard)
            var findLayer = doc.activeLayer.layers.getByName(aLayerName);
  
            if (findLayer.name === aLayerName && doc.activeLayer.name === bannerDataArtboard.artboard) {
              app.activeDocument.activeLayer = doc.activeLayer.layers.getByName(aLayerName)
            return
    
            }
          }
      }
  }

  catch(e)
  {
    //Whoops can't find layer
    alert("Can't find layer " + aLayerName + "\n" + e)
  }
}
function get_remove_img_ext(name_with_ext) {

    if (name_with_ext.indexOf('.') != -1) {
      name_with_ext = name_with_ext.substring(0, name_with_ext.indexOf('.'));
    }
  return name_with_ext;
}
function get_Images(inFolderList){
  if (inFolderList != null)
    {
      fileList = inFolderList.getFiles(/\.(jpg)$|\.(png)$/i); 
      var dialog_img_path = inFolderList+"/dialog";

      var destStatics_ = new Folder(dialog_img_path)
      var bannerIMGs_dialog_fileList = destStatics_.getFiles(/\.(jpg)$|\.(png)$/i); 
      for (var i = 0; i < fileList.length; i++) {
        bannerBackground[i] = fileList[i].name;
        bannerIMGs[i] = fileList[i];

        
        if (!destStatics_.exists || fileList.length != bannerIMGs_dialog_fileList.length) {
          var doc = open(fileList[i]);
          var file_name = doc.name;

          var image_size = [doc.width,doc.height];

          image_size = get_new_sizes(image_size,preferred_size);

        
          var resolution_ = 2
          var scaleStyles = true;
          var constrainProportions = true;
          var interpolation = "Bicubic";
          resizeImage(image_size[0], image_size[1], resolution_, scaleStyles, constrainProportions, interpolation);
          var exportOptions = new ExportOptionsSaveForWeb();
          exportOptions.format = SaveDocumentType.PNG;
          exportOptions.PNG8 = false;
          exportOptions.transparency = true;
          exportOptions.interlaced = false;
          exportOptions.quality = 100;

          var originalRulerUnits = app.preferences.rulerUnits;
          app.preferences.rulerUnits = Units.PIXELS;
          // Export the layer as PNG
          
          create_folder(dialog_img_path);
          var exportFile = new File(dialog_img_path+"/" + file_name);
          doc.exportDocument(exportFile, ExportType.SAVEFORWEB, exportOptions);
          // Restore original ruler unit
          app.preferences.rulerUnits = originalRulerUnits;

          // Undo the resizeCanvas to keep the original document intact
          doc.activeHistoryState = doc.historyStates[doc.historyStates.length - 2];
          //exportFile.push({height: image_size[1], width: image_size[0]})
          exportFile["height"] = image_size[1].value;
          exportFile["width"] = image_size[0].value;
          bannerIMGs_dialog[i] = exportFile;
        
          app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

        }else{
          bannerIMGs_dialog[i] = bannerIMGs_dialog_fileList[i];
        }
      }
    }
}

function get_option_dialogs() {
  var thisIndex = 0;
  //____________________________________________[dialogBanner]
  var dialogBanner = new Window("dialog");
  dialogBanner.text = "Banner settings";
  dialogBanner.orientation = "row";
  dialogBanner.alignChildren = ["left", "top"];
  dialogBanner.spacing = 10;
  dialogBanner.margins = 16;

  //____________________________________________[groupName]
  var groupName = dialogBanner.add("group", undefined, { name: "group1" });
  groupName.preferredSize.width = 150;
  groupName.orientation = "column";
  groupName.alignChildren = ["fill", "top"];
  groupName.spacing = 10;
  groupName.margins = 0;
  groupName.alignment = ["left", "fill"];

  var panelName = groupName.add("panel", undefined, undefined, { name: "panel1" });
  panelName.orientation = "column";
  panelName.alignChildren = ["left", "top"];
  panelName.spacing = 10;
  panelName.margins = 10;
  panelName.alignment = ["fill", "top"];
  panelName.text = "Name";


      //____________________________________________[Layers]
      var groupPreview = dialogBanner.add("group", undefined, { name: "group1" });
      groupPreview.preferredSize.width = 200;
      groupPreview.orientation = "column";
      groupPreview.alignChildren = ["fill", "top"];
      groupPreview.spacing = 10;
      groupPreview.margins = 0;
      groupPreview.alignment = ["left", "fill"];
    
      var panelPreview = groupPreview.add("panel", undefined, undefined, { name: "panel1" });
      panelPreview.text = "Layers";
      panelPreview.preferredSize.width = 200;
      panelPreview.orientation = "column";
      panelPreview.alignChildren = ["left", "top"];
      panelPreview.spacing = 10;
      panelPreview.margins = 10;
      panelPreview.alignment = ["fill", "top"];

      var panel_button = groupPreview.add("panel", undefined, undefined, { name: "panel1" });
          panel_button.orientation = "column";
          panelPreview.preferredSize.width = 200;
          panel_button.alignChildren = ["fill", "top"];
          panel_button.spacing = 10;
          panel_button.margins = 10;
          panel_button.alignment = "center";

            //____________________________________________[preview]
      var groupPreviewIMG = dialogBanner.add("group", undefined, { name: "group1" });
      groupPreviewIMG.preferredSize.width = 150;
      groupPreviewIMG.orientation = "column";
      groupPreviewIMG.alignChildren = ["fill", "top"];
      groupPreviewIMG.spacing = 10;
      groupPreviewIMG.margins = 0;
      groupPreviewIMG.alignment = ["left", "fill"];

      var panel_Bg_IMG = groupPreviewIMG.add("panel", undefined, undefined, { name: "panel1" });
      panel_Bg_IMG.text = "Selected Banner is "+ bannerData[thisIndex].name;
      panel_Bg_IMG.orientapanel_CTA_IMGtion = "column";
      panel_Bg_IMG.alignChildren = ["fill", "top"];
      panel_Bg_IMG.spacing = 1;
      panel_Bg_IMG.margins = 1;
      panel_Bg_IMG.alignment = "center";

      var panel_logo_IMG = groupPreviewIMG.add("panel", undefined, undefined, { name: "panel1" });
      panel_logo_IMG.text = "Selected Banner is "+ bannerData[thisIndex].name;
      panel_logo_IMG.orientation = "column";
      panel_logo_IMG.alignChildren = ["fill", "top"];
      panel_logo_IMG.spacing = 1;
      panel_logo_IMG.margins = 1;
      panel_logo_IMG.alignment = "center";

      var panel_CTA_IMG = groupPreviewIMG.add("panel", undefined, undefined, { name: "panel1" });
      panel_CTA_IMG.text = "Selected Banner is "+ bannerData[thisIndex].name;
      panel_CTA_IMG.orientation = "column";
      panel_CTA_IMG.alignChildren = ["fill", "top"];
      panel_CTA_IMG.spacing = 1;
      panel_CTA_IMG.margins = 1;
      panel_CTA_IMG.alignment = "center";

      var panel_box_IMG = groupPreviewIMG.add("panel", undefined, undefined, { name: "panel1" });
      panel_box_IMG.text = "Selected Banner is "+ bannerData[thisIndex].name;
      panel_box_IMG.orientation = "column";
      panel_box_IMG.alignChildren = ["fill", "top"];
      panel_box_IMG.spacing = 1;
      panel_box_IMG.margins = 1;
      panel_box_IMG.alignment = "center";


    //____________________________________________[groupBackground]
    var groupBackground = dialogBanner.add("group", undefined, { name: "group1" });
    groupBackground.preferredSize.width = 150;
    groupBackground.orientation = "column";
    groupBackground.alignChildren = ["fill", "top"];
    groupBackground.spacing = 10;
    groupBackground.margins = 0;
    groupBackground.alignment = ["left", "fill"];

  var panelBasic_background = groupBackground.add("panel", undefined, undefined, { name: "panel1" });
  panelBasic_background.text = "Background";
  panelBasic_background.orientation = "row";
  panelBasic_background.alignChildren = ["left", "top"];
  panelBasic_background.spacing = 10;
  panelBasic_background.margins = 10;
  panelBasic_background.alignment = ["fill", "top"];

  var panelBasic_logo = groupBackground.add("panel", undefined, undefined, { name: "panel1" });
  panelBasic_logo.text = "Logo";
  panelBasic_logo.orientation = "row";
  panelBasic_logo.alignChildren = ["left", "top"];
  panelBasic_logo.spacing = 10;
  panelBasic_logo.margins = 10;

  var panelBasic_CTA = groupBackground.add("panel", undefined, undefined, { name: "panel1" });
  panelBasic_CTA.text = "CTA";
  panelBasic_CTA.orientation = "row";
  panelBasic_CTA.alignChildren = ["left", "top"];
  panelBasic_CTA.spacing = 10;
  panelBasic_CTA.margins = 10;
  panelBasic_CTA.alignment = ["fill", "top"];

  var panelBasic_box = groupBackground.add("panel", undefined, undefined, { name: "panel1" });
  panelBasic_box.text = "Box";
  panelBasic_box.orientation = "row";
  panelBasic_box.alignChildren = ["left", "top"];
  panelBasic_box.spacing = 10;
  panelBasic_box.margins = 10;
  panelBasic_box.alignment = ["fill", "top"];

  var panelButton = groupBackground.add("panel", undefined, undefined, { name: "panel1" });
  panelButton.text = "save changes";
  panelButton.orientation = "row";
  panelButton.alignChildren = ["left", "top"];
  panelButton.spacing = 10;
  panelButton.margins = 10;
  panelButton.alignment = ["fill", "top"];
  var is_Background_Same;
  
  is_Background_Same = panelPreview.add('checkbox', undefined, undefined, { name: isBackgroundSame[thisIndex].isBG });
  is_Background_Same.text = bannerData[thisIndex].background.name;
  is_Background_Same.alignment = ["fill", "top"];
  is_Background_Same.value = isBackgroundSame[thisIndex].isBG;
  var this_background_bn = panelPreview.add('button', undefined, "add background");

  isLogoSame = panelPreview.add('checkbox', undefined, undefined, { name: isLogoSame[thisIndex] });
  isLogoSame.value = isLogoSame[thisIndex];
  var this_logo_bn = panelPreview.add('button', undefined, "add logo");
  var this_logo = panelPreview.add('statictext', undefined, bannerData[thisIndex].background.name);

  isCTASame= panelPreview.add('checkbox', undefined, undefined, { name: isCTASame[thisIndex] });
  isCTASame.value = isCTASame[thisIndex];
  var this_cta_bn = panelPreview.add('button', undefined, "add cta");
  var this_cta = panelPreview.add('statictext', undefined, bannerData[thisIndex].background.name);

  var is_BoxSame = panelPreview.add('checkbox', undefined, undefined, { name: isBoxSame[thisIndex] });
  is_BoxSame.value = isBoxSame[thisIndex];
  var this_box_bn = panelPreview.add('button', undefined, "add box");
  var this_box = panelPreview.add('statictext', undefined, bannerData[thisIndex].background.name);

  //_______________________________________________[ Place banner]
  for (var i = 0; i < bannerData.length; i++) {
    dialogBanner[i] = panelName.add("checkbox", undefined, undefined, { name: bannerData[i].name });
    dialogBanner[i].text = bannerData[i].name;
    dialogBanner[i].alignment = ["left", "top"];
    dialogBanner[i].value = checkbox[i];
    numberOfs[i] = panelName.add('edittext', undefined, numberOfs[i]);
    dialogBanner[bannerData[i].name] = panelName.add('button', undefined, bannerData[i].name);
    dialogBanner[bannerData[i].name].addEventListener("click", isClicked(i));

  }
  
//____________________________________________IMG_BG
panel_Bg_IMG.preferredSize = preferred_size;
  var imageDropdownlist = panel_Bg_IMG.add('dropdownlist', undefined, bannerSizes["_"+bannerData[thisIndex].name].name);
      imageDropdownlist.selection = 0;
  var image = panel_Bg_IMG.add("image", undefined);
  image.alignment = "center";

  var this_image = bannerSizes["_"+bannerData[thisIndex].name].data_dialog;
  image.image = defaultImage;
  var height = bannerData[thisIndex].height;
  var width = bannerData[thisIndex].width;
  var image_size =[width,height]
   
  image.size = get_new_sizes(image_size,preferred_size);


  //____________________________________________IMG_LOGO
  panel_logo_IMG.preferredSize = preferred_size;
  var imageDropdownlist_logo = panel_logo_IMG.add('dropdownlist', undefined, bannerSizes["_"+bannerData[thisIndex].name].name);
      imageDropdownlist_logo.selection = 0;
  var image_logo = panel_logo_IMG.add("image", undefined);
  image_logo.alignment = "center";

  var this_image_logo = bannerSizes["_"+bannerData[thisIndex].name].data_dialog;
  image_logo.image = defaultImage;
  var height = bannerData[thisIndex].height;
  var width = bannerData[thisIndex].width;
  var image_size =[width,height]
   
  image_logo.size = get_new_sizes(image_size,preferred_size);

  //____________________________________________IMG_CTA
  panel_CTA_IMG.preferredSize = preferred_size;
  var imageDropdownlist_CTA = panel_CTA_IMG.add('dropdownlist', undefined, bannerSizes["_"+bannerData[thisIndex].name].name);
      imageDropdownlist_CTA.selection = 0;
  var image_CTA = panel_CTA_IMG.add("image", undefined);
  image_CTA.alignment = "center";

  var this_image_CTA = bannerSizes["_"+bannerData[thisIndex].name].data_dialog;
  image_CTA.image = defaultImage;
  var height = bannerData[thisIndex].height;
  var width = bannerData[thisIndex].width;
  var image_size =[width,height]
   
  image_CTA.size = get_new_sizes(image_size,preferred_size);

  //____________________________________________IMG_BOX
  panel_box_IMG.preferredSize = preferred_size;
  var imageDropdownlist_box = panel_box_IMG.add('dropdownlist', undefined, bannerSizes["_"+bannerData[thisIndex].name].name);
      imageDropdownlist_box.selection = 0;
  var image_box = panel_box_IMG.add("image", undefined);
      image_box.alignment = "center";

  var this_image_box = bannerSizes["_"+bannerData[thisIndex].name].data_dialog;
      image_box.image = defaultImage;
  var height = bannerData[thisIndex].height;
  var width = bannerData[thisIndex].width;
  var image_size =[width,height]
   
      image_box.size = get_new_sizes(image_size,preferred_size);

  //_____________________________________________[bg]
    var bgPnl = dialogBanner.add('panel', undefined, 'Background');
    bgPnl.alignChildren = ['fill', 'center'];
    bgPnl.margins = [12, 14, 10, 14];

    isWhite = bgPnl.add('radiobutton', undefined, 'White');
    isWhite.value = true;

    isBlack = bgPnl.add('radiobutton', undefined, 'Black');
    isTransparent = bgPnl.add('radiobutton', undefined, 'Transparent');

    if (/mm|cm|in/.test(units)) {
      win.add('statictext', undefined, 'Script can slowly add artboards');
    }
    
  //____________________________________________[groupBasicTwo] 
  var groupBasicTwo = dialogBanner.add("group", undefined, { name: "group2" });
  groupBasicTwo.orientation = "column";
  groupBasicTwo.alignChildren = ["fill", "top"];
  groupBasicTwo.spacing = 10;
  groupBasicTwo.margins = 0;

  var ok = groupBasicTwo.add("button", undefined, undefined, { name: "ok" });
  ok.text = "OK";
  var cancel = groupBasicTwo.add("button", undefined, undefined, { name: "cancel" });
  cancel.text = "Cancel";

  var nextBn = panel_button.add("button",undefined,undefined,{ name : "Next"});
  nextBn.text = "Next";
  var previousBn = panel_button.add("button", undefined, undefined, { name : " Previous"});
  previousBn.text = "Previous ";
  var saveBn = panel_button.add("button", undefined, undefined, { name : " Save"});
  saveBn.text = "Save ";
  var PIC = 0;

  ok.onClick = function () {
   upDateBackgrounds();
    dialogBanner.close(1);
  };
  groupPreview
  nextBn.onClick = function () {
      if(imageText == "background"){
        this_image = bannerSizes["_"+bannerData[thisIndex].name].data_dialog;
        if (PIC == this_image.length - 1) return;
        is_Background_Same.text = this_image[PIC].name;
        image.image = File(this_image[PIC]);
        imageDropdownlist.selection = PIC;
        PIC++;
      }
      if(imageText == "logo"){
        this_image = bannerSizes.logo.data_dialog;
        if (PIC == this_image.length - 1) return;
        this_logo.text = this_image[PIC].name;
        image_logo.image = File(this_image[PIC]);
        imageDropdownlist_logo.selection = PIC;
        PIC++;
      }
      if(imageText == "cta"){
        this_image = bannerSizes.CTA.data_dialog;
        if (PIC == this_image.length - 1) return;
        this_cta.text = this_image[PIC].name;
        image_CTA.image = File(this_image[PIC]);
        imageDropdownlist_CTA.selection = PIC;
        PIC++;
      }
      if(imageText == "box"){
        this_image = bannerSizes.box.data_dialog;
        if (PIC == this_image.length - 1) return;
        this_box.text = this_image[PIC].name;
        image_box.image = File(this_image[PIC]);
        imageDropdownlist_box.selection = PIC;
        PIC++;
      } 
  };
  previousBn.onClick = function () {
    if(imageText == "background"){
      this_image = bannerSizes["_"+bannerData[thisIndex].name].data_dialog;
      if (PIC == 0) return;
      image.image = this_image[PIC];
      is_Background_Same.text = this_image[PIC].name;
      imageDropdownlist.selection = PIC;
      PIC--;
    }
    if(imageText == "logo"){
      this_image = bannerSizes.logo.data_dialog;
      if (PIC == 0) return;
      image_logo.image = this_image[PIC];
      this_logo.text = this_image[PIC].name;
      imageDropdownlist_logo.selection = PIC;
      PIC--;
    }
    if(imageText == "cta"){
      this_image = bannerSizes.CTA.data_dialog;
      if (PIC == 0) return;
      image_CTA.image = this_image[PIC];
      this_cta.text = this_image[PIC].name;
      imageDropdownlist_CTA.selection = PIC;
      PIC--;
    }
    if(imageText == "box"){
      this_image = bannerSizes.box.data_dialog;
      if (PIC == 0) return;
      image_box.image = this_image[PIC];
      this_box.text = this_image[PIC].name;
      imageDropdownlist_box.selection = PIC;
      PIC--;
    }
  };

  saveBn.onClick = function () {
    bannerData[thisIndex].background.name = is_Background_Same.text;
    bannerData[thisIndex].logo.name = this_logo.text;
    bannerData[thisIndex].CTA.name = this_cta.text;
    bannerData[thisIndex].box.name = this_box.text;
    bannerData[thisIndex].print = dialogBanner[thisIndex].value;
    bannerData[thisIndex].duplicate = parseInt(numberOfs[thisIndex].text);
    bannerData[thisIndex].background.isSame = is_Background_Same.value;
    bannerData[thisIndex].logo.isSame = isLogoSame.value;
    bannerData[thisIndex].CTA.isSame = isCTASame.value;
    bannerData[thisIndex].box.isSame = is_BoxSame.value;

      if(imageDropdownlist.selection.text != is_Background_Same.text){
        bannerData[thisIndex].background.name = imageDropdownlist.selection.text;
        is_Background_Same.text = imageDropdownlist.selection.text;

        for (var index = 0; index < bannerSizes["_"+bannerData[thisIndex].name].name.length; index++) {
          if(bannerSizes["_"+bannerData[thisIndex].name].name[index] == is_Background_Same.text){
            image.image = bannerSizes["_"+bannerData[thisIndex].name].data_dialog[index];
          }
          
        }
      }

      if(imageDropdownlist_logo.selection.text != this_logo.text){
        bannerData[thisIndex].logo.name = imageDropdownlist_logo.selection.text;
        this_logo.text = imageDropdownlist_logo.selection.text;
        for (var index = 0; index < bannerSizes.logo.name.length; index++) {
          if(bannerSizes.logo.name[index] == this_logo.text){
            image_logo.image = bannerSizes.logo.data_dialog[index];
          }
          
        }
      }

      if(imageDropdownlist_CTA.selection.text != this_cta.text){
        bannerData[thisIndex].CTA.name = imageDropdownlist_CTA.selection.text;
        this_cta.text = imageDropdownlist_CTA.selection.text;
        for (var index = 0; index < bannerSizes.CTA.name.length; index++) {
          if(bannerSizes.CTA.name[index] == this_cta.text){
            image_CTA.image = bannerSizes.CTA.data_dialog[index];
          }
          
        }
      }

      if(imageDropdownlist_box.selection.text != this_box.text){
        bannerData[thisIndex].box.name = imageDropdownlist_box.selection.text;
        this_box.text = imageDropdownlist_box.selection.text;
        for (var index = 0; index < bannerSizes.box.name.length; index++) {
          if(bannerSizes.box.name[index] == this_box.text){
            image_box.image = bannerSizes.box.data_dialog[index];
          }
          
        }
      }
    

  }

  this_background_bn.onClick = function () {
    imageText = "background";
    imageDropdownlist.removeAll();
    for (var i = 0; i < bannerSizes["_"+bannerData[thisIndex].name].name.length; i++) {
      imageDropdownlist.add("item", bannerSizes["_"+bannerData[thisIndex].name].name[i]);
    }
    
    for (var index = 0; index < bannerSizes["_"+bannerData[thisIndex].name].name.length; index++) {
      if(bannerSizes["_"+bannerData[thisIndex].name].name[index] == is_Background_Same.text){
        imageDropdownlist.selection = index;
        image.image = File(bannerSizes["_"+bannerData[thisIndex].name].data_dialog[index]);
        this_image = bannerSizes["_"+bannerData[thisIndex].name].data_dialog;
        PIC = index;
      }
    }
  }
  this_logo_bn.onClick = function () {
    imageText = "logo";
    imageDropdownlist_logo.removeAll();
    for (var i = 0; i < bannerSizes.logo.name.length; i++) {
      imageDropdownlist_logo.add("item", bannerSizes.logo.name[i]);
    }
    for (var index = 0; index < bannerSizes.logo.name.length; index++) {
      if(bannerSizes.logo.name[index] == this_logo.text ){
        imageDropdownlist_logo.selection = index;
        image_logo.image = File(bannerSizes.logo.data_dialog[index]);
        this_image = bannerSizes.logo.data_dialog;
        PIC = index;
      }
    }
  }
  this_cta_bn.onClick = function () {
    imageText = "cta";
    imageDropdownlist_CTA.removeAll();
    for (var i = 0; i < bannerSizes.CTA.name.length; i++) {
      imageDropdownlist_CTA.add("item", bannerSizes.CTA.name[i]);
    }
    for (var index = 0; index < bannerSizes.CTA.name.length; index++) {
      if(bannerSizes.CTA.name[index] == this_cta.text ){
        imageDropdownlist_CTA.selection = index;
        image_CTA.image = File(bannerSizes.CTA.data_dialog[index]);
        this_image = bannerSizes.CTA.data_dialog;
        PIC = index;
      }
    }
  }
  this_box_bn.onClick = function () {
    imageText = "box";
    imageDropdownlist_box.removeAll();
    for (var i = 0; i < bannerSizes.box.name.length; i++) {
      imageDropdownlist_box.add("item", bannerSizes.box.name[i]);
    }
    for (var index = 0; index < bannerSizes.box.name.length; index++) {
      if(bannerSizes.box.name[index] == this_box.text ){
        imageDropdownlist_box.selection = index;
        image_box.image = File(bannerSizes.box.data[index]);
        this_image = bannerSizes.box.data;
        PIC = index;
      }
    }
  }

  function isClicked(ix)
  {
    dialogBanner[bannerData[ix].name].onClick = function () {
      panel_Bg_IMG.text = "Selected layer is "+ bannerData[ix].name;
      panel_logo_IMG.text = "Selected layer is "+ bannerData[ix].name;
      panel_CTA_IMG.text = "Selected layer is "+ bannerData[ix].name;
      panel_box_IMG.text = "Selected layer is "+ bannerData[ix].name;
      imageDropdownlist.removeAll();
      imageDropdownlist_logo.removeAll();
      imageDropdownlist_CTA.removeAll();
      imageDropdownlist_box.removeAll();
      isBackgroundSame[ix].data.text = bannerData[ix].background.name;
      is_Background_Same.text = bannerData[ix].background.name;
      this_logo.text = bannerData[ix].logo.name;
      this_cta.text = bannerData[ix].CTA.name;
      this_box.text = bannerData[ix].box.name;
      var length_bg = bannerSizes["_"+bannerData[ix].name];

      for (var i = 0; i < bannerSizes["_"+bannerData[ix].name].name.length; i++) {
        imageDropdownlist.add("item", bannerSizes["_"+bannerData[ix].name].name[i]);
        if(length_bg.name[i] == isBackgroundSame[ix].data.text){
          image.image = length_bg.data[i];
          image.size = get_new_sizes(image_size,preferred_size);
          imageDropdownlist.selection = isBackgroundSame[ix].data.text;
        }
      }
      for (var i = 0; i < bannerSizes.logo.name.length; i++) {
        imageDropdownlist_logo.add("item", bannerSizes.logo.name[i]);
        if(bannerSizes.logo.name[i] == bannerData[ix].logo.name){
          image_logo.image = bannerSizes.logo.data_dialog[i];
          image_logo.size = get_new_sizes(image_size,preferred_size);
          imageDropdownlist_logo.selection = bannerSizes.box.name[i];
        }
      }
      for (var i = 0; i < bannerSizes.CTA.name.length; i++) {
        imageDropdownlist_CTA.add("item", bannerSizes.CTA.name[i]);
        if(bannerSizes.CTA.name[i] == bannerData[ix].CTA.name){
          image_CTA.image = bannerSizes.CTA.data_dialog[i];
          image_CTA.size = get_new_sizes(image_size,preferred_size);
          imageDropdownlist_CTA.selection = bannerSizes.box.name[i];
        }
      }
      for (var i = 0; i < bannerSizes.box.name.length; i++) {
        imageDropdownlist_box.add("item", bannerSizes.box.name[i]);
        if(bannerSizes.box.name[i] == bannerData[ix].box.name){
          image_box.image = bannerSizes.box.data_dialog[i];
          image_box.size = get_new_sizes(image_size,preferred_size);
          imageDropdownlist_box.selection = bannerSizes.box.name[i];
        }
      }
        thisIndex = ix;
      }


  }




  function upDateBackgrounds(){
    for(var i = 0 ; i < bannerData.length ; i++){
      bannerData[i].print = dialogBanner[i].value;
     

    }

  }

  dialogBanner.center();
  return dialogBanner.show();
}
function loadSettings() {
  exportSettings = app.getCustomOptions(settingsID);

  for (var i = 0, len = CSV_data_banner.length; i < len; i++) {
    if (exportSettings.hasKey(checkboxID[i]))
      checkbox[i] = exportSettings.getBoolean(checkboxID[i]);
  }
}
function SavePSD(saveFilePSD) {
  psdSaveOptions = new PhotoshopSaveOptions();
  psdSaveOptions.embedColorProfile = true;
  psdSaveOptions.alphaChannels = true;
  psdSaveOptions.layers = true;
  psdSaveOptions.annotations = true;
  psdSaveOptions.spotColors = true;
  app.activeDocument.saveAs(saveFilePSD, psdSaveOptions, true, Extension.LOWERCASE);
  //app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
};
//_____________________________________________[ CSV FILE ]
function getUnits() {

  var units = 'px';
  var ruler = app.preferences.rulerUnits.toString();
  var key = ruler.replace('Units.', '');

  switch (key) {
    case 'PIXELS': units = 'px'; break;
    case 'INCHES': units = 'in'; break;
    case 'CM': units = 'cm'; break;
    case 'MM': units = 'mm'; break;
    case 'POINTS': units = 'pt'; break;
    case 'PICAS': units = 'pc'; break;
    case 'PERCENT': units = 'px'; break;
  }

  return units;
}
function readCSV(f) {

  f.open('r');
  var s = f.read();
  f.close();
  return s.split(/\r\n|\n/);
}
function parseCsvDataBanner(f_selCSVInp, units, nameKey, nameOfCSV) {

  var rows = readCSV(f_selCSVInp);
  var arr = [];
  if (nameOfCSV == "banner.csv") {
    if (selCSVInp_text == "banner.csv") {
      for (var i = 1, len = rows.length; i < len; i++) {
        var curRow = rows[i].replace(/\"/g, '');
        var data = curRow.split(/,|:/);
        if (!data[1] || !data[1].length) continue;
        if (!data[2] || !data[2].length) continue;

        var w = toAbsNum(data[1], 0);
        var h = toAbsNum(data[2], 0);
        var size = w + 'x' + h + units;
        var creative = data[3];
        var typeOf = data[4];
        var numberOf = data[5];
        var sLogo = data[6];
        var xLogoPos = data[7];
        var yLogoPos = data[8];
        var sBackgound = data[9];
        var CTA = data[10];
        var xCTAPos = data[11];
        var yCTAPos = data[12];
        var CTASize = data[13];
        var box_name = data[14];
        var xBoxPos = data[15];
        var yBoxPos = data[16];

        w = convertUnits(w, units, 'px');
        h = convertUnits(h, units, 'px');

        if (w < 1 || h < 1) continue;

        var name = (data[0] && data[0].replace(/\s/g, '').length) ? data[0] : '';
        if (nameKey === 0 && name === '') name = size;
        else if (nameKey === 1) name += (name.length ? '_' : '') + size;
        else if (nameKey === 2) name = size;

        arr.push({
          name: name,
          width: w,
          height: h,
          creative: creative,
          typeOf: typeOf,
          numberOf: numberOf,
          sLogo: sLogo,
          xLogoPos: xLogoPos,
          yLogoPos: yLogoPos,
          sBackgound: sBackgound,
          CTA: CTA,
          xCTAPos: xCTAPos,
          yCTAPos: yCTAPos,
          CTASize: CTASize,
          box: box_name,
          xBoxPos: xBoxPos,
          yBoxPos: yBoxPos,
        });
      }
    }
  } else {
    alert("Banner file not selected !!")
  }
  return arr;
}
function parseCsvData(f_selCSVInp, units, nameKey, nameOfCSV) {

  var rows = readCSV(f_selCSVInp);
  var arr = [];
  for (var i = 0, len = rows.length; i < len; i++) {
    arr.push(rows[i]);
  }
  return arr;
}
//_____________________________________________[ CSV FILE CLOSE ]

function get_CSV_data(selCSVInp_text, nameOfCSV) {
  for (var i = 0; i < nameOfCSV.length; i++) {
    var sheet = new File(nameOfCSV[i].path);
    if (!sheet.exists) {
      alert('CSV file not found\nMake sure the file path is correct', 'Script error');
    }
    if (selCSVInp_text == "banner.csv" && nameOfCSV[i].name == "banner.csv") {
      var dataCSV = parseCsvDataBanner(sheet, units, 0, nameOfCSV[i].name);
      CSV_data.push({
        name: sheet.name,
        name_: dataCSV
      });
    }
    if (selCSVInp_text == "empty" && nameOfCSV[i].name != "banner.csv") {
      var dataCSV = parseCsvData(sheet, units, 0, nameOfCSV[i].name);
      CSV_data.push({
        name: sheet.name,
        name_: dataCSV
      });
    }

    // alert("test");
  }
}

function get_current_job() {
  return myInput("Current Job");
}
function get_working_folder_path() {
  var ext = '.csv';
  var title = "Please select working folder";
  var inFolder = Folder.selectDialog(title);
  if (inFolder != null) {
    f = inFolder.getFiles(/\.(csv)$/i);
    for (var i = 0; i < f.length; i++) {
      nameOfCSV.push({
        name: f[i].name,
        path: decodeURI(f[i]),
      });
    }
  }
  return inFolder;
}
function create_folder(destStaticsPath_nameOfCurrentJob) {
  destStatics = new Folder(destStaticsPath_nameOfCurrentJob)
  if (!destStatics.exists) {
    destStatics.create();
  }
}
function myInput(input_value) {
  var output_value = "currentJob";
  var input_in_system_window_dialog = new Window('dialog {orientation: "row", alignChildren: [" ", "top"]}', "Current Job start with job number", undefined, { closeButton: false, borderless: false });
  input_in_system_window_dialog.margins = [5, 5, 5, 5];
  input_in_system_window_dialog.alignChildren = "bottom";

  var input_in_system_panel = input_in_system_window_dialog.add("panel");
  input_in_system_panel.orientation = "row";
  input_in_system_panel.alignment = "left";
  input_in_system_panel.add("statictext", undefined, "please Enter : " + input_value);

  var input_in_system_value = input_in_system_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
  input_in_system_value.active = true;


  var button_group = input_in_system_window_dialog.add("group");
  button_group.alignment = "right";

  var btnOk = button_group.add("button", undefined, undefined, { name: "ok" });
  btnOk.text = "OK";
  var btnCancel = button_group.add("button", undefined, undefined, { name: "cancel" });
  btnCancel.text = "Cancel";

  function updateParams() {
    output_value = input_in_system_value.text;
  };

  btnOk.onClick = function () {
    updateParams();
    input_in_system_window_dialog.close(1);
  }
  input_in_system_window_dialog.show();
  return output_value;
}
function get_output_name(data_to_select_from) {
  // DIALOG
  // ======
  var dialog = new Window("dialog");
  dialog.text = "Test UI";
  dialog.orientation = "row";
  dialog.alignChildren = ["left", "top"];
  dialog.spacing = 10;
  dialog.margins = 16;

  // GROUP1
  // ======
  var group1 = dialog.add("group", undefined, { name: "group1" });
  group1.preferredSize.width = 150;
  group1.orientation = "column";
  group1.alignChildren = ["fill", "top"];
  group1.spacing = 10;
  group1.margins = 0;
  group1.alignment = ["left", "fill"];

  // PANEL1
  // ======
  var panel1 = group1.add("panel", undefined, undefined, { name: "panel1" });
  panel1.text = "Checkbox Group";
  panel1.orientation = "column";
  panel1.alignChildren = ["left", "top"];
  panel1.spacing = 10;
  panel1.margins = 10;
  panel1.alignment = ["fill", "top"];


  check_data = data_to_select_from;
  for (var i = 1, len = check_data.length; i < len; i++) {
    checkbox[i] = false;
  }
  var export_folders_name = [];

  for (var i = 1, len = data_to_select_from.length; i < len; i++) {
    dialog[check_data[i]] = panel1.add("checkbox", undefined, undefined, { name: check_data[i] });
    dialog[check_data[i]].text = check_data[i];
    dialog[check_data[i]].alignment = ["fill", "top"];
    dialog[check_data[i]].value = check_data[i];
  }
  // 

  // GROUP2
  // ======
  var group2 = dialog.add("group", undefined, { name: "group2" });
  group2.orientation = "column";
  group2.alignChildren = ["fill", "top"];
  group2.spacing = 10;
  group2.margins = 0;

  var ok = group2.add("button", undefined, undefined, { name: "ok" });
  ok.text = "OK";

  var cancel = group2.add("button", undefined, undefined, { name: "cancel" });
  cancel.text = "Cancel";

  //update the params and save them off on close
  function updateParams() {
    for (var i = 1, len = check_data.length; i < len; i++) {
      checkbox[i] = dialog[check_data[i]].value;
      if (checkbox[i] == true) {
        export_folders_name.push(check_data[i]);
        //export_folders_name[i]=check_data[i];
      }
    }

  };


  ok.onClick = function () {
    updateParams();
    saveSettings();
    dialog.close(1);
  };

  dialog.center();
  for (var i = 0, len = check_data.length; i < len; i++) {
    var thisHoldSizeName = toString(check_data[i]);

    var thisHoldTypeID = stringIDToTypeID(thisHoldSizeName);

    checkboxID[i] = thisHoldTypeID;
  }
  var exportSettings;

  try {
    exportSettings = app.getCustomOptions(settingsID);
  } catch (e) {
    saveSettings();
  }

  if (typeof exportSettings == "undefined") {
    saveSettings();
  }

  dialog.show();
  return export_folders_name;
}

function saveSettings() {
  //save defaults
  var newExportSettings = new ActionDescriptor();

  for (var index = 1, len = checkbox.length; index < len; index++) {
    newExportSettings.putBoolean(checkboxID[index], checkbox[index]);
  }

  app.putCustomOptions(settingsID, newExportSettings, true);
}
function showDialog() {

  // DIALOG
  // ======
  var dialog = new Window("dialog");
  dialog.text = "Test UI";
  dialog.orientation = "row";
  dialog.alignChildren = ["left", "top"];
  dialog.spacing = 10;
  dialog.margins = 16;

  // GROUP1
  // ======
  var group1 = dialog.add("group", undefined, { name: "group1" });
  group1.preferredSize.width = 150;
  group1.orientation = "column";
  group1.alignChildren = ["fill", "top"];
  group1.spacing = 10;
  group1.margins = 0;
  group1.alignment = ["left", "fill"];


  // PANEL1
  // ======
  var panel1 = group1.add("panel", undefined, undefined, { name: "panel1" });
  panel1.text = "Sizes";
  panel1.orientation = "column";
  panel1.alignChildren = ["left", "top"];
  panel1.spacing = 10;
  panel1.margins = 10;
  panel1.alignment = ["fill", "top"];

  selCSVInp = group1.add('edittext', undefined, Folder.desktop, { readonly: false });
  selCSVInp.maximumSize.width = 180;

  for (var i = 0, len = CSV_data_banner.length; i < len; i++) {
    dialog[CSV_data_banner[i].name] = panel1.add("checkbox", undefined, undefined, { name: CSV_data_banner[i].name });
    dialog[CSV_data_banner[i].name].text = CSV_data_banner[i].name + " - " + CSV_data_banner[i].creative + " - " + CSV_data_banner[i].typeOf;
    dialog[CSV_data_banner[i].name].alignment = ["fill", "top"];
    dialog[CSV_data_banner[i].name].value = checkbox[i];
  }

  // GROUP1

  var gNumber = dialog.add("group", undefined, { name: "group1" });
  gNumber.orientation = "column";
  gNumber.alignChildren = ["fill", "top"];
  gNumber.spacing = 5;
  gNumber.margins = 0;
  gNumber.alignment = ["left", "fill"];
  //_____________________________________[Logos GROUP] 

  var gLogos = dialog.add("group", undefined, { name: "group1" });
  gLogos.orientation = "column";
  gLogos.alignChildren = ["fill", "top"];
  gLogos.spacing = 5;
  gLogos.margins = 0;
  gLogos.alignment = ["left", "fill"];

  //_____________________________________[xLogos GROUP] 

  var gXLogos = dialog.add("group", undefined, { name: "group1" });
  gXLogos.orientation = "column";
  gXLogos.alignChildren = ["fill", "top"];
  gXLogos.spacing = 5;
  gXLogos.margins = 0;
  gXLogos.alignment = ["left", "fill"];

  //_____________________________________[yLogos GROUP] 

  var gYLogos = dialog.add("group", undefined, { name: "group1" });
  gYLogos.orientation = "column";
  gYLogos.alignChildren = ["fill", "top"];
  gYLogos.spacing = 5;
  gYLogos.margins = 0;
  gYLogos.alignment = ["left", "fill"];

  // PANEL1
  // ======
  var panel1c = gNumber.add("panel", undefined, undefined, { name: "panel1c" });
  panel1c.text = "Sizes";
  panel1c.orientation = "column";
  panel1c.alignChildren = ["fill", "center"];
  panel1c.spacing = 5;
  panel1c.margins = 5;
  panel1c.alignment = ["fill", "top"];

  for (var i = 0, len = CSV_data_banner.length; i < len; i++) {
    numberOfs[i] = panel1c.add('edittext', undefined, numberOfs[i]);
  }
  //________________________________________[Logos PANEL]
  var panelLogos = gLogos.add("panel", undefined, undefined, { name: "panel1c" });
  panelLogos.text = "Logo";
  panelLogos.orientation = "column";
  panelLogos.alignChildren = ["fill", "center"];
  panelLogos.spacing = 5;
  panelLogos.margins = 5;
  panelLogos.alignment = ["fill", "top"];

  for (var i = 0, len = CSV_data_banner.length; i < len; i++) {
    logosD[i] = panelLogos.add('edittext', undefined, logos[i]);
  }
  //________________________________________[xLogos PANEL]
  var panel1c = gXLogos.add("panel", undefined, undefined, { name: "panel1c" });
  panel1c.text = "xLogo";
  panel1c.orientation = "column";
  panel1c.alignChildren = ["fill", "center"];
  panel1c.spacing = 5;
  panel1c.margins = 5;
  panel1c.alignment = ["fill", "top"];

  for (var i = 0, len = CSV_data_banner.length; i < len; i++) {
    xLogosD[i] = panel1c.add('edittext', undefined, xLogos[i]);
  }

  //________________________________________[YLogos PANEL]
  var panel1c = gYLogos.add("panel", undefined, undefined, { name: "panel1c" });
  panel1c.text = "yLogo";
  panel1c.orientation = "column";
  panel1c.alignChildren = ["fill", "center"];
  panel1c.spacing = 5;
  panel1c.margins = 5;
  panel1c.alignment = ["fill", "top"];

  for (var i = 0, len = CSV_data_banner.length; i < len; i++) {
    yLogosD[i] = panel1c.add('edittext', undefined, yLogos[i]);
  }


  // Options
  var optPnl = dialog.add('panel', undefined, 'Vertical Spacing');
  optPnl.alignChildren = ['fill', 'center'];
  optPnl.margins = [12, 14, 10, 14];

  var padGrp = optPnl.add('group');

  padInp = padGrp.add('edittext', undefined, 50);
  padInp.characters = 6;

  padGrp.add('statictext', undefined, units);

  // Background options
  var bgPnl = dialog.add('panel', undefined, 'Background');
  bgPnl.alignChildren = ['fill', 'center'];
  bgPnl.margins = [12, 14, 10, 14];

  isWhite = bgPnl.add('radiobutton', undefined, 'White');
  isWhite.value = true;

  isBlack = bgPnl.add('radiobutton', undefined, 'Black');
  isTransparent = bgPnl.add('radiobutton', undefined, 'Transparent');

  if (/mm|cm|in/.test(units)) {
    win.add('statictext', undefined, 'Script can slowly add artboards');
  }

  // GROUP2
  // ======
  var group2 = dialog.add("group", undefined, { name: "group2" });
  group2.orientation = "column";
  group2.alignChildren = ["fill", "top"];
  group2.spacing = 10;
  group2.margins = 0;

  var ok = group2.add("button", undefined, undefined, { name: "ok" });
  ok.text = "OK";

  var cancel = group2.add("button", undefined, undefined, { name: "cancel" });
  cancel.text = "Cancel";

  //update the params and save them off on close
  function updateParams() {
    for (var i = 0, len = CSV_data_banner.length; i < len; i++) {
      checkbox[i] = dialog[CSV_data_banner[i].name].value;
    }

  };


  ok.onClick = function () {
    updateParams();
    saveSettings();
    dialog.close(1);
  };

  dialog.center();
  return dialog.show();

}
function set_doc_zoom(zoom) {

  try {

    if (!zoom) zoom = 100;

    var d = new ActionDescriptor();

    var r = new ActionReference();

    r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("zoom"));

    r.putEnumerated(stringIDToTypeID("document"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));

    d.putReference(stringIDToTypeID("null"), r);

    var d1 = new ActionDescriptor();

    d1.putDouble(stringIDToTypeID("zoom"), zoom / 100);

    d.putObject(stringIDToTypeID("to"), stringIDToTypeID("zoom"), d1);

    executeAction(stringIDToTypeID("set"), d, DialogModes.NO);

  }

  catch (e) { throw (e); }

}

function set_doc_position(x, y) {

  try {

    var r = new ActionReference();

    r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("documentArea"));

    r.putEnumerated(stringIDToTypeID("application"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));

    var _l = executeActionGet(r).getObjectValue(stringIDToTypeID("documentArea")).getUnitDoubleValue(stringIDToTypeID("left"));

    var _t = executeActionGet(r).getObjectValue(stringIDToTypeID("documentArea")).getUnitDoubleValue(stringIDToTypeID("top"));

    var _r = executeActionGet(r).getObjectValue(stringIDToTypeID("documentArea")).getUnitDoubleValue(stringIDToTypeID("right"));

    var _b = executeActionGet(r).getObjectValue(stringIDToTypeID("documentArea")).getUnitDoubleValue(stringIDToTypeID("bottom"));

    var r = new ActionReference();

    r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("workspacePreferences"));

    r.putEnumerated(stringIDToTypeID("application"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));

    var large_tabs = executeActionGet(r).getObjectValue(stringIDToTypeID("workspacePreferences")).getBoolean(stringIDToTypeID("enableLargeTabs"));

    var d1 = new ActionDescriptor();

    d1.putBoolean(stringIDToTypeID("enableLargeTabs"), false);

    var dx = 9;                // some offset ??????

    var dy = large_tabs ? 24 : 19; // ??????

    x = (_r - _l) / 2 + x - dx;

    y = (_b - _t) / 2 + y - dy;

    var d = new ActionDescriptor();

    var r = new ActionReference();

    r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("center"));

    r.putEnumerated(stringIDToTypeID("document"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));

    d.putReference(stringIDToTypeID("null"), r);

    var d1 = new ActionDescriptor();

    d1.putUnitDouble(stringIDToTypeID("horizontal"), stringIDToTypeID("distanceUnit"), x);

    d1.putUnitDouble(stringIDToTypeID("vertical"), stringIDToTypeID("distanceUnit"), y);

    d.putObject(stringIDToTypeID("to"), stringIDToTypeID("center"), d1);

    executeAction(stringIDToTypeID("set"), d, DialogModes.NO);

  }

  catch (e) { throw (e); }

}
// Convert units of measurement
function convertUnits(value, currUnits, newUnits) {

  UnitValue.baseUnit = UnitValue(1 / activeDocument.resolution, 'in');
  var newValue = new UnitValue(value, currUnits);
  newValue = newValue.as(newUnits);
  UnitValue.baseUnit = null;
  return newValue;
}
// Convert string to absolute number
function toAbsNum(str, def) {

  if (arguments.length == 1 || !def) def = 1;
  str = str.replace(/,/g, '.').replace(/[^\d.]/g, '');
  str = str.split('.');
  str = str[0] ? str[0] + '.' + str.slice(1).join('') : '';
  if (isNaN(str) || !str.length) return parseFloat(def);
  else return parseFloat(str);
}
function cTID(s) {

  return app.charIDToTypeID(s);
}

function sTID(s) {

  return app.stringIDToTypeID(s);
}
// Add an artboard with custom parameters
function createArtboard(bannerDataArtboard, delta, deltaX, bg) {

  var ww = parseFloat(bannerDataArtboard.width);
  var hh = parseFloat(bannerDataArtboard.height);
  var size = bannerDataArtboard.width + 'x' +bannerDataArtboard.height + 'px';

  // Make artboard
  var idMk = cTID('Mk  ');
  var desc = new ActionDescriptor();
  var idNull = cTID('null');
  var ref = new ActionReference();
  var idArtboardSection = sTID('artboardSection');
  ref.putClass(idArtboardSection);
  desc.putReference(idNull, ref);
  var idLayerSectionStart = sTID('layerSectionStart');
  desc.putInteger(idLayerSectionStart, 5);
  var idLayerSectionEnd = sTID('layerSectionEnd');
  desc.putInteger(idLayerSectionEnd, 6);
  var idNm = cTID('Nm  ');
  desc.putString(idNm, "" + size + "");

  var idArtboardRect = sTID('artboardRect');
  var descRect = new ActionDescriptor();

  var idTop = cTID('Top ');
  descRect.putDouble(idTop, 0.000000);

  var idLeft = cTID('Left');
  descRect.putDouble(idLeft, deltaX);

  var idBtom = cTID('Btom');
  descRect.putDouble(idBtom, parseInt(bannerDataArtboard.height)); // Height

  var idRght = cTID('Rght');
  descRect.putDouble(idRght, parseInt(bannerDataArtboard.width)); // Width

  var idClassFloatRect = sTID('classFloatRect');
  desc.putObject(idArtboardRect, idClassFloatRect, descRect);
  executeAction(idMk, desc, DialogModes.NO);

  // Set artboard name
  var idSetD = cTID('setd');
  var descName1 = new ActionDescriptor();
  var refName = new ActionReference();
  var idLyr = cTID('Lyr ');
  var idOrdn = cTID('Ordn');
  var idTrgt = cTID('Trgt');
  refName.putEnumerated(idLyr, idOrdn, idTrgt);
  descName1.putReference(idNull, refName);
  var idT = cTID('T   ');
  var descName2 = new ActionDescriptor();

  // Artboard name
  descName2.putString(idNm, "" + bannerDataArtboard.artboard + "");

  descName1.putObject(idT, idLyr, descName2);
  executeAction(idSetD, descName1, DialogModes.NO);

  // Artboard position
  var idEditArtboardEvent = sTID('editArtboardEvent');
  var descPos1 = new ActionDescriptor();
  var refPos = new ActionReference();
  refPos.putEnumerated(idLyr, idOrdn, idTrgt);
  descPos1.putReference(idNull, refPos);
  var idArtboard = sTID('artboard');
  var descPos2 = new ActionDescriptor();

  descRect.putDouble(idLeft, deltaX); // Artboard X
  descRect.putDouble(idTop, delta); // Artboard Y
  descRect.putDouble(idBtom, hh);
  descRect.putDouble(idRght, ww);

  descPos2.putObject(idArtboardRect, idClassFloatRect, descRect);
  var idGuideIDs = sTID('guideIDs');
  var list = new ActionList();
  descPos2.putList(idGuideIDs, list);
  var idArtboardPresetName = sTID('artboardPresetName');
  descPos2.putString(idArtboardPresetName, "" + size + "");

  // Color
  var idClr = cTID('Clr ');
  var desc98 = new ActionDescriptor();
  var idRd = cTID('Rd  ');
  desc98.putDouble(idRd, 255.000000);
  var idGrn = cTID('Grn ');
  desc98.putDouble(idGrn, 255.000000);
  var idBl = cTID('Bl  ');
  desc98.putDouble(idBl, 255.000000);
  var idRGBC = cTID('RGBC');
  descPos2.putObject(idClr, idRGBC, desc98);
  var idArtboardBackgroundType = sTID('artboardBackgroundType');

  descPos2.putInteger(idArtboardBackgroundType, parseInt(bg));

  var idArtboard = sTID('artboard');
  descPos1.putObject(idArtboard, idArtboard, descPos2);
  var idChangeSizes = sTID('changeSizes');
  descPos1.putInteger(idChangeSizes, 5);
  executeAction(idEditArtboardEvent, descPos1, DialogModes.NO);
}
function makeFrame(psdFile,bannerDataArtboard ) {
  var xy = bannerDataArtboard.artboardPos;
  // main loop starts here
  for (var i = 0; i < fileList.length; i++) {
    
 if(fileList[i].name != "00_default.png" ){
    if(fileList[i].name == bannerDataArtboard.background.backgroundIMG){
      open(fileList[i]);
      activeDocument.selection.selectAll();
      activeDocument.selection.copy();
      app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
      getMeThisLayer(get_remove_img_ext(fileList[i].name), bannerDataArtboard);
      app.activeDocument.paste();
      layerIMG = app.activeDocument.activeLayer;
    }
    if(fileList[i].name == bannerDataArtboard.box.name){
      open(fileList[i]);
      activeDocument.selection.selectAll();
      activeDocument.selection.copy();
      app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
      getMeThisLayer(get_remove_img_ext(fileList[i].name), bannerDataArtboard);
      app.activeDocument.paste();
      layerIMG = app.activeDocument.activeLayer;

      var yLogoSize = (layerIMG.bounds[3].value - layerIMG.bounds[1].value);
      var xLogoSize = (layerIMG.bounds[2].value - layerIMG.bounds[0].value);
      var yCanvasSize = (layerIMG.bounds[3].value + layerIMG.bounds[1].value);
      var xCanvasSize = (layerIMG.bounds[2].value + layerIMG.bounds[0].value);
      var yMyValueCTA = bannerDataArtboard.box.yPos;
      var xMyValueCTA = bannerDataArtboard.box.xPos;

      if (yMyValueCTA < yLogoSize) {
        if (yMyValueCTA < 0) {
          yMyValueCTA = yMyValueCTA * -1;
        }
        yMyValueCTA = yLogoSize + yMyValueCTA;
      } else {
        if (yMyValueCTA > yCanvasSize + yLogoSize) {
          alert("your logo is out range the canvas on your Y-axis");
          yMyValueCTA = yCanvasSize;
        } else {
          yMyValueCTA = yMyValueCTA + yLogoSize;
        }
      }
      //881 117
      if (xMyValueCTA < xLogoSize) {
        if (xMyValueCTA < 0) {
          xMyValueCTA = xMyValueCTA * -1;
        }
        xMyValueCTA = xLogoSize + xMyValueCTA;
      } else {
        if (xMyValueCTA > xCanvasSize + xLogoSize) {
          alert("your logo is out size the canvas on your X-axis");
          xMyValueCTA = xCanvasSize
        } else {
          xMyValueCTA = xMyValueCTA + xLogoSize;
          if (parseInt(xy) > 0) {
            yMyValueCTA = yMyValueCTA - yLogoSize;
            xMyValueCTA = xMyValueCTA - xLogoSize;
          }
        }
      }

      if (parseInt(xy) > 0) {
        if (bannerDataArtboard.id == 0) {
          var yNeedValue = yNext + yMyValueCTA + layerIMG.bounds[3].value - yCanvasSize - yLogoSize;
        } else {
          var yNeedValue = yNext + yMyValueCTA + layerIMG.bounds[3].value - yCanvasSize - yLogoSize;
        }
      } else {
        var yNeedValue = yMyValueCTA + layerIMG.bounds[3].value - yCanvasSize - yLogoSize;
      }

      if (parseInt(xy) > 0) {
        if (bannerDataArtboard.id == 0) {
          var xNeedValue = xNext + xMyValueCTA + layerIMG.bounds[2].value - xCanvasSize - xLogoSize;
        } else {
          var xNeedValue = xNext + xMyValueCTA + layerIMG.bounds[2].value - xCanvasSize - xLogoSize;
        }
      } else {

        var xNeedValue = xMyValueCTA + layerIMG.bounds[2].value - xCanvasSize - xLogoSize;
      }
      //400x-413 
      layerIMG.translate(new UnitValue(xNeedValue, 'px'), new UnitValue(yNeedValue, 'px'));
      activeDocument.selection.deselect();
    }
    if(fileList[i].name == bannerDataArtboard.logo.name){
      open(fileList[i]);
      activeDocument.selection.selectAll();
      activeDocument.selection.copy();
      app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
      getMeThisLayer(get_remove_img_ext(fileList[i].name), bannerDataArtboard);
      app.activeDocument.paste();
      layerIMG = app.activeDocument.activeLayer;

      var yLogoSize = (layerIMG.bounds[3].value - layerIMG.bounds[1].value);
      var xLogoSize = (layerIMG.bounds[2].value - layerIMG.bounds[0].value);
      var yCanvasSize = (layerIMG.bounds[3].value + layerIMG.bounds[1].value);
      var xCanvasSize = (layerIMG.bounds[2].value + layerIMG.bounds[0].value);
      var yMyValueCTA = bannerDataArtboard.logo.yPos;
      var xMyValueCTA = bannerDataArtboard.logo.xPos;

      if (yMyValueCTA < yLogoSize) {
        if (yMyValueCTA < 0) {
          yMyValueCTA = yMyValueCTA * -1;
        }
        yMyValueCTA = yLogoSize + yMyValueCTA;
      } else {
        if (yMyValueCTA > yCanvasSize + yLogoSize) {
          alert("your logo is out range the canvas on your Y-axis");
          yMyValueCTA = yCanvasSize;
        } else {
          yMyValueCTA = yMyValueCTA + yLogoSize;
        }
      }
      //881 117
      if (xMyValueCTA < xLogoSize) {
        if (xMyValueCTA < 0) {
          xMyValueCTA = xMyValueCTA * -1;
        }
        xMyValueCTA = xLogoSize + xMyValueCTA;
      } else {
        if (xMyValueCTA > xCanvasSize + xLogoSize) {
          alert("your logo is out size the canvas on your X-axis");
          xMyValueCTA = xCanvasSize
        } else {
          xMyValueCTA = xMyValueCTA + xLogoSize;
          if (parseInt(xy) > 0) {
            yMyValueCTA = yMyValueCTA - yLogoSize;
            xMyValueCTA = xMyValueCTA - xLogoSize;
          }
        }
      }

      if (parseInt(xy) > 0) {
        if (bannerDataArtboard.id == 0) {
          var yNeedValue = yNext + yMyValueCTA + layerIMG.bounds[3].value - yCanvasSize;
        } else {
          var yNeedValue = yNext + yMyValueCTA + layerIMG.bounds[3].value - yCanvasSize
        }
      } else {
        var yNeedValue = yMyValueCTA + layerIMG.bounds[3].value - yCanvasSize - yLogoSize;
      }

      if (parseInt(xy) > 0) {
        if (bannerDataArtboard.id == 0) {
          var xNeedValue = xNext + xMyValueCTA + layerIMG.bounds[2].value - xCanvasSize;
        } else {
          var xNeedValue = xNext + xMyValueCTA + layerIMG.bounds[2].value - xCanvasSize;
        }
      } else {

        var xNeedValue = xMyValueCTA + layerIMG.bounds[2].value - xCanvasSize - xLogoSize;
      }
      //400x-413 
      layerIMG.translate(new UnitValue(xNeedValue, 'px'), new UnitValue(yNeedValue, 'px'));
      activeDocument.selection.deselect();
    }
    if(fileList[i].name == bannerDataArtboard.CTA.name){
      open(fileList[i]);
      activeDocument.selection.selectAll();
      activeDocument.selection.copy();
      app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
      getMeThisLayer(get_remove_img_ext(fileList[i].name), bannerDataArtboard);
      app.activeDocument.paste();
      layerIMG = app.activeDocument.activeLayer;

      var yLogoSize = (layerIMG.bounds[3].value - layerIMG.bounds[1].value);
      var xLogoSize = (layerIMG.bounds[2].value - layerIMG.bounds[0].value);
      var yCanvasSize = (layerIMG.bounds[3].value + layerIMG.bounds[1].value);
      var xCanvasSize = (layerIMG.bounds[2].value + layerIMG.bounds[0].value);
      var yMyValueCTA = bannerDataArtboard.CTA.yPos;
      var xMyValueCTA = bannerDataArtboard.CTA.xPos;
      var yCoordinate = layerIMG.bounds[1].value;
      var newPos = 0;

      if (yMyValueCTA < yLogoSize) {
        if (yMyValueCTA < 0) {
          yMyValueCTA = yMyValueCTA * -1;
        }
        yMyValueCTA = yLogoSize + yMyValueCTA;
      } else {
        if (yMyValueCTA > yCanvasSize + yLogoSize) {
          alert("your logo is out range the canvas on your Y-axis");
          yMyValueCTA = yCanvasSize;
        } else {
          yMyValueCTA = yMyValueCTA + yLogoSize;
        }
      }

      //881 117
      if (xMyValueCTA < xLogoSize) {
        if (xMyValueCTA < 0) {
          xMyValueCTA = xMyValueCTA * -1;
        }
        xMyValueCTA = xLogoSize + xMyValueCTA;
      } else {
        if (xMyValueCTA > xCanvasSize + xLogoSize) {
          alert("your logo is out size the canvas on your X-axis");
          xMyValueCTA = xCanvasSize
        } else {
          xMyValueCTA = xMyValueCTA + xLogoSize;
          if (parseInt(xy) > 0) {
            yMyValueCTA = yMyValueCTA - yLogoSize;
            xMyValueCTA = xMyValueCTA - xLogoSize;
          }
        }

      }

      if (parseInt(xy) > 0) {
        if (bannerDataArtboard.id == 0) {
          var yNeedValue = yNext + yMyValueCTA + layerIMG.bounds[3].value - yCanvasSize - yLogoSize;
        } else {
          var yNeedValue = yNext + yMyValueCTA + layerIMG.bounds[3].value - yCanvasSize - yLogoSize ;
        }
      } else {
        var yNeedValue = yMyValueCTA + layerIMG.bounds[3].value - yCanvasSize - yLogoSize;
      }

      if (parseInt(xy) > 0) {
        if (bannerDataArtboard.id == 0){
          var xNeedValue = xNext + xMyValueCTA + layerIMG.bounds[2].value - xCanvasSize - xLogoSize;
        } else {
          var xNeedValue = xNext + xMyValueCTA + layerIMG.bounds[2].value - xCanvasSize - xLogoSize ;
        }
      } else {
        var xNeedValue = xMyValueCTA + layerIMG.bounds[2].value - xCanvasSize - xLogoSize;
      }
      //400x-413 
      layerIMG.translate(new UnitValue(xNeedValue, 'px'), new UnitValue(yNeedValue, 'px'));

      activeDocument.selection.deselect()
    }
 }


  }
}
function resizeImage(width, height, resolution, scaleStyles, constrainProportions, interpolation) {
  var descriptor = new ActionDescriptor();
  descriptor.putUnitDouble(s2t("width"), s2t("pixelsUnit"), width);
  descriptor.putUnitDouble(s2t("height"), s2t("pixelsUnit"), height);
  descriptor.putUnitDouble(s2t("resolution"), s2t("densityUnit"), resolution);
  if (constrainProportions !== undefined) {
      descriptor.putBoolean(s2t("constrainProportions"), constrainProportions);
  }
  if (constrainProportions && scaleStyles !== undefined) {
      descriptor.putBoolean(s2t("scaleStyles"), scaleStyles);
  }
  var interpolationTypes = {
      'Nearest Neighbor': s2t("nearestNeighbor"),
      'Bilinear': s2t("bilinear"),
      'Bicubic': s2t("bicubic"),
      'Bicubic Smoother': s2t("bicubicSmoother"),
      'Bicubic Sharper': s2t("bicubicSharper"),
      'Bicubic Automatic': s2t("bicubicAutomatic"),
      'Preserve Details': s2t("preserveDetailsUpscale"),
      'Preserve Details 2.0': s2t("deepUpscale")
  };
  if (interpolation in interpolationTypes) {
      descriptor.putEnumerated(
          s2t("interfaceIconFrameDimmed"),
          s2t("interpolationType"),
          interpolationTypes[interpolation]
      );
  }
  executeAction(s2t("imageSize"), descriptor, DialogModes.NO);
}
function s2t(s) {
  return app.stringIDToTypeID(s);
}
function get_new_sizes(image_size,preferred_size_) {
  k = Math.min(preferred_size_[0] / image_size[0], preferred_size_[1] / image_size[1]);
  return [k * image_size[0], k * image_size[1]];
}