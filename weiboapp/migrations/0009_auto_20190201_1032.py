# Generated by Django 2.1.2 on 2019-02-01 02:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('weiboapp', '0008_auto_20190201_1018'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='nickname',
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='user',
        ),
    ]