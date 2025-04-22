var work_folders_dialog;
var work_folders_data;
var workFolderPath;
var grpFolderInput ;
var client_is;
var output_value = "nothing selected";
var layers_ = ["Logo","Box","CTA","copy","TAC","Background"];
var layer_checkbox=[];
var banner_asset_data = [];
var banner_list = [];
var new_size;
var position_header = ["left_top","left_middle","left_bottom","right_top","right_middle","right_bottom","center_top","center_middle","center_bottom"];
var _position = [];
var nameOfCSV = [];
var selCSVInp_text = "empty";
var CSV_data = {};
var units = getUnits();
var is_add_new_size = false;
var checkbox = [];
var PSDPath;
var bannerData = [];
var defaultImage = "";
var bannerSizes = {};
var bannerBackground = [];
var bannerIMGs = [];
var fileList = "empty";
var isBackgroundSame = [];
var padInp;
var logosD = [];
var xLogosD = [];
var yLogosD = [];
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
var preferred_size = [200, 200];
for (var i = 0; i < layers_.length; i++) {
    layer_checkbox.push(false)
}
(function () {

    var title = "Layers Text To CSV";


    if (!/photoshop/i.test(app.name)) {
        alert("Script for Photoshop", title, false);
        return;
    }
    get_add_clients();
    selCSVInp_text = "banner.csv";
    get_all_csv(workFolderPath +"/"+ client_is);
    get_CSV_data(selCSVInp_text, nameOfCSV);
    get_dialog_confirm_data();
    var nameOfCurrentJob = get_current_job();
    var currentWorkFolderPath = workFolderPath +"/"+ client_is + "/" + nameOfCurrentJob;
    get_create_folder(currentWorkFolderPath);
    var default_folders = ["Received", "OpenFiles", "Export"];
    for (var i = 0; i < default_folders.length; i++) {
        var default_folder = currentWorkFolderPath + "/" + "0" + i + " " + default_folders[i];
        get_create_folder(default_folder);
        if (default_folders[i] == CSV_data[0]) {
          var CSV_data_selected = get_output_name(CSV_data);
          //came back too
          for (var x = 0, len = CSV_data_selected.length; x < len; x++) {
            var num = x + 1;
            var default_Export_folder = currentWorkFolderPath + "/" + "0" + i + " " + default_folders[i] + "/" + "0" + num + " " + CSV_data_selected[x];
            get_create_folder(default_Export_folder);
          }
        }
        if (default_folders[i] == "OpenFiles") {
      
          var default_Export_folder = currentWorkFolderPath + "/" + "0" + i + " " + default_folders[i];
          get_create_folder(default_Export_folder);
          var newDoc = app.documents.add(1000, 500, 2, nameOfCurrentJob);
      
          var fileName = nameOfCurrentJob;
          var fileType = ".psd";
          var saveFilePSD = saveFilePSD = File(default_Export_folder + '/' + fileName + fileType);
          SavePSD(saveFilePSD);
          PSDPath = saveFilePSD;
        }
        
      }
      get_Images(Folder(workFolderPath +"/"+ client_is+"/links"));
      //__________
      for (var i = 0; i < CSV_data.banner.length; i++) {
        checkbox[i] = false;
    }
      for (var i = 0; i < CSV_data.banner.length; i++) {
        if(CSV_data.banner[i].print_out){
            isBackgroundSame.push({
                id: i,
                isBG : false,
                data:{},
              });
              isLogoSame[i] = false;
              isCTASame[i] = false;
              isBoxSame[i] = false;
              numberOfs[i] = 0;

            bannerData.push({
                id: i,
                print_out:CSV_data.banner[i].print_out,
                name: CSV_data.banner[i].name,
                height: CSV_data.banner[i].height,
                width: CSV_data.banner[i].width,
                duplicate: "empty",
                artboard: "empty",
                artboardPos: "empty",
                background:{
                  name:"00_default.png",
                  path: defaultImage,
                  backgroundIMG:"00_default.png",
                  xPos:8,
                  yPos:7,
                  isSame: false,
                }
            });
            for (var a = 0; a < layers_.length; a++) {
                if (layers_[a] in CSV_data) {
                    bannerData[i][layers_[a]] = {
                          name:"00_default.png",
                          path: defaultImage,
                          xPos: 0,
                          yPos: 0,
                          isSame: false,
                    }; 
                }
                
            }
        }
      }
      //________________
      get_sort_data();
      main();
})();
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
function get_sort_data(){
    defaultImage = new File(workFolderPath +"/"+ client_is+"/links/dialog"+"/00_default.png");
    for (var i = 0; i < bannerData.length; i++) {
      var key ="_"+bannerData[i].name;
      var logo ="logo";
      var CTA = "CTA";
      var box = "box";

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
function get_create_folder(destStaticsPath_nameOfCurrentJob) {
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
function get_current_job() {
    return myInput("Current Job");
  }
// Convert units of measurement
function convertUnits(value, currUnits, newUnits) {

    UnitValue.baseUnit = UnitValue(1 / 300, 'in');
    var newValue = new UnitValue(value, currUnits);
    newValue = newValue.as(newUnits);
    UnitValue.baseUnit = null;
    return newValue;
  }
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

function readCSV(f) {

    f.open('r');
    var s = f.read();
    f.close();
    return s.split(/\r\n|\n/);
  }
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
function get_all_csv(inFolder) {
    inFolder = Folder(inFolder)
    if (inFolder != null) {
        f = inFolder.getFiles(/\.(csv)$/i);
        for (var i = 0; i < f.length; i++) {
          nameOfCSV.push({
            name: f[i].name,
            path: decodeURI(f[i]),
          });
        }
      }
    
}
function get_CSV_data(selCSVInp_text, nameOfCSV) {
    for (var i = 0; i < nameOfCSV.length; i++) {
      var sheet = new File(nameOfCSV[i].path);
      if (!sheet.exists) {
        alert('CSV file not found\nMake sure the file path is correct', 'Script error');
      }
      if (selCSVInp_text == "banner.csv" && nameOfCSV[i].name == "banner.csv") {
        var dataCSV = parseCsvDataBanner(sheet, units, 0, nameOfCSV[i].name);

        CSV_data[get_remove_ext(sheet.name)] = dataCSV;
      }
      if (nameOfCSV[i].name != "banner.csv") {
        var dataCSV = parseCsvData(sheet, units, 0, nameOfCSV[i].name);

        CSV_data[get_remove_ext(sheet.name)] = dataCSV;
      }
  
      // alert("test");
    }
  }
  function parseCsvData(f_selCSVInp, units, nameKey, nameOfCSV) {

    var rows = readCSV(f_selCSVInp);
    var arr = [];
        for (var i = 1, len = rows.length; i < len;i++) {
          var curRow = rows[i].replace(/\"/g, '');
          var data = curRow.split(/,|:/);
          if (!data[1] || !data[1].length) continue;
          if (!data[2] || !data[2].length) continue;
  
          var name = (data[0] && data[0].replace(/\s/g, '').length) ? data[0] : '';
          if (nameKey === 0 && name === '') name = size;
          else if (nameKey === 1) name += (name.length ? '_' : '') + size;
          else if (nameKey === 2) name = size;

          var obj_ = {name:name}
          for (var zz = 1; zz < data.length; ) {

            var x = toAbsNum(data[zz+1], 0);
            var y = toAbsNum(data[zz+2], 0);

            x = convertUnits(x, units, 'px');
            y = convertUnits(y, units, 'px');

            obj_[data[zz]] = {
                x:x,
                y:y,
            }
            zz=zz+3
          }
          
  
          arr.push(obj_);
        }

    return arr;
  }
  function get_remove_ext(name_with_ext) {

    if (name_with_ext.indexOf('.') != -1) {
      name_with_ext = name_with_ext.substring(0, name_with_ext.indexOf('.'));
    }
  return name_with_ext;
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
          });
        }
      }
    } else {
      alert("Banner file not selected !!")
    }
    return arr;
  }
function get_dialog_confirm_data() {
    var preview_dialog = new Window("dialog");
    preview_dialog.text = client_is + " confirm sizes or continue";
    preview_dialog.orientation = "row";
    preview_dialog.alignChildren = ["left", "top"];
    preview_dialog.spacing = 10;
    preview_dialog.margins = 16;
var preview_group = preview_dialog.add("group", undefined, { name: "preview" });
    preview_group.preferredSize.width = 150;
    preview_group.orientation = "column";
    preview_group.alignChildren = ["fill", "top"];
    preview_group.spacing = 10;
    preview_group.margins = 0;
    preview_group.alignment = ["left", "fill"];
var preview_panel = preview_group.add("panel", undefined, undefined, { name: "preview" });
    preview_panel.text ="preview";
    preview_panel.orientation = "column";
    preview_panel.alignChildren = ["left", "top"];
    preview_panel.spacing = 10;
    preview_panel.margins = 10;
    preview_panel.alignment = ["fill", "top"];

    for (var i = 0, len = CSV_data.banner.length; i < len; i++) {
        preview_dialog[CSV_data.banner[i].name] = preview_panel.add("checkbox", undefined, undefined, { name: CSV_data.banner[i].name });
        preview_dialog[CSV_data.banner[i].name].text = CSV_data.banner[i].name ;
        preview_dialog[CSV_data.banner[i].name].alignment = ["fill", "top"];
        preview_dialog[CSV_data.banner[i].name].value = checkbox[i];
    }

var button_add_group = preview_panel.add("group");
    button_add_group.alignment = "right";
    
    
var add_btn = button_add_group.add("button", undefined, undefined, { name: "add size" });
add_btn.text = "add size";

var button_group = preview_dialog.add("group");
    button_group.alignment = "right";


var btnOk = button_group.add("button", undefined, undefined, { name: "ok" });
btnOk.text = "continue";

var btnCancel = button_group.add("button", undefined, undefined, { name: "cancel" });
btnCancel.text = "Cancel";

function updateParams() {
    for (var i = 0, len = CSV_data.banner.length; i < len; i++) {
        CSV_data.banner[i]["print_out"] = preview_dialog[CSV_data.banner[i].name].value
        checkbox[i] = preview_dialog[CSV_data.banner[i].name].value;
      }
};

btnOk.onClick = function () {
  updateParams();
  preview_dialog.close(1);
}
add_btn.onClick = function () {
    is_add_new_size = true;
    get_add_new_sizes();
  }
preview_dialog.show();
    
}
function get_add_clients(){
    workFolderPath = get_working_folder_path();
    var myFileList = Folder(workFolderPath).getFiles();
    work_folders_data = GetFoldersCount(myFileList) ;

    client_is = get_add_clients_dialog();
    create_folder(workFolderPath +"/"+ client_is);
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
function GetFoldersCount(fileList){     

    var folderCount = 0;
    var data_ = [];

    for (var i = 0; i < fileList.length; i++){ 
        var myFile = fileList[i]; 
        if (myFile instanceof Folder){
            folderCount++;
            data_.push({
                id: folderCount,
                name : myFile.displayName,
                data:myFile,
            });
        }   
    } 
    return data_;
} 
function get_add_clients_dialog() {
    var input_value = "test"
    

        work_folders_dialog = new Window('dialog', "select client or add", undefined);
        work_folders_dialog.alignChildren = "fill";

    var client_panel = work_folders_dialog.add("panel", undefined, "Clients");
        client_panel.margins = [24, 24, 24, 18];

    var client_group = client_panel.add("group");
    for (var i = 0; i < work_folders_data.length; i++) {
        work_folders_dialog[work_folders_data[i].name] = client_group.add("radiobutton", undefined, work_folders_data[i].name);
        work_folders_dialog[work_folders_data[i].name].onClick = configureUi;
    }
        work_folders_dialog["create_new"] = client_group.add("radiobutton", undefined, "CREATE NEW CLIENT");
        work_folders_dialog["create_new"].onClick = configureUi;

        grpFolderInput = client_panel.add("group");
        grpFolderInput.margins.top = 9;
        grpFolderInput.alignment = ["left", "top"];
        grpFolderInput.preferredSize.width = 150;
        grpFolderInput.add('statictext', undefined, "ADD CLIENT : ");
    var create_new_client = grpFolderInput.add("edittext", undefined, undefined);
        create_new_client.preferredSize.width = 100;
    var button_group = work_folders_dialog.add("group");
        button_group.alignment = "right";
  
    var btnOk = button_group.add("button", undefined, undefined, { name: "ok" });
    btnOk.text = "OK";
    var btnCancel = button_group.add("button", undefined, undefined, { name: "cancel" });
    btnCancel.text = "Cancel";
    configureUi();
    function updateParams() {
        if (work_folders_dialog["create_new"].value) {
            grpFolderInput.enabled = true;
            output_value = create_new_client.text;
         }
    };
  
    btnOk.onClick = function () {
      updateParams();
      work_folders_dialog.close(1);
    }
    work_folders_dialog.show();
    return output_value;
    
}
function configureUi() {
    for (var i = 0; i < work_folders_data.length; i++) {
        if (work_folders_dialog["create_new"].value) {
            grpFolderInput.enabled = true;
            output_value ="create_new";
            return output_value
         } else if(work_folders_dialog[work_folders_data[i].name].value){
            grpFolderInput.enabled = false;
            output_value = work_folders_dialog[work_folders_data[i].name].text;
         }else{
            grpFolderInput.enabled = false;
         }
    }
    return output_value;
}
function create_folder(destStaticsPath_nameOfCurrentJob) {
  destStatics = new Folder(destStaticsPath_nameOfCurrentJob)
  if (!destStatics.exists) {
    destStatics.create();
    get_add_new_sizes();
  }
}
 function get_add_new_sizes() {
    new_size = get_add_size("Current Job");
    get_add_banner_asset(new_size);
    for (var i = 0; i < layer_checkbox.length; i++) {
        if(layer_checkbox[i]){
            get_banner_asset(layers_[i],new_size);
            get_add_csv_file(new_size);
        }
    }
    banner_list[new_size.name] =  banner_asset_data;
    get_add_clients();
 }
function get_add_csv_file(data) {
    var pathOutput = workFolderPath +"/"+ client_is;
    var nameOutput = "banner" + ".csv";
    var fullPath = pathOutput + "/" + nameOutput;
    var contents;
    var fileOutput;
    var i;
    var ii;
    var row;
    var encodeCsv = function (v) {
        var s = String(v);
        // Escape quotation marks.
        s = s.replace(/"/g, "\"\"");
        if (s.indexOf(",") > -1 || s.indexOf("\"") > -1) {
            // Wrap in quotation marks.
            s = "\"" + s + "\"";
        }
        return s;
    };

    if(is_add_new_size){
        var file = new File(fullPath);
        file.open("r");
        var old_data = file.read();
        file.close();

        contents = old_data;
        
        // Add rows.
        for (i = 0; i < 1; i++) {
            for (ii = 1; ii < 2; ii++) {
                row = data.name+','+data.x+','+data.y;
            }
            contents += row + "\r\n";
        }

        fileOutput = new File(fullPath);
        fileOutput.encoding = "UTF-8";
        try {
            if (!fileOutput.open("w")) {
                throw new Error("Failed to open CSV file.");
            }
            if (!fileOutput.write(contents)) {
                throw new Error("Failed to write CSV file.");
            }
        } finally {
            fileOutput.close();
        }

    }else{
            // Start data with header.
        contents = 'name,x,y\r\n';

        // Add rows.
        for (i = 0; i < 1; i++) {
            for (ii = 1; ii < 2; ii++) {
                row = data.name+','+data.x+','+data.y;
            }
            contents += row + "\r\n";
        }

        fileOutput = new File(fullPath);
        fileOutput.encoding = "UTF-8";
        try {
            if (!fileOutput.open("w")) {
                throw new Error("Failed to open CSV file.");
            }
            if (!fileOutput.write(contents)) {
                throw new Error("Failed to write CSV file.");
            }
        } finally {
            fileOutput.close();
        }
    }


    
}
function writeCsv(data, baseName) {
    var pathOutput = workFolderPath +"/"+ client_is;
    var nameOutput = baseName + ".csv";
    var fullPath = pathOutput + "/" + nameOutput;
    var contents;
    var fileOutput;
    var i;
    var ii;
    var row;
    var encodeCsv = function (v) {
        var s = String(v);
        // Escape quotation marks.
        s = s.replace(/"/g, "\"\"");
        if (s.indexOf(",") > -1 || s.indexOf("\"") > -1) {
            // Wrap in quotation marks.
            s = "\"" + s + "\"";
        }
        return s;
    };

    if(is_add_new_size){
        var file = new File(fullPath);
        file.open("r");
        var old_data = file.read();
        file.close();

        contents = old_data;
        
        // Add rows.
        for (i = 0; i < 1; i++) {
            row = new_size.name;
            for (ii = 1; ii < data.length; ii++) {
                row = row+','+data[ii].name+','+data[ii].x+','+data[ii].y;
            }
            contents += row + "\r\n";
        }

        fileOutput = new File(fullPath);
        fileOutput.encoding = "UTF-8";
        try {
            if (!fileOutput.open("w")) {
                throw new Error("Failed to open CSV file.");
            }
            if (!fileOutput.write(contents)) {
                throw new Error("Failed to write CSV file.");
            }
        } finally {
            fileOutput.close();
        }

    }else{


        // Start data with header.
        contents = baseName;
        for (var z = 0; z < data.length; z++) {
    
            if (z+1 == data.length ) {
                contents = contents+',name,x,y\r\n';
            }else{
                contents = contents+',name,x,y';
            }
            
        }
    
        // Add rows.
        for (i = 0; i < 1; i++) {
            row = new_size.name;
            for (ii = 1; ii < data.length; ii++) {
                row = row+','+data[ii].name+','+data[ii].x+','+data[ii].y;
            }
            contents += row + "\r\n";
        }
        pathOutput = workFolderPath +"/"+ client_is;
        nameOutput = baseName + ".csv";
        fullPath = pathOutput + "/" + nameOutput;
        fileOutput = new File(fullPath);
        fileOutput.encoding = "UTF-8";
        try {
            if (!fileOutput.open("w")) {
                throw new Error("Failed to open CSV file.");
            }
            if (!fileOutput.write(contents)) {
                throw new Error("Failed to write CSV file.");
            }
        } finally {
            fileOutput.close();
        }
    }


}
function get_add_size(input_value) {
    var new_size = {
        name:"",
        x: 0,
        y:0,
    };
    var input_in_system_window_dialog = new Window('dialog {orientation: "row", alignChildren: [" ", "top"]}', "create new size", undefined, { closeButton: false, borderless: false });
    input_in_system_window_dialog.margins = [5, 5, 5, 5];
    input_in_system_window_dialog.alignChildren = "bottom";


  
    var artboart_name = input_in_system_window_dialog.add("panel");
        artboart_name.orientation = "column";
        artboart_name.alignment = "left";
        artboart_name.add("statictext", undefined, "add new size : " + input_value);
  
    var artboart_value = artboart_name.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        artboart_value.active = true;

    var artboart_size_x = input_in_system_window_dialog.add("panel");
        artboart_size_x.orientation = "column";
        artboart_size_x.alignment = "left";
        artboart_size_x.add("statictext", undefined, "x size : ");

    var artboart_value_x = artboart_size_x.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        artboart_value_x.active = true;

    var artboart_size_y = input_in_system_window_dialog.add("panel");
        artboart_size_y.orientation = "column";
        artboart_size_y.alignment = "left";
        artboart_size_y.add("statictext", undefined, "y size : ");

    var artboart_value_y = artboart_size_y.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        artboart_value_y.active = true;
  
  
    var button_group = input_in_system_window_dialog.add("group");
    button_group.alignment = "right";
  
    var btnOk = button_group.add("button", undefined, undefined, { name: "ok" });
    btnOk.text = "OK";
    var btnCancel = button_group.add("button", undefined, undefined, { name: "cancel" });
    btnCancel.text = "Cancel";
  
    function updateParams() {
        new_size.name = artboart_value.text;
        new_size.x = parseInt(artboart_value_x.text);
        new_size.y = parseInt(artboart_value_y.text);
    };
  
    btnOk.onClick = function () {
      updateParams();
      input_in_system_window_dialog.close(1);
    }
    input_in_system_window_dialog.show();
    return new_size;
  }
  function get_add_banner_asset(artboard_data) {

    var banner_dialog = new Window("dialog");
        banner_dialog.text = "Test UI";
        banner_dialog.orientation = "row";
        banner_dialog.alignChildren = ["left", "top"];
        banner_dialog.spacing = 10;
        banner_dialog.margins = 16;
    var banner_group = banner_dialog.add("group", undefined, { name: artboard_data.name });
        banner_group.preferredSize.width = 150;
        banner_group.orientation = "column";
        banner_group.alignChildren = ["fill", "top"];
        banner_group.spacing = 10;
        banner_group.margins = 0;
        banner_group.alignment = ["left", "fill"];
    var banner_panel = banner_group.add("panel", undefined, undefined, { name: artboard_data.name });
        banner_panel.text = artboard_data.name;
        banner_panel.orientation = "column";
        banner_panel.alignChildren = ["left", "top"];
        banner_panel.spacing = 10;
        banner_panel.margins = 10;
        banner_panel.alignment = ["fill", "top"];

        for (var i = 0, len = layers_.length; i < len; i++) {
            banner_dialog[layers_[i]] = banner_panel.add("checkbox", undefined, undefined, { name: layers_[i] });
            banner_dialog[layers_[i]].text =layers_[i];
            banner_dialog[layers_[i]].alignment = ["fill", "top"];
            banner_dialog[layers_[i]].value = layer_checkbox[i];
        }
  
    var button_group = banner_dialog.add("group");
    button_group.alignment = "right";
  
    var btnOk = button_group.add("button", undefined, undefined, { name: "ok" });
    btnOk.text = "OK";
    var btnCancel = button_group.add("button", undefined, undefined, { name: "cancel" });
    btnCancel.text = "Cancel";
  
    function updateParams() {
        for (var i = 0, len = layers_.length; i < len; i++) {
            layer_checkbox[i] = banner_dialog[layers_[i]].value;
        }
    };
  
    btnOk.onClick = function () {
      updateParams();
      banner_dialog.close(1);
    }
    banner_dialog.show();
  }
  function get_banner_asset(layer,artboard_data) {
    var new_position = {
        left_top: {x:0,y:0},
        left_middle:{x:0,y:0},
        left_bottom:{x:0,y:0},
        right_top: {x:0,y:0},
        right_middle:{x:0,y:0},
        right_bottom:{x:0,y:0},
        center_top: {x:0,y:0},
        center_middle:{x:0,y:0},
        center_bottom:{x:0,y:0},
    };
    var position_dialog = new Window('dialog {orientation: "row", alignChildren: [" ", "top"]}', "create new size", undefined, { closeButton: false, borderless: false });
    position_dialog.margins = [5, 5, 5, 5];
    position_dialog.alignChildren = "bottom";

    var position_group = position_dialog.add("group", undefined, { name: "group1" });
        position_group.preferredSize.width = 150;
        position_group.orientation = "column";
        position_group.alignChildren = ["fill", "top"];
        position_group.spacing = 10;
        position_group.margins = 0;
  
    var top_position_panel = position_group.add("panel");
        top_position_panel.orientation = "row";
        top_position_panel.alignment = "left";
        top_position_panel.add("statictext", undefined, "top : ");
    var top = top_position_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        top.active = true;
        top_position_panel.add("statictext", undefined, "t_left : ");
    var t_left = top_position_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        t_left.active = true;
        top_position_panel.add("statictext", undefined, "t_middle : ");
    var t_middle = top_position_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        t_middle.active = true;
        top_position_panel.add("statictext", undefined, "t_right : ");
    var t_right = top_position_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        t_right.active = true;

    var center_position_panel = position_group.add("panel");
        center_position_panel.orientation = "row";
        center_position_panel.alignment = "left";
        center_position_panel.add("statictext", undefined, "center : ");
    var center = center_position_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        center.active = true;
        center_position_panel.add("statictext", undefined, "c_left : ");
    var c_left = center_position_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        c_left.active = true;
        center_position_panel.add("statictext", undefined, "c_middle : ");
    var c_middle = center_position_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        c_middle.active = true;
        center_position_panel.add("statictext", undefined, "c_middle : ");
    var c_right = center_position_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        c_right.active = true;

    var bottom_position_panel = position_group.add("panel");
        bottom_position_panel.orientation = "row";
        bottom_position_panel.alignment = "left";
        bottom_position_panel.add("statictext", undefined, "bottom : ");
    var bottom = bottom_position_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        bottom.active = true;
        bottom_position_panel.add("statictext", undefined, "b_left : ");
    var b_left = bottom_position_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        b_left.active = true;
        bottom_position_panel.add("statictext", undefined, "b_middle : ");
    var b_middle = bottom_position_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        b_middle.active = true;
        bottom_position_panel.add("statictext", undefined, "b_middle : ");
    var b_right = bottom_position_panel.add("edittext", [0, 0, 200, 20], undefined, { multiline: false, scrolling: false });
        b_right.active = true;

    var button_group = position_dialog.add("group");
    button_group.alignment = "right";
  
    var btnOk = button_group.add("button", undefined, undefined, { name: "ok" });
    btnOk.text = "OK";
    var btnCancel = button_group.add("button", undefined, undefined, { name: "cancel" });
    btnCancel.text = "Cancel";
  
    function updateParams() {
        new_position.left_top.x = parseInt(t_left.text);
        new_position.left_top.y = parseInt(top.text);
        new_position.left_middle.x = parseInt(t_middle.text);
        new_position.left_middle.y = parseInt(top.text);
        new_position.left_bottom.x = parseInt(t_right.text);
        new_position.left_bottom.y = parseInt(top.text);

        new_position.center_top.x = parseInt(c_left.text);
        new_position.center_top.y = parseInt(center.text);
        new_position.center_middle.x = parseInt(c_middle.text);
        new_position.center_middle.y = parseInt(center.text);
        new_position.center_bottom.x = parseInt(c_right.text);
        new_position.center_bottom.y = parseInt(center.text);

        new_position.right_top.x = parseInt(b_left.text);
        new_position.right_top.y = parseInt(bottom.text);
        new_position.right_middle.x = parseInt(b_middle.text);
        new_position.right_middle.y = parseInt(bottom.text);
        new_position.right_bottom.x = parseInt(b_right.text);
        new_position.right_bottom.y = parseInt(bottom.text);

        banner_asset_data[layer] = new_position;
        for (var i = 0; i < position_header.length; i++) {
            _position.push({
                name : position_header[i],
                x:new_position[position_header[i]].x,
                y:new_position[position_header[i]].y,
            })
            
        }
        writeCsv(_position, layer)
    };
  
    btnOk.onClick = function () {
      updateParams();
      position_dialog.close(1);
    }
    position_dialog.show();
    return new_position;
  }
  function get_new_sizes(image_size,preferred_size_) {
    k = Math.min(preferred_size_[0] / image_size[0], preferred_size_[1] / image_size[1]);
    return [k * image_size[0], k * image_size[1]];
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