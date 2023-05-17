import elevation
import os, sys, subprocess

# dem_path = '/static/assets/test.tif'
# output = os.getcwd() + dem_path

# elevation.clip(bounds=(38.7082, -77.3637, 38.7810, -77.3094), output=output)


file_list = []
for f in os.listdir('.'):
    if os.path.splitext(f)[1] == '.tif':
        file_list.append(f)

print (file_list)

for f in file_list:    
    out_filename = '/Users/estebangarcia/Documents/DevelopmentMonitorsLLC/Code/DevMonIntern/test/' + os.path.splitext(f)[0] + '.bin'
    command_str = 'gdal_translate {in_filename} {out_filename}'.format(in_filename="/Users/estebangarcia/Documents/DevelopmentMonitorsLLC/Code/DevMonIntern"+f, out_filename=out_filename)
    print(command_str)
    p = subprocess.Popen(command_str)
    p.wait()