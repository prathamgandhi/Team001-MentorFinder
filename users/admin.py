from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Mentor, Mentee

# Register your models here.

admin.site.register(CustomUser, UserAdmin)
admin.site.register(Mentor)
admin.site.register(Mentee)

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display='__all__'