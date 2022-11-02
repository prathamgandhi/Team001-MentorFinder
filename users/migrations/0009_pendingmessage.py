# Generated by Django 4.1.2 on 2022-11-01 19:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_message'),
    ]

    operations = [
        migrations.CreateModel(
            name='PendingMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('mentee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.mentee')),
                ('mentor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.mentor')),
            ],
        ),
    ]