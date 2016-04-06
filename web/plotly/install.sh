# This uses the free BASIC version of plotlyjs which runs locally.
# From https://plot.ly/javascript/
wget https://cdn.plot.ly/plotly-latest.min.js

# Link it where the browser can see it 
here=$PWD
cd /var/lib/cloud9
ln -s $here .

# Load these to server them locally
wget https://code.jquery.com/jquery-2.2.3.min.js
mv jquery-2.2.3.min.js jquery.min.js
wget http://underscorejs.org/underscore-min.js
