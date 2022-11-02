from rest_framework import serializers
from .models import Mentor, Mentee, PendingMessage, Notes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super(MyTokenObtainPairSerializer, self).validate(attrs)
        data.update({'form_filled' : self.user.form_filled})
        data.update({'username' : self.user.username})
        data.update({'is_mentor' : self.user.is_mentor})
        if not self.user.is_mentor:
            mentee = Mentee.objects.get(username=self.user.username)
            serializer = MentorSerializer(mentee.mentor_assigned)
            data.update({'mentor_assigned' : serializer.data})
        if self.user.is_mentor:
            mentor = Mentor.objects.get(username=self.user.username)
            pending_serializer = PendingMessageSerializer(PendingMessage.objects.filter(mentor=mentor), many=True)
            mentee_assigned_serializer = MenteeInfoNotesSerializer(Mentee.objects.filter(mentor_assigned=mentor), many=True)
            data.update({'pending_messages' : pending_serializer.data})
            data.update({'mentee_assigned' : mentee_assigned_serializer.data})
        return data


class MenteeInfoNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentee
        fields = ('username', )

class MentorInfoNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentor
        fields = ('username', )

class MenteeInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mentee
        fields = '__all__'


class NotesForMentorSerializer(serializers.ModelSerializer):

    mentee = MenteeInfoNotesSerializer(read_only=True, many=True)

    class Meta:
        model = Notes
        exclude = ('mentor', )    

class NotesForMenteeSerializer(serializers.ModelSerializer):

    mentor_info = serializers.SerializerMethodField('get_mentor_info')

    class Meta:
        model = Notes
        exclude = ('mentee', 'mentor')

    def get_mentor_info(self, obj):
        return obj.mentor.username

class PendingMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingMessage
        exclude = ('mentor', )

class RegisterMentorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentor
        fields = '__all__'

    def create(self, validated_data):

        password = serializers.CharField(write_only=True)

        user = Mentor.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            branch=validated_data['branch'],
            phone_number=validated_data['phone_number'],
            is_mentor=True,
        )

        return user

class RegisterMenteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentee
        fields = '__all__'

    def create(self, validated_data):
        password = serializers.CharField(write_only=True)

        user = Mentee.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            branch=validated_data['branch'],
            phone_number=validated_data['phone_number'],
            is_mentee=True,
        )

        return user


class MenteeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mentee
        fields = ['username', ]



class MentorSerializer(serializers.ModelSerializer):

    mentees = serializers.SerializerMethodField()

    class Meta:
        model = Mentor
        exclude = ('password', )

    def get_mentees(self, obj):
        mentees = obj.mentee_set.all()
        response = MenteeSerializer(mentees, many=True).data
        return response