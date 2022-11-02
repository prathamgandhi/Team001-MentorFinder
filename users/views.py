from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from rest_framework import status
from .serializers import RegisterMentorSerializer, RegisterMenteeSerializer, MyTokenObtainPairSerializer, MentorSerializer, MenteeInfoSerializer, NotesForMenteeSerializer, NotesForMentorSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from .models import CustomUser, Mentee, Mentor, Notes, PendingMessage

from django.db.models import Sum, Case, When, IntegerField, Q, F, Count
import sys 

CFRatingClassification = [1200, 1400, 1600, 1800, 2000]
CCRatingClassification = [1800, 2000, 2200, 2500]

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterMentor(generics.CreateAPIView):

    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = RegisterMentorSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.create(request.data)
            return Response({'Status' : 'Success'}, status=status.HTTP_201_CREATED)


class RegisterMentee(generics.CreateAPIView):

    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = RegisterMenteeSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.create(request.data)
            return Response({'Status' : 'Success'}, status=status.HTTP_201_CREATED)


class FormFill(APIView):

    permission_classes = (IsAuthenticated, )

    def patch(self, request):
        user = CustomUser.objects.filter(username=request.data['username'])
        if not user:
            return Response({'Status' : 'No such user exists'}, status=status.HTTP_404_NOT_FOUND)
        else:
            if user[0].is_mentee and not user[0].form_filled:
                temp_user = Mentee.objects.get(username=request.data['username'])
                serializer = RegisterMenteeSerializer(temp_user, data=request.data, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    temp_user.form_filled = True
                    temp_user.save()
            elif user[0].is_mentor and not user[0].form_filled:
                temp_user = Mentor.objects.get(username=request.data['username'])
                serializer = RegisterMentorSerializer(temp_user, data=request.data, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    temp_user.form_filled = True
                    temp_user.save()
        return Response({'Status' : 'Success'}, status=status.HTTP_204_NO_CONTENT)


class SearchMentors(APIView):

    permission_classes = (IsAuthenticated, )

    def get(self, request):
        curr_mentee = Mentee.objects.get(username=request.user.username)
        for r in CFRatingClassification:
            if curr_mentee.CFRank + 200 < r:
                lowerCFR = r
                break
            if r == 2000:
                lowerCFR = 2000
        upperCFR = 0        
        for r in CFRatingClassification:
            if r > curr_mentee.CFRank + 800:
                break
            if r == 2000:
                upperCFR = sys.maxsize
            upperCFR = r

        for r in CCRatingClassification:
            if curr_mentee.CCRank + 400 < r:
                lowerCCR = r
                break
            if r == 2500:
                lowerCCR = 2500

        upperCCR = 0
        for r in CCRatingClassification:
            if r > curr_mentee.CCRank + 1000:
                break
            if r == 2500:
                upperCCR = sys.maxsize
            upperCCR = r

        m = Mentor.objects.annotate(
            verdict=
                Case(When(Q(doesCP=curr_mentee.doesCP) & Q(doesCP=True), then=1), default=0, output_field=IntegerField(), ) +
                Case(When(Q(doesDev=curr_mentee.doesDev) & Q(doesDev=True), then=1), default=0, output_field=IntegerField(), ) + 
                Case(When(Q(doesApp=curr_mentee.doesApp) & Q(doesApp=True), then=1), default=0, output_field=IntegerField(), ) + 
                Case(When(Q(doesML=curr_mentee.doesML) & Q(doesML=True), then=1), default=0, output_field=IntegerField(), ) +
                Case(When(Q(doesWeb=curr_mentee.doesWeb) & Q(doesWeb=True), then=1), default=0, output_field=IntegerField(), )
            ).filter(((Q(doesDev=curr_mentee.doesDev) & Q(doesDev=True)) | (((Q(CFRank__gte=lowerCFR) & Q(CFRank__lte=upperCFR)) | (Q(CCRank__gte=lowerCCR) & Q(CCRank__lte=upperCCR))))) & Q(form_filled=True)).order_by('verdict', 'CFRank', 'CCRank')

        serializer = MentorSerializer(m, many=True)
        data = serializer.data
        return Response(data, status=status.HTTP_200_OK)

    
class Ratings(APIView):

    permission_classes = (IsAuthenticated, )

    def post(self, request):
        mentor = Mentor.objects.get(username=request.data['mentor_username'])
        mentor.ratings = ((mentor.ratings*mentor.total_ratings)+request.data['rating'])/(mentor.total_ratings+1)
        mentor.total_ratings += 1
        mentor.save()
        return Response({'Status' : 'Success'}, status=status.HTTP_201_CREATED)

class RequestMentor(APIView):

    permission_classes = (IsAuthenticated, )

    def post(self, request):
        if not request.data['mentor_username']:
            return Response({'Status' : 'Error', 'Issue' : 'mentor_username not sent'}, status=status.HTTP_400_BAD_REQUEST)
        if not request.data['message']:
            return Response({'Status' : 'Error', 'Issue' : 'message not sent'}, status=status.HTTP_400_BAD_REQUEST)
        mentee = Mentee.objects.get(username=request.user.username)
        mentor = Mentor.objects.get(username=request.data['mentor_username'])
        mentee.pending_requests.add(mentor)
        PendingMessage.objects.create(mentor=mentor, mentee=mentee, message=request.data['message'])
        return Response({'Status' : 'Success'}, status=status.HTTP_201_CREATED)

class AcceptMentee(APIView):

    permission_classes = (IsAuthenticated, )

    def post(self, request):
        mentor = Mentor.objects.get(username=request.user.username)
        mentee = Mentee.objects.get(username=request.data['mentee_username'])
        mentee.mentor_assigned = mentor
        mentee.pending_requests.remove(mentor)
        mentee.save()
        PendingMessage.objects.filter(mentor=mentor, mentee=mentee).delete()
        return Response({'Status' : 'Success'}, status=status.HTTP_204_NO_CONTENT)

class ShowPendingRequests(APIView):

    permission_classes = (IsAuthenticated, )

    def get(self, request):
        mentor = Mentor.objects.get(username = request.user.username)
        serializer = MenteeInfoSerializer(mentor.mentee_set.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RejectMentee(APIView):

    permission_classes = (IsAuthenticated, )

    def post(self, request):
        mentor = Mentor.objects.get(username=request.user.username)
        mentee = Mentee.objects.get(username=request.data['mentee_username'])
        mentee.pending_requests.remove(mentor)
        mentee.save()
        PendingMessage.objects.filter(mentor=mentor, mentee=mentee).delete()
        return Response({'Status' : 'Success'}, status=status.HTTP_204_NO_CONTENT)

class GenerateNotes(APIView):

    permission_classes = (IsAuthenticated, )

    def post(self, request):
        mentor = Mentor.objects.get(username=request.user.username)
        mentee_usernames = request.data['mentee_usernames']
        mentees = Mentee.objects.filter(username__in=mentee_usernames)
        note = request.data['note']
        n = Notes.objects.create(mentor=mentor, notes=note)
        n.mentee.add(*mentees)
        mentor = Mentor.objects.get(username=request.user.username)
        notes = Notes.objects.filter(mentor=mentor, mentee__in=mentees)
        serializer = NotesForMentorSerializer(notes, many=True)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def get(self, request):
        user = CustomUser.objects.get(username=request.user.username)
        if user.is_mentor:
            mentor = Mentor.objects.get(username=request.user.username)
            notes = Notes.objects.filter(mentor=mentor)
            serializer = NotesForMentorSerializer(notes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            mentee = Mentee.objects.get(username=request.user.username)
            serializer = NotesForMenteeSerializer(mentee.mentee_notes_rev.all(), many=True)
            print(type(serializer.data))
            return Response(serializer.data, status=status.HTTP_200_OK)