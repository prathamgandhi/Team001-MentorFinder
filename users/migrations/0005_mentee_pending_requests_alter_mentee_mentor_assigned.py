# Generated by Django 4.1.2 on 2022-10-30 17:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_mentor_starrating_mentor_total_ratings'),
    ]

    operations = [
        migrations.AddField(
            model_name='mentee',
            name='pending_requests',
            field=models.ManyToManyField(to='users.mentor'),
        ),
        migrations.AlterField(
            model_name='mentee',
            name='mentor_assigned',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='mentor_assigned_set', to='users.mentor'),
        ),
    ]