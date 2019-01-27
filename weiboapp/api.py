from weiboapp.models import Link, Article, Tag
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage


class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


@api_view(['GET'])
def link_list(requst):
    link_list = Link.objects.all()
    serializer = LinkSerializer(link_list, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def article_detail(request, post):
    article_detail = Article.objects.filter(id=post)
    serializer = ArticleSerializer(article_detail, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def article_list(request, page):
    article_list = {}
    article_list_all = Article.objects.all().order_by('add_date')
    article_list = page_robot(article_list, article_list_all, page)
    serializer = ArticleSerializer(article_list, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def tag_list(request):
    tag_list = Tag.objects.all()
    serializer = TagSerializer(tag_list, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def article_list_tag(request, tag, page=None):
    article_list = {}
    article_list_all = Article.objects.filter(tag=tag).order_by('add_date')
    article_list = page_robot(article_list, article_list_all, page)
    serializer = ArticleSerializer(article_list, many=True)
    return Response(serializer.data)


def page_robot(article_list, article_list_all, page):
    article_list_all = Paginator(article_list_all, 3)
    try:
        article_list = article_list_all.page(page)
    except PageNotAnInteger:
        article_list = article_list_all.page(1)
    except EmptyPage:
        article_list = article_list_all.page(
            article_list_all.num_pages)
    return article_list
