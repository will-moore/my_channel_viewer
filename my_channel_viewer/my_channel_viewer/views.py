from django.shortcuts import render
from django.core.urlresolvers import reverse

from omeroweb.decorators import login_required
from omeroweb.webclient import views as webclient_views
from omeroweb.webgateway import views as webgateway_views

#def getImageFromID(conn, idNumber):
    #print(idNumber)
    #img = conn.getObject('Image', idNumber)
    #displayed_images = []
    #displayed_images.append({'id': img.id, 'name': img.name})
    #return displayed_images

# login_required: if not logged-in, will redirect to webclient
# login page. Then back to here, passing in the 'conn' connection
# and other arguments **kwargs.


@login_required()
def getImageFromID():
    pass

@login_required()
def index(request, conn=None, **kwargs):

    image_ids = request.GET.getlist('image')
    images = conn.getObjects('Image', image_ids)

    image_data = []
    for image in images:
        image_data.append({
            'id': image.id,
            'name': image.name,
        })
    
    context = {
        'images': image_data,
    }

    # Render the html template and return the http response
    return render(request, 'my_channel_viewer/index.html', context)


#voir https://downloads.openmicroscopy.org/omero/5.5.0/api/python/omero/omero.gateway.html
