from django.db import models
import django.utils.timezone as timezone


# Create your models here.
class Link(models.Model):
    name = models.CharField('标题', null=True, blank=True, max_length=30)
    src = models.CharField('链接', null=True, blank=True, max_length=50)
    icon = models.CharField('icon', null=True, blank=True, max_length=30)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField('标签名', max_length=30)

    def __str__(self):
        return self.name


class Article(models.Model):
    content = models.TextField('正文', null=True, blank=True, max_length=200)
    tag = models.ManyToManyField('Tag', verbose_name='标签集合', blank=True)
    add_date = models.DateTimeField('保存日期', default=timezone.now)

