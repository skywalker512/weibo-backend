from django.contrib import admin
from weiboapp.models import Link, Article, Tag, UserProfile
# Register your models here.

admin.site.register(Link)
admin.site.register(Article)
admin.site.register(Tag)
admin.site.register(UserProfile)
