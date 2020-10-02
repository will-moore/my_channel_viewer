from django.conf.urls import url

from . import views

urlpatterns = [

    # index 'home page' of the app
    url(r'^$', views.index, name='my_channel_viewer_index'),
    #url(r'^webclient/', views.index, name='my_channel_viewer_index'),

    url(r'^handle_submit/$', views.handle_submit, name='my_channel_viewer_handle_submit'),
]
