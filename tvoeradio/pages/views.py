from annoying.decorators import render_to
from django.conf import settings
from django.http import Http404, HttpResponsePermanentRedirect
from django.template import Template, RequestContext
from django.shortcuts import get_object_or_404
from markitup.templatetags.markitup_tags import render_markup

from .models import Page


DEFAULT_TEMPLATE = 'flatpages/default.html'


@render_to()
def page(request, url):

    if not url.startswith('/'):
        url = '/' + url
    try:
        page = get_object_or_404(Page, url__exact=url)
    except Http404:
        if not url.endswith('/') and settings.APPEND_SLASH:
            url += '/'
            page = get_object_or_404(Page, url__exact=url)
            return HttpResponsePermanentRedirect('%s/' % request.path)
        else:
            raise

    return {
        'TEMPLATE': page.template_name or DEFAULT_TEMPLATE,
        'title': page.title,
        'content': render_markup(Template(page.content).render(RequestContext(request))),
    }
