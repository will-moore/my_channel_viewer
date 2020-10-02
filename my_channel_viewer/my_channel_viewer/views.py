from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.views.decorators.http import require_POST
from django.http import HttpResponse

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

    # We can load data from OMERO via Blitz Gateway connection.
    # See https://docs.openmicroscopy.org/latest/omero/developers/Python.html
    experimenter = conn.getUser()

    projects_list = []
    # for project in conn.listProjects():
    #     project_dict_item = {}
    #     project_dict_item['project_id'] = project.getId()
    #     project_dict_item['project_name'] = project.getName()
    #     project_dict_item['project_datasets'] = []
    #     for dataset in project.listChildren():
    #         dataset_dict_item = {}
    #         dataset_dict_item['dataset_id'] = dataset.getId()
    #         dataset_dict_item['dataset_name'] = dataset.getName()
    #         dataset_dict_item['dataset_images'] = []
    #         for image in dataset.listChildren():
    #             image_dict_item = {}
    #             image_dict_item['image_id'] = image.getId()
    #             image_dict_item['image_name'] = image.getName()
    #             dataset_dict_item['dataset_images'].append(image_dict_item)
    #         project_dict_item['project_datasets'].append(dataset_dict_item)
    #     projects_list.append(project_dict_item)

    #listed_datasets = list(conn.getObjects('Dataset', params["IDs"])) #list() permet de convertir l'objet datasets en liste -> permet d'afficher les identifiants

    #render('my_channel_viewer/index.html', {'projects', projects_list})

    # A dictionary of data to pass to the html template
    context = {'firstName': experimenter.firstName,
               'lastName': experimenter.lastName,
               'experimenterId': experimenter.id,
               'projects': projects_list}
    #print("CONTEXT", context)

    #dataset_id = request.GET.get('dataset', None)
    print("Start")

    #val = request.GET.getlist('projects')
    #val = request.GET.get('submit_image')
    print("***Request GET parameters***: "+str(request.GET))
    print("***Request POST parameters***: "+str(request.POST))
    #val = request.POST.get('Image_dropdown')
    #print("val: ", val)

    #image_id = request.GET.get('Image_dropdown', None)

    #Ne fonctionne que si une image est déjà chargée dans l'URL
    #(ex: http://127.0.0.1:4080/my_channel_viewer/?Image_dropdown=333&submit_image=Submit+image).
    #Le QueryDict est vide sinon.
    #image_id = webclient_views.get_list(request, 'Image_dropdown')
    selected_images_IDs = webclient_views.get_list(request, 'image')
    selected_images_IDs_integers = []
    selected_images = []
    for string_id in selected_images_IDs:
        int_id = int(string_id)
        selected_images_IDs_integers.append(int_id)
        selected_image = conn.getObject('Image', int_id)
        #selected_images.append({'id': selected_image.id, 'name': selected_image.name})
        selected_images.append(selected_image)
    context['selected_images'] = selected_images
    #idNumber = int(selected_images_IDs_integers[0])
    #print(idNumber)
    #img = conn.getObject('Image', idNumber)
    #currently_displayed_image_id = webclient_views.get_list(request, 'Selected_images_dropdown')
    #print("XXX: "+str(currently_displayed_image_id))

    #https://docs.openmicroscopy.org/omero-blitz/5.5.2/slice2html/omero/model/Channel.html
    images_channels = {}
    for image in selected_images:
        channels = image.getChannels()
        images_channels['main_channel'] = channels
        channels_pixels = []
        for channel in channels:
            channelPixels = channel.getPixels() #voir getWindowMax() dans gateway/_init_.py
            channels_pixels.append(channelPixels)
        images_channels['pixels'] = channels_pixels

    #voir https://docs.openmicroscopy.org/omero-blitz/5.5.2/javadoc/omero/model/Pixels.html
    #ne pas chercher à avoir texto les valeurs des pixels, voir comment l'image est rendue sur le navigateur, pour voir comment transposer les réglages

    context['image_channels'] = images_channels
    #dataset_id = request.GET.get('dataset', 213)
    #print("DATASET_ID"+str(dataset_id))
    #dataset = conn.getObject('Dataset', dataset_id)
    #images = []
    #for img in dataset.listChildren():
        #images.append({'id': img.id, 'name': img.name})
    #context['images'] = images



    """
    if request.method == ["GET"]:
        a = request.GET['Image_dropdown']
        print(a)
    else:
        return render(request, 'my_channel_viewer/index.html', context)
    #image_id = request.GET.get('image', None)
    #print(image_id)
    #img = conn.getObject('Image', image_id)
    """

    """

    """

    # print can be useful for debugging, but remove in production
    print('context', context)

    # Render the html template and return the http response
    return render(request, 'my_channel_viewer/index.html', context)


@require_POST
@login_required()
def handle_submit(request, conn=None, **kwargs):

    selected_image = request.POST.get('selected_image')
    print('selected_image', selected_image)

    image = conn.getObject('Image', selected_image)

    for ch_index in range(image.getSizeC()):
        color = request.POST.get('color_%s' % ch_index)
        lut = request.POST.get('lut_%s' % ch_index)
        print(ch_index, color, lut)


    return HttpResponse("Thankyou")
#voir https://downloads.openmicroscopy.org/omero/5.5.0/api/python/omero/omero.gateway.html
