# Nice instructions: http://beagleboard.org/project/bbb-lcd-fbtft-prebuilt/
# Driver appears to be already installed.
# Wiring:
# Vcc   3.3V
# Gnd   Gnd
# SCL   P9_31
# SDA   P9_30
# D/C   P9_42
# RES   P9_41
# CS    Gnd
# Need to unconfigure GPIOs used for Reset and D/C. 
# Edit /opt/source/bb.org-overlays/src/arm/univ-emmc-00A0.dts and remove references
# to P9_41 and P9_42 (and P9.41 and P9.42)
# You can do this with the patch file
cp removeP9_4142.patch /tmp
cd /opt/source/bb.org-overlays
git checkout -b removeP9_4142
git apply /tmp/removeP9_4142.patch
make install
# reboot
# source setup.sh to config-pin P9_41 and P9_42

# This is for RES to P9_41and D/C to P9_42
modprobe fbtft_device busnum=2 name=adafruit18 debug=7 verbose=3 gpios=dc:7,reset:20

# This is for RES to P8_45 and D/C to P8_46
modprobe fbtft_device busnum=2 name=sainsmart18 debug=1 verbose=1 gpios=dc:71,reset:70
# The Adafruit LCD (https://www.adafruit.com/products/358) is 128x160

export FRAMEBUFFER=/dev/fb0

apt install fbi
 
wget https://kernel.org/theme/images/logos/tux.png
wget http://www.rose-hulman.edu/InstituteBrandResources/RH_Graphic_Secondary.zip

fbi -noverbose -T 1 -a tux.png
# This worked

apt install mplayer
 
wget http://hubblesource.stsci.edu/sources/video/clips/details/images/hst_1.mpg
 
mplayer -nolirc -vo fbdev:/dev/fb0 scale=WIDTH:128 hst_1.mpg

This didn't work.

apt install fbset
fbset

