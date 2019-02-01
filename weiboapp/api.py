from weiboapp.models import Link, Article, Tag, UserProfile, User
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage


class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email',)


class UserProfileDetaiSerializer(serializers.ModelSerializer):
    belong_to = UserSerializer(many=False, read_only=True)

    class Meta:
        model = UserProfile
        fields = ('belong_to', 'article',)
        depth = 2


class UserProfileSerializer(serializers.ModelSerializer):
    belong_to = UserSerializer(many=False, read_only=True)

    class Meta:
        model = UserProfile
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):
    owner = UserProfileSerializer(many=False, read_only=True)

    class Meta:
        model = Article
        fields = '__all__'
        depth = 1


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
    article_list_all = Article.objects.all().order_by('-add_date')
    article_list = page_robot(article_list, article_list_all, page)
    serializer = ArticleSerializer(article_list, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def user_detail(request, user_id):
    user_detail = UserProfile.objects.filter(id=user_id)
    serializer = UserProfileDetaiSerializer(user_detail, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def tag_list(request):
    tag_list = Tag.objects.all()
    serializer = TagSerializer(tag_list, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def article_list_tag(request, tag, page=None):
    article_list = {}
    article_list_all = Article.objects.filter(tag=tag).order_by('-add_date')
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
