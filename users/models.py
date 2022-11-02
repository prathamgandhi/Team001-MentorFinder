from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

from .managers import CustomUserManager

BRANCH_CHOICES = [
    ("CSE", "CSE"),
    ("IT", "IT"),
    ("ECE", "ECE"),
    ("ELE", "ELE"),
    ("CHE", "CHE"),
    ("MME", "MME"),
    ("BIOTECH", "BIOTECH"),
    ("BIOMED", "BIOMED"),
]

LANGUAGES = [
    ("C++", "C++"),
    ("JAVA", "JAVA"),
    ("PYTHON", "PYTHON"),
    ("JAVASCRIPT", "JAVASCRIPT"),
    ("KOTLIN", "KOTLIN"),
    ("DART", "DART"),
    ("R", "R"),
]

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password', 'username']


    branch = models.CharField(max_length=20, choices=BRANCH_CHOICES)
    phone_number = PhoneNumberField(blank=False)

    CCRank = models.IntegerField(default=0)
    CFRank = models.IntegerField(default=0)
    doesCP = models.BooleanField(default=False)
    doesDev = models.BooleanField(default=False)
    doesWeb = models.BooleanField(default=False)
    doesApp = models.BooleanField(default=False)
    doesML = models.BooleanField(default=False)
    languages = models.TextField(default="")

    form_filled = models.BooleanField(default=False)
    is_mentor = models.BooleanField(default=False)
    is_mentee = models.BooleanField(default=False)
    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name='CustomUser'


class Mentor(CustomUser):
    starrating = models.FloatField(default=0)
    total_ratings = models.IntegerField(default=0)
    objects = CustomUserManager()
    
    class Meta:
        verbose_name='Mentor'


class Mentee(CustomUser):
    mentor_assigned = models.ForeignKey(Mentor, null=True, blank=True, on_delete=models.SET_NULL, related_name='mentor_assigned_set')
    pending_requests = models.ManyToManyField(Mentor, blank=True)
    objects = CustomUserManager()
    
    class Meta:
        verbose_name='Mentee'


class Notes(models.Model):
    mentee = models.ManyToManyField(Mentee, blank=True, related_name="mentee_notes_rev")
    notes = models.TextField()
    mentor = models.ForeignKey(Mentor, null = True, blank=True, on_delete=models.SET_NULL, related_name='mentor_notes_set')

class PendingMessage(models.Model):
    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE)
    mentee = models.ForeignKey(Mentee, on_delete=models.CASCADE)
    message = models.TextField()