#Package import
from flask import Flask, render_template, url_for, Response, redirect, request, flash ,jsonify, send_file, session
from flask_wtf import FlaskForm
from wtforms import FileField, SubmitField
from flask_wtf.file import FileAllowed, FileRequired
from werkzeug.utils import secure_filename
import elevation, sys, os, subprocess, logging
import json, re
import requests
from osgeo import gdal, ogr, osr
from flask_cors import CORS
import urllib.request
from sentinelsat import SentinelAPI, read_geojson, geojson_to_wkt, make_path_filter
import cv2
from geojson import Point, Feature, FeatureCollection, dump, Polygon
import fiona
import rasterio
from rasterio.mask import mask
from rasterio.plot import show
from colorama import Fore, Style
import shutil
import geopandas as gpd
import osmnx as ox
#from wtforms.validators import InputRequired
#initialise app
app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'secretkey'
app.config['UPLOAD_FOLDER'] = 'static'


class UploadFileForm(FlaskForm):
    dsmFile = FileField("dsm", validators=[FileRequired(), FileAllowed(['tif', 'tiff'], 'Tif files only')])
    orthophotoFile = FileField("orthophoto", validators=[FileRequired(), FileAllowed(['tif', 'tiff'], 'Tif files only')])
    submit = SubmitField("Upload Files")

#decorator for homepage 
@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')
        

@app.route('/Taiz')
def taiz():
    return render_template('taiz.html')

@app.route('/Aden')
def aden():
    return render_template('aden.html')

@app.route('/testingGeoJson')
def gJson():
    return render_template('test.html')

@app.route('/Sub_basin18')
def subBasin():
    return render_template('subbasin.html',conditional=True)

@app.route('/basin18')
def subBasin18():
    return render_template('subbasin18.html',conditional=True)

@app.route("/droneflight")
def get_droneflightinfo():
    

    print(Fore.GREEN + "Creating orthophoto.png file" + Style.RESET_ALL)
    orthophoto = gdal.Open("static/odm_orthophoto.tif")
    widthOrthophoto = orthophoto.RasterXSize
    heightOrthophoto = orthophoto.RasterYSize
    if widthOrthophoto > 8000:
        subprocess.run(['gdal_translate', '-scale', '0', '255', '0', '255','-outsize', '8000', str(heightOrthophoto / widthOrthophoto * 8000),'-of', 'PNG', 'static/odm_orthophoto.tif', 'static/orthophoto.png'])
    else:
        subprocess.run(['gdal_translate', '-scale', '0', '255', '0', '255','-of', 'PNG', 'static/odm_orthophoto.tif', 'static/orthophoto.png'])

    
    print(Fore.GREEN + "Creating dsm.bin file" + Style.RESET_ALL)
    dsm = gdal.Open("static/dsm.tif")
    widthDsm = dsm.RasterXSize
    heightDsm = dsm.RasterYSize
    
    dsm_gtrn = dsm.GetGeoTransform()
    dsm_proj = dsm.GetProjectionRef()
    dsm_srs = osr.SpatialReference(dsm_proj)
    geo_srs =dsm_srs.CloneGeogCS()   # new srs obj to go from x,y -> φ,λ
    transform = osr.CoordinateTransformation( dsm_srs, geo_srs)

    dsm_bbox_cells = (
        (0., 0.),
        (0, dsm.RasterYSize),
        (dsm.RasterXSize, dsm.RasterYSize),
        (dsm.RasterXSize, 0),
    )

    geo_pts = []
    for x, y in dsm_bbox_cells:
        x2 = dsm_gtrn[0] + dsm_gtrn[1] * x + dsm_gtrn[2] * y
        y2 = dsm_gtrn[3] + dsm_gtrn[4] * x + dsm_gtrn[5] * y
        geo_pt = transform.TransformPoint(x2, y2)[:2]
        geo_pts.append(geo_pt)

    print(geo_pts)
    lat = (geo_pts[0][0]+geo_pts[1][0]+geo_pts[2][0]+geo_pts[3][0])/4
    lon = (geo_pts[0][1]+geo_pts[1][1]+geo_pts[2][1]+geo_pts[3][1])/4

    lats = [geo_pts[0][0],geo_pts[1][0],geo_pts[2][0],geo_pts[3][0]]
    lons = [geo_pts[0][1],geo_pts[1][1],geo_pts[2][1],geo_pts[3][1]]

    lats = sorted(lats)
    lons = sorted(lons)
    print(lats)
    print(lons)

    min_lat = lats[0]
    max_lat = lats[3]
    min_lon = lons[0]
    max_lon = lons[3]

    global drone_box
    drone_box = [min_lat,max_lat,min_lon,max_lon]

    

    band = dsm.GetRasterBand(1)
    min = band.GetMinimum()
    max = band.GetMaximum()
    if not min or not max:
        (min,max) = band.ComputeRasterMinMax()
    print(min,max)
    min -= 1
    max += 1
    
    subprocess.run(['gdal_translate', '-scale', str(min), str(max), '0', '65535', '-ot', 'UInt16','-outsize', '96', str(heightDsm / widthDsm * 96),'-of', 'ENVI', 'static/dsm.tif', 'static/dsm.bin'])

    global drone_segments
    drone_segments = [96, heightDsm / widthDsm * 96]

    #Delete files:
    subprocess.run(['rm', 'static/dsm.tif', 'static/odm_orthophoto.tif'])

    return render_template('droneflight.html', lat=lat, lon=lon)


@app.route("/elevation", methods = ["GET"])
def get_elevation():
    min_lat = request.args.get("min_lat")
    min_lon = request.args.get("min_lon")
    max_lat = request.args.get("max_lat")
    max_lon = request.args.get("max_lon")
    global b_box
    b_box = [min_lat,max_lat,min_lon,max_lon]

    url = "https://portal.opentopography.org/API/globaldem?demtype=SRTMGL3&south={}&north={}&west={}&east={}&outputFormat=GTiff&API_Key={}".format(min_lat, max_lat, min_lon, max_lon, "3f466b0e55730d62f19a37da500748ab")
    print(url)
    headers = {'Authorization': 'Bearer YOUR_API_KEY'}

    response = requests.get(url, headers=headers)

    with open("elevation.tif", "wb") as f:
        f.write(response.content)

    ds = gdal.Open('elevation.tif')
    band = ds.GetRasterBand(1)
    min = band.GetMinimum()
    max = band.GetMaximum()
    if not min or not max:
        (min,max) = band.ComputeRasterMinMax()
    print(min,max)

    newMin = min-1
    newMax = max+1
    subprocess.run(['gdal_translate', '-scale', str(newMin), str(newMax), '0', '65535', '-ot', 'UInt16','-of', 'ENVI', 'elevation.tif', 'static/output.bin'])
    return send_file('elevation.tif', mimetype='image/tif')

@app.route("/buildings", methods = ["GET"])
def get_buildings():
    cwd = os.getcwd()
    print(cwd)

    print(Fore.GREEN + "OSMNX Dependencies Loaded" + Style.RESET_ALL)

    tags = {"building": True}

    gdf = ox.geometries_from_bbox(b_box[1], b_box[0], b_box[3], b_box[2], tags)
    # print(gdf.shape)

    b_footprints = cwd + '/static/buildings.geojson'

    print(Fore.GREEN + "Generating GeoJSON File" + Style.RESET_ALL)
    gdf_save = gdf.applymap(lambda x: str(x) if isinstance(x, list) else x)
    gdf_save.drop(labels="nodes", axis=1).to_file(b_footprints, driver="GeoJSON")
    print(Fore.GREEN + "Footprints Saved as GeoJSON" + Style.RESET_ALL)
    return 'fetched buildings'

@app.route("/risklayer", methods = ["GET"])
def get_risklayer():
    subprocess.run(['gdalwarp', '-te', str(b_box[2]), str(b_box[0]), str(b_box[3]), str(b_box[1]), '-ts', '512','512', 'flood.tif', 'static/risk.tif'])
    subprocess.run(['gdaldem', 'color-relief', 'static/risk.tif', '-alpha', '-nearest_color_entry', 'color.txt','static/relief.tif'])
    subprocess.run(['gdal_translate', '-of', 'PNG', 'static/relief.tif', 'static/relief.png'])
    subprocess.run(['gdal_translate', '-scale', '-1', '1000', '0', '65535', '-ot', 'UInt16', '-outsize', '96', '96' ,'-of', 'ENVI', 'static/risk.tif', 'static/risk.bin'])
    return 'created risklayers'


@app.route("/satelite", methods = ["GET"])
def get_satelite():

    print(Fore.GREEN + "Importing Dependencies" + Style.RESET_ALL)    
    cwd = os.getcwd()
    download = cwd+'/download'
    print(Fore.GREEN + "Running Sentinel API Query for Given BBOX" + Style.RESET_ALL)
    api = SentinelAPI('joelrhyine', 'Sentinel@DM2021')
    p1 = Point((float(b_box[2]), float(b_box[1])))
    p2 = Point((float(b_box[2]), float(b_box[0])))
    p3 = Point((float(b_box[3]), float(b_box[0])))
    p4 = Point((float(b_box[3]), float(b_box[1])))
    p5 = Point((float(b_box[2]), float(b_box[1])))
    polygon = Polygon([[p1, p2, p3, p4, p5]])
    features = []
    features.append(Feature(geometry=polygon))
    feature_collection = FeatureCollection(features)
    with open('gjson.geojson', 'w') as f:
        dump(feature_collection, f)
    gjson_path = cwd+'/gjson.geojson'
    area = geojson_to_wkt(read_geojson(gjson_path))
    area
    products = api.query(area,
                         area_relation = "Contains",
                         date = ("20220101","NOW"),
                         platformname = 'Sentinel-2',
                         limit = 5,
                         cloudcoverpercentage = (0,10),
                         order_by = ("cloudcoverpercentage, -beginposition")
    
    )
    products_df = api.to_dataframe(products)
    if products_df.empty:
        products = api.query(area,
                     date = ("20220101","NOW"),
                     platformname = 'Sentinel-2',
                     limit = 5,
                     cloudcoverpercentage = (0,30),
                     order_by = ("cloudcoverpercentage, -beginposition")

    )
    products_df = api.to_dataframe(products)
    df_len = len(products_df)

    for p in range (0,df_len):
        index = products_df.index[p]
        odata = api.get_product_odata(index)
        p_footprint = odata['footprint']
        print(p_footprint)

    # path_filter = make_path_filter("*GRANULE/*/IMG_DATA/*TCI.jp2")
    path_filter = make_path_filter("*TCI.jp2")
    #api.download_all(products_df.index, directory_path = download ,nodefilter=path_filter)
    print(Fore.GREEN + "Downlaoding Queried Product" + Style.RESET_ALL)
    api.download(products_df.index[0], directory_path = download, nodefilter=path_filter)

    os.chdir(download)
    r1 = os.listdir(os.chdir(download))[1]
    r2 = os.listdir(os.chdir(r1))[1]
    r3 = os.listdir(os.chdir(r2))[0]
    r4 = os.listdir(os.chdir(r3))[0]
    r5 = os.listdir(os.chdir(r4))[0]
    os.chdir(cwd)
    os.getcwd()
    img_path = cwd + "/download" +"/"+ r1 +"/" + r2 +"/" + r3 +"/" + r4 +"/" + r5
    img_dir = cwd + "/download" +"/"+ r1 +"/" + r2 +"/" + r3 +"/" + r4 
    img_path
    
    
    os.chdir(img_dir)
    
    subprocess.run(["gdalinfo", img_path])
    otif = img_dir + "/tci.tif"
    subprocess.run(["gdal_translate", img_path, otif])
    subprocess.run(["gdalwarp", "-t_srs", "EPSG:4326", otif, "tci-4326.tif"])
    subprocess.run(["gdalinfo", "tci-4326.tif"])
        
    os.chdir(cwd)

    print(Fore.GREEN + "Converting to JPEG" + Style.RESET_ALL)
    input_file = img_dir + "/tci-4326.tif"
    output_file = img_dir + "/cropped-to-bbox.tif"
    cmd = f"gdalwarp -te {b_box[2]} {b_box[0]} {b_box[3]} {b_box[1]} -ts 512 512 {input_file} {output_file}"

    # Execute the command
    subprocess.run(["gdalwarp", "-te", str(b_box[2]), str(b_box[0]), str(b_box[3]), str(b_box[1]), "-ts", "512", "512", str(input_file), str(output_file)])
    os.chdir(img_dir)
    subprocess.run(["gdal_translate", "-of", "JPEG", "cropped-to-bbox.tif", "cropped-to-bbox.jpg"])
    print(Fore.GREEN + "JPEG Ready" + Style.RESET_ALL)
    
    
    source = img_dir
    destination = cwd +"/static"
    files = os.listdir(source)
    file_name = "cropped-to-bbox"

    for file_name in files:
        if file_name.endswith('.jpg') or file_name.endswith('.png'):
            source_file = os.path.join(source, file_name)
            destination_file = os.path.join(destination, file_name)
            shutil.move(source_file, destination_file)
    os.chdir(cwd)
    os.getcwd()


    #delete files in download folder
    os.chdir(cwd)
    os.getcwd()
    folder_path = cwd + "/download" +"/"+ r1 
    subprocess.run(["rm", "-r", folder_path])
    print(Fore.GREEN + "Deleted files in donwload folder" + Style.RESET_ALL)
    print(Fore.GREEN + "Ready to render terrain" + Style.RESET_ALL)
    return 'ready to render'

@app.route("/dem", methods=["GET"])
def get_dem():
    
    min_lat = request.args.get("min_lat")
    min_lon = request.args.get("min_lon")
    max_lat = request.args.get("max_lat")
    max_lon = request.args.get("max_lon")
    global b_box
    b_box = [min_lat,max_lat,min_lon,max_lon]

    url = "https://portal.opentopography.org/API/globaldem?demtype=SRTMGL3&south={}&north={}&west={}&east={}&outputFormat=GTiff&API_Key={}".format(min_lat, max_lat, min_lon, max_lon, "3f466b0e55730d62f19a37da500748ab")
    print(url)
    headers = {'Authorization': 'Bearer YOUR_API_KEY'}

    response = requests.get(url, headers=headers)

    with open("elevation.tif", "wb") as f:
        f.write(response.content)

    ds = gdal.Open('elevation.tif')
    band = ds.GetRasterBand(1)
    min = band.GetMinimum()
    max = band.GetMaximum()
    if not min or not max:
        (min,max) = band.ComputeRasterMinMax()
    print(min,max)

    newMin = min-1
    newMax = max+1
    subprocess.run(['gdal_translate', '-scale', str(newMin), str(newMax), '0', '65535', '-ot', 'UInt16','-of', 'ENVI', 'elevation.tif', 'static/output.bin'])
    

    ####Fetching Buildings######

    cwd = os.getcwd()
    print(cwd)

    print(Fore.GREEN + "OSMNX Dependencies Loaded" + Style.RESET_ALL)

    tags = {"building": True}

    gdf = ox.geometries_from_bbox(max_lat, min_lat, max_lon, min_lon, tags)
    # print(gdf.shape)

    b_footprints = cwd + '/static/buildings.geojson'

    print(Fore.GREEN + "Generating GeoJSON File" + Style.RESET_ALL)
    gdf_save = gdf.applymap(lambda x: str(x) if isinstance(x, list) else x)
    gdf_save.drop(labels="nodes", axis=1).to_file(b_footprints, driver="GeoJSON")
    print(Fore.GREEN + "Footprints Saved as GeoJSON" + Style.RESET_ALL)

    #fig, ax = ox.plot_footprints(gdf)

    #############################RISK LAYER###########################

    subprocess.run(['gdalwarp', '-te', str(min_lon), str(min_lat), str(max_lon), str(max_lat), '-ts', '512','512', 'flood.tif', 'static/risk.tif'])
    subprocess.run(['gdaldem', 'color-relief', 'static/risk.tif', '-alpha', '-nearest_color_entry', 'color.txt','static/relief.tif'])
    subprocess.run(['gdal_translate', '-of', 'PNG', 'static/relief.tif', 'static/relief.png'])
    risk_translate = 'gdal_translate -scale -1 1000 0 65535 -ot UInt16 -outsize 96 96 -of ENVI static/risk.tif static/risk.bin'
    #subprocess.run(risk_translate)
    subprocess.run(['gdal_translate', '-scale', '-1', '1000', '0', '65535', '-ot', 'UInt16', '-outsize', '96', '96' ,'-of', 'ENVI', 'static/risk.tif', 'static/risk.bin'])
        
        
    ######Satellite Imagery####
    print(Fore.GREEN + "Importing Dependencies" + Style.RESET_ALL)    
    cwd = os.getcwd()
    download = cwd+'/download'
    print(Fore.GREEN + "Running Sentinel API Query for Given BBOX" + Style.RESET_ALL)
    api = SentinelAPI('joelrhyine', 'Sentinel@DM2021')
    p1 = Point((float(min_lon), float(max_lat)))
    p2 = Point((float(min_lon), float(min_lat)))
    p3 = Point((float(max_lon), float(min_lat)))
    p4 = Point((float(max_lon), float(max_lat)))
    p5 = Point((float(min_lon), float(max_lat)))
    polygon = Polygon([[p1, p2, p3, p4, p5]])
    features = []
    features.append(Feature(geometry=polygon))
    feature_collection = FeatureCollection(features)
    with open('gjson.geojson', 'w') as f:
        dump(feature_collection, f)
    gjson_path = cwd+'/gjson.geojson'
    area = geojson_to_wkt(read_geojson(gjson_path))
    area
    products = api.query(area,
                         area_relation = "Contains",
                         date = ("20220101","NOW"),
                         platformname = 'Sentinel-2',
                         limit = 5,
                         cloudcoverpercentage = (0,10),
                         order_by = ("cloudcoverpercentage, -beginposition")
    
    )
    products_df = api.to_dataframe(products)
    if products_df.empty:
        products = api.query(area,
                     date = ("20220101","NOW"),
                     platformname = 'Sentinel-2',
                     limit = 5,
                     cloudcoverpercentage = (0,30),
                     order_by = ("cloudcoverpercentage, -beginposition")

    )
    products_df = api.to_dataframe(products)
    df_len = len(products_df)

    for p in range (0,df_len):
        index = products_df.index[p]
        odata = api.get_product_odata(index)
        p_footprint = odata['footprint']
        print(p_footprint)

    # path_filter = make_path_filter("*GRANULE/*/IMG_DATA/*TCI.jp2")
    path_filter = make_path_filter("*TCI.jp2")
    #api.download_all(products_df.index, directory_path = download ,nodefilter=path_filter)
    print(Fore.GREEN + "Downlaoding Queried Product" + Style.RESET_ALL)
    api.download(products_df.index[0], directory_path = download, nodefilter=path_filter)

    os.chdir(download)
    r1 = os.listdir(os.chdir(download))[1]
    r2 = os.listdir(os.chdir(r1))[1]
    r3 = os.listdir(os.chdir(r2))[0]
    r4 = os.listdir(os.chdir(r3))[0]
    r5 = os.listdir(os.chdir(r4))[0]
    os.chdir(cwd)
    os.getcwd()
    img_path = cwd + "/download" +"/"+ r1 +"/" + r2 +"/" + r3 +"/" + r4 +"/" + r5
    img_dir = cwd + "/download" +"/"+ r1 +"/" + r2 +"/" + r3 +"/" + r4 
    img_path
    
    
    os.chdir(img_dir)
    
    subprocess.run(["gdalinfo", img_path])
    otif = img_dir + "/tci.tif"
    subprocess.run(["gdal_translate", img_path, otif])
    subprocess.run(["gdalwarp", "-t_srs", "EPSG:4326", otif, "tci-4326.tif"])
    subprocess.run(["gdalinfo", "tci-4326.tif"])
        
    os.chdir(cwd)
    #print(Fore.GREEN + "Cropping to BBOX" + Style.RESET_ALL)
    ##aoi = fiona.open("sana-city-2.geojson")
    #crop = rasterio.open(img_dir+"/tci-4326.tif")
    ## aoiGeom = aoi[0]['geometry']
    #with fiona.open(gjson_path, "r") as shapefile:
    #    shapes = [geometry["coordinates"] for features in shapefile]
    #outImage, outTransform = mask(crop, shapes, crop=True)
    #outMeta = crop.meta
    #outMeta.update({"driver": 'GTiff',
    #                 "height": outImage.shape[1],
    #                 "width": outImage.shape[2],
    #                 "transform": outTransform})
    #
    #def crop_img_func (img_dir, outMeta, outImage):
    #    os.chdir(img_dir)
    #    outRaster = rasterio.open("cropped-to-bbox.tif", "w", **outMeta)
    #    outRaster.write(outImage)
    #
    #crop_img_func(img_dir, outMeta, outImage)
    #crop_img_func(img_dir, outMeta, outImage)
    #
    print(Fore.GREEN + "Converting to JPEG" + Style.RESET_ALL)
    input_file = img_dir + "/tci-4326.tif"
    output_file = img_dir + "/cropped-to-bbox.tif"
    cmd = f"gdalwarp -te {min_lon} {min_lat} {max_lon} {max_lat} -ts 512 512 {input_file} {output_file}"

    # Execute the command
    #subprocess.run(cmd, shell=True, check=True)
    subprocess.run(["gdalwarp", "-te", str(min_lon), str(min_lat), str(max_lon), str(max_lat), "-ts", "512", "512", str(input_file), str(output_file)])
    os.chdir(img_dir)
    subprocess.run(["gdal_translate", "-of", "JPEG", "cropped-to-bbox.tif", "cropped-to-bbox.jpg"])
    print(Fore.GREEN + "JPEG Ready" + Style.RESET_ALL)
    
    
    source = img_dir
    destination = cwd +"/static"
    files = os.listdir(source)
    file_name = "cropped-to-bbox"

    for file_name in files:
        if file_name.endswith('.jpg') or file_name.endswith('.png'):
            source_file = os.path.join(source, file_name)
            destination_file = os.path.join(destination, file_name)
            shutil.move(source_file, destination_file)
    os.chdir(cwd)
    os.getcwd()


    #delete files in download folder
    os.chdir(cwd)
    os.getcwd()
    folder_path = cwd + "/download" +"/"+ r1 
    subprocess.run(["rm", "-r", folder_path])
    print(Fore.GREEN + "Deleted files in donwload folder" + Style.RESET_ALL)
    print(Fore.GREEN + "Ready to render terrain" + Style.RESET_ALL)
    return send_file('elevation.tif', mimetype='image/tif')
    

@app.route('/dynamic', methods=['GET', 'POST'])
def dynamics():
    form = UploadFileForm()
    if form.validate_on_submit():
        print(Fore.GREEN + "Uploading ODM files" + Style.RESET_ALL)
        dsmFile = form.dsmFile.data # grab the file
        #print(dsmFile)
        dsmFile.save(os.path.join(os.path.abspath(os.path.dirname(__file__)), app.config['UPLOAD_FOLDER'], secure_filename("dsm.tif"))) #save the file
        orthophotoFile = form.orthophotoFile.data # grab the file
        orthophotoFile.save(os.path.join(os.path.abspath(os.path.dirname(__file__)), app.config['UPLOAD_FOLDER'], secure_filename("odm_orthophoto.tif"))) #save the file
        print(Fore.GREEN + "Uploaded ODM files" + Style.RESET_ALL)
        return redirect(url_for('get_droneflightinfo'))
    return render_template('dynamic.html', form=form)

@app.route('/dRender')
def dRender():
    return render_template('dynamicRender.html',min_lat=b_box[0], max_lat=b_box[1], min_lon=b_box[2], max_lon=b_box[3])

@app.route('/dRenderDrone')
def dRenderDrone():
    return render_template('dynamicRenderDrone.html',min_lat=b_box[0], max_lat=b_box[1], min_lon=b_box[2], max_lon=b_box[3], min_lat_drone=drone_box[0], max_lat_drone=drone_box[1],min_lon_drone=drone_box[2],max_lon_drone=drone_box[3], segmentX_drone=drone_segments[0], segmentY_drone=drone_segments[1])
    #return render_template('dynamicRenderDrone.html')



# run the app.
if __name__ == "__main__":
    app.debug = True

    app.run(host="0.0.0.0",port=8080)
