# Generated by Django 4.1.2 on 2022-11-01 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_alter_notes_mentee'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notes',
            name='mentee',
            field=models.ManyToManyField(blank=True, related_name='mentee_notes_rev', to='users.mentee'),
        ),
    ]
