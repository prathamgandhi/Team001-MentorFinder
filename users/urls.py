from django.urls import path
from .views import RegisterMentor, RegisterMentee, MyTokenObtainPairView, FormFill, SearchMentors, Ratings, RequestMentor, AcceptMentee, RejectMentee, ShowPendingRequests, GenerateNotes
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registermentor/', RegisterMentor.as_view(), name='register_mentor'),
    path('registermentee/', RegisterMentee.as_view(), name='register_mentee'),
    path('fillform/', FormFill.as_view(), name='fill_form'),
    path('searchmentors/', SearchMentors.as_view(), name='search_mentors'),
    path('rate/', Ratings.as_view(), name='rate'),
    path('requestmentor/', RequestMentor.as_view(), name='request_mentor'),
    path('acceptmentee/', AcceptMentee.as_view(), name='accept_mentee'),
    path('rejectmentee/', RejectMentee.as_view(), name='reject_mentee'),
    path('showpending/', ShowPendingRequests.as_view(), name='show_pending_requests'),
    path('generatenotes/', GenerateNotes.as_view(), name='create_notes'),
]
